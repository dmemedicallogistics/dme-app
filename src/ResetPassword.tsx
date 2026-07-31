import { useState, useEffect } from 'react';
import { Key, Loader2, CheckCircle } from 'lucide-react';
import { supabase } from './lib/supabase';
import Header from './Header';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [validToken, setValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    checkRecoveryToken();
  }, []);

  const checkRecoveryToken = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        setValidToken(true);
      } else {
        setErrorMessage('Invalid or expired reset link. Please request a new password reset.');
      }
    } catch (err) {
      console.error('Token check error:', err);
      setErrorMessage('Failed to verify reset link. Please try again.');
    } finally {
      setCheckingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 10 || !/[A-Za-z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setErrorMessage('Password must be at least 10 characters and include both a letter and a number.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password reset error:', error);
        setErrorMessage('Failed to reset password. Please try again.');
      } else {
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream">
        <Header />
        <div className="pt-36 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-8 py-10 text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Password Reset Successful
                </h1>
                <p className="text-gray-600 mb-6">
                  Your password has been updated successfully.
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting to login page...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="pt-36 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-8 py-10">
              <div className="text-center mb-8">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key className="h-8 w-8 text-red-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Reset Your Password
                </h1>
                <p className="text-gray-600">
                  Enter your new password below.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{errorMessage}</p>
                </div>
              )}

              {!validToken ? (
                <div className="text-center">
                  <p className="text-gray-600 mb-6">
                    This reset link is invalid or has expired.
                  </p>
                  <a
                    href="/forgot-password"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors shadow-md"
                  >
                    Request New Reset Link
                  </a>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="new_password" className="block text-sm font-semibold text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new_password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="At least 10 characters, with a letter and a number"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-semibold text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm_password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={10}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Re-enter your new password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !newPassword || !confirmPassword}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <Key className="h-5 w-5" />
                        Reset Password
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{' '}
                  <a href="/login" className="text-red-600 hover:text-red-700 font-semibold">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
