# Site maintenance rules

- Every time the site is updated (new PDFs, content, or code changes), change the
  "Last updated" line in `index.html` (`<p class="update-note">`) to the current
  time in Eastern time, using the same format, e.g.
  `Last updated · Oct 21, 2026 at 1:29 AM EDT`.
  Get the time with: `TZ=America/Toronto date "+%b %-d, %Y at %-I:%M %p %Z"`
