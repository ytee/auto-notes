(() => {
  let platformManifest = null;
  let activeModule = null;
  let activeModuleId = null;
  let retainedState = { done: {}, ratings: {}, bookmarks: {} };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const language = globalThis.AUTO_NOTES_LANGUAGE || {
    normalize: value => value,
    normalizeText: value => String(value)
  };

  const escapeMarkup = value => String(value ?? '').replace(
    /[&<>'"]/g,
    character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#039;',
      '"': '&quot;'
    })[character]
  );

  const emptyRetainedState = () => ({ done: {}, ratings: {}, bookmarks: {} });
  const retainedStateKey = () => `autoNotesNvM:${activeModuleId}`;
  const legacyStateKey = () => `autoPrepState:${activeModuleId}`;

  function readRetainedState() {
    let rawState = localStorage.getItem(retainedStateKey());

    if (!rawState) {
      const legacyState = localStorage.getItem(legacyStateKey());
      if (legacyState) {
        rawState = legacyState;
        localStorage.setItem(retainedStateKey(), legacyState);
      }
    }

    try {
      retainedState = rawState ? JSON.parse(rawState) : emptyRetainedState();
    } catch (error) {
      console.warn('Retained learning state was invalid and has been reset.', error);
      retainedState = emptyRetainedState();
    }

    retainedState.done ||= {};
    retainedState.ratings ||= {};
    retainedState.bookmarks ||= {};
  }

  function writeRetainedState() {
    localStorage.setItem(retainedStateKey(), JSON.stringify(retainedState));
    updateJourneyGauge();
  }

  function updateJourneyGauge() {
    if (!activeModule) return;

    const completed = activeModule.questions.filter(question => retainedState.done[question.id]).length;
    const total = activeModule.questions.length;
    const percentage = total ? (100 * completed) / total : 0;

    $('#progressText').textContent = `${completed} / ${total} checkpoints complete`;
    $('#progressBar').style.width = `${percentage}%`;
  }

  function readDiagnosticFilters() {
    return {
      text: $('#search').value.trim().toLowerCase(),
      tier: $('#tierFilter').value,
      system: $('#systemFilter').value,
      status: $('#statusFilter').value
    };
  }

  function checkpointMatches(question, filters) {
    const searchableText = [
      question.question,
      question.kind,
      question.tier,
      ...question.tracks,
      ...question.answer,
      ...question.probes,
      ...question.refs
    ].join(' ').toLowerCase();

    return !(
      (filters.text && !searchableText.includes(filters.text)) ||
      (filters.tier && question.tier !== filters.tier) ||
      (filters.system && !question.tracks.includes(filters.system)) ||
      (filters.status === 'done' && !retainedState.done[question.id]) ||
      (filters.status === 'open' && retainedState.done[question.id]) ||
      (filters.status === 'bookmarked' && !retainedState.bookmarks[question.id])
    );
  }

  function renderCheckpointCard(question) {
    const tags = [question.tier, question.kind, ...question.tracks]
      .map((tag, index) => `<span class="tag ${index === 0 ? 'tier' : ''}">${escapeMarkup(tag)}</span>`)
      .join('');

    const confidenceButtons = [1, 2, 3, 4, 5]
      .map(value => `<button class="rate ${retainedState.ratings[question.id] === value ? 'selected' : ''}" data-rate="${value}" aria-label="Confidence ${value}">${value}</button>`)
      .join('');

    return `
      <article class="question-card ${retainedState.done[question.id] ? 'done' : ''}" data-id="${escapeMarkup(question.id)}">
        <div class="question-top">
          <div>
            <div class="meta">${tags}<span class="tag">${question.minutes} min</span></div>
            <h3>${escapeMarkup(question.id)}: ${escapeMarkup(question.question)}</h3>
          </div>
          <button class="bookmark ${retainedState.bookmarks[question.id] ? 'bookmarked' : ''}" title="Flag checkpoint" aria-label="Flag checkpoint">${retainedState.bookmarks[question.id] ? '★' : '☆'}</button>
        </div>
        <div class="actions">
          <button class="reveal">Reveal guidance</button>
          <button class="complete">${retainedState.done[question.id] ? 'Completed ✓' : 'Mark complete'}</button>
          <div class="rating"><span>Confidence</span>${confidenceButtons}</div>
        </div>
        <div class="answer">
          <div class="answer-grid">
            <div>
              <h4>Key learning points</h4>
              <ul>${question.answer.map(point => `<li>${escapeMarkup(point)}</li>`).join('')}</ul>
            </div>
            <div>
              <h4>Deeper-dive prompts</h4>
              <ul>${question.probes.map(prompt => `<li>${escapeMarkup(prompt)}</li>`).join('')}</ul>
            </div>
          </div>
          <div class="refs"><strong>${escapeMarkup(activeModule.referenceLabel || 'Reference map')}:</strong> ${question.refs.map(escapeMarkup).join(' · ')}</div>
        </div>
      </article>`;
  }

  function bindCheckpointControls(container) {
    container.querySelectorAll('.question-card').forEach(card => {
      const checkpointId = card.dataset.id;

      card.querySelector('.reveal').onclick = event => {
        const guidance = card.querySelector('.answer');
        guidance.classList.toggle('open');
        event.target.textContent = guidance.classList.contains('open') ? 'Hide guidance' : 'Reveal guidance';
      };

      card.querySelector('.complete').onclick = () => {
        retainedState.done[checkpointId] = !retainedState.done[checkpointId];
        writeRetainedState();
        renderActiveModule();
      };

      card.querySelector('.bookmark').onclick = () => {
        retainedState.bookmarks[checkpointId] = !retainedState.bookmarks[checkpointId];
        writeRetainedState();
        renderActiveModule();
      };

      card.querySelectorAll('.rate').forEach(button => {
        button.onclick = () => {
          retainedState.ratings[checkpointId] = Number(button.dataset.rate);
          writeRetainedState();
          renderActiveModule();
        };
      });
    });
  }

  function renderLearningRoute() {
    const filters = readDiagnosticFilters();

    $('#learningMethodTitle').textContent = activeModule.methodTitle;
    $('#learningMethodSteps').innerHTML = activeModule.methodSteps
      .map(step => `<li>${escapeMarkup(step)}</li>`)
      .join('');
    $('#caseTitle').textContent = activeModule.caseStudy.title;
    $('#caseDescription').textContent = activeModule.caseStudy.description;
    $('#notice').textContent = activeModule.notice;

    $('#routeNav').innerHTML = activeModule.days
      .map(day => `<button class="day-chip" data-day="${day.day}">Stage ${day.day}</button>`)
      .join('');

    $('#routeNav').querySelectorAll('button').forEach(button => {
      button.onclick = () => document
        .getElementById(`stage-${button.dataset.day}`)
        .scrollIntoView({ behavior: 'smooth' });
    });

    $('#routeStages').innerHTML = activeModule.days.map(day => {
      const checkpoints = activeModule.questions.filter(
        question => question.day === day.day && checkpointMatches(question, filters)
      );

      return `
        <section id="stage-${day.day}" class="day-section">
          <header class="day-head">
            <div class="day-no">${day.day}</div>
            <div><h2>${escapeMarkup(day.title)}</h2><p>${escapeMarkup(day.focus)}</p></div>
            <div class="target">${escapeMarkup(day.target)}</div>
          </header>
          <div class="deliverable"><strong>Stage output:</strong> ${escapeMarkup(day.deliverable)}</div>
          <div class="question-list">
            ${checkpoints.length ? checkpoints.map(renderCheckpointCard).join('') : '<div class="empty">No checkpoints match the diagnostic filters.</div>'}
          </div>
        </section>`;
    }).join('');

    bindCheckpointControls($('#routeStages'));
  }

  function renderSystemTracks() {
    const filters = readDiagnosticFilters();

    $('#systemCards').innerHTML = activeModule.tracks.map(system => {
      const count = activeModule.questions.filter(question => question.tracks.includes(system.name)).length;
      return `
        <button class="track-card" data-system="${escapeMarkup(system.name)}">
          <span class="system-status">SYSTEM ONLINE</span>
          <h3>${escapeMarkup(system.name)}</h3>
          <p>${escapeMarkup(system.desc)}</p>
          <p><strong>Interface:</strong> ${escapeMarkup(system.iso)}</p>
          <span class="count">${count} checkpoints</span>
        </button>`;
    }).join('');

    $('#systemCards').querySelectorAll('.track-card').forEach(button => {
      button.onclick = () => {
        $('#systemFilter').value = button.dataset.system;
        $$('#systemCards .track-card').forEach(card => card.classList.toggle('active', card === button));

        const checkpoints = activeModule.questions.filter(
          question => question.tracks.includes(button.dataset.system) && checkpointMatches(question, readDiagnosticFilters())
        );

        $('#systemCheckpointResults').innerHTML = `
          <header class="section-head"><p class="eyebrow">ACTIVE SYSTEM</p><h2>${escapeMarkup(button.dataset.system)}</h2></header>
          <div class="question-list">
            ${checkpoints.length ? checkpoints.map(renderCheckpointCard).join('') : '<div class="empty">No checkpoints match the diagnostic filters.</div>'}
          </div>`;

        bindCheckpointControls($('#systemCheckpointResults'));
      };
    });

    if (filters.system) {
      const selected = [...$('#systemCards').children].find(card => card.dataset.system === filters.system);
      if (selected) selected.click();
    } else {
      $('#systemCheckpointResults').innerHTML = '<div class="empty">Select an automotive system for focused learning.</div>';
    }
  }

  function renderInterfaceMaps() {
    $('#interfaceMapTitle').textContent = activeModule.matrixTitle;
    $('#interfaceMapHeaders').innerHTML = activeModule.matrixHeaders
      .map(header => `<th>${escapeMarkup(header)}</th>`)
      .join('');
    $('#interfaceMapBody').innerHTML = activeModule.matrix
      .map(row => `<tr>${row.map(cell => `<td>${escapeMarkup(cell)}</td>`).join('')}</tr>`)
      .join('');

    $('#coverageTitle').textContent = activeModule.focusTitle;
    $('#coverageHeaders').innerHTML = activeModule.focusHeaders
      .map(header => `<th>${escapeMarkup(header)}</th>`)
      .join('');
    $('#coverageBody').innerHTML = activeModule.focusMap
      .map(row => `<tr>${row.map(cell => `<td>${escapeMarkup(cell)}</td>`).join('')}</tr>`)
      .join('');
    $('#coverageNote').textContent = activeModule.focusNote;
  }

  function renderKnowledgeValidation() {
    const validationTitle = activeModule.knowledgeCheckTitle || activeModule.mockTitle;
    const exercise = activeModule.architectureExercise || activeModule.boardExercise;
    const challenges = exercise.challenges || exercise.pressure;

    $('#validationTitle').textContent = validationTitle;
    $('#knowledgeCheck').innerHTML = activeModule.quiz.map((item, index) => `
      <article class="quiz-card" data-answer="${item.answer}">
        <h3>${index + 1}. ${escapeMarkup(item.q)}</h3>
        <div class="quiz-options">
          ${item.options.map((option, optionIndex) => `<button class="quiz-option" data-index="${optionIndex}">${escapeMarkup(option)}</button>`).join('')}
        </div>
        <p class="quiz-why">${escapeMarkup(item.why)}</p>
      </article>`).join('');

    $$('.quiz-card').forEach(card => {
      card.querySelectorAll('.quiz-option').forEach(button => {
        button.onclick = () => {
          const correctAnswer = Number(card.dataset.answer);
          const selectedAnswer = Number(button.dataset.index);

          card.querySelectorAll('.quiz-option').forEach((option, optionIndex) => {
            option.disabled = true;
            if (optionIndex === correctAnswer) option.classList.add('correct');
          });

          if (selectedAnswer !== correctAnswer) button.classList.add('wrong');
          card.querySelector('.quiz-why').style.display = 'block';
        };
      });
    });

    $('#exerciseTitle').textContent = exercise.title;
    $('#exercisePrompt').textContent = exercise.prompt;
    $('#exerciseStructure').innerHTML = exercise.structure
      .map(step => `<li>${escapeMarkup(step)}</li>`)
      .join('');
    $('#exerciseChallenges').innerHTML = challenges
      .map(challenge => `<li>${escapeMarkup(challenge)}</li>`)
      .join('');
  }

  function renderActiveModule() {
    if (!activeModule) return;
    renderLearningRoute();
    renderSystemTracks();
    renderInterfaceMaps();
    renderKnowledgeValidation();
    updateJourneyGauge();
  }

  function resetDiagnosticFilters() {
    $('#systemFilter').innerHTML = '<option value="">All systems</option>' + activeModule.tracks
      .map(track => track.name)
      .sort()
      .map(name => `<option>${escapeMarkup(name)}</option>`)
      .join('');
    $('#search').value = '';
    $('#tierFilter').value = '';
    $('#systemFilter').value = '';
    $('#statusFilter').value = '';
  }

  function showCockpitView(viewName) {
    $$('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === viewName));
    $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${viewName}`));
    $('#diagnosticToolbar').classList.toggle('hidden', viewName === 'modules');
    if (viewName === 'systems' && activeModule) renderSystemTracks();
  }

  function normalizeLegacySafety(source) {
    return {
      schemaVersion: 1,
      id: 'safety',
      title: 'Automotive Functional Safety',
      shortTitle: 'Safety',
      eyebrow: 'ADVANCED AUTOMOTIVE LEARNING',
      subtitle: '10 stages · 30–60 minutes/stage · ISO 26262 × Brakes × ESC × Architecture',
      description: 'Advanced functional-safety learning across the complete vehicle lifecycle.',
      methodTitle: 'Work through each checkpoint before revealing guidance',
      methodSteps: [
        'Form a structured explanation in your own words.',
        'Use the deeper-dive prompts to test the boundaries of your understanding.',
        'Reveal the guidance, record confidence and mark the checkpoint complete.',
        'Finish the practical stage output before moving ahead.'
      ],
      caseStudy: {
        title: 'Integrated Brake + ESC Controller',
        description: 'The same vehicle item is traced through HARA, FSC, TSC, SysML, FMEA/FTA/DFA, hardware/software safety, CAN/OBD and vehicle validation.'
      },
      notice: 'Original learning material with paraphrased guidance and clause pointers. It does not reproduce ISO 26262 normative text.',
      referenceLabel: 'Clause map',
      matrixTitle: 'Domain ↔ Standard Interface Matrix',
      matrixHeaders: ['Domain', 'Engineering scope', 'ISO interface', 'Advanced learning outcome'],
      focusTitle: 'Functional-safety learning coverage map',
      focusHeaders: ['Learning area', 'Route coverage', 'Technical scope'],
      focusNote: 'Connect stakeholder needs and vehicle behavior to requirements, architecture, analyses, implementation constraints, verification evidence, supplier governance and release decisions.',
      knowledgeCheckTitle: 'Rapid knowledge check + architecture exercise',
      architectureExercise: {
        title: '15-minute architecture exercise',
        prompt: 'Develop the safety approach for a brake-by-wire and ESC platform shared across several vehicle lines.',
        structure: [
          'Clarify the item and assumptions.',
          'Identify hazards and safety goals.',
          'Propose the FSC, TSC and architecture.',
          'Explain analyses and metrics.',
          'Plan verification, validation and safety-case evidence.',
          'State trade-offs and open risks.'
        ],
        challenges: [
          'Power fails mid-corner.',
          'A shared sensor defeats redundancy.',
          'A supplier assumption of use is unmet.',
          'Reaction exceeds the timing budget.',
          'Production calibration is incorrect.',
          'The release date cannot move.'
        ]
      },
      days: source.days,
      tracks: source.tracks,
      matrix: source.matrix,
      focusMap: source.jdMap,
      questions: source.questions,
      quiz: source.quiz,
      references: []
    };
  }

  async function loadLearningModule(moduleMetadata) {
    let moduleContent;

    if (moduleMetadata.legacyGlobal) {
      const legacyContent = window[moduleMetadata.legacyGlobal];
      if (!legacyContent) throw new Error(`Missing ${moduleMetadata.legacyGlobal}`);
      moduleContent = normalizeLegacySafety(legacyContent);
    } else {
      moduleContent = await fetch(moduleMetadata.content).then(response => {
        if (!response.ok) throw new Error(`Cannot load ${moduleMetadata.content}`);
        return response.json();
      });

      if (moduleMetadata.questionFiles) {
        const questionGroups = await Promise.all(moduleMetadata.questionFiles.map(path => fetch(path).then(response => {
          if (!response.ok) throw new Error(`Cannot load ${path}`);
          return response.json();
        })));
        moduleContent.questions = questionGroups.flat();
      }
    }

    return language.normalize(moduleContent);
  }

  async function activateLearningModule(moduleId, openRoute = true) {
    const moduleMetadata = platformManifest.topics.find(module => module.id === moduleId);
    if (!moduleMetadata) return;

    activeModule = await loadLearningModule(moduleMetadata);
    activeModuleId = moduleId;
    readRetainedState();

    $('#moduleSelect').value = moduleId;
    $('#eyebrow').textContent = activeModule.eyebrow;
    $('#moduleTitle').textContent = activeModule.title;
    $('#moduleSubtitle').textContent = activeModule.subtitle;

    resetDiagnosticFilters();
    renderActiveModule();
    location.hash = `module=${encodeURIComponent(moduleId)}`;

    if (openRoute) showCockpitView('route');
  }

  function renderModuleCards() {
    $('#moduleCards').innerHTML = platformManifest.topics.map(module => `
      <button class="topic-card" data-module="${escapeMarkup(module.id)}">
        <span class="topic-badge">10-STAGE MODULE</span>
        <h3>${escapeMarkup(module.title)}</h3>
        <p class="topic-subtitle">${escapeMarkup(module.subtitle)}</p>
        <p>${escapeMarkup(module.description)}</p>
        <span class="open-label">Enter subsystem →</span>
      </button>`).join('');

    $('#moduleCards').querySelectorAll('button').forEach(button => {
      button.onclick = () => activateLearningModule(button.dataset.module, true);
    });
  }

  async function bootCockpit() {
    platformManifest = language.normalize(await fetch('data/topics.json').then(response => {
      if (!response.ok) throw new Error('Cannot load vehicle learning manifest');
      return response.json();
    }));

    $('#moduleSelect').innerHTML = platformManifest.topics
      .map(module => `<option value="${escapeMarkup(module.id)}">${escapeMarkup(module.title)}</option>`)
      .join('');

    renderModuleCards();

    const hash = new URLSearchParams(location.hash.replace(/^#/, ''));
    const initialModule = hash.get('module') || hash.get('topic') || platformManifest.topics[0].id;
    await activateLearningModule(initialModule, false);
    showCockpitView('modules');
  }

  ['search', 'tierFilter', 'systemFilter', 'statusFilter'].forEach(id => {
    $(`#${id}`).addEventListener(id === 'search' ? 'input' : 'change', renderActiveModule);
  });

  $('#moduleSelect').addEventListener('change', event => activateLearningModule(event.target.value, true));
  $$('.tab').forEach(tab => { tab.onclick = () => showCockpitView(tab.dataset.view); });

  let remainingSeconds = 45 * 60;
  let timerHandle = null;

  function paintTimer() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    $('#timer').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  $('#timerToggle').onclick = () => {
    if (timerHandle) {
      clearInterval(timerHandle);
      timerHandle = null;
      $('#timerToggle').textContent = 'Start';
      return;
    }

    timerHandle = setInterval(() => {
      if (remainingSeconds) {
        remainingSeconds -= 1;
        paintTimer();
      } else {
        clearInterval(timerHandle);
        timerHandle = null;
        $('#timerToggle').textContent = 'Start';
      }
    }, 1000);
    $('#timerToggle').textContent = 'Pause';
  };

  $('#timerReset').onclick = () => {
    if (timerHandle) clearInterval(timerHandle);
    timerHandle = null;
    remainingSeconds = 45 * 60;
    paintTimer();
    $('#timerToggle').textContent = 'Start';
  };

  paintTimer();
  bootCockpit().catch(error => {
    console.error(error);
    document.body.insertAdjacentHTML(
      'afterbegin',
      `<div class="fatal">${escapeMarkup(error.message)}. Serve this directory through Netlify or a local HTTP server.</div>`
    );
  });
})();
