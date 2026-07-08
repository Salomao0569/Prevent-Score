// Harness de validação — extrai o COEF e as funções de cálculo DIRETAMENTE do
// app (calculadora-prevent.html), sem reescrever nada, e roda um paciente.
// Assim, o que é testado é exatamente a lógica que o usuário final executa.
const fs = require('fs');
const path = require('path');

const HTML = fs.readFileSync(path.join(__dirname, '..', 'calculadora-prevent.html'), 'utf8');

// --- Extrai o objeto COEF (literal JSON no HTML) ---
const coefStart = HTML.indexOf('const COEF = ');
const coefLine = HTML.slice(coefStart, HTML.indexOf('\n', coefStart));
const COEF = JSON.parse(coefLine.replace('const COEF = ', '').replace(/;\s*$/, ''));

// --- Extrai as funções buildTerms e riskFor verbatim ---
function extractFn(name) {
  const start = HTML.indexOf('function ' + name);
  let depth = 0, i = HTML.indexOf('{', start);
  for (let j = i; j < HTML.length; j++) {
    if (HTML[j] === '{') depth++;
    else if (HTML[j] === '}') { depth--; if (depth === 0) return HTML.slice(start, j + 1); }
  }
}
// eslint-disable-next-line no-eval
eval(extractFn('buildTerms') + '\n' + extractFn('riskFor')); // define buildTerms, riskFor

// --- Extrai as faixas de validação (RANGES) do app ---
const rl = HTML.slice(HTML.indexOf('const RANGES = '));
// eslint-disable-next-line no-eval
const RANGES = eval('(' + rl.slice(rl.indexOf('{'), rl.indexOf('};') + 1) + ')');

const OUTCOMES = ['total_cvd', 'ascvd', 'heart_failure', 'chd', 'stroke'];
function clampVal(id, v) { if (v == null) return v; const [lo, hi] = RANGES[id]; return v < lo ? lo : v > hi ? hi : v; }

// p: {sex,age,total_c,hdl_c,sbp,bmi,egfr,dm,smoking,bp_tx,statin,uacr?,hba1c?}
function runPatient(p) {
  const d = {};
  for (const id of ['age', 'total_c', 'hdl_c', 'sbp', 'bmi', 'egfr', 'hba1c', 'uacr'])
    d[id] = p[id] == null ? null : clampVal(id, p[id]);
  d.dm = !!p.dm; d.smoking = !!p.smoking; d.bp_tx = !!p.bp_tx; d.statin = !!p.statin;
  const hasH = d.hba1c != null, hasU = d.uacr != null;
  let model = 'base';
  if (hasH && hasU) model = 'full'; else if (hasU) model = 'uacr'; else if (hasH) model = 'hba1c';
  const out = { model, r10: {}, r30: {} };
  OUTCOMES.forEach(o => { out.r10[o] = riskFor(model, '10yr', p.sex, o, d) * 100; });
  if (p.age <= 59) OUTCOMES.forEach(o => { out.r30[o] = riskFor(model, '30yr', p.sex, o, d) * 100; });
  return out;
}

module.exports = { runPatient, COEF, RANGES, OUTCOMES };
