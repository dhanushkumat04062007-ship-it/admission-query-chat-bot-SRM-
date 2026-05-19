"use client";

import { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, UserCog } from 'lucide-react';

export default function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [key, setKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await axios.post('http://localhost:5000/api/auth/admin-login', { username, key });
            login(res.data.token, res.data.user);
            router.push('/dashboard/admin');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Access Denied. Invalid Credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[90vh] bg-gray-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-100 via-gray-100 to-gray-200">
            <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden">
                {/* Decorative Top Bar */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-800 to-gray-600"></div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-700 shadow-inner">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Admin Console</h1>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Restricted Access</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 flex items-center gap-2 animate-pulse">
                        <Lock size={14} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <UserCog size={16} />
                        </div>
                        <input
                            type="text"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                            placeholder="Admin Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Lock size={16} />
                        </div>
                        <input
                            type="password"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 outline-none transition-all bg-gray-50 focus:bg-white text-sm"
                            placeholder="Security Key"
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full h-11 bg-gray-900 hover:bg-black text-white shadow-lg transition-transform active:scale-95" disabled={loading}>
                        {loading ? 'Authenticating...' : 'Access Dashboard'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button onClick={() => router.push('/')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                        ← Back to Public Site
                    </button>
                </div>
            </div>
        </div>
    );
}
