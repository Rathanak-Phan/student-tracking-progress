import AuthLayout from '@/components/features/auth/AuthLayout';
import SignUpForm from '@/components/features/auth/SignUpForm';

export default function SignUpPage() {
  const sideContent = (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold tracking-wide uppercase">
          New Journey Starts Here
        </div>
        <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
          Unlock Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Potential</span> Today.
        </h2>
        <p className="text-gray-300 text-xl leading-relaxed font-medium">
          Join thousands of students and teachers tracking progress and achieving excellence through data-driven insights.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6 pt-4">
        {[
          { label: 'Active Students', value: '12K+' },
          { label: 'Success Rate', value: '98%' }
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-md bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AuthLayout sideContent={sideContent} layout="form-right">
      <SignUpForm />
    </AuthLayout>
  );
}