# Preethi Ravichandran

**Salesforce & GTM Systems | Revenue Operations**

I work with Sales, Marketing, RevOps, and IT teams to improve prospect data, lead routing, Salesforce automation, and pipeline visibility. My experience includes supporting five production Salesforce orgs and working with stakeholders across the Americas, EMEA, and APAC.

[Explore my portfolio](https://preethi-byte.github.io/gtm-portfolio/)

## Projects

- **Pipeline Triage** — review opportunity data and identify what a deal owner needs to verify.
- **Outreach Readiness** — check prospect records for duplicates, suppression, missing ownership, and incomplete data.
- **CRM Write-back & Retry** — explore controlled field updates, failed writes, and duplicate event handling.

The demos use fictional records to illustrate decisions drawn from my Salesforce and RevOps work.

[Connect on LinkedIn](https://www.linkedin.com/in/preethi-ravichandran-r/)


## Inspect the implementation

[Pipeline review system design](https://preethi-byte.github.io/gtm-portfolio/system-design.html) explains the prototype rules, a worked example, proposed Salesforce schema, exception handling, and rollout plan. The proposed Salesforce implementation has not been deployed as part of this portfolio.

Run the demo-algorithm checks with Node:

```sh
node verify.cjs
```

The 19 checks cover sample decisions, suppression, deduplication, incomplete records, planning math, retry recovery, replay handling, and pipeline rule boundaries. They do not test live integrations.

The portfolio interface and demo code were built with AI assistance and reviewed against scenarios from my Salesforce and RevOps experience.
