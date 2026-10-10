'use strict';
const e = require('./engine.js');
const cases = require('./expected.json');
let checks = 0, fails = 0;
function eq(a, b, label) {
  checks++;
  if (a !== b) { fails++; console.log('FAIL', label, 'engine:', a, 'oracle:', b); }
}
for (const c of cases) {
  let r, text;
  if (c.tool === 'room') { r = e.roomRug(...c.args); text = e.renderRoom(r); }
  else if (c.tool === 'dining') { r = e.diningRug(...c.args); text = e.renderDining(r); }
  else { r = e.sofaRule(...c.args); text = e.renderSofa(r); }
  const keys = new Set([...Object.keys(r), ...Object.keys(c.expect)]);
  for (const k of keys) eq(JSON.stringify(r[k]), JSON.stringify(c.expect[k]), c.tool + ' ' + JSON.stringify(c.args) + ' .' + k);
  checks++;
  if (r.error) { if (text !== r.error) { fails++; console.log('FAIL render error passthrough', text); } }
  else if (typeof text !== 'string' || text.length < 5 || /error|undefined|NaN/.test(text)) { fails++; console.log('FAIL render text', text); }
}
eq(e.renderRoom(e.roomRug(420,340,45)), 'Rug up to 330 x 250 cm - largest standard that fits: 200 x 300 cm, leaving about 60 cm of floor on the long sides.', 'render room default');
eq(e.renderDining(e.diningRug(180,90,60)), 'Rug at least 300 x 210 cm so chairs stay on it when pulled out.', 'render dining default');
eq(e.renderSofa(e.sofaRule(220,240)), 'front legs on, extends 10 cm past each arm.', 'render sofa default');
console.log(checks + ' checks, ' + fails + ' failures over ' + cases.length + ' cases');
process.exit(fails ? 1 : 0);
