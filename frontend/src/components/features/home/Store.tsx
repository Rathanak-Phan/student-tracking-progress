// app/components/Stories.js
'use client';

import { motion } from 'framer-motion';
import { Star, Quote, ArrowRight, Sparkles } from 'lucide-react';

export default function Stories() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "College student",
      rating: 5,
      quote: "This platform completely transformed my study habits. I've seen a 40% increase in my productivity since I started tracking my focus hours.",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      color: "from-blue-500 to-indigo-600"
    },
    {
      name: "Marcus Rodriguez",
      role: "High school senior",
      rating: 5,
      quote: "The analytics feature is a game-changer. I finally understand which subjects need more of my time and where I'm already excelling.",
      avatar: "https://i.pravatar.cc/150?u=marcus",
      color: "from-emerald-500 to-teal-600"
    },
    {
      name: "Emma Williams",
      role: "Graduate student",
      rating: 5,
      quote: "Organizing my research and deadlines has never been easier. It's the most intuitive tracking tool I've ever used.",
      avatar: "https://i.pravatar.cc/150?u=emma",
      color: "from-violet-500 to-purple-600"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6"
          >
            Success Stories
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight"
          >
            Loved by <span className="text-blue-600">Thousands</span> of Students
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-gray-50/50 rounded-md p-10 border border-gray-100 relative group transition-all duration-300"
            >
              <Quote className="absolute top-8 right-8 w-12 h-12 text-blue-500/10 group-hover:text-blue-500/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-lg text-gray-700 leading-relaxed font-medium mb-8">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-md">
                  <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <h4 className="font-black text-gray-900 leading-none mb-1">{testimonial.name}</h4>
                  <p className="text-sm text-gray-500 font-bold">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gray-900 rounded-md p-12 md:p-20 overflow-hidden text-center shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} 
          />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-30" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600 rounded-full blur-[100px] opacity-30" />

          <div className="relative z-10">
            <h3 className="text-3xl md:text-5xl font-black text-white mb-8 leading-tight max-w-3xl mx-auto">
              Ready to transform your <span className="text-blue-400">Study Habits?</span>
            </h3>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto font-medium">
              Join our community of high-achievers today. It takes less than a minute to get started.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <button className="bg-blue-600 text-white font-black px-10 py-5 rounded-md hover:bg-blue-700 transition shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2 text-lg">
                Start Tracking Free
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white font-black px-10 py-5 rounded-md hover:bg-white/20 transition border border-white/20 text-lg">
                View Pricing
              </button>
            </div>
            
            <div className="mt-12 flex items-center justify-center gap-8 text-gray-500 font-bold text-sm uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Cancel anytime
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}