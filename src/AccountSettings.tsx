import { useState, useEffect } from 'react';
import { LogOut, Loader2, Save, ArrowLeft, Key } from 'lucide-react';
import { supabase } from './lib/supabase';
import Header from './Header';

interface UserProfile {
  company_name: string;
  contact_name: string;
  contact_phone: string;
  email: string;
}

export default function AccountSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

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
        .select('company_name, contact_name, contact_phone, email, approved')
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
      setContactName(profileData.contact_name || '');
      setContactPhone(profileData.contact_phone || '');
      setLoading(false);
    } catch (err) {
      window.location.href = '/login';
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setErrorMessage('Not authenticated');
        setSaving(false);
        return;
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          contact_name: contactName.trim(),
          contact_phone: contactPhone.trim()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Update error:', error);
        setErrorMessage('Failed to update profile. Please try again.');
      } else {
        setSuccessMessage('Your account settings have been updated successfully.');
        setProfile(prev => prev ? {
          ...prev,
          contact_name: contactName.trim(),
          contact_phone: contactPhone.trim()
        } : null);
      }
    } catch (err) {
      console.error('Save error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMessage('');
    setPasswordErrorMessage('');

    if (newPassword.length < 6) {
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMessage('Passwords do not match.');
      return;
    }

    setSavingPassword(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password update error:', error);
        setPasswordErrorMessage('Failed to update password. Please try again.');
      } else {
        setPasswordSuccessMessage('Your password has been updated successfully.');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Password update error:', err);
      setPasswordErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setSavingPassword(false);
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
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8">
            <div>
              <div className="mb-4">
                <a
                  href="/portal"
                  className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Portal
                </a>
              </div>
              <h1 className="font-display text-4xl font-extrabold text-ink tracking-tight mb-2">
                Account Settings
              </h1>
              <p className="text-gray-600">
                Manage your account information
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

          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Profile Information
              </h2>
            </div>

            <form onSubmit={handleSave} className="px-6 py-8">
              {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">{successMessage}</p>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="company_name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company / Agency Name
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    value={profile?.company_name || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-6">
                    Contact us if you need to update your company name or email address.
                  </p>

                  <div className="space-y-6">
                    <div>
                      <label htmlFor="contact_name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="contact_name"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact_phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Phone <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        id="contact_phone"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={saving || !contactName.trim() || !contactPhone.trim()}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden mt-6">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Change Password
              </h2>
            </div>

            <form onSubmit={handlePasswordChange} className="px-6 py-8">
              {passwordSuccessMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">{passwordSuccessMessage}</p>
                </div>
              )}

              {passwordErrorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{passwordErrorMessage}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="new_password" className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    id="new_password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="At least 6 characters"
                  />
                </div>

                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm New Password <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Re-enter your new password"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword || !newPassword || !confirmPassword}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                >
                  {savingPassword ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="h-5 w-5" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
