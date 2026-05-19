"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import Link from 'next/link';
import axios from 'axios';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        register_number: '', // Will be auto-formatted if needed, but user input is fine for now
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // frontend validation for domain
        if (formData.role === 'student' && !formData.email.endsWith('@srmist.edu.in')) {
            setError('Student email must end with @srmist.edu.in');
            setLoading(false);
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', formData);
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[85vh] bg-gray-50 py-10">
            <Card className="w-full max-w-md p-8 shadow-xl border-t-4 border-t-srm-maroon" title="Student Registration">
                <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm">Create your SRM Student Account</p>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 border border-red-100 flex items-center justify-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-srm-maroon/20 focus:border-srm-maroon outline-none transition-all"
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email (@srmist.edu.in)</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-srm-maroon/20 focus:border-srm-maroon outline-none transition-all"
                            placeholder="e.g. na9755@srmist.edu.in"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">Must match your official university email.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Register Number</label>
                        <input
                            name="register_number"
                            type="text"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-srm-maroon/20 focus:border-srm-maroon outline-none transition-all"
                            placeholder="e.g. RA2411026011008"
                            value={formData.register_number}
                            onChange={handleChange}
                        />
                        <p className="text-xs text-gray-500 mt-1">Found on your ID card.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Set Password</label>
                        <input
                            name="password"
                            type="password"
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-srm-maroon/20 focus:border-srm-maroon outline-none transition-all"
                            placeholder="Min. 6 characters"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full mt-2 h-11" disabled={loading}>
                        {loading ? 'Registering...' : 'Create Account'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account? <Link href="/login" className="text-srm-maroon font-bold hover:underline">Login here</Link>
                </p>
            </Card>
        </div>
    );
}
