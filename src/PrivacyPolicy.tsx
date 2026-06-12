import Header from './Header';
import Footer from './Footer';

const SECTIONS = [
  {
    h: 'Who We Are',
    p: [
      'DME Medical Logistics ("we," "us," or "our") is a durable medical equipment supplier located at 109 Fairfield Way Ste 106E, Bloomingdale, IL 60108, licensed by the Illinois Department of Financial and Professional Regulation (HME License #203003079, NPI #1740176874). This Privacy Policy describes how we collect, use, and protect information submitted through our website, dmemedicallogistics.com, and in the course of providing our services.',
    ],
  },
  {
    h: 'Information We Collect',
    p: [
      'Referral and order information: when a healthcare provider, patient, or caregiver submits a referral — online, by phone, or by fax — we collect the information needed to process the order. This may include patient name, date of birth, address, phone number, insurance information, prescriptions, and relevant clinical documentation.',
      'Contact information: name, organization, phone number, and email address of referral sources and portal account holders.',
      'Website usage data: we use privacy-focused analytics to understand general site usage (such as pages visited). This data is aggregated and does not identify individual visitors. We do not sell visitor data or use third-party advertising trackers.',
    ],
  },
  {
    h: 'How We Use Health Information',
    p: [
      'Patient health information is used solely to provide our services: verifying insurance eligibility and benefits, obtaining prior authorization, processing and delivering orders, coordinating refills, and communicating with the patient\'s care team.',
      'As a supplier of medical equipment, we handle protected health information (PHI) in accordance with the HIPAA Privacy and Security Rules. We limit access to PHI to authorized personnel who need it to perform their duties, and we use and disclose only the minimum necessary information to accomplish the intended purpose.',
    ],
  },
  {
    h: 'When We Share Information',
    p: [
      'We share information only as needed to fulfill orders and as permitted or required by law. This may include: the patient\'s insurance company (to verify coverage and submit claims); the prescribing physician or referring care team (to coordinate care and obtain documentation); fulfillment and delivery partners, including our established partner suppliers, when they participate in fulfilling an order; and government authorities when required by law.',
      'We do not sell personal or health information to anyone, and we do not share it for marketing purposes.',
    ],
  },
  {
    h: 'How We Protect Information',
    p: [
      'Referral submissions are transmitted over encrypted connections (HTTPS). Documents and records are stored in access-controlled systems limited to authorized personnel. Provider portal accounts are individually approved before activation and protected by password authentication.',
      'No method of transmission or storage is 100% secure, but we work to protect your information using administrative, technical, and physical safeguards appropriate to our business.',
    ],
  },
  {
    h: 'Data Retention',
    p: [
      'We retain referral and order records for as long as needed to provide services and to meet legal, regulatory, and insurance documentation requirements applicable to durable medical equipment suppliers. When records are no longer required, they are disposed of securely.',
    ],
  },
  {
    h: 'Your Rights',
    p: [
      'You may request access to the information we hold about you or your patient, request corrections to inaccurate information, or ask questions about how information has been used or shared. Patients may also have additional rights with respect to their health information under HIPAA and applicable Illinois law.',
      'To exercise these rights or ask questions, contact us at (630) 885-0414 or dmemedicallogistics@gmail.com.',
    ],
  },
  {
    h: 'Website Terms of Use',
    p: [
      'The content on this website is provided for general information about our products and services and is not medical advice. Always consult a physician or qualified health provider regarding medical conditions and equipment needs.',
      'By submitting a referral through this website, you confirm that you are authorized to share the patient\'s information for the purpose of obtaining medical equipment and supplies, consistent with HIPAA and your organization\'s policies.',
      'Insurance coverage statements on this website are general in nature; actual coverage is determined by the patient\'s insurance plan and verified individually for every order.',
    ],
  },
  {
    h: 'Changes to This Policy',
    p: [
      'We may update this Privacy Policy from time to time. The current version will always be posted on this page. Material changes will be reflected by updating the effective date below.',
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <p className="eyebrow mb-3">Your Information, Protected</p>
          <h1 className="font-display text-4xl font-extrabold text-ink tracking-tight mb-3">Privacy Policy & Terms of Use</h1>
          <p className="text-stone-500 text-sm mb-12">Effective date: June 11, 2026</p>

          <div className="space-y-10">
            {SECTIONS.map(({ h, p }) => (
              <div key={h}>
                <h2 className="font-display text-xl font-bold text-ink mb-3">{h}</h2>
                {p.map((para, i) => (
                  <p key={i} className="text-stone-600 text-[15px] leading-relaxed mb-3">{para}</p>
                ))}
              </div>
            ))}
          </div>

          <div className="card p-6 mt-12 text-sm text-stone-600">
            <p className="font-semibold text-ink mb-1">Questions about this policy?</p>
            <p>Call <a href="tel:+16308850414" className="text-red-600 font-semibold">(630) 885-0414</a>, fax (630) 360-2011, or email{' '}
            <a href="mailto:dmemedicallogistics@gmail.com" className="text-red-600 font-semibold">dmemedicallogistics@gmail.com</a>.</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
