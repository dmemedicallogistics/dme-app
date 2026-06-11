import { Shield, ClipboardList } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-ink text-stone-400 pt-14 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/BC8459F4-6F5C-4415-8B87-DA151A682328.PNG" alt="DME Medical Logistics" className="h-10 w-10 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="font-display text-lg font-bold text-white"><span className="text-red-400">DME</span> Medical Logistics</span>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Bath safety equipment and incontinence supplies for patients across the Chicagoland area.
              We handle insurance verification, prior authorization, and home delivery — so providers
              and families don't have to.
            </p>
          </div>
          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                ['/providers', 'For Healthcare Providers'],
                ['/patients', 'For Patients & Caregivers'],
                ['/#products', 'Products & Services'],
                ['/#insurance', 'Insurance & Coverage'],
                ['/referral', 'Submit a Referral'],
                ['/login', 'Provider Portal'],
              ].map(([href, label]) => (
                <li key={label}><a href={href} className="hover:text-white transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>
          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm">Contact</h4>
            <div className="space-y-1 text-sm">
              <p><a href="tel:+16308850414" className="hover:text-white transition-colors">(630) 885-0414</a></p>
              <p><a href="mailto:dmemedicallogistics@gmail.com" className="hover:text-white transition-colors break-all">dmemedicallogistics@gmail.com</a></p>
              <p className="mt-2">109 Fairfield Way Ste 106E<br />Bloomingdale, IL 60108</p>
            </div>
            <h4 className="text-white font-bold mt-6 mb-2 text-sm">Service Area</h4>
            <p className="text-sm">Cook, DuPage, Lake, Kane, Will, McHenry & Kendall counties</p>
          </div>
        </div>

        {/* Credentials */}
        <div className="border-t border-white/10 pt-6 mb-6 grid md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div><p className="text-white text-xs font-semibold">IDFPR HME License #203003079</p><p className="text-xs text-stone-500">Illinois Dept. of Financial & Professional Regulation</p></div>
          </div>
          <div className="flex items-start gap-3">
            <ClipboardList className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div><p className="text-white text-xs font-semibold">NPI #1740176874</p><p className="text-xs text-stone-500">CMS National Plan & Provider Enumeration System</p></div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div><p className="text-white text-xs font-semibold">HIPAA Compliant</p><p className="text-xs text-stone-500">Patient information handled per HIPAA Privacy & Security Rules</p></div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-5 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} DME Medical Logistics. All rights reserved.</p>
          <p className="mt-1">Bloomingdale, IL &nbsp;|&nbsp; IDFPR HME License #203003079 &nbsp;|&nbsp; NPI #1740176874 &nbsp;|&nbsp; We do not accept Medicare.</p>
        </div>
      </div>
    </footer>
  );
}
