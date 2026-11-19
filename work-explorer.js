'use strict';
const cases = {
 routing: {
  name:'Assignment & approvals', tools:'Salesforce Flow · Assignment logic · Approval processes',
  context:'I supported five production Salesforce orgs and contributed to Lead and Opportunity Flow consolidation, assignment changes, and approval redesign.',
  problem:'Ownership and approval changes had to fit the business process and existing automation in the affected org.',
  contribution:'My work included reviewing overlapping Flows, contributing to assignment and approval changes, and coordinating QA, UAT, and release validation.',
  boundary:'The sample below illustrates rule order and exception handling. Its routing criteria are examples, rather than a reproduction of a client configuration.',
  scenarios:[
   {name:'New record with complete routing data',input:'A new lead has the information required by the example routing policy.',steps:[
    ['Inspect the trigger','Check whether the record is new or whether a routing input changed.','Continue only for an eligible event.'],
    ['Check required inputs','The sample has the fields needed to evaluate ownership.','Proceed to the agreed assignment policy.'],
    ['Evaluate the matching rule','One eligible ownership rule matches.','Assign the owner defined by that policy.'],
    ['Validate the handoff','Check downstream automation and access for the assigned owner.','Confirm that the right team can act on the record.']
   ],test:'Create an eligible record and verify the expected owner, visibility, and downstream behaviour.'},
   {name:'Missing routing information',input:'A lead is missing information required by the example ownership policy.',steps:[
    ['Inspect the trigger','The record is eligible for evaluation.','Continue to input validation.'],
    ['Check required inputs','A required routing value is missing.','Do not guess a destination.'],
    ['Apply the exception path','Use the fallback owner or review queue agreed with the business.','Make the missing information visible for resolution.'],
    ['Validate recovery','Complete the missing value and re-evaluate under the defined trigger policy.','Check that the final ownership follows the corrected inputs.']
   ],test:'Leave a routing input blank; confirm the exception destination and then test recovery after correction.'},
   {name:'Approval criteria do not match',input:'An opportunity is evaluated against an example approval policy but does not meet its entry criteria.',steps:[
    ['Inspect approval eligibility','Check the fields used by the agreed entry criteria.','Evaluate before submission.'],
    ['Evaluate the criteria','The sample falls outside the approval requirement.','Follow the default path.'],
    ['Preserve the normal process','No approval is started by this example.','Avoid an unnecessary approval handoff.'],
    ['Test the boundary','Change the input so that it meets the criteria.','Verify that the approval path starts only for eligible records.']
   ],test:'Test matching and nonmatching records, approver access, and the business-defined approval outcomes.'}
  ]
 },
 import: {
  name:'Prospect-import preparation',tools:'VBScript · Account Engagement / Pardot · Data preparation',
  context:'I built a reusable VBScript preparation process for Pardot prospect imports and used Salesforce data tools to investigate invalid or duplicate records.',
  problem:'Import preparation needed to produce usable records and surface issues before data entered a downstream workflow.',
  contribution:'My contribution covered a reusable preparation process and data investigation. The original client script is not included.',
  boundary:'This sample explains a preparation approach with sample records. It does not execute or reproduce the original VBScript.',
  scenarios:[
   {name:'Email with extra spaces',input:'Name: Avery Shah | Email: " AVERY@EXAMPLE.INVALID " | Company: Juniper Systems',steps:[
    ['Inspect the input','The email has surrounding spaces and inconsistent case.','Identify the preparation needed.'],
    ['Prepare a comparison value','Trim surrounding spaces and normalize case for this example.','avery@example.invalid'],
    ['Check the duplicate key','Compare the prepared value with other rows.','Determine whether the sample is unique.'],
    ['Prepare the handoff','Retain an import-ready row and a traceable exception list.','Review before running the actual import.']
   ],test:'Check that preparation is repeatable and does not change an already prepared email.'},
   {name:'Duplicate prospect rows',input:'Row A: avery@example.invalid | Row B: AVERY@example.invalid',steps:[
    ['Inspect both rows','The raw values differ in case.','Normalize the comparison values.'],
    ['Compare the key','Both rows resolve to the same comparison email.','Identify a duplicate candidate.'],
    ['Resolve conflicting values','Inspect ownership and other field differences.','Use the agreed merge or review policy; do not arbitrarily overwrite data.'],
    ['Prepare the handoff','Keep the reviewed record and document the duplicate disposition.','Validate counts before import.']
   ],test:'Compare input, accepted, and exception counts; verify that conflicting values are reviewed.'},
   {name:'Missing email address',input:'Name: Jordan Ellis | Email: blank | Company: Meridian Data',steps:[
    ['Inspect required fields','The sample has no email address.','Flag the missing input.'],
    ['Apply eligibility rules','This example requires an email for the import.','Hold the row for correction.'],
    ['Record the exception','Capture the source row and reason.','Make the failure actionable.'],
    ['Recheck corrected input','Add the verified value before rerunning preparation.','Reconcile the corrected row with the exception list.']
   ],test:'Verify that held rows cannot silently enter the accepted output.'}
  ]
 },
 mapping: {
  name:'Integration troubleshooting',tools:'Salesforce · Dynamics 365 · Outreach · Field mapping',
  context:'I worked hands-on with Dynamics 365–Salesforce field mapping and sync issues, and traced an Outreach defect through source-to-target mapping.',
  problem:'A record can exist in both systems while a field value arrives incorrectly, fails to update, or is overwritten.',
  contribution:'My role included inspecting field mappings and data, investigating the issue, and coordinating validation. This walkthrough shows that investigation approach.',
  boundary:'The sample values and mapping are illustrative. No external system is connected.',
  scenarios:[
   {name:'Value reaches the wrong field',input:'Source value: Operations | Expected destination: Department | Observed destination: Title',steps:[
    ['Confirm the symptom','Compare the source record with the destination record.','Separate the observed value from the expected result.'],
    ['Trace the mapping','The sample maps the source field to Title instead of Department.','Identify the incorrect destination mapping.'],
    ['Coordinate the correction','Confirm the intended mapping with the responsible teams.','Correct the mapping in the test environment.'],
    ['Validate the result','Sync a sample record and inspect both systems.','Verify the intended field changed and unrelated fields stayed intact.']
   ],test:'Validate a new record and an update, then inspect the destination and relevant logs.'},
   {name:'Record syncs, field stays blank',input:'Source field: populated | Destination field: blank | Record: present',steps:[
    ['Confirm record identity','Verify that both systems refer to the same record.','Rule out a matching issue.'],
    ['Inspect the field path','Check the mapping, sync direction, field type, and update rules.','Identify where the value stops progressing.'],
    ['Inspect access and errors','Review integration-user field access and available sync errors.','Distinguish permission failure from mapping or validation failure.'],
    ['Validate the remediation','Test the confirmed cause with a controlled record.','Compare the source and destination after the sync.']
   ],test:'Test the affected field using the relevant integration access, including blank and valid values.'},
   {name:'Value changes back after sync',input:'Salesforce value: updated | Later observation: previous value restored',steps:[
    ['Reconstruct the sequence','Compare available timestamps and field history.','Identify which update happened last.'],
    ['Inspect write direction','Check which system is allowed to write the field.','Look for competing update sources.'],
    ['Agree data ownership','Confirm the authoritative source and overwrite policy.','Align the mapping and update behaviour.'],
    ['Test repeated synchronization','Run the supported test cycle more than once.','Confirm the corrected value remains stable.']
   ],test:'Verify that the intended field owner wins consistently without disrupting other mapped fields.'}
  ]
 }
};
let active = Object.hasOwn(cases,location.hash.slice(1)) ? location.hash.slice(1) : 'routing';
let scenarioIndex=0;
const get=id=>document.getElementById(id);
function render(){
 const c=cases[active], example=c.scenarios[scenarioIndex];
 get('case-title').textContent=c.name;get('tools').textContent=c.tools;
 get('context').textContent=c.context;get('problem').textContent=c.problem;get('contribution').textContent=c.contribution;
 get('scope').textContent=c.boundary;
 get('scenarios').replaceChildren();
 c.scenarios.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.textContent=s.name;b.setAttribute('aria-pressed',String(i===scenarioIndex));b.addEventListener('click',()=>{scenarioIndex=i;render();get('scenarios').children[i].focus();});get('scenarios').append(b);});
 get('input').textContent=example.input;get('steps').replaceChildren();
 example.steps.forEach(([title,condition,result],i)=>{const item=document.createElement('details');item.open=i===0;const summary=document.createElement('summary');summary.textContent=title;const p=document.createElement('p');p.textContent=condition;const out=document.createElement('p');out.className='outcome';out.textContent=result;item.append(summary,p,out);get('steps').append(item);});
 get('test').textContent=example.test;
 document.querySelectorAll('[data-case]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.case===active)));
}
document.querySelectorAll('[data-case]').forEach(b=>b.addEventListener('click',()=>{active=b.dataset.case;scenarioIndex=0;history.replaceState(null,'','#'+active);render();}));
render();
