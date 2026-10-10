// Rug math engine - area rug sizing arithmetic.
// Pure functions, no DOM. All borrowed norms are labeled in the UI, not buried here.
'use strict';

function round1(x) { return Math.round(x * 10) / 10; }

// Labeled common retail sizes, small to large.
var STANDARDS = [[120,180],[140,200],[160,230],[170,240],[200,300],[240,340],[300,400]];

// --- Room fit ----------------------------------------------------------------
// Labeled norm: leave an even border of bare floor around the rug (45 cm is a
// common living-room choice). Find the largest standard rug that fits inside.
function roomRug(roomL, roomW, border) {
  if (!(roomL > 0) || !(roomW > 0)) return { error: 'room size must be positive' };
  if (!(border >= 0)) return { error: 'border must not be negative' };
  var maxL = round1(roomL - 2 * border), maxW = round1(roomW - 2 * border);
  if (!(maxL > 0) || !(maxW > 0)) return { error: 'border eats the whole room' };
  var best = null;
  for (var i = 0; i < STANDARDS.length; i++) {
    var a = STANDARDS[i][0], b = STANDARDS[i][1];
    var fits = (a <= maxL && b <= maxW) || (a <= maxW && b <= maxL);
    if (fits && (!best || a * b > best[0] * best[1])) best = [a, b];
  }
  if (!best) return { maxL: maxL, maxW: maxW, size: null, actual: null, verdict: 'no standard size fits - go custom or round' };
  var actual = round1((Math.max(roomL, roomW) - Math.max(best[0], best[1])) / 2);
  return { maxL: maxL, maxW: maxW, size: best, actual: actual, verdict: 'largest standard that fits: ' + best[0] + ' x ' + best[1] + ' cm' };
}

// --- Dining pull-out ---------------------------------------------------------
// Labeled norm: chairs pull out about 60 cm behind the table edge. The rug
// must reach past the pulled-out chair or the back legs drop off it.
function diningRug(tableL, tableW, pullout) {
  if (!(tableL > 0) || !(tableW > 0)) return { error: 'table size must be positive' };
  if (!(pullout >= 0)) return { error: 'pull-out must not be negative' };
  var minL = round1(tableL + 2 * pullout), minW = round1(tableW + 2 * pullout);
  return { minL: minL, minW: minW };
}

// --- Sofa front-legs rule ----------------------------------------------------
// Labeled rule: the rug should run at least the length of the sofa so the
// front legs sit on it, ideally extending past the arms on both sides.
function sofaRule(sofaL, rugL) {
  if (!(sofaL > 0)) return { error: 'sofa length must be positive' };
  if (!(rugL > 0)) return { error: 'rug length must be positive' };
  if (rugL < sofaL) {
    return { fits: false, ext: null, verdict: 'too short by ' + round1(sofaL - rugL) + ' cm - front legs off the rug' };
  }
  var ext = round1((rugL - sofaL) / 2);
  return { fits: true, ext: ext, verdict: 'front legs on, extends ' + ext + ' cm past each arm' };
}

// --- Text rendering (shared by UI and tests) ---------------------------------
function renderRoom(r) {
  if (r.error) return r.error;
  var head = 'Rug up to ' + r.maxL + ' x ' + r.maxW + ' cm - ';
  if (!r.size) return head + r.verdict + '.';
  return head + r.verdict + ', leaving about ' + r.actual + ' cm of floor on the long sides.';
}
function renderDining(r) {
  if (r.error) return r.error;
  return 'Rug at least ' + r.minL + ' x ' + r.minW + ' cm so chairs stay on it when pulled out.';
}
function renderSofa(r) {
  if (r.error) return r.error;
  return r.verdict + '.';
}

var api = {
  round1: round1,
  STANDARDS: STANDARDS,
  roomRug: roomRug,
  diningRug: diningRug,
  sofaRule: sofaRule,
  renderRoom: renderRoom,
  renderDining: renderDining,
  renderSofa: renderSofa
};
if (typeof module !== 'undefined' && module.exports) module.exports = api;
if (typeof window !== 'undefined') window.RugMath = api;
