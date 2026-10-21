Upload lesson PDFs into this folder using the filenames below. Each lesson can
have one handwritten file and one cleaned-up digital file.

Lesson 1.0 — Vectors
  lesson-1-0-handwritten.pdf
  lesson-1-0-digital.pdf

Lesson 1.1 — Kinematics Vectors
  lesson-1-1-handwritten.pdf
  lesson-1-1-digital.pdf

Lesson 1.2 — Chase Collision
  lesson-1-2-handwritten.pdf
  lesson-1-2-digital.pdf

Lesson 1.3a — Relative Motion
  lesson-1-3a-handwritten.pdf
  lesson-1-3a-digital.pdf

Lesson 1.3b — Relative Motion Day 2
  lesson-1-3b-handwritten.pdf
  lesson-1-3b-digital.pdf

Lesson 1.4 — Acceleration Due to Gravity
  lesson-1-4-handwritten.pdf
  lesson-1-4-digital.pdf

Lesson 1.5a — Projectile Motion
  lesson-1-5a-handwritten.pdf
  lesson-1-5a-digital.pdf

Lesson 1.6 — 2D Acceleration
  lesson-1-6-handwritten.pdf
  lesson-1-6-digital.pdf

Lesson 1.8 — Kinematics Problem Solving
  lesson-1-8-problem-solving-handwritten.pdf
  lesson-1-8-problem-solving-digital.pdf

Lesson 1.8 — Problem Solving Review
  lesson-1-8-review-handwritten.pdf
  lesson-1-8-review-digital.pdf

Lesson 1.8b — Review Extended
  lesson-1-8b-handwritten.pdf
  lesson-1-8b-digital.pdf

Lesson 1.9a — Frames of Reference and Relativity
  lesson-1-9a-handwritten.pdf
  lesson-1-9a-digital.pdf

Lesson 1.9b — Length Contraction and Relative Velocities
  lesson-1-9b-handwritten.pdf
  lesson-1-9b-digital.pdf

Unit 2 and later lessons follow the same pattern:
  lesson-<id>-handwritten.pdf and lesson-<id>-digital.pdf, where <id> is the
  lesson's "id" in lessons.js (for example 2-1b).

After adding a PDF, run   node tools/sync-posted.mjs   and commit the updated
pdfs/posted.json along with it. That list records the date each key was added
and is what the site uses to show it. If it isn't updated, Cloudflare adds the
missing PDF during the build, dated the day it goes live.

The site is published by Cloudflare Workers Builds, which is connected to this
GitHub repository. After adding or replacing PDFs, get the change onto the
main branch (commit to main, or merge a pull request into main). Cloudflare
then builds and publishes the site automatically; no manual upload is needed.
Changes on any other branch do not go live. The matching button appears
automatically once its PDF is published.
