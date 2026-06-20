'use client'

import Link from "next/link";
import { Github, Twitter, Linkedin, Youtube, GraduationCap } from "lucide-react";

export default function Footer() {
  const footerLinks = {
    "Product": [
      { name: "Analytics", href: "#" },
      { name: "Goal Setting", href: "#" },
      { name: "Classroom", href: "#" },
      { name: "Mobile App", href: "#" }
    ],
    "Company": [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Privacy", href: "#" }
    ],
    "Support": [
      { name: "Help Center", href: "#" },
      { name: "Contact", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Security", href: "#" }
    ]
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "LinkedIn", icon: Linkedin, href: "#" },
    { name: "GitHub", icon: Github, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ];

  return (
    <footer className="bg-gray-950 text-gray-400 py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-8 group">
              <div className="h-10 w-10 bg-blue-600 rounded-md flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                ST<span className="text-blue-500">.</span>Progress
              </span>
            </Link>
            <p className="text-lg leading-relaxed mb-10 max-w-sm">
              Empowering the next generation of high-achievers with advanced tracking and data-driven insights.
            </p>
            <div className="flex gap-5">
              {socialLinks.map((social) => (
                <Link 
                  key={social.name}
                  href={social.href}
                  className="h-10 w-10 rounded-md bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-sm">{category}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="hover:text-blue-400 transition-colors duration-200 font-medium"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm font-bold">
          <p>© 2024 ST-Progress. Built for the future of education.</p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}