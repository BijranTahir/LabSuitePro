# Lab Suite Pro v8 Architecture

## Layers

1. **Scientific catalog** — calculators, domain modules, biological fields and methods.
2. **Execution engines** — dedicated calculations plus recovered equation-based calculators.
3. **Data layer** — CSV/TSV local tables, raw/derived separation, QC and project export.
4. **Visualization** — local SVG plots and scientific result views.
5. **Instrument reality layer** — what/how/why/requirements/output and measurement boundaries.
6. **Provenance** — project history and exported project metadata.
7. **Reference infrastructure** — units, constants, file-format and scientific-reference families.

## Module status contract

- `implemented`: executable local engine exists.
- `framework`: registered/documented area without an unsupported fabricated result.
- `analysis_only`: physical measurement must occur elsewhere; Lab Suite Pro analyses supplied data.
- `reference`: structured knowledge/reference record.

This status contract is enforced at runtime for modules that do not have an executable engine or recovered calculator entry.
