"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { User, Home, Clock, LogOut, ChevronRight, Bell } from 'lucide-react';

export default function StudentDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [data, setData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }
        if (!authLoading && user?.role !== 'student') {
            router.back();
        }

        if (user) {
            fetchDashboardData();
        }
    }, [user, authLoading]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/student/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (authLoading || !data) return <div className="h-screen flex items-center justify-center bg-gray-50">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Header / Welcome Banner */}
            <div className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-6 py-8">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome back, <span className="text-srm-maroon">{user?.name}</span></h1>
                    <p className="text-gray-500 mt-2">Here's your academic and hostel overview.</p>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="grid md:grid-cols-3 gap-8">

                    {/* Left Column: Profile & Stats */}
                    <div className="space-y-8">
                        {/* Profile Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-srm-maroon to-srm-gold"></div>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{user?.name}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Student</p>
                                </div>
                            </div>
                            <div className="space-y-3 text-sm text-gray-600">
                                <div className="flex justify-between border-b border-dashed pb-2">
                                    <span>Email</span>
                                    <span className="font-medium text-gray-900 truncate max-w-[150px]">{user?.email}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed pb-2">
                                    <span>Reg No</span>
                                    <span className="font-medium text-gray-900">RA2411026011008</span> {/* Ideally from DB */}
                                </div>
                            </div>
                        </div>

                        {/* Hostel Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-4 text-srm-maroon">
                                <Home size={20} />
                                <h3 className="font-bold text-lg">My Hostel</h3>
                            </div>
                            {data.hostel ? (
                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                    <div className="text-2xl font-bold text-gray-800 mb-1">{data.hostel.room_number || "N/A"}</div>
                                    <div className="text-sm text-gray-600">{data.hostel.name}</div>
                                </div>
                            ) : (
                                <div className="p-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-gray-500 text-sm">
                                    No hostel allocated.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Activity Feed */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 h-full">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3 text-gray-800">
                                    <Clock size={20} className="text-srm-gold" />
                                    <h3 className="font-bold text-xl">Recent Activity</h3>
                                </div>
                                <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded text-gray-500">Last 7 Days</span>
                            </div>

                            {data.activity && data.activity.length > 0 ? (
                                <div className="space-y-1 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-gray-100">
                                    {data.activity.map((log: any) => (
                                        <div key={log.id} className="relative pl-6 py-4 group hover:bg-gray-50 rounded-lg transition-colors">
                                            <div className="absolute left-0 top-6 w-4 h-4 rounded-full border-2 border-white bg-srm-gold shadow-sm z-10"></div>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <span className="text-xs font-bold text-srm-maroon bg-red-50 px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block">{log.action_type}</span>
                                                    <p className="text-sm text-gray-700 font-medium text-base mt-1">{log.description}</p>
                                                </div>
                                                <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{new Date(log.timestamp).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                    <Bell size={48} className="mb-4 opacity-20" />
                                    <p>No recent activity found.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
