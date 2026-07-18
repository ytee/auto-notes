# Automotive Engineering Preparation Library

A static, Netlify-ready interview-preparation website with independent topic modules.

## Available topics

### Functional Safety

100 questions across 10 days covering ISO 26262, FSM, HARA, SysML/MBSE, system architecture, brakes, ESC/control, requirements, FMEA/FTA/DFA, ASIL decomposition, hardware, software, CAN/OBD, V&V, suppliers, safety case and leadership.

### AUTOSAR Classic Platform

100 questions across 10 days covering:

- Architecture, Classic vs Adaptive, VFB and software components
- AUTOSAR system design, ports, interfaces, data types and ECU allocation
- ARXML, System Description, ECU Extract, ECU Configuration and generation workflow
- BSW, MCAL, ECU abstraction, Complex Drivers and variants
- COM, PduR, CanIf, CanDrv, CanTp, CanSM, ComM, Nm and E2E
- EcuM, BswM, WdgM, Dem, Det, FiM, NvM and Dcm
- AUTOSAR OS scheduling, resources, protection and multicore
- RTE communication, events, concurrency and service access
- Integration, troubleshooting, performance and supplier handovers
- Domain-to-AUTOSAR-to-ISO 26262 interfacing using brake and ESC examples

## Architecture

```text
index.html                 Reusable application shell
assets/app.js              Topic loader and study application
assets/styles.css          Shared presentation
assets/content.js          Existing Functional Safety module
data/topics.json           Topic registry
data/autosar/meta.json      AUTOSAR curriculum and topic metadata
data/autosar/day*.json      AUTOSAR daily question modules
scripts/validate-content.mjs Content validation
```

The application supports both the original Safety module and file-based topic modules. Progress, ratings and bookmarks are namespaced per topic in browser local storage.

## Add another topic

1. Add one topic entry to `data/topics.json`.
2. Add a metadata JSON file containing the curriculum, tracks, interface matrix, focus map and quiz.
3. Add one or more question JSON files and list them in `questionFiles`.
4. Run `npm run validate`.

No changes to `index.html` or `assets/app.js` are normally required.

## Run locally

```bash
npm run validate
python3 -m http.server 8000
```

Open `http://localhost:8000`.

## Netlify

This is a static site.

- Build command: `npm run validate`
- Publish directory: `.`

## Content principles

- Questions progress from foundation to expert-level architecture and leadership scenarios.
- Answers contain structured guidance and interviewer probes rather than copied standard text.
- Domain behavior, platform design and safety-standard interfaces are treated together.
- AUTOSAR material is release-neutral unless a release is explicitly mentioned; use the exact project release and vendor documentation for implementation decisions.

## Copyright

This study aid contains original questions and paraphrased guidance with specification pointers. It does not reproduce ISO or AUTOSAR normative text. Licensed standards and official project specifications remain authoritative.


----
# How this site is setup ?

## 1. The simplest mental model

This website is a **configuration-driven static application**.

From an embedded perspective:

| Web component                  | Embedded-system analogy                                   |
| ------------------------------ | --------------------------------------------------------- |
| `index.html`                   | Hardware-independent application shell / fixed HMI layout |
| `assets/app.js`                | Application control logic                                 |
| `assets/styles.css`            | Display configuration and presentation                    |
| `data/topics.json`             | Top-level product configuration                           |
| `data/autosar/meta.json`       | ECU/project configuration set                             |
| `data/autosar/day*.json`       | ROM-resident application data or calibration datasets     |
| Browser DOM                    | Display/output device                                     |
| Browser events                 | Interrupts or callback events                             |
| `localStorage`                 | Small NVRAM/NvM area                                      |
| `scripts/validate-content.mjs` | Build-time configuration consistency checker              |
| Netlify                        | Build and deployment system                               |
| GitHub Actions                 | CI quality gate                                           |

There is no application server, database, React framework, build bundler, or runtime package dependency. The browser downloads HTML, CSS, JavaScript and JSON files and executes everything locally.

---

# 2. Repository structure

```text
prep-notes/
├── index.html
├── assets/
│   ├── app.js
│   ├── styles.css
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

The existing Safety content remains in `assets/content.js`. AUTOSAR uses the newer modular JSON structure. The application supports both formats through a compatibility function called `normalizeLegacy()`.

---

# 3. Browser startup sequence

When someone opens the website, this is the execution flow:

```text
Browser requests index.html
        │
        ├── loads assets/styles.css
        │
        ├── loads assets/content.js
        │       └── creates window.PREP_CONTENT for Safety
        │
        └── loads assets/app.js
                │
                └── init()
                    │
                    ├── fetch data/topics.json
                    ├── populate topic selector
                    ├── create topic cards
                    ├── inspect URL hash
                    ├── select initial topic
                    ├── load topic content
                    ├── load browser state
                    └── render the page
```

The two scripts are loaded at the bottom of `index.html`, with `content.js` loaded before `app.js`. This ensures the legacy Safety global is available when the application starts.

The actual startup function is:

```javascript
async function init() {
    manifest = await fetch('data/topics.json')...
    ...
    await selectTopic(initial, false);
    showView('topics');
}
```

The function is asynchronous because topic files are fetched over HTTP.

---

# 4. `index.html`: the static application shell

`index.html` contains almost no study content. It defines empty placeholders that JavaScript fills at runtime.

For example:

```html
<h1 id="topicTitle">Preparation Library</h1>
<p id="topicSubtitle">Choose a topic to begin.</p>
<select id="topicSelect"></select>
```

The IDs are comparable to handles or symbolic references:

```text
topicTitle
topicSubtitle
topicSelect
progressText
daySections
trackCards
matrixBody
quiz
```

JavaScript obtains these elements and updates them.

The page contains six logical views:

```text
Topics
10-Day Plan
Topic Tracks
Domain Interface
Focus Map
Mock Interview
```

All views exist in the HTML simultaneously. CSS hides inactive views, and JavaScript changes which one is active.

This is not page navigation in the traditional sense. It is closer to switching HMI screens within one executable.

---

# 5. `data/topics.json`: the topic registry

This file is the root configuration.

```json
{
  "schemaVersion": 1,
  "topics": [
    {
      "id": "safety",
      "legacyGlobal": "PREP_CONTENT"
    },
    {
      "id": "autosar",
      "content": "data/autosar/meta.json",
      "questionFiles": [
        "data/autosar/day1.json",
        "...",
        "data/autosar/day10.json"
      ]
    }
  ]
}
```

It tells the loader:

* Which topics exist
* The topic ID
* What text to show on the topic-selection screen
* Where metadata is stored
* Where question files are stored
* Whether the topic uses the old JavaScript-global format

The Safety entry says:

```json
"legacyGlobal": "PREP_CONTENT"
```

The AUTOSAR entry instead points to JSON files.

An embedded analogy would be a root configuration table containing pointers to module-specific configuration sets.

---

# 6. `data/autosar/meta.json`: topic configuration

This file contains everything about AUTOSAR except the 100 detailed questions.

It contains:

```text
Topic title and subtitle
Study method
Case study
10-day curriculum
Topic tracks
Domain interface matrix
Focus map
Mock quiz
Board exercise
Reference information
```

For example, its `days` array defines the curriculum:

```json
{
  "day": 7,
  "title": "AUTOSAR OS in Depth",
  "focus": "Tasks, events, scheduling, resources...",
  "deliverable": "Create an OS task/runnable map...",
  "target": "50–60 min"
}
```

The UI does not know that Day 7 is about OS. It simply iterates through this array and renders whatever configuration is present.

Likewise, the `tracks` array configures the track-filter screen:

```json
{
  "name": "RTE",
  "desc": "Contract, communication APIs, events...",
  "iso": "AUTOSAR Runtime Environment"
}
```

This is a strong separation:

```text
Application logic: app.js
AUTOSAR content/configuration: meta.json and day*.json
```

---

# 7. `day1.json` to `day10.json`: question data

Each file is an array of ten question objects.

A question has the structure:

```json
{
  "id": "A01-05",
  "day": 1,
  "tier": "Intermediate",
  "kind": "Architecture",
  "tracks": ["Architecture", "RTE"],
  "question": "Trace a wheel-speed value...",
  "minutes": 6,
  "answer": [
    "First expected point",
    "Second expected point"
  ],
  "probes": [
    "Follow-up question one",
    "Follow-up question two"
  ],
  "refs": [
    "RTE",
    "COM",
    "Communication Stack"
  ]
}
```

The application treats each question like a data structure:

```c
typedef struct
{
    char *id;
    uint8_t day;
    Tier tier;
    char **tracks;
    char *question;
    uint8_t minutes;
    char **answer;
    char **probes;
    char **refs;
} Question;
```

JavaScript is dynamically typed, so there is no explicit struct declaration, but conceptually this is what the JSON represents.

---

# 8. `assets/app.js`: the application logic

The entire runtime behavior is in this file.

## 8.1 Module encapsulation

The file begins with:

```javascript
(() => {
   ...
})();
```

This is an **Immediately Invoked Function Expression**, or IIFE.

For a C developer, think of it as making nearly everything in the file `static`:

```c
static TopicManifest *manifest;
static TopicContent *current_content;
static AppState state;
```

Variables inside the function do not pollute the global browser namespace.

---

## 8.2 Main runtime variables

```javascript
let manifest = null;
let C = null;
let currentTopic = null;
let state = {
    done: {},
    ratings: {},
    bookmarks: {}
};
```

Meaning:

* `manifest`: contents of `data/topics.json`
* `C`: currently loaded topic content
* `currentTopic`: `"safety"` or `"autosar"`
* `state`: user-specific progress data

`C` is similar to an active configuration pointer:

```c
const TopicConfig *activeTopicConfig;
```

---

## 8.3 DOM access helpers

```javascript
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
```

Examples:

```javascript
$('#topicTitle')
$$('.tab')
```

Equivalent conceptual C-style operations:

```c
Widget *title = get_widget_by_id("topicTitle");
WidgetList tabs = get_widgets_by_class("tab");
```

The `$` function returns one element.
The `$$` function returns all matching elements.

---

## 8.4 Escaping output

```javascript
const esc = s => String(s ?? '').replace(...);
```

This converts special characters such as `<`, `>`, `&` and quotes before inserting content into HTML.

Its purpose is similar to input sanitization at an interface boundary. Without this, content could accidentally be interpreted as HTML or script.

---

# 9. Topic loading

The core loading function is:

```javascript
async function loadTopic(meta)
```

It supports two paths.

## Safety path

```text
meta.legacyGlobal exists
        │
        ├── read window.PREP_CONTENT
        └── normalizeLegacy()
```

## AUTOSAR path

```text
fetch meta.json
        │
        ├── fetch day1.json
        ├── fetch day2.json
        ├── ...
        └── fetch day10.json
                │
                └── flatten into base.questions
```

The question files are loaded using:

```javascript
Promise.all(...)
```

This means the browser requests all ten daily files concurrently instead of sequentially.

After loading, this operation:

```javascript
base.questions = groups.flat();
```

turns:

```text
[
  [Day 1 questions],
  [Day 2 questions],
  ...
]
```

into:

```text
[
  Question 1,
  Question 2,
  ...
  Question 100
]
```

---

# 10. Selecting a topic

The function:

```javascript
selectTopic(id, openPlan)
```

performs the complete topic transition.

```text
Find topic in manifest
        ↓
Load content
        ↓
Set currentTopic
        ↓
Load topic-specific state
        ↓
Update heading and subtitle
        ↓
Populate filters
        ↓
Render all content
        ↓
Update URL hash
        ↓
Show study plan
```

The URL becomes something like:

```text
#topic=autosar
```

This is a lightweight routing mechanism. Reloading that URL preserves the topic selection.

---

# 11. Rendering model

The application uses direct DOM rendering.

Main rendering functions:

```text
renderPlan()
renderTracks()
renderTables()
renderQuiz()
renderStudy()
```

`renderStudy()` calls all the others:

```javascript
function renderStudy() {
    if (!C) return;
    renderPlan();
    renderTracks();
    renderTables();
    renderQuiz();
    progress();
}
```

For example, `renderPlan()` performs operations similar to:

```javascript
C.days.map(...)
C.questions.filter(...)
qs.map(card)
```

Meaning:

1. Iterate over days
2. Select questions belonging to that day
3. Apply active filters
4. Convert each question into HTML
5. Insert the generated HTML into the page

Conceptually:

```c
for each day:
    filtered_questions = filter(all_questions, day, user_filter);
    render_day_header(day);
    for each question in filtered_questions:
        render_question_card(question);
```

---

# 12. The `card()` function

`card(q)` converts one question object into an HTML card.

Input:

```text
Question JSON object
```

Output:

```text
HTML string
```

It generates:

* Difficulty tag
* Question type
* Topic tracks
* Estimated time
* Question
* Bookmark button
* Complete button
* Rating buttons
* Expected answer
* Interview probes
* Reference map

This is broadly similar to a serialization or view-formatting function:

```c
void QuestionView_Render(const Question *q, HtmlBuffer *output);
```

---

# 13. Event binding

After cards are inserted into the DOM, `bind()` connects buttons to callback functions.

Examples:

```javascript
el.querySelector('.complete').onclick = () => {
    state.done[id] = !state.done[id];
    save();
    renderStudy();
};
```

This is event-driven programming:

```c
void CompleteButton_Callback(QuestionId id)
{
    state.done[id] = !state.done[id];
    NvM_WriteBlock(...);
    Ui_Render();
}
```

The application re-renders after completion, bookmarking or rating.

---

# 14. State persistence: browser `localStorage`

The storage key is:

```javascript
autoPrepState:${currentTopic}
```

So the actual keys are similar to:

```text
autoPrepState:safety
autoPrepState:autosar
```

This prevents Safety progress from interfering with AUTOSAR progress.

The stored object is:

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

Loading and saving are handled by:

```javascript
localStorage.getItem(...)
localStorage.setItem(...)
```

Embedded analogy:

```text
localStorage      → NvM
storage key       → block ID
JSON serialization → NvM block serialization
save()            → NvM_WriteBlock()
loadState()       → NvM_ReadBlock()
```

Important limitation: this data belongs only to that browser profile. It is not synchronized to other devices. The footer explicitly informs users of this.

---

# 15. Filtering logic

When the user searches or selects filters, `getFilters()` collects:

```text
Search text
Difficulty
Track
Completion status
```

`match(q, f)` determines whether a question should be displayed.

It creates one searchable string from:

```text
Question
Question kind
Difficulty
Tracks
Answer guidance
Probes
References
```

Then it checks the active constraints.

This is essentially a combinational predicate:

```c
bool Question_Matches(const Question *q, const Filter *f);
```

---

# 16. Timer implementation

The timer starts at:

```javascript
45 * 60
```

seconds.

`setInterval()` calls a function every second:

```text
decrement seconds
update display
stop when zero
```

This is comparable to a periodic software timer callback, although browser timing is not real-time and is not deterministic.

The timer is suitable for interview practice, but it should never be understood as equivalent to an AUTOSAR OS alarm or real-time timer.

---

# 17. Content validation

`scripts/validate-content.mjs` is the build-time consistency checker.

It verifies:

* Exactly 10 days
* Exactly 100 questions
* Exactly 10 questions per day
* Unique question IDs
* Valid day references
* Valid difficulty values
* Positive time values
* Required fields
* Non-empty answer, probe, track and reference arrays
* Declared track names

For modular topics it:

1. Reads `data/topics.json`
2. Reads the metadata file
3. Reads all question files
4. Flattens the questions
5. Checks all relationships

Embedded analogy:

```text
ARXML schema validation
Configuration consistency checks
Generator precondition checks
Link-time integrity checking
```

The validator also executes the old `content.js` inside a Node `vm` sandbox so it can validate the Safety topic without launching a browser.

---

# 18. `package.json`

This repository does not use Node.js for the website runtime.

Node.js is used only to run the validation script:

```json
"scripts": {
  "validate": "node scripts/validate-content.mjs"
}
```

Therefore:

```text
Browser runtime → plain JavaScript
Build validation → Node.js
```

No `npm install` is currently necessary because the validator uses only built-in Node modules:

```text
fs
path
vm
```

---

# 19. Netlify deployment

`netlify.toml` tells Netlify:

```toml
[build]
command = "npm run validate"
publish = "."
```

Meaning:

1. Run validation
2. If validation fails, stop deployment
3. If validation succeeds, publish the repository root as a static website

It also adds HTTP security headers and tells browsers to revalidate files under `/data`, helping updated topic data become visible after deployment.

---

# 20. GitHub Actions

The repository also validates on:

```text
Every pull request
Every push to main
```

The workflow:

1. Checks out the repository
2. Sets up Node.js 20
3. Runs `npm run validate`

This provides two independent gates:

```text
GitHub Actions → repository integration check
Netlify build  → deployment check
```

---

# 21. How to run and debug locally

Clone and enter the repository:

```bash
git clone https://github.com/ytee/prep-notes.git
cd prep-notes
```

Validate the data:

```bash
npm run validate
```

Start a static HTTP server:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

These are the documented local-development steps.

Do not open `index.html` directly using a `file://` URL. Browser security rules may prevent `fetch()` from loading JSON files. The code displays an error recommending Netlify or a local HTTP server when loading fails.

## Browser debugging

In Chrome:

```text
View → Developer → Developer Tools
```

Useful tabs:

* **Console**: JavaScript errors
* **Network**: Confirm `topics.json`, `meta.json` and day files loaded
* **Elements**: Inspect generated HTML
* **Application → Local Storage**: Inspect saved progress
* **Sources**: Add breakpoints in `assets/app.js`

A useful first breakpoint is inside:

```javascript
selectTopic()
```

Then follow:

```text
selectTopic
  → loadTopic
  → loadState
  → populateFilters
  → renderStudy
```

---

# 22. How to add a future topic

Suppose the next topic is ASPICE.

## Step 1: Register it

Add to `data/topics.json`:

```json
{
  "id": "aspice",
  "title": "Automotive SPICE",
  "subtitle": "Processes × Assessments × Evidence",
  "description": "Senior-level ASPICE preparation.",
  "content": "data/aspice/meta.json",
  "questionFiles": [
    "data/aspice/day1.json",
    "data/aspice/day2.json"
  ]
}
```

## Step 2: Add metadata

```text
data/aspice/meta.json
```

It should contain the same broad fields as AUTOSAR:

```text
title
subtitle
days
tracks
matrix
focusMap
quiz
boardExercise
```

## Step 3: Add questions

```text
data/aspice/day1.json
...
data/aspice/day10.json
```

## Step 4: Validate

```bash
npm run validate
```

The application shell normally needs no change.

---

# 23. Current strengths

The current design has several useful qualities:

* Very small runtime footprint
* No external JavaScript framework
* No server or database maintenance
* Content and application behavior are separated
* New topics are data-driven
* Deployment is inexpensive and simple
* Validation prevents common content errors
* Browser progress is isolated per topic
* Content can be reviewed as plain JSON
* Netlify can deploy directly from GitHub

---

# 24. Current technical debt

## 24.1 Safety uses a legacy format

Safety remains in:

```text
assets/content.js
```

AUTOSAR uses:

```text
data/autosar/*.json
```

`normalizeLegacy()` hides the difference at runtime. This works, but the clean long-term design would migrate Safety into:

```text
data/safety/meta.json
data/safety/day1.json
...
data/safety/day10.json
```

Then the legacy branch and `normalizeLegacy()` could be removed.

## 24.2 `app.js` has too many responsibilities

It currently handles:

```text
Data loading
State management
Routing
Filtering
HTML generation
Event handling
Timer
Rendering
Legacy compatibility
```

For learning and maintainability, it could eventually be divided into:

```text
assets/js/main.js
assets/js/topic-loader.js
assets/js/state-store.js
assets/js/renderers.js
assets/js/router.js
assets/js/timer.js
```

## 24.3 Whole-view rerendering

When one question is marked complete, `renderStudy()` rebuilds all study views.

With 100 questions this is acceptable. With many topics and thousands of questions, a more selective update would be preferable.

## 24.4 Validator is curriculum-specific

The validator hardcodes:

```text
10 days
100 questions
10 questions per day
```

That is correct for the current preparation format, but future topics may need a configurable curriculum size.

## 24.5 No formal JSON Schema yet

The validator is handwritten. A future improvement would be a JSON Schema defining:

```text
TopicManifest
TopicMetadata
Day
Track
Question
QuizEntry
BoardExercise
```

This would improve editor support and validation clarity.

---

## Recommended learning order

Read the code in this sequence:

1. `data/topics.json`
2. `data/autosar/meta.json`
3. `data/autosar/day1.json`
4. `index.html`
5. `assets/app.js` functions `init()`, `selectTopic()` and `loadTopic()`
6. `renderStudy()`, `renderPlan()` and `card()`
7. `loadState()` and `save()`
8. `scripts/validate-content.mjs`
9. `netlify.toml`
10. GitHub Actions workflow

The most useful first exercise is to add a temporary third topic with one copied AUTOSAR dataset, change its title, run the validator, and observe how the same application shell renders it.


