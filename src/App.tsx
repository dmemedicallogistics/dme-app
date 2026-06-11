import Header from './Header';
import Footer from './Footer';
import {
  CheckCircle, Clock, MapPin, Truck, Shield,
  Bath, Package, Stethoscope, HeartHandshake, Phone, Mail, ArrowRight,
} from 'lucide-react';

const trustItems = [
  { icon: Shield, label: 'Licensed IL HME Supplier' },
  { icon: CheckCircle, label: 'PPO Insurance Accepted' },
  { icon: Clock, label: 'Up to 48-Hour Turnaround' },
  { icon: Truck, label: 'Free Home Delivery' },
  { icon: MapPin, label: 'Serving 7 Chicagoland Counties' },
];

const products = [
  {
    icon: Bath,
    title: 'Bath Safety Equipment',
    desc: 'Fall-prevention essentials that help patients stay safe and independent at home.',
    items: ['Shower chairs & bath stools', 'Tub transfer benches', 'Grab bars & safety rails', 'Raised toilet seats & commodes'],
  },
  {
    icon: Package,
    title: 'Incontinence Supplies',
    desc: 'Discreet, high-absorbency products delivered monthly for daily comfort and dignity.',
    items: ['Adult briefs & pull-ups', 'Bladder control liners & pads', 'Disposable & reusable underpads', 'Catheters & drainage supplies'],
  },
  {
    icon: Truck,
    title: 'Full-Service Fulfillment',
    desc: 'Every order includes the paperwork — no extra steps for your team or your family.',
    items: ['Insurance verification & eligibility', 'Prior authorization management', 'Direct home delivery', 'Ongoing refill coordination'],
  },
];

const steps = [
  { n: '1', title: 'Reach Out', desc: 'Providers submit a referral online or by phone. Patients and caregivers can simply call us — we’ll coordinate with the doctor.' },
  { n: '2', title: 'We Verify Insurance', desc: 'We call the insurance company directly to confirm eligibility, covered items, and any prior authorization — at no cost to you.' },
  { n: '3', title: 'Order Prepared', desc: 'Once coverage is confirmed, we prepare the order and contact the patient to schedule a delivery time that works.' },
  { n: '4', title: 'Delivered Home', desc: 'Supplies arrive at the patient’s door. We confirm receipt and follow up on refills so nothing runs out.' },
];

const faqs = [
  { q: 'Do I need prior authorization before submitting a referral?', a: 'No — we handle prior authorization for you. Submit the referral with the prescription and chart notes, and we obtain any required authorization directly from the insurance company.' },
  { q: 'How fast is delivery?', a: 'Up to 48 hours after insurance verification and complete documentation. Timing can vary with insurance response times and the specific items ordered.' },
  { q: 'Can patients request supplies without a doctor’s referral?', a: 'Yes. Call (630) 885-0414 and we’ll coordinate directly with your physician to obtain the prescription insurance requires.' },
  { q: 'Do you accept Medicaid right now?', a: 'We are currently enrolling with Illinois Medicaid (IMPACT). In the meantime we accept PPO private insurance — contact us and we’ll let you know if we can accommodate a specific patient.' },
  { q: 'Do you accept Medicare?', a: 'No, we do not accept Medicare at this time. If a patient has Medicare as primary coverage, call us and we can help identify alternatives.' },
  { q: 'What counties do you serve?', a: 'Cook, DuPage, Lake, Kane, Will, McHenry, and Kendall counties. Unsure about your area? Call (630) 885-0414.' },
];

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ── */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream to-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="eyebrow mb-4">Durable Medical Equipment · Chicagoland</p>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-ink tracking-tight leading-[1.1] mb-5">
              Medical supplies, delivered to the patient's door.
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 leading-relaxed">
              Bath safety equipment and incontinence supplies — with insurance verification,
              prior authorization, and home delivery handled for you.
            </p>
          </div>

          {/* Dual path */}
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <a href="/providers" className="card group p-8 text-left hover:border-red-600 hover:shadow-lift transition-all">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-5">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2">I'm a Healthcare Provider</h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-5">
                Discharge planners, case managers, physicians, home health & hospice teams — refer a patient in minutes. We take it from there.
              </p>
              <span className="inline-flex items-center gap-2 font-semibold text-red-600 group-hover:gap-3 transition-all">
                Refer a patient <ArrowRight className="h-4 w-4" />
              </span>
            </a>
            <a href="/patients" className="card group p-8 text-left hover:border-red-600 hover:shadow-lift transition-all">
              <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mb-5">
                <HeartHandshake className="h-6 w-6 text-white" />
              </div>
              <h2 className="font-display text-2xl font-bold text-ink mb-2">I'm a Patient or Caregiver</h2>
              <p className="text-stone-600 text-sm leading-relaxed mb-5">
                Need supplies for yourself or a loved one? One phone call and we coordinate with your doctor and insurance — delivered to your home.
              </p>
              <span className="inline-flex items-center gap-2 font-semibold text-red-600 group-hover:gap-3 transition-all">
                Get supplies at home <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-ink py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2">
          {trustItems.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-stone-300 text-sm font-medium">
              <Icon className="h-4 w-4 text-red-400 flex-shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <section id="products" className="py-20 px-4 sm:px-6 lg:px-8" style={{ scrollMarginTop: '110px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">What We Provide</p>
            <h2 className="section-title mb-4">Products & Services</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">Specialized in two core categories — keeping patients safe and comfortable at home</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {products.map(({ icon: Icon, title, desc, items }) => (
              <div key={title} className="card p-8 hover:shadow-lift transition-shadow">
                <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-ink mb-2">{title}</h3>
                <p className="text-stone-500 text-sm mb-5 leading-relaxed">{desc}</p>
                <ul className="space-y-2.5">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-stone-700 text-sm">
                      <CheckCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-cream" style={{ scrollMarginTop: '110px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Simple By Design</p>
            <h2 className="section-title mb-4">How It Works</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">Four steps from first contact to home delivery — we handle every one</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map(({ n, title, desc }, i) => (
              <div key={n} className="relative card p-7">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 border-t-2 border-dashed border-stone-300" />
                )}
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center font-display font-extrabold text-xl text-white mb-5">{n}</div>
                <h3 className="font-display font-bold text-ink mb-2">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8" style={{ scrollMarginTop: '110px' }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-3xl overflow-hidden shadow-lift h-[400px]">
            <img
              src="/caregiver-assisting-senior-lady-using-walker.webp"
              alt="Caregiver assisting senior with walker"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow mb-3">Locally Based, Personally Invested</p>
            <h2 className="section-title mb-5">A DME partner that actually picks up the phone</h2>
            <p className="text-stone-600 leading-relaxed mb-7">
              We're a Chicagoland-based supplier focused on two things: making life easier for the care
              teams who refer to us, and making patients feel taken care of. No call centers, no runaround —
              a local team that knows your name.
            </p>
            <ul className="space-y-3.5">
              {[
                'Licensed Illinois HME supplier (IDFPR #203003079)',
                'PPO insurance accepted — in & out of network',
                'Illinois Medicaid (IMPACT) enrollment in progress',
                'We call insurance directly to verify every order',
                'Prior authorization handled — zero work for your team',
              ].map(item => (
                <li key={item} className="flex items-start gap-3 text-stone-700">
                  <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <span className="text-[15px]">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── INSURANCE ── */}
      <section id="insurance" className="py-20 px-4 sm:px-6 lg:px-8 bg-cream" style={{ scrollMarginTop: '110px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">No Guesswork</p>
            <h2 className="section-title mb-4">Insurance & Coverage</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">We verify eligibility directly with the insurance company before any order is processed</p>
          </div>
          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto mb-7">
            <div className="card p-6 border-t-4 !border-t-green-500">
              <div className="flex items-center gap-2 text-green-700 font-bold text-xs uppercase tracking-wider mb-3">
                <CheckCircle className="h-4 w-4" /> Accepted
              </div>
              <h3 className="font-display font-bold text-ink mb-2">PPO Private Insurance</h3>
              <p className="text-stone-500 text-sm leading-relaxed">In-network and out-of-network PPO plans. We verify benefits and handle prior authorization before processing any order.</p>
            </div>
            <div className="card p-6 border-t-4 !border-t-amber-400">
              <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wider mb-3">
                <Clock className="h-4 w-4" /> Enrollment In Progress
              </div>
              <h3 className="font-display font-bold text-ink mb-2">Illinois Medicaid</h3>
              <p className="text-stone-500 text-sm leading-relaxed">Actively enrolling through Illinois IMPACT. Once approved, we will accept most Illinois Medicaid plans for qualifying patients.</p>
            </div>
            <div className="card p-6 border-t-4 !border-t-stone-400">
              <div className="flex items-center gap-2 text-stone-600 font-bold text-xs uppercase tracking-wider mb-3">
                <Shield className="h-4 w-4" /> Not Accepted
              </div>
              <h3 className="font-display font-bold text-ink mb-2">Medicare</h3>
              <p className="text-stone-500 text-sm leading-relaxed">We do not accept Medicare at this time. If a patient has Medicare as primary, contact us and we can help identify alternatives.</p>
            </div>
          </div>
          <div className="max-w-5xl mx-auto card p-5 text-sm text-stone-700 bg-white">
            <strong className="text-ink">How we verify:</strong> for every order, we call the patient's insurance directly to confirm eligibility,
            covered equipment, quantity limits, and prior authorization requirements — and tell you what's covered before we proceed.
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8" style={{ scrollMarginTop: '110px' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">Good To Know</p>
            <h2 className="section-title mb-4">Frequently Asked Questions</h2>
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

      {/* ── CTA BANNER ── */}
      <div className="bg-gradient-to-br from-red-700 to-red-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready when you are</h2>
          <p className="text-lg text-red-100/90 mb-8">Submit a referral in minutes, or call and talk to a real person.</p>
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

      {/* ── CONTACT ── */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-cream" style={{ scrollMarginTop: '110px' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">We're Here To Help</p>
            <h2 className="section-title mb-4">Get In Touch</h2>
            <p className="text-lg text-stone-600">Monday through Friday, 9 AM – 5 PM. Leave a message anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="card p-8">
              <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mb-5">
                <Phone className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="font-display font-bold text-ink mb-2">Phone & Fax</h3>
              <p className="text-stone-500 text-sm mb-3">Call during business hours or leave a message anytime</p>
              <a href="tel:+16308850414" className="text-red-600 font-semibold hover:text-red-700">(630) 885-0414</a>
              <p className="text-stone-600 text-sm mt-1.5 font-medium">Fax: (630) 360-2011</p>
            </div>
            <div className="card p-8">
              <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mb-5">
                <Mail className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="font-display font-bold text-ink mb-2">Email</h3>
              <p className="text-stone-500 text-sm mb-3">We respond within one business day</p>
              <a href="mailto:dmemedicallogistics@gmail.com" className="text-red-600 font-semibold hover:text-red-700 break-all">dmemedicallogistics@gmail.com</a>
            </div>
            <div className="card p-8">
              <div className="w-12 h-12 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mb-5">
                <MapPin className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="font-display font-bold text-ink mb-2">Location</h3>
              <p className="text-stone-500 text-sm mb-3">Serving greater Chicagoland from Bloomingdale</p>
              <a href="https://maps.google.com/?q=109+Fairfield+Way+Ste+106E+Bloomingdale+IL+60108" target="_blank" rel="noopener noreferrer" className="text-red-600 font-semibold hover:text-red-700">
                109 Fairfield Way Ste 106E<br />Bloomingdale, IL 60108
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
