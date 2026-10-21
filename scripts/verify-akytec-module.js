#!/usr/bin/env node

// Checks specific to the akYtec ALP vendor module:
// - evidence labels and citations on every rule line
// - rule-ID cross references resolve
// - ST examples in the module are lint-clean and labelled UNCOMPILED
// - lint fixtures: unsupported ST constructs and cross-vendor contamination are detected
// - no manufacturer PDFs and no project-specific content in the public repository
// - module registration (routing, map, SKILL.md, evals)

const fs = require('fs');
const path = require('path');
const { lintAlpSt, extractStFences } = require('./akytec-st-lint');

const rootDir = path.resolve(__dirname, '..');
const moduleDir = path.join(rootDir, 'references', 'vendors', 'akytec');
const fixtureDir = path.join(rootDir, 'evals', 'fixtures', 'akytec');
const issues = [];

const requiredFiles = [
  'akytec-overview.md',
  'akytec-rules.md',
  'akytec-cheatsheet.md',
  'akytec-pitfalls-and-pro-tips.md',
  'akytec-modbus-and-network.md',
  'akytec-persistence.md',
  'akytec-mu210-modbus-note.md',
  'akytec-visualization.md',
  'official-doc-index.md',
];
const benchFiles = [
  'bench/README.md',
  'bench/exp-01-variable-binding.md',
  'bench/exp-02-persistence.md',
  'bench/exp-03-single-element-memory.md',
  'bench/exp-04-multiple-screens.md',
  'bench/exp-05-status-indication.md',
  'bench/exp-06-shared-variable-ownership.md',
];
const labels = ['[DOC]', '[INFERRED]', '[LOCAL OBSERVATION / NOT INDEPENDENTLY VERIFIED]', '[UNVERIFIED]'];
const ruleLinePattern = /^- \*\*((?:ENV|ST|MB|PS|MU|VZ)-\d+)\*\*/;
const privatePattern = /\b(?:CLACK|Wilo|Daikin|PTDNC04|TECH77|clack-bms)\b/i;

function record(message) {
  issues.push(message);
}

function rel(filePath) {
  return path.relative(rootDir, filePath).replace(/\\/g, '/');
}

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function walk(dirPath, out = []) {
  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    if (['.git', 'node_modules'].includes(entry.name)) continue;
    const full = path.join(dirPath, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function verifyFilesExist() {
  for (const name of requiredFiles) {
    if (!fs.existsSync(path.join(moduleDir, name))) {
      record(`references/vendors/akytec/${name}: missing`);
    }
  }
}

function verifyRuleLines() {
  const definedIds = new Map();

  for (const name of requiredFiles) {
    const filePath = path.join(moduleDir, name);
    if (!fs.existsSync(filePath)) continue;

    for (const [index, line] of read(filePath).split(/\r?\n/).entries()) {
      const match = line.match(ruleLinePattern);
      if (!match) continue;

      const where = `${rel(filePath)}:${index + 1}`;
      const id = match[1];
      if (definedIds.has(id)) record(`${where}: duplicate rule id ${id} (first in ${definedIds.get(id)})`);
      definedIds.set(id, where);

      if (!labels.some((label) => line.includes(label))) {
        record(`${where}: rule ${id} has no evidence label`);
      }
      if (line.includes('[DOC]') && !/\bpp?\.\d+/.test(line)) {
        record(`${where}: rule ${id} is [DOC] but has no printed-page citation`);
      }
      if (line.includes('[DOC]') && !/(?:ALP UM|PR205 UG|MU210 user guide|MU210 UG)/.test(line)) {
        record(`${where}: rule ${id} is [DOC] but does not name its manual`);
      }
    }
  }

  const referenceFiles = [
    ...requiredFiles.map((name) => path.join(moduleDir, name)),
    ...benchFiles.map((name) => path.join(moduleDir, name)),
    path.join(rootDir, 'evals', 'akytec-cases.md'),
  ];
  for (const filePath of referenceFiles) {
    if (!fs.existsSync(filePath)) continue;
    for (const match of read(filePath).matchAll(/\b((?:ENV|ST|MB|PS|MU|VZ)-\d+)\b/g)) {
      if (!definedIds.has(match[1])) {
        record(`${rel(filePath)}: reference to undefined rule ${match[1]}`);
      }
    }
  }
}

function verifyModuleExamples() {
  for (const name of [...requiredFiles, ...benchFiles]) {
    const filePath = path.join(moduleDir, name);
    if (!fs.existsSync(filePath)) continue;

    for (const block of extractStFences(read(filePath))) {
      const where = `${rel(filePath)}:${block.line}`;
      if (!/UNCOMPILED/.test(block.code.split('\n').slice(0, 2).join('\n'))) {
        record(`${where}: st example is not labelled UNCOMPILED on its first lines`);
      }
      for (const finding of lintAlpSt(block.code)) {
        record(`${where}: example fails ALP lint ${finding.rule}: ${finding.message}`);
      }
    }
  }
}

function verifyFixtures() {
  const positiveDir = path.join(fixtureDir, 'positive');
  const negativeDir = path.join(fixtureDir, 'negative');
  if (!fs.existsSync(positiveDir) || !fs.existsSync(negativeDir)) {
    record('evals/fixtures/akytec: positive/ and negative/ fixture directories are required');
    return;
  }

  for (const file of fs.readdirSync(positiveDir)) {
    const filePath = path.join(positiveDir, file);
    for (const finding of lintAlpSt(read(filePath))) {
      record(`${rel(filePath)}: positive fixture flagged ${finding.rule}: ${finding.message}`);
    }
  }

  const coveredRules = new Set();
  for (const file of fs.readdirSync(negativeDir)) {
    const filePath = path.join(negativeDir, file);
    const text = read(filePath);
    const header = text.match(/^\(\*\s*EXPECT:\s*([A-Z0-9,\-\s]+?)\s*\*\)/);
    if (!header) {
      record(`${rel(filePath)}: negative fixture needs a first-line (* EXPECT: codes *) header`);
      continue;
    }

    const found = new Set(lintAlpSt(text).map((finding) => finding.rule));
    for (const code of header[1].split(',').map((item) => item.trim()).filter(Boolean)) {
      coveredRules.add(code);
      if (!found.has(code)) record(`${rel(filePath)}: expected lint ${code} was not reported (found: ${[...found].join(', ') || 'none'})`);
    }
  }

  // Regression coverage floor: every class of unsupported ST construct and cross-vendor contamination.
  for (const code of ['ST-04', 'ST-05', 'ST-06', 'ST-07', 'ST-12', 'ST-14', 'ST-16', 'ST-17', 'ST-18', 'XV-01', 'XV-02']) {
    if (!coveredRules.has(code)) record(`evals/fixtures/akytec/negative: no fixture covers ${code}`);
  }
}

function verifyNoManualOrPrivateContent() {
  for (const filePath of walk(rootDir)) {
    if (/\.pdf$/i.test(filePath)) {
      record(`${rel(filePath)}: manufacturer manuals and PDFs must not be committed`);
    }
  }

  const scanned = [
    ...walk(moduleDir),
    ...walk(fixtureDir),
    path.join(rootDir, 'evals', 'akytec-cases.md'),
  ];
  for (const filePath of scanned) {
    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) continue;
    const match = read(filePath).match(privatePattern);
    if (match) record(`${rel(filePath)}: contains project-specific term "${match[0]}"`);
  }
}

function verifyRegistration() {
  const mustContain = [
    ['SKILL.md', /akYtec/],
    ['SKILL.md', /"akytec"/],
    ['references/vendors/vendor-routing.md', /references\/vendors\/akytec\/akytec-overview\.md/],
    ['references/vendors/vendor-recognition-signals.md', /## akYtec/],
    ['references/vendors/vendor-module-map.md', /references\/vendors\/akytec\//],
    ['references/vendors/AGENTS.md', /`akytec\/`/],
    ['references/reference-map.md', /akytec-rules\.md/],
    ['references/doc-map.md', /akytec-persistence\.md/],
    ['README.md', /akYtec/],
    ['references/vendors/vendor-routing.md', /akytec-visualization\.md/],
    ['references/reference-map.md', /akytec-visualization\.md/],
    ['references/doc-map.md', /bench\/README\.md/],
  ];
  for (const [file, pattern] of mustContain) {
    if (!pattern.test(read(path.join(rootDir, file)))) record(`${file}: akYtec registration missing (${pattern})`);
  }

  const matrix = read(path.join(rootDir, 'evals', 'eval-matrix.md'));
  const evals = JSON.parse(read(path.join(rootDir, 'evals', 'evals.json')));
  const evalIds = new Set(evals.map((entry) => entry.id));
  for (let n = 1; n <= 16; n += 1) {
    const id = `AK${n}`;
    if (!new RegExp(`^\\|\\s*${id}\\s*\\|`, 'm').test(matrix)) record(`evals/eval-matrix.md: missing ${id}`);
    if (!evalIds.has(id)) record(`evals/evals.json: missing ${id}`);
  }
}

function verifyMu210MaskNote() {
  const filePath = path.join(moduleDir, 'akytec-mu210-modbus-note.md');
  if (!fs.existsSync(filePath)) return;
  const text = read(filePath);
  for (const needle of ['UINT32', 'two 16-bit Modbus registers', 'quantity 2', '0x01D6', 'function 06']) {
    if (!text.includes(needle)) record(`${rel(filePath)}: must state "${needle}"`);
  }
  for (const id of ['MU-07', 'MU-08', 'MU-09', 'MU-10']) {
    const line = text.split(/\r?\n/).find((l) => l.includes(`**${id}**`));
    if (!line || !line.includes('[UNVERIFIED]')) record(`${rel(filePath)}: ${id} must stay [UNVERIFIED] until bench evidence exists`);
  }
}

function verifyBenchProtocols() {
  const requiredSections = [
    '## Objective', '## Prerequisites', '## Construction Steps', '## Anticipated Results',
    '## Actual Observations', '## Evidence Checklist', '## Stop Conditions', '## Conclusion',
  ];
  const status = '**Status: NOT EXECUTED. All outcomes below are UNVERIFIED.**';

  for (const name of benchFiles) {
    const filePath = path.join(moduleDir, name);
    if (!fs.existsSync(filePath)) {
      record(`references/vendors/akytec/${name}: missing`);
      continue;
    }
    const text = read(filePath);

    if (/- \[x\]/i.test(text)) record(`${rel(filePath)}: checklist items must stay unchecked until the user executes the experiment`);
    if (/\[BENCH-OBSERVED,[ ]*[A-Za-z0-9]/.test(text)) record(`${rel(filePath)}: contains a promoted bench result; none may exist before execution`);

    if (!name.includes('exp-')) continue;

    if (!text.includes(status)) record(`${rel(filePath)}: missing status line "${status}"`);
    for (const heading of requiredSections) {
      if (!text.includes(heading)) record(`${rel(filePath)}: missing section ${heading}`);
    }
    if (!/^Environment:.*(?:SIM|DEVICE)/m.test(text)) record(`${rel(filePath)}: Environment line must say SIM and/or DEVICE`);
    if (!/Anticipated Results \(UNVERIFIED/.test(text)) record(`${rel(filePath)}: Anticipated Results heading must say UNVERIFIED`);
    if (!/Resource indicators/.test(text)) record(`${rel(filePath)}: needs a resource-indicator record`);
    if (!/screenshot/i.test(text)) record(`${rel(filePath)}: needs screenshot evidence requirements`);
    if (!/ALP version/.test(text) && !/common (?:observation )?header/i.test(text)) record(`${rel(filePath)}: must point to the common observation header (ALP version, firmware)`);
    if (!/Rules under test:/.test(text)) record(`${rel(filePath)}: missing "Rules under test:" line`);

    // Observation tables must be blank: no filled cell after the first column in the Actual Observations section.
    const observed = text.split('## Actual Observations')[1] || '';
    const section = observed.split('## Evidence Checklist')[0];
    const header = '| Step |';
    for (const line of section.split(/\r?\n/)) {
      if (!line.startsWith('|') || /^\|\s*-/.test(line) || line.startsWith(header) || /^\|\s*(Config|Item|Question|Check)\b/.test(line)) continue;
      const cells = line.split('|').slice(1, -1).map((cell) => cell.trim());
      if (cells.slice(1).some((cell) => cell !== '')) record(`${rel(filePath)}: observation row is pre-filled: ${line.slice(0, 80)}`);
    }
  }

  const readme = path.join(moduleDir, 'bench', 'README.md');
  if (fs.existsSync(readme)) {
    const text = read(readme);
    for (const needle of ['No live equipment', 'No wear testing', 'Isolated network only', 'Nothing in this directory has been promoted', 'NOT EXECUTED']) {
      if (!text.includes(needle)) record(`${rel(readme)}: must state "${needle}"`);
    }
  }
}

function verifyBenchSpecifics() {
  const exp03 = path.join(moduleDir, 'bench', 'exp-03-single-element-memory.md');
  if (fs.existsSync(exp03)) {
    const text = read(exp03);
    for (const needle of ['Available (free) versus used', 'delta used', 'Direction test', 'verbatim', 'VZ-36']) {
      if (!text.includes(needle)) record(`${rel(exp03)}: must state "${needle}"`);
    }
  }

  const exp06 = path.join(moduleDir, 'bench', 'exp-06-shared-variable-ownership.md');
  if (fs.existsSync(exp06)) {
    const text = read(exp06);
    for (const needle of [
      'One project per variant', 'One binding per element', 'Participants',
      'exp06_6e1', 'exp06_6e2', 'exp06_6e3', 'exp06_6e4',
      'Allowed parameter: display Brightness only', 'Stop and escalate', 'D5 restoration', 'do not choose another parameter',
    ]) {
      if (!text.includes(needle)) record(`${rel(exp06)}: must state "${needle}"`);
    }
    // 6E must not reuse the 6A element or variable.
    const sixE = text.split('### 6E')[1] || '';
    const sixEBody = sixE.split('## Anticipated Results')[0];
    if (/\bE1\b|s_shared/.test(sixEBody.replace(/no variable named `s_a`\/`s_shared`/g, ''))) {
      record(`${rel(exp06)}: 6E variants must not reuse E1 or s_shared`);
    }
  }
}

function verifyVisualizationReference() {
  const filePath = path.join(moduleDir, 'akytec-visualization.md');
  if (!fs.existsSync(filePath)) return;
  const text = read(filePath);
  for (const needle of ['System Visualization ROM', 'User Visualization ROM', 'Visualization RAM', 'Write at the end of cycle', 'most heavily loaded screen']) {
    if (!text.includes(needle)) record(`${rel(filePath)}: must cover "${needle}"`);
  }
  for (const id of ['VZ-07', 'VZ-08', 'VZ-27', 'VZ-28', 'VZ-36']) {
    const line = text.split(/\r?\n/).find((l) => l.includes(`**${id}**`));
    if (!line || !line.includes('[UNVERIFIED]')) record(`${rel(filePath)}: ${id} must stay [UNVERIFIED] until bench evidence exists`);
  }
}

verifyFilesExist();
verifyRuleLines();
verifyMu210MaskNote();
verifyBenchProtocols();
verifyBenchSpecifics();
verifyVisualizationReference();
verifyModuleExamples();
verifyFixtures();
verifyNoManualOrPrivateContent();
verifyRegistration();

if (issues.length > 0) {
  console.error('akYtec module verification failed:\n');
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log('akYtec module verification passed.');
