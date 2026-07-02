import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { KeyRound, User } from 'lucide-react';
import apiClient from '../api/client';
import useAuthStore from '../store/authStore';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      const response = await apiClient.post('/auth/login', data);
      login(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral">
      <div className="bg-white p-8 max-w-md w-full border-2 border-black shadow-brutal relative">
        {/* Decorative corner accent */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-accent border-2 border-black"></div>
        
        <h1 className="text-4xl uppercase mb-8 text-center text-accent">Vexor ERP</h1>
        
        {error && (
          <div className="bg-red-100 border-2 border-red-500 text-red-700 p-3 mb-6 font-bold uppercase text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block font-heading uppercase text-sm mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-muted" />
              <input
                type="text"
                {...register('username')}
                className="w-full pl-10 pr-4 py-3 bg-neutral"
                placeholder="SELLER_001"
              />
            </div>
            {errors.username && <p className="text-red-500 mt-1 text-sm font-bold uppercase">{errors.username.message}</p>}
          </div>

          <div>
            <label className="block font-heading uppercase text-sm mb-2">Password</label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-5 w-5 text-muted" />
              <input
                type="password"
                {...register('password')}
                className="w-full pl-10 pr-4 py-3 bg-neutral"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 mt-1 text-sm font-bold uppercase">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-white py-4 hover:bg-black disabled:bg-muted"
          >
            {isSubmitting ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
