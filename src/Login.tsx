import { useState, FormEvent } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Header from './Header';
import { supabase } from './lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('id, email, approved, is_admin')
          .eq('id', data.user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Profile query error:', profileError);
        }

        // Check if user is admin first
        if (profile?.is_admin) {
          window.location.href = '/admin';
          return;
        }

        // Then check approval status
        if (!profile?.approved) {
          window.location.href = '/pending-approval';
        } else {
          window.location.href = '/portal';
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <div className="pt-40 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <p className="eyebrow mb-3">Provider Portal</p>
            <h1 className="font-display text-4xl font-extrabold text-ink tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-stone-600">
              Sign in to submit and track referrals
            </p>
          </div>

          <div className="card p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input !pl-10"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input !pl-10"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end">
                <a href="/forgot-password" className="text-sm font-semibold text-red-600 hover:text-red-700">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/signup" className="font-semibold text-red-600 hover:text-red-700">
                  Create one here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
