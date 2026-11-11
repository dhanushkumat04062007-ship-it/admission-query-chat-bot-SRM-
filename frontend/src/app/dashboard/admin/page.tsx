"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [data, setData] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [regNum, setRegNum] = useState('');
    const [msg, setMsg] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) router.push('/login');
        if (!authLoading && user?.role !== 'admin') router.back();

        if (user) fetchDashboardData();
    }, [user, authLoading]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/admin/allowed-students',
                { email, register_number: regNum },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMsg('Student added successfully!');
            setEmail('');
            setRegNum('');
        } catch (err: any) {
            setMsg(err.response?.data?.message || 'Failed to add student');
        }
    };

    if (authLoading || !data) return <div className="p-8 text-center">Loading Admin Panel...</div>;

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-srm-maroon">Admin Dashboard</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="text-center bg-blue-50 border-blue-200">
                    <div className="text-3xl font-bold text-blue-600">{data.stats?.studentCount}</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Students</div>
                </Card>
                <Card className="text-center bg-green-50 border-green-200">
                    <div className="text-3xl font-bold text-green-600">{data.stats?.deptCount}</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Departments</div>
                </Card>
                <Card className="text-center bg-yellow-50 border-yellow-200">
                    <div className="text-3xl font-bold text-yellow-600">{data.stats?.hostelCount}</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Hostels</div>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Manage Access */}
                <Card title="Manage Student Access">
                    <form onSubmit={handleAddStudent} className="space-y-4">
                        {msg && <div className="p-2 bg-gray-100 text-sm rounded">{msg}</div>}
                        <div>
                            <label className="block text-sm font-medium mb-1">Student Email</label>
                            <input
                                className="w-full p-2 border rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Register Number</label>
                            <input
                                className="w-full p-2 border rounded"
                                value={regNum}
                                onChange={(e) => setRegNum(e.target.value)}
                            />
                        </div>
                        <Button type="submit" size="sm">Add to Allow List</Button>
                    </form>
                </Card>

                {/* System Logs */}
                <Card title="Recent Activity">
                    <ul className="space-y-3">
                        {data.recentLogs && data.recentLogs.map((log: any) => (
                            <li key={log.id} className="border-b pb-2 last:border-0 text-sm">
                                <span className="font-bold text-gray-500 block">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                <span className="text-srm-maroon font-semibold">User #{log.user_id}</span>: {log.description.substring(0, 100)}...
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 text-center">
                        <Button variant="outline" size="sm">View All Logs</Button>
                    </div>
                </Card>
            </div>

        </div>
    );
}
