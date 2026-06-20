import Header from '@/components/layout/Header';
import Heros from '@/components/features/home/Hero';
import ProgressTrackings from '@/components/features/home/ProgressTracking';
import Feature from '@/components/features/home/Features';
import Samples from '@/components/features/home/Sample';
import Stores from '@/components/features/home/Store';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative selection:bg-blue-500/30">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02]" 
          style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '48px 48px' }} 
        />
      </div>

      <Header/>
      <main>
        <Heros/> 
        <ProgressTrackings/>
        <Feature/>
        <Samples/>
        <Stores/>
      </main>
      <Footer/>
    </div>
  );
}