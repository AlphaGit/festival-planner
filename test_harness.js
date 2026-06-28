// Shared assert harness for the node test suites. No framework, no deps.
// Used by test_solver.js and (via require inside the eval) test_app.cases.js.
let pass = 0, fail = 0;
const assert = (c, m) => { if (!c) throw new Error(m || "assertion failed"); };
const eq = (a, b, m) => assert(a === b, (m ? m + ": " : "") + "expected " + JSON.stringify(b) + ", got " + JSON.stringify(a));
const eqJSON = (a, b, m) => eq(JSON.stringify(a), JSON.stringify(b), m);
function check(name, fn) {
  try { fn(); pass++; }
  catch (e) { fail++; console.error("FAIL  " + name + "\n        " + (e && e.message)); }
}
function report(label) {
  console.log(`\n${label ? `[${label}] ` : ""}${pass} passed, ${fail} failed`);
  if (fail) process.exit(1);
}
module.exports = { check, assert, eq, eqJSON, report };
