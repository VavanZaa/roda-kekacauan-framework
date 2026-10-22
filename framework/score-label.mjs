// Presentation only. Keep the exact signed score for mechanics and gate checks.
export const FINAL_SCORE_LABEL_VERSION='final-score-label/1';
export function formatFinalScoreLabel(value,scale,{labels={}}={}){
 if(!Number.isSafeInteger(value))throw new RangeError('Final score must be an exact signed integer.');
 const minimum=scale?.minimumDrawValue,maximum=scale?.maximumDrawValue;
 if(!Number.isSafeInteger(minimum)||!Number.isSafeInteger(maximum)||minimum>maximum||!Array.isArray(scale?.outcomes))throw new Error('An explicit raw score scale is required.');
 const labelValue=value<minimum?minimum:value>maximum?maximum:value;
 const rows=scale.outcomes.filter(o=>o.value===labelValue);
 if(rows.length!==1)throw new Error('Missing or ambiguous score label: '+labelValue);
 const label=labels[labelValue]??rows[0].label;
 if(typeof label!=='string'||!label.trim())throw new Error('Configure the display label for score '+labelValue+'.');
 if(value>maximum)return label+'+'+(value-maximum);
 if(value<minimum)return label+(value-minimum);
 return label;
}
