# 10-Day Curriculum

## Day 1 — FSM Foundations and Safety Leadership

**Focus:** Vocabulary, lifecycle, timing, safety case, culture and confirmation measures.  
**Target:** 45–55 min  
**Deliverable:** One-page lifecycle map plus a fault-to-safety-evidence trace.

- **D1Q1 [Foundation]** What is automotive functional safety, and how does it differ from reliability, quality, cybersecurity, and SOTIF? (4 min) — *FSM, Core Concepts*
- **D1Q2 [Foundation]** Walk through the automotive safety lifecycle and name the principal evidence from concept to decommissioning. (5 min) — *FSM, Lifecycle*
- **D1Q3 [Foundation]** Differentiate item, system, element, component, hardware part and software unit using ESC. (4 min) — *Core Concepts, System Architecture*
- **D1Q4 [Foundation]** Explain hazard, hazardous event, malfunctioning behavior, safety goal, safety requirement and safety mechanism. (4 min) — *Core Concepts, HARA*
- **D1Q5 [Foundation]** Describe fault → error → failure and distinguish systematic faults from random hardware faults. (4 min) — *Core Concepts, Safety Analysis*
- **D1Q6 [Intermediate]** For electronic braking, what can safe state, degraded state and emergency operation mean? (5 min) — *FSM, Control Functions, Brakes*
- **D1Q7 [Intermediate]** Explain FTTI, detection time, reaction time and allocated fault-handling time using an ESC actuator fault. (5 min) — *FSM, Timing, System Architecture*
- **D1Q8 [Intermediate]** What is a safety case, and what makes it convincing? (5 min) — *FSM, Safety Case*
- **D1Q9 [Advanced]** A project follows templates but suppresses safety concerns to protect schedule. Is it functionally safe? (5 min) — *FSM, Leadership*
- **D1Q10 [Advanced]** Differentiate confirmation review, functional-safety audit and functional-safety assessment. (5 min) — *FSM, Assessment*

## Day 2 — Item Definition, HARA and Functional Safety Concept

**Focus:** Brake/ESC item boundary, hazardous events, ASIL, safety goals and degraded operation.  
**Target:** 50–60 min  
**Deliverable:** Mini HARA and FSC for unintended braking.

- **D2Q1 [Foundation]** Create an item definition boundary for ESC. What belongs inside, outside and at the interfaces? (5 min) — *HARA, Brakes, ESC*
- **D2Q2 [Foundation]** Why should HARA begin with item-level malfunctioning behavior rather than a component FMEA list? (4 min) — *HARA, Brakes*
- **D2Q3 [Intermediate]** List representative hazardous events for unintended braking, loss of braking support and incorrect ESC intervention. (6 min) — *HARA, Brakes, ESC*
- **D2Q4 [Intermediate]** Justify Severity, Exposure and Controllability for unintended differential braking on a highway curve. (6 min) — *HARA, ASIL*
- **D2Q5 [Intermediate]** Draft implementation-independent safety goals for unintended braking and loss of braking support. (5 min) — *HARA, Safety Goals, Brakes*
- **D2Q6 [Intermediate]** Derive functional safety requirements preventing hazardous unintended ESC yaw intervention. (6 min) — *FSC, Brakes, ESC*
- **D2Q7 [Advanced]** Why can a fail-silent concept be insufficient for braking and stability functions? (6 min) — *FSC, Availability, Brakes*
- **D2Q8 [Advanced]** A team claims a dashboard warning lowers controllability because it appears within two seconds. Challenge it. (5 min) — *HARA, Brakes, Human Factors*
- **D2Q9 [Advanced]** A sport ESC mode allows larger sideslip before intervention. What safety work must be revisited? (5 min) — *HARA, Change Management, ESC*
- **D2Q10 [Advanced]** What weaknesses do you look for in a brake or ESC HARA? (5 min) — *HARA, Review*

## Day 3 — SysML, MBSE and System Safety Architecture

**Focus:** Requirements, interfaces, behavior, TSC, HSI, independence and architecture review.  
**Target:** 50–60 min  
**Deliverable:** Logical ESC architecture with safety interfaces and modes.

- **D3Q1 [Foundation]** Which SysML views are useful for functional safety and what question does each answer? (4 min) — *SysML, MBSE, System Architecture*
- **D3Q2 [Foundation]** Model the trace from hazardous event to safety validation. (5 min) — *SysML, Requirements*
- **D3Q3 [Intermediate]** Create a logical ESC architecture and identify safety-relevant interfaces. (6 min) — *SysML, System Architecture, ESC*
- **D3Q4 [Intermediate]** Use state and sequence models to describe normal, degraded, emergency and safe-state behavior. (5 min) — *SysML, Behavior, Control Functions*
- **D3Q5 [Intermediate]** What is the difference between FSC and TSC? (5 min) — *System Architecture, TSC, Allocation*
- **D3Q6 [Intermediate]** What belongs in the HSI for a safety-related brake ECU? (6 min) — *System Architecture, HSI, Hardware, Software*
- **D3Q7 [Advanced]** Two redundant yaw channels use separate algorithms but the same supply and clock. Can independence or ASIL decomposition be claimed? (6 min) — *System Architecture, DFA, Independence*
- **D3Q8 [Advanced]** Explain freedom from interference at system and software levels. (5 min) — *System Architecture, Freedom from Interference, Software*
- **D3Q9 [Advanced]** A SysML model and DOORS database disagree on an interface timeout. Which is authoritative and what do you do? (5 min) — *SysML, Review, Configuration Management*
- **D3Q10 [Advanced]** What ten questions do you ask before approving an ESC TSC? (6 min) — *System Architecture, Brakes, Review*

## Day 4 — Requirements, Traceability, Suppliers and Configuration

**Focus:** DOORS/Polarion, DIA, SEooC, reuse, change and configuration management.  
**Target:** 45–55 min  
**Deliverable:** Traceability and supplier-interface checklist.

- **D4Q1 [Foundation]** What makes a safety requirement reviewable, implementable and verifiable? (4 min) — *Requirements, FSM*
- **D4Q2 [Foundation]** Design a traceability chain for an unintended-braking safety goal. (5 min) — *Requirements, Traceability*
- **D4Q3 [Intermediate]** Review: “The ECU shall detect all wheel-speed sensor failures.” What is wrong? (5 min) — *Requirements, Verification*
- **D4Q4 [Intermediate]** How would you structure DOORS or Polarion for safety requirements, tests, analyses and releases? (5 min) — *DOORS/Polarion, Requirements, Job Focus*
- **D4Q5 [Intermediate]** A wheel-speed filter constant changes late in validation. Describe the safety response. (5 min) — *Change Management, Configuration Management, FSM*
- **D4Q6 [Intermediate]** What should a Development Interface Agreement contain for an ESC ECU supplier? (5 min) — *Supplier, DIA, FSM*
- **D4Q7 [Advanced]** Explain SEooC and Assumptions of Use when integrating a safety MCU. (5 min) — *SEooC, Supplier, System Architecture*
- **D4Q8 [Advanced]** A legacy brake component was not developed to ISO 26262. How can its use be justified? (5 min) — *Reuse, Legacy, FSM*
- **D4Q9 [Advanced]** An OEM allocates ASIL-D requirements but withholds goals and use assumptions. How do you proceed? (6 min) — *Supplier, Leadership, Requirements*
- **D4Q10 [Advanced]** What metrics govern safety requirements without encouraging superficial compliance? (5 min) — *Requirements, Review, Job Focus*

## Day 5 — FMEA, FTA, DFA and ASIL Decomposition

**Focus:** Safety-oriented analyses and their feedback into architecture.  
**Target:** 50–60 min  
**Deliverable:** Mini FMEA + FTA + DFA for one ESC fault path.

- **D5Q1 [Foundation]** Compare FMEA and FTA. Why should a senior safety engineer use both? (4 min) — *Safety Analysis, FMEA, FTA*
- **D5Q2 [Intermediate]** Perform a mini-FMEA for a wheel-speed signal used by ABS and ESC. (6 min) — *FMEA, Brakes, Sensors*
- **D5Q3 [Intermediate]** Build the first two levels of an FTA for hazardous unintended braking. (6 min) — *FTA, Brakes, Unintended Braking*
- **D5Q4 [Intermediate]** Differentiate common-cause, cascading, common-mode failure and dependent-failure initiator. (5 min) — *DFA, System Architecture, ESC*
- **D5Q5 [Advanced]** Perform a DFA thought exercise on two-channel steering-angle acquisition. (6 min) — *DFA, ESC, Workshop*
- **D5Q6 [Advanced]** Explain ASIL decomposition, prerequisites and common misuse. (6 min) — *ASIL Decomposition, System Architecture*
- **D5Q7 [Advanced]** An ASIL-D brake monitor shares a multicore SoC with a QM logger. What must be shown? (5 min) — *Coexistence, Freedom from Interference, Software*
- **D5Q8 [Advanced]** An independent monitor reads the same corrupted RAM value as the controller. What next? (5 min) — *Safety Analysis, Architecture Iteration*
- **D5Q9 [Advanced]** How do undocumented assumptions undermine safety analyses and hardware metrics? (5 min) — *Safety Analysis, Assumptions, Review*
- **D5Q10 [Advanced]** What makes a safety analysis complete enough for release? (5 min) — *Safety Analysis, Review*

## Day 6 — Hardware Safety and Random Hardware Failures

**Focus:** HSRs, fault classes, SPFM/LFM, PMHF, sensors, MCU and actuator safety.  
**Target:** 50–60 min  
**Deliverable:** Hardware safety concept and diagnostic evidence plan.

- **D6Q1 [Foundation]** How are hardware safety requirements derived and coordinated with software? (4 min) — *Hardware, Requirements*
- **D6Q2 [Foundation]** Classify single-point, residual, detected/perceived/latent dual-point and safe faults. (4 min) — *Hardware, Safety Analysis*
- **D6Q3 [Intermediate]** Explain SPFM and LFM without relying only on formulas. (5 min) — *Hardware, Metrics*
- **D6Q4 [Intermediate]** What is PMHF, and how does it differ from SPFM/LFM and ordinary reliability? (5 min) — *Hardware, PMHF*
- **D6Q5 [Intermediate]** Design a hardware safety concept for brake-pressure sensing. (6 min) — *Hardware, Sensors, Brakes*
- **D6Q6 [Advanced]** A safety MCU provides lockstep, ECC, watchdog and clock monitor. What integration evidence is still required? (6 min) — *Hardware, MCU, SEooC*
- **D6Q7 [Advanced]** Analyze unintended energization of a hydraulic valve driver. (6 min) — *Hardware, Actuators, Brakes*
- **D6Q8 [Advanced]** How do you choose diagnostic test intervals for latent brake faults? (5 min) — *Hardware, Latent Faults, Diagnostics*
- **D6Q9 [Advanced]** How would you demonstrate diagnostic coverage for a wheel-speed input path? (5 min) — *Hardware, Fault Injection, Verification*
- **D6Q10 [Advanced]** What red flags do you look for in an FMEDA or PMHF report? (5 min) — *Hardware, Review*

## Day 7 — Software Safety Architecture and Verification

**Focus:** SSRs, FFI, monitoring, unit/integration verification, MBD and tool confidence.  
**Target:** 50–60 min  
**Deliverable:** Software safety architecture review sheet.

- **D7Q1 [Foundation]** How are software safety requirements derived and what attributes matter? (4 min) — *Software, Requirements*
- **D7Q2 [Foundation]** What qualities should ESC software safety architecture demonstrate? (5 min) — *Software, Architecture*
- **D7Q3 [Intermediate]** How are memory, timing, execution and communication interference controlled? (5 min) — *Software, Freedom from Interference*
- **D7Q4 [Intermediate]** Design a software safety monitor for an ESC yaw-moment request. (6 min) — *Software, Safety Mechanisms, ESC*
- **D7Q5 [Intermediate]** Which design and coding practices matter for ASIL-C/D control software? (5 min) — *Software, Unit Design, Coding*
- **D7Q6 [Intermediate]** What roles do requirements tests, structural coverage, static analysis and fault injection play? (5 min) — *Software, Unit Verification*
- **D7Q7 [Advanced]** A brake task misses deadlines only when diagnostics and CAN logging are active. How do you respond? (6 min) — *Software, Integration, Timing*
- **D7Q8 [Advanced]** How do model-based development and code generation change the evidence strategy? (5 min) — *Software, Model-Based Development, SysML*
- **D7Q9 [Advanced]** When does a tool need confidence evaluation or qualification? (5 min) — *Software, Tool Confidence, Verification*
- **D7Q10 [Advanced]** What questions belong in a brake software safety architecture review? (5 min) — *Software, Review, Brakes*

## Day 8 — Brakes, ESC and Vehicle-Control Safety

**Focus:** Vehicle dynamics, control chain, plausibility, unintended intervention and degradation.  
**Target:** 55–60 min  
**Deliverable:** End-to-end ESC intervention and fault-response model.

- **D8Q1 [Foundation]** Differentiate base braking, brake assist, ABS, traction control and ESC by control objective and actuator use. (4 min) — *Brakes, ESC, Control Functions*
- **D8Q2 [Foundation]** What signals and models estimate desired versus actual yaw behavior? (5 min) — *ESC, Vehicle Dynamics, Control Functions*
- **D8Q3 [Intermediate]** Explain understeer and oversteer and how ESC intervention differs. (5 min) — *ESC, Vehicle Dynamics*
- **D8Q4 [Intermediate]** Trace one ESC intervention from driver input to hydraulic pressure and mark safety-relevant decisions. (6 min) — *Control Functions, System Architecture, ESC*
- **D8Q5 [Intermediate]** Develop plausibility concepts for wheel speed, steering angle, yaw rate and brake pressure. (6 min) — *Brakes, Sensors, Plausibility*
- **D8Q6 [Advanced]** At 100 km/h one rear wheel receives a strong 300 ms brake command without driver demand. Analyze end to end. (6 min) — *Brakes, HARA, Unintended Braking*
- **D8Q7 [Advanced]** A yaw-rate sensor fails during a low-friction curve. What remains, degrades or disables? (6 min) — *Brakes, Availability, Control Functions*
- **D8Q8 [Advanced]** How would you test safety behavior on split-µ braking and acceleration? (6 min) — *Brakes, ESC, Validation*
- **D8Q9 [Advanced]** An ESC torque-reduction request is delayed, duplicated or replayed on CAN. What protections are needed? (5 min) — *CAN, ESC, Control Functions*
- **D8Q10 [Advanced]** Design the top-level functional-safety concept for an integrated brake and ESC controller. (7 min) — *Brakes, ESC, Senior Interview*

## Day 9 — V&V, CAN, OBD, Production and Service

**Focus:** Test strategy, fault injection, network safety, diagnostics, validation and post-development.  
**Target:** 50–60 min  
**Deliverable:** Fault-injection and safety-validation matrix.

- **D9Q1 [Foundation]** Differentiate verification and safety validation using braking examples. (4 min) — *Verification, Validation, FSM*
- **D9Q2 [Foundation]** What are the objectives at hardware-software, system, item and vehicle integration levels? (5 min) — *Verification, Integration*
- **D9Q3 [Intermediate]** Build a V&V strategy for an ESC safety requirement from model to vehicle. (6 min) — *Verification, Test Strategy, Job Focus*
- **D9Q4 [Intermediate]** Write acceptance criteria for inhibiting unintended brake pressure after a fault. (5 min) — *Verification, Acceptance Criteria, Brakes*
- **D9Q5 [Intermediate]** Create a fault-injection matrix for an ESC ECU. (6 min) — *Fault Injection, Verification*
- **D9Q6 [Advanced]** How do you engineer and validate a CAN signal carrying brake torque or wheel speed? (6 min) — *CAN, System Architecture, Verification*
- **D9Q7 [Advanced]** What is the relationship and distinction between OBD and functional-safety diagnostics? (5 min) — *OBD, Diagnostics, Brakes*
- **D9Q8 [Advanced]** What production and service controls are safety-relevant for brake/ESC? (5 min) — *Production, Service, Brakes*
- **D9Q9 [Advanced]** Design safety validation for loss of ESC and unintended ESC intervention. (6 min) — *Safety Validation, Brakes, Human Factors*
- **D9Q10 [Advanced]** What evidence must be complete before recommending release of an ASIL-D brake ECU? (5 min) — *Verification, Release, Review*

## Day 10 — Senior Interview, Safety Case and Release Decisions

**Focus:** Leadership scenarios, assessments, architecture trade-offs and end-to-end mock interview.  
**Target:** 55–60 min  
**Deliverable:** 15-minute safety-case presentation for integrated brake/ESC.

- **D10Q1 [Intermediate]** You join a late ASIL-D brake project with no credible safety plan. What do you do first? (5 min) — *FSM, Leadership, Planning*
- **D10Q2 [Advanced]** Present a top-level safety-case argument for no hazardous unintended braking. (6 min) — *Safety Case, Leadership*
- **D10Q3 [Advanced]** An assessor finds incomplete traceability although all tests pass. How do you respond? (5 min) — *Assessment, FSM, Leadership*
- **D10Q4 [Advanced]** How do you justify tailoring or an alternative method without weakening safety? (5 min) — *Tailoring, FSM, Leadership*
- **D10Q5 [Advanced]** A supplier misses safety work products and cites proprietary restrictions. How do you protect the program? (6 min) — *Supplier, Leadership, DIA*
- **D10Q6 [Advanced]** Choose between dual MCU and a single safety MCU for ESC. How do you decide? (6 min) — *System Architecture, Leadership, ESC*
- **D10Q7 [Advanced]** A rare HIL test exceeds reaction time by 20 ms but shows no vehicle instability. Release or block? (6 min) — *Release, Safety Anomalies, Leadership*
- **D10Q8 [Advanced]** How do you build functional-safety competence across a multidisciplinary team? (5 min) — *Leadership, Competence, FSM*
- **D10Q9 [Advanced]** How do you explain a safety architecture trade-off to executives, control engineers and assessors? (5 min) — *Leadership, Stakeholders, Job Focus*
- **D10Q10 [Expert]** End-to-end case: develop the safety approach for a brake-by-wire and ESC platform shared across vehicle lines. (10 min) — *Senior Interview, Brakes, ESC, End-to-End*
