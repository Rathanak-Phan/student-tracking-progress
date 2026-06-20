"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { 
  HomeIcon, 
  BookOpenIcon, 
  ClipboardIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  PaperClipIcon,
  FaceSmileIcon,
  MicrophoneIcon,
  XMarkIcon,
  ArrowUturnLeftIcon,
  TrashIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { 
  CheckIcon as CheckSolidIcon,
} from '@heroicons/react/24/solid';
import DashboardLayout from '@/components/layout/DashboardLayout';
import DialogModal from '@/components/ui/DialogModal';
import { useNavItems } from '@/hooks/useNavItems';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getSocket } from '@/lib/socket';
import { Socket } from 'socket.io-client';

interface TeacherContact {
  id: number;
  name: string;
  className: string;
  avatar_url?: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  is_read?: boolean;
  sender_name?: string;
  receiver_name?: string;
  media_url?: string;
  media_type?: string;
  reply_to_id?: number | null;
  reply_content?: string;
  reply_media_url?: string;
  reply_media_type?: string;
  reply_sender_name?: string;
  is_deleted_for_everyone?: boolean;
  reply_is_deleted_for_everyone?: boolean;
}

export default function StudentMessagesPage() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<TeacherContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<TeacherContact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Loading & search states
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Delete Modal States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<'message' | 'conversation' | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const [deleteScope, setDeleteScope] = useState<'me' | 'everyone'>('me');
  const [highlightedMessageId, setHighlightedMessageId] = useState<number | null>(null);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const selectedContactRef = useRef<number | null>(null);

  const getMediaUrl = (path: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002/api';
    return apiUrl.replace('/api', '') + path;
  };

  const navItems = useNavItems();

  // Fetch student's class instructors from the dashboard endpoint
  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        setLoadingContacts(true);
        const response = await api.get('/dashboard/student');
        
        // Extract teacher contacts from active classes
        const teacherMap = new Map<number, TeacherContact>();
        if (response.data.classes && Array.isArray(response.data.classes)) {
          response.data.classes.forEach((c: any) => {
            if (c.teacher_id && c.teacher_name) {
              teacherMap.set(c.teacher_id, {
                id: c.teacher_id,
                name: c.teacher_first ? `${c.teacher_first} ${c.teacher_last}` : c.teacher_name,
                className: c.name,
                avatar_url: c.teacher_avatar_url
              });
            }
          });
        }
        let uniqueContacts = Array.from(teacherMap.values());

        // Fetch recent conversations to sort by latest message
        let recentMap: Record<number, string> = {};
        try {
          const recentResponse = await api.get('/messages/recent/contacts');
          recentResponse.data.forEach((rc: any) => {
            recentMap[rc.contact_id] = rc.last_message_at;
          });
        } catch (e) {
          console.error("Failed to load recent conversations", e);
        }

        // Sort contacts by latest message timestamp
        uniqueContacts.sort((a, b) => {
          const aTime = recentMap[a.id] ? new Date(recentMap[a.id]).getTime() : 0;
          const bTime = recentMap[b.id] ? new Date(recentMap[b.id]).getTime() : 0;
          return bTime - aTime;
        });

        setContacts(uniqueContacts);
      } catch (err) {
        console.error("Failed to load instructors", err);
      } finally {
        setLoadingContacts(false);
      }
    };
    fetchInstructors();
  }, []);

  // Fetch conversation with a specific teacher
  const fetchConversation = useCallback(async (teacherId: number, silent = false) => {
    try {
      if (!silent) setLoadingMessages(true);
      const response = await api.get(`/messages/${teacherId}`);
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to fetch conversation history", err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  }, []);

  // Set up conversation polling when a teacher is selected
  useEffect(() => {
    selectedContactRef.current = selectedContact ? selectedContact.id : null;
    if (!selectedContact) return;
    
    fetchConversation(selectedContact.id);
  }, [selectedContact, fetchConversation]);

  // Socket.io setup
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket.connected) {
      socket.connect();
    }
    socketRef.current = socket;

    socket.emit('join', user.id);

    const handleNewMessage = (msg: Message) => {
      const activeId = selectedContactRef.current;
      const isActiveConversation = 
        (activeId === Number(msg.sender_id)) || 
        (activeId === Number(msg.receiver_id) && user?.id === Number(msg.sender_id));

      if (isActiveConversation) {
        setMessages(prev => {
          // Prevent duplicates if the message is already in state
          if (prev.some(m => m.id === msg.id)) return prev;

          // Smart deduplication for optimistic updates
          if (Number(msg.sender_id) === user?.id) {
            // Find a temporary message (ID from Date.now() is huge) that matches content
            const tempMsgIdx = prev.findIndex(m => 
              m.id > 1000000000000 && 
              m.content === msg.content && 
              Number(m.receiver_id) === Number(msg.receiver_id)
            );
            
            if (tempMsgIdx > -1) {
              const newMessages = [...prev];
              newMessages[tempMsgIdx] = {
                ...newMessages[tempMsgIdx],
                ...msg,
                reply_content: newMessages[tempMsgIdx].reply_content,
                reply_sender_name: newMessages[tempMsgIdx].reply_sender_name
              };
              return newMessages;
            }
          }

          if (msg.reply_to_id && !msg.reply_content) {
            const repliedMsg = prev.find(m => m.id === msg.reply_to_id);
            if (repliedMsg) {
              msg.reply_content = repliedMsg.content;
              msg.reply_sender_name = repliedMsg.sender_id === user?.id ? 'You' : (repliedMsg.sender_name || 'Them');
            }
          }
          return [...prev, msg];
        });
      } else if (Number(msg.sender_id) !== user?.id) {
        console.log("New message from", msg.sender_id);
      }

      setContacts(prev => {
        const contactIdToBump = Number(msg.sender_id) === user?.id ? Number(msg.receiver_id) : Number(msg.sender_id);
        const idx = prev.findIndex(c => c.id === contactIdToBump);
        if (idx > -1) {
          const contact = prev[idx];
          const newContacts = [...prev];
          newContacts.splice(idx, 1);
          newContacts.unshift(contact);
          return newContacts;
        }
        return prev;
      });
    };

    const handleMessageDeleted = (data: { messageId: number }) => {
      setMessages(prev => prev.map(m => 
        m.id === data.messageId ? { ...m, is_deleted_for_everyone: true, content: '', media_url: undefined, media_type: undefined } : m
      ));
    };

    const handleConversationDeleted = (data: { contactId: number }) => {
      if (selectedContactRef.current === data.contactId) {
        setMessages([]);
      }
    };

    const handleMessagesRead = (data: { reader_id: number, contact_id: number }) => {
      if (selectedContactRef.current === data.reader_id) {
        setMessages(prev => prev.map(m => 
          m.sender_id === user?.id ? { ...m, is_read: true } : m
        ));
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('message_deleted', handleMessageDeleted);
    socket.on('conversation_deleted', handleConversationDeleted);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('message_deleted', handleMessageDeleted);
      socket.off('conversation_deleted', handleConversationDeleted);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [user]);

  // Scroll to bottom of conversation feed
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send Direct Message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedFile) || !selectedContact || sendingMessage) return;

    try {
      setSendingMessage(true);
      
      const formData = new FormData();
      formData.append('receiver_id', selectedContact.id.toString());
      if (newMessage.trim()) {
        formData.append('content', newMessage.trim());
      }
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      if (replyingTo) {
        formData.append('reply_to_id', replyingTo.id.toString());
      }
      
      // Optimistic append for immediate UI feedback (feels real-time for sender)
      const tempId = Date.now();
      const localMsg: Message = {
        id: tempId,
        sender_id: user?.id || 0,
        receiver_id: selectedContact.id,
        content: newMessage.trim(),
        created_at: new Date().toISOString(),
        media_url: selectedFile ? URL.createObjectURL(selectedFile) : undefined,
        media_type: selectedFile ? selectedFile.type : undefined,
        reply_to_id: replyingTo ? replyingTo.id : null,
        reply_content: replyingTo ? replyingTo.content : undefined,
        reply_media_url: replyingTo ? replyingTo.media_url : undefined,
        reply_media_type: replyingTo ? replyingTo.media_type : undefined,
        reply_sender_name: replyingTo ? (replyingTo.sender_id === user?.id ? 'You' : replyingTo.sender_name || selectedContact.name) : undefined
      };
      
      setMessages(prev => [...prev, localMsg]);
      setNewMessage('');
      
      // Store reference to clear later, but clear state now for snappy UI
      const currentFile = selectedFile;
      setSelectedFile(null);
      setReplyingTo(null);

      const response = await api.post('/messages', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // The socket event will arrive shortly and replace the temp message with the real one.
      const textarea = document.getElementById('chat-input-student');
      if (textarea) textarea.style.height = 'auto';

      setContacts(prev => {
        const idx = prev.findIndex(c => c.id === selectedContact.id);
        if (idx > -1) {
          const contact = prev[idx];
          const newContacts = [...prev];
          newContacts.splice(idx, 1);
          newContacts.unshift(contact);
          return newContacts;
        }
        return prev;
      });
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    setMessageToDelete(messageId);
    setDeleteType('message');
    setDeleteScope('me'); // Default to me
    setDeleteModalOpen(true);
  };

  const handleDeleteConversation = () => {
    if (!selectedContact) return;
    setDeleteType('conversation');
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (deleteType === 'message' && messageToDelete !== null) {
      const id = messageToDelete;
      try {
        if (deleteScope === 'everyone') {
          setMessages(prev => prev.map(m => 
            m.id === id ? { ...m, is_deleted_for_everyone: true, content: '', media_url: undefined, media_type: undefined } : m
          ));
        } else {
          setMessages(prev => prev.filter(m => m.id !== id));
        }
        await api.delete(`/messages/${id}?type=${deleteScope}`);
      } catch (err) {
        console.error("Failed to delete message", err);
      }
    } else if (deleteType === 'conversation' && selectedContact) {
      try {
        setMessages([]);
        await api.delete(`/messages/conversation/${selectedContact.id}`);
      } catch (err) {
        console.error("Failed to delete conversation", err);
      }
    }
    setDeleteModalOpen(false);
    setMessageToDelete(null);
    setDeleteType(null);
  };

  const scrollToMessage = (messageId: number) => {
    const el = document.getElementById(`message-${messageId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(messageId);
      setTimeout(() => setHighlightedMessageId(null), 2000);
    }
  };

  // Listen to Enter key inside textarea (Submit chat)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach(msg => {
      const date = new Date(msg.created_at);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let dateString = date.toLocaleDateString();
      if (date.toDateString() === today.toDateString()) {
        dateString = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateString = 'Yesterday';
      } else {
        dateString = date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });
      }

      if (!groups[dateString]) groups[dateString] = [];
      groups[dateString].push(msg);
    });
    return groups;
  };

  const groupedMessages = groupMessagesByDate();

  // Find the ID of the last message sent by the user that has been read
  const lastReadMessageId = useMemo(() => {
    const ownMessages = messages.filter(m => m.sender_id === user?.id && m.is_read);
    if (ownMessages.length === 0) return null;
    return ownMessages[ownMessages.length - 1].id;
  }, [messages, user?.id]);

  // Filter instructors by search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.className.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout navItems={navItems} title="Messages">
      <div className="h-[calc(100vh-8rem)] min-h-[600px] flex bg-white/70 backdrop-blur-xl rounded-3xl border border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        
        {/* Left Side: Contact List */}
        <div className="w-80 md:w-96 border-r border-gray-100 flex flex-col h-full bg-gray-50/50 relative z-10">
          <div className="p-6 border-b border-gray-100 space-y-5 bg-white/50 backdrop-blur-md sticky top-0 z-20">
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Messages</h3>
            <div className="relative group">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
              <input 
                type="text" 
                placeholder="Search teacher or class..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none rounded-xl text-sm font-medium text-gray-700 transition-all shadow-sm placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 relative scroll-smooth">
            {loadingContacts ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse bg-white rounded-2xl border border-gray-50">
                  <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : filteredContacts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-16 text-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircleIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No instructors found</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {filteredContacts.map((contact, index) => (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left group border
                      ${selectedContact?.id === contact.id 
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 border-transparent' 
                        : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-100 hover:border-gray-200 hover:shadow-sm'}`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0 transition-transform duration-300 group-hover:scale-105 overflow-hidden
                      ${selectedContact?.id === contact.id 
                        ? 'bg-white/20 text-white shadow-inner' 
                        : 'bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600'}`}>
                      {contact.avatar_url ? (
                        <img src={getMediaUrl(contact.avatar_url)} alt={contact.name} className="h-full w-full object-cover" />
                      ) : (
                        contact.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-bold truncate ${selectedContact?.id === contact.id ? 'text-white' : 'text-gray-900'}`}>
                        {contact.name}
                      </p>
                      <p className={`text-xs mt-0.5 truncate ${selectedContact?.id === contact.id ? 'text-white/80' : 'text-gray-500'}`}>
                        Instructor
                      </p>
                      {contact.className && (
                        <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md mt-2
                          ${selectedContact?.id === contact.id ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                          {contact.className}
                        </span>
                      )}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Right Side: Message Feed */}
        <div className="flex-1 flex flex-col h-full bg-[#f8fafc] relative">
          {selectedContact ? (
            <>
              {/* Active Header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden">
                    {selectedContact.avatar_url ? (
                      <img src={getMediaUrl(selectedContact.avatar_url)} alt={selectedContact.name} className="h-full w-full object-cover" />
                    ) : (
                      selectedContact.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base">{selectedContact.name}</h4>
                    <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wider mt-0.5">{selectedContact.className || 'Class Instructor'}</p>
                  </div>
                </div>
                <button
                  onClick={handleDeleteConversation}
                  title="Delete entire conversation"
                  className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 active:scale-95"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Chat Feed */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {loadingMessages && messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <div className="h-10 w-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <p className="text-gray-400 text-sm font-medium animate-pulse">Loading messages...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center p-6"
                  >
                    <div className="p-6 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 rounded-full mb-6 shadow-sm border border-indigo-100">
                      <ChatBubbleLeftRightIcon className="h-12 w-12 text-indigo-500" />
                    </div>
                    <h5 className="font-bold text-gray-900 text-xl mb-2">Start the Conversation</h5>
                    <p className="text-gray-500 text-sm max-w-sm leading-relaxed">Send a message to connect with {selectedContact.name}.</p>
                  </motion.div>
                ) : (
                  <div className="space-y-6 flex-1 flex flex-col justify-end">
                    {Object.entries(groupedMessages).map(([date, msgs]) => (
                      <div key={date} className="space-y-6">
                        <div className="flex justify-center">
                          <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-bold shadow-sm">
                            {date}
                          </span>
                        </div>
                        <AnimatePresence>
                          {msgs.map((msg, idx) => {
                            const isOwn = msg.sender_id === user?.id;
                            return (
                              <React.Fragment key={msg.id}>
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, originX: isOwn ? 1 : 0 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                  id={`message-${msg.id}`}
                                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                  <div className={`max-w-[75%] rounded-2xl p-4 text-[15px] leading-relaxed relative group/msg transition-all duration-500
                                    ${highlightedMessageId === msg.id ? 'ring-4 ring-indigo-400/50 ring-offset-2 scale-[1.02]' : ''}
                                    ${msg.is_deleted_for_everyone 
                                      ? 'bg-gray-100 text-gray-500 rounded-br-sm border border-gray-200 italic shadow-none' 
                                      : isOwn 
                                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-br-sm shadow-sm' 
                                        : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100 shadow-sm'}`}
                                  >
                                    {!msg.is_deleted_for_everyone && (
                                      <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover/msg:opacity-100 transition-opacity flex items-center gap-1 ${isOwn ? '-left-20' : '-right-20'}`}>
                                        <button 
                                          onClick={() => handleDeleteMessage(msg.id)}
                                          className="p-2 text-gray-400 hover:text-red-600 bg-white rounded-full shadow-sm border border-gray-100 transition-colors"
                                          title="Remove"
                                        >
                                          <TrashIcon className="h-4 w-4" />
                                        </button>
                                        <button 
                                          onClick={() => setReplyingTo(msg)}
                                          className="p-2 text-gray-400 hover:text-indigo-600 bg-white rounded-full shadow-sm border border-gray-100 transition-colors"
                                          title="Reply"
                                        >
                                          <ArrowUturnLeftIcon className="h-4 w-4" />
                                        </button>
                                      </div>
                                    )}
                                    
                                    {msg.is_deleted_for_everyone ? (
                                      <p className="whitespace-pre-wrap text-sm">
                                        {isOwn ? "You unsent a message" : "This message was unsent"}
                                      </p>
                                    ) : (
                                      <>
                                        {msg.reply_to_id && (
                                          <div 
                                            onClick={() => scrollToMessage(msg.reply_to_id!)}
                                            className={`mb-2.5 px-3 py-2 rounded-xl text-xs flex flex-col gap-0.5 relative overflow-hidden transition-all cursor-pointer
                                              ${isOwn ? 'bg-black/10 text-white/90 hover:bg-black/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                          >
                                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isOwn ? 'bg-white/40' : 'bg-indigo-400/60'}`} />
                                            <span className="font-bold text-[11px] uppercase tracking-wider opacity-90 flex items-center gap-1">
                                              <ArrowUturnLeftIcon className="h-3 w-3" />
                                              {msg.reply_sender_name}
                                            </span>
                                            <p className="line-clamp-1 pr-2 truncate opacity-80 mt-0.5">
                                              {msg.reply_is_deleted_for_everyone ? <em>Message unsent</em> : (msg.reply_content || 'Attachment')}
                                            </p>
                                          </div>
                                        )}

                                        {msg.media_url && (
                                          <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                                            {msg.media_type?.startsWith('image/') ? (
                                              <img src={getMediaUrl(msg.media_url)} alt="Attachment" className="max-w-full h-auto max-h-64 object-cover" />
                                            ) : msg.media_type?.startsWith('video/') ? (
                                              <video src={getMediaUrl(msg.media_url)} controls className="max-w-full h-auto max-h-64" />
                                            ) : (
                                              <a href={getMediaUrl(msg.media_url)} target="_blank" rel="noreferrer" className="flex items-center gap-2 underline text-sm">
                                                <PaperClipIcon className="h-4 w-4" /> Download File
                                              </a>
                                            )}
                                          </div>
                                        )}
                                        {msg.content && <p className="whitespace-pre-wrap">{msg.content}</p>}
                                      </>
                                    )}
                                    <div className={`flex items-center justify-end gap-1 mt-2
                                      ${msg.is_deleted_for_everyone ? 'text-gray-400' : isOwn ? 'text-indigo-200' : 'text-gray-400'}`}>
                                      <span className="block text-[10px] font-medium tracking-wide">
                                        {new Date(msg.created_at).toLocaleTimeString(undefined, {
                                          hour: '2-digit',
                                          minute: '2-digit'
                                        })}
                                      </span>
                                    </div>
                                  </div>
                                </motion.div>
                                {lastReadMessageId === msg.id && (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-end mt-1 mb-2 pr-1"
                                  >
                                    {selectedContact?.avatar_url ? (
                                      <img 
                                        src={getMediaUrl(selectedContact.avatar_url)} 
                                        alt="Seen" 
                                        className="w-3.5 h-3.5 rounded-full object-cover shadow-sm ring-1 ring-white/50" 
                                        title="Seen" 
                                      />
                                    ) : (
                                      <div className="w-3.5 h-3.5 rounded-full bg-gray-200 flex items-center justify-center ring-1 ring-white/50" title="Seen">
                                        <span className="text-[6px] font-bold text-gray-500">{selectedContact?.name?.charAt(0).toUpperCase()}</span>
                                      </div>
                                    )}
                                  </motion.div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
                <div ref={chatBottomRef} className="h-1" />
              </div>

              {/* Message Input Box */}
              <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] z-10 flex flex-col gap-2">
                
                {replyingTo && (
                  <div className="flex items-center gap-3 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100">
                    <div className="flex-1 min-w-0 border-l-4 border-indigo-400 pl-3">
                      <p className="text-xs font-bold text-indigo-600 mb-0.5">
                        Replying to {replyingTo.sender_id === user?.id ? 'Yourself' : replyingTo.sender_name || selectedContact.username}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{replyingTo.content || 'Attachment'}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setReplyingTo(null)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}

                {selectedFile && (
                  <div className="mb-3 flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-gray-200">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center overflow-hidden">
                      {selectedFile.type.startsWith('image/') ? (
                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <PaperClipIcon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setSelectedFile(null)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                )}
                
                <form onSubmit={handleSendMessage} className="flex flex-col gap-2 bg-gray-50/50 border border-gray-200 rounded-2xl p-2 focus-within:bg-white focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300 shadow-inner">
                  <textarea 
                    id="chat-input-student"
                    rows={1}
                    value={newMessage}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="w-full bg-transparent px-4 py-2 outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400 resize-none max-h-32 scrollbar-thin scrollbar-thumb-gray-200 overflow-y-auto min-h-[44px]"
                  />
                  <div className="flex items-center justify-between px-2 pb-1">
                    <div className="flex items-center gap-1">
                      <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <FaceSmileIcon className="h-5 w-5" />
                      </button>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileSelect} 
                        className="hidden" 
                        accept="image/*,video/*,.pdf,.doc,.docx"
                      />
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                        <PaperClipIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      {!newMessage.trim() && (
                        <button type="button" className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <MicrophoneIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={(!newMessage.trim() && !selectedFile) || sendingMessage}
                        className={`h-9 w-9 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm flex-shrink-0
                          ${(newMessage.trim() || selectedFile) && !sendingMessage 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 shadow-indigo-600/30' 
                            : 'bg-gray-200 text-gray-400'}`}
                      >
                        <PaperAirplaneIcon className="h-4 w-4 -rotate-45 ml-0.5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50/30">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-6 shadow-sm"
              >
                <ChatBubbleLeftRightIcon className="h-10 w-10 text-indigo-500" />
              </motion.div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h4>
              <p className="text-gray-500 text-sm font-medium max-w-sm">Select an instructor from the sidebar to start a conversation.</p>
            </div>
          )}
        </div>

      </div>

      <AnimatePresence>
        {deleteModalOpen && (
          <DialogModal
            isOpen={deleteModalOpen}
            onClose={() => {
              setDeleteModalOpen(false);
              setMessageToDelete(null);
              setDeleteType(null);
            }}
            title={deleteType === 'message' ? "Delete Message" : "Delete Conversation"}
            message={
              deleteType === 'message' 
                ? "How would you like to delete this message?" 
                : `Are you sure you want to permanently delete the entire conversation with ${selectedContact?.name}? This action cannot be undone.`
            }
            type="danger"
            confirmText="Delete"
            onConfirm={executeDelete}
          >
            {deleteType === 'message' && (
              <div className="flex flex-col gap-3 mt-2 text-left">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                  <input 
                    type="radio" 
                    name="deleteScope" 
                    value="me" 
                    checked={deleteScope === 'me'} 
                    onChange={() => setDeleteScope('me')}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-sm font-medium text-gray-700">Delete for me</span>
                </label>
                
                {messages.find(m => m.id === messageToDelete)?.sender_id === user?.id && (
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                    <input 
                      type="radio" 
                      name="deleteScope" 
                      value="everyone" 
                      checked={deleteScope === 'everyone'} 
                      onChange={() => setDeleteScope('everyone')}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-sm font-medium text-red-600">Delete for everyone</span>
                  </label>
                )}
              </div>
            )}
          </DialogModal>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
