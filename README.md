# Lab Suite Pro

**Universal Scientific Workstation — v8 production-integrity build**

Lab Suite Pro is a browser-first scientific environment for calculations, scientific data analysis, visualization, biological-science workflows, method/reference knowledge and reproducible project documentation.

## Included

- 359 recovered scientific calculators
- 803 registered scientific modules after biological-science expansion
- 32 biological fields
- 73 biological quantitative calculators
- 104 scientific method/instrument records
- 31 instrument-method records with explicit measurement boundaries
- Data Lab with editable local table, CSV import/export, QC/statistics and project JSON export
- Regression/statistics and scientific calculation foundations
- BioScience Workbench covering biochemistry, biophysics, bioinformatics, molecular biology, genetics, genomics, proteomics, metabolomics, systems biology, structural biology, microbiology, immunology, physiology, neuroscience, ecology, plant science, zoology, biomedical science, epidemiology, synthetic biology and related areas
- XRD/Raman/FTIR/SEM/TEM/AFM/XPS/DLS/BET/TGA/DSC/NMR/chromatography/mass-spectrometry/flow-cytometry and related instrument knowledge with a strict physical-measurement boundary
- Scientific file-format and reference infrastructure
- Offline-first project structure for GitHub Pages

## Scientific integrity

A method name is not treated as a measurement. Lab Suite Pro distinguishes:

1. **Local calculation** — executable from supplied values/data.
2. **Instrument-data analysis** — requires real exported/raw measurement data first.
3. **Physical measurement** — requires the actual scientific instrument, appropriate sample preparation, calibration and safety controls.

For example, Lab Suite Pro can calculate crystallite size from supplied XRD peak parameters, but it cannot acquire an XRD pattern from a phone. The same rule applies to Raman, FTIR, SEM, TEM, AFM, XPS, DLS, BET, TGA, DSC, NMR, HPLC, GC-MS, flow cytometry, sequencing and other physical measurement systems.

## Validation

Run:

```bash
node tests/validate.mjs
```

The test suite verifies catalog integrity, biological coverage, representative numerical benchmarks and the instrument-reality boundary.

## Documentation

- `docs/Lab_Suite_Pro_EVERYTHING_Master_Feature_Catalog.docx`
- `docs/Lab_Suite_Pro_Complete_Science_Roadmap.docx`
- `docs/SCIENTIFIC_BOUNDARIES.md`
- `docs/ARCHITECTURE.md`
- `docs/VALIDATION_REPORT.md`

## Developer

**Tahir Ahmad Bijran**  
B.Sc. (Hons.) Biotechnology — Central University of Kashmir
