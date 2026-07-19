# Automotive Learning Model

## Purpose

Auto Notes is an automotive engineering learning platform. The application uses a restrained vehicle metaphor to make its structure memorable without hiding normal software responsibilities behind decorative terminology.

The current learning modules are:

- Functional Safety
- AUTOSAR Classic Platform

All quizzes, questions, concepts, scenarios, technical guidance, difficulty levels and references remain intact.

## Approved application vocabulary

| Software responsibility | Automotive learning term | Rationale |
|---|---|---|
| Application | Learning cockpit | The common user interface through which every module is operated |
| Topic registry | Vehicle learning manifest | Declares the learning modules available on the platform |
| Topic | Learning module / subsystem | A technical automotive area loaded independently |
| Topic selector | Active subsystem selector | Chooses the module currently shown in the cockpit |
| Topic card | Subsystem card | Entry point into a learning module |
| Ten-day plan | Learning route | Ordered path through the module |
| Day | Stage | One bounded segment of the learning route |
| Question | Checkpoint | A place where understanding is tested and recorded |
| Topic track | Automotive system | A focused technical grouping within a module |
| Search and filters | Diagnostic filters | Tools for isolating relevant checkpoints |
| Progress | Learning odometer / journey gauge | Shows completed checkpoints without implying grading |
| Bookmark | Flag | Retains a checkpoint for later attention |
| Rating | Confidence | Learner's self-assessment of understanding |
| Browser storage | Retained module state / NvM analogy | Local persistence of completion, flags and confidence |
| Quiz | Knowledge validation | A short objective knowledge check |
| Board exercise | Architecture exercise | A system-design challenge using the module content |
| Failure message | Diagnostic warning | User-facing indication that a module could not load |
| Application initialization | Cockpit boot | Loads the manifest and activates the first module |

## Terms intentionally not forced

Precise automotive words such as ECU, RTE, BSW, MCAL, NvM and diagnostics retain their real engineering meanings. They are not used as decorative substitutes where the mapping would be misleading.

Examples:

- A learning module may represent a broad domain such as Functional Safety, so it is not literally called an ECU in the data model.
- Browser persistence is compared with retained memory, but it is not presented as an AUTOSAR NvM implementation.
- Search filters are visually presented as diagnostic filters, but they do not perform vehicle diagnostics.

## Code vocabulary

The browser controller uses clear automotive-oriented identifiers:

| Previous identifier | Current identifier |
|---|---|
| `manifest` | `platformManifest` |
| `C` | `activeModule` |
| `currentTopic` | `activeModuleId` |
| `state` | `retainedState` |
| `loadState` | `readRetainedState` |
| `save` | `writeRetainedState` |
| `progress` | `updateJourneyGauge` |
| `getFilters` | `readDiagnosticFilters` |
| `match` | `checkpointMatches` |
| `card` | `renderCheckpointCard` |
| `bind` | `bindCheckpointControls` |
| `renderPlan` | `renderLearningRoute` |
| `renderTracks` | `renderSystemTracks` |
| `renderTables` | `renderInterfaceMaps` |
| `renderQuiz` | `renderKnowledgeValidation` |
| `renderStudy` | `renderActiveModule` |
| `selectTopic` | `activateLearningModule` |
| `init` | `bootCockpit` |

## Learning-only language

Employment-oriented framing is removed from the rendered application. The site uses terms such as:

- learning program
- learning route
- knowledge check
- key learning points
- deeper-dive prompts
- architecture exercise
- challenge scenarios
- confidence rating
- learning coverage

The compatibility module `assets/learning-language.js` normalizes legacy source wording when content is loaded. This allows the existing question banks to remain structurally and technically intact while ensuring that users see a pure learning experience.

The normalizer recursively processes:

- module metadata
- stage titles and descriptions
- questions
- answer guidance
- deeper-dive prompts
- quizzes
- architecture exercises
- matrices and coverage maps

The build validator applies the same normalization and fails if prohibited employment-oriented terms remain in the user-facing learning model.

## Retained-state migration

The previous browser storage key was:

```text
autoPrepState:<topic-id>
```

The cockpit now stores state under:

```text
autoNotesNvM:<module-id>
```

On first access, the application copies existing state from the old key when the new key is absent. Completion, confidence ratings and flags are therefore preserved.

## Visual language

The UI uses a generic, brand-independent automotive visual system:

- dark cockpit header
- cyan/teal operational indicators
- amber warning accents
- learning odometer
- subsystem status cards
- circular stage indicators
- dashboard-style navigation
- interface and coverage maps

The design does not imitate any specific vehicle manufacturer or instrument cluster.

## Future structural refactoring

Possible later boundaries are:

```text
platform/
  cockpit/
  retained-state/
  diagnostics/

modules/
  safety/
  autosar/

config/
  vehicle-learning-manifest.json
```

Folder moves should be made only when the code is split into real responsibility-based modules. The automotive metaphor should improve comprehension rather than create ceremony.
