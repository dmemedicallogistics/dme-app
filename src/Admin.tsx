import { useState, useEffect } from 'react';
import { LogOut, Loader2, CheckCircle, XCircle, ClipboardList, Users, Calendar, Building2, Package, Eye, Plus, X, Pencil, Trash2, Save } from 'lucide-react';
import { supabase } from './lib/supabase';
import Header from './Header';
import ReferralDetail from './ReferralDetail';

interface UserAccount {
  id: string;
  email: string;
  approved: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  company_name: string | null;
}

interface Referral {
  id: string;
  referral_id: string;
  created_at: string;
  agency_name: string;
  equipment_needed: string;
  status: string;
  profile_id: string | null;
}

const STATUS_OPTIONS = [
  'Submitted', 'Under Insurance Review', 'Missing Documents',
  'Processing', 'Scheduled', 'Delivered', 'Cancelled'
];

const STATUS_COLORS: Record<string, string> = {
  'Submitted': 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Insurance Review': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Missing Documents': 'bg-red-50 text-red-700 border-red-200',
  'Processing': 'bg-orange-50 text-orange-700 border-orange-200',
  'Scheduled': 'bg-green-50 text-green-700 border-green-200',
  'Delivered': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Cancelled': 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'referrals' | 'accounts'>('referrals');

  // Accounts state
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  // Referrals state
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [selectedReferralId, setSelectedReferralId] = useState<string | null>(null);

  // New / edit tracking-entry form
  const [showNew, setShowNew] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [newOffice, setNewOffice] = useState('');
  const [newEquip, setNewEquip] = useState('');
  const [newStatus, setNewStatus] = useState(STATUS_OPTIONS[0]);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/login'; return; }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('is_admin, approved')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile?.is_admin) {
        window.location.href = profile?.approved ? '/portal' : '/pending-approval';
        return;
      }

      await Promise.all([loadAccounts(), loadReferrals()]);
      setLoading(false);
    } catch {
      window.location.href = '/login';
    }
  };

  const loadAccounts = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('id, email, approved, status, created_at, company_name')
      .order('created_at', { ascending: false });
    setAccounts(data || []);
  };

  const loadReferrals = async () => {
    const { data } = await supabase
      .from('referrals')
      .select('id, referral_id, created_at, agency_name, equipment_needed, status, profile_id')
      .order('created_at', { ascending: false });
    setReferrals(data || []);
  };

  const nextReferralId = () => {
    const nums = referrals
      .map(r => r.referral_id.match(/^REF-(\d+)$/))
      .filter((m): m is RegExpMatchArray => m !== null)
      .map(m => parseInt(m[1], 10));
    const next = (nums.length ? Math.max(...nums) : 0) + 1;
    return 'REF-' + String(next).padStart(4, '0');
  };

  const resetForm = () => {
    setShowNew(false);
    setEditingId(null);
    setNewOffice(''); setNewEquip(''); setNewStatus(STATUS_OPTIONS[0]);
  };

  const openNewEntry = () => {
    setEditingId(null);
    setNewOffice(''); setNewEquip(''); setNewStatus(STATUS_OPTIONS[0]);
    setShowNew(true);
  };

  const openEditEntry = (ref: Referral) => {
    setEditingId(ref.id);
    const office = accounts.find(a => a.id === ref.profile_id) || accounts.find(a => a.company_name === ref.agency_name);
    setNewOffice(office?.id || '');
    setNewEquip(ref.equipment_needed || '');
    setNewStatus(formatStatus(ref.status));
    setShowNew(true);
  };

  const saveEntry = async () => {
    if (!newOffice) return;
    setCreating(true);
    const office = accounts.find(a => a.id === newOffice);
    const statusValue = newStatus.toLowerCase().replace(/ /g, '_');

    if (editingId) {
      await supabase.from('referrals').update({
        profile_id: newOffice,
        agency_name: office?.company_name || '',
        equipment_needed: newEquip,
        status: statusValue,
        updated_at: new Date().toISOString(),
      }).eq('id', editingId);
    } else {
      const referral_id = nextReferralId();
      await supabase.from('referrals').insert({
        referral_id,
        profile_id: newOffice,
        agency_name: office?.company_name || '',
        equipment_needed: newEquip,
        status: statusValue,
      });
      // Notify the referring office that a new referral is being tracked. Best-effort.
      supabase.functions.invoke('notify-new-referral', {
        body: { referral_id },
      }).catch(() => {});
    }
    await loadReferrals();
    resetForm();
    setCreating(false);
  };

  const deleteEntry = async (id: string, referralId: string) => {
    if (!window.confirm(`Delete tracking entry ${referralId}? This can't be undone.`)) return;
    setDeletingId(id);
    await supabase.from('referrals').delete().eq('id', id);
    await loadReferrals();
    if (editingId === id) resetForm();
    setDeletingId(null);
  };

  const setAccountStatus = async (userId: string, status: 'pending' | 'approved' | 'rejected') => {
    setUpdating(userId);
    await supabase.from('user_profiles').update({ status, approved: status === 'approved' }).eq('id', userId);
    await loadAccounts();
    setUpdating(null);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingStatus(id);
    const statusValue = newStatus.toLowerCase().replace(/ /g, '_');
    const ref = referrals.find(r => r.id === id);
    await supabase.from('referrals').update({ status: statusValue, updated_at: new Date().toISOString() }).eq('id', id);
    setReferrals(referrals.map(r => r.id === id ? { ...r, status: statusValue } : r));
    // Notify the referring office (no PHI — reference number + status only). Best-effort.
    if (ref?.referral_id) {
      supabase.functions.invoke('notify-status', {
        body: { referral_id: ref.referral_id, status: newStatus },
      }).catch(() => {});
    }
    setUpdatingStatus(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const formatStatus = (s: string) => s.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const pendingCount = accounts.filter(a => a.status === 'pending').length;

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

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="font-display text-4xl font-extrabold text-ink tracking-tight mb-1">Admin</h1>
              <p className="text-gray-500">DME Medical Logistics internal dashboard</p>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-200 p-1 rounded-xl mb-8 w-fit">
            <button
              onClick={() => setTab('referrals')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'referrals' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <ClipboardList className="h-4 w-4" />
              Referrals
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${tab === 'referrals' ? 'bg-red-100 text-red-600' : 'bg-gray-300 text-gray-600'}`}>
                {referrals.length}
              </span>
            </button>
            <button
              onClick={() => setTab('accounts')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${tab === 'accounts' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Users className="h-4 w-4" />
              Accounts
              {pendingCount > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-yellow-100 text-yellow-700">
                  {pendingCount} pending
                </span>
              )}
            </button>
          </div>

          {/* ── REFERRALS TAB ── */}
          {tab === 'referrals' && (
            <>
            {/* Toolbar: log a faxed referral */}
            <div className="mb-4 flex justify-between items-center gap-4">
              <p className="text-sm text-gray-500">Log each faxed referral here as a status entry. No patient information is stored — reference number, office, and status only.</p>
              {!showNew && (
                <button onClick={openNewEntry} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium whitespace-nowrap">
                  <Plus className="h-4 w-4" /> Log Referral
                </button>
              )}
            </div>

            {showNew && (
              <div className="mb-4 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{editingId ? 'Edit tracking entry' : 'New tracking entry'}</h3>
                  <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded"><X className="h-4 w-4 text-gray-500" /></button>
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Referring office</label>
                    <select value={newOffice} onChange={e => setNewOffice(e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2">
                      <option value="">Select an office…</option>
                      {accounts.filter(a => a.approved && a.company_name).map(a => (
                        <option key={a.id} value={a.id}>{a.company_name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Equipment (category, no PHI)</label>
                    <input value={newEquip} onChange={e => setNewEquip(e.target.value)} placeholder="e.g. Bath safety, incontinence" className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Initial status</label>
                    <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button onClick={resetForm} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button onClick={saveEntry} disabled={!newOffice || creating} className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-sm rounded-lg font-medium">
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {editingId ? 'Save changes' : 'Create entry'}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Referral ID', 'Date Received', 'Referring Office', 'Equipment', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {referrals.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                          No referrals yet
                        </td>
                      </tr>
                    ) : referrals.map(ref => {
                      const fs = formatStatus(ref.status);
                      return (
                        <tr key={ref.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="h-4 w-4 text-gray-400" />
                              <span className="text-sm font-medium text-gray-900">{ref.referral_id || '—'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-600">{formatDate(ref.created_at)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{ref.agency_name || '—'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-[200px]">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-600 truncate">{ref.equipment_needed || '—'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={fs}
                              onChange={e => updateStatus(ref.id, e.target.value)}
                              disabled={updatingStatus === ref.id}
                              className={`text-xs px-3 py-1.5 rounded-full border font-semibold focus:outline-none ${STATUS_COLORS[fs] || 'bg-gray-50 text-gray-700 border-gray-200'} ${updatingStatus === ref.id ? 'opacity-50' : 'cursor-pointer'}`}
                            >
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setSelectedReferralId(ref.id)} title="View" className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button onClick={() => openEditEntry(ref)} title="Edit" className="p-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => deleteEntry(ref.id, ref.referral_id)}
                                disabled={deletingId === ref.id}
                                title="Delete"
                                className="p-2 bg-white border border-gray-300 hover:bg-red-50 hover:border-red-200 text-gray-700 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
                              >
                                {deletingId === ref.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            </>
          )}

          {/* ── ACCOUNTS TAB ── */}
          {tab === 'accounts' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Email', 'Signed Up', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {accounts.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center text-gray-400">No accounts yet</td>
                      </tr>
                    ) : accounts.map(account => (
                      <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{account.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{formatDate(account.created_at)}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                            account.status === 'approved' ? 'bg-green-100 text-green-800' :
                            account.status === 'rejected' ? 'bg-gray-200 text-gray-700' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {account.status === 'approved' ? <><CheckCircle className="h-3 w-3" /> Approved</> :
                             account.status === 'rejected' ? <><XCircle className="h-3 w-3" /> Rejected</> :
                             <><XCircle className="h-3 w-3" /> Pending</>}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {updating === account.id ? (
                              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            ) : account.status === 'pending' ? (
                              <>
                                <button
                                  onClick={() => setAccountStatus(account.id, 'approved')}
                                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-green-100 text-green-700 hover:bg-green-200"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => setAccountStatus(account.id, 'rejected')}
                                  className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                                >
                                  Reject
                                </button>
                              </>
                            ) : account.status === 'approved' ? (
                              <button
                                onClick={() => setAccountStatus(account.id, 'pending')}
                                className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-red-100 text-red-700 hover:bg-red-200"
                              >
                                Revoke
                              </button>
                            ) : (
                              <button
                                onClick={() => setAccountStatus(account.id, 'pending')}
                                className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors bg-gray-100 text-gray-700 hover:bg-gray-200"
                              >
                                Reconsider
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {selectedReferralId && (
        <ReferralDetail referralId={selectedReferralId} onClose={() => setSelectedReferralId(null)} />
      )}
    </div>
  );
}
