"use client";

import { useState } from 'react';
import Stepper from '@/components/ui/Stepper';
import FileUploadZone from '@/components/ui/FileUploadZone';
import api from '@/lib/axios';
import { AcademicCapIcon, BriefcaseIcon, UserCircleIcon, CheckBadgeIcon } from '@heroicons/react/24/outline';

export default function MultiStepRequestForm({ onSuccess }: { onSuccess: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form Data
  const [formData, setFormData] = useState({
    phone: '',
    degree: '',
    major: '',
    university: '',
    graduation_year: new Date().getFullYear().toString(),
    experience_years: '0',
    previous_workplace: '',
    subjects: ''
  });

  const [files, setFiles] = useState<{ degree_cert: File | null; id_card: File | null; other_certs: File | null }>({
    degree_cert: null,
    id_card: null,
    other_certs: null
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setError(null);
    if (step === 1 && !formData.phone) return setError("Phone number is required");
    if (step === 2 && (!formData.degree || !formData.major || !formData.university)) return setError("Please fill all education fields");
    if (step === 3 && !formData.subjects) return setError("Please enter at least one subject");
    if (step === 4 && (!files.degree_cert || !files.id_card)) return setError("Degree Certificate and ID Card are required documents");
    
    setStep(s => Math.min(s + 1, 5));
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (files.degree_cert) data.append('degree_cert', files.degree_cert);
      if (files.id_card) data.append('id_card', files.id_card);
      if (files.other_certs) data.append('other_certs', files.other_certs);

      data.append('subjects', JSON.stringify(formData.subjects.split(',').map(s => s.trim())));

      await api.post('/teacher-requests', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <Stepper currentStep={step} steps={["Basic Info", "Education", "Experience", "Documents", "Review"]} />

      <div className="min-h-[300px]">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-6 text-gray-800">
              <UserCircleIcon className="h-6 w-6 text-blue-600" />
              <h3 className="font-bold text-lg">Contact Information</h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Phone Number</label>
              <input 
                type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>
        )}

        {/* Step 2: Education */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-6 text-gray-800">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              <h3 className="font-bold text-lg">Academic Background</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Degree</label>
                <select name="degree" value={formData.degree} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium">
                  <option value="">Select Degree...</option>
                  <option value="Bachelor">Bachelor's Degree</option>
                  <option value="Master">Master's Degree</option>
                  <option value="PhD">Ph.D.</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-2">Graduation Year</label>
                <input type="number" name="graduation_year" value={formData.graduation_year} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Major / Field of Study</label>
              <input type="text" name="major" value={formData.major} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" placeholder="e.g. Computer Science" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">University / Institution</label>
              <input type="text" name="university" value={formData.university} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" placeholder="University Name" />
            </div>
          </div>
        )}

        {/* Step 3: Experience */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-3 mb-6 text-gray-800">
              <BriefcaseIcon className="h-6 w-6 text-blue-600" />
              <h3 className="font-bold text-lg">Teaching Experience</h3>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Years of Experience</label>
              <input type="number" name="experience_years" value={formData.experience_years} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" min="0" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Previous Workplace (Optional)</label>
              <input type="text" name="previous_workplace" value={formData.previous_workplace} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium" placeholder="School or Company Name" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Subjects You Can Teach (Comma separated)</label>
              <textarea name="subjects" value={formData.subjects} onChange={handleInputChange} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium h-24 resize-none" placeholder="e.g. Mathematics, Physics, Programming" />
            </div>
          </div>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center gap-3 mb-6 text-gray-800">
              <CheckBadgeIcon className="h-6 w-6 text-blue-600" />
              <h3 className="font-bold text-lg">Verification Documents</h3>
            </div>
            <FileUploadZone label="Degree Certificate (Required)" onFileSelect={(f) => setFiles(prev => ({...prev, degree_cert: f}))} />
            <FileUploadZone label="ID Card or Passport (Required)" onFileSelect={(f) => setFiles(prev => ({...prev, id_card: f}))} />
            <FileUploadZone label="Other Certifications (Optional)" onFileSelect={(f) => setFiles(prev => ({...prev, other_certs: f}))} />
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center mb-8">
              <h3 className="font-black text-2xl text-gray-900 mb-2">Review Your Application</h3>
              <p className="text-gray-500 text-sm">Please verify your details before submitting to the admin team.</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><span className="text-xs text-gray-500 font-bold block mb-1">Phone</span><p className="font-semibold text-sm">{formData.phone}</p></div>
                <div><span className="text-xs text-gray-500 font-bold block mb-1">Education</span><p className="font-semibold text-sm">{formData.degree} in {formData.major}</p></div>
                <div><span className="text-xs text-gray-500 font-bold block mb-1">Experience</span><p className="font-semibold text-sm">{formData.experience_years} Years</p></div>
                <div><span className="text-xs text-gray-500 font-bold block mb-1">Subjects</span><p className="font-semibold text-sm">{formData.subjects}</p></div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <span className="text-xs text-gray-500 font-bold block mb-2">Uploaded Documents</span>
                <ul className="text-sm font-semibold text-blue-600 space-y-1">
                  <li>• {files.degree_cert?.name}</li>
                  <li>• {files.id_card?.name}</li>
                  {files.other_certs && <li>• {files.other_certs.name}</li>}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
        {step > 1 ? (
          <button onClick={prevStep} className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors">
            Back
          </button>
        ) : <div />}
        
        {step < 5 ? (
          <button onClick={nextStep} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
            Next Step
          </button>
        ) : (
          <button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="px-8 py-3 bg-gray-900 hover:bg-black text-white font-black rounded-xl shadow-xl shadow-black/10 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        )}
      </div>
    </div>
  );
}
