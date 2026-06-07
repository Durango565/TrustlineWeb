# Trustline Web SEO & Pre-Launch Checklist

This checklist accounts for modern technical pillars—specifically targeting Interaction to Next Paint (INP) optimization, AI Bot Governance, and Entity Recognition.

## Part 1: High-Level Pre-Launch SEO Checklist

### 1. Crawlability & Bot Governance
- [ ] **Robots.txt Architecture**: Verify the file lives at the root. Configure directives for AI crawlers explicitly (e.g., allow OAI-SearchBot for discovery, strategically block or allow Google-Extended for Gemini training based on data privacy preferences).
- [ ] **XML Sitemap**: Generate a clean, dynamic sitemap containing only 200 OK status pages. Exclude staging subdomains, redirected links, and thin utility pages (e.g., privacy policy, success pop-ups).
- [ ] **Canonical Architecture**: Ensure a self-referencing absolute canonical tag (`<link rel="canonical" href="https://trustlinetechnologies.com/current-page/" />`) exists on every single indexable page to avoid duplication penalties from trailing slashes or proxy URLs.

### 2. On-Page Structure & AI / RAG Readiness
- [ ] **Semantic Heading Tree**: Restrict each page to exactly one `<h1>` tag containing the primary high-intent keyword. Use sequential hierarchy (`<h2>` to `<h6>`) without skipping levels.
- [ ] **The BLUF Framework (Bottom Line Up Front)**: For service descriptions, place a concise, direct, definition-style statement in the very first sentence. Modern LLM search filters favor structural clarity.
- [ ] **Data Lists**: Use native HTML definition elements (`<dl>`, `<dt>`, `<dd>`) for services, tech stacks, or specifications so crawlers can easily aggregate your data features.
- [ ] **Metadata Alignment**: Restrict Page Titles to 50–60 characters and Meta Descriptions to 150–160 characters. Embed target high-volume B2B terms natively.

### 3. Core Web Vitals & Performance Engineering
- [ ] **LCP Optimization**: Identify your Largest Contentful Paint asset (usually the hero background or image). Inject the `fetchpriority="high"` attribute on this tag and preload it in the document `<head>`.
- [ ] **Media Optimization**: Convert all imagery to next-gen formats (.webp or .avif). Hardcode explicit width and height dimensions on all inline images to prevent Cumulative Layout Shift (CLS).
- [ ] **INP (Interaction to Next Paint) Guardrails**: Ensure all background JavaScript or third-party tracking scripts are deferred or asynchronous. Main-thread blockings must stay below 200ms.

### 4. Structured Data (Schema JSON-LD)
- [ ] **Corporate Entity Schema**: Inject an Organization schema onto the homepage linking to your brand profiles, official email, and corporate location.
- [ ] **Service Schema**: Inject individual Service or ProfessionalService structured data blocks on matching landing pages detailing your exact offerings.

---

## Part 2: Cross-Check of the Current Development Site
*Baseline: trustlineweb.pages.dev*

| Category | Finding on trustlineweb.pages.dev | Impact | Remediation Action |
| :--- | :--- | :--- | :--- |
| **Domain Strings** | Build contains internal links/references pointing to Cloudflare (`*.pages.dev`). | Medium | Replace all hardcoded staging links with relative paths (`/about`) or absolute live URLs. |
| **Robots.txt** | Currently missing or inheriting default hosting catch-all rules. | High | Create a custom robots.txt matching the production domain specification before deployment. |
| **Canonical Tags** | Canonical elements either point to the dev URL or are missing. | Critical | Swap canonical roots programmatically during your build process to point exclusively to the main TLD. |
| **Schema Markup** | Deep JSON-LD schema blocks are missing or incomplete. | High | Embed custom schema elements mapping out your B2B IT Consulting categorization. |
| **Meta Strings** | Titles/descriptions are unoptimized placeholders or lack specific target variants. | High | Overhaul the string mapping files across pages to reflect the targeted brand identity. |

**Audit Reproduction:** When you deploy to your live URL, reply with *"Run the Pre-Launch Checklist against [Your New URL]"*.

---

## Part 3: Prompt for Your Coding Agent
*(Reserved for developer pipeline)*
