const deals = [
 {name:'Northstar Logistics', owner:'Maya', stage:'Negotiation', amount:48000, close:'2026-11-10', activity:'2026-10-19'},
 {name:'Cedar Freight', owner:'Arun', stage:'Discovery', amount:null, close:'2026-12-05', activity:'2026-11-15'},
 {name:'Harborline Systems', owner:'Maya', stage:'Proposal', amount:64000, close:'2026-12-02', activity:null},
 {name:'Summit Marine', owner:'Alex', stage:'Proposal', amount:32000, close:'2026-11-28', activity:'2026-11-14'},
 {name:'Aster Supply', owner:'Arun', stage:'Qualification', amount:0, close:'2026-11-16', activity:'2026-11-13'}
];
const snapshot = Date.parse('2026-11-17');
const daysSince = date => (snapshot - Date.parse(date)) / 86400000;
const currency = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', maximumFractionDigits:0 });
function signals(deal) {
 const flags = [];
 if (daysSince(deal.close) > 0) flags.push(['Overdue close date', 'Confirm buyer timing before proposing a new close date.']);
 if (!deal.activity) flags.push(['No recorded activity', 'Check whether buyer contact occurred and log any confirmed activity.']);
 else if (daysSince(deal.activity) >= 21) flags.push([daysSince(deal.activity) + ' days since recorded activity', 'Confirm whether the buyer is still engaged and agree a next step.']);
 if (!deal.amount) flags.push([deal.amount === null ? 'Deal value missing' : 'Deal value is zero', 'Confirm the expected deal value with the owner.']);
 return flags;
}
const ranked = deals.map(deal => ({...deal, flags:signals(deal)})).sort((a,b) => b.flags.length - a.flags.length);
const reviewed = new Set();
let selected = ranked[0];
function render() {
 const flagged = ranked.filter(deal => deal.flags.length);
 const knownValue = flagged.reduce((sum, deal) => sum + (deal.amount ?? 0), 0);
 document.querySelector('#stats').innerHTML = [
  [flagged.length, 'Flagged deals'],
  [currency.format(knownValue), 'Known value on flagged deals'],
  [reviewed.size, 'Deals reviewed']
 ].map(([value,label]) => '<section><strong>'+value+'</strong>'+label+'</section>').join('');
 document.querySelector('#queue').innerHTML = ranked.map((deal,index) =>
  '<button data-index="'+index+'" aria-pressed="'+(deal === selected)+'"><b>'+deal.name+'</b><span>'+
   (reviewed.has(deal) ? 'Reviewed' : deal.flags.length ? deal.flags.length+' signals' : 'No flags')+'</span></button>'
 ).join('');
 const deal = selected;
 const actions = deal.flags.map(flag => flag[1]).join(' ');
 document.querySelector('#detail').innerHTML = '<small>'+deal.stage+' · Owner '+deal.owner+'</small><h2>'+deal.name+
  '</h2><p>Close date <b>'+deal.close+'</b> · Value <b>'+(deal.amount === null ? 'Missing' : currency.format(deal.amount))+
  '</b><br>Last recorded activity <b>'+(deal.activity ?? 'None recorded')+'</b></p><h3>Review evidence</h3>'+
  (deal.flags.length ? '<ul>'+deal.flags.map(([flag,action])=>'<li><b>'+flag+'</b><br>'+action+'</li>').join('')+
   '</ul><h3>Draft for the deal owner</h3><p id="draft">Hi '+deal.owner+', could you review '+deal.name+
   ' before the next forecast meeting? '+actions+'</p>' : '<p>No flags under the current rules.</p>')+
  '<button id="review">'+(reviewed.has(deal) ? 'Undo review' : 'Mark reviewed')+'</button>';
}
document.querySelector('#queue').addEventListener('click', event => {
 const button = event.target.closest('button[data-index]');
 if (button) {
  selected = ranked[Number(button.dataset.index)];
  render();
  document.querySelector('button[aria-pressed=true]').focus();
 }
});
document.querySelector('#detail').addEventListener('click', event => {
 if (event.target.id === 'review') {
  if (reviewed.has(selected)) reviewed.delete(selected);
  else reviewed.add(selected);
  render();
  document.querySelector('#review').focus();
 }
});
render();

