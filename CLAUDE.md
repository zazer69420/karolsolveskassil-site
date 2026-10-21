# karolsolveskassil.ca — site notes

Static site with handwritten and digital solutions for Mr. Kassil's SPH4U
(Grade 12 University Physics) lessons. Plain HTML/CSS/JS, no build step.

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
  `wrangler.jsonc`, `.assetsignore`) don't need a new time.
- Change only what was asked. Keep the existing design and wording.
- Don't overwrite an existing PDF without confirming it should be replaced.

## Adding PDFs

- Put them in `pdfs/` named exactly `lesson-<id>-handwritten.pdf` or
  `lesson-<id>-digital.pdf`, lowercase, where `<id>` is the lesson's `id` in
  the `lessons` array in `index.html` (e.g. `1-6`, `1-8-review`, `2-1b`).
  Uploaded files often have extra words like `-completed` or `-v2`; rename them.
- No code change is needed. The page sends a HEAD request for each PDF and
  swaps "Coming soon" for the View/Download buttons when the file exists.
- Keep each file under 25 MiB (Cloudflare's per-file limit for static assets;
  a 30 MB file fails with "Asset too large"). If an upload is too big, first
  try lossless fixes: e.g. images stored with an extra `/ASCII85Decode` filter
  can be decoded to plain `/FlateDecode` with pypdf (cut 1.8b from 27.9 MB to
  22.1 MB with pixel-identical pages). Compare `pdftoppm` renders afterwards.
- Check a PDF's content matches the lesson before publishing, not just its
  file name.

## Adding a lesson or unit

- Add an entry to the `lessons` array in `index.html` (around line 915):
  `{"id": "2-15", "number": "2.15", "title": "..."}`. Ids must be lowercase
  letters, digits and hyphens. The part before the first hyphen is the unit
  number; a new unit gets its own collapsible group automatically.
- Lesson-specific warnings on the handwritten card are hard-coded in
  `resourceCard()` (currently for `1-2` and `1-3b`).
- The banner text under the header is `<p class="handwritten-notice">`.

## Other files

- `view/index.html` is the in-site PDF viewer, opened as
  `view/?file=lesson-<id>-<format>&title=...`. It uses pdf.js from `vendor/`.
- Visit/download counting goes to `https://events.karolsolveskassil.ca/`, a
  separate service not in this repo.
- `wrangler.jsonc` tells Cloudflare to publish this folder as static assets.
  `.assetsignore` keeps `.git` and repo-only files off the live site; add any
  new non-site file (notes, configs) to it.

## Testing locally

- `python3 -m http.server 8000` in the repo root, then open
  `http://localhost:8000/`.
- `npx wrangler deploy --dry-run` checks the Cloudflare config without
  deploying (it reports "Asset too large" for any file over the limit).
