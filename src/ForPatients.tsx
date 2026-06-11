import Header from './Header';
import Footer from './Footer';
import {
  CheckCircle, Clock, Shield, Phone, Bath, Package, Truck,
  HeartHandshake, ArrowRight,
} from 'lucide-react';

const steps = [
  { n: '1', title: 'Call us — that\'s it', desc: 'Call (630) 885-0414 and tell us what you or your loved one needs. No forms required to get started.' },
  { n: '2', title: 'We handle the paperwork', desc: 'We contact your doctor for the prescription insurance requires, then call your insurance to confirm what\'s covered. You pay nothing for this.' },
  { n: '3', title: 'Delivered to your door', desc: 'Once approved, we schedule a delivery time that works for you. We also follow up on refills so you never run out.' },
];

const products = [
  {
    icon: Bath,
    title: 'Bathroom Safety',
    desc: 'Equipment that helps prevent falls in the bathroom — the most common place for injuries at home.',
    items: ['Shower chairs you can sit on safely', 'Benches to help get in and out of the tub', 'Grab bars and safety rails', 'Raised toilet seats and bedside commodes'],
  },
  {
    icon: Package,
    title: 'Incontinence Supplies',
    desc: 'Discreet, comfortable products delivered in plain packaging — with refills coordinated for you.',
    items: ['Adult briefs and pull-ups in all sizes', 'Bladder control pads and liners', 'Bed and chair protective underpads', 'Catheters and related supplies'],
  },
];

const faqs = [
  { q: 'Do I need to see my doctor first?', a: 'Not necessarily. Call us first — if insurance requires a prescription, we\'ll contact your doctor\'s office directly and handle it for you.' },
  { q: 'How much will it cost me?', a: 'It depends on your insurance plan. Before we process anything, we call your insurance, confirm exactly what\'s covered, and tell you about any cost — no surprises.' },
  { q: 'What insurance do you take?', a: 'PPO private insurance (in and out of network). We are currently enrolling with Illinois Medicaid. We do not accept Medicare — but call us and we can help you find options.' },
  { q: 'How fast can I get my supplies?', a: 'Usually within 48 hours after insurance confirms coverage and we have the required paperwork.' },
  { q: 'Can I order for my parent or someone I care for?', a: 'Yes — caregivers and family members call us every day. We just need the patient\'s information and insurance details, and we take it from there.' },
];

export default function ForPatients() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* ── HERO ── */}
      <section className="pt-36 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cream to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="eyebrow mb-4">For Patients & Caregivers</p>
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-ink tracking-tight leading-[1.1] mb-5">
              The supplies you need, without the hassle.
            </h1>
            <p className="text-lg sm:text-xl text-stone-600 leading-relaxed mb-8">
              Bath safety equipment and incontinence supplies delivered to your home.
              One phone call — we work with your doctor and your insurance so you don't have to.
            </p>
            <div className="flex flex-wrap gap-4 items-center">
              <a href="tel:+16308850414" className="btn-primary !px-8 !py-4 text-lg">
                <Phone className="h-5 w-5" /> Call (630) 885-0414
              </a>
              <a href="mailto:dmemedicallogistics@gmail.com" className="btn-secondary !px-8 !py-4 text-lg">
                Email Us
              </a>
            </div>
            <p className="text-sm text-stone-500 mt-5">Monday–Friday, 9 AM – 5 PM · Leave a message anytime and we'll call you back.</p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lift h-[420px]">
            <img
              src="/steven-hwg-zBsdRTHIIm4-unsplash.jpg"
              alt="Senior at home"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ── */}
      <div className="bg-ink py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-2">
          {[
            { icon: Truck, label: 'Free Home Delivery' },
            { icon: Shield, label: 'We Deal With Insurance For You' },
            { icon: Clock, label: 'Delivery In As Little As 48 Hours' },
            { icon: HeartHandshake, label: 'A Local Team That Answers The Phone' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-stone-300 text-sm font-medium">
              <Icon className="h-4 w-4 text-red-400 flex-shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── 3 STEPS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">It Really Is This Simple</p>
            <h2 className="section-title mb-4">Getting supplies in 3 steps</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map(({ n, title, desc }) => (
              <div key={n} className="card p-8 text-center">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center font-display font-extrabold text-2xl text-white mb-5 mx-auto">{n}</div>
                <h3 className="font-display text-lg font-bold text-ink mb-3">{title}</h3>
                <p className="text-stone-600 text-[15px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">What We Deliver</p>
            <h2 className="section-title mb-4">Supplies for safety and comfort at home</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {products.map(({ icon: Icon, title, desc, items }) => (
              <div key={title} className="card p-8">
                <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-5">
                  <Icon className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="font-display text-xl font-bold text-ink mb-2">{title}</h3>
                <p className="text-stone-500 text-[15px] mb-5 leading-relaxed">{desc}</p>
                <ul className="space-y-2.5">
                  {items.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-stone-700 text-[15px]">
                      <CheckCircle className="h-4 w-4 text-red-600 flex-shrink-0 mt-1" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="text-center text-stone-500 text-sm mt-8">
            Not sure what you need? Call us — we'll help you figure it out, free of charge.
          </p>
        </div>
      </section>

      {/* ── INSURANCE, PLAIN LANGUAGE ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Insurance, In Plain English</p>
            <h2 className="section-title mb-4">Will my insurance cover this?</h2>
            <p className="text-lg text-stone-600">We find out for you — before you owe anything.</p>
          </div>
          <div className="card p-8 space-y-5">
            {[
              { ok: true, title: 'PPO private insurance', desc: 'Yes — we accept PPO plans, both in-network and out-of-network. We call your insurance and confirm coverage before processing your order.' },
              { ok: true, soon: true, title: 'Illinois Medicaid', desc: 'Coming soon — we are finishing our enrollment with Illinois Medicaid. Call us and we\'ll let you know the latest.' },
              { ok: false, title: 'Medicare', desc: 'We do not accept Medicare at this time. If Medicare is your primary insurance, call us anyway — we can point you toward alternatives.' },
            ].map(({ ok, soon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${ok ? (soon ? 'bg-amber-100' : 'bg-green-100') : 'bg-stone-200'}`}>
                  {ok ? (soon ? <Clock className="h-4 w-4 text-amber-600" /> : <CheckCircle className="h-4 w-4 text-green-600" />) : <Shield className="h-4 w-4 text-stone-500" />}
                </div>
                <div>
                  <h3 className="font-display font-bold text-ink">{title}</h3>
                  <p className="text-stone-600 text-[15px] leading-relaxed mt-1">{desc}</p>
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
            <p className="eyebrow mb-3">Common Questions</p>
            <h2 className="section-title">Questions families ask us</h2>
          </div>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <details key={q} className="card group px-6 py-5 open:shadow-lift transition-shadow">
                <summary className="flex items-center justify-between cursor-pointer list-none font-display font-bold text-ink text-[15px]">
                  {q}
                  <span className="ml-4 text-red-600 text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="text-stone-600 text-[15px] leading-relaxed mt-3">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="bg-gradient-to-br from-red-700 to-red-900 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <HeartHandshake className="h-10 w-10 text-red-200 mx-auto mb-5" />
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-4">One call takes care of it</h2>
          <p className="text-lg text-red-100/90 mb-8">Talk to a real, local person — no phone menus, no runaround.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:+16308850414" className="inline-flex items-center gap-2 bg-white text-red-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-red-50 transition-colors shadow-lift">
              <Phone className="h-5 w-5" /> (630) 885-0414
            </a>
            <a href="mailto:dmemedicallogistics@gmail.com" className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
              Email Us <ArrowRight className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
