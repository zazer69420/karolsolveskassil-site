// Keeps pdfs/posted.json in step with the PDFs in pdfs/.
// Run it after adding a PDF:  node tools/sync-posted.mjs
// Cloudflare also runs it before every deploy (see wrangler.jsonc), so a PDF
// uploaded without a list entry still appears, dated the day it went live.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const listPath = new URL('../pdfs/posted.json', import.meta.url);
const pdfDir = new URL('../pdfs/', import.meta.url);
const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto', year: 'numeric', month: '2-digit', day: '2-digit'
}).format(new Date());

let posted = {};
try {
  posted = JSON.parse(readFileSync(listPath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') {
    console.error(`pdfs/posted.json could not be read: ${error.message}`);
    process.exit(1);
  }
}

const onDisk = new Set();
for (const name of readdirSync(pdfDir)) {
  const match = name.match(/^lesson-([a-z0-9-]+)-(handwritten|digital)\.pdf$/);
  if (match) onDisk.add(`${match[1]}:${match[2]}`);
}

const changes = [];
for (const key of onDisk) {
  const [id, format] = key.split(':');
  posted[id] ??= {};
  if (!posted[id][format]) {
    posted[id][format] = today;
    changes.push(`added ${key} (${today})`);
  }
}
for (const [id, formats] of Object.entries(posted)) {
  for (const format of Object.keys(formats)) {
    if (!onDisk.has(`${id}:${format}`)) {
      delete formats[format];
      changes.push(`removed ${id}:${format} (no PDF)`);
    }
  }
  if (!Object.keys(formats).length) delete posted[id];
}

// Sort ids by unit then lesson number so the file stays easy to read.
const order = id => id.split(/(\d+)/).map(part => (/^\d+$/.test(part) ? part.padStart(4, '0') : part)).join('');
const sorted = {};
for (const id of Object.keys(posted).sort((a, b) => order(a).localeCompare(order(b)))) {
  sorted[id] = {};
  for (const format of ['handwritten', 'digital']) {
    if (posted[id][format]) sorted[id][format] = posted[id][format];
  }
}
const text = Object.keys(sorted).length
  ? `{\n${Object.entries(sorted).map(([id, f]) => `  ${JSON.stringify(id)}: ${JSON.stringify(f).replace(/,/g, ', ').replace(/:/g, ': ')}`).join(',\n')}\n}\n`
  : '{}\n';
writeFileSync(listPath, text);
console.log(changes.length ? `pdfs/posted.json: ${changes.join('; ')}` : 'pdfs/posted.json is up to date');
