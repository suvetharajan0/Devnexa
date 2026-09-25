import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from '../components/ui/Input.jsx';
import { PasswordInput } from '../components/ui/PasswordInput.jsx';
import { Button } from '../components/ui/Button.jsx';
import { BRAND_NAME } from '../lib/constants.js';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Watch every field; the moment the user edits anything after a failed
  // submit, clear the stale server error instead of leaving it stuck.
  const watchedValues = watch();
  useEffect(() => {
    if (serverError) setServerError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues.email, watchedValues.password]);

  async function onSubmit(data) {
    setServerError('');
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-page px-4 sm:px-6">
      <div className="w-full max-w-sm bg-surface-card rounded-card p-8 shadow-sm">
        <h1 className="text-xl font-bold text-ink-900">Log in to {BRAND_NAME}</h1>
        <p className="mt-1 text-sm text-ink-600">Welcome back.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
          <Input
            label="Email"
            type="email"
            icon={Mail}
            autoComplete="email"
            {...register('email', { required: 'Email is required' ,
              pattern:{
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message:"Please enter a valid email address",
              },
             })}
            error={errors.email?.message}
          />
          <PasswordInput
            label="Password"
            autoComplete="current-password"
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message}
          />

          {serverError && <p className="text-sm text-danger-500">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Logging in…' : 'Log in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-brand-600">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}