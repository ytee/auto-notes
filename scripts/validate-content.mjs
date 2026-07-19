import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const readText = file => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = file => JSON.parse(readText(file));
const fail = message => { throw new Error(message); };

function loadLearningLanguage() {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(readText('assets/learning-language.js'), sandbox, {
    filename: 'assets/learning-language.js'
  });

  if (!sandbox.AUTO_NOTES_LANGUAGE) fail('Learning-language module did not initialize');
  return sandbox.AUTO_NOTES_LANGUAGE;
}

const learningLanguage = loadLearningLanguage();

function validateQuestions(topicId, days, tracks, questions) {
  if (!Array.isArray(days) || days.length !== 10) fail(`${topicId}: expected 10 days`);
  if (!Array.isArray(questions) || questions.length !== 100) fail(`${topicId}: expected 100 questions`);

  const dayNumbers = new Set(days.map(day => day.day));
  const ids = new Set();
  const knownTiers = new Set(['Foundation', 'Intermediate', 'Advanced', 'Expert']);

  for (const question of questions) {
    if (!question.id || ids.has(question.id)) fail(`${topicId}: duplicate or missing question id ${question.id}`);
    ids.add(question.id);

    if (!dayNumbers.has(question.day)) fail(`${topicId}/${question.id}: invalid day ${question.day}`);
    if (!knownTiers.has(question.tier)) fail(`${topicId}/${question.id}: invalid tier ${question.tier}`);
    if (!Number.isFinite(question.minutes) || question.minutes < 1) fail(`${topicId}/${question.id}: invalid minutes`);

    for (const field of ['question', 'kind']) {
      if (!question[field]) fail(`${topicId}/${question.id}: missing ${field}`);
    }

    for (const field of ['tracks', 'answer', 'probes', 'refs']) {
      if (!Array.isArray(question[field]) || question[field].length === 0) {
        fail(`${topicId}/${question.id}: missing ${field}`);
      }
    }
  }

  for (const day of days) {
    const count = questions.filter(question => question.day === day.day).length;
    if (count !== 10) fail(`${topicId}: day ${day.day} has ${count} questions; expected 10`);
  }

  if (!Array.isArray(tracks) || tracks.length === 0) fail(`${topicId}: missing tracks`);
  console.log(`${topicId}: ${questions.length} questions, ${days.length} days, ${tracks.length} tracks`);
}

function validateLearningModel(topicId, content) {
  const normalized = learningLanguage.normalize(content);
  const findings = learningLanguage.findProhibited(normalized);

  if (findings.length) {
    const first = findings[0];
    fail(`${topicId}: prohibited learning-language term "${first.term}" remains at ${first.path}`);
  }

  console.log(`${topicId}: user-facing learning language passed`);
}

function loadLegacy(globalName) {
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(readText('assets/content.js'), sandbox, {
    filename: 'assets/content.js'
  });

  const content = sandbox.window[globalName];
  if (!content) fail(`Legacy global ${globalName} was not created`);
  return content;
}

new vm.Script(readText('assets/app.js'), { filename: 'assets/app.js' });

const indexHtml = readText('index.html');
for (const requiredScript of ['assets/content.js', 'assets/learning-language.js', 'assets/app.js']) {
  if (!indexHtml.includes(requiredScript)) fail(`index.html: missing ${requiredScript}`);
}

const manifest = readJson('data/topics.json');
if (!Array.isArray(manifest.topics) || manifest.topics.length < 2) {
  fail('Vehicle learning manifest must contain at least Safety and AUTOSAR');
}

validateLearningModel('manifest', manifest);

const topicIds = new Set();
for (const topic of manifest.topics) {
  if (!topic.id || topicIds.has(topic.id)) fail(`Duplicate or missing topic id ${topic.id}`);
  topicIds.add(topic.id);

  if (topic.legacyGlobal) {
    const content = loadLegacy(topic.legacyGlobal);
    validateQuestions(topic.id, content.days, content.tracks, content.questions);
    validateLearningModel(topic.id, content);
    continue;
  }

  if (!topic.content) fail(`${topic.id}: missing metadata content path`);
  const content = readJson(topic.content);
  const questionFiles = topic.questionFiles || [];

  if (questionFiles.length === 0) fail(`${topic.id}: no question files`);
  const questions = questionFiles.flatMap(file => readJson(file));

  validateQuestions(topic.id, content.days, content.tracks, questions);

  const declaredTracks = new Set(content.tracks.map(track => track.name));
  const undeclaredTracks = [...new Set(
    questions
      .flatMap(question => question.tracks)
      .filter(track => !declaredTracks.has(track))
  )];

  if (undeclaredTracks.length) {
    fail(`${topic.id}: undeclared tracks: ${undeclaredTracks.join(', ')}`);
  }

  const knowledgeCheckTitle = content.knowledgeCheckTitle || content.mockTitle;
  const architectureExercise = content.architectureExercise || content.boardExercise;

  if (!knowledgeCheckTitle) fail(`${topic.id}: missing knowledge-check title`);
  if (!architectureExercise?.title || !architectureExercise?.prompt) {
    fail(`${topic.id}: missing architecture exercise`);
  }

  validateLearningModel(topic.id, { ...content, questions });
}

console.log('Vehicle learning content validation passed.');
