import AuthLayout from '@/components/features/auth/AuthLayout';
import LoginForm from '@/components/features/auth/LoginForm';
import { Suspense } from 'react';

export default function LoginPage() {
  const sideContent = (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-bold tracking-wide uppercase">
          Welcome Back to Excellence
        </div>
        <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
          Continue Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Learning</span> Journey.
        </h2>
        <p className="text-gray-300 text-xl leading-relaxed font-medium">
          Access your personalized dashboard, track your latest assignments, and stay connected with your educational community.
        </p>
      </div>

      <div className="flex flex-wrap gap-4 pt-4">
        {['Secure', 'Real-time', 'Insightful'].map((tag, i) => (
          <div key={i} className="px-4 py-2 rounded-md bg-white/5 border border-white/10 backdrop-blur-sm text-sm font-bold text-gray-400">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AuthLayout sideContent={sideContent} layout="form-left">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}