import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { SEO } from '@/components/ui/SEO';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export function AdminLoginPage() {
  const { user, signIn, signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState('');

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-ivory"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" /></div>;
  }

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setSubmitting(true);

    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setSubmitting(false);
      } else {
        navigate('/admin/dashboard');
      }
    } else {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setInfo('Account created. You can now sign in.');
        setMode('signin');
      }
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Admin Login" path="/admin" />
      <div className="flex min-h-screen items-center justify-center bg-charcoal px-4">
        <div className="w-full max-w-md bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex flex-col leading-none">
              <span className="font-serif text-2xl font-bold tracking-[0.15em] text-charcoal">LUXURIOUS</span>
              <span className="text-[10px] font-medium tracking-[0.4em] text-gold">SHOP · ADMIN</span>
            </div>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-ivory">
              <Lock className="h-6 w-6 text-gold" />
            </div>
            <h1 className="font-serif text-2xl text-charcoal">
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="mt-2 text-xs text-gray-500">
              {mode === 'signin'
                ? 'Access the admin dashboard to manage your store.'
                : 'Create an admin account to get started.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-[38px] h-4 w-4 text-gray-400" />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="pl-10"
              />
            </div>

            {error && (
              <p className="border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
            )}
            {info && (
              <p className="border border-green-200 bg-green-50 p-3 text-sm text-green-700">{info}</p>
            )}

            <Button type="submit" loading={submitting} className="w-full">
              {mode === 'signin' ? 'Sign In' : 'Create Account'} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo(''); }}
              className="text-xs text-gray-500 hover:text-gold"
            >
              {mode === 'signin' ? "Don't have an account? Create one" : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-6 border-t border-gray-100 pt-4 text-center">
            <a href="/" className="text-xs text-gray-400 hover:text-gold">← Back to store</a>
          </div>
        </div>
      </div>
    </>
  );
}
