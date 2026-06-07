import Header from './Header';
import {
  CheckCircle, Clock, MapPin, Truck, Shield, Zap,
  Home, ClipboardList, Building2, UserCheck, Users,
  Heart, Phone, Mail, ChevronRight
} from 'lucide-react';

// ── TRUST BAR ──────────────────────────────────────────────────────────────
const trustItems = [
  { icon: CheckCircle, label: 'PPO Insurance Accepted' },
  { icon: Shield, label: 'Prior Auth Handled For You' },
  { icon: MapPin, label: 'Cook, DuPage & Surrounding Counties' },
  { icon: Truck, label: 'Home Delivery' },
  { icon: Shield, label: 'HIPAA Compliant' },
];

// ── SERVICES ───────────────────────────────────────────────────────────────
const services = [
  {
    icon: Home,
    title: 'Bath Safety Equipment',
    desc: 'Essential bathroom aids to prevent falls and support independence at home.',
    items: ['Shower chairs & bath stools', 'Tub transfer benches', 'Grab bars & safety rails', 'Raised toilet seats & commodes'],
  },
  {
    icon: ClipboardList,
    title: 'Incontinence Supplies',
    desc: 'Discreet, high-absorbency products for daily comfort and dignity.',
    items: ['Adult briefs & pull-ups', 'Bladder control liners & pads', 'Disposable & reusable underpads', 'Catheters & drainage supplies'],
  },
  {
    icon: Truck,
    title: 'Full-Service Fulfillment',
    desc: 'We handle every step from order to delivery — no extra work for your team.',
    items: ['Insurance verification & eligibility', 'Prior authorization management', 'Direct home delivery', 'Ongoing refill coordination'],
  },
];

// ── PARTNERS ───────────────────────────────────────────────────────────────
const partners = [
  { icon: Building2, title: 'Home Health Agencies', desc: 'Streamlined DME for home care teams' },
  { icon: Building2, title: 'Skilled Nursing Facilities', desc: 'Fast turnaround for patient transitions' },
  { icon: Building2, title: 'Hospitals & Discharge Teams', desc: 'Reliable delivery for seamless transitions' },
  { icon: UserCheck, title: 'Physician Offices & Clinics', desc: 'Direct equipment ordering for outpatient care' },
  { icon: Users, title: 'Case Managers & Care Coordinators', desc: 'Simplified referral process' },
  { icon: Heart, title: 'Hospice & Palliative Care', desc: 'Compassionate, timely equipment delivery' },
];

// ── STEPS ──────────────────────────────────────────────────────────────────
const steps = [
  { n: '1', title: 'Submit a Referral', desc: 'Use the form on this site or call (630) 885-0414. Include the prescription, chart notes, and patient insurance info.' },
  { n: '2', title: 'We Verify Insurance', desc: 'We call the patient\'s insurance directly to confirm eligibility, covered items, quantity limits, and obtain any prior authorization required.' },
  { n: '3', title: 'Order Processed', desc: 'Once approved, we prepare the order and contact the patient to schedule delivery. We keep your team updated throughout.' },
  { n: '4', title: 'Home Delivery', desc: 'Supplies delivered to the patient\'s door. We confirm receipt and follow up on any issues or refill needs.' },
];

// ── WHY ITEMS ──────────────────────────────────────────────────────────────
const whyItems = [
  'Licensed Illinois HME supplier (IDFPR #203003079)',
  'PPO insurance accepted — in & out of network',
  'Illinois IMPACT Medicaid enrollment in progress',
  'We call insurance directly to verify every order',
  'Prior authorization handled — no work for your team',
  'Locally based, responsive, and easy to reach',
];

// ── FAQ ────────────────────────────────────────────────────────────────────
const faqs = [
  { q: 'Do I need a prior authorization before submitting a referral?', a: 'No — we handle prior authorization for you. Submit the referral with the prescription and chart notes. We determine if PA is required and obtain it directly from the insurance company.' },
  { q: 'How long does delivery take after a referral is submitted?', a: 'Up to 48 hours after eligibility verification and all required documentation is complete. Timing can vary based on insurance response times and the specific items ordered.' },
  { q: 'What if my patient\'s insurance requires a specific product?', a: 'We check coverage criteria when verifying benefits. If a specific product is required, we\'ll source it or contact your team to discuss alternatives.' },
  { q: 'Can patients call to request supplies directly?', a: 'Yes. Patients and caregivers can call (630) 885-0414 or submit the form on this site. We\'ll contact their insurance and coordinate with their physician for a prescription if needed.' },
  { q: 'Do you accept Medicaid right now?', a: 'We are currently enrolling with Illinois Medicaid through IMPACT. In the meantime, we accept PPO private insurance. Contact us and we\'ll let you know if we can accommodate a specific patient.' },
  { q: 'What counties do you serve?', a: 'Cook, DuPage, Lake, Kane, Will, McHenry, and Kendall counties. Unsure if we cover your area? Call us at (630) 885-0414.' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-white font-['Inter',sans-serif]">
      <Header />

      {/* ── HERO ── */}
      <section className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-5">
              Fast, Reliable DME Delivery Across Chicagoland
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Bath safety equipment and incontinence supplies delivered directly to your patients' doors.
              We work with patients, caregivers, and healthcare providers — handling insurance verification,
              prior authorization, and all the paperwork.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/referral" className="bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform">
                Submit a Referral
              </a>
              <a href="#how-it-works" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-red-600 hover:text-red-600 transition-colors">
                How It Works
              </a>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-2xl h-[480px] lg:h-[520px]">
            <img
              src="/caregiver-assisting-senior-lady-using-walker.webp"
              alt="Caregiver assisting senior with walker"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-gray-900 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-gray-300 text-sm font-medium">
              <Icon className="h-4 w-4 text-red-400 flex-shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── WHO WE HELP ── */}
      <section id="who-we-help" className="py-20 px-4 sm:px-6 lg:px-8" style={{ scrollMarginTop: '80px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Who We Help</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're a patient needing supplies or a provider submitting referrals — we make it easy for both of you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Patients */}
            <div className="border-2 border-gray-200 rounded-2xl p-10 hover:border-red-600 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mb-5">
                <Home className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Patients & Caregivers</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Need bath safety equipment or incontinence supplies? We accept PPO insurance and can coordinate with your doctor to get you what you need, delivered to your home.
              </p>
              <ul className="space-y-2 mb-8">
                {['Shower chairs, grab bars, tub benches & more', 'Incontinence briefs, pads, liners, catheters', 'PPO insurance covered when eligible', 'Delivered directly to your door'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 text-sm">
                    <CheckCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/referral" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Request Supplies <ChevronRight className="h-4 w-4" />
              </a>
            </div>
            {/* Providers */}
            <div className="border-2 border-gray-200 rounded-2xl p-10 bg-red-50 hover:border-red-600 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-red-600 rounded-xl flex items-center justify-center mb-5">
                <ClipboardList className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">For Healthcare Providers</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Discharge planners, case managers, physicians — submit a referral and we take it from there. No back-and-forth. We verify insurance, handle prior authorization, and coordinate delivery.
              </p>
              <ul className="space-y-2 mb-8">
                {['One simple referral form', 'We call insurance directly — every order', 'Prior authorization handled for you', 'Up to 48 hrs from complete referral to delivery'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-700 text-sm">
                    <CheckCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <a href="/referral" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Submit a Referral <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-600 to-red-700" style={{ scrollMarginTop: '80px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-white mb-4">Our Products & Services</h2>
            <p className="text-xl text-red-200 max-w-2xl mx-auto">Specialized in two core categories — keeping patients safe and comfortable at home</p>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {services.map(({ icon: Icon, title, desc, items }) => (
              <div key={title} className="bg-white rounded-2xl p-9 shadow-xl hover:scale-[1.02] transition-transform">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-lg">
                  <Icon className="h-9 w-9 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{title}</h3>
                <p className="text-gray-500 text-sm mb-4 text-center leading-relaxed">{desc}</p>
                <ul className="space-y-2">
                  {items.map(item => (
                    <li key={item} className="flex items-center gap-2 text-gray-700 text-sm">
                      <CheckCircle className="h-3.5 w-3.5 text-red-600 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR REFERRAL SOURCES ── */}
      <section id="providers" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" style={{ scrollMarginTop: '80px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">For Referral Sources</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">We partner with care teams across Chicagoland to simplify DME for their patients</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">We Make Referring Simple</h3>
              <p className="text-gray-600 leading-relaxed mb-7">
                Submit a referral once — we handle insurance verification, prior authorization, and home delivery. Whether you're coordinating a same-day hospital discharge or managing ongoing patient needs, our process is built to save you time.
              </p>
              <a href="/referral" className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors mb-7">
                Submit a Referral <ChevronRight className="h-4 w-4" />
              </a>
              <div className="bg-red-50 border border-red-100 rounded-xl p-5 flex gap-4">
                <Zap className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-gray-900 text-sm mb-1">Turnaround Time</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Up to 48 hours after eligibility verification and all required documentation is complete. We keep your team updated throughout the process.
                  </p>
                </div>
              </div>
            </div>
            {/* Right — partner grid */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-4">Who We Work With</p>
              <div className="grid grid-cols-2 gap-2">
                {partners.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-4 rounded-xl hover:bg-white transition-colors">
                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8" style={{ scrollMarginTop: '80px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Four simple steps from referral to delivery — we handle every one of them</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="bg-gray-50 border border-gray-100 rounded-xl p-7 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center font-extrabold text-2xl text-red-600 mb-5">{n}</div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT / WHY CHOOSE US ── */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white" style={{ scrollMarginTop: '80px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Supporting Patients & Providers Across Chicagoland</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're a locally based DME supplier focused on two things: making life easier for referral sources, and making patients feel taken care of.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl h-[420px]">
              <img
                src="/iStock-599258384-small.jpg"
                alt="Caregiver with senior patient"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-10 text-white shadow-2xl shadow-red-200">
              <h3 className="text-2xl font-bold mb-7">Why Choose Us?</h3>
              <ul className="space-y-4">
                {whyItems.map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed">
                    <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── INSURANCE ── */}
      <section id="coverage" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" style={{ scrollMarginTop: '80px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Insurance & Coverage</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">We verify eligibility directly with your patient's insurance — no guesswork on your end</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-10 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-5 mb-7">
              <div className="p-5 rounded-xl border-2 border-green-200 bg-green-50">
                <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-wider mb-3">
                  <CheckCircle className="h-4 w-4" /> Currently Accepted
                </div>
                <h3 className="font-bold text-gray-900 mb-2">PPO Private Insurance</h3>
                <p className="text-gray-500 text-sm leading-relaxed">In-network and out-of-network PPO plans. We verify benefits and handle prior authorization before processing any order.</p>
              </div>
              <div className="p-5 rounded-xl border-2 border-yellow-200 bg-yellow-50">
                <div className="flex items-center gap-2 text-yellow-700 font-bold text-xs uppercase tracking-wider mb-3">
                  <Clock className="h-4 w-4" /> Enrollment In Progress
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Illinois Medicaid</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Actively enrolling through Illinois IMPACT. Once approved, we will accept most Illinois Medicaid plans for qualifying patients.</p>
              </div>
              <div className="p-5 rounded-xl border-2 border-red-200 bg-red-50">
                <div className="flex items-center gap-2 text-red-600 font-bold text-xs uppercase tracking-wider mb-3">
                  <Shield className="h-4 w-4" /> Not Accepted
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Medicare</h3>
                <p className="text-gray-500 text-sm leading-relaxed">We do not accept Medicare at this time. If a patient has Medicare as primary, contact us and we can help identify alternatives.</p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-900">
              <strong>How we verify:</strong> For every order, we call the patient's insurance directly to confirm eligibility, covered equipment, quantity limits, and prior authorization requirements. We let you know what's covered before we proceed.
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8" style={{ scrollMarginTop: '80px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Common questions from referral sources and patients</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-3 text-sm leading-snug">{q}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-white mb-4">Ready to Partner With Us?</h2>
          <p className="text-xl text-red-200 mb-8">Submit a referral in minutes. We handle verification, authorization, and delivery.</p>
          <a href="/referral" className="inline-block bg-white text-red-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl hover:-translate-y-0.5 transform">
            Submit a Referral
          </a>
        </div>
      </div>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-white" style={{ scrollMarginTop: '80px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600">We're here Monday through Friday, 9 AM – 5 PM. Leave a message anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-5">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
              <p className="text-gray-500 text-sm mb-3">Call during business hours or leave a message anytime</p>
              <a href="tel:+16308850414" className="text-red-600 font-semibold hover:text-red-700">(630) 885-0414</a>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-5">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Email</h3>
              <p className="text-gray-500 text-sm mb-3">Send a message and we'll respond within one business day</p>
              <a href="mailto:dmemedicallogistics@gmail.com" className="text-red-600 font-semibold hover:text-red-700 break-all">dmemedicallogistics@gmail.com</a>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-5">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Location</h3>
              <p className="text-gray-500 text-sm mb-3">Serving greater Chicagoland from our Bloomingdale office</p>
              <a href="https://maps.google.com/?q=109+Fairfield+Way+Ste+106E+Bloomingdale+IL+60108" target="_blank" rel="noopener noreferrer" className="text-red-600 font-semibold hover:text-red-700">
                109 Fairfield Way Ste 106E<br />Bloomingdale, IL 60108
              </a>
            </div>
          </div>
          {/* Hours */}
          <div className="bg-white rounded-xl p-7 shadow-sm border border-gray-100 flex items-start gap-5">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Business Hours</h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-2">
                <div><p className="font-semibold text-gray-900 text-sm">Monday – Friday</p><p className="text-gray-500 text-sm">9:00 AM – 5:00 PM</p></div>
                <div><p className="font-semibold text-gray-900 text-sm">Saturday – Sunday</p><p className="text-gray-500 text-sm">Closed</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 pt-14 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/BC8459F4-6F5C-4415-8B87-DA151A682328.PNG" alt="DME Medical Logistics" className="h-11 w-11 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                <span className="text-lg font-bold text-white"><span className="text-red-500">DME</span> Medical Logistics</span>
              </div>
              <p className="text-sm leading-relaxed">Providing quality bath safety and incontinence supplies to patients and caregivers across the Chicagoland area. Locally based. Referral friendly.</p>
            </div>
            {/* Links */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {[['#who-we-help', 'Who We Help'], ['#services', 'Services'], ['#providers', 'For Providers'], ['#coverage', 'Insurance'], ['#faq', 'FAQ'], ['/referral', 'Submit a Referral'], ['/login', 'Client Portal']].map(([href, label]) => (
                  <li key={label}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm">Contact</h4>
              <div className="space-y-1 text-sm">
                <p><a href="tel:+16308850414" className="hover:text-white transition-colors">(630) 885-0414</a></p>
                <p><a href="mailto:dmemedicallogistics@gmail.com" className="hover:text-white transition-colors">dmemedicallogistics@gmail.com</a></p>
                <p className="mt-2">109 Fairfield Way Ste 106E<br />Bloomingdale, IL 60108</p>
              </div>
              <h4 className="text-white font-bold mt-6 mb-2 text-sm">Service Area</h4>
              <p className="text-sm">Cook, DuPage, Lake, Kane, Will, McHenry, and Kendall counties.</p>
            </div>
          </div>

          {/* Credentials */}
          <div className="border-t border-gray-800 pt-6 mb-6 grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div><p className="text-white text-xs font-semibold">IDFPR HME License #203003079</p><p className="text-xs text-gray-500">Illinois Dept. of Financial & Professional Regulation</p></div>
            </div>
            <div className="flex items-start gap-3">
              <ClipboardList className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div><p className="text-white text-xs font-semibold">NPI #1740176874</p><p className="text-xs text-gray-500">CMS National Plan & Provider Enumeration System</p></div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <div><p className="text-white text-xs font-semibold">HIPAA Compliant</p><p className="text-xs text-gray-500">All patient information handled per HIPAA Privacy & Security Rules</p></div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-5 text-center text-xs text-gray-600">
            <p>© 2025 DME Medical Logistics. All rights reserved.</p>
            <p className="mt-1">Bloomingdale, IL &nbsp;|&nbsp; IDFPR HME License #203003079 &nbsp;|&nbsp; NPI #1740176874</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
