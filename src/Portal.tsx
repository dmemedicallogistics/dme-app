import { useState, useEffect } from 'react';
import { LogOut, Loader2, Plus, Settings, Eye } from 'lucide-react';
import { supabase } from './lib/supabase';
import Header from './Header';
import CommentsSection from './CommentsSection';

interface UserProfile {
  company_name: string;
  contact_name: string;
}

interface Referral {
  id: number;
  referral_id: string;
  created_at: string;
  patient_first_name: string;
  patient_last_name: string;
  equipment_needed: string;
  status: string;
}

export default function Portal() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loggingOut, setLoggingOut] = useState(false);
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data: profileData, error } = await supabase
        .from('user_profiles')
        .select('company_name, contact_name, approved')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !profileData) {
        await supabase.auth.signOut();
        window.location.href = '/login';
        return;
      }

      if (!profileData.approved) {
        window.location.href = '/pending-approval';
        return;
      }

      setProfile(profileData);
      await loadReferrals();
      setLoading(false);
    } catch (err) {
      window.location.href = '/login';
    }
  };

  const loadReferrals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('company_name')
        .eq('id', user.id)
        .maybeSingle();

      if (!userProfile) return;

      const { data, error } = await supabase
        .from('referrals')
        .select('id, referral_id, created_at, patient_first_name, patient_last_name, equipment_needed, status')
        .eq('agency_name', userProfile.company_name)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading referrals:', error);
        return;
      }

      setReferrals(data || []);
    } catch (err) {
      console.error('Error loading referrals:', err);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Client Portal
              </h1>
              <p className="text-gray-600">
                Welcome back, {profile?.contact_name}
              </p>
              <p className="text-sm text-gray-500">
                {profile?.company_name}
              </p>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            <a
              href="/portal/new-referral"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-md"
            >
              <Plus className="h-5 w-5" />
              Submit New Referral
            </a>
            <a
              href="/portal/account"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-sm"
            >
              <Settings className="h-5 w-5" />
              Account Settings
            </a>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Your Referrals
              </h2>
            </div>

            {referrals.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 text-lg">
                  No referrals found for your account yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Referral ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Date Submitted
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Patient Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Equipment Needed
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Comments/Updates
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {referrals.map((referral) => (
                      <tr key={referral.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {referral.referral_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(referral.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {referral.patient_first_name} {referral.patient_last_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {referral.equipment_needed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                            {referral.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedReferralId(referral.id.toString())}
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedReferralId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="bg-white border-b border-gray-200 px-8 py-6 rounded-t-xl flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-gray-900">Referral Details & Comments</h2>
              <button
                onClick={() => setSelectedReferralId(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="text-2xl text-gray-600">&times;</span>
              </button>
            </div>
            <div className="px-8 py-6">
              <CommentsSection referralId={selectedReferralId} isAdmin={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
