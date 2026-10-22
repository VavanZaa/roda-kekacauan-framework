// Rasterize our own code-authored SVG assets for QA; no browser or image model.
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url),packageRoot=process.env.RODA_NODE_PACKAGES;
if(!packageRoot)throw new Error('Set RODA_NODE_PACKAGES to a verified installed package directory.');
const sharp=require(packageRoot+'/sharp');
const themes=[['race','RAS / JADE & PERUNGGU'],['weapon','WEAPON / TEMPA BESI'],['power','POWER / ARTEFAK UNGU'],['chaos','KEKACAUAN / BARA TAKDIR']];
let body='<rect width="1584" height="828" fill="#0c1012"/>';
for(const[[id,label],i]of themes.map((t,i)=>[t,i])){
  const raw=await readFile(new URL(['weapon','power'].includes(id)?'assets/proposals/'+id+'/compact.svg':'assets/'+id+'/composite.svg',import.meta.url),'utf8');
  const svg=raw.replace(/\sid="([^"]+)"/g,(_,name)=>` id="sheet-${id}-${name}"`).replace(/url\(#([^)]+)\)/g,(_,name)=>`url(#sheet-${id}-${name})`).replace('<svg ','<svg x="'+(24+i*390)+'" y="80" ').replace('width="1080" height="1920"','width="366" height="650.6667"');
  body+=`<text x="${24+i*390}" y="53" font-family="Segoe UI,Arial,sans-serif" fill="#e8e1d1" font-size="17" letter-spacing="1">${label.replaceAll('&','&amp;')}</text>`+svg;
}
body+='<text x="24" y="790" font-family="Segoe UI,Arial,sans-serif" fill="#9faf9f" font-size="19">RODA KEKACAUAN · Mesin takdir · Contoh frame SVG dalam 16 lapisan</text>';
const sheet=`<svg xmlns="http://www.w3.org/2000/svg" width="1584" height="828" viewBox="0 0 1584 828">${body}</svg>`;
await writeFile(new URL('assets/contact-sheet.svg',import.meta.url),sheet);
await sharp(Buffer.from(sheet)).png().toFile(fileURLToPath(new URL('assets/contact-sheet.png',import.meta.url)));
await sharp(await readFile(new URL('assets/race/composite.svg',import.meta.url))).resize({width:648}).png().toFile(fileURLToPath(new URL('assets/race-preview.png',import.meta.url)));
console.log('Static SVG contact sheet and race preview rendered.');
