'use client'

import { motion } from 'framer-motion';
import { Target, Zap, BarChart3, ArrowRight } from 'lucide-react';

export default function Feature() {
  const features = [
    {
      title: "Real-time Tracking",
      heading: "Monitor every step of your journey",
      description: "Get instant feedback on your study sessions. Watch your progress bar fill up as you master each topic.",
      icon: Zap,
      color: "from-blue-500 to-indigo-600",
      delay: 0.1
    },
    {
      title: "Goal Oriented",
      heading: "Set ambitious targets, achieve more",
      description: "Define your academic milestones and stay motivated with automated reminders and streak tracking.",
      icon: Target,
      color: "from-emerald-500 to-teal-600",
      delay: 0.2
    },
    {
      title: "Deep Analytics",
      heading: "Insights that drive performance",
      description: "Visualize your study patterns with beautiful charts. Understand exactly where to focus your effort.",
      icon: BarChart3,
      color: "from-violet-500 to-purple-600",
      delay: 0.3
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6"
          >
            Our Core Features
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Succeed</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Powerful tools designed to simplify your academic life and help you reach your full potential.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="group relative h-full"
            >
              <div className="h-full bg-white rounded-md p-10 border border-gray-100 shadow-xl shadow-gray-200/40 hover:shadow-2xl transition-all duration-300">
                <div className={`inline-flex items-center justify-center h-16 w-16 rounded-md bg-gradient-to-br ${feature.color} text-white shadow-lg mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8" />
                </div>
                
                <div className="mb-4">
                  <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">{feature.title}</span>
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight">
                  {feature.heading}
                </h3>
                
                <p className="text-gray-500 mb-8 leading-relaxed font-medium">
                  {feature.description}
                </p>
                
                <button className="flex items-center gap-2 text-gray-900 font-bold hover:text-blue-600 transition-colors group/btn">
                  Learn more
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}