'use strict';

const sample = [
  { name: 'Avery Shah', company: 'Juniper Systems', email: 'avery@juniper.example', segment: 'Early funnel', verification: 'valid', linkedin: true, firmographics: true, owner: true },
  { name: 'Sam Chen', company: 'Northstar Labs', email: 'sam@northstar.example', segment: 'Mid funnel', verification: 'valid', linkedin: true, firmographics: true, owner: true },
  { name: 'Avery Shah', company: 'Juniper Systems', email: ' AVERY@juniper.example ', segment: 'Mid funnel', verification: 'valid', linkedin: true, firmographics: true, owner: true },
  { name: 'Jordan Ellis', company: 'Meridian Data', email: 'jordan@meridian.example', segment: 'Early funnel', verification: 'risky', linkedin: false, firmographics: true, owner: true },
  { name: 'Robin Diaz', company: 'Cedar Analytics', email: 'robin@cedar.example', segment: 'Mid funnel', verification: 'valid', linkedin: true, firmographics: false, owner: false },
  { name: 'Taylor Morgan', company: 'Harbor Cloud', email: 'taylor@harbor.example', segment: 'Early funnel', verification: 'valid', linkedin: true, firmographics: true, owner: true, suppressed: true }
];

function evaluateBatch(records) {
  const normalize = email => email.trim().toLowerCase();
  const suppressed = new Set(records.filter(record => record.suppressed).map(record => normalize(record.email)).filter(Boolean));
  const reserved = new Set();
  return records.map(record => {
    const email = normalize(record.email);
    const complete = Boolean(email && record.linkedin && record.firmographics);
    const result = (status, reason) => ({ ...record, status, reason, complete });
    if (suppressed.has(email)) return result('Blocked', 'Suppression applies across all rows with this address. Exclude it from outreach.');
    if (!email || record.verification !== 'valid') return result('Needs review', 'The sample verification status is inconclusive. Confirm the address before drafting.');
    if (!complete || !record.owner) return result('Needs review', 'Resolve missing ownership or enrichment. Check the CRM owner and complete the prospect record.');
    if (reserved.has(email)) return result('Duplicate', 'An eligible row already reserved this address. Keep one segment active and review any ownership conflict.');
    reserved.add(email);
    return result('Draft ready', `Verified sample email, complete profile, and assigned owner. Human review required. Draft opening: “Hi ${record.name.split(' ')[0]}, how does your team at ${record.company} handle sales handoffs today?”`);
  });
}

function planPipeline(target, rate, dealSize) {
  const expectedRevenuePerOpportunity = dealSize * rate / 100;
  const opportunities = Math.ceil(target / expectedRevenuePerOpportunity);
  return { opportunities, pipeline: opportunities * dealSize, expectedWins: opportunities * rate / 100 };
}

function wireDemo(document) {
  const select = id => document.getElementById(id);
  const rows = select('prospects');
  const explanation = select('explanation');
  const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  const number = new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 });

  function renderBatch(results) {
    const ready = results.filter(row => row.status === 'Draft ready').length;
    const complete = results.filter(row => row.complete).length;
    select('batch').textContent = `${ready} draft-ready · ${results.length - ready} held out · ${complete}/${results.length} rows with core fields`;
    rows.replaceChildren();
    for (const row of results) {
      const tr = document.createElement('tr');
      const nameCell = tr.insertCell();
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'record';
      button.textContent = row.name;
      button.addEventListener('click', () => {
        explanation.textContent = `${row.company} · ${row.status}. ${row.reason}`;
      });
      nameCell.append(button);
      tr.insertCell().textContent = row.segment;
      tr.insertCell().textContent = row.status;
      rows.append(tr);
    }
    explanation.textContent = 'Select a prospect to inspect the evidence for its decision.';
  }

  select('run').addEventListener('click', () => renderBatch(evaluateBatch(sample)));
  renderBatch(evaluateBatch(sample));

  const form = select('calculator');
  function renderMath() {
    if (!form.checkValidity()) {
      select('math-result').textContent = 'Enter a positive target and deal size, and a win rate between 0.1% and 100%.';
      return;
    }
    const result = planPipeline(select('target').valueAsNumber, select('win-rate').valueAsNumber, select('deal-size').valueAsNumber);
    select('math-result').textContent = `${number.format(result.opportunities)} opportunities · ${currency.format(result.pipeline)} pipeline · ${number.format(result.expectedWins)} expected wins`;
  }
  form.addEventListener('input', renderMath);
  form.addEventListener('submit', event => event.preventDefault());
  renderMath();
}

if (typeof document !== 'undefined') wireDemo(document);
if (typeof module !== 'undefined') module.exports = { sample, evaluateBatch, planPipeline };
