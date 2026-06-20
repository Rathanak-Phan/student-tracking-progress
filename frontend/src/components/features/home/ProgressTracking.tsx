'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Users, GraduationCap, School, Globe2 } from 'lucide-react';

const stats = [
  {
    value: 50000,
    suffix: '+',
    label: 'Active Learners',
    color: 'from-blue-500 to-blue-600',
    icon: Users
  },
  {
    value: 1500,
    suffix: '+',
    label: 'Online Classes',
    color: 'from-emerald-500 to-emerald-600',
    icon: School
  },
  {
    value: 500,
    suffix: '+',
    label: 'Expert Instructors',
    color: 'from-violet-500 to-violet-600',
    icon: GraduationCap
  },
  {
    value: 100,
    suffix: '+',
    label: 'Countries Reached',
    color: 'from-orange-500 to-orange-600',
    icon: Globe2
  }
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export default function ProgressTrackings() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gray-50/50 -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Empowering Education <span className="text-blue-600">Globally</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Join a thriving community of students and educators who are redefining what's possible in the digital classroom.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="relative p-8 rounded-md bg-white border border-gray-100 shadow-xl shadow-gray-200/50 group overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-[4rem] group-hover:opacity-[0.06] transition-opacity`} />
              
              <div className={`inline-flex items-center justify-center h-14 w-14 rounded-md bg-gradient-to-br ${stat.color} text-white shadow-lg shadow-blue-500/20 mb-8`}>
                <stat.icon className="w-7 h-7" />
              </div>

              <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
                <Counter value={stat.value} suffix={stat.suffix} />
              </div>

              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

