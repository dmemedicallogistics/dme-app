import { useState, useEffect } from 'react';
import { Menu, X, Phone, Clock, Printer } from 'lucide-react';
import { supabase } from './lib/supabase';

interface HeaderProps {
  isAuthenticated?: boolean;
}

const NAV_LINKS = [
  { href: '/providers', label: 'For Providers' },
  { href: '/patients', label: 'For Patients & Caregivers' },
  { href: '/#products', label: 'Products' },
  { href: '/#insurance', label: 'Insurance' },
  { href: '/#contact', label: 'Contact' },
];

export default function Header({ isAuthenticated: _isAuthenticated = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
  };

  const handlePortalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = isLoggedIn ? '/portal' : '/login';
    setMobileMenuOpen(false);
  };

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  return (
    <header className="fixed w-full top-0 z-50">
      {/* Utility bar */}
      <div className="bg-ink text-stone-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <a href="tel:+16308850414" className="flex items-center gap-1.5 hover:text-white transition-colors font-medium">
              <Phone className="h-3 w-3 text-red-400" /> (630) 885-0414
            </a>
            <span className="flex items-center gap-1.5">
              <Printer className="h-3 w-3 text-red-400" /> Fax: (630) 360-2011
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-red-400" /> Mon–Fri, 9 AM – 5 PM
            </span>
          </div>
          <span className="hidden md:block text-stone-400">Licensed Illinois HME Supplier · IDFPR #203003079</span>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[4.25rem]">
            <a href="/" className="flex items-center gap-2.5">
              <img
                src="/BC8459F4-6F5C-4415-8B87-DA151A682328.PNG"
                alt="DME Medical Logistics"
                className="h-11 w-11 object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <span className="font-display text-lg font-bold text-ink leading-tight">
                <span className="text-red-600">DME</span> Medical Logistics
              </span>
            </a>

            {/* Desktop */}
            <div className="hidden lg:flex items-center gap-6">
              {NAV_LINKS.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  className={`text-sm font-medium transition-colors hover:text-red-600 ${currentPath === href ? 'text-red-600' : 'text-stone-600'}`}
                >
                  {label}
                </a>
              ))}
              <a href={isLoggedIn ? '/portal' : '/login'} onClick={handlePortalClick} className="text-sm font-medium text-stone-600 hover:text-red-600 transition-colors">
                Provider Portal
              </a>
              <a href="/providers" className="btn-primary !px-5 !py-2.5 text-sm">
                Refer a Patient
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-stone-600 p-1.5"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile nav */}
          {mobileMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-stone-100 pt-3 space-y-1">
              {NAV_LINKS.map(({ href, label }) => (
                <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="block py-2.5 px-2 text-stone-700 hover:text-red-600 font-medium">
                  {label}
                </a>
              ))}
              <a href={isLoggedIn ? '/portal' : '/login'} onClick={handlePortalClick} className="block py-2.5 px-2 text-stone-700 hover:text-red-600 font-medium">
                Provider Portal
              </a>
              <a href="/providers" onClick={() => setMobileMenuOpen(false)} className="btn-primary w-full mt-2">
                Refer a Patient
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
