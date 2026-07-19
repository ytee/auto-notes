# Automotive Learning Platform (AutoLeaP)

**AutoLeaP** is a modular, static learning platform for advanced automotive engineering topics.

The platform currently contains two learning modules:

- **Functional Safety**
- **AUTOSAR Classic Platform**

Each module provides a structured 10-stage learning route with technical checkpoints, key learning points, deeper-dive prompts, architecture exercises, knowledge validation, confidence tracking and browser-retained progress.

## Platform purpose

AutoLeaP is designed as a pure automotive learning environment. It connects standards, architecture, implementation, integration, diagnostics, validation and vehicle-domain behavior in one reusable application.

The platform is intentionally:

- technically deep
- configuration-driven
- framework-free at runtime
- easy to host as a static site
- extensible to additional automotive subjects
- usable without login or a backend

## Current learning modules

### Functional Safety

100 checkpoints across 10 stages covering:

- ISO 26262 lifecycle and functional-safety management
- item definition, HARA, safety goals, FSC and TSC
- SysML, MBSE and system safety architecture
- requirements, traceability and supplier interfaces
- FMEA, FTA, DFA and ASIL decomposition
- random hardware failures and hardware metrics
- software safety architecture and verification
- brakes, ESC and vehicle-control safety
- CAN, diagnostics, production, service and validation
- safety case, architecture trade-offs and release decisions

### AUTOSAR Classic Platform

100 checkpoints across 10 stages covering:

- Classic and Adaptive platform concepts
- VFB, software components, ports and interfaces
- system design, ECU allocation and communication mapping
- ARXML, ECU Extract, ECU Configuration and generation workflow
- BSW, MCAL, ECU abstraction and Complex Drivers
- COM, PduR, CanIf, CanDrv, CanTp, CanSM, ComM, Nm and E2E
- EcuM, BswM, WdgM, Dem, Det, FiM, NvM and Dcm
- AUTOSAR OS scheduling, protection and multicore
- RTE communication, events, concurrency and service access
- integration, troubleshooting, performance and ISO 26262 interfacing

## Automotive cockpit model

AutoLeaP uses a consistent vehicle-inspired mental model:

| Platform concept | Automotive metaphor |
|---|---|
| Application | Automotive learning cockpit |
| Learning-module selector | Active subsystem selector |
| Module library | Vehicle learning garage |
| 10-stage curriculum | Learning route |
| Stage | Route stage |
| Question | Technical checkpoint |
| Topic track | Automotive system |
| Search and filters | Diagnostic filters |
| Progress | Learning odometer |
| Bookmark | Flagged checkpoint |
| Browser storage | Retained module state / NvM analogy |
| Quiz | Knowledge validation run |
| Practical exercise | Architecture exercise |

The metaphor supports understanding without changing the technical meaning of Functional Safety or AUTOSAR concepts.

## Cockpit navigation

The application contains six views:

- **Garage** — select a learning module
- **10-Day Route** — follow the staged curriculum
- **Systems** — revise by engineering system or track
- **Interface Map** — examine engineering-domain interfaces
- **Coverage Map** — review curriculum coverage
- **Validation Run** — complete quizzes and architecture exercises

## Repository architecture

```text
auto-notes/
├── index.html
├── assets/
│   ├── app.js
│   ├── styles.css
│   ├── learning-language.js
│   └── content.js
├── data/
│   ├── topics.json
│   └── autosar/
│       ├── meta.json
│       ├── day1.json
│       ├── day2.json
│       └── ...
│       └── day10.json
├── scripts/
│   └── validate-content.mjs
├── .github/
│   └── workflows/
│       └── validate-content.yml
├── package.json
└── netlify.toml
```

### File responsibilities

| File | Responsibility |
|---|---|
| `index.html` | Static cockpit shell and view placeholders |
| `assets/app.js` | Loading, state, filtering, rendering, timer and interactions |
| `assets/styles.css` | Cockpit presentation and responsive layout |
| `assets/learning-language.js` | Learning-oriented terminology normalization |
| `assets/content.js` | Existing Functional Safety learning bank |
| `data/topics.json` | Platform learning-module manifest |
| `data/autosar/meta.json` | AUTOSAR curriculum, systems, maps and validation content |
| `data/autosar/day*.json` | AUTOSAR daily checkpoint groups |
| `scripts/validate-content.mjs` | Build-time structure and language validation |
| `netlify.toml` | Static deployment and HTTP-header configuration |

## Embedded-developer mental model

| Web component | Embedded-system analogy |
|---|---|
| `index.html` | Fixed HMI layout |
| `assets/app.js` | Application control logic |
| `data/topics.json` | Top-level product configuration |
| Topic metadata | ECU or project configuration set |
| Daily JSON files | ROM-resident application datasets |
| Browser DOM | Display/output interface |
| Browser events | Callback or interrupt-driven inputs |
| `localStorage` | Small retained-memory/NvM area |
| Validator | Configuration consistency checker |
| GitHub Actions | CI quality gate |
| Netlify | Build and deployment environment |

## Browser startup sequence

```text
Browser loads index.html
        │
        ├── loads assets/styles.css
        ├── loads assets/content.js
        ├── loads assets/learning-language.js
        └── loads assets/app.js
                │
                └── bootCockpit()
                    │
                    ├── fetch data/topics.json
                    ├── populate the subsystem selector
                    ├── render module cards
                    ├── inspect the URL hash
                    ├── load the selected learning module
                    ├── restore retained browser state
                    └── render the cockpit views
```

The browser performs all runtime work locally. There is no application server, database, React runtime or backend dependency.

## Runtime controller

The main controller uses automotive-oriented names:

```javascript
let platformManifest = null;
let activeModule = null;
let activeModuleId = null;
let retainedState = {
  done: {},
  ratings: {},
  bookmarks: {}
};
```

Important functions include:

```text
bootCockpit()                 Platform startup
activateLearningModule()      Select and initialize a module
loadLearningModule()          Load metadata and checkpoints
readRetainedState()           Restore browser progress
writeRetainedState()          Persist browser progress
readDiagnosticFilters()       Read search/filter controls
renderLearningRoute()         Render the 10-stage route
renderSystemTracks()          Render system-wise learning
renderInterfaceMaps()         Render interface and coverage maps
renderKnowledgeValidation()   Render quizzes and exercises
```

## Retained browser state

Completion, confidence ratings and flags are stored by module:

```text
autoNotesNvM:safety
autoNotesNvM:autosar
```

Example state:

```json
{
  "done": {
    "A01-01": true
  },
  "ratings": {
    "A01-01": 4
  },
  "bookmarks": {
    "A01-05": true
  }
}
```

The application migrates compatible state from the earlier `autoPrepState:<module-id>` keys when needed.

This state belongs to the current browser profile and is not synchronized across devices.

## Content model

A checkpoint follows this structure:

```json
{
  "id": "A01-05",
  "day": 1,
  "tier": "Intermediate",
  "kind": "Architecture",
  "tracks": ["Architecture", "RTE"],
  "question": "Trace a wheel-speed value through the AUTOSAR layers.",
  "minutes": 6,
  "answer": [
    "Key learning point one",
    "Key learning point two"
  ],
  "probes": [
    "Deeper-dive prompt one",
    "Deeper-dive prompt two"
  ],
  "refs": [
    "RTE",
    "COM",
    "Communication Stack"
  ]
}
```

The stored field names remain stable for compatibility. The user interface presents them as learning checkpoints, key learning points and deeper-dive prompts.

## Validation

Run:

```bash
npm run validate
```

The validator checks:

- module-manifest integrity
- unique module and checkpoint IDs
- 10 stages per current module
- 100 checkpoints per current module
- 10 checkpoints per stage
- valid difficulty tiers
- required checkpoint fields
- declared engineering systems/tracks
- legacy Functional Safety compatibility
- application-script syntax
- script-loading order
- learning-oriented rendered terminology

Validation runs both in GitHub Actions and during Netlify deployment.

## Run locally

```bash
git clone https://github.com/ytee/auto-notes.git
cd auto-notes
npm run validate
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

Do not open `index.html` directly with a `file://` URL because browsers may prevent JavaScript from fetching the JSON module files.

## Add another automotive learning module

1. Add the module to `data/topics.json`.
2. Create a metadata file such as `data/<module>/meta.json`.
3. Define stages, systems, interface maps, coverage maps, quizzes and architecture exercises.
4. Add checkpoint files and list them under `questionFiles`.
5. Run `npm run validate`.
6. Preview the module locally.

For normal file-based modules, changes to `index.html` and `assets/app.js` should not be required.

## Deployment

AutoLeaP is a static Netlify-ready site.

```toml
[build]
command = "npm run validate"
publish = "."
```

Deployment sequence:

```text
Push or merge to main
        ↓
GitHub Actions validates content
        ↓
Netlify runs the same validation
        ↓
Static files are published
```

## Content principles

- Preserve technical depth and engineering context.
- Progress from foundation concepts to expert architecture scenarios.
- Connect vehicle behavior, platform architecture and safety evidence.
- Use original questions and paraphrased learning guidance.
- Keep module content vendor-neutral and release-aware where practical.
- Verify implementation details against the exact standard release and vendor stack used by a real program.
- Do not treat AUTOSAR conformance as equivalent to ISO 26262 compliance.

## Copyright and standards

AutoLeaP contains original learning checkpoints and paraphrased guidance with specification pointers. It does not reproduce ISO or AUTOSAR normative text.

Licensed standards, official AUTOSAR specifications and project-specific vendor documentation remain authoritative.