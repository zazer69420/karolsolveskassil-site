# karolsolveskassil.ca — site notes

Static site with handwritten and digital solutions for Mr. Kassil's SPH4U
(Grade 12 University Physics) lessons. Plain HTML/CSS/JS. The only build step is
`tools/sync-posted.mjs`, which Cloudflare runs before each deploy.

## How the site goes live

- The live site is a Cloudflare Worker (`karolsolveskassil-website`) connected
  to this GitHub repo through Workers Builds. Every push to `main` builds and
  publishes the site automatically.
- **Changes are not live until they are merged into `main`.** Work on a side
  branch, then open a pull request and merge it. Pushing only to a side branch
  does nothing to the live site.
- Red ✕ "Workers Builds" checks on side-branch commits are expected (only
  `main` is deployed) and do not affect the live site. A red ✕ on a `main`
  commit is a real failure: the live site keeps the previous version until a
  build succeeds. The build log is on the karolsolveskassil-website Worker's
  build page in the Cloudflare dashboard (linked from the ✕ check on GitHub);
  it needs the owner's login.

## Rules for every update

- Change the "Last updated" line in `index.html`
  (`<p class="update-note">`) to the current Eastern time, same format, e.g.
  `Last updated · Oct 21, 2026 at 1:35 AM EDT`.
  Get the time with: `TZ=America/Toronto date "+%b %-d, %Y at %-I:%M %p %Z"`
  Changes that only touch repo files not served on the site (this file,
  `wrangler.jsonc`, `.assetsignore`, `tools/`) don't need a new time.
- Change only what was asked. Keep the existing design and wording.
- Don't overwrite an existing PDF without confirming it should be replaced.

## Adding PDFs

- Put them in `pdfs/` named exactly `lesson-<id>-handwritten.pdf` or
  `lesson-<id>-digital.pdf`, lowercase, where `<id>` is the lesson's `id` in
  `lessons.js` (e.g. `1-6`, `1-8-review`, `2-1b`).
  Uploaded files often have extra words like `-completed` or `-v2`; rename them.
- Then run `node tools/sync-posted.mjs` and commit `pdfs/posted.json` with the
  PDF. That list says which keys are posted and the date each was added (Eastern
  time); the site reads it once instead of checking every PDF. It drives the
  View/Download buttons, the H/D menu badges, the "x of y posted" counts, the
  unit progress bars, What's new and the "new" dots. No code change is needed.
- If the list isn't updated, Cloudflare's build adds the missing PDF anyway,
  dated the day it went live, but only in the deployed copy, so commit it.
- Dates are when a PDF reached this repo. The first 26 (Oct 20, 2026) are the day
  the repo was created; earlier posting dates on the old site aren't known.
- Keep each file under 25 MiB (Cloudflare's per-file limit for static assets;
  a 30 MB file fails with "Asset too large"). If an upload is too big, first
  try lossless fixes: e.g. images stored with an extra `/ASCII85Decode` filter
  can be decoded to plain `/FlateDecode` with pypdf (cut 1.8b from 27.9 MB to
  22.1 MB with pixel-identical pages). Compare `pdftoppm` renders afterwards.
- Check a PDF's content matches the lesson before publishing, not just its
  file name.

## Adding a lesson or unit

- Add an entry to `window.SITE_LESSONS` in `lessons.js`:
  `{ id: '2-15', number: '2.15', title: '...' }`. Ids must be lowercase
  letters, digits and hyphens. The part before the first hyphen is the unit
  number; a new unit gets its own collapsible group automatically. The order
  of the list is the Previous/Next order on the site and in the viewer.
- Unit names (for the home-page unit cards and search) are `window.SITE_UNITS`
  in `lessons.js`. Unit colours are the `[data-unit="N"]` rules in `index.html`
  (units 1–5 are defined). A unit card with no lessons shows "Coming later".
- Lesson-specific warnings on the handwritten card are hard-coded in
  `resourceCard()` (currently for `1-2` and `1-3b`).
- The banner text under the header is `<p class="handwritten-notice">`.

## Other files

- `view/index.html` is the in-site PDF viewer, opened as
  `view/?file=lesson-<id>-<format>&title=...`. It uses pdf.js from `vendor/`,
  and reads `lessons.js` and `pdfs/posted.json` for the Handwritten/Digital
  switch and Previous/Next. `view/?file=formula-sheet` shows the formula sheet
  image with zoom.
- Remembered only in the student's browser (localStorage): `postedKeysSeen`
  (for "new" dots) and `viewerPosition:<file>` (reopen where they left off).
- Phones and windows up to 920 px wide get the "Lessons" button instead of the
  side menu; the club banner shows only on the home page there.
- Dark mode follows the device setting: the `prefers-color-scheme: dark`
  blocks at the end of the `<style>` in `index.html` and `view/index.html`.
  New colours need a dark version there too.
- Visit/download counting goes to `https://events.karolsolveskassil.ca/`, a
  separate service not in this repo.
- `wrangler.jsonc` tells Cloudflare to publish this folder as static assets
  and to run `node tools/sync-posted.mjs` first.
  `.assetsignore` keeps `.git` and repo-only files off the live site; add any
  new non-site file (notes, configs) to it.

## Testing locally

- `python3 -m http.server 8000` in the repo root, then open
  `http://localhost:8000/`.
- `npx wrangler deploy --dry-run` checks the Cloudflare config without
  deploying (it reports "Asset too large" for any file over the limit).
