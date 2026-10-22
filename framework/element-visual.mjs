import design from '../content/element-visual-design.json' with {type:'json'};

/** Presentation-only art direction, never another identity/spin/grant. */
export function getElementVisual(elementId,bodyKind='overlay'){
 const p=design.profiles.find(p=>p.id===elementId);
 if(!p)throw new Error('Unknown canonical element: '+elementId);
 if(!['overlay','elemental','golem','slime'].includes(bodyKind))throw new Error('Unknown element body kind: '+bodyKind);
 return {...structuredClone(p),version:design.version,bodyKind,visualBrief:bodyKind==='overlay'?p.overlay:p.body[bodyKind],grantsMechanics:false};
}
