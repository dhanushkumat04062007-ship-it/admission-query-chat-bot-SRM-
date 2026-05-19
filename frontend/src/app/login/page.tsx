"use client";

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, BookOpen, GraduationCap, Users } from 'lucide-react';
import axios from 'axios';

export default function AccessPortalPage() {
    const [accessMode, setAccessMode] = useState<'student' | 'general'>('student');
    const [email, setEmail] = useState('');
    const [regNo, setRegNo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleStudentAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !regNo) {
            setError("Email and Register Number are required.");
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/student-access', { 
                email, 
                register_number: regNo 
            });
            // Login handles redirect to /chat
            login(res.data.token, res.data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Access denied. Verify your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGeneralAccess = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('http://localhost:5000/api/auth/general-access');
            login(res.data.token, res.data.user);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Access denied. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                
                {/* Left Side: Branding / Info */}
                <div className="bg-srm-maroon p-10 text-white flex flex-col justify-between hidden md:flex relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4 leading-tight">SRM Admission<br/>Intelligence.</h2>
                        <p className="text-white/80 text-lg">Instant, accurate answers for all your admission queries powered by AI.</p>
                    </div>
                    
                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg">Course Info</h4>
                                <p className="text-white/70 text-sm">Fees, eligibility & syllabus</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg">Campus Life</h4>
                                <p className="text-white/70 text-sm">Hostels, facilities & events</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Gateway Forms */}
                <div className="p-8 md:p-12 bg-white flex flex-col justify-center">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h1>
                        <p className="text-gray-500">Choose how you want to proceed.</p>
                    </div>

                    {/* Mode Selector */}
                    <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
                        <button 
                            onClick={() => setAccessMode('student')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${accessMode === 'student' ? 'bg-white text-srm-maroon shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Registered Student
                        </button>
                        <button 
                            onClick={() => setAccessMode('general')}
                            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${accessMode === 'general' ? 'bg-white text-srm-maroon shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            General Enquiry
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center justify-center font-medium">
                            {error}
                        </div>
                    )}

                    {accessMode === 'student' && (
                        <form onSubmit={handleStudentAccess} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Register Number</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-srm-maroon/20 focus:border-srm-maroon outline-none transition-all text-gray-800"
                                    placeholder="e.g. RA24110..."
                                    value={regNo}
                                    onChange={(e) => setRegNo(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Official Email ID</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-srm-maroon/20 focus:border-srm-maroon outline-none transition-all text-gray-800"
                                    placeholder="e.g. ab1234@srmist.edu.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="w-full py-3.5 bg-srm-maroon text-white rounded-xl font-semibold shadow-premium shadow-srm-maroon/30 hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? 'Verifying...' : 'Access My Dashboard'} <ArrowRight size={18} />
                            </button>
                        </form>
                    )}

                    {accessMode === 'general' && (
                        <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
                            <div className="w-20 h-20 mx-auto bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-4">
                                <Users size={32} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Guest Access</h3>
                            <p className="text-gray-500 text-sm max-w-xs mx-auto">
                                Ask General AI about admission requirements, course fees, and campus facilities without an account.
                            </p>
                            <button 
                                onClick={handleGeneralAccess}
                                disabled={loading}
                                className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-semibold shadow-premium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                {loading ? 'Initializing Session...' : 'Continue as Guest'} <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
