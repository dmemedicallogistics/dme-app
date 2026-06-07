import { useState, useEffect } from 'react';
import { LogOut, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import Header from './Header';

interface UserAccount {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  approved: boolean;
  created_at: string;
}

export default function Admin() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

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
        .select('is_admin, approved')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Database error fetching profile:', error);
        window.location.href = '/pending-approval';
        return;
      }

      if (!profile) {
        window.location.href = '/pending-approval';
        return;
      }

      if (!profile.is_admin) {
        if (profile.approved) {
          window.location.href = '/portal';
        } else {
          window.location.href = '/pending-approval';
        }
        return;
      }

      await loadAccounts();
      setLoading(false);
    } catch (err) {
      console.error('Unexpected error in checkAdminAuth:', err);
      window.location.href = '/login';
    }
  };

  const loadAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, company_name, contact_name, email, approved, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading accounts:', error);
        return;
      }

      setAccounts(data || []);
    } catch (err) {
      console.error('Error loading accounts:', err);
    }
  };

  const toggleApproval = async (userId: string, currentStatus: boolean) => {
    setUpdating(userId);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ approved: !currentStatus })
        .eq('id', userId);

      if (error) {
        console.error('Error updating approval:', error);
        alert('Failed to update approval status');
        return;
      }

      await loadAccounts();
    } catch (err) {
      console.error('Error updating approval:', err);
      alert('Failed to update approval status');
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Manage client portal accounts
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                User Accounts
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Total: {accounts.length} accounts
              </p>
            </div>

            {accounts.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-500 text-lg">
                  No user accounts found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Company / Agency
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Contact Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {accounts.map((account) => (
                      <tr key={account.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {account.company_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {account.contact_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {account.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(account.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full ${
                            account.approved
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {account.approved ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Approved
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                Pending
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleApproval(account.id, account.approved)}
                            disabled={updating === account.id}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors ${
                              account.approved
                                ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                                : 'bg-green-100 text-green-700 hover:bg-green-200 focus:ring-green-500'
                            }`}
                          >
                            {updating === account.id ? (
                              <Loader2 className="h-4 w-4 animate-spin inline" />
                            ) : account.approved ? (
                              'Revoke'
                            ) : (
                              'Approve'
                            )}
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
    </div>
  );
}
