import Header from './Header';
import Footer from './Footer';
import {
  CheckCircle, Clock, Shield, Building2, UserCheck, Users, Heart,
  ArrowRight, Phone, FileText, ClipboardList, Zap, MonitorSmartphone,
} from 'lucide-react';

const checklist = [
  { label: 'Completed referral form (online, 2–3 minutes)', required: true },
  { label: 'Signed prescription / order from physician', required: true },
  { label: 'Insurance card (front & back)', required: true },
  { label: 'Relevant chart notes or clinical documentation', required: false },
  { label: 'Face sheet (for facility referrals)', required: false },
];

const commitments = [
  { icon: Shield, title: 'We verify every order', desc: 'We call the patient\'s insurance directly to confirm eligibility, covered items, and quantity limits — before anything ships.' },
  { icon: Zap, title: 'Prior auth handled', desc: 'If prior authorization is required, we obtain it from the payer. Your team never touches the paperwork.' },
  { icon: Clock, title: 'Up to 48-hour turnaround', desc: 'From complete referral to home delivery, once eligibility is verified and documentation is in.' },
  { icon: MonitorSmartphone, title: 'Track it in the portal', desc: 'A free portal account lets your team submit referrals, check status, and message us — no phone tag.' },
];

const partners = [
  { icon: Building2, title: 'Home Health Agencies', desc: 'Streamlined DME for home care teams' },
  { icon: Building2, title: 'Skilled Nursing Facilities', desc: 'Fast turnaround for patient transitions' },
  { icon: Building2, title: 'Hospitals & Discharge Teams', desc: 'Reliable delivery for seamless discharges' },
  { icon: UserCheck, title: 'Physician Offices & Clinics', desc: 'Direct equipment ordering for outpatient care' },
  { icon: Users, title: 'Case Managers & Coordinators', desc: 'One referral form, zero follow-up burden' },
  { icon: Heart, title: 'Hospice & Palliative Care', desc: 'Compassionate, timely equipment delivery' },
];

const faqs = [
  { q: 'What happens after I submit a referral?', a: 'We confirm receipt, verify the patient\'s insurance, obtain any prior authorization, then contact the patient to schedule delivery. Your team gets status updates throughout — by phone, email, or the portal.' },
  { q: 'What if documentation is missing?', a: 'We\'ll reach out right away and tell you exactly what\'s needed. Incomplete referrals aren\'t rejected — we work with you to complete them.' },
  { q: 'What insurance do you accept?', a: 'PPO private insurance, in and out of network. Illinois Medicaid enrollment is in progress through IMPACT. Medicare orders are fulfilled through our established, Medicare-enrolled partner supplier — we coordinate, they bill.' },
  { q: 'What if my patient has Medicare, or needs equipment beyond your catalog?', a: 'Send the referral anyway. Through our fulfillment partner network — including a Medicare-enrolled supplier with decades in the business — we coordinate specialty equipment and Medicare orders end to end. Your team makes one call either way, and the patient gets taken care of.' },
  { q: 'Is there any cost to my organization?', a: 'No. Referrals, insurance verification, prior authorization, and the provider portal are all free for referral sources.' },
];

export default function ForProviders() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ── */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="eyebrow mb-4">For Healthcare Providers</p>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-ink tracking-tight leading-[1.1] mb-5">
              Refer once. We handle the rest.
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed mb-8">
              Built for discharge planners, case managers, physicians, and home health teams.
              Submit a referral in under three minutes — we verify insurance, obtain prior
              authorization, and deliver to the patient's home within 48 hours of complete documentation.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/referral" className="btn-primary text-base">
                Submit a Referral <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/signup" className="btn-secondary text-base">
                Create a Portal Account
              </a>
            </div>
            <p className="text-sm text-stone-500 mt-5">
              Prefer phone or fax? Call <a href="tel:+16308850414" className="text-red-600 font-semibold hover:underline">(630) 885-0414</a> or
              fax referrals to <span className="text-stone-700 font-semibold">(630) 360-2011</span> — accepted Mon–Fri, 9 AM–5 PM.
            </p>
          </div>

          {/* Checklist card */}
          <div className="card p-8 shadow-lift">
            <div className="flex items-center gap-3 mb-1">
              <FileText className="h-5 w-5 text-red-600" />
              <h2 className="font-display text-lg font-bold text-ink">Referral Checklist</h2>
            </div>
            <p className="text-sm text-stone-500 mb-6">Have these ready and we can usually deliver within 48 hours.</p>
            <ul className="space-y-4">
              {checklist.map(({ label, required }) => (
                <li key={label} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center ${required ? 'bg-red-100' : 'bg-stone-100'}`}>
                    <div className={`w-2 h-2 rounded-full ${required ? 'bg-red-600' : 'bg-stone-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm text-stone-700 leading-snug">{label}</p>
                    <p className={`text-xs mt-0.5 font-medium ${required ? 'text-red-600' : 'text-stone-400'}`}>
                      {required ? 'Required' : 'If available'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <a
              href="/referral-form.pdf"
              download="DME-Medical-Logistics-Referral-Form.pdf"
              className="mt-6 w-full btn-secondary text-sm"
            >
              <FileText className="h-4 w-4" /> Download Printable Referral Form (PDF)
            </a>
            <p className="text-xs text-stone-400 text-center mt-2">Print, complete, and fax to (630) 360-2011</p>
          </div>
        </div>
      </section>

      {/* ── COMMITMENTS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Our Service Commitments</p>
            <h2 className="section-title mb-4">Why care teams refer to us</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-7 hover:shadow-lift transition-shadow">
                <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="font-display font-bold text-ink mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTAL PROMO ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow mb-3">Free For Referral Sources</p>
            <h2 className="section-title mb-5">The provider portal: every referral, one dashboard</h2>
            <p className="text-stone-600 leading-relaxed mb-7">
              Submit new referrals with your agency details pre-filled, track every order's status in
              real time, upload documents securely, and message our team directly — all in one place.
            </p>
            <ul className="space-y-3.5 mb-8">
              {[
                'Real-time status on every referral you submit',
                'Secure, HIPAA-conscious document uploads',
                'Two-way messaging with our team on each order',
                'Pre-filled forms — submit repeat referrals faster',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-stone-700">
                  <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[15px]">{item}</span>
                </li>
              ))}
            </ul>
            <a href="/signup" className="btn-primary">Create Your Free Account <ArrowRight className="h-4 w-4" /></a>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lift h-[400px]">
            <img src="/iStock-599258384-small.jpg" alt="Care coordinator working with patient" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* ── WHO WE WORK WITH ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Referral Partners</p>
            <h2 className="section-title mb-4">Who we work with</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partners.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card p-6 flex items-start gap-4">
                <div className="w-11 h-11 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-display font-bold text-ink text-[15px]">{title}</p>
                  <p className="text-stone-500 text-sm mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Provider Questions</p>
            <h2 className="section-title">FAQ for referral sources</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details key={q} className="card group px-6 py-5 open:shadow-lift transition-shadow">
                <summary className="flex items-center justify-between cursor-pointer list-none font-display font-bold text-ink text-[15px]">
                  {q}
                  <span className="ml-4 text-red-600 text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-stone-600 text-sm leading-relaxed mt-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-br from-red-700 to-red-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <ClipboardList className="h-10 w-10 text-red-200 mx-auto mb-5" />
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">Have a patient who needs supplies?</h2>
          <p className="text-lg text-red-100/90 mb-8">Submit the referral now — we'll confirm receipt and get to work today.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/referral" className="inline-flex items-center gap-2 bg-white text-red-700 px-8 py-3.5 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-lift">
              Submit a Referral <ArrowRight className="h-4 w-4" />
            </a>
            <a href="tel:+16308850414" className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-white/10 transition-colors">
              <Phone className="h-4 w-4" /> (630) 885-0414
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
