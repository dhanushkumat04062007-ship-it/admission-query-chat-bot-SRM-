"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, MapPin, Monitor, GraduationCap, Building2 } from 'lucide-react';

export default function GeneralDashboard() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetchPublicData();
    }, []);

    const fetchPublicData = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/general/info');
            setData(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (!data) return <div className="h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading Information...</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Hero Header */}
            <div className="bg-gradient-to-r from-srm-maroon to-red-900 text-white py-16 px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                <div className="container mx-auto relative z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Admission Information Center</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto">Browse all open programs, department contacts, and fee structures in one place.</p>

                    {/* Search Bar - Visual Only for Demo */}
                    <div className="mt-8 max-w-lg mx-auto relative">
                        <input
                            type="text"
                            placeholder="Search for courses (e.g. CSE, MBA)..."
                            className="w-full py-4 pl-12 pr-4 rounded-full text-gray-800 focus:outline-none shadow-lg"
                        />
                        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-10 relative z-20">
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Panel: Active Admissions */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <GraduationCap className="text-srm-gold" /> Active Programs
                            </h2>
                            <div className="grid gap-4">
                                {data.admissions && data.admissions.map((adm: any) => (
                                    <div key={adm.id} className="p-6 rounded-xl border border-gray-100 hover:border-srm-maroon/20 hover:bg-red-50/30 transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg text-gray-900 group-hover:text-srm-maroon transition-colors">{adm.program_name}</h3>
                                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Open</span>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 mt-4">
                                            <div>
                                                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Eligibility</span>
                                                {adm.eligibility}
                                            </div>
                                            <div>
                                                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Fee Structure</span>
                                                <span className="font-medium text-srm-maroon">{adm.fee_structure}</span>
                                            </div>
                                            <div>
                                                <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">Intake</span>
                                                {adm.intake_limit} Seats
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Departments */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Building2 className="text-srm-gold" size={20} /> Departments
                            </h2>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {data.departments && data.departments.map((dept: any) => (
                                    <div key={dept.id} className="p-4 rounded-xl bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                                        <h3 className="font-bold text-gray-800 text-sm">{dept.name}</h3>
                                        <div className="mt-2 text-xs space-y-1">
                                            <p className="text-gray-500 flex items-center gap-1">
                                                <User size={12} /> HOD: {dept.hod_name}
                                            </p>
                                            <a href={`mailto:${dept.contact_email}`} className="text-blue-600 hover:underline flex items-center gap-1">
                                                <Monitor size={12} /> {dept.contact_email}
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Simple User Icon for department section
function User({ size, className }: { size?: number, className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    )
}
