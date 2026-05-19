"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Send, 
  Plus, 
  MessageSquare, 
  Menu, 
  X, 
  Bot, 
  Paperclip, 
  LogOut, 
  Database, 
  User,
  Settings,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I am the SRM Admission AI. How can I help you with your application, fees, or hostel queries today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user' as const, content: input };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/chat', {
                message: userMessage.content,
                history: updatedMessages.slice(-5)
            }, {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });

            setMessages([...updatedMessages, { role: 'assistant', content: res.data.reply }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages([...updatedMessages, { role: 'assistant', content: 'I encountered a temporal hiccup. Please try again or check your connection.' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestion = (text: string) => {
        setInput(text);
        // We can't immediately trigger send because state hasn't updated yet, 
        // but in a premium UI we often just fill it for them or use a ref.
    };

    if (authLoading) return <div className="h-screen flex items-center justify-center bg-white text-gray-400 font-medium">Initialising Admission Systems...</div>;

    return (
        <div className="flex h-screen bg-white overflow-hidden font-sans">
            
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-20" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar (ChatGPT Style) */}
            <aside className={`glass-sidebar w-[280px] flex-shrink-0 flex flex-col transition-transform duration-300 z-30 fixed inset-y-0 md:relative ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:-ml-[280px]'}`}>
                <div className="p-3 flex-1 flex flex-col gap-2 overflow-hidden relative">
                    <div className="flex items-center gap-2 mb-2">
                        <button className="flex-1 flex items-center gap-3 px-3 py-3 border border-gray-100/10 rounded-md text-white hover:bg-white/5 transition-colors">
                            <Plus size={16} />
                            <span className="text-sm font-medium">New Chat</span>
                        </button>
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden p-3 border border-gray-100/10 rounded-md text-white hover:bg-white/5 flex items-center justify-center">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-1">
                        <div className="px-2 py-4">
                            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">University Admissions</h3>
                            <div className="space-y-1">
                                {['Admission FAQ', 'Hostel Fee Structure', 'Scholarship 2024', 'Course Selection'].map((item, i) => (
                                    <div key={i} className="group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer text-gray-300 transition-all">
                                        <MessageSquare size={14} className="group-hover:text-srm-maroon" />
                                        <span className="text-sm truncate font-medium">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Footer */}
                <div className="p-3 border-t border-white/5 space-y-1">
                    <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-white/5 transition-colors">
                        <LogOut size={16} />
                        <span className="text-sm font-medium">Log out</span>
                    </button>
                    <div className="px-3 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-srm-maroon flex items-center justify-center text-white text-xs font-bold border border-white/10 uppercase">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name || "Guest Account"}</p>
                            <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col relative h-full bg-white overflow-hidden">
                
                {/* Mobile Header */}
                <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-100">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-500 hover:bg-gray-50 rounded-md">
                        <Menu size={20} />
                    </button>
                    <h1 className="text-sm font-bold text-gray-800">Admission AI</h1>
                    <div className="w-10"></div>
                </header>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto w-full">
                    {messages.length === 1 && (
                        <div className="h-full flex flex-col items-center justify-center p-8 max-w-5xl mx-auto">
                            <div className="w-16 h-16 rounded-2xl bg-srm-maroon flex items-center justify-center text-white shadow-xl mb-6">
                                <Bot size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">How can I assist you?</h2>
                            <p className="text-gray-500 text-center mb-10 max-w-md">Our AI knows all about SRM Institute of Science and Technology, from admissions to campus life.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                                {[
                                    { icon: <Database size={16} />, text: "When is the admission deadline 2024?" },
                                    { icon: <Plus size={16} />, text: "What is the fee for B.Tech CSE?" },
                                    { icon: <Settings size={16} />, text: "Hostel options for first-year students" },
                                    { icon: <Sparkles size={16} />, text: "Available scholarships for merit students" }
                                ].map((s, i) => (
                                    <button onClick={() => handleSuggestion(s.text)} key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all group text-left">
                                        <div className="flex items-center gap-3">
                                            <span className="text-gray-400 group-hover:text-srm-maroon">{s.icon}</span>
                                            <span className="text-sm font-medium text-gray-700">{s.text}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message-row ${msg.role === 'assistant' ? 'bg-chat-assistant-bg' : 'bg-chat-user-bg'}`}>
                                <div className="message-content">
                                    <div className={msg.role === 'assistant' ? 'assistant-avatar' : 'user-avatar'}>
                                        {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                                    </div>
                                    <div className="flex-1 text-[15.5px] leading-relaxed text-gray-800 antialiased whitespace-pre-wrap">
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="message-row bg-chat-assistant-bg">
                                <div className="message-content">
                                    <div className="assistant-avatar animate-pulse">
                                        <Bot size={18} />
                                    </div>
                                    <div className="flex items-center gap-1 mt-2">
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-40 flex-shrink-0" />
                    </div>
                </div>

                {/* Input Sidebar Toggle (Desktop Only) */}
                {!sidebarOpen && (
                    <button onClick={() => setSidebarOpen(true)} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-8 h-12 bg-white border border-gray-200 items-center justify-center rounded-r-lg shadow-sm hover:bg-gray-50 text-gray-400 transition-all z-20">
                        <ChevronRight size={18} />
                    </button>
                )}

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 right-0 py-6 bg-gradient-to-t from-white via-white to-transparent">
                    <div className="input-container">
                        <div className="relative flex items-center">
                            <button className="absolute left-4 text-gray-400 hover:text-gray-600">
                                <Paperclip size={20} />
                            </button>
                            <textarea
                                className="chat-input px-12 resize-none max-h-40 min-h-[52px] max-w-5xl mx-auto w-full"
                                placeholder="Message Admission AI..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                rows={1}
                            />
                            <button 
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="absolute right-2 w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                        <p className="text-[11px] text-gray-400 text-center mt-3 font-medium">SRM Admission AI may provide inaccurate info. Verification recommended.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
