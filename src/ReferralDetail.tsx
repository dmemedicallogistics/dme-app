import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { X, ClipboardList, Building2, Package, Calendar, AlertCircle, Loader2, User } from 'lucide-react';
import CommentsSection from './CommentsSection';

interface ReferralDetailProps {
  referralId: string;
  onClose: () => void;
}

interface ReferralData {
  id: string;
  referral_id: string;
  created_at: string;
  agency_name: string;
  equipment_needed: string;
  status: string;
  patient_first_name: string | null;
  patient_last_name: string | null;
}

export default function ReferralDetail({ referralId, onClose }: ReferralDetailProps) {
  const [referral, setReferral] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReferralDetails();
  }, [referralId]);

  const fetchReferralDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('referrals')
        .select('id, referral_id, created_at, agency_name, equipment_needed, status, patient_first_name, patient_last_name')
        .eq('id', referralId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error('Referral not found');
      setReferral(data);
    } catch (err) {
      console.error('Failed to fetch referral details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load referral details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  const formatStatus = (status: string) =>
    status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
            <span className="ml-3 text-slate-600">Loading referral…</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !referral) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8">
          <div className="flex items-start gap-3 text-red-600 mb-6">
            <AlertCircle className="h-6 w-6 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-lg">Error</h3>
              <p className="text-sm text-red-700">{error || 'Referral not found'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-700 text-white py-2 px-4 rounded-lg transition-colors">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="bg-white border-b border-slate-200 px-8 py-6 rounded-t-xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <ClipboardList className="h-7 w-7 text-red-600" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Referral Tracking</h2>
              <p className="text-sm text-slate-600">{referral.referral_id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="h-6 w-6 text-slate-600" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-lg p-4">
              <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1"><User className="h-3 w-3" /> Patient</label>
              <p className="text-sm text-slate-900 font-medium mt-1">
                {referral.patient_first_name ? `${referral.patient_first_name} ${referral.patient_last_name ? referral.patient_last_name + '.' : ''}`.trim() : '—'}
              </p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1"><Building2 className="h-3 w-3" /> Referring Office</label>
              <p className="text-sm text-slate-900 font-medium mt-1">{referral.agency_name || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1"><Package className="h-3 w-3" /> Equipment</label>
              <p className="text-sm text-slate-900 mt-1">{referral.equipment_needed || '—'}</p>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <label className="text-xs font-medium text-slate-500 uppercase flex items-center gap-1"><Calendar className="h-3 w-3" /> Received</label>
              <p className="text-sm text-slate-900 mt-1">{formatDate(referral.created_at)}</p>
            </div>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            Status tracking only — no patient health information is stored here. Patient details arrive by secure fax and are never kept in this system.
          </div>

          <div>
            <p className="text-xs font-medium text-slate-500 uppercase mb-1">Current Status</p>
            <p className="text-sm font-semibold text-slate-900">{formatStatus(referral.status)}</p>
          </div>

          <CommentsSection referralId={referral.id} isAdmin={true} />
        </div>

        <div className="bg-slate-50 border-t border-slate-200 px-8 py-4 rounded-b-xl">
          <button onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}
