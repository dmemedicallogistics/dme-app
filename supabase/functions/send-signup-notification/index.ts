// Notifies the admin inbox when a new provider account signs up and needs
// approval. No PHI — company name, contact name, and email only (the same
// fields shown in the Admin > Accounts tab).

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
    const { company_name, contact_name, email } = await req.json();

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const fromAddress = Deno.env.get('RESEND_FROM') || 'DME Medical Logistics <onboarding@resend.dev>';

    if (!resendKey) {
      // No key configured — don't fail the signup flow over this.
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
        to: [ADMIN_EMAIL],
        subject: `New provider signup: ${company_name || 'Unknown company'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #292524;">
            <h2 style="color: #dc2626;">New Provider Account Pending Approval</h2>
            <table style="border-collapse: collapse; margin: 16px 0; font-size: 14px;">
              <tr><td style="padding: 6px 16px 6px 0; color: #78716c;">Company</td><td style="padding: 6px 0;"><strong>${escapeHtml(company_name)}</strong></td></tr>
              <tr><td style="padding: 6px 16px 6px 0; color: #78716c;">Contact</td><td style="padding: 6px 0;">${escapeHtml(contact_name)}</td></tr>
              <tr><td style="padding: 6px 16px 6px 0; color: #78716c;">Email</td><td style="padding: 6px 0;">${escapeHtml(email)}</td></tr>
            </table>
            <p><a href="https://www.dmemedicallogistics.com/admin" style="color: #dc2626;">Review in Admin →</a></p>
          </div>
        `,
      }),
    }).catch(() => {});

    return json({ success: true }, 200);
  } catch (err) {
    return json({ error: (err as Error).message || 'Notification failed' }, 500);
  }
});
