# EOR Underwriting Portal PRD

# EOR Underwriting Portal PRD 

[Caitlin Gile](mailto:cgile@rippling.com)[Sanjana Krishnam](mailto:s.krishnam@rippling.com)

# Problem

Rippling currently collects underwriting information from prospective or current EOR customers. This currently happens when the customer is requesting exceptions (Zero or Reduced Deposits), or when it is a particularly large Risk exposure, but is planned to be more frequent ( Example: Non standard PTO entitlements ). There is no current customer-facing UX to submit documents, so AEs complete this on the customer’s behalf in an internal Retool. 

### **Pain Points**

#### **For Customers**

* **Disjoint Underwriting Flow**: Underwriting requests are handled at the customer’s discretion. Customers discover need for underwriting mid-onboarding either when attempting atypical requests (e.g., Above statutory vacation entitlements ) or when prompted by AEs during implementation due to risk exposure (e.g., large employee counts like 100+).  
* **No self-serve capability**: All underwriting-related steps (intake, document submission, status updates) require back-and-forth with an AE over email.

#### **For Rippling**

* **AE-driven bottlenecks**: AEs are responsible for intake, document collection, and communicating underwriting decisions creating inefficiencies and slowing down the process.  
* **No enforcement or guardrails**: Deposit approvals (including reduced or zero deposits) are not tied to any controls. For example, a customer approved for 5 employees can scale to 50 without triggering any review or monitoring.  
* **Customer initiated**: Underwriting is entirely customer-initiated (e.g., when requesting deposit exceptions). There is no proactive or in-product mechanism to require underwriting based on risk signals or thresholds.

**Current State**

* AE submit request here: [Retool link](https://retool.ripplinginternal.com/apps/6cbebcf4-c0cf-11f0-beeb-d763817f4496/Risk/EOR%20%26%20COR%20Underwriting%20Risk%20Request%20Form) [Demo video](https://www.loom.com/share/c4046e49f5ce4510a7a4830d6107b3fd)  
* Confluence enablement [Page: EOR Credit Risk Review Process: Zero Deposit EOR, Requests for Reduced Deposits, and Expedited Deposit Refunds](https://rippling.atlassian.net/wiki/spaces/RISK/pages/3416293599/EOR+Credit+Risk+Review+Process+Zero+Deposit+EOR+Requests+for+Reduced+Deposits+and+Expedited+Deposit+Refunds)

# Proposed Approach

Inject a self-serve underwriting form in multiple places in the customer journey

**Use Case 1: Prospect Seeking Deposit Exception Pre-Onboarding** 

A prospective EOR customer expecting to hire at scale or in higher salary bands wants clarity on whether they qualify for deposit exceptions before committing to or progressing through onboarding.

**Flow:**

1. AE shares an application link with the interested prospect   
2. Prospect clicks the link and completes the application, submitting required information such as financial statements, anticipated employee count, and average salary bands  
3. Progress is saved so the prospect can return and complete the application across multiple sessions if needed  
4. Upon submission, the outcome is surfaced immediately in the flow – approved, pending review, or rejected  
5. If the application requires more information, the AE must follow up with next steps.   
6. We must also send out an automated email for approved and rejected applications to the customer. 

**Note: Step (1) and Step (5) will remain until we are able to improve the instant decisioning rate and improve the application rates that do not require additional information. Once the rates improve, we can open this up to the public and we can also eliminate step (5).** 

**Use Case 2: Existing Customer Seeking Better Deposit Terms**

An existing Rippling customer on EOR or transitioning to it who wants to reduce or eliminate their deposit requirement as they scale or migrate to EOR.

**Flow:**

1. Customer navigates to Company Settings and initiates an underwriting application for zero or reduced deposit terms  
2. Customer completes and submits the application, providing required information such as financial statements, anticipated employee count, and average salary bands  
3. Progress is saved so the customer can return and complete the application across multiple sessions if needed  
4. Upon submission, the outcome is surfaced in-product — approved, pending review, or rejected  
5. Customers are notified in-product when a final decision is reached.  
6. If the application requires more information, the AE must follow up with next steps. The AE must be able to provide a link to attach more documents which updates customer information in the product. 

**Use Case 3:  Rippling-Initiated: Customer Crosses Liability Threshold During Hiring**

An existing customer who has never been underwritten (or is on standard deposit terms) or a customer who has been underwritten attempts to hire and their liability exposure crosses a certain threshold and we require them to be underwritten again as existing documentation is stale. Rippling proactively intercepts the hiring flow and surfaces an underwriting form in the hiring flow 

This is distinct from the two use cases because the customer did not initiate and it was surfaced in the product by Rippling. Rippling is forcing it based on its own Risk Threshold. It also happens mid flow rather than a standalone action

**Flow:**

1. Customer initiates a hire or transition request  
2. Customer inputs compensation details, notice period, PTO entitlements, and employee information  
3. Make a call to the risk platform with this information to determine whether underwriting is required  
4. If underwriting is required ( Do not want to block hiring completely as its bad UX ):  
   * The customer is directed to the underwriting application to submit required documentation.   
   * If auto approved/rejected:  
     * Customer is returned to the hiring flow and proceeds to the cost review page, which reflects zero or reduced deposit  
   * If pending manual review:   
     * Customer proceeds to the cost review page and is required to put a bank account on file  
     * Deposit is not initiated until the underwriting decision is confirmed  
     * Risk must return a hiring data block duration that accounts for: (a) time to reach a positive underwriting decision, and/or (b) time to collect the deposit if needed.   
     * Based on the block received from Risk we need to request the customer to update the start date.  
     * If the underwriting decision is approved,   
       * Deposit is waived or reduced accordingly  
     * If the underwriting decision is not approved,  
       * The standard deposit is triggered  
5. If underwriting is not required:   
   * Customer continues through the hiring flow as normal

# Scope

**Q1**

* Underwriting Form modeled after [Retool link](https://retool.ripplinginternal.com/apps/6cbebcf4-c0cf-11f0-beeb-d763817f4496/Risk/EOR%20%26%20COR%20Underwriting%20Risk%20Request%20Form). Will be exposed on [https://www.rippling.com/](https://www.rippling.com/) for existing customers and prospects. This page does not require login and must be completed in one sitting. Underwriting form will collect the following information [Design brief: EOR Underwriting portal](https://docs.google.com/document/d/1r0amazgxeOogBxXReahSb9ludcr8LhEj0Yc43M9z24U/edit?tab=t.g9cd6ewjocu9) and make a call to the Risk API and create a Risk Case  
* Application outcomes are sent to the Customer by the Risk Team. End state for application will continue to say “Pending” for all use cases due to API Performance limitations ( Handled Async )   
* The link will have the request type embedded within it ( i.e Zero Deposit, Partial Deposit Waiver for Role, Partial Deposit Waiver for Company ).  
* Underwriting form will not be able to persist state information and will need customers to complete the application in one sitting 

**Q2**

* Incremental Improvements for Use Case (1)   
  * Persist state information for customers  
  * Improve API performance to handle synchronous calls and surface application outcomes in the flow  
  * Automate email delivery once final application outcome is decided on  
  * If applications require more information that still needs to be handled by AE’s manually.   
* Implement Use Case (2)   
  * Include Plaid Integration   
    

**Q3**

Prerequisites: Improve underwriting form by including more inputs upfront to prevent back and forth between customer and AE, improve auto approval/rejection rates, reduce number of applications requiring additional information

* Implement Use Case (3)


# Detailed Requirements

## Application Entry Points

### New Application Link
AE shares a direct application link with the prospect. Clicking opens the underwriting application form.

### Continue with Application Link
Clicking the "Continue with application" link leads to a **Resume Application** page with the following:

- **Header**: Rippling logo
- **Title**: "Continue with your application"
- **Description**: "Enter the email address you used to start your application. If this application exists, we will send a new email with a link to continue with your application."
- **Fields**:
  - Work email address (required)
- **Action**: "Send email link" button
- **Behavior**:
  - User enters the work email they originally used to start their application
  - If a matching application is found, the system sends an email containing a magic link to resume the application
  - If no matching application exists, the system should still display a generic confirmation message (to avoid leaking whether an application exists for a given email)
  - The magic link in the email opens the application form pre-populated with previously saved progress

# Resources

* Spend self-serve onboarding has a very similar customer-facing page, which can be viewed at [https://app.rippling.com/get-spend-card/application-form](https://app.rippling.com/get-spend-card/application-form) for reference.  [Page: NLS Overview and Debugging](https://rippling.atlassian.net/wiki/spaces/SM/pages/4252860569/NLS+Overview+and+Debugging)  
* The desired long term state: [UX mock in Figma Make](https://www.figma.com/make/UfNWLL5KwlIeps6sEtCHnp/Credit-Underwriting-Diagram?node-id=0-1&t=ciec0ckqe923VjUP-1)

# Information Collected \- Q1

[Retool link](https://retool.ripplinginternal.com/apps/6cbebcf4-c0cf-11f0-beeb-d763817f4496/Risk/EOR%20%26%20COR%20Underwriting%20Risk%20Request%20Form)

**Your Rippling Account**

* Existing Rippling Customer  
* Prospect

**Company Information**

* Company Legal Name  
* Work Email Address  
* Country of Incorporation  
* Company Tax ID (EIN/VAT)  
* Company Address

Note: Cannot require customer COID or Salesforce record link \- customers will not have access to this.  Must be able to provide only company name or admin email.

**Request Information**

* Average Monthly payroll for the company \- including EOR employees, non-EOR employees and contractors:   
* Select Submission Request Type:   
  * Employer of Record,   
  * Contractor of Record,   
  * Both

* Select Country

For each country

* Employee Information   
  * Number of Employees   
  * Average Employee Monthly Salary in USD   
  * Average Employee EOY Bonus in USD ( Optional )  
* Contractor Information  
  * Number of Monthly/Hourly Contractors  
  * Number of Milestone Contractors  
  * Average Monthly Pay in USD ( Optional )   
  * Average Milestone Amount in USD ( optional ) 

**Financial and Other Details**

* Bank Statement File upload ( Mandatory )   
  * Most recent 3 months of bank statements from all bank accounts with cash/cash-equivalent balances. This can be from multiple bank accounts as long as all accounts have common ownership (same customer).  
* Other Financial Information ( Optional )   
  * Past 2 years of financial statements: audited or CPA-prepared income statement, balance sheet, & statement of cash-flows. Required if monthly EOR is \> $500k  
  * Documentation showing terms for bank line of credit & current balance (if used/available)  
* Census File Upload ( Optional )   
  * If the company is moving workers over from another provider, you can attach an export (CSV/XSXL) of their census here

**Additional Considerations for review by Underwriters ( Optional )**   
Freeform Text

# Questions/Discovery

**Mar 16, 2026**

**Notes**

* Q1: Overall applications will not increase; Channel will change. Still at customer’s discretion on whether they want to go through underwriting. If in case they’re doing something non standard; they’ll want to raise a request for this.   
* Q2: Hook into the onboarding flow \+ Hiring Blocks. Push them through the self-service flo

* Align on Scope for Q1


**Current State**

* How does an approval decision surface in the product today for zero deposit, partial deposit, role based partial deposit? What do the customers see?  
* What happens when a customer approaches or exceeds their approved exposure limit?  
* How does role based partial deposits work? Are they applied after role creation?  
* When reality diverges from underwriting assumptions post onboarding, what actually happens today? Is anyone notified or does it just silently diverge? How do we handle the “loosely approximated” underwriting today? Do we cross check role information submitted in census versus the role information input in product?  
* What is the split of underwriting requests?  
  * Prospects vs Existing Customers  
  * Census vs No Census

**Use Cases**

* New Hires  
  * Are we comfortable approving customers with minimal info knowing discrepancies can occur? Do we have a threshold for this? Any gates?  
  * Do we still want to expose this as a viable path if we’re enabling this option within EOR self serve?

**Underwriting Improvements**

* What are the underwriting improvements we are planning for next quarter? Example: Including census imports for automated underwriting.  
* What additional information will be required to improve underwriting outcomes?  
* Do we pull any information from Plaid today? Can we reuse it for underwriting?  
* Do we want to run recurring checks on Plaid accounts as time passes to increase limits for underwriting?

**Post Submission Experience**

* What are the possible outcomes of the underwriting decision?   
  * Current  
  * Future \- Approved Immediately, Manual Review, Need More Information, Rejected, Partial Deposits  
* What are the conditions for automated approval vs needing a manual review? What is the SLA for manual review?  
* How often do we expect manual review?

**Self-Serve Onboarding**

* Do we want to showcase it to all customers, or for all attributes or do we want to surface it only for a select few? What are the gates?  
* How should manual review experience surface in self-serve onboarding?


**API modifications**

* Needs to evolve to support self-serve onboarding 


  
**Prioritization POV**

* What is the next thing to prioritize for underwriting?  
* Next  
  * Persist Application State in NLS Form   
  * Enable Post Submission Experiences  
  * Enable in Risk Verification/Company Settings   
  * Enable in Self Serve Onboarding Flow \- Hiring, Transitions Single and Bulk  
  * Data inconsistencies during underwriting  
    * Wrong info was input  
    * How do we want to charge more?


    

    




# Notes

* Risk Controls: Embed in Hiring/Transition Flow  
  * Within the single hiring or bulk hiring or transitions flow, for a specific liability exposure, we force customers to go through underwriting and block hiring either until we receive a deposit or underwriting has been approved  
  * For existing customers on zero or partial deposit terms,   
    * Risk will periodically calculate their current liability exposure and compare it against a defined threshold (exact threshold TBD with risk).   
    * If the exposure has grown materially beyond what was originally approved, or if the documents on file are no longer sufficient to support the current exposure, risk will trigger a re-underwriting request  
    * When triggered:  
      * An admin task is raised for the customer, alerting the customer that their underwriting approval needs to be refreshed. Redirect them to the underwriting page.   
      * All future hire and transition requests will revert to standard deposit terms until the re-underwriting is completed and approved.   
      * Surface a notification in the cost hire page with an explanation that underwriting is required again.   
      * Existing employees and their current terms are not affected.  
* For all existing customers on zero deposit or partial deposit waiver Risk would periodically calculate the outstanding liability and compare that against the a “threshold” ( yet to determine the threshold ) and also compare against existing documents that are present, if we need to put the customer through underwriting again, we need to alert the customer \- raise an admin task requesting customers to go through underwriting again.   
* Until that task has been completed, all future hire or transition requests will not eligible for zero deposit or a waiver

  *   
    *   
    * Risk would need to periodically determine if the existing liability is acceptable based on underw  
  *   
  * If their liability exposure has considerably changed from what was initially approved and if we’re not able to determine the “increased” limits due to not having enough information on file, we should navigate the customer through underwriting again.   
*   
* Hiring Flow  
  * Within the hiring flow, if we determine certain customers need to go through underwriting we need to push them through it; eit  
*   
- Suitable for large prospects that don’t typically go through self serve and have not yet onboarded: Prospects can complete and submit an underwriting intake form in: [https://www.rippling.com/](https://www.rippling.com/) and receive immediate decisioning on their credit application and this should simultaneously be immediately reflected in product   
- Existing EOR and non EOR customers should be able to discover and self-serve   
-   
- Expose a self-serve underwriting flow to prospects   
- Embed a self-serve underwriting flow in product for existing EOR and non EOR customers