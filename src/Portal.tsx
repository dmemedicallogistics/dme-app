import { useState, useEffect } from 'react';
import { LogOut, Loader2, FileText, Settings, Eye } from 'lucide-react';
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
        .select('id, referral_id, created_at, equipment_needed, status')
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
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
            <div>
              <p className="eyebrow mb-2">{profile?.company_name}</p>
              <h1 className="font-display text-4xl font-extrabold text-ink tracking-tight mb-2">
                Welcome back, {profile?.contact_name?.split(' ')[0]}
              </h1>
              <p className="text-stone-600">
                Track your referrals and message our team — all in one place.
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

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Referrals', value: referrals.length },
              { label: 'In Progress', value: referrals.filter(r => !['completed', 'delivered', 'cancelled'].includes(r.status.toLowerCase())).length },
              { label: 'Delivered', value: referrals.filter(r => ['completed', 'delivered'].includes(r.status.toLowerCase())).length },
              { label: 'This Month', value: referrals.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth() && new Date(r.created_at).getFullYear() === new Date().getFullYear()).length },
            ].map(({ label, value }) => (
              <div key={label} className="card p-5">
                <p className="font-display text-3xl font-extrabold text-ink">{value}</p>
                <p className="text-sm text-stone-500 mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="mb-6 card p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-display font-bold text-ink mb-1">Refer a patient</h3>
              <p className="text-sm text-stone-600">
                Download the patient intake form, complete it, and fax it to <span className="font-semibold text-stone-800">(630) 360-2011</span>.
                New referrals appear here once our team logs them.
              </p>
            </div>
            <div className="flex gap-3">
              <a href="/intake-form.pdf.pdf" download="DME-Medical-Logistics-Patient-Intake-Form.pdf" className="btn-primary whitespace-nowrap">
                <FileText className="h-5 w-5" /> Download Form
              </a>
              <a href="/portal/account" className="btn-secondary">
                <Settings className="h-5 w-5" /> Account
              </a>
            </div>
          </div>

          <div className="card overflow-hidden">
            <div className="px-6 py-5 border-b border-stone-200">
              <h2 className="font-display text-xl font-bold text-ink">
                Your Referrals
              </h2>
            </div>

            {referrals.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-stone-600 text-lg font-medium mb-1">No referrals yet</p>
                <p className="text-stone-500 text-sm mb-6">Fax us a completed intake form and it will show up here with live status updates.</p>
                <a href="/intake-form.pdf.pdf" download="DME-Medical-Logistics-Patient-Intake-Form.pdf" className="btn-primary">
                  <FileText className="h-4 w-4" /> Download Intake Form
                </a>
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
                        Date Received
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Equipment
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
