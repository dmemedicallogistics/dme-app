import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import ReferralForm from './ReferralForm.tsx';
import PortalReferralForm from './PortalReferralForm.tsx';
import Dashboard from './Dashboard.tsx';
import Login from './Login.tsx';
import Signup from './Signup.tsx';
import Portal from './Portal.tsx';
import PendingApproval from './PendingApproval.tsx';
import Admin from './Admin.tsx';
import AccountSettings from './AccountSettings.tsx';
import ForgotPassword from './ForgotPassword.tsx';
import ResetPassword from './ResetPassword.tsx';
import DocumentViewer from './DocumentViewer.tsx';
import './index.css';

const path = window.location.pathname;

let component;
if (path === '/referral') {
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
