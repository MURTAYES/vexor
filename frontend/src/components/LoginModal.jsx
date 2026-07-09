import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import useAuthStore from '../store/authStore';

const loginSchema = z.object({
  username: z.string().min(1, 'Required'),
  password: z.string().min(1, 'Required'),
});

const LoginModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-vexor-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Login Card */}
      <div className="w-full max-w-md bg-surface-light border border-surface-neutral shadow-brutal p-8 md:p-12 relative z-10">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-border-muted hover:text-vexor-orange transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]">close</span>
        </button>

        <div className="flex flex-col items-center mb-8">
          <img 
            alt="Vexor Logo" 
            className="w-16 h-16 object-cover mb-4" 
            src="https://lh3.googleusercontent.com/aida/AP1WRLu5NH1Aft_Q6c2dTd6WRD2P2hWTseYajYXBVVfRjcCVU9EeIiICMOU2X_iG9JJ-fUP0KuJFP3l34hNbcJTAacyUUIIXr45As1vzSnd7qxg7r07xh5qmdRG-UNtPM39BV-YHY1qllNE0Q1yWP-wpdhJ_wLvn_PF_0EhRWxlwZgyHwGieh_icdTvANWFMjHUC4pMRx_tzt8YbCB4sFT16menYGgRSDbSd0k7asa8QIk4LfLFs2-Lm68w7TfM" 
          />
          <h1 className="font-headline text-4xl md:text-5xl uppercase italic text-on-surface font-bold">Sign In</h1>
          <p className="font-body text-base text-on-surface-variant mt-2 text-center">Access your high-performance workspace.</p>
        </div>

        {error && (
          <div className="bg-error/10 border-2 border-error text-error p-3 mb-6 font-bold uppercase text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Username/Email Field */}
          <div>
            <label className="block font-headline text-sm font-bold uppercase text-on-surface mb-2" htmlFor="username">
              Username or Email
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-border-muted">mail</span>
              <input 
                {...register('username')}
                className="w-full bg-surface-neutral border-0 border-b border-border-muted focus:border-primary focus:ring-0 focus:border-b-2 pl-10 pr-4 py-3 font-body text-base text-on-surface rounded-none transition-all outline-none" 
                id="username" 
                placeholder="SELLER_001 or email" 
                type="text"
              />
            </div>
          </div>
          
          {/* Password Field */}
          <div>
            <label className="block font-headline text-sm font-bold uppercase text-on-surface mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-border-muted">lock</span>
              <input 
                {...register('password')}
                className="w-full bg-surface-neutral border-0 border-b border-border-muted focus:border-primary focus:ring-0 focus:border-b-2 pl-10 pr-4 py-3 font-body text-base text-on-surface rounded-none transition-all outline-none" 
                id="password" 
                placeholder="••••••••" 
                type="password"
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center cursor-pointer">
              <input className="form-checkbox h-4 w-4 text-primary bg-surface-neutral border-border-muted focus:ring-primary focus:ring-offset-0 rounded-none" type="checkbox"/>
              <span className="ml-2 font-body text-sm text-on-surface-variant">Remember me</span>
            </label>
            <a className="font-headline text-sm font-bold text-primary hover:text-primary-container transition-colors" href="#">Forgot Password?</a>
          </div>
          
          {/* Submit Button */}
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF5500] text-white font-headline text-xl font-bold uppercase italic py-4 rounded-none hover:shadow-[4px_4px_0px_#000000] border-2 border-transparent hover:border-vexor-black transition-all mt-8 disabled:opacity-70" 
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 flex items-center justify-center space-x-4">
          <span className="h-px bg-outline-variant flex-grow"></span>
          <span className="font-headline text-sm font-bold text-on-surface-variant uppercase">Or</span>
          <span className="h-px bg-outline-variant flex-grow"></span>
        </div>
        
        {/* Social Logins */}
        <div className="mt-8 space-y-4">
          <button className="w-full border-2 border-on-surface bg-transparent text-on-surface font-headline text-sm font-bold uppercase py-3 flex items-center justify-center hover:bg-surface-neutral transition-colors rounded-none">
            <span className="material-symbols-outlined mr-2">login</span>
            Continue with Google
          </button>
          <button className="w-full border-2 border-on-surface bg-transparent text-on-surface font-headline text-sm font-bold uppercase py-3 flex items-center justify-center hover:bg-surface-neutral transition-colors rounded-none">
            <span className="material-symbols-outlined mr-2">code</span>
            Continue with GitHub
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="font-body text-sm text-on-surface-variant">
            New to Vexor? <a className="font-headline font-bold text-on-surface hover:text-primary underline transition-colors" href="#">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
