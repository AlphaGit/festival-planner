#!/usr/bin/env node
// Save tiff.net's raw festivalfilmlist blob by driving a real Chrome.
//
//     node fetch_blob.mjs [out.json]      # default: festivalfilmlist.json
//     python3 diff_catalog.py festivalfilmlist.json
//
// Why this exists: a plain request gets the AWS WAF challenge, and every
// browser-rendered copy (r.jina.ai, "Save Page As") loses the blurbs'
// <em>/<strong> — TIFF writes the closers as <\/em>, so an HTML parser eats
// the openers and keeps orphan closers (see CLAUDE.md). Re-fetching the URL
// from *inside* a tab that already cleared the WAF returns the untouched
// bytes, so markup_intact() passes and the blurbs keep their italics.
//
// It drives its own Chrome on a scratch profile rather than the one you browse
// with. That is deliberate: Chrome only exposes the CDP HTTP endpoints to an
// instance launched with --remote-debugging-port, and attaching to a live
// session instead means a per-connection "Allow remote debugging?" dialog
// (which hands full access to your cookies and saved data, and does not always
// surface to the accessibility tree, so it cannot be clicked reliably). The
// scratch profile is kept between runs so its WAF cookie survives.
//
// ponytail: no npm dependency — node 22's built-in WebSocket is enough.
import { spawn } from 'child_process';
import { existsSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const URL_ = 'https://www.tiff.net/festivalfilmlist';
const OUT = process.argv[2] || 'festivalfilmlist.json';
const PORT = process.env.TIFF_CDP_PORT || 9333;
const PROFILE = join(tmpdir(), 'tiff-scrape-chrome');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const die = (msg) => { console.error(msg); process.exit(1); };
const cdp = async (path, init) => {
  const r = await fetch(`http://127.0.0.1:${PORT}${path}`, init);
  return r.json();
};
const up = () => cdp('/json/version').then(() => true, () => false);

let child = null;
if (await up()) {
  console.error(`reusing the Chrome already on port ${PORT}`);
} else {
  if (!existsSync(CHROME)) die(`No Chrome at ${CHROME}. Set CHROME=<path to the binary>.`);
  // Headed, not --headless: the WAF challenge is likelier to clear in a real
  // window, and a window that opens and closes is honest about what is running.
  child = spawn(CHROME, [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${PROFILE}`,
    '--no-first-run', '--no-default-browser-check', 'about:blank',
  ], { stdio: 'ignore', detached: true });
  child.unref();
  for (let i = 0; i < 30 && !(await up()); i++) await sleep(500);
  if (!await up()) die(`Chrome never opened its debugging port ${PORT}.`);
}
const quit = async () => { if (child) { try { await cdp('/json/close/' + tab.id); } catch {} child.kill(); } };

const tab = await cdp(`/json/new?${encodeURIComponent(URL_)}`, { method: 'PUT' });
if (!tab.webSocketDebuggerUrl) die(`Chrome would not open a tab: ${JSON.stringify(tab)}`);

const ws = new WebSocket(tab.webSocketDebuggerUrl);
const pending = new Map();
let nextId = 0;
const send = (method, params = {}) => new Promise((res, rej) => {
  const id = ++nextId;
  pending.set(id, { res, rej });
  ws.send(JSON.stringify({ id, method, params }));
});
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  const p = m.id && pending.get(m.id);
  if (!p) return;                       // an event, not a reply — nothing waits on those
  pending.delete(m.id);
  m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result);
};
ws.onerror = () => die(`Lost the CDP socket on port ${PORT}.`);

ws.onopen = async () => {
  // A fresh tab lands on the WAF's JS challenge, which answers the fetch with
  // its own empty body and then reloads itself — tearing down the execution
  // context mid-call, so a throw here means "not settled yet", not "broken".
  // The real blob starts with the filters key; retry until that shows up
  // rather than guessing at which load event is the last one.
  for (let attempt = 1; attempt <= 15; attempt++) {
    let body = '';
    try {
      const r = await send('Runtime.evaluate', {
        expression: `fetch(${JSON.stringify(URL_)}, { cache: 'reload' }).then((r) => r.text())`,
        returnByValue: true,
        awaitPromise: true,
      });
      body = r.exceptionDetails ? '' : (r.result.value ?? '');
    } catch { /* context destroyed by the challenge's reload */ }
    if (body.includes('{"filters"')) {
      writeFileSync(OUT, body);
      console.error(`${OUT}: ${body.length} chars`);
      await quit();
      process.exit(0);
    }
    console.error(`attempt ${attempt}: not past the WAF yet (${body.length} chars), retrying`);
    await sleep(3000);
  }
  await quit();
  die('Never got past the WAF challenge. Open the URL in Chrome yourself and check what it serves.');
};

setTimeout(async () => { await quit(); die('Timed out waiting on Chrome.'); }, 120000);
