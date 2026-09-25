import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { Input } from '../components/ui/Input.jsx';
import { PasswordInput } from '../components/ui/PasswordInput.jsx';
import { Button } from '../components/ui/Button.jsx';
import { BRAND_NAME } from '../lib/constants.js';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const watchedValues = watch();
  useEffect(() => {
    if (serverError) setServerError('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues.name, watchedValues.email, watchedValues.password]);

  async function onSubmit(data) {
    setServerError('');
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-page px-4 sm:px-6">
      <div className="w-full max-w-sm bg-surface-card rounded-card p-8 shadow-sm">
        <h1 className="text-xl font-bold text-ink-900">Create your {BRAND_NAME} account</h1>
        <p className="mt-1 text-sm text-ink-600">Find projects. Build with people.</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4" autoComplete="off">
          <Input
            label="Full name"
            icon={User}
            autoComplete="name"
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
          />
          <Input
            label="Email"
            type="email"
            icon={Mail}
            autoComplete="email"
            {...register('email', { required: 'Email is required',
               pattern:{
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message:"Please enter a valid email address",
              },
             })}
            error={errors.email?.message}
          />
          <PasswordInput
            label="Password"  
            autoComplete="new-password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
            error={errors.password?.message}
          />

          {serverError && <p className="text-sm text-danger-500">{serverError}</p>}

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}