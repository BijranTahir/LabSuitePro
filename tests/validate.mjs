import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const root=new URL('..',import.meta.url).pathname;
const context=vm.createContext({window:{addEventListener(){}}, console});
for(const file of ['data/science-methods.js','data/calculators.js','data/buffers.js','app.js','data/bio-science.js']){
  const src=fs.readFileSync(root+file,'utf8');
  vm.runInContext(src,context,{filename:file});
}
vm.runInContext('this.__export={TOOLS,OPS,BIO_FIELDS,BIO_CALCS,SCIENCE_METHODS,CALCULATORS,BUFFERS};',context);
const {TOOLS,OPS,BIO_FIELDS,BIO_CALCS,SCIENCE_METHODS,CALCULATORS,BUFFERS}=context.__export;

assert(TOOLS.length>0);
assert(CALCULATORS.length===359,'Recovered calculator catalog must remain 359 entries');
assert(BUFFERS.length===133,'Recovered buffer catalog must remain 133 entries');
assert.equal(BUFFERS.filter(x=>!x.name||!x.type||!x.use||!x.pH||!x.notes).length,0,'Buffer metadata must be complete');
assert.equal(BUFFERS.length-new Set(BUFFERS.map(x=>x.name)).size,0,'Buffer names must be unique');
assert(SCIENCE_METHODS.length>0);
assert(BIO_FIELDS.length>=30,'Biological field coverage regressed');
assert(Object.keys(BIO_CALCS).length>=60,'Biological calculation coverage regressed');

const catalogNames=new Set(CALCULATORS.map(x=>x.name));
const implementedWithoutEngine=TOOLS.filter(t=>t.status==='implemented' && !OPS[t.name] && !catalogNames.has(t.name));
assert.equal(implementedWithoutEngine.length,0,`Implemented modules without executable OPS: ${implementedWithoutEngine.map(x=>x.name).join(', ')}`);

function close(a,b,tol=1e-9){assert(Math.abs(a-b)<=tol,`${a} != ${b}`)}
close(OPS['Molarity'].run({moles:1,volume_L:2}).M,0.5);
close(OPS['Stokes-Einstein'].run({k_B:1,T_K:1,viscosity_Pa_s:1,radius_m:1}).D,1/(6*Math.PI));
close(OPS['qPCR ΔΔCt'].run({'ΔCt_sample':3,'ΔCt_control':1}).foldChange,0.25);
close(OPS['NDVI'].run({NIR:0.8,Red:0.2}).NDVI,0.6);
close(OPS['Scherrer Crystallite Size'].run({K:0.9,lambda_nm:0.154,beta_rad:0.01,theta_rad:0.5}).size_nm,0.9*0.154e-9/(0.01*Math.cos(0.5))*1e9);
close(BIO_CALCS['Hardy-Weinberg'].run({p:0.6}).Aa,0.48);
close(BIO_CALCS['Shannon Diversity'].run({counts:'10,10'}).H,Math.log(2));

const instrumentMethods=SCIENCE_METHODS.filter(x=>x.type==='instrument_method');
assert(instrumentMethods.length>=20);
for(const m of instrumentMethods){
  assert.equal(m.phone,'analysis_only',`${m.name} must not claim phone measurement`);
  assert(m.needs && m.what && m.how && m.why,`${m.name} missing method reality metadata`);
}

console.log(JSON.stringify({
  status:'PASS',
  calculators:CALCULATORS.length,
  buffers:BUFFERS.length,
  tools:TOOLS.length,
  biologicalFields:BIO_FIELDS.length,
  biologicalCalculations:Object.keys(BIO_CALCS).length,
  methodRecords:SCIENCE_METHODS.length,
  instrumentMethods:instrumentMethods.length,
  implementedWithoutEngine:implementedWithoutEngine.length
},null,2));
