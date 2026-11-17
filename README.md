# Preethi Ravichandran | GTM Systems Portfolio

Salesforce and Revenue Operations case studies and three browser-based prototypes using fictional records.

## Run locally

Open `index.html` in a browser or serve this directory with `python -m http.server 8000` and open `http://localhost:8000`.

## Publish on GitHub Pages

1. Create a public GitHub repository named `gtm-portfolio`.
2. Upload the extracted files into the repository root on `main`. Include `index.html`, all three JavaScript files, the cover image, CSS, and `.nojekyll`. Upload the files themselves.
3. In **Settings → Pages**, select **Deploy from a branch**. Choose **main** and **/ (root)** and save.
4. After deployment succeeds, open the link in Pages settings. Test the home page, all three demos, source links, and LinkedIn link in a signed-out window before using the link in a post.

All local links are relative so the site can run under a repository path.

## Technical walkthrough

Each demo runs in the browser with fictional data. The source links appear on the demo pages.

| Work sample | Trace one example | Production extension |
| --- | --- | --- |
| Pipeline Triage | An overdue close date and stale activity add two flags. The deal moves toward the top of the review queue. Marking a review affects the current page session. | Query live opportunity data, agree thresholds with Sales, and retain the reviewer and review outcome. |
| Outreach Readiness | A suppressed address is blocked first. A normalized email already reserved by an eligible row is held as a duplicate. An eligible row gets a templated draft for review. | Verify against the source CRM and suppression list, persist reservations across runs, and require approval before sending. |
| CRM Write-back and Retry | A protected field is blocked. A simulated temporary failure stays pending. After retry succeeds, replaying the same event ID skips the write. | Use a durable queue and persistent event records, with CRM-side idempotency for a successful write followed by a lost acknowledgment. |

A clear interview introduction is “I used AI assistance to implement these browser prototypes. I can walk through the Salesforce workflow each represents, explain its rules, and show how I would test and extend it for production.”
