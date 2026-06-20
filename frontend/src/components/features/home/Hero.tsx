'use client'

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';

export default function Heros() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-48 lg:pb-32">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-400/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Text content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Learning Platform</span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight"
            >
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Learning</span> Journey
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mt-8 text-xl text-gray-600 max-w-xl leading-relaxed"
            >
              Master your studies with precision. Our platform provides deep insights into your academic progress, helping you stay ahead and achieve excellence every day.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="mt-12 flex flex-wrap gap-5"
            >
              <button className="group bg-blue-600 text-white font-bold px-8 py-4 rounded-md hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 flex items-center gap-2 text-lg">
                Start Tracking Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white text-gray-900 font-bold px-8 py-4 rounded-md hover:bg-gray-50 transition-all border border-gray-200 text-lg">
                Watch Demo
              </button>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-12 flex items-center gap-6"
            >
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-bold text-gray-900">2k+ Students</span> joined this week
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right column - Illustration/image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
            className="flex justify-center lg:justify-end relative"
          >
            <div className="relative w-full max-w-lg aspect-square">
              {/* Main Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md shadow-[0_32px_64px_-16px_rgba(37,99,235,0.3)] overflow-hidden">
                <div className="absolute inset-0 opacity-20" 
                  style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
                />
                <div className="p-8 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-md flex items-center justify-center">
                      <TrendingUp className="text-white w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-white/60 text-xs font-bold uppercase tracking-wider">Overall Grade</div>
                      <div className="text-white text-3xl font-black">A+</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                        className="h-full bg-white" 
                      />
                    </div>
                    <div className="flex justify-between text-white/80 text-sm font-bold">
                      <span>Course Progress</span>
                      <span>85%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Element 1 */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 bg-white/80 backdrop-blur-xl p-5 rounded-md shadow-2xl border border-white/50 w-64"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-8 w-8 bg-green-100 rounded-md flex items-center justify-center">
                    <CheckCircle2 className="text-green-600 w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">Task Completed</div>
                </div>
                <div className="text-xs text-gray-500 mb-2">Advanced Mathematics Quiz</div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full w-full" />
                </div>
              </motion.div>

              {/* Floating Element 2 */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-10 -right-6 bg-white p-6 rounded-md shadow-2xl w-60 border border-gray-100"
              >
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Next Milestone</div>
                <div className="text-lg font-black text-gray-900 mb-1">Final Exam</div>
                <div className="text-blue-600 text-sm font-bold flex items-center gap-1">
                  In 12 days <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}