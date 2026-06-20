"use client";

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import api from '@/lib/axios';

export default function AdminReviewModal({ request, isOpen, onClose, onSuccess }: any) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApprove = async () => {
    try {
      setIsSubmitting(true);
      await api.patch(`/admin/teacher-requests/${request.id}/approve`);
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!reason) return alert("Please provide a reason for rejection");
    try {
      setIsSubmitting(true);
      await api.patch(`/admin/teacher-requests/${request.id}/reject`, { admin_note: reason });
      onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDocUrl = (path: string) => {
    return path.startsWith('http') ? path : `${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002').replace('/api', '')}${path}`;
  };

  const docs = typeof request.documents === 'string' ? JSON.parse(request.documents) : request.documents;
  const subjects = typeof request.subjects === 'string' ? JSON.parse(request.subjects) : request.subjects;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                  <Dialog.Title as="h3" className="text-lg font-black text-gray-900">
                    Application Review
                  </Dialog.Title>
                  <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-3 gap-8">
                    {/* Left Column: Info */}
                    <div className="col-span-1 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-2xl overflow-hidden shrink-0">
                          {request.avatar_url ? <img src={request.avatar_url} className="w-full h-full object-cover" /> : request.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg">{request.first_name ? `${request.first_name} ${request.last_name}` : request.username}</h4>
                          <p className="text-xs text-gray-500 font-medium">{request.email}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">ID: {request.user_id}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Contact</p>
                          <p className="text-sm font-semibold text-gray-800">{request.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Education</p>
                          <p className="text-sm font-semibold text-gray-800">{request.degree} in {request.major}</p>
                          <p className="text-xs text-gray-500">{request.university} ({request.graduation_year})</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Experience</p>
                          <p className="text-sm font-semibold text-gray-800">{request.experience_years} Years</p>
                          {request.previous_workplace && <p className="text-xs text-gray-500">{request.previous_workplace}</p>}
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">Subjects</p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {subjects.map((s: string) => (
                              <span key={s} className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-100">{s}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Documents & Actions */}
                    <div className="col-span-2 flex flex-col h-full">
                      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-2">Uploaded Documents</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        {docs.degree_cert && (
                          <a href={getDocUrl(docs.degree_cert)} target="_blank" className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-between group">
                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">Degree Certificate</span>
                            <span className="text-[10px] bg-white px-2 py-1 rounded shadow-sm font-bold text-gray-500">View</span>
                          </a>
                        )}
                        {docs.id_card && (
                          <a href={getDocUrl(docs.id_card)} target="_blank" className="p-4 bg-gray-50 border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-between group">
                            <span className="text-sm font-bold text-gray-700 group-hover:text-blue-700">ID / Passport</span>
                            <span className="text-[10px] bg-white px-2 py-1 rounded shadow-sm font-bold text-gray-500">View</span>
                          </a>
                        )}
                      </div>

                      <div className="flex-1" />

                      {/* Action Bar */}
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        {rejecting ? (
                          <div className="space-y-3 animate-in fade-in zoom-in-95 duration-200">
                            <label className="block text-xs font-bold text-red-700">Rejection Reason</label>
                            <textarea 
                              value={reason} 
                              onChange={e => setReason(e.target.value)}
                              placeholder="Please explain why this application is being rejected..."
                              className="w-full px-3 py-2 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500/20 outline-none h-24 resize-none bg-white"
                            />
                            <div className="flex justify-end gap-2">
                              <button onClick={() => setRejecting(false)} className="px-4 py-2 text-gray-500 font-bold text-xs hover:bg-gray-200 rounded-lg">Cancel</button>
                              <button onClick={handleReject} disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white font-bold text-xs rounded-lg hover:bg-red-700 shadow-md shadow-red-500/20 disabled:opacity-50">
                                Confirm Rejection
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <p className="text-xs text-gray-500 font-medium">Please review all documents carefully.</p>
                            <div className="flex gap-3">
                              <button onClick={() => setRejecting(true)} className="px-5 py-2.5 bg-white border border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200 font-bold text-sm rounded-xl transition-all inline-flex items-center">
                                <XCircleIcon className="h-5 w-5 mr-1.5" />
                                Reject
                              </button>
                              <button onClick={handleApprove} disabled={isSubmitting} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all inline-flex items-center disabled:opacity-50">
                                <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                                {isSubmitting ? 'Approving...' : 'Approve & Upgrade'}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
