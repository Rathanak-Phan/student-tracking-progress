'use client'

import { motion } from 'framer-motion';
import { Calendar, Clock, Layout, ArrowRight } from 'lucide-react';

export default function Samples() {
  const steps = [
    {
      title: "Smart Scheduling",
      description: "Our AI-powered scheduler automatically organizes your study blocks based on your energy levels and deadlines.",
      icon: Calendar,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Real-time Tracking",
      description: "Log your focus hours with a single click. Visualize your productivity trends with granular daily reports.",
      icon: Clock,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Custom Dashboards",
      description: "Create the workspace that fits your needs. Drag and drop widgets to keep your most important goals front and center.",
      icon: Layout,
      color: "bg-violet-50 text-violet-600"
    }
  ];

  return (
    <section className="py-24 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Personalized for <span className="text-blue-600">Your Success</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            A comprehensive suite of tools that adapt to your unique learning style and help you maintain peak performance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group text-center"
            >
              <div className={`inline-flex items-center justify-center h-20 w-20 rounded-md ${step.color} mb-8 group-hover:rotate-6 transition-transform duration-300 shadow-sm`}>
                <step.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">{step.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium mb-6">{step.description}</p>
              <motion.div 
                whileHover={{ x: 5 }}
                className="inline-flex items-center gap-2 text-blue-600 font-bold cursor-pointer"
              >
                Learn more <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}