import { useState } from 'react';
import { useNavigation } from '../App';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Mail, Loader2, AlertCircle, Sparkles } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const { navigate } = useNavigation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(error.message || 'Failed to sign in. Please try again.');
      }
      return;
    }

    navigate('admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-divine-black flex items-center justify-center p-4">
      <div className="absolute inset-0 mystical-gradient opacity-50" />
      <div className="absolute inset-0 bg-divine-black/50" />

      <div className="relative w-full max-w-md">
        <div className="mystical-card">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-divine-purple-900/50 border border-divine-purple-600/30 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-divine-gold-400" />
            </div>
            <h1 className="font-display text-2xl text-divine-gold-400 mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-400 font-body text-sm">
              Sign in to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block font-body text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-divine-purple-500" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="mystical-input pl-12"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block font-body text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-divine-purple-500" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mystical-input pl-12"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-900/20 border border-red-700/30 text-red-400">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p className="font-body text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mystical-button w-full flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Back to Home Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('home')}
              className="text-divine-purple-400 hover:text-divine-purple-300 text-sm font-body transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
