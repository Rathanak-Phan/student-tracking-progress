import sys

file_path = "/home/rathanak-phan/Desktop/WEB/student-tracking-progress/frontend/src/app/admin/settings/page.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Chunk 1: Header
content = content.replace(
"""        {/* Top Header controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">System Configuration</h1>
            <p className="text-gray-500 font-medium mt-1">Manage global preferences, self-registration controls, security policies, and backup operations.</p>
          </div>
        </div>""",
"""        {/* Top Header controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 p-6 md:p-8 rounded-3xl border border-blue-100/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 tracking-tight flex items-center gap-3">
              <Cog6ToothIcon className="h-9 w-9 text-blue-600" />
              System Configuration
            </h1>
            <p className="text-gray-500 font-medium mt-2 text-sm md:text-base max-w-2xl">Manage global preferences, self-registration controls, security policies, and backup operations for your institution.</p>
          </div>
        </div>"""
)

# Chunk 2 & 3: Notifications
content = content.replace(
"""              className="p-4 bg-green-50 border border-green-200 text-green-700 font-semibold rounded-md flex items-center gap-3 shadow-sm"
            >
              <div className="p-1 rounded-full bg-green-500 text-white">
                <CheckIcon className="h-4 w-4" />
              </div>""",
"""              className="p-4 bg-green-50/80 backdrop-blur-sm border border-green-200/60 text-green-700 font-bold text-sm rounded-2xl flex items-center gap-3 shadow-lg shadow-green-500/10"
            >
              <div className="p-1.5 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm">
                <CheckIcon className="h-4 w-4 stroke-2" />
              </div>"""
)

content = content.replace(
"""              className="p-4 bg-red-50 border border-red-200 text-red-600 font-semibold rounded-md flex items-center gap-3 shadow-sm"
            >
              <div className="p-1 rounded-full bg-red-500 text-white">
                <XMarkIcon className="h-4 w-4" />
              </div>""",
"""              className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/60 text-red-700 font-bold text-sm rounded-2xl flex items-center gap-3 shadow-lg shadow-red-500/10"
            >
              <div className="p-1.5 rounded-full bg-gradient-to-br from-red-400 to-red-600 text-white shadow-sm">
                <XMarkIcon className="h-4 w-4 stroke-2" />
              </div>"""
)

# Chunk 4: Left Navigation Tabs
content = content.replace(
"""          {/* Left Navigation Tabs (bento-box style) */}
          <div className="lg:col-span-4 bg-white p-4 rounded-md border border-gray-100 shadow-sm space-y-2">
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-md font-bold text-sm transition-all duration-200 ${
                activeTab === 'general' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <GlobeAltIcon className="h-5 w-5" />
              General Branding
            </button>

            <button
              onClick={() => setActiveTab('access')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-md font-bold text-sm transition-all duration-200 ${
                activeTab === 'access' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <UsersIcon className="h-5 w-5" />
              Access & Registrations
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-md font-bold text-sm transition-all duration-200 ${
                activeTab === 'security' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <ShieldCheckIcon className="h-5 w-5" />
              Security & Alerts
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-md font-bold text-sm transition-all duration-200 ${
                activeTab === 'database' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <CircleStackIcon className="h-5 w-5" />
              Maintenance & Backups
            </button>
          </div>""",
"""          {/* Left Navigation Tabs (bento-box style) */}
          <div className="lg:col-span-4 bg-white/90 backdrop-blur-md p-3.5 rounded-3xl border border-gray-100/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] space-y-1.5 relative overflow-hidden">
            <div className="absolute -left-10 -top-10 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <button
              onClick={() => setActiveTab('general')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden group ${
                activeTab === 'general' ? 'text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
              }`}
            >
              {activeTab === 'general' && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>}
              <GlobeAltIcon className={`h-5 w-5 relative z-10 transition-transform duration-300 ${activeTab === 'general' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">General Branding</span>
            </button>

            <button
              onClick={() => setActiveTab('access')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden group ${
                activeTab === 'access' ? 'text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
              }`}
            >
              {activeTab === 'access' && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>}
              <UsersIcon className={`h-5 w-5 relative z-10 transition-transform duration-300 ${activeTab === 'access' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">Access & Registrations</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden group ${
                activeTab === 'security' ? 'text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
              }`}
            >
              {activeTab === 'security' && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>}
              <ShieldCheckIcon className={`h-5 w-5 relative z-10 transition-transform duration-300 ${activeTab === 'security' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">Security & Alerts</span>
            </button>

            <button
              onClick={() => setActiveTab('database')}
              className={`w-full flex items-center gap-3.5 p-4 rounded-2xl font-bold text-sm transition-all duration-300 relative overflow-hidden group ${
                activeTab === 'database' ? 'text-white shadow-lg shadow-blue-500/25' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50/80'
              }`}
            >
              {activeTab === 'database' && <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0"></div>}
              <CircleStackIcon className={`h-5 w-5 relative z-10 transition-transform duration-300 ${activeTab === 'database' ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="relative z-10">Maintenance & Backups</span>
            </button>
          </div>"""
)

# Multi-replaces for inputs and toggles
content = content.replace(
"""className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-md outline-none focus:bg-white focus:border-blue-500/30 transition-all font-semibold text-sm\"""",
"""className="w-full px-4 py-3.5 bg-gray-50/80 border border-gray-200/80 rounded-xl outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 hover:border-gray-300 shadow-sm\""""
)

content = content.replace(
"""className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600\"""",
"""className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600 shadow-inner\""""
)

content = content.replace(
"""className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-100/50\"""",
"""className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-200/60 hover:border-blue-200/60 transition-colors shadow-sm group\""""
)

content = content.replace(
"""className="flex-1 h-1.5 bg-gray-100 rounded-full cursor-pointer accent-blue-600\"""",
"""className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all\""""
)

# Right Tab Container
content = content.replace(
"""          {/* Right Tab Content */}
          <div className="lg:col-span-8 bg-white p-8 rounded-md border border-gray-100 shadow-sm">
            <form onSubmit={handleSaveSettings} className="space-y-6">""",
"""          {/* Right Tab Content */}
          <div className="lg:col-span-8 bg-white/90 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative z-0">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            <form onSubmit={handleSaveSettings} className="space-y-8">"""
)

# Tab 1 Header
content = content.replace(
"""              {/* Tab 1: General Preferences */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">General preferences</h3>
                    <p className="text-sm text-gray-400 font-semibold mt-0.5">Control how the platform displays, labels, and updates.</p>
                  </div>

                  <hr className="border-gray-100" />""",
"""              {/* Tab 1: General Preferences */}
              {activeTab === 'general' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">General preferences</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Control how the platform displays, labels, and updates.</p>
                  </div>

                  <hr className="border-gray-100/80" />"""
)

# Tab 2 Header
content = content.replace(
"""              {/* Tab 2: Registrations & Access */}
              {activeTab === 'access' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Registration and Access policies</h3>
                    <p className="text-sm text-gray-400 font-semibold mt-0.5">Set validation guidelines and registration behaviors.</p>
                  </div>

                  <hr className="border-gray-100" />""",
"""              {/* Tab 2: Registrations & Access */}
              {activeTab === 'access' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Registration and Access policies</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Set validation guidelines and registration behaviors.</p>
                  </div>

                  <hr className="border-gray-100/80" />"""
)

# Tab 3 Header
content = content.replace(
"""              {/* Tab 3: Security & Alerts */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Security & alerts preferences</h3>
                    <p className="text-sm text-gray-400 font-semibold mt-0.5">Control login throttle guidelines and dynamic notifications.</p>
                  </div>

                  <hr className="border-gray-100" />""",
"""              {/* Tab 3: Security & Alerts */}
              {activeTab === 'security' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Security & alerts preferences</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Control login throttle guidelines and dynamic notifications.</p>
                  </div>

                  <hr className="border-gray-100/80" />"""
)

# Tab 4 Header
content = content.replace(
"""              {/* Tab 4: Database Maintenance & Operations */}
              {activeTab === 'database' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Database and backup maintenance</h3>
                    <p className="text-sm text-gray-400 font-semibold mt-0.5">Generate system backups or perform audit purging operations.</p>
                  </div>

                  <hr className="border-gray-100" />""",
"""              {/* Tab 4: Database Maintenance & Operations */}
              {activeTab === 'database' && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Database and backup maintenance</h3>
                    <p className="text-sm text-gray-500 font-medium mt-1">Generate system backups or perform audit purging operations.</p>
                  </div>

                  <hr className="border-gray-100/80" />"""
)


# Closing Tags for <motion.div>
# Since there are 4 tabs, we replace `</div>\n                </div>\n              )}` four times
content = content.replace(
"""                  </div>
                </div>
              )}""",
"""                  </div>
                </motion.div>
              )}"""
)

# Tab 4 Buttons Fix
content = content.replace(
"""                  {/* Download Backup */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-gray-50 rounded-md border border-gray-100/50 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-gray-800 uppercase tracking-wide">SQL Database Backup</span>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Download structure and defaults schema backups.</p>
                    </div>
                    <button
                      type="button"
                      disabled={backupLoading}
                      onClick={handleDownloadBackup}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-500 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-md shadow-blue-500/10"
                    >""",
"""                  {/* Download Backup */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-blue-50/50 rounded-2xl border border-blue-100/60 gap-4 hover:border-blue-200 transition-colors">
                    <div>
                      <span className="block text-sm font-bold text-blue-900 uppercase tracking-wide">SQL Database Backup</span>
                      <p className="text-xs text-blue-600/80 font-semibold mt-1">Download structure and defaults schema backups.</p>
                    </div>
                    <button
                      type="button"
                      disabled={backupLoading}
                      onClick={handleDownloadBackup}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-500 hover:to-indigo-500 font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-lg shadow-blue-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
                    >"""
)

content = content.replace(
"""                  {/* Clear Activity Logs */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-red-50/50 rounded-md border border-red-100 gap-4">
                    <div>
                      <span className="block text-xs font-bold text-red-700 uppercase tracking-wide">Purge Audit Log Data</span>
                      <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Truncate historical data inside the activity_logs database table.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearLogs}
                      className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-md hover:bg-red-500 font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-500/10"
                    >""",
"""                  {/* Clear Activity Logs */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-red-50/50 rounded-2xl border border-red-100/60 gap-4 hover:border-red-200 transition-colors">
                    <div>
                      <span className="block text-sm font-bold text-red-800 uppercase tracking-wide">Purge Audit Log Data</span>
                      <p className="text-xs text-red-600/80 font-semibold mt-1">Truncate historical data inside the activity_logs database table.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearLogs}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:from-red-500 hover:to-rose-500 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-red-500/25 transform hover:-translate-y-0.5 active:translate-y-0"
                    >"""
)

# Save Button
content = content.replace(
"""              {/* Submit footer button (only if not on database tab) */}
              {activeTab !== 'database' && (
                <div className="flex justify-end pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 font-bold text-sm transition-all disabled:opacity-50"
                  >""",
"""              {/* Submit footer button (only if not on database tab) */}
              {activeTab !== 'database' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-end pt-6 border-t border-gray-100/80"
                >
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-gray-700 font-bold text-sm transition-all disabled:opacity-50 shadow-lg shadow-gray-900/20 transform hover:-translate-y-0.5 active:translate-y-0"
                  >"""
)

content = content.replace(
"""                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}""",
"""                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </motion.div>
              )}"""
)


with open(file_path, "w") as f:
    f.write(content)

print("Replacement complete.")
