import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { ClipboardList, Calendar, Building2, User, Package, AlertCircle, Eye } from 'lucide-react';
import Header from './Header';
import ReferralDetail from './ReferralDetail';

interface Referral {
  id: string;
  referral_id: string;
  created_at: string;
  agency_name: string;
  patient_first_name: string;
  patient_last_name: string;
  equipment_needed: string;
  status: string;
}

const STATUS_OPTIONS = [
  'Submitted',
  'Under Insurance Review',
  'Missing Documents',
  'Processing',
  'Scheduled',
  'Delivered',
  'Cancelled'
];

const STATUS_COLORS: Record<string, string> = {
  'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Insurance Review': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Missing Documents': 'bg-red-50 text-red-700 border-red-200',
  'Processing': 'bg-orange-50 text-orange-700 border-orange-200',
  'Scheduled': 'bg-green-50 text-green-700 border-green-200',
  'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Cancelled': 'bg-slate-50 text-slate-700 border-slate-200'
};

export default function Dashboard() {
  const [_isAuthenticated, setIsAuthenticated] = useState(false);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        window.location.href = '/login';
        return;
      }

      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('is_admin')
        .eq('id', user.id)
        .maybeSingle();

      if (error || !profile || !profile.is_admin) {
        window.location.href = '/portal';
        return;
      }

      setIsAuthenticated(true);
      fetchReferrals();
    } catch (err) {
      console.error('Auth check error:', err);
      window.location.href = '/login';
    }
  };

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('referrals')
        .select('id, referral_id, created_at, agency_name, patient_first_name, patient_last_name, equipment_needed, status')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setReferrals(data || []);
    } catch (err) {
      console.error('Failed to fetch referrals:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch referrals');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      setUpdatingStatus(id);
      const statusValue = newStatus.toLowerCase().replace(/ /g, '_');

      const { error } = await supabase
        .from('referrals')
        .update({
          status: statusValue,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Status update error:', error);
        throw new Error(error.message || 'Failed to update status');
      }

      setReferrals(referrals.map(ref =>
        ref.id === id ? { ...ref, status: statusValue } : ref
      ));
    } catch (err) {
      console.error('Failed to update status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      alert('Failed to update status: ' + errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatStatus = (status: string) => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <>
        <Header isAuthenticated={true} />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading referrals...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header isAuthenticated={true} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 pt-20">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ClipboardList className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">Referral Dashboard</h1>
          </div>
          <p className="text-slate-600">View and manage all referral submissions</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error loading referrals</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Referral ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Date Submitted
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Agency Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Equipment Needed
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {referrals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                      No referrals found
                    </td>
                  </tr>
                ) : (
                  referrals.map((referral) => {
                    const formattedStatus = formatStatus(referral.status);
                    return (
                      <tr key={referral.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <ClipboardList className="h-4 w-4 text-slate-400" />
                            <span className="text-sm font-medium text-slate-900">{referral.referral_id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-600">{formatDate(referral.created_at)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-900">{referral.agency_name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-900">
                              {referral.patient_first_name} {referral.patient_last_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <span className="text-sm text-slate-600">{referral.equipment_needed || 'Not specified'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={formattedStatus}
                            onChange={(e) => updateStatus(referral.id, e.target.value)}
                            disabled={updatingStatus === referral.id}
                            className={`text-sm px-3 py-1.5 rounded-full border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                              STATUS_COLORS[formattedStatus] || 'bg-slate-50 text-slate-700 border-slate-200'
                            } ${updatingStatus === referral.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
                          >
                            {STATUS_OPTIONS.map(status => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedReferralId(referral.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedReferralId && (
          <ReferralDetail
            referralId={selectedReferralId}
            onClose={() => setSelectedReferralId(null)}
          />
        )}

        {referrals.length > 0 && (
          <div className="mt-4 text-sm text-slate-600 text-center">
            Showing {referrals.length} {referrals.length === 1 ? 'referral' : 'referrals'}
          </div>
        )}
        </div>
      </div>
    </>
  );
}
