"use client";

import { ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface AuthLayoutProps {
  children: ReactNode;
  sideContent?: ReactNode;
  layout?: 'form-left' | 'form-right';
}

export default function AuthLayout({
  children,
  sideContent,
  layout = 'form-left',
}: AuthLayoutProps) {
  const isFormLeft = layout === 'form-left';

  return (
    <div className={`min-h-screen flex ${isFormLeft ? 'flex-row' : 'flex-row-reverse'} bg-[#020617] font-sans selection:bg-blue-500/30 overflow-hidden`}>
      {/* Left side - Form */}
      <main className="flex w-full lg:w-[45%] items-center justify-center p-6 sm:p-12 z-10 relative">
        {/* Subtle background glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          {children}
        </div>
      </main>

      {/* Image/Content Side */}
      <aside className={`hidden lg:flex w-[55%] relative items-center justify-center overflow-hidden ${isFormLeft ? 'border-l' : 'border-r'} border-white/5 bg-[#020617]`}>
        <Image
          src="/images/auth-bg.png"
          alt="Authentication Background"
          fill
          priority
          sizes="(max-width: 1024px) 0vw, 55vw"
          className="object-cover opacity-80 scale-105"
        />
        {/* Overlay gradient for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#020617] via-transparent to-[#020617]/10" />
        <div className="absolute inset-0 bg-black/20" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-lg p-12 backdrop-blur-md bg-white/5 rounded-md border border-white/10 shadow-2xl"
        >
          {sideContent}
        </motion.div>

        {/* Floating decorative glass elements */}
        <div className="absolute top-1/4 left-[10%] w-32 h-32 bg-blue-500/20 blur-3xl animate-pulse rounded-full" />
        <div className="absolute bottom-1/4 right-[10%] w-48 h-48 bg-indigo-500/20 blur-3xl animate-pulse rounded-full delay-1000" />
      </aside>
    </div>
  );
}
