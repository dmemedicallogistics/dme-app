# DME Medical Logistics — Site Context

This is the source for the DME Medical Logistics website/portal (dmemedicallogistics.com).
Read this before making changes so edits stay consistent with the business, brand, and prior decisions.

## Business

DME Medical Logistics is a durable medical equipment supplier in the Chicagoland area, specializing in
bath safety and incontinence supplies. Startup, currently in the licensing/enrollment phase.

- Address: 109 Fairfield Way Ste 106E, Bloomingdale, IL 60108
- Phone: 630-885-0414 | Fax: 630-360-2011 (referrals by fax; patients are phone-first, not fax)
- Email: dmemedicallogistics@gmail.com
- Website: dmemedicallogistics.com
- Service area: Cook, DuPage, Lake, Kane, Will, McHenry, Kendall counties
- IDFPR HME License #: 203003079 | NPI #: 1740176874

**Insurance accepted:** Illinois Medicaid, PPO private insurance (in and out of network).
**Do NOT accept Medicare** — never imply otherwise in copy or forms.

**Catalog:** Core = bath safety equipment, incontinence supplies. Expanded (as of June 2026) = ostomy,
urological/catheter, wound care, mobility aids (canes, walkers, rollators, crutches, transport chairs).
**Business model constraints:** purchase-only, ship-to-door — NO rental equipment, NO in-home setup/delivery
tech visits. Avoid oxygen/CPAP, custom orthotics & prosthetics, complex rehab wheelchairs, hospital beds/lifts.

**Partner network:** Orders DME ML can't bill (Medicare, complex/licensed items) are routed to an established
Medicare-enrolled DME partner who bills and pays a commission. Site copy should say things like "established
fulfillment partner network" / "we coordinate, partner bills" — never mention commissions in any user-facing
text. (Commission arrangements tied to Medicare/Medicaid referrals raise Anti-Kickback Statute concerns —
flag any changes touching this language for legal review rather than freelancing new claims.)

**Regulatory notes:** Illinois DME suppliers need an HME license from IDFPR (225 ILCS 51). IL Medicaid (HFS)
DMEPOS enrollment requires an active IDFPR license + CMS-recognized accreditation. Incontinence supplies have
a 200-units/30-day HFS quantity limit; bath safety and some incontinence items need prior authorization.
Don't overstate current licensure/enrollment status in copy — verify current status before publishing claims.

## Brand & Design

- Keep the existing clean, light, professional look (cream/white background, professional healthcare feel).
  Two "flashier" redesign concepts (bold editorial, dark animated aurora hero) were explicitly rejected in
  favor of the current published design — don't propose dramatic visual overhauls unless asked.
- Brand red = Tailwind's default bright red scale (e.g. `red-600` / `#dc2626`). A muted/desaturated red was
  tried and explicitly rejected — always use the standard bright red, don't "refine" it without asking.
- A discarded redesign concept lives in `concept-site/` at the project root (outside this `app/` repo) —
  reference only, not in use.

## Tech Stack

- React 18 + TypeScript + Vite, Tailwind CSS, deployed on Vercel (`vercel.json` rewrites all routes to
  `index.html` — SPA routing).
- Backend: Supabase (Postgres + Auth + Storage + Edge Functions). Schema/migrations in `../supabase/`
  (one level up, outside this repo) and `supabase/migrations/`, `supabase/functions/` within this repo.
- Key source files: `src/App.tsx` (routing), `src/Header.tsx`/`Footer.tsx`, `src/ForPatients.tsx` /
  `src/ForProviders.tsx` (dual-path homepage content), `src/Portal.tsx` + `Admin.tsx` (referral portal,
  admin-gated), `src/lib/supabase.ts` (client init).
- Email: Resend, domain dmemedicallogistics.com verified (DKIM/SPF/MX in Squarespace DNS, which manages the
  domain). Edge function secret `RESEND_FROM = "DME Medical Logistics <referrals@dmemedicallogistics.com>"`.

## Security — known state (as of June 2026 audit, verify still current)

- `user_profiles` RLS previously allowed privilege escalation (any user could set their own `is_admin`/
  `approved`); fixed via a `SECURITY DEFINER is_admin()` helper + trigger blocking non-admin privilege
  changes + rebuilt admin policies. Applied directly to the live Supabase DB.
- **`submit-referral` edge function — DELETED 2026-07-31, not deployed.** It accepted a full online patient
  intake (name, DOB, address, diagnosis notes, prescription/insurance card/chart note file uploads), wrote
  that PHI into `public.referrals`, and emailed it via Resend — all without a BAA in place (see gap below).
  It was hardened (origin allowlist, validation, file limits, honeypot) but hardening isn't a substitute for
  a BAA. One real-looking test submission (tied to the admin's own account) had made it into `referrals` and
  `storage.referral-documents`; both were wiped along with the function. An archived copy of the source
  lives at `supabase/functions/submit-referral/index.ts` (reconstructed from the dashboard, **not** verified
  complete — re-check the `referrals` insert columns before ever redeploying). Do not redeploy this function,
  or build any other online path that collects patient name/DOB/diagnosis/documents, until the HIPAA/BAA gap
  below is actually closed. The site is intentionally fax/phone-only for referrals right now.
- **`public.referrals` has 17 dormant PHI columns** left over from the above: `patient_first_name`,
  `patient_last_name`, `patient_dob`, `patient_address`, `patient_phone`, `diagnosis_notes`,
  `prescription_url`, `insurance_url`, `chart_notes_url`, plus `contact_phone`/`contact_email`. They're
  empty and unused by the current frontend (which only reads `agency_name`/`equipment_needed`/`status`), but
  they still exist in the live schema. Don't populate them from any new code path without re-confirming the
  BAA situation first; consider dropping them entirely once that's resolved.
- **HIPAA/BAA gap, open and parked:** Supabase project is on the free tier without a BAA (~$599/mo for
  Supabase Team). Haashim decided not to pay for that yet — plan is to minimize PHI collected instead
  (e.g., trim patient data in confirmation emails) until revisited with a compliance advisor. Don't assume
  this is resolved; don't add new PHI-heavy fields without flagging the gap. Note this also covers Resend
  (no BAA on file) and the `dmemedicallogistics@gmail.com` inbox (personal Gmail, not a HIPAA-eligible mail
  configuration) — both would need to change too, not just Supabase, before any online PHI intake is safe.
- Before assuming any of the above is still true, verify against the current repo/DB state — this is a
  point-in-time summary, not live status.

## Working notes

- When editing, prefer iterating on the existing structure/design over rewrites.
- Any user-facing copy about insurance, licensure, Medicare, or the partner network should be treated as
  legally sensitive — be precise, don't overstate, and flag anything ambiguous rather than guessing.
