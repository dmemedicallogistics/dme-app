// Notifies the referring office when their referral's tracking status
// changes. No PHI — reference number and status only, looked up server-side
// so the client never needs to know the office's email address.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin');
  const cors = corsHeadersFor(origin);
  const json = (payload: unknown, status: number) =>
    new Response(JSON.stringify(payload), {
      headers: { ...cors, 'Content-Type': 'application/json' },
      status,
    });

  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  try {
    const { referral_id, status } = await req.json();
    if (!referral_id) return json({ error: 'Missing referral_id' }, 400);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: referral } = await supabase
      .from('referrals')
      .select('profile_id, agency_name')
      .eq('referral_id', referral_id)
      .maybeSingle();

    if (!referral?.profile_id) {
      // No linked account to notify — nothing to do.
      return json({ success: true, skipped: 'no linked account' }, 200);
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('email, contact_name')
      .eq('id', referral.profile_id)
      .maybeSingle();

    if (!profile?.email) {
      return json({ success: true, skipped: 'no email on file' }, 200);
    }

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const fromAddress = Deno.env.get('RESEND_FROM') || 'DME Medical Logistics <onboarding@resend.dev>';
    if (!resendKey) {
      return json({ success: true, skipped: 'no RESEND_API_KEY configured' }, 200);
    }

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [profile.email],
        subject: `Referral ${referral_id} update: ${status}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #292524;">
            <h2 style="color: #dc2626;">Referral Status Update</h2>
            <p>Hi ${escapeHtml(profile.contact_name) || 'there'},</p>
            <table style="border-collapse: collapse; margin: 16px 0; font-size: 14px;">
              <tr><td style="padding: 6px 16px 6px 0; color: #78716c;">Reference number</td><td style="padding: 6px 0;"><strong>${escapeHtml(referral_id)}</strong></td></tr>
              <tr><td style="padding: 6px 16px 6px 0; color: #78716c;">New status</td><td style="padding: 6px 0;"><strong>${escapeHtml(status)}</strong></td></tr>
            </table>
            <p><a href="https://www.dmemedicallogistics.com/portal" style="color: #dc2626;">View in Provider Portal →</a></p>
            <p style="font-size: 13px; color: #78716c;">Questions? Call (630) 885-0414.</p>
          </div>
        `,
      }),
    }).catch(() => {});

    return json({ success: true }, 200);
  } catch (err) {
    return json({ error: (err as Error).message || 'Notification failed' }, 500);
  }
});
