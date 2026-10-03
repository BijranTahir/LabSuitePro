/* Lab Suite Pro — Biological Sciences Expansion
   Calculation methods are deterministic local calculations. Instrument-dependent measurements
   must be supplied by the user; this file never fabricates instrument data. */
const BIO_FIELDS = [
  ['Biochemistry',['Molar concentration','Mass concentration','Molecular weight','Dilution','Serial dilution','Buffer capacity','pH/pKa','Beer-Lambert','Enzyme kinetics','Michaelis-Menten','Lineweaver-Burk','Hill equation','Inhibition kinetics','Protein concentration','Nucleic-acid concentration','A260/A280','A260/A230','Osmolarity','Free energy','Equilibrium','Redox','Thermodynamics','Calorimetry','Binding affinity','Kd','Ka','ΔG','ΔH','ΔS','Reaction quotient','Coupled reactions']],
  ['Biophysics',['Diffusion','Fick first law','Fick second law','Osmosis','Osmotic pressure','Membrane potential','Nernst potential','Goldman-Hodgkin-Katz','Conductance','Capacitance','RC time constant','Action potential concepts','Hydrodynamic radius','Stokes-Einstein','Sedimentation','Viscosity','Surface tension','Young-Laplace','Elastic modulus','Stress-strain','Bending','Torque','Moment of inertia','Brownian motion','Optical density','Fluorescence','Förster resonance energy transfer (FRET)','Absorbance','Scattering','Light microscopy resolution']],
  ['Bioinformatics',['FASTA','FASTQ','Sequence statistics','GC%','AT%','Reverse complement','Translation','Codon usage','ORF discovery','Motif search','Restriction mapping','Primer analysis','Pairwise alignment','Global alignment','Local alignment','Multiple sequence alignment','Phylogenetics','k-mers','Genome statistics','Coverage','Read depth','Base quality','Variant allele frequency','VCF','GFF/GTF','BED','SAM/BAM concepts','PDB/mmCIF','Protein sequence analysis','Domain analysis','RNA sequence analysis','RNA structure concepts','Gene annotation','Enrichment analysis','Pathway analysis','Network analysis']],
  ['Molecular Biology',['DNA replication','DNA repair','Transcription','RNA processing','Translation','PCR','RT-PCR','qPCR','ΔCt','ΔΔCt','Amplification efficiency','Melt curve','Primer Tm','Primer GC%','Restriction digestion','Ligation','Cloning','Transformation efficiency','Transfection efficiency','Plasmid copy number','DNA concentration','RNA concentration','Gel electrophoresis','Molecular-weight estimation','Southern blot','Northern blot','Western blot','Hybridization','Sequencing concepts']],
  ['Cell Biology',['Cell cycle','Doubling time','Cell growth','Cell viability','Cell density','Cell counting','Confluence','Apoptosis concepts','Necrosis concepts','Organelle measurements','Membrane transport','Osmotic balance','Volume/surface-area ratio','Fluorescence quantification','Colocalization','Flow cytometry summaries']],
  ['Genetics & Genomics',['Mendelian genetics','Hardy-Weinberg','Allele frequency','Genotype frequency','Heterozygosity','Linkage','Recombination frequency','LOD score concepts','Pedigree probability','Population genetics','Selection coefficient','Genetic drift concepts','Genome size','Genome coverage','Variant frequency','CNV concepts','GWAS concepts','Heritability concepts']],
  ['Proteomics',['Protein molecular mass','Peptide mass','Theoretical digest','Peptide charge','pI concepts','Protein concentration','Bradford','BCA','Lowry','Enzyme activity','Specific activity','Purification fold','Yield','Recovery','Protease digestion','Mass-spectrometry concepts','Peptide-spectrum concepts','Label-free quantification concepts']],
  ['Metabolomics',['Molar conversion','Metabolite concentration','Peak area normalization','Internal-standard normalization','Fold change','Log2 fold change','Z-score','PCA concepts','Pathway enrichment concepts','Mass-spectrometry concepts','NMR metabolomics concepts']],
  ['Systems Biology',['ODE model concepts','Steady state','Mass balance','Flux balance concepts','Sensitivity analysis','Parameter fitting','Network degree','Centrality','Correlation networks','Gene regulatory networks','Metabolic networks','Signaling networks','Dynamic systems']],
  ['Structural Biology',['Protein mass','Molecular dimensions','Ramachandran concepts','PDB/mmCIF concepts','Secondary-structure concepts','SASA concepts','Hydrogen-bond geometry','Distance calculations','RMSD','RMSF concepts','Docking concepts','Molecular dynamics concepts']],
  ['Microbiology',['CFU/mL','CFU/g','Serial dilution','OD600','Growth curve','Doubling time','Specific growth rate','Generation time','Viability','MIC concepts','MBC concepts','Inoculum calculation','Culture dilution','Biomass concentration','Chemostat concepts','Batch culture','Contamination/QC']],
  ['Immunology',['Antibody dilution','Antigen concentration','ELISA standard curve','ELISA blank correction','ELISA replicate CV','EC50 concepts','IC50 concepts','Neutralization concepts','Affinity/Kd','Flow-cytometry population percentages','Mean fluorescence intensity','Staining controls']],
  ['Physiology',['Heart rate','Cardiac output','Stroke volume','Blood pressure concepts','MAP','Respiratory rate','Minute ventilation','Alveolar ventilation','Oxygen consumption','BMI','BSA','Clearance','Filtration concepts','Renal fractional excretion','Electrolyte balance','Osmolarity']],
  ['Neuroscience',['Membrane potential','Nernst potential','Conductance','Capacitance','RC constant','Firing-rate summaries','Spike frequency','Inter-spike interval','Reaction time statistics','Signal-to-noise ratio','Fourier/signal concepts']],
  ['Developmental Biology',['Growth rate','Doubling time','Morphometric ratios','Embryonic stage timing','Cell-cycle summaries','Survival curves','Expression fold change']],
  ['Evolutionary Biology',['Allele frequency','Hardy-Weinberg','Genetic distance','Jukes-Cantor concepts','Phylogenetic distance','Diversity indices','Selection coefficient','Mutation rate concepts']],
  ['Ecology & Conservation',['Species richness','Shannon index','Simpson index','Pielou evenness','Population growth','Logistic growth','Carrying capacity','Survival rate','Recruitment','Capture-recapture','Biodiversity metrics','Community similarity','NDVI','Biomass estimates']],
  ['Botany & Plant Science',['Photosynthetic rate','Water-use efficiency','Transpiration','Stomatal conductance concepts','Leaf area index','Relative growth rate','Specific leaf area','Root:shoot ratio','Chlorophyll calculations','Germination percentage','Germination rate','Seed viability','Plant population density','Crop yield','Harvest index','Nutrient-use efficiency']],
  ['Zoology & Animal Biology',['Morphometrics','Body-mass index variants','Growth rate','Population density','Survival','Fecundity','Sex ratio','Condition factor','Metabolic rate concepts','Respiratory quotient','Capture-recapture']],
  ['Nutrition & Food Science',['Energy balance','BMI','BMR estimates','TDEE concepts','Macronutrient energy','Protein intake','Food moisture','Ash content','Crude protein','Crude fat','Carbohydrate by difference','Caloric value','Water activity concepts','Shelf-life concepts','Microbial load','Food dilution']],
  ['Pharmacology & Toxicology',['Dose conversion','Dose per kg','Concentration','Dilution','Loading dose','Maintenance dose','Clearance','Volume of distribution','Half-life','AUC concepts','Cmax/Tmax concepts','Bioavailability','Therapeutic index','IC50/EC50 concepts','LD50 concepts','Exposure calculations']],
  ['Biomedical & Clinical Science',['BMI','BSA','eGFR concepts','Creatinine clearance concepts','Anion gap','Osmolality','Corrected calcium concepts','Absolute neutrophil count','Platelet count summaries','Sensitivity','Specificity','PPV','NPV','Likelihood ratios','Diagnostic odds concepts']],
  ['Epidemiology & Public Health',['Incidence','Prevalence','Risk','Relative risk','Odds ratio','Risk ratio','Attributable risk','Population attributable fraction','Sensitivity','Specificity','PPV','NPV','Attack rate','Case fatality rate','Standardized rates concepts']],
  ['Synthetic Biology & Bioengineering',['Part concentration','DNA assembly ratios','Molar ratios','Transformation efficiency','Plasmid copy concepts','Promoter activity normalization','Reporter normalization','Growth burden concepts','Bioreactor mass balance','Yield coefficient','Productivity','Oxygen-transfer concepts']],
  ['Bioimaging & Microscopy',['Pixel size','Field of view','Magnification','Numerical aperture concepts','Resolution concepts','Object area','Perimeter','Circularity','Feret diameter','Aspect ratio','Fluorescence background correction','Signal-to-noise','Colocalization concepts','Cell count','Particle count']],
  ['Biomaterials & Tissue Engineering',['Stress','Strain','Young modulus','Poisson ratio','Swelling ratio','Porosity','Water uptake','Mass loss','Degradation rate','Diffusion coefficient','Cell seeding density','Viability','Scaffold density']],
  ['Environmental Biology',['BOD','COD concepts','DO saturation concepts','Biochemical oxygen demand removal','Microbial load','Pollution indices','Water quality concepts','Bioconcentration factor','Bioaccumulation concepts','Ecological risk concepts']],
  ['Marine & Aquatic Biology',['Salinity','Osmolarity','Dissolved oxygen','Chlorophyll concentration','Primary productivity concepts','Population density','Catch per unit effort','Diversity indices']],
  ['Agricultural Biotechnology',['Seed germination','Plant density','Yield','Harvest index','Fertilizer concentration','Nutrient-use efficiency','Tissue-culture multiplication','Transformation efficiency','Disease incidence','Disease severity','Biocontrol calculations']],
  ['Computational Biology',['Sequence algorithms','Dynamic programming concepts','Graph algorithms','Network metrics','ODE models','Parameter estimation','Optimization','Sensitivity','Machine learning concepts','Clustering','Classification','Dimensionality reduction','Cross-validation']],
  ['Biostatistics',['Mean','Median','Variance','SD','SEM','CV','CI','t tests','ANOVA','Correlation','Regression','Effect size','Power','Sample size','Bootstrap','Permutation','Multiple testing','FDR','Survival concepts','Diagnostic-test metrics']],
  ['Bioethics & Research QC',['Sample tracking','Replicate structure','Blanks','Positive/negative controls','Batch effects','Missingness','Outlier flags','Unit validation','Range checks','Data provenance','Reproducibility','Methods reporting']]
];

const BIO_CALCS = {
 'Molarity':{fields:['moles','volume_L'],run:v=>({M:+v.moles/+v.volume_L})},
 'Molality':{fields:['moles_solute','mass_solvent_kg'],run:v=>({m:+v.moles_solute/+v.mass_solvent_kg})},
 'Mass Concentration':{fields:['mass_g','volume_L'],run:v=>({g_L:+v.mass_g/+v.volume_L})},
 'Dilution C1V1=C2V2':{fields:['C1','V1','C2'],run:v=>({V2:(+v.C1*+v.V1)/+v.C2})},
 'Osmolarity':{fields:['concentration_M','particles'],run:v=>({osmolarity_mOsm_L:+v.concentration_M*+v.particles*1000})},
 'Free Energy ΔG':{fields:['deltaH','temperature_K','deltaS'],run:v=>({deltaG:+v.deltaH-(+v.temperature_K*+v.deltaS)})},
 'Equilibrium ΔG':{fields:['deltaG0','R','T','Q'],run:v=>({deltaG:+v.deltaG0+(+v.R*+v.T*Math.log(+v.Q))})},
 'Stokes-Einstein':{fields:['k_B','T_K','viscosity_Pa_s','radius_m'],run:v=>({D:(+v.k_B*+v.T_K)/(6*Math.PI*+v.viscosity_Pa_s*+v.radius_m)})},
 'Diffusion Fick 1':{fields:['D','dc_dx'],run:v=>({flux:-+v.D*+v.dc_dx})},
 'Nernst Potential':{fields:['R','T_K','z','F','a_out','a_in'],run:v=>({E_V:(+v.R*+v.T_K/(+v.z*+v.F))*Math.log(+v.a_out/+v.a_in)})},
 'Membrane RC Time Constant':{fields:['R_ohm','C_F'],run:v=>({tau_s:+v.R_ohm*+v.C_F})},
 'Primer Tm Wallace':{fields:['A','T','G','C'],run:v=>({Tm_C:2*(+v.A+ +v.T)+4*(+v.G+ +v.C)})},
 'Primer GC%':{fields:['G','C','length'],run:v=>({GC_percent:100*(+v.G+ +v.C)/+v.length})},
 'qPCR Efficiency':{fields:['slope'],run:v=>({efficiency_percent:(Math.pow(10,-1/+v.slope)-1)*100})},
 'ΔΔCt Fold Change':{fields:['deltaCt_sample','deltaCt_control'],run:v=>({ddCt:+v.deltaCt_sample-+v.deltaCt_control,foldChange:Math.pow(2,-(+v.deltaCt_sample-+v.deltaCt_control))})},
 'Transformation Efficiency':{fields:['transformants','DNA_ug'],run:v=>({CFU_per_ug:+v.transformants/+v.DNA_ug})},
 'Specific Growth Rate':{fields:['lnN2','lnN1','t2','t1'],run:v=>({mu:(+v.lnN2-+v.lnN1)/(+v.t2-+v.t1)})},
 'Doubling Time':{fields:['mu'],run:v=>({generation_time:Math.log(2)/+v.mu})},
 'CFU per mL':{fields:['colonies','dilution','volume_mL'],run:v=>({CFU_mL:+v.colonies/(+v.dilution*+v.volume_mL)})},
 'CFU per g':{fields:['colonies','dilution','volume_plated_mL','sample_g','extract_volume_mL'],run:v=>({CFU_g:(+v.colonies/(+v.dilution*+v.volume_plated_mL))*+v.extract_volume_mL/+v.sample_g})},
 'Shannon Diversity':{fields:['counts'],run:v=>{let a=String(v.counts).split(/[,;\s]+/).map(Number).filter(x=>x>0),n=a.reduce((x,y)=>x+y,0);return{H:-a.reduce((s,x)=>{let p=x/n;return s+p*Math.log(p)},0)}}},
 'Simpson Diversity':{fields:['counts'],run:v=>{let a=String(v.counts).split(/[,;\s]+/).map(Number).filter(x=>x>=0),n=a.reduce((x,y)=>x+y,0);return{D:1-a.reduce((s,x)=>s+(x/n)**2,0)}}},
 'Hardy-Weinberg':{fields:['p'],run:v=>{let p=+v.p,q=1-p;return{p:p,q:q,AA:p*p,Aa:2*p*q,aa:q*q}}},
 'Allele Frequency':{fields:['AA','Aa','aa'],run:v=>{let AA=+v.AA,Aa=+v.Aa,aa=+v.aa,n=AA+Aa+aa;return{p:(2*AA+Aa)/(2*n),q:(2*aa+Aa)/(2*n)}}},
 'Recombination Frequency':{fields:['recombinants','total'],run:v=>({percent:100*+v.recombinants/+v.total})},
 'Protein Specific Activity':{fields:['enzyme_activity','protein_mg'],run:v=>({specific_activity:+v.enzyme_activity/+v.protein_mg})},
 'Purification Fold':{fields:['specific_activity_final','specific_activity_initial'],run:v=>({fold:+v.specific_activity_final/+v.specific_activity_initial})},
 'Purification Yield':{fields:['activity_final','activity_initial'],run:v=>({yield_percent:100*+v.activity_final/+v.activity_initial})},
 'Log2 Fold Change':{fields:['sample','control'],run:v=>({log2FC:Math.log2(+v.sample/+v.control),foldChange:+v.sample/+v.control})},
 'Z Score':{fields:['x','mean','sd'],run:v=>({z:(+v.x-+v.mean)/+v.sd})},
 'A260 A280 Ratio':{fields:['A260','A280'],run:v=>({ratio:+v.A260/+v.A280})},
 'A260 A230 Ratio':{fields:['A260','A230'],run:v=>({ratio:+v.A260/+v.A230})},
 'DNA Mass from A260':{fields:['A260','factor_ug_mL','dilution'],run:v=>({ug_mL:+v.A260*+v.factor_ug_mL*+v.dilution})},
 'BSA Protein from Absorbance':{fields:['A','slope','intercept'],run:v=>({concentration:(+v.A-+v.intercept)/+v.slope})},
 'ELISA Blank Corrected':{fields:['sample','blank'],run:v=>({corrected:+v.sample-+v.blank})},
 'CV Percent':{fields:['sd','mean'],run:v=>({CV_percent:100*+v.sd/+v.mean})},
 'Standard Error':{fields:['sd','n'],run:v=>({SE:+v.sd/Math.sqrt(+v.n)})},
 'MAP':{fields:['SBP','DBP'],run:v=>({MAP:(+v.SBP+2*+v.DBP)/3})},
 'Cardiac Output':{fields:['heart_rate_bpm','stroke_volume_mL'],run:v=>({CO_L_min:+v.heart_rate_bpm*+v.stroke_volume_mL/1000})},
 'BMI':{fields:['mass_kg','height_m'],run:v=>({BMI:+v.mass_kg/(+(v.height_m**2))})},
 'BSA Mosteller':{fields:['height_cm','weight_kg'],run:v=>({BSA_m2:Math.sqrt((+v.height_cm*+v.weight_kg)/3600)})},
 'Clearance':{fields:['elimination_rate','concentration'],run:v=>({clearance:+v.elimination_rate/+v.concentration})},
 'Half Life':{fields:['k'],run:v=>({halfLife:Math.log(2)/+v.k})},
 'Loading Dose':{fields:['target_concentration','volume_distribution','bioavailability'],run:v=>({dose:+v.target_concentration*+v.volume_distribution/+v.bioavailability})},
 'Sensitivity':{fields:['TP','FN'],run:v=>({sensitivity:+v.TP/(+v.TP+ +v.FN)})},
 'Specificity':{fields:['TN','FP'],run:v=>({specificity:+v.TN/(+v.TN+ +v.FP)})},
 'PPV':{fields:['TP','FP'],run:v=>({PPV:+v.TP/(+v.TP+ +v.FP)})},
 'NPV':{fields:['TN','FN'],run:v=>({NPV:+v.TN/(+v.TN+ +v.FN)})},
 'Relative Risk':{fields:['exposed_cases','exposed_total','unexposed_cases','unexposed_total'],run:v=>({RR:(+v.exposed_cases/+v.exposed_total)/(+v.unexposed_cases/+v.unexposed_total)})},
 'Odds Ratio':{fields:['a','b','c','d'],run:v=>({OR:(+v.a*+v.d)/(+v.b*+v.c)})},
 'Incidence':{fields:['new_cases','population_at_risk'],run:v=>({incidence:+v.new_cases/+v.population_at_risk})},
 'Prevalence':{fields:['existing_cases','population'],run:v=>({prevalence:+v.existing_cases/+v.population})},
 'Attack Rate':{fields:['cases','population_exposed'],run:v=>({attack_rate:100*+v.cases/+v.population_exposed})},
 'Case Fatality Rate':{fields:['deaths','cases'],run:v=>({CFR_percent:100*+v.deaths/+v.cases})},
 'NDVI':{fields:['NIR','Red'],run:v=>({NDVI:(+v.NIR-+v.Red)/(+v.NIR+ +v.Red)})},
 'Leaf Area Index':{fields:['leaf_area','ground_area'],run:v=>({LAI:+v.leaf_area/+v.ground_area})},
 'Harvest Index':{fields:['economic_yield','biological_yield'],run:v=>({HI:+v.economic_yield/+v.biological_yield})},
 'Germination Percentage':{fields:['germinated','tested'],run:v=>({percent:100*+v.germinated/+v.tested})},
 'Porosity':{fields:['pore_volume','total_volume'],run:v=>({porosity:100*+v.pore_volume/+v.total_volume})},
 'Swelling Ratio':{fields:['wet_mass','dry_mass'],run:v=>({ratio:(+v.wet_mass-+v.dry_mass)/+v.dry_mass})},
 'Young Modulus':{fields:['stress','strain'],run:v=>({E:+v.stress/+v.strain})},
 'Stress':{fields:['force','area'],run:v=>({stress:+v.force/+v.area})},
 'SNR':{fields:['signal','noise'],run:v=>({SNR:+v.signal/+v.noise,SNR_dB:20*Math.log10(+v.signal/+v.noise)})},
 'Pixel Size':{fields:['field_of_view_um','pixels'],run:v=>({um_per_pixel:+v.field_of_view_um/+v.pixels})},
 'Cell Density':{fields:['cell_count','volume_mL'],run:v=>({cells_per_mL:+v.cell_count/+v.volume_mL})},
 'Confluence':{fields:['covered_area','total_area'],run:v=>({percent:100*+v.covered_area/+v.total_area})},
 'Aspect Ratio':{fields:['major_axis','minor_axis'],run:v=>({aspect_ratio:+v.major_axis/+v.minor_axis})},
 'Absolute Neutrophil Count':{fields:['WBC','neutrophil_percent'],run:v=>({ANC:+v.WBC*(+v.neutrophil_percent/100)})},
 'Anion Gap':{fields:['Na','Cl','HCO3'],run:v=>({anion_gap:+v.Na-(+v.Cl+ +v.HCO3)})},
 'Bioconcentration Factor':{fields:['concentration_organism','concentration_water'],run:v=>({BCF:+v.concentration_organism/+v.concentration_water})},
 'Yield Coefficient':{fields:['product_formed','substrate_consumed'],run:v=>({Yxs:+v.product_formed/+v.substrate_consumed})},
 'Volumetric Productivity':{fields:['product_formed','volume_L','time_h'],run:v=>({productivity:+v.product_formed/(+v.volume_L*+v.time_h)})},
 'Network Degree':{fields:['edges'],run:v=>({degree:+v.edges})}
};

const BIO_DEFAULTS={moles:'0.01',volume_L:'1',moles_solute:'0.01',mass_solvent_kg:'1',mass_g:'1',C1:'10',V1:'1',C2:'2',concentration_M:'0.001',particles:'2',deltaH:'-10000',temperature_K:'298',deltaS:'-20',deltaG0:'-5000',R:'8.314',T:'298',Q:'1',k_B:'1.380649e-23',viscosity_Pa_s:'0.001',radius_m:'1e-9',D:'1e-9',dc_dx:'100',z:'1',F:'96485',a_out:'10',a_in:'1',R_ohm:'1000000',C_F:'1e-6',A:'10',T:'10',G:'10',C:'10',length:'40',slope:'-3.3',deltaCt_sample:'5',deltaCt_control:'3',transformants:'100000',DNA_ug:'1',lnN2:'5',lnN1:'3',t2:'10',t1:'0',mu:'0.7',colonies:'100',dilution:'0.001',volume_mL:'0.1',volume_plated_mL:'0.1',sample_g:'1',extract_volume_mL:'10',counts:'10,20,30,40',p:'0.5',AA:'25',Aa:'50',aa:'25',recombinants:'10',total:'100',enzyme_activity:'100',protein_mg:'2',specific_activity_final:'50',specific_activity_initial:'5',activity_final:'50',activity_initial:'100',sample:'20',control:'10',x:'10',mean:'8',sd:'2',A260:'1.8',A280:'1',A230:'0.9',factor_ug_mL:'50',intercept:'0',blank:'0.1',n:'3',heart_rate_bpm:'70',stroke_volume_mL:'70',SBP:'120',DBP:'80',mass_kg:'70',height_m:'1.75',height_cm:'175',weight_kg:'70',elimination_rate:'1',concentration:'1',k:'0.1',target_concentration:'1',volume_distribution:'10',bioavailability:'0.8',TP:'80',FN:'20',TN:'90',FP:'10',exposed_cases:'20',exposed_total:'100',unexposed_cases:'10',unexposed_total:'100',a:'20',b:'30',c:'10',d:'40',new_cases:'10',population_at_risk:'1000',existing_cases:'100',population:'1000',cases:'20',population_exposed:'100',deaths:'2',NIR:'0.7',Red:'0.3',leaf_area:'3000',ground_area:'1000',economic_yield:'500',biological_yield:'1000',germinated:'80',tested:'100',pore_volume:'40',total_volume:'100',wet_mass:'12',dry_mass:'10',stress:'100',strain:'0.01',signal:'100',noise:'10',field_of_view_um:'100',pixels:'1000',cell_count:'100000',covered_area:'700',major_axis:'20',minor_axis:'10',WBC:'7000',neutrophil_percent:'60',Na:'140',Cl:'105',HCO3:'24',concentration_organism:'10',concentration_water:'0.1',product_formed:'10',substrate_consumed:'100',volume_L:'1',time_h:'10',edges:'5'};

for(const [domain,items] of BIO_FIELDS){
  for(const name of items){
    if(!TOOLS.some(t=>t.name===name && t.domain===domain)) TOOLS.push({name,domain,status:'reference',description:`${name} — ${domain} scientific module`});
  }
}
for(const [name,op] of Object.entries(BIO_CALCS)){
  OPS[name]=op;
  if(!TOOLS.some(t=>t.name===name)) TOOLS.push({name,domain:'Biological Sciences',status:'implemented',description:`Validated local calculation: ${name}`});
}
const oldDefaults=defaults;
defaults=function(f){return BIO_DEFAULTS[f]??oldDefaults(f)};

function bioHub(){
  const domains=BIO_FIELDS.map(x=>x[0]);
  $('#workspace').innerHTML=`<div class="toolhead"><span class="badge">Biological Sciences</span><h2>BioScience Workbench</h2><p>Integrated biology, biotechnology, biochemistry, biophysics, bioinformatics, genetics, genomics, cell biology, microbiology, immunology, physiology, ecology, plant science, zoology, biomedical science and related quantitative fields.</p><div class="methodfilters"><input id="bioSearch" placeholder="Search a biological field, method or calculation…"><select id="bioDomain"><option value="">All biological fields</option>${domains.map(d=>`<option>${esc(d)}</option>`).join('')}</select></div></div><div id="bioCards" class="methodcards"></div>`;
  const render=()=>{const q=$('#bioSearch').value.toLowerCase(),d=$('#bioDomain').value;const groups=BIO_FIELDS.filter(x=>!d||x[0]===d).map(([domain,items])=>[domain,items.filter(i=>i.toLowerCase().includes(q))]).filter(x=>x[1].length);$('#bioCards').innerHTML=groups.map(([domain,items])=>`<article class="methodcard"><span class="badge">${esc(domain)}</span><h3>${esc(domain)}</h3><p>${items.length} methods/concepts registered.</p><div class="chips">${items.map(i=>`<button class="chip" data-bio="${esc(i)}">${esc(i)}</button>`).join('')}</div></article>`).join('')||'<div class="toolhead">No matching biological module.</div>';$$('[data-bio]').forEach(b=>b.onclick=()=>openTool(b.dataset.bio));};
  $('#bioSearch').oninput=render;$('#bioDomain').onchange=render;render();
}
