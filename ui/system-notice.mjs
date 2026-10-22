// Display-only game notices. Rules are supplied by the caller, never inferred
// from Bara dialogue, a tier label, or a random result in this component.
import {esc} from './wheel-geometry.mjs';
import {measuredLines,readableTextLines,textAdvance} from './audit-layout.mjs';

export const SYSTEM_NOTICE_LAYOUT={x:100,y:475,width:780,maxHeight:625,bodySize:36,lineHeight:43};
export function paginateSystemNotice(notice){
 if(notice?.voice!=='system'||!notice.title||!notice.rows?.length)throw Error('A system notice needs explicit rules and voice.');
 const width=704,pages=[];let rows=[],used=0;
 const flush=()=>{if(rows.length){pages.push({rows});rows=[];used=0;}};
 for(const row of notice.rows){
  if(!row.label||!row.text)throw Error('Empty system rule row.');
  const lines=measuredLines(row.text,width,36);
  if(lines.some(s=>textAdvance(s,36)>width+.5))throw Error('System rule contains an unbreakable word.');
  // A long rule flows across pages without shrinking or dropping text.
  for(let offset=0;offset<lines.length;){
   let capacity=Math.floor((415-used-53)/43);
   if(capacity<1){flush();capacity=8;}
   const chunk=lines.slice(offset,offset+capacity),height=53+43*chunk.length;
   rows.push({label:row.label+(offset?' · LANJUTAN':''),text:chunk.join(' '),lines:chunk});used+=height;offset+=chunk.length;
  }
 }
 flush();
 return pages.map((page,index)=>{
  const words=[notice.title,...page.rows.map(r=>r.text)].join(' ').split(/\s+/).length;
  const bodyWords=page.rows.map(r=>r.text).join(' ').split(/\s+/).length;
  return {...page,voice:'system',title:notice.title,index,total:pages.length,
   presentation:notice.presentation??'concurrent',
   duration:notice.readingProfile==='concise'?Math.max(2.3,.25+bodyWords/5):notice.readingProfile==='short'?Math.max(2.6,.4+bodyWords/4):Math.max(3.2,1+words/3.6),height:Math.max(365,205+page.rows.reduce((n,r)=>n+53+43*r.lines.length,0))};
 });
}
export function renderSystemNotice(page,{veil=true}={}){
 const {x,y,width}=SYSTEM_NOTICE_LAYOUT,h=page.height;
 if(h>625)throw Error('System notice exceeds its reserved area.');
 let body=veil?`<rect x="70" y="360" width="840" height="${page.presentation==='concurrent'?740:900}" rx="24" fill="#061014" opacity=".72"/>`:'';
 body+=`<g data-system-notice="true" data-voice="system" aria-label="Sistem: ${esc(page.title)}">
 <rect x="${x+5}" y="${y+8}" width="${width}" height="${h}" rx="18" fill="#000" opacity=".35"/>
 <rect x="${x}" y="${y}" width="${width}" height="${h}" rx="18" fill="#111c21" stroke="#8bbeb5" stroke-width="2"/>
 <path d="M${x} ${y+24}V${y+17}Q${x} ${y} ${x+17} ${y}H${x+94}" fill="none" stroke="#bddbd2" stroke-width="4"/>
 <g transform="translate(${x+46} ${y+44})" fill="none" stroke="#b9d8cf" stroke-width="2"><path d="M0-17L15-9V9L0 17L-15 9V-9Z"/><path d="M-6 0L-1 5L7-5"/></g>
 <text x="${x+79}" y="${y+51}" fill="#b9d8cf" font-size="24" font-weight="700" letter-spacing="3">SISTEM</text>
 <text x="${x+width-36}" y="${y+51}" text-anchor="end" fill="#92a8a5" font-size="21">ATURAN RODA${page.total>1?' · '+(page.index+1)+'/'+page.total:''}</text>
 <path d="M${x+36} ${y+76}H${x+width-36}" stroke="#52756f" stroke-opacity=".6"/>`;
 const title=measuredLines(page.title,704,38);
 if(title.length>1)throw Error('Use a concise system rule title.');
 body+=readableTextLines(title,{x:x+38,y:y+126,size:38,color:'#f2e4c9'});
 let ry=y+172;
 for(const row of page.rows){
  body+=`<text x="${x+38}" y="${ry}" fill="#c1a470" font-size="22" font-weight="700" letter-spacing="1.5">${esc(row.label)}</text>`;
  body+=readableTextLines(row.lines,{x:x+38,y:ry+39,size:36,lineHeight:43,color:'#e5e9df'});
  ry+=53+43*row.lines.length;
 }
 body+=`<path d="M${x+36} ${y+h-27}H${x+width-36}" stroke="#52756f" stroke-opacity=".45"/></g>`;
 return body;
}
