// app/about/page.tsx
import { 
  User, 
  GraduationCap, 
  Target, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Calendar,
  Smartphone,
  Zap,
  BookOpen,
  Bell
} from 'lucide-react'

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { div } from 'framer-motion/client'

export default function AboutPage() {
  const sections = [
    {
      icon: User,
      title: "Introduction",
      color: "blue",
      items: [
        { label: "Name", value: "Roeun Saoly" },
        { label: "Age", value: "20" },
        { label: "Occupation", value: "University Student" },
        { 
          label: "Tech Comfort Level", 
          value: "Moderate",
          description: "Familiar with apps and online tools but prefers simple, intuitive interfaces."
        }
      ]
    },
    {
      icon: BookOpen,
      title: "Background",
      color: "purple",
      content: "A motivated student who values self-learning and skill development but often struggles with time management and keeping track of multiple deadlines."
    },
    {
      icon: Target,
      title: "Goals",
      color: "green",
      items: [
        "Track study progress effectively",
        "Improve self-learning habits",
        "Develop personal skills and talents"
      ]
    },
    {
      icon: AlertTriangle,
      title: "Concerns & Challenges",
      color: "amber",
      items: [
        "Relying only on end-of-term grades doesn't show true progress",
        "Lack of personalization in current tracking systems",
        "Manual record-keeping is time-consuming and error-prone"
      ]
    },
    {
      icon: CheckCircle,
      title: "Needs",
      color: "indigo",
      items: [
        "Easier, automated tracking methods (no manual record-keeping)",
        "Motivation through progress visualization and reminders",
        "Tools to stay on top of deadlines and assignments"
      ]
    },
    {
      icon: Zap,
      title: "Finds Useful",
      color: "emerald",
      items: [
        "Clear insights into what needs improvement",
        "Ability to set personal study goals and track them",
        "Progress charts and percentages for motivation",
        "Features that support time management and deadline reminders"
      ]
    }
  ]

  const colorClasses = {
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", icon: "bg-blue-100 text-blue-600" },
    purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", icon: "bg-purple-100 text-purple-600" },
    green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: "bg-green-100 text-green-600" },
    amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", icon: "bg-amber-100 text-amber-600" },
    indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", icon: "bg-indigo-100 text-indigo-600" },
    emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", icon: "bg-emerald-100 text-emerald-600" }
  }

  return (
    <div>
      <Header/>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-block p-3 bg-white rounded-md shadow-sm border mb-6">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Roeun Saoly
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <span className="text-gray-700 font-medium">University Student</span>
          </div>
        </header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {sections.map((section, index) => {
            const colors = colorClasses[section.color as keyof typeof colorClasses]
            
            return (
              <div
                key={index}
                className={`${colors.bg} border ${colors.border} rounded-md p-6 shadow-sm transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`p-3 rounded-md ${colors.icon}`}>
                    <section.icon className="w-6 h-6" />
                  </div>
                  <h2 className={`text-2xl font-bold ${colors.text}`}>
                    {section.title}
                  </h2>
                </div>

                {section.content && (
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {section.content}
                  </p>
                )}

                {section.items && (
                  <ul className="space-y-3">
                    {section.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1">
                          <div className={`w-2 h-2 rounded-full ${colors.icon.replace('100', '500').replace('600', '500')}`} />
                        </div>
                        <div>
                          {typeof item === 'string' ? (
                            <span className="text-gray-700">{item}</span>
                          ) : (
                            <>
                              <span className="font-medium text-gray-800">{item.label}: </span>
                              <span className="text-gray-700">{item.value}</span>
                              {item.description && (
                                <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                              )}
                            </>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>

        {/* Key Features She Needs */}
        <div className="bg-white rounded-md shadow-lg border p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Ideal Solution Features for Jane
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: TrendingUp,
                title: "Progress Visualization",
                description: "Charts and percentages to show learning progress",
                color: "text-green-600 bg-green-50"
              },
              {
                icon: Bell,
                title: "Smart Reminders",
                description: "Automated deadline and study session reminders",
                color: "text-orange-600 bg-orange-50"
              },
              {
                icon: Calendar,
                title: "Automated Tracking",
                description: "No manual entry required for assignments",
                color: "text-blue-600 bg-blue-50"
              },
              {
                icon: Smartphone,
                title: "Simple Interface",
                description: "Intuitive, clean design for moderate tech users",
                color: "text-purple-600 bg-purple-50"
              },
              {
                icon: Target,
                title: "Personalized Goals",
                description: "Custom study targets and skill development tracking",
                color: "text-red-600 bg-red-50"
              },
              {
                icon: Clock,
                title: "Time Management",
                description: "Tools to organize study sessions efficiently",
                color: "text-indigo-600 bg-indigo-50"
              },
              {
                icon: BookOpen,
                title: "Self-Learning Support",
                description: "Features that encourage independent skill development",
                color: "text-amber-600 bg-amber-50"
              },
              {
                icon: Zap,
                title: "Motivation Boosters",
                description: "Gamification and achievement tracking",
                color: "text-emerald-600 bg-emerald-50"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="border rounded-md p-5 hover:shadow-md transition-shadow duration-200"
              >
                <div className={`inline-flex p-3 rounded-md mb-4 ${feature.color}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* User Persona Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md p-8 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">User Persona Summary</h2>
            <p className="text-lg mb-6 opacity-90">
              Jane is a motivated university student who needs an intuitive, automated system to track her 
              academic progress, manage deadlines, and visualize her learning journey without the hassle of 
              manual record-keeping.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">Needs Simplicity</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">Values Progress Tracking</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">Struggles with Time Management</span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">Prefers Automation</span>
            </div>
          </div>
        </div>

      </div>
    </div>
      <Footer/>
    </div>
  )
}