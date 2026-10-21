#!/usr/bin/env node
// Heuristic static lint for akYtec ALP 3.1 ST snippets.
// It flags constructs that the ALP manual does not offer in ST (or that belong to other
// PLC ecosystems). It is NOT a compiler: a clean result never means the code compiles in ALP.
// Rule codes refer to references/vendors/akytec/akytec-rules.md (ST-*) or are cross-vendor checks (XV-*).

const fs = require('fs');

const ALLOWED_TYPES = new Set(['BOOL', 'UDINT', 'REAL', 'TIME', 'DT', 'ARRAY']);
const UNSUPPORTED_TYPES = ['INT', 'DINT', 'SINT', 'USINT', 'UINT', 'ULINT', 'LINT', 'LREAL', 'WORD', 'DWORD', 'LWORD', 'BYTE', 'STRING', 'WSTRING'];
const ALLOWED_CONVERTERS = new Set([
  'UDINT_TO_REAL', 'UDINT_TO_BOOL', 'UDINT_TO_TIME', 'UDINT_TO_DT', 'REAL_TO_UDINT', 'REAL_TO_BOOL',
  'BOOL_TO_REAL', 'BOOL_TO_UDINT', 'TIME_TO_UDINT', 'DT_TO_UDINT',
]);
const SYS_BLOCKS = ['TON', 'TOF', 'TP', 'CTU', 'CTN', 'CT', 'RS', 'SR', 'RTRIG', 'FTRIG', 'DTRIG', 'BLINK', 'CLOCK', 'CLOCKWEEK'];
const SYS_FUNCTIONS = ['MIN', 'MAX', 'FMIN', 'FMAX', 'SQRT', 'EXP', 'FACT', 'LOG', 'LG', 'LN', 'SIN', 'COS', 'TAN', 'ASIN', 'ACOS', 'ATAN'];

function stripNonCode(src) {
  // Keep line structure so reported line numbers stay correct.
  return src
    .replace(/\(\*[\s\S]*?\*\)/g, (m) => m.replace(/[^\n]/g, ' '))
    .replace(/\/\/[^\n]*/g, (m) => ' '.repeat(m.length))
    .replace(/'[^'\n]*'/g, (m) => ' '.repeat(m.length));
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length;
}

function lintAlpSt(src) {
  const code = stripNonCode(src);
  const findings = [];
  const add = (rule, index, message) => findings.push({ rule, line: lineOf(code, index), message });

  const scan = (regex, rule, message) => {
    for (const m of code.matchAll(regex)) {
      add(rule, m.index, typeof message === 'function' ? message(m) : message);
    }
  };

  scan(new RegExp(`\\b(${UNSUPPORTED_TYPES.join('|')})\\b`, 'gi'), 'ST-04', (m) => `type ${m[1].toUpperCase()} is not available in ALP ST`);
  scan(/\b(VAR_GLOBAL|VAR_IN_OUT|VAR_EXTERNAL|VAR_TEMP|VAR_CONFIG|VAR_ACCESS)\b/gi, 'ST-05', (m) => `declaration block ${m[1].toUpperCase()} is not available in ALP ST`);
  scan(/\b(NON_RETAIN|RETAIN)\b/gi, 'ST-14', 'RETAIN is not supported in ALP ST function blocks; use circuit-level Persistence');
  scan(/\b(END_)?(PROGRAM|METHOD|PROPERTY|INTERFACE|STRUCT|TYPE)\b|\b(EXTENDS|IMPLEMENTS)\b|\b(POINTER|REFERENCE)\s+TO\b|\bADR\s*\(|\^/gi, 'XV-02', 'OOP, pointer, STRUCT or PROGRAM construct is not available in ALP ST');
  scan(/\b(R_TRIG|F_TRIG)\b/gi, 'ST-18', 'use SYS.RTRIG / SYS.FTRIG');
  scan(new RegExp(`:\\s*(?!SYS\\.)(${SYS_BLOCKS.join('|')})\\s*;`, 'gi'), 'ST-18', (m) => `system block ${m[1].toUpperCase()} needs the SYS. prefix`);
  scan(new RegExp(`(?<![\\w.])(${SYS_FUNCTIONS.join('|')})\\s*\\(`, 'gi'), 'ST-17', (m) => `function ${m[1].toUpperCase()} needs the SYS. prefix`);

  for (const m of code.matchAll(/\b([A-Z0-9]+_TO_[A-Z0-9]+)\b/gi)) {
    if (!ALLOWED_CONVERTERS.has(m[1].toUpperCase())) {
      add('ST-06', m.index, `converter ${m[1].toUpperCase()} is not a documented ALP converter`);
    }
  }

  scan(/%[IQMX][A-Z0-9.]*|(?<![\w"])#[A-Za-z_]\w*|"[A-Za-z_]\w*"\s*\.|\b(?:TON|TOF|CTU|CTD)\w*\.(?:DN|PRE|ACC|EN|TT)\b|\bONS\s*\(|(?<![\w.])[XYMD]\d+(?![\w.])/g, 'XV-01', 'direct addressing, # locals, quoted DB names or Rockwell member syntax are not ALP ST');
  scan(/\b[A-Za-z]\w*__\w*\b/g, 'ST-02', 'identifier contains consecutive underscores');
  scan(/(?<![\w.])[A-Za-z_]\w*\.(\d+)\b(?!\.)/g, 'ST-07', (m) => (Number(m[1]) > 31 ? `bit index ${m[1]} is outside 0..31` : null));

  for (const m of code.matchAll(/ARRAY\s*\[([^\]]*)\]/gi)) {
    const dims = m[1].match(/^\s*(-?\d+)\s*\.\.\s*(\d+)\s*$/);
    if (!dims) {
      add('ST-16', m.index, 'array dimension must be written <low>..<high> with integer bounds');
      continue;
    }
    const low = Number(dims[1]);
    const high = Number(dims[2]);
    if (low < 0 || high <= low || high - low + 1 > 32768) {
      add('ST-16', m.index, `array bounds ${low}..${high} are outside the documented rules`);
    }
  }
  scan(/:=\s*\[[^\]]*\d\s*\(\s*\d+\s*\)[^\]]*\]/g, 'ST-16', 'repeat-count array initializers are unsupported');

  // ST-12: no FB instance (or other non-basic type) in VAR sections of a FUNCTION.
  for (const fn of code.matchAll(/\bFUNCTION\b(?!_)[\s\S]*?\bEND_FUNCTION\b/gi)) {
    for (const section of fn[0].matchAll(/\bVAR\b(?!_)[\s\S]*?\bEND_VAR\b/gi)) {
      for (const decl of section[0].matchAll(/:\s*([A-Za-z_][\w.]*)/g)) {
        if (!ALLOWED_TYPES.has(decl[1].toUpperCase())) {
          add('ST-12', fn.index + section.index + decl.index, `FB instance or non-basic type ${decl[1]} declared in an ST FUNCTION`);
        }
      }
    }
  }

  return findings.filter((f) => f.message !== null);
}

function extractStFences(markdown) {
  const blocks = [];
  const pattern = /```st\r?\n([\s\S]*?)```/g;
  for (const m of markdown.matchAll(pattern)) {
    blocks.push({ code: m[1], line: lineOf(markdown, m.index) });
  }
  return blocks;
}

module.exports = { lintAlpSt, extractStFences };

if (require.main === module) {
  let exitCode = 0;
  for (const file of process.argv.slice(2)) {
    const findings = lintAlpSt(fs.readFileSync(file, 'utf8'));
    for (const f of findings) {
      console.log(`${file}:${f.line}: ${f.rule}: ${f.message}`);
    }
    if (findings.length > 0) exitCode = 1;
  }
  process.exit(exitCode);
}
