// Notifies whichever side (admin or provider) didn't post a comment that a
// new message is waiting on a referral thread. Deliberately does NOT include
// the comment text itself in the email — that field is free text and could
// end up containing something sensitive, so the notification just points
// people back to the portal/admin to read it there.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALLOWED_ORIGINS = [
  'https://dmemedicallogistics.com',
  'https://www.dmemedicallogistics.com',
  'http://localhost:5173',
  'http://localhost:3000',
];

const ADMIN_EMAIL = 'dmemedicallogistics@gmail.com';

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
    const { referralId, authorType } = await req.json();
    if (!referralId || !authorType) return json({ error: 'Missing referralId or authorType' }, 400);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: referral } = await supabase
      .from('referrals')
      .select('referral_id, profile_id')
      .eq('id', referralId)
      .maybeSingle();

    if (!referral) return json({ success: true, skipped: 'referral not found' }, 200);

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const fromAddress = Deno.env.get('RESEND_FROM') || 'DME Medical Logistics <onboarding@resend.dev>';
    if (!resendKey) return json({ success: true, skipped: 'no RESEND_API_KEY configured' }, 200);

    let to: string | null = null;
    let portalLink = 'https://www.dmemedicallogistics.com/admin';

    if (authorType === 'admin') {
      // Admin commented — notify the provider, if there's a linked account.
      if (!referral.profile_id) return json({ success: true, skipped: 'no linked account' }, 200);
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', referral.profile_id)
        .maybeSingle();
      to = profile?.email || null;
      portalLink = 'https://www.dmemedicallogistics.com/portal';
    } else {
      // Provider commented — notify the admin inbox.
      to = ADMIN_EMAIL;
    }

    if (!to) return json({ success: true, skipped: 'no email on file' }, 200);

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [to],
        subject: `New message on referral ${referral.referral_id}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #292524;">
            <h2 style="color: #dc2626;">New Message</h2>
            <p>There's a new message on referral <strong>${escapeHtml(referral.referral_id)}</strong>.</p>
            <p><a href="${portalLink}" style="color: #dc2626;">Log in to view and reply →</a></p>
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
