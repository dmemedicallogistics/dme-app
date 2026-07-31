import { useState, useEffect } from 'react';
import { Clock, LogOut, Loader2, XCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import Header from './Header';

export default function PendingApproval() {
  const [loading, setLoading] = useState(true);
  const [contactName, setContactName] = useState('');
  const [status, setStatus] = useState<'pending' | 'rejected'>('pending');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('contact_name, approved, status, is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile query error:', profileError);
      }

      if (profile) {
        setContactName(profile.contact_name);

        if (profile.is_admin) {
          window.location.href = '/admin';
          return;
        }

        if (profile.approved) {
          window.location.href = '/portal';
          return;
        }

        if (profile.status === 'rejected') {
          setStatus('rejected');
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Error checking status:', err);
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            {status === 'rejected' ? (
              <>
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                  <XCircle className="h-8 w-8 text-gray-500" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Account Request Not Approved
                </h1>

                <p className="text-lg text-gray-600 mb-6">
                  Hi {contactName}, thanks for your interest in DME Medical Logistics.
                </p>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                  <p className="text-gray-700">
                    We were unable to approve this portal account request. If you believe this is a
                    mistake or would like more information, please contact us directly at{' '}
                    <a href="tel:6308850414" className="font-semibold text-red-600">(630) 885-0414</a>.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Account Pending Approval
                </h1>

                <p className="text-lg text-gray-600 mb-6">
                  Thank you for signing up, {contactName}!
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                  <p className="text-gray-700">
                    Your account is currently pending approval. Please wait for an administrator
                    to review and approve your account before accessing the portal.
                  </p>
                  <p className="text-gray-700 mt-4">
                    You will be able to access the portal once your account has been approved.
                  </p>
                </div>
              </>
            )}

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
