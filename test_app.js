// Headless runner for app.js behaviour tests. Run: node test_app.js
//
// app.js isn't a module and calls document/fetch on load, so we eval the SAT
// bundle + solver.js + app.js + the test cases in ONE scope behind a minimal
// DOM/localStorage/fetch shim. The cases (test_app.cases.js) run in that same
// scope, so they can call app.js functions and set its module globals (CATALOG,
// MOVIES, TREE, ...) directly. ponytail: eval is the no-build way to exercise the
// un-modularised app headlessly — reach for jsdom only if we start asserting
// rendered markup (which we deliberately don't).
process.env.TZ = "America/Los_Angeles"; // tz trap: UTC-based code must be unaffected by local zone
const fs = require("fs"), path = require("path");
const r = (f) => fs.readFileSync(path.join(__dirname, f), "utf8");
const shim = `
const fakeNode = new Proxy(function(){}, { get: () => fakeNode, set: () => true, apply: () => fakeNode });
globalThis.window = globalThis;
globalThis.document = { getElementById: () => fakeNode, addEventListener: () => {}, title: "", createElement: () => fakeNode };
globalThis.fetch = () => Promise.reject(new Error("no fetch in tests"));
globalThis.scrollTo = () => {};
globalThis.localStorage = (() => { const m = new Map(); return { getItem:(k)=>m.has(k)?m.get(k):null, setItem:(k,v)=>m.set(k,String(v)), removeItem:(k)=>m.delete(k), clear:()=>m.clear() }; })();
`;
eval(
  r("logic-solver.bundle.js") + "\nglobalThis.LogicSolver = LogicSolver;\n" +
  r("solver.js") + "\n" + shim + r("app.js") + "\n" + r("test_app.cases.js")
);
