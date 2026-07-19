(() => {
  const rules = [
    [/end-to-end mock interview/gi, 'end-to-end knowledge review'],
    [/mock interview/gi, 'knowledge check'],
    [/interview preparation/gi, 'learning program'],
    [/interview positioning/gi, 'learning perspective'],
    [/interviewer follow-ups/gi, 'deeper-dive prompts'],
    [/interviewer probes/gi, 'deeper-dive prompts'],
    [/interviewer pressure/gi, 'challenge scenarios'],
    [/senior role preparation/gi, 'advanced automotive learning'],
    [/senior interview/gi, 'advanced review'],
    [/job-description focus map/gi, 'learning coverage map'],
    [/job description focus map/gi, 'learning coverage map'],
    [/job description/gi, 'learning objectives'],
    [/\binterviewer\b/gi, 'reviewer'],
    [/\binterview\b/gi, 'knowledge review'],
    [/\bhiring\b/gi, 'learning'],
    [/\bcandidate\b/gi, 'learner'],
    [/\bjob\b/gi, 'learning']
  ];

  const prohibitedPattern = /\b(interview|interviewer|job|hiring|candidate)\b/i;

  function matchCase(source, replacement) {
    if (source === source.toUpperCase()) return replacement.toUpperCase();
    if (source[0] === source[0].toUpperCase()) {
      return replacement[0].toUpperCase() + replacement.slice(1);
    }
    return replacement;
  }

  function normalizeText(value) {
    return rules.reduce(
      (text, [pattern, replacement]) => text.replace(pattern, match => matchCase(match, replacement)),
      String(value)
    );
  }

  function normalize(value) {
    if (typeof value === 'string') return normalizeText(value);
    if (Array.isArray(value)) return value.map(normalize);
    if (value && typeof value === 'object') {
      return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalize(item)]));
    }
    return value;
  }

  function findProhibited(value, path = '$', findings = []) {
    if (typeof value === 'string') {
      const match = value.match(prohibitedPattern);
      if (match) findings.push({ path, term: match[0], value });
      return findings;
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => findProhibited(item, `${path}[${index}]`, findings));
      return findings;
    }
    if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, item]) => findProhibited(item, `${path}.${key}`, findings));
    }
    return findings;
  }

  globalThis.AUTO_NOTES_LANGUAGE = Object.freeze({ normalize, normalizeText, findProhibited });
})();
