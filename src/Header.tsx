import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { supabase } from './lib/supabase';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export default function Header({ isAuthenticated: _isAuthenticated = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setIsLoggedIn(!!user);
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();
      setIsAdmin(profile?.is_admin || false);
    }
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#') && window.location.pathname !== '/') {
      window.location.href = '/' + href;
    }
    setMobileMenuOpen(false);
  };

  const handlePortalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = isLoggedIn ? '/portal' : '/login';
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 text-decoration-none">
            <img
              src="/BC8459F4-6F5C-4415-8B87-DA151A682328.PNG"
              alt="DME Medical Logistics"
              className="h-14 w-14 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="text-xl font-bold text-gray-900">
              <span className="text-red-600">DME</span> Medical Logistics
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            <a href="/#services" onClick={() => handleNavClick('#services')} className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">Services</a>
            <a href="/#providers" onClick={() => handleNavClick('#providers')} className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">For Providers</a>
            <a href="/#coverage" onClick={() => handleNavClick('#coverage')} className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">Insurance</a>
            <a href="/#faq" onClick={() => handleNavClick('#faq')} className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">FAQ</a>
            <a href="/#contact" onClick={() => handleNavClick('#contact')} className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">Contact</a>
            <a href={isLoggedIn ? '/portal' : '/login'} onClick={handlePortalClick} className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">Client Portal</a>
            {isAdmin && (
              <a href="/admin" className="text-gray-600 hover:text-red-600 transition-colors font-medium text-sm">Admin</a>
            )}
            <a href="/referral" className="bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors font-semibold text-sm">
              Submit a Referral
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 p-1"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3 space-y-1">
            <a href="/#services" onClick={() => handleNavClick('#services')} className="block py-2.5 px-2 text-gray-700 hover:text-red-600 font-medium">Services</a>
            <a href="/#providers" onClick={() => handleNavClick('#providers')} className="block py-2.5 px-2 text-gray-700 hover:text-red-600 font-medium">For Providers</a>
            <a href="/#coverage" onClick={() => handleNavClick('#coverage')} className="block py-2.5 px-2 text-gray-700 hover:text-red-600 font-medium">Insurance</a>
            <a href="/#faq" onClick={() => handleNavClick('#faq')} className="block py-2.5 px-2 text-gray-700 hover:text-red-600 font-medium">FAQ</a>
            <a href="/#contact" onClick={() => handleNavClick('#contact')} className="block py-2.5 px-2 text-gray-700 hover:text-red-600 font-medium">Contact</a>
            <a href={isLoggedIn ? '/portal' : '/login'} onClick={handlePortalClick} className="block py-2.5 px-2 text-gray-700 hover:text-red-600 font-medium">Client Portal</a>
            {isAdmin && (
              <a href="/admin" className="block py-2.5 px-2 text-gray-700 hover:text-red-600 font-medium">Admin</a>
            )}
            <a
              href="/referral"
              className="block mt-2 text-center bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Submit a Referral
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
