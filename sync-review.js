'use strict';

const batch = [
  { id: 'EV-101', field: 'CLAY_Industry', value: 'Logistics' },
  { id: 'EV-102', field: 'Opportunity.CloseDate', value: '2026-12-15' },
  { id: 'EV-103', field: 'CLAY_Region', value: 'EMEA', transient: true }
];
const allowedFields = new Set(['CLAY_Industry', 'CLAY_Region']);

function createReplay() {
  const completed = new Set();
  const pending = new Map();
  let writes = 0;

  function handle(event, isRetry = false) {
    if (!allowedFields.has(event.field)) return ['Blocked', 'Operational field sits outside the enrichment allowlist.'];
    if (completed.has(event.id)) return ['Skipped', 'Event already recorded as successful.'];
    if (event.transient && !isRetry) {
      pending.set(event.id, event);
      return ['Retryable', 'Simulated temporary destination failure.'];
    }
    pending.delete(event.id);
    completed.add(event.id);
    writes += 1;
    return ['Applied', `Simulated write to ${event.field}: ${event.value}.`];
  }

  return {
    run: () => batch.map(event => [event.id, ...handle(event)]),
    retry: () => [...pending.values()].map(event => [event.id, ...handle(event, true)]),
    stats: () => ({ writes, pending: pending.size })
  };
}

function wire(document) {
  let replay = createReplay();
  const get = id => document.getElementById(id);
  function render(rows) {
    get('log').replaceChildren();
    for (const row of rows) {
      const tr = document.createElement('tr');
      for (const text of row) tr.insertCell().textContent = text;
      get('log').append(tr);
    }
    const stats = replay.stats();
    get('retry').disabled = stats.pending === 0;
    get('counts').textContent = `${stats.writes} successful writes · ${stats.pending} awaiting retry`;
  }
  get('batch-run').addEventListener('click', () => render(replay.run()));
  get('retry').addEventListener('click', () => render(replay.retry()));
  get('reset').addEventListener('click', () => {
    replay = createReplay();
    render([]);
  });
  render([]);
}

if (typeof document !== 'undefined') wire(document);
if (typeof module !== 'undefined') module.exports = { createReplay };
