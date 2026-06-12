import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ForProviders from './ForProviders.tsx';
import ForPatients from './ForPatients.tsx';
import ReferralForm from './ReferralForm.tsx';
import PrivacyPolicy from './PrivacyPolicy.tsx';
import PortalReferralForm from './PortalReferralForm.tsx';

import Login from './Login.tsx';
import Signup from './Signup.tsx';
import Portal from './Portal.tsx';
import PendingApproval from './PendingApproval.tsx';
import Admin from './Admin.tsx';
import AccountSettings from './AccountSettings.tsx';
import ForgotPassword from './ForgotPassword.tsx';
import ResetPassword from './ResetPassword.tsx';

import './index.css';

const path = window.location.pathname;

// Per-route SEO titles & descriptions
const SEO: Record<string, { title: string; description: string }> = {
  '/providers': {
    title: 'For Healthcare Providers | DME Referrals in Chicagoland – DME Medical Logistics',
    description: 'Refer DME patients in under 3 minutes. We verify insurance, handle prior authorization, and deliver bath safety, incontinence, ostomy, wound care, and mobility supplies within 48 hours. Online, phone, or fax referrals.',
  },
  '/patients': {
    title: 'For Patients & Caregivers | Home Medical Supplies – DME Medical Logistics',
    description: 'Bath safety, incontinence, ostomy, wound care, and mobility supplies delivered to your home in Chicagoland. One phone call — we work with your doctor and insurance. Call (630) 885-0414.',
  },
  '/referral': {
    title: 'Submit a Referral | DME Medical Logistics',
    description: 'Submit a DME referral online in 2–3 minutes. Insurance verification and prior authorization handled. Serving Cook, DuPage, and surrounding Illinois counties.',
  },
  '/privacy': {
    title: 'Privacy Policy & Terms of Use | DME Medical Logistics',
    description: 'How DME Medical Logistics collects, uses, and protects patient and referral information, in accordance with HIPAA Privacy and Security Rules.',
  },
};
const seo = SEO[path];
if (seo) {
  document.title = seo.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://www.dmemedicallogistics.com${path}`);
}

let component;
if (path === '/providers') {
  component = <ForProviders />;
} else if (path === '/patients') {
  component = <ForPatients />;
} else if (path === '/privacy') {
  component = <PrivacyPolicy />;
} else if (path === '/referral') {
  component = <ReferralForm />;
} else if (path === '/portal/new-referral') {
  component = <PortalReferralForm />;
} else if (path === '/portal/account') {
  component = <AccountSettings />;
} else if (path === '/dashboard' || path === '/dashboard/view-document') {
  window.location.replace('/admin');
  component = <Admin />;
} else if (path === '/login') {
  component = <Login />;
} else if (path === '/signup') {
  component = <Signup />;
} else if (path === '/forgot-password') {
  component = <ForgotPassword />;
} else if (path === '/reset-password') {
  component = <ResetPassword />;
} else if (path === '/portal') {
  component = <Portal />;
} else if (path === '/pending-approval') {
  component = <PendingApproval />;
} else if (path === '/admin') {
  component = <Admin />;
} else {
  component = <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {component}
  </StrictMode>
);
