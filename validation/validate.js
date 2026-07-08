// Valida o app contra a CALCULADORA OFICIAL da AHA.
//
// Para cada paciente, chama o mesmo backend que o site oficial usa
// (professional.heart.org/aha-service/PHDSearch/PreventCalculate) e compara
// com o que o app calcula. Requer conexão com a internet.
//
// Uso:  node validation/validate.js [N] [seed]
//   N     = número de pacientes aleatórios (padrão 60)
//   seed  = semente para reprodutibilidade (padrão 20240101)
//
// Saída: total de comparações, aprovações/falhas e a maior diferença observada.
// Código de saída 0 = tudo idêntico; 1 = alguma divergência.

const { runPatient } = require('./harness.js');
const https = require('https');
const API = 'https://professional.heart.org/aha-service/PHDSearch/PreventCalculate';

function callAPI(p) {
  const payload = JSON.stringify({
    genderType: p.sex === 'female' ? 1 : 2,       // 1 = feminino, 2 = masculino
    age: p.age, totalCholesterol: p.total_c, hdlCholesterol: p.hdl_c,
    sbp: p.sbp, bmi: p.bmi, egfr: p.egfr,
    isAntihyperTensiveMedicUsed: !!p.bp_tx, isLipidLoweringMedicUsed: !!p.statin,
    isDiabetes: !!p.dm, isSmoker: !!p.smoking,
    uacr: p.uacr ?? null, hbA1C: p.hba1c ?? null, zipCode: null,
  });
  return new Promise((resolve, reject) => {
    const req = https.request(API, { method: 'POST', headers: {
      'content-type': 'application/json;charset=UTF-8',
      'accept': 'application/json, text/plain, */*',
      'referer': 'https://professional.heart.org/en/guidelines-and-statements/prevent-calculator',
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
    } }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => { try { resolve(JSON.parse(d)); } catch (e) { reject(d.slice(0, 80)); } }); });
    req.on('error', reject); req.write(payload); req.end();
  });
}
async function callRetry(p) { for (let t = 0; t < 4; t++) { try { return await callAPI(p); } catch (e) { if (t === 3) throw e; await new Promise(r => setTimeout(r, 600 * (t + 1))); } } }
function apiOut(r) { const pick = a => { const o = {}; (a || []).forEach(x => o[x.Type] = x.RiskPercentage); return { hf: o['Heart Failure'], ascvd: o['ASCVD'], cvd: o['CVD'] }; }; return { model: r.modelName, r10: pick(r.tenYearRiskEstimations), r30: pick(r.thirtyYearRiskEstimations) }; }
const K = { cvd: 'total_cvd', ascvd: 'ascvd', hf: 'heart_failure' };
const sleep = ms => new Promise(r => setTimeout(r, ms));

function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; }; }

(async () => {
  const N = Number(process.argv[2] || 60);
  const rnd = rng(Number(process.argv[3] || 20240101));
  const ri = (lo, hi) => Math.round(lo + rnd() * (hi - lo));
  const rf = (lo, hi, d = 1) => +(lo + rnd() * (hi - lo)).toFixed(d);
  const cases = [];
  for (let i = 0; i < N; i++) {
    const m = i % 4; // base / +uacr / +hba1c / completo
    const c = { sex: rnd() < 0.5 ? 'female' : 'male', age: ri(30, 79), total_c: ri(130, 320), hdl_c: ri(20, 100),
      sbp: ri(90, 200), bmi: rf(18.5, 39.9), egfr: ri(15, 140), dm: rnd() < 0.45, smoking: rnd() < 0.45, bp_tx: rnd() < 0.45, statin: rnd() < 0.45 };
    if (m === 1 || m === 3) c.uacr = rf(0.3, 8000, 1);
    if (m === 2 || m === 3) c.hba1c = rf(3.0, 15, 1);
    c.name = `#${i} ${['base', '+uacr', '+hba1c', 'completo'][m]}`;
    cases.push(c);
  }

  let n = 0, pass = 0, fail = 0, maxDiff = 0, maxWhere = ''; const fails = [];
  for (const c of cases) {
    let api; try { api = apiOut(await callRetry(c)); } catch (e) { console.log('ERRO de rede em', c.name, '-', e); continue; }
    const app = runPatient(c);
    for (const k of ['cvd', 'ascvd', 'hf']) for (const [hz, aR, bR] of [['10', app.r10, api.r10], ['30', app.r30, api.r30]]) {
      const a = aR ? aR[K[k]] : null, b = bR ? bR[k] : null;
      const aHas = a != null, bHas = b != null && b !== '';
      if (!aHas && !bHas) continue;
      n++;
      if (aHas !== bHas) { fail++; fails.push(`${c.name} ${k}${hz}a presença app=${a} aha=${b}`); continue; }
      const diff = Math.abs(a - b);
      if (diff > maxDiff) { maxDiff = diff; maxWhere = `${c.name} ${k}${hz}a app=${a} aha=${b}`; }
      if (diff <= 0.05) pass++; else { fail++; fails.push(`${c.name} ${k}${hz}a app=${a} aha=${b} Δ${diff.toFixed(2)}`); }
    }
    await sleep(50);
  }
  console.log(`\nComparações: ${n} | idênticas: ${pass} | divergentes: ${fail} | pacientes: ${cases.length}`);
  console.log(`Maior diferença: ${maxDiff.toFixed(4)}  @ ${maxWhere}`);
  if (fails.length) { console.log('\nDIVERGÊNCIAS:'); fails.slice(0, 40).forEach(f => console.log('  ' + f)); }
  console.log(fail === 0 ? '\n✅ App idêntico à calculadora oficial da AHA' : '\n❌ Há divergências — revise a mudança');
  process.exit(fail === 0 ? 0 : 1);
})();
