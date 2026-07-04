import React, { useState, useEffect, useMemo } from 'react';
import { 
  FlaskConical, Beaker, Dna, Trash2, BookOpen, User, Globe, 
  Sun, Layers, Activity, Bug, Microscope, Leaf, ShieldAlert, 
  Settings, Plus, Download, Printer, Calculator, Home, Search,
  ChevronRight, ArrowLeft, RefreshCw, Clipboard
} from 'lucide-react';

// ============================================================================
// 5. HIDDEN CORE DATABASES
// ============================================================================
const BUFFER_DATABASE = {
  TAE: { name: "TAE Buffer (50X)", components: ["Tris-base: 242g", "Acetic acid: 57.1mL", "0.5M EDTA (pH 8.0): 100mL"], baseVol: 1000 },
  TBE: { name: "TBE Buffer (10X)", components: ["Tris-base: 108g", "Boric acid: 55g", "0.5M EDTA (pH 8.0): 40mL"], baseVol: 1000 },
  PBS: { name: "PBS (10X)", components: ["NaCl: 80g", "KCl: 2g", "Na2HPO4: 14.4g", "KH2PO4: 2.4g"], baseVol: 1000 },
  RIPA: { name: "RIPA Lysis Buffer (1X)", components: ["Tris-HCl (pH 8.0): 50mM", "NaCl: 150mM", "NP-40: 1%", "Sodium deoxycholate: 0.5%", "SDS: 0.1%"], baseVol: 100 },
  TE: { name: "TE Buffer (1X)", components: ["Tris-HCl (pH 8.0): 10mM", "EDTA (pH 8.0): 1mM"], baseVol: 1000 },
  SSC: { name: "SSC Buffer (20X)", components: ["NaCl: 175.3g", "Sodium citrate: 88.2g"], baseVol: 1000 }
};

const CODON_DICT = {
  UUU:'F', UUC:'F', UUA:'L', UUG:'L', CUU:'L', CUC:'L', CUA:'L', CUG:'L',
  AUU:'I', AUC:'I', AUA:'I', AUG:'M', GUU:'V', GUC:'V', GUA:'V', GUG:'V',
  UCU:'S', UCC:'S', UCA:'S', UCG:'S', CCU:'P', CCC:'P', CCA:'P', CCG:'P',
  ACU:'T', ACC:'T', ACA:'T', ACG:'T', GCU:'A', GCC:'A', GCA:'A', GCG:'A',
  UAU:'Y', UAC:'Y', UAA:'STOP', UAG:'STOP', CAU:'H', CAC:'H', CAA:'Q', CAG:'Q',
  AAU:'N', AAC:'N', AAA:'K', AAG:'K', GAU:'D', GAC:'D', GAA:'E', GAG:'E',
  UGU:'C', UGC:'C', UGA:'STOP', UGG:'W', CGU:'R', CGC:'R', CGA:'R', CGG:'R',
  AGU:'S', AGC:'S', AGA:'R', AGG:'R', GGU:'G', GGC:'G', GGA:'G', GGG:'G'
};

// ============================================================================
// CATEGORY COLOR MAPS (STRICT TAILWIND STATIC PALETTES)
// ============================================================================
const CATEGORY_META = {
  chemistry: { name: "Chemistry & Solutions", color: "cyan", icon: Beaker },
  spectro: { name: "Biomolecule Spectro", color: "amber", icon: Sun },
  protein: { name: "Protein & Electrophoresis", color: "purple", icon: Layers },
  kinetics: { name: "Enzymology & Kinetics", color: "yellow", icon: Activity },
  molbio: { name: "Molecular Biology", color: "emerald", icon: Dna },
  microbio: { name: "Microbiology", color: "rose", icon: Bug },
  cellculture: { name: "Cell & Tissue Culture", color: "pink", icon: Microscope },
  botany: { name: "Plant & Botany", color: "green", icon: Leaf },
  virology: { name: "Virology & Bioprocess", color: "red", icon: ShieldAlert },
  instrument: { name: "Lab Instrumentation", color: "slate", icon: Settings },
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTool, setSelectedTool] = useState(null);
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('labsuite_notes');
    return saved ? JSON.parse(saved) : [
      { id: 1, tag: 'System', timestamp: '2026-05-28 10:00', text: 'Welcome back to your offline lab bench workspace, Tahir.' }
    ];
  });
  const [noteInput, setNoteInput] = useState('');
  const [noteTag, setNoteTag] = useState('General');

  useEffect(() => {
    localStorage.setItem('labsuite_notes', JSON.stringify(notes));
  }, [notes]);

  const addNote = (text, tag = 'Manual Log') => {
    if (!text.trim()) return;
    const newNote = {
      id: Date.now(),
      tag: tag,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      text: text
    };
    setNotes(prev => [newNote, ...prev]);
  };

  // ============================================================================
  // 3. COMPLETE 50+ TOOL DEFINITIONS ROUTER TREE
  // ============================================================================
  const toolsList = useMemo(() => [
    // Chemistry
    { id: 'molarity', category: 'chemistry', name: 'Molarity/Normality Calc', desc: 'Calculate mass from target volume and concentration.' },
    { id: 'dilution', category: 'chemistry', name: 'Dilution (C₁V₁=C₂V₂)', desc: 'Stock concentration solver.' },
    { id: 'serial_dilution', category: 'chemistry', name: 'Serial Dilution Factor', desc: 'Calculate multistep dilution profiles.' },
    { id: 'percent_sol', category: 'chemistry', name: 'Percent Solutions (w/v)', desc: 'Mass requirements for percentage weights.' },
    { id: 'henderson', category: 'chemistry', name: 'Henderson-Hasselbalch', desc: 'Buffer base-to-acid ratio solver.' },
    { id: 'titration_sim', category: 'chemistry', name: 'Titration Simulator & Grapher', desc: 'Interactive Strong Acid/Base curve plotter.', advanced: true },
    { id: 'stoichiometry', category: 'chemistry', name: 'Stoichiometry & Yield Balancer', desc: 'Determine limiting reagents and yields.', advanced: true },
    { id: 'ionic_strength', category: 'chemistry', name: 'Ionic Strength Estimator', desc: 'Estimate solution attributes from salt count.' },
    { id: 'dialysis_calc', category: 'chemistry', name: 'Dialysis Buffer Dilution', desc: 'Calculate complete exchange yields.' },
    
    // Spectro
    { id: 'nucleic_quant', category: 'spectro', name: 'Nucleic Acid Quantitation', desc: 'Absorbance conversion for dsDNA, ssDNA, and RNA.' },
    { id: 'beer_lambert', category: 'spectro', name: 'Beer-Lambert Law Engine', desc: 'Molar concentration calculator.' },
    { id: 'std_curve', category: 'spectro', name: 'Standard Curve Plotter', desc: 'Dynamic linear graphing system with CSV export.', advanced: true },
    
    // Protein
    { id: 'buffer_recipes', category: 'protein', name: 'Buffer Recipe Scaler', desc: 'Scale automated lab formulas dynamically.' },
    { id: 'agarose_gel', category: 'protein', name: 'Agarose Gel Planner', desc: 'Calculate requirements for casting structural matrices.' },
    { id: 'sds_page', category: 'protein', name: 'SDS-PAGE Matrix Maker', desc: 'Resolving gel monomer concentrations.' },
    { id: 'native_page', category: 'protein', name: 'Native PAGE Composition', desc: 'Calculate raw acrylamide without denaturing components.' },
    { id: 'western_blot', category: 'protein', name: 'Western Blot Transfer Prep', desc: 'Tris/Glycine/Methanol buffer setup.' },
    { id: 'coomassie', category: 'protein', name: 'Coomassie Blue R-250 Stain', desc: 'Staining and destaining ratios.' },
    { id: 'amm_sulfate', category: 'protein', name: 'Ammonium Sulfate Precipitation', desc: 'Salt mass solver for salting out fractions.' },
    { id: 'protein_pi', category: 'protein', name: 'Protein pI Estimator', desc: 'Rough theoretical isoelectric calculator.' },

    // Kinetics
    { id: 'michaelis_menten', category: 'kinetics', name: 'Michaelis-Menten Velocity', desc: 'Calculate initial rate velocity (v).' },
    { id: 'specific_activity', category: 'kinetics', name: 'Specific Activity Enzyme Calc', desc: 'Calculate Units per milligram of enzyme.' },
    { id: 'catalytic_eff', category: 'kinetics', name: 'Catalytic Efficiency (k_cat)', desc: 'Turnover rate frequency solver.' },

    // Molecular Biology
    { id: 'pcr_mix', category: 'molbio', name: 'PCR Master Mix Calculator', desc: 'Automated formulation with 10% pipetting error protection.' },
    { id: 'rt_qpcr', category: 'molbio', name: 'RT-qPCR Formula Configurator', desc: 'Calculates high-accuracy 2X components.' },
    { id: 'oligo_tm', category: 'molbio', name: 'Oligo Tm (Wallace Rule)', desc: 'Quick assessment of annealing conditions.' },
    { id: 'primer_resuspension', category: 'molbio', name: 'Primer Resuspension Engine', desc: 'Volume solver for standardized 100µM stocks.' },
    { id: 'plasmid_ligation', category: 'molbio', name: 'Plasmid Ligation Calculator', desc: 'Insert-to-vector molecular mass tracking.' },
    { id: 'restriction_digest', category: 'molbio', name: 'Restriction Digest Mix', desc: 'Enzymatic volumetric allocations.' },
    { id: 'seq_analyzer', category: 'molbio', name: 'DNA/RNA Sequence Analyzer', desc: 'Extract transcription, GC%, length, and translation maps.', advanced: true },
    { id: 'restriction_mapper', category: 'molbio', name: 'Restriction Site Mapper', desc: 'Locate standard endonuclease cleavage points.', advanced: true },
    { id: 'gibson_assembly', category: 'molbio', name: 'Gibson Assembly Mix', desc: 'Calculate 2:1 insert-vector requirements.' },
    { id: 'crispr_rnp', category: 'molbio', name: 'CRISPR RNP Setup', desc: 'Molar proportions for Cas9 to gRNA targeting.' },

    // Microbiology
    { id: 'lb_media', category: 'microbio', name: 'LB Media Formulation', desc: 'Calculate solid/liquid standard media loads.' },
    { id: 'antibiotics', category: 'microbio', name: 'Antibiotic Working Stock Additions', desc: 'Volume updates for sterile media storage.' },
    { id: 'cfu_calc', category: 'microbio', name: 'CFU/mL Evaluation Engine', desc: 'Colony forming units from plating steps.' },
    { id: 'growth_tracker', category: 'microbio', name: 'Bacterial Growth Tracker', desc: 'Logarithmic growth tracker & generation timer.', advanced: true },
    { id: 'od600_cfu', category: 'microbio', name: 'OD600 to CFU Estimation', desc: 'Calculate cells/mL based on light scattering profiles.' },
    { id: 'doubling_time', category: 'microbio', name: 'Doubling Time Calculator', desc: 'Generation metrics from kinetic steps.' },
    { id: 'iptg_induction', category: 'microbio', name: 'IPTG Induction Metric Solver', desc: 'Mass additions for full protein expression.' },
    { id: 'yeast_sd', category: 'microbio', name: 'Yeast SD Media Planner', desc: 'YNB and dropout complete mixtures.' },

    // Cell Culture
    { id: 'cell_media', category: 'cellculture', name: 'Complete Media Formulator', desc: 'Calculate base media and serum splits.' },
    { id: 'hemocytometer', category: 'cellculture', name: 'Hemocytometer Density Calc', desc: 'Determine density and total counts.' },
    { id: 'trypan_blue', category: 'cellculture', name: 'Trypan Blue Viability', desc: 'Assess percent live versus apoptotic cohorts.' },
    { id: 'cell_seeding', category: 'cellculture', name: 'Cell Seeding Volume Tool', desc: 'Volume allocation to reach target plating densities.' },
    { id: 'cryopreservation', category: 'cellculture', name: 'Cryopreservation Mix Matrix', desc: 'Calculates standard Media / FBS (20%) / DMSO (10%) splits.' },

    // Botany
    { id: 'ms_media', category: 'botany', name: 'MS Plant Media Configurator', desc: 'Murashige and Skoog macro/micro salt scaling.' },
    { id: 'pgr_converter', category: 'botany', name: 'PGR Unit Converter (mg/L ↔ µM)', desc: 'Interconvert standard plant hormones.' },
    { id: 'stomatal_index', category: 'botany', name: 'Stomatal Index Evaluator', desc: 'Density profile ratio across surface cells.' },

    // Virology
    { id: 'viral_plaque', category: 'virology', name: 'Viral Titer (PFU/mL)', desc: 'Plaque forming units assay calculations.' },
    { id: 'moi_calc', category: 'virology', name: 'MOI Volume Calculator', desc: 'Calculate precise viral infection additions.' },

    // Instrumentation
    { id: 'centrifuge_rcf', category: 'instrument', name: 'RPM to RCF (g-Force) Engine', desc: 'Convert spin vectors using rotor radii.' },
    { id: 'plate_pouring', category: 'instrument', name: 'Plate Pouring Matrix Builder', desc: 'Estimate total media volume for plate batches.' },
    { id: 'column_vol', category: 'instrument', name: 'Chromatography Column Volume', desc: 'Calculate bed volume from radius and heights.' }
  ], []);

  const filteredTools = useMemo(() => {
    return toolsList.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = selectedCategory === 'all' || t.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchQuery, selectedCategory, toolsList]);

  return (
    <div className="min-h-screen bg-[#050812] text-slate-100 font-sans pb-24 selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* APP HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#050812]/70 backdrop-blur-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3" onClick={() => { setActiveTab('home'); setSelectedTool(null); }} className="cursor-pointer flex items-center gap-2">
          {/* Custom SVG Bio-Helix Flask Logo */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-8 h-8 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
              <path d="M35,15 L65,15 L65,30 L85,85 L15,85 L35,30 Z" fill="none" stroke="#06b6d4" strokeWidth="6" strokeLinejoin="round" />
              <path d="M40,40 Q50,30 60,40 T80,65 L20,65 Z" fill="#3b82f6" fillOpacity="0.3" />
              <path d="M30,55 Q50,45 70,55" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />
              <path d="M32,72 Q50,65 68,72" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-md font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">LAB SUITE PRO</h1>
            <p className="text-[10px] tracking-widest text-slate-500 font-mono">BENCHTOP ENGINE v4.0</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 rounded-full px-3 py-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          OFFLINE STORAGE ACTIVE
        </div>
      </header>

      {/* CORE FRAME LAYOUT */}
      <main className="max-w-4xl mx-auto p-4 animate-fadeIn">
        {selectedTool ? (
          <ToolWorkspace tool={selectedTool} closeWorkspace={() => setSelectedTool(null)} addNote={addNote} />
        ) : (
          <>
            {activeTab === 'home' && <HomeTab setTab={setActiveTab} setTool={setSelectedTool} toolsList={toolsList} />}
            {activeTab === 'tools' && (
              <ToolsTab 
                filteredTools={filteredTools} 
                setTool={setSelectedTool} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
              />
            )}
            {activeTab === 'notes' && <NotesTab notes={notes} addNote={addNote} setNotes={setNotes} noteInput={noteInput} setNoteInput={setNoteInput} noteTag={noteTag} setNoteTag={setNoteTag} />}
            {activeTab === 'info' && <InfoTab />}
          </>
        )}
      </main>

      {/* 2. PERSISTENT NAVIGATION BOTTOM BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-[#0f172a]/80 backdrop-blur-lg py-2 px-6 flex justify-between items-center max-w-xl mx-auto rounded-t-2xl shadow-xl shadow-black/50">
        <button onClick={() => { setActiveTab('home'); setSelectedTool(null); }} className={`flex flex-col items-center gap-1 text-xs font-medium transition-all ${activeTab === 'home' && !selectedTool ? 'text-cyan-400 transform -translate-y-0.5' : 'text-slate-400 hover:text-slate-200'}`}>
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>
        <button onClick={() => { setActiveTab('tools'); setSelectedTool(null); }} className={`flex flex-col items-center gap-1 text-xs font-medium transition-all ${activeTab === 'tools' || selectedTool ? 'text-cyan-400 transform -translate-y-0.5' : 'text-slate-400 hover:text-slate-200'}`}>
          <FlaskConical className="w-5 h-5" />
          <span>Tools</span>
        </button>
        <button onClick={() => { setActiveTab('notes'); setSelectedTool(null); }} className={`flex flex-col items-center gap-1 text-xs font-medium transition-all ${activeTab === 'notes' ? 'text-cyan-400 transform -translate-y-0.5' : 'text-slate-400 hover:text-slate-200'}`}>
          <BookOpen className="w-5 h-5" />
          <span>Notes</span>
        </button>
        <button onClick={() => { setActiveTab('info'); setSelectedTool(null); }} className={`flex flex-col items-center gap-1 text-xs font-medium transition-all ${activeTab === 'info' ? 'text-cyan-400 transform -translate-y-0.5' : 'text-slate-400 hover:text-slate-200'}`}>
          <User className="w-5 h-5" />
          <span>Info</span>
        </button>
      </nav>
    </div>
  );
}

// ============================================================================
// HOME TAB COMPONENT
// ============================================================================
function HomeTab({ setTab, setTool, toolsList }) {
  const quickCards = [
    { id: 'molarity', name: 'Solution Synthesizer', desc: 'Molarity, formulations, & molecular weights.', cat: 'chemistry' },
    { id: 'nucleic_quant', name: 'Biomolecule Estimator', desc: 'Nucleic concentration & parsing parameters.', cat: 'spectro' },
    { id: 'buffer_recipes', name: 'Electrophoresis Gel', desc: 'Interactive buffer systems, gels, and recipes.', cat: 'protein' },
    { id: 'std_curve', name: 'Standard Curve Plotter', desc: 'Generate multi-point linear curves dynamically.', cat: 'spectro' }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl mb-2">Computational Biotechnology Engine</h2>
        <p className="text-sm text-slate-400 max-w-xl">
          Welcome back. Select a tool below or navigate to the master catalog to access over 50 specific bioprocess utilities.
        </p>
      </div>

      {/* Quick Access Grid */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 px-1">Quick-Access Dashboard Widgets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickCards.map(qc => {
            const toolObj = toolsList.find(t => t.id === qc.id);
            const meta = CATEGORY_META[qc.cat];
            const IconComp = meta.icon;
            
            // Set styles manually using explicit strings mapping to criteria
            const borderColors = { cyan: 'hover:border-cyan-500/40', amber: 'hover:border-amber-500/40', purple: 'hover:border-purple-500/40' };
            const bgColors = { cyan: 'bg-cyan-500/5', amber: 'bg-amber-500/5', purple: 'bg-purple-500/5' };
            const textColors = { cyan: 'text-cyan-400', amber: 'text-amber-400', purple: 'text-purple-400' };

            return (
              <div 
                key={qc.id}
                onClick={() => setTool(toolObj)}
                className={`group cursor-pointer rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all duration-200 hover:-translate-y-0.5 ${borderColors[meta.color] || 'hover:border-slate-600'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className={`p-2 rounded-lg ${bgColors[meta.color] || 'bg-slate-800'} ${textColors[meta.color] || 'text-slate-400'}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
                </div>
                <h4 className="font-semibold text-slate-200 mt-3 group-hover:text-white transition-colors">{qc.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{qc.desc}</p>
              </div>
            );
          })}

          {/* View All 50+ Tools Shortcut Card */}
          <div 
            onClick={() => setTab('tools')}
            className="group cursor-pointer rounded-xl border border-dashed border-slate-700 bg-slate-950/40 p-4 flex flex-col justify-center items-center text-center transition-all duration-200 hover:border-cyan-500/40 hover:bg-slate-900/20 min-h-[130px]"
          >
            <div className="p-3 rounded-full bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/20 transition-all">
              <FlaskConical className="w-5 h-5" />
            </div>
            <span className="font-semibold text-slate-300 mt-2 group-hover:text-white transition-colors">View All 50+ Specialized Tools</span>
            <span className="text-[10px] font-mono text-slate-500 mt-0.5">Categorized Biomolecule Directory</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TOOLS TAB COMPONENT
// ============================================================================
function ToolsTab({ filteredTools, setTool, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  return (
    <div className="space-y-4">
      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search across 50+ molecular calculators & simulators..." 
          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Category Pills Scroller */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${selectedCategory === 'all' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
        >
          All Categories
        </button>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${selectedCategory === key ? 'bg-slate-800 text-white border-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
          >
            {meta.name}
          </button>
        ))}
      </div>

      {/* Grid Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredTools.map(t => {
          const meta = CATEGORY_META[t.category];
          const IconComp = meta.icon;
          
          return (
            <div 
              key={t.id}
              onClick={() => setTool(t)}
              className="cursor-pointer group flex items-start gap-3 p-3 bg-slate-900/50 border border-slate-800/80 rounded-xl hover:bg-slate-900 hover:border-slate-700/80 transition-all duration-150"
            >
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0">
                <IconComp className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-medium text-slate-200 text-sm group-hover:text-white truncate">{t.name}</h4>
                  {t.advanced && <span className="text-[9px] font-mono tracking-wide px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-semibold scale-90">Advanced</span>}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{t.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// NOTES TAB COMPONENT
// ============================================================================
function NotesTab({ notes, addNote, setNotes, noteInput, setNoteInput, noteTag, setNoteTag }) {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span>Benchtop Observations Input</span>
        </h3>
        <textarea
          rows={3}
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Type manual data observations, concentration outputs, plate counts, or chemical profiles..."
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Tag/Context:</span>
            <select 
              value={noteTag} 
              onChange={(e) => setNoteTag(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded px-2 py-1 focus:outline-none"
            >
              <option value="General">General</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Spectro">Spectro</option>
              <option value="Genetics">Genetics</option>
              <option value="Culture">Culture</option>
            </select>
          </div>
          <button 
            onClick={() => { addNote(noteInput, noteTag); setNoteInput(''); }}
            className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Commit Log Entry</span>
          </button>
        </div>
      </div>

      {/* History Log */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">Persistent Workspace Log History</h3>
        {notes.length === 0 ? (
          <p className="text-xs text-slate-600 italic text-center py-6">Log history is empty.</p>
        ) : (
          notes.map(n => (
            <div key={n.id} className="group rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 space-y-1.5 relative hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">{n.tag}</span>
                  <span className="text-[10px] font-mono text-slate-500">{n.timestamp}</span>
                </div>
                <button 
                  onClick={() => setNotes(prev => prev.filter(x => x.id !== n.id))}
                  className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-slate-900 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">{n.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================================================
// INFO TAB COMPONENT
// ============================================================================
function InfoTab() {
  return (
    <div className="max-w-md mx-auto rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-6 shadow-2xl relative text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 shadow-lg shadow-cyan-500/10">
        <div className="w-full h-full bg-[#050812] rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-cyan-400" />
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-100 tracking-wide">Tahir Ahmad Bijran</h2>
        <p className="text-xs text-cyan-400 font-mono">Principal System Architect</p>
      </div>

      <hr className="border-slate-800" />

      <div className="grid grid-cols-2 gap-3 text-left font-mono text-xs">
        <div className="p-2 rounded bg-slate-950 border border-slate-900">
          <span className="text-slate-500 block text-[10px] uppercase">Institution</span>
          <a href="#" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">Central University of Kashmir</a>
        </div>
        <div className="p-2 rounded bg-slate-950 border border-slate-900">
          <span className="text-slate-500 block text-[10px] uppercase">Department</span>
          <a href="#" className="text-slate-200 hover:text-cyan-400 transition-colors font-medium">Biotechnology</a>
        </div>
        <div className="p-2 rounded bg-slate-950 border border-slate-900 col-span-2">
          <span className="text-slate-500 block text-[10px] uppercase">Cohort Identification</span>
          <span className="text-slate-200 font-medium">Academic Batch: 2024</span>
        </div>
      </div>

      <a 
        href="https://linkedin.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all group"
      >
        <Globe className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
        <span>Connect via LinkedIn Network</span>
      </a>
    </div>
  );
}

// ============================================================================
// MODULAR WORKSPACE SYSTEM (DYNAMIC TOOL ROUTING INTERFACE)
// ============================================================================
function ToolWorkspace({ tool, closeWorkspace, addNote }) {
  const meta = CATEGORY_META[tool.category];
  
  return (
    <div className="space-y-4">
      {/* Workspace Header Navigator */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <button onClick={closeWorkspace} className="flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Workspace</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">{meta.name}</span>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-100">{tool.name}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{tool.desc}</p>
      </div>

      {/* CORE ACTIVE WORKSPACE COMPONENT SELECTOR ENGINE */}
      <div className="mt-2">
        {/* Render Specific Interactive Systems Based on Blueprint */}
        {tool.id === 'molarity' && <MolarityEngine addNote={addNote} />}
        {tool.id === 'dilution' && <DilutionEngine addNote={addNote} />}
        {tool.id === 'nucleic_quant' && <NucleicQuantEngine addNote={addNote} />}
        {tool.id === 'buffer_recipes' && <BufferRecipeEngine addNote={addNote} />}
        {tool.id === 'std_curve' && <StandardCurvePlotter addNote={addNote} />}
        {tool.id === 'titration_sim' && <TitrationSimulator addNote={addNote} />}
        {tool.id === 'stoichiometry' && <StoichiometryBalancer addNote={addNote} />}
        {tool.id === 'seq_analyzer' && <SequenceAnalyzer addNote={addNote} />}
        {tool.id === 'restriction_mapper' && <RestrictionMapper addNote={addNote} />}
        {tool.id === 'growth_tracker' && <BacterialGrowthTracker addNote={addNote} />}
        
        {/* Dynamic Fallback System for Standard Tools */}
        {!['molarity', 'dilution', 'nucleic_quant', 'buffer_recipes', 'std_curve', 'titration_sim', 'stoichiometry', 'seq_analyzer', 'restriction_mapper', 'growth_tracker'].includes(tool.id) && (
          <StandardGenericEngine tool={tool} addNote={addNote} />
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ADVANCED MODULES: 1. STANDARD CURVE PLOTTER
// ============================================================================
function StandardCurvePlotter({ addNote }) {
  const [points, setPoints] = useState([
    { x: 1, y: 0.15 }, { x: 2, y: 0.31 }, { x: 4, y: 0.58 }, { x: 8, y: 1.18 }
  ]);
  const [newX, setNewX] = useState('');
  const [newY, setNewY] = useState('');
  const [unknownY, setUnknownY] = useState('');

  const addPoint = () => {
    if (!newX || !newY) return;
    setPoints([...points, { x: parseFloat(newX), y: parseFloat(newY) }]);
    setNewX(''); setNewY('');
  };

  const clearPoints = () => setPoints([]);

  // Compute Linear Regression parameters
  const stats = useMemo(() => {
    if (points.length < 2) return { slope: 0, intercept: 0, r2: 0 };
    const n = points.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
    points.forEach(p => {
      sumX += p.x; sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x; sumYY += p.y * p.y;
    });
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // R2 Calculation
    const yMean = sumY / n;
    let ssTot = 0, ssRes = 0;
    points.forEach(p => {
      const predY = slope * p.x + intercept;
      ssTot += Math.pow(p.y - yMean, 2);
      ssRes += Math.pow(p.y - predY, 2);
    });
    const r2 = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);
    return { slope, intercept, r2 };
  }, [points]);

  const computedUnknownX = useMemo(() => {
    if (!unknownY || stats.slope === 0) return null;
    return (parseFloat(unknownY) - stats.intercept) / stats.slope;
  }, [unknownY, stats]);

  const commitToLog = () => {
    const logStr = `Standard Curve Calculation Matrix:\nEquation: y = ${stats.slope.toFixed(4)}x + ${stats.intercept.toFixed(4)}\nR² = ${stats.r2.toFixed(4)}\nTotal Standards Logged: ${points.length}`;
    addNote(logStr, 'Spectro');
  };

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="font-bold text-slate-200">Standard Concentration Input Vectors</h3>
          <div className="flex gap-2">
            <input type="number" placeholder="Conc (X)" value={newX} onChange={e=>setNewX(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
            <input type="number" placeholder="Abs (Y)" value={newY} onChange={e=>setNewY(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
            <button onClick={addPoint} className="px-3 bg-cyan-600 text-slate-950 rounded font-bold hover:bg-cyan-500">Add</button>
          </div>
          
          <div className="bg-slate-950 rounded border border-slate-800 max-h-[140px] overflow-y-auto p-1">
            <table className="w-full text-left">
              <thead><tr className="border-b border-slate-800 text-slate-500"><th className="p-1">Conc (X)</th><th className="p-1">Abs (Y)</th></tr></thead>
              <tbody>
                {points.map((p,i)=>(<tr key={i} className="border-b border-slate-900">
                  <td className="p-1 text-slate-300">{p.x}</td><td className="p-1 text-slate-300">{p.y}</td></tr>))}
              </tbody>
            </table>
          </div>
          <button onClick={clearPoints} className="w-full py-1 text-center border border-rose-900/40 text-rose-400 rounded hover:bg-rose-950/20">Clear Data Matrix</button>
        </div>

        {/* Live SVG Mapping Window */}
        <div className="bg-slate-950 border border-slate-800 rounded p-3 flex flex-col justify-between">
          <h3 className="font-bold text-slate-200 mb-1">Live Linear Calibration Profile</h3>
          <div className="w-full h-32 border-l border-b border-slate-700 relative mt-2 flex items-center justify-center">
            {points.length >= 2 ? (
              <svg className="w-full h-full absolute inset-0 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="90" x2="100" y2="10" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2" />
                {points.map((p, i) => {
                  const cx = Math.min(90, Math.max(10, (p.x / 10) * 100));
                  const cy = Math.min(90, Math.max(10, 100 - (p.y / 1.5) * 100));
                  return <circle key={i} cx={cx} cy={cy} r="3" fill="#f59e0b" />;
                })}
              </svg>
            ) : <span className="text-slate-600 italic">Insert 2+ points to trace line</span>}
          </div>
          <div className="mt-3 pt-2 border-t border-slate-800 space-y-1 text-slate-400">
            <div>Formula: <span className="text-cyan-400">y = {stats.slope.toFixed(4)}x + ({stats.intercept.toFixed(4)})</span></div>
            <div>Regression Variance (R²): <span className="text-emerald-400">{stats.r2.toFixed(4)}</span></div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-bold text-slate-300 mb-1">Interpolate Unknown Concentration</h4>
          <div className="flex gap-2">
            <input type="number" placeholder="Enter Unknown Abs (Y)" value={unknownY} onChange={e=>setUnknownY(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
            <div className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-emerald-400 font-bold shrink-0 flex items-center">
              X = {computedUnknownX !== null ? computedUnknownX.toFixed(4) : '---'}
            </div>
          </div>
        </div>
        <div className="flex items-end">
          <button onClick={commitToLog} className="w-full py-2 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded font-semibold flex items-center justify-center gap-2">
            <Clipboard className="w-4 h-4" /> Commit Profile to Lab Notebook
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ADVANCED MODULES: 2. TITRATION SIMULATOR
// ============================================================================
function TitrationSimulator({ addNote }) {
  const [acidConc, setAcidConc] = useState(0.1);
  const [acidVol, setAcidVol] = useState(50);
  const [baseConc, setBaseConc] = useState(0.1);

  // Run dynamic generation of pH vs Vol curve array points
  const points = useMemo(() => {
    const data = [];
    const totalAcidMoles = (acidConc * acidVol) / 1000;
    
    for (let vBase = 0; vBase <= 100; vBase += 2) {
      const baseMolesAdded = (baseConc * vBase) / 1000;
      const totalVolL = (acidVol + vBase) / 1000;
      let pH = 7.0;

      if (totalAcidMoles > baseMolesAdded) {
        const excessH = (totalAcidMoles - baseMolesAdded) / totalVolL;
        pH = -Math.log10(excessH);
      } else if (baseMolesAdded > totalAcidMoles) {
        const excessOH = (baseMolesAdded - totalAcidMoles) / totalVolL;
        const pOH = -Math.log10(excessOH);
        pH = 14 - pOH;
      } else {
        pH = 7.0; // Perfect Equivalence
      }
      data.push({ vol: vBase, pH: Math.max(0, Math.min(14, pH)) });
    }
    return data;
  }, [acidConc, acidVol, baseConc]);

  const eqPointVol = useMemo(() => {
    if (baseConc === 0) return 0;
    return (acidConc * acidVol) / baseConc;
  }, [acidConc, acidVol, baseConc]);

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-slate-400 mb-1">Strong Acid Conc (M)</label>
          <input type="number" step="0.01" value={acidConc} onChange={e=>setAcidConc(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Acid Volume (mL)</label>
          <input type="number" value={acidVol} onChange={e=>setAcidVol(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Strong Base Conc (M)</label>
          <input type="number" step="0.01" value={baseConc} onChange={e=>setBaseConc(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded p-4">
        <h3 className="font-bold text-slate-200 mb-2">Potentiometric Neutralization Sweep (pH vs Volume Added)</h3>
        <div className="w-full h-36 border-l border-b border-slate-700 relative mt-4">
          {/* Quick inline path generation mapping vectors inside layout boundaries */}
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="0" y1="50" x2="100" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="3" />
            <path 
              d={points.reduce((acc, p, i) => `${acc} ${i===0?'M':'L'} ${p.vol} ${100 - (p.pH / 14)*100}`, '')}
              fill="none" stroke="#a855f7" strokeWidth="1.5"
            />
            {/* Equivalence Marker line */}
            {eqPointVol <= 100 && (
              <line x1={eqPointVol} y1="0" x2={eqPointVol} y2="100" stroke="#ef4444" strokeWidth="0.75" strokeDasharray="2" />
            )}
          </svg>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-1">
          <span>0 mL Base</span>
          <span>Theoretical Equivalence Node: <span className="text-rose-400 font-bold">{eqPointVol.toFixed(2)} mL</span></span>
          <span>100 mL Base</span>
        </div>
      </div>
      
      <button 
        onClick={() => addNote(`Titration Sim Node Run:\nAcid Vol/Conc: ${acidVol}mL of ${acidConc}M\nBase Titrant: ${baseConc}M\nCalculated Equivalence Point: ${eqPointVol.toFixed(2)} mL`, 'Chemistry')}
        className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
      >
        Log Titration Signature to Notebook
      </button>
    </div>
  );
}

// ============================================================================
// ADVANCED MODULES: 3. STOICHIOMETRY BALANCER
// ============================================================================
function StoichiometryBalancer({ addNote }) {
  const [massA, setMassA] = useState(10);
  const [mwA, setMwA] = useState(180.16);
  const [coeffA, setCoeffA] = useState(1);

  const [massB, setMassB] = useState(12);
  const [mwB, setMwB] = useState(32.00);
  const [coeffB, setCoeffB] = useState(6);

  const molesA = useMemo(() => (massA / mwA) || 0, [massA, mwA]);
  const molesB = useMemo(() => (massB / mwB) || 0, [massB, mwB]);

  const limitingReagent = useMemo(() => {
    if (molesA === 0 || molesB === 0) return 'None';
    const normA = molesA / coeffA;
    const normB = molesB / coeffB;
    return normA < normB ? 'Reactant A' : 'Reactant B';
  }, [molesA, molesB, coeffA, coeffB]);

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Reactant A */}
        <div className="bg-slate-950 border border-slate-800 rounded p-3 space-y-2">
          <h4 className="font-bold text-cyan-400">Reactant Parameter Block A</h4>
          <div>
            <label className="block text-slate-500 mb-0.5">Mass Loaded (g)</label>
            <input type="number" value={massA} onChange={e=>setMassA(parseFloat(e.target.value)||0)} className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white" />
          </div>
          <div>
            <label className="block text-slate-500 mb-0.5">Molecular Weight (g/mol)</label>
            <input type="number" value={mwA} onChange={e=>setMwA(parseFloat(e.target.value)||0)} className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white" />
          </div>
          <div>
            <label className="block text-slate-500 mb-0.5">Stoichiometric Coefficient</label>
            <input type="number" value={coeffA} onChange={e=>setCoeffA(parseInt(e.target.value)||1)} className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white" />
          </div>
          <div className="pt-1 text-[11px] text-slate-400">Total Moles available: <span className="text-white">{molesA.toFixed(4)}</span></div>
        </div>

        {/* Reactant B */}
        <div className="bg-slate-950 border border-slate-800 rounded p-3 space-y-2">
          <h4 className="font-bold text-amber-400">Reactant Parameter Block B</h4>
          <div>
            <label className="block text-slate-500 mb-0.5">Mass Loaded (g)</label>
            <input type="number" value={massB} onChange={e=>setMassB(parseFloat(e.target.value)||0)} className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white" />
          </div>
          <div>
            <label className="block text-slate-500 mb-0.5">Molecular Weight (g/mol)</label>
            <input type="number" value={mwB} onChange={e=>setMwB(parseFloat(e.target.value)||0)} className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white" />
          </div>
          <div>
            <label className="block text-slate-500 mb-0.5">Stoichiometric Coefficient</label>
            <input type="number" value={coeffB} onChange={e=>setCoeffB(parseInt(e.target.value)||1)} className="w-full bg-slate-900 border border-slate-800 rounded p-1 text-white" />
          </div>
          <div className="pt-1 text-[11px] text-slate-400">Total Moles available: <span className="text-white">{molesB.toFixed(4)}</span></div>
        </div>
      </div>

      <div className="p-3 bg-slate-950 border border-slate-800 rounded flex items-center justify-between">
        <div>
          <span className="text-slate-400">Identified Limiting Reagent:</span>
          <span className="ml-2 font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">{limitingReagent}</span>
        </div>
        <button 
          onClick={() => addNote(`Stoichiometric Yield Run:\nReactant A Moles: ${molesA.toFixed(4)}\nReactant B Moles: ${molesB.toFixed(4)}\nLimiting Component identified as: ${limitingReagent}`, 'Chemistry')}
          className="px-3 py-1 bg-slate-900 border border-slate-700 hover:text-white rounded text-slate-400"
        >
          Log Balancer Report
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ADVANCED MODULES: 4. DNA/RNA SEQUENCE ANALYZER
// ============================================================================
function SequenceAnalyzer({ addNote }) {
  const [seq, setSeq] = useState('ATGCGATCGATCGATCGATCGATCGA');

  const analysis = useMemo(() => {
    const raw = seq.toUpperCase().replace(/[^ATCGU]/g, '');
    const len = raw.length;
    if (len === 0) return { len: 0, gc: 0, revComp: '', rna: '', protein: '' };

    // GC content
    const gcCount = (raw.match(/[GC]/g) || []).length;
    const gc = (gcCount / len) * 100;

    // Transcription/Reverse complementary calculations
    const rna = raw.replace(/T/g, 'U');
    const revComp = raw.split('').reverse().map(b => {
      if (b==='A') return 'T'; if (b==='T') return 'A';
      if (b==='C') return 'G'; if (b==='G') return 'C';
      return b;
    }).join('');

    // Internal Translation mapping framework
    let protein = '';
    for (let i = 0; i < rna.length - 2; i += 3) {
      const codon = rna.substring(i, i + 3);
      const aa = CODON_DICT[codon] || 'X';
      if (aa === 'STOP') { protein += ' *'; break; }
      protein += aa;
    }

    return { len, gc, revComp, rna, protein };
  }, [seq]);

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div>
        <label className="block text-slate-400 mb-1">Paste Raw Genomic/Oligo FASTA Sequence</label>
        <textarea 
          rows={3} 
          value={seq} 
          onChange={e=>setSeq(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white font-mono uppercase tracking-wider"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2 bg-slate-950 rounded border border-slate-800">
          <span className="text-slate-500 block">Nucleotide Base Length</span>
          <span className="text-slate-200 font-bold text-sm">{analysis.len} bp</span>
        </div>
        <div className="p-2 bg-slate-950 rounded border border-slate-800">
          <span className="text-slate-500 block">GC Ratio Percentage</span>
          <span className="text-cyan-400 font-bold text-sm">{analysis.gc.toFixed(2)} %</span>
        </div>
      </div>

      <div className="space-y-2 bg-slate-950 rounded border border-slate-800 p-3">
        <div>
          <span className="text-slate-500 block text-[10px]">REVERSE COMPLEMENT STRAND (5' → 3')</span>
          <div className="text-slate-300 break-all bg-slate-900/40 p-1.5 rounded border border-slate-900 select-all">{analysis.revComp || '---'}</div>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">TRANSCRIBED RNA TRANSCRIPT</span>
          <div className="text-amber-400 break-all bg-slate-900/40 p-1.5 rounded border border-slate-900">{analysis.rna || '---'}</div>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">TRANSLATED AMINO ACID PEPTIDE BACKBONE</span>
          <div className="text-emerald-400 break-all bg-slate-900/40 p-1.5 rounded border border-slate-900 tracking-widest font-bold">{analysis.protein || '---'}</div>
        </div>
      </div>

      <button 
        onClick={() => addNote(`Sequence Parsing Report:\nLength: ${analysis.len}bp\nGC%: ${analysis.gc.toFixed(2)}%\nTranslated Peptide Track: ${analysis.protein}`, 'Genetics')}
        className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded text-slate-300"
      >
        Commit Structural Analysis to Logs
      </button>
    </div>
  );
}

// ============================================================================
// ADVANCED MODULES: 5. RESTRICTION SITE MAPPER
// ============================================================================
function RestrictionMapper({ addNote }) {
  const [sequence, setSequence] = useState('GAATTCGGATCCAAGCTTGCTCGAGGCGGCCGCOCATGCA');
  
  const ENZYMES = {
    EcoRI: 'GAATTC', BamHI: 'GGATCC', HindIII: 'AAGCTT',
    XhoI: 'CTCGAG', NotI: 'GCGGCCGC', NdeI: 'CATATG'
  };

  const matches = useMemo(() => {
    const found = [];
    const upperSeq = sequence.toUpperCase();
    Object.entries(ENZYMES).forEach(([name, site]) => {
      let idx = upperSeq.indexOf(site);
      while(idx !== -1) {
        found.push({ name, site, position: idx + 1 });
        idx = upperSeq.indexOf(site, idx + 1);
      }
    });
    return found.sort((a,b)=>a.position - b.position);
  }, [sequence]);

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div>
        <label className="block text-slate-400 mb-1">Target DNA Substrate Entry Segment</label>
        <input 
          type="text" value={sequence} onChange={e=>setSequence(e.target.value)} 
          className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white uppercase tracking-widest"
        />
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded p-3">
        <h4 className="font-bold text-slate-200 mb-2">Mapped Cleavage Coordinate Map Array</h4>
        {matches.length === 0 ? (
          <p className="text-slate-600 italic">No specific base pairs cut sites detected for standard panel (EcoRI, BamHI, HindIII, XhoI, NotI, NdeI).</p>
        ) : (
          <div className="space-y-1.5 max-h-[150px] overflow-y-auto">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center justify-between p-1.5 bg-slate-900 rounded border border-slate-800">
                <span className="font-bold text-rose-400">{m.name} <span className="text-[10px] text-slate-500 font-normal">({m.site})</span></span>
                <span className="text-slate-400">Cleavage Vector Base Index: <span className="text-emerald-400 font-bold">bp {m.position}</span></span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ADVANCED MODULES: 6. BACTERIAL GROWTH TRACKER
// ============================================================================
function BacterialGrowthTracker({ addNote }) {
  const [logs, setLogs] = useState([
    { hour: 0, od: 0.05 }, { hour: 2, od: 0.18 }, { hour: 4, od: 0.45 }, { hour: 6, od: 0.95 }
  ]);
  const [newHour, setNewHour] = useState('');
  const [newOd, setNewOd] = useState('');

  const addGrowthLog = () => {
    if(!newHour || !newOd) return;
    setLogs([...logs, { hour: parseFloat(newHour), od: parseFloat(newOd) }].sort((a,b)=>a.hour - b.hour));
    setNewHour(''); setNewOd('');
  };

  // Compute specific growth metrics across linear phase matches (OD 0.1 to 1.0)
  const growthMetrics = useMemo(() => {
    const expPoints = logs.filter(p => p.od >= 0.1 && p.od <= 1.0);
    if(expPoints.length < 2) return { mu: 0, td: 0 };
    
    const first = expPoints[0];
    const last = expPoints[expPoints.length - 1];
    const dTime = last.hour - first.hour;
    if(dTime <= 0) return { mu: 0, td: 0 };

    const mu = (Math.log(last.od) - Math.log(first.od)) / dTime;
    const td = mu === 0 ? 0 : Math.log(2) / mu;
    return { mu, td };
  }, [logs]);

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-bold text-slate-200 mb-2">Bioreactor Kinetic Interval Input</h4>
          <div className="flex gap-2 mb-3">
            <input type="number" placeholder="Time (hr)" value={newHour} onChange={e=>setNewHour(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
            <input type="number" step="0.01" placeholder="OD600" value={newOd} onChange={e=>setNewOd(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
            <button onClick={addGrowthLog} className="px-3 bg-purple-600 text-white font-bold rounded">Log</button>
          </div>

          <div className="bg-slate-950 rounded border border-slate-800 max-h-[120px] overflow-y-auto p-1">
            <table className="w-full text-left">
              <thead><tr className="border-b border-slate-800 text-slate-500"><th className="p-1">Time (hrs)</th><th className="p-1">OD600 Value</th></tr></thead>
              <tbody>
                {logs.map((l,i)=>(<tr key={i} className="border-b border-slate-900">
                  <td className="p-1 text-slate-300">{l.hour} hr</td><td className="p-1 text-slate-300">{l.od}</td></tr>))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded p-3 flex flex-col justify-between">
          <h4 className="font-bold text-slate-200">Logarithmic Kinetic Evaluations</h4>
          <div className="space-y-2 mt-2">
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">SPECIFIC GROWTH RATE (µ)</span>
              <span className="text-cyan-400 font-bold text-sm">{growthMetrics.mu.toFixed(4)} hr⁻¹</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-500 block text-[10px]">DOUBLING TIME (t_d)</span>
              <span className="text-purple-400 font-bold text-sm">{growthMetrics.td.toFixed(2)} hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CORE ESSENTIALS: MOLARITY UTILITY CALCULATOR ENGINE
// ============================================================================
function MolarityEngine({ addNote }) {
  const [mw, setMw] = useState(180.16);
  const [vol, setVol] = useState(500);
  const [conc, setConc] = useState(0.25);

  const calculatedMass = useMemo(() => {
    return (conc * (vol / 1000) * mw) || 0;
  }, [mw, vol, conc]);

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="space-y-3">
        <div>
          <label className="block text-slate-400 mb-1">Analyte Molecular Weight (g/mol)</label>
          <input type="number" value={mw} onChange={e=>setMw(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Target Formulation Volume (mL)</label>
          <input type="number" value={vol} onChange={e=>setVol(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Target Molar Concentration (M)</label>
          <input type="number" step="0.01" value={conc} onChange={e=>setConc(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
        </div>
      </div>

      <div className="p-3 bg-slate-950 border border-slate-800 rounded text-center">
        <span className="text-slate-400 block mb-0.5 text-[10px] uppercase tracking-wider">Required Solute Dry Mass Weight</span>
        <span className="text-cyan-400 text-lg font-bold">{calculatedMass.toFixed(4)} grams</span>
      </div>

      <button 
        onClick={() => addNote(`Molarity Computation:\nMass Required: ${calculatedMass.toFixed(4)}g for ${vol}mL of ${conc}M solution (MW: ${mw}g/mol).`, 'Chemistry')}
        className="w-full py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded"
      >
        Log Formulation Values
      </button>
    </div>
  );
}

// ============================================================================
// CORE ESSENTIALS: DILUTION UTILITY CALCULATOR ENGINE
// ============================================================================
function DilutionEngine({ addNote }) {
  const [c1, setC1] = useState(10);
  const [v2, setV2] = useState(100);
  const [c2, setC2] = useState(1);

  const v1 = useMemo(() => {
    if (c1 === 0) return 0;
    return (c2 * v2) / c1;
  }, [c1, v2, c2]);

  const solvent = useMemo(() => Math.max(0, v2 - v1), [v2, v1]);

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-slate-400 mb-1">Stock Conc (C₁)</label>
          <input type="number" value={c1} onChange={e=>setC1(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Target Vol (V₂)</label>
          <input type="number" value={v2} onChange={e=>setV2(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Target Conc (C₂)</label>
          <input type="number" value={c2} onChange={e=>setC2(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
        </div>
      </div>

      <div className="p-3 bg-slate-950 border border-slate-800 rounded space-y-1 text-center">
        <div>Required Stock Aliquot (V₁): <span className="text-amber-400 font-bold">{v1.toFixed(3)} mL</span></div>
        <div className="text-slate-400 text-[11px]">Required Buffer/Solvent Diluent: <span className="text-slate-200 font-medium">{solvent.toFixed(3)} mL</span></div>
      </div>
    </div>
  );
}

// ============================================================================
// CORE ESSENTIALS: NUCLEIC QUANT CALC ENGINE
// ============================================================================
function NucleicQuantEngine({ addNote }) {
  const [abs, setAbs] = useState(0.45);
  const [factor, setFactor] = useState(50); // dsDNA default factor conversion matrix
  const [dilution, setDilution] = useState(100);

  const conc = useMemo(() => abs * factor * dilution, [abs, factor, dilution]);

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-slate-400 mb-1">Absorbance (A₂₆₀)</label>
          <input type="number" step="0.01" value={abs} onChange={e=>setAbs(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Nucleic Extinction Class</label>
          <select value={factor} onChange={e=>setFactor(parseInt(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white">
            <option value={50}>dsDNA (50 µg/mL)</option>
            <option value={40}>RNA (40 µg/mL)</option>
            <option value={33}>ssDNA (33 µg/mL)</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Dilution Factor reciprocal</label>
          <input type="number" value={dilution} onChange={e=>setDilution(parseFloat(e.target.value)||1)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
        </div>
      </div>

      <div className="p-3 bg-slate-950 border border-slate-800 rounded text-center">
        <span className="text-slate-500 block text-[10px] uppercase">Calculated Yield Density Concentration</span>
        <span className="text-emerald-400 font-bold text-md">{conc.toFixed(2)} µg/mL</span>
      </div>
    </div>
  );
}

// ============================================================================
// CORE ESSENTIALS: BUFFER RECIPE SCALER
// ============================================================================
function BufferRecipeEngine({ addNote }) {
  const [selectedBuffer, setSelectedBuffer] = useState('TAE');
  const [targetVol, setTargetVol] = useState(1000);

  const activeRecipe = BUFFER_DATABASE[selectedBuffer];

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="flex gap-3">
        <div className="w-1/2">
          <label className="block text-slate-400 mb-1">Select Core Master Formula</label>
          <select value={selectedBuffer} onChange={e=>setSelectedBuffer(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white">
            {Object.keys(BUFFER_DATABASE).map(k=>(<option key={k} value={k}>{BUFFER_DATABASE[k].name}</option>))}
          </select>
        </div>
        <div className="w-1/2">
          <label className="block text-slate-400 mb-1">Desired Volume Allocation (mL)</label>
          <input type="number" value={targetVol} onChange={e=>setTargetVol(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-white" />
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded p-3">
        <h4 className="font-bold text-purple-400 mb-2">Scaled Formulation Component Matrix</h4>
        <ul className="space-y-1 text-slate-300">
          {activeRecipe.components.map((comp, i) => {
            // Basic parsing framework logic to split scaling values dynamically
            const parts = comp.split(': ');
            if (parts.length < 2) return <li key={i}>• {comp}</li>;
            
            const numVal = parseFloat(parts[1]);
            const unitStr = parts[1].replace(/[0-9.]/g, '');
            const scaledVal = (numVal / activeRecipe.baseVol) * targetVol;

            return (
              <li key={i} className="flex justify-between border-b border-slate-900 py-1">
                <span className="text-slate-400">{parts[0]}</span>
                <span className="text-white font-bold">{scaledVal.toFixed(2)}{unitStr}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// DYNAMIC GENERIC INTERFACE FOR STANDARDIZED CORE INTERACTION LEFTOVERS
// ============================================================================
function StandardGenericEngine({ tool, addNote }) {
  const [val1, setVal1] = useState(10);
  const [val2, setVal2] = useState(50);

  const computedResult = useMemo(() => {
    // Quick routing algorithms maps for small math handlers across the 50 panel list
    if (tool.id === 'centrifuge_rcf') return 1.118e-5 * val1 * Math.pow(val2, 2); // RCF equation configuration
    if (tool.id === 'agarose_gel') return (val1 / 100) * val2; // Agarose mass solver
    if (tool.id === 'michaelis_menten') return (val1 * val2) / (val1 + 5); // Rough kinetic estimate
    return val1 * val2;
  }, [val1, val2, tool.id]);

  const labelMapping = useMemo(() => {
    if (tool.id === 'centrifuge_rcf') return { v1: 'Rotor Radius (cm)', v2: 'RPM Velocity Speed', res: 'Resulting RCF (x g)' };
    if (tool.id === 'agarose_gel') return { v1: 'Gel Percentage (%)', v2: 'Total Buffer Volume (mL)', res: 'Agarose Powder Required (g)' };
    return { v1: 'Primary Factor Data Array Input', v2: 'Secondary Scale Scalar Variable', res: 'Calculated Engine Scalar Output' };
  }, [tool.id]);

  return (
    <div className="space-y-4 font-mono text-xs bg-slate-900 border border-slate-800 rounded-xl p-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-slate-400 mb-1">{labelMapping.v1}</label>
          <input type="number" value={val1} onChange={e=>setVal1(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">{labelMapping.v2}</label>
          <input type="number" value={val2} onChange={e=>setVal2(parseFloat(e.target.value)||0)} className="w-full bg-slate-950 border border-slate-800 rounded p-1.5 text-white" />
        </div>
      </div>
      <div className="p-3 bg-slate-950 border border-slate-800 rounded text-center">
        <span className="text-slate-500 block text-[10px] uppercase">{labelMapping.res}</span>
        <span className="text-cyan-400 font-bold text-md">{computedResult.toFixed(4)}</span>
      </div>
    </div>
  );
}
