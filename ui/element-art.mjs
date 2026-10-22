import {ELEMENT_VISUALS} from './element-visuals.mjs';
import {esc,polar} from './wheel-geometry.mjs';
// Code-native symbols extend the existing SVG wheel layers; concept art stays in the atlas.
const glyphs={
 fire:'M0-33Q24-9 12 8Q30-4 27 16Q22 36 0 36Q-27 32-26 9Q-26-4-11-21Q-15 5-2 6Q7-6 0-33Z',
 water:'M0-35Q34 3 29 17Q23 36 0 36Q-26 35-29 15Q-32 2 0-35Z M-16 13Q-17 25-6 27',
 earth:'M-32 20L-21-19L5-30L30-8L28 26L-9 34Z M-21-19L-8 5L30-8M-8 5L-9 34M-8 5L-32 20',
 wind:'M-35-15H12Q37-15 32-30Q24-42 15-31 M-35 0H32 M-35 15H11Q33 15 28 31Q21 42 12 30',
 lightning:'M6-36L-24 7H-3L-11 36L28-13H5Z',
 ice:'M0-36V36M-31-18L31 18M-31 18L31-18M-10-27L0-17L10-27M-10 27L0 17L10 27M-29-5L-14-8L-17-23M29 5L14 8L17 23M-29 5L-14 8L-17 23M29-5L14-8L17-23',
 metal:'M-26-27H18L32-9V26H-15L-30 8Z M-26-27L-15-9H32M-15-9V26M18-27L32-9',
 plant:'M-27 30L26-27Q-8-41-27-11Q-40 8-27 30Z M-27 30L18-19M-17 15L-21-4M-4 2L13 6',
 light:'M15 0A15 15 0 1 1-15 0A15 15 0 1 1 15 0M0-37V-24M0 24V37M-37 0H-24M24 0H37M-26-26L-17-17M17 17L26 26M-26 26L-17 17M17-17L26-26',
 darkness:'M14-31Q-13-34-27-10Q-38 17-10 31Q13 44 31 18Q10 27-3 12Q-20-10 14-31Z',
 shadow:'M-31 25L-15 3L-24-7L-2-31L17-17L4-3L31 7L14 31Z M-10 15L4 4L17 11',
 void:'M33 0A33 25 0 1 1-33 0A33 25 0 1 1 33 0 M17 0A17 13 0 1 0-17 0A17 13 0 1 0 17 0M-40-23L-32-30M35 25L42 31',
};
export function elementIcon(id,x,y,size,color){if(!glyphs[id])throw new Error('Unknown Element icon: '+id);return `<g data-element-icon="${esc(id)}" transform="translate(${x} ${y}) scale(${size/80})" fill="none" stroke="${color}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="${glyphs[id]}"/></g>`;}
export function decorateElementLayers(plan,options,rendered){
 if(plan.wheelId!=='element-universal')return rendered;
 const profiles=new Map(ELEMENT_VISUALS.map(p=>[p.id,p]));
 for(const o of plan.outcomes){const p=profiles.get(o.id);if(!p)continue;
  rendered.layers['05-sectors']=rendered.layers['05-sectors'].replace(new RegExp(`(data-outcome-id="${o.id}"[^>]*fill=")[^"]+`),`$1${p.sectorColor}`);
  const [x,y]=polar(490,785,147,o.mid-90);
  rendered.layers['06-labels']=rendered.layers['06-labels'].replace(/<\/g>$/,elementIcon(o.id,x,y,34,p.accent)+'</g>');
 }
 const chosen=profiles.get(options.resultId);
 if(chosen){const hub=rendered.layers['07-hub'],start=hub.indexOf('<g class="attribute-icon"'),end=hub.indexOf('<text x="490" y="865"');
  if(start<0||end<start)throw new Error('Missing attribute hub structure');
  rendered.layers['07-hub']=hub.slice(0,start)+`<g class="attribute-icon" data-motif="element">${elementIcon(chosen.id,490,776,106,chosen.accent)}</g>`+hub.slice(end);}
 return rendered;
}
