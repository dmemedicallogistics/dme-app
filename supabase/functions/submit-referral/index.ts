// ARCHIVED — NOT DEPLOYED.
//
// This edge function was deleted from the live Supabase project on 2026-07-31
// as part of a HIPAA compliance review. It accepted a full online patient
// intake (name, DOB, address, diagnosis notes, prescription/insurance
// card/chart note uploads) and both stored that PHI in `public.referrals`
// and emailed it via Resend — none of which is covered by a signed BAA
// (Supabase is on the free tier, Resend has no BAA on file, and the
// notification inbox is a personal Gmail address). The current site is
// fax/phone-only by design; this function contradicts that "no PHI online"
// model and must not be redeployed until HIPAA/BAA coverage is actually in
// place (Supabase Team plan + signed BAA, a BAA with the email vendor, and
// a compliant inbox) and this code has been re-reviewed.
//
// This copy was reconstructed from the deployed source via the Supabase
// dashboard's code viewer immediately before deletion. The referral insert
// below is abbreviated — verify the full column list (patient_address,
// patient_phone, equipment_needed, diagnosis_notes, prescription_url,
// insurance_url, chart_notes_url) against the `public.referrals` schema
// before ever reactivating this.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ── Allowed origins (production site + local dev) ──
const ALLOWED_ORIGINS = [
  'https://dmemedicallogistics.com',
  'https://www.dmemedicallogistics.com',
  'http://localhost:5173',
  'http://localhost:3000',
];

function corsHeadersFor(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

// ── Limits & validation ──
const MAX_PAYLOAD_BYTES = 30 * 1024 * 1024; // 30 MB total request
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB per file
const MAX_INSURANCE_CARDS = 4;
const ALLOWED_EXT = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'heic', 'tif', 'tiff'];
const ALLOWED_MIME = [
  'application/pdf',
  'image/jpeg', 'image/png', 'image/webp', 'image/heic',
  'image/tiff',
];

function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeExt(name: string): string {
  const ext = (name.split('.').pop() || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  return ALLOWED_EXT.includes(ext) ? ext : '';
}

// Decode base64 and validate a single uploaded file. Returns bytes + ext or throws.
function decodeAndValidate(
  file: { name?: string; type?: string; data?: string },
  label: string,
): { bytes: Uint8Array; ext: string } {
  if (!file || typeof file.data !== 'string') throw new Error(`Invalid ${label} upload`);
  const ext = safeExt(file.name || '');
  if (!ext) throw new Error(`${label}: unsupported file type`);
  if (file.type && !ALLOWED_MIME.includes(file.type)) throw new Error(`${label}: unsupported file type`);
  const bytes = Uint8Array.from(atob(file.data), (c) => c.charCodeAt(0));
  if (bytes.length > MAX_FILE_BYTES) throw new Error(`${label}: file too large (max 10 MB)`);
  return { bytes, ext };
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const cors = corsHeadersFor(origin);
  const json = (payload: unknown, status: number) =>
    new Response(JSON.stringify(payload), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status,
    });

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: cors });
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    // Reject oversized requests early
    const contentLength = Number(req.headers.get('Content-Length') || '0');
    if (contentLength && contentLength > MAX_PAYLOAD_BYTES) {
      return json({ error: 'Request too large' }, 413);
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const body = await req.json();
    const {
      agency_name, contact_name, contact_phone, contact_email,
      patient_first_name, patient_last_name, patient_dob,
      patient_address, patient_phone, equipment_needed, diagnosis_notes,
      prescription, insurance_cards, chart_notes,
      company_website, // honeypot — real users never see or fill this field
    } = body;

    // ── Honeypot: bots fill hidden fields; humans don't ──
    if (company_website) {
      // Pretend success so the bot moves on, but store nothing.
      return json({ success: true, referral_id: 'REF-OK' }, 200);
    }

    // ── Required-field validation ──
    if (!contact_name || (!contact_email && !contact_phone)) {
      return json({ error: 'Missing required contact information' }, 400);
    }
    if (!patient_first_name || !patient_last_name) {
      return json({ error: 'Missing required patient information' }, 400);
    }
    if (contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(contact_email))) {
      return json({ error: 'Invalid contact email' }, 400);
    }
    if (Array.isArray(insurance_cards) && insurance_cards.length > MAX_INSURANCE_CARDS) {
      return json({ error: 'Too many insurance card files' }, 400);
    }

    const referral_id = 'REF-' + Date.now().toString(36).toUpperCase();

    // ── Upload prescription ──
    let prescription_url = null;
    if (prescription) {
      const { bytes, ext } = decodeAndValidate(prescription, 'Prescription');
      const path = `${referral_id}/prescription.${ext}`;
      await supabase.storage.from('referral-documents').upload(path, bytes, { contentType: prescription.type });
      prescription_url = path;
    }

    // ── Upload insurance cards ──
    let insurance_url = null;
    if (Array.isArray(insurance_cards) && insurance_cards.length > 0) {
      const urls = [];
      for (let i = 0; i < insurance_cards.length; i++) {
        const { bytes, ext } = decodeAndValidate(insurance_cards[i], `Insurance card ${i + 1}`);
        const path = `${referral_id}/insurance_${i + 1}.${ext}`;
        await supabase.storage.from('referral-documents').upload(path, bytes, { contentType: insurance_cards[i].type });
        urls.push(path);
      }
      insurance_url = urls.join(',');
    }

    // ── Upload chart notes ──
    let chart_notes_url = null;
    if (chart_notes) {
      const { bytes, ext } = decodeAndValidate(chart_notes, 'Chart notes');
      const path = `${referral_id}/chart_notes.${ext}`;
      await supabase.storage.from('referral-documents').upload(path, bytes, { contentType: chart_notes.type });
      chart_notes_url = path;
    }

    // ── Associate with logged-in portal user, if any ──
    let profile_id = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) profile_id = user.id;
    }

    // ── Insert referral record ──
    // NOTE: reconstructed from a partial source capture — the real deployed
    // version likely also set patient_address, patient_phone,
    // equipment_needed, diagnosis_notes, prescription_url, insurance_url,
    // and chart_notes_url here. Reconstruct/verify fully before reactivating.
    const { data, error } = await supabase.from('referrals').insert({
      referral_id,
      agency_name, contact_name, contact_phone, contact_email,
      patient_first_name, patient_last_name, patient_dob,
      status: 'new',
      profile_id,
    }).select().single();

    if (error) throw error;

    // ── Notifications (never block or fail the submission) ──
    supabase.functions.invoke('send-referral-email', {
      body: { referral_id, contact_email },
    }).catch(() => {});

    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (resendKey && contact_email) {
      const fromAddress = Deno.env.get('RESEND_FROM') || 'DME Medical Logistics <onboarding@resend.dev>';
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [contact_email],
            subject: `Referral received — ${referral_id}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #292524;">
                <h2 style="color: #dc2626;">Referral Received</h2>
                <p>Hi ${escapeHtml(contact_name) || 'there'},</p>
                <p>Thank you for your referral${agency_name ? ` from <strong>${escapeHtml(agency_name)}</strong>` : ''}. We've received it and our team is getting started.</p>
                <table style="border-collapse: collapse; margin: 16px 0; font-size: 14px;">
                  <tr><td style="padding: 6px 16px 6px 0; color: #78716c;">Reference number</td><td style="padding: 6px 0;"><strong>${escapeHtml(referral_id)}</strong></td></tr>
                  <tr><td style="padding: 6px 16px 6px 0; color: #78716c;">Patient</td><td style="padding: 6px 0;">${escapeHtml(patient_first_name)} ${escapeHtml(patient_last_name)}</td></tr>
                  <tr><td style="padding: 6px 16px 6px 0; color: #78716c;">Equipment</td><td style="padding: 6px 0;">${escapeHtml(equipment_needed) || '—'}</td></tr>
                </table>
                <p><strong>What happens next:</strong> we verify the patient's insurance, obtain any prior authorization, and contact the patient to schedule delivery — typically within 48 hours of complete documentation. We'll reach out if anything is missing.</p>
                <p style="font-size: 13px; color: #78716c;">Questions? Reply to this email, call (630) 885-0414, or fax (630) 360-2011.<br/>
                DME Medical Logistics · 109 Fairfield Way Ste 106E, Bloomingdale, IL 60108<br/>
                IDFPR HME License #203003079 · NPI #1740176874</p>
              </div>
            `,
          }),
        });
      } catch (_e) {
        // Email failure must never fail the referral submission
      }
    }

    return json({ success: true, referral_id, id: data.id }, 200);
  } catch (err) {
    return json({ error: (err as Error).message || 'Submission failed' }, 500);
  }
});
