"use client";

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Sparkles, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // If on the chat page, completely hide the navbar because chat is a distinct full-screen UI.
    if (pathname?.startsWith('/chat')) {
        return null;
    }

    // Only the dark landing page can sit under a transparent navbar.
    // Every other page is light, so the bar stays solid and a spacer
    // keeps page content from sliding underneath it.
    const isHome = pathname === '/';
    const solid = scrolled || !isHome;

    return (
        <>
        {!isHome && <div className="h-16 bg-[#0b1120]" aria-hidden="true" />}
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${solid ? 'bg-[#0b1120]/90 backdrop-blur-md border-b border-white/5 shadow-lg' : 'bg-transparent border-transparent'}`}
        >
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-srm-maroon to-red-600 rounded-lg shadow-lg group-hover:shadow-red-500/20 transition-all">
                        <Sparkles size={16} className="text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white">
                        SRM<span className="text-transparent bg-clip-text bg-gradient-to-r from-srm-gold to-yellow-200">QUERY</span>.AI
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink href="/dashboard/general">Admissions</NavLink>
                    <NavLink href="/chat" isNew>AI Chat</NavLink>

                    {user ? (
                        <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                            <Dropdown user={user} logout={logout} />
                        </div>
                    ) : (
                        <Link href="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-5 py-2 rounded-full bg-white/10 border border-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
                            >
                                Login
                            </motion.button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#0b1120] border-b border-white/10 overflow-hidden"
                    >
                        <div className="p-6 space-y-4 flex flex-col">
                            <Link href="/dashboard/general" className="text-white/80 py-2" onClick={() => setMobileMenuOpen(false)}>Admissions</Link>
                            <Link href="/chat" className="text-srm-gold font-bold py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                <Sparkles size={16} /> AI Chat
                            </Link>
                            {user ? (
                                <button onClick={logout} className="text-red-400 py-2 text-left flex items-center gap-2">
                                    <LogOut size={16} /> Logout ({user.name})
                                </button>
                            ) : (
                                <Link href="/login" className="bg-white/10 text-white text-center py-3 rounded-lg" onClick={() => setMobileMenuOpen(false)}>
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
        </>
    );
}

// Sub-components
function NavLink({ href, children, isNew }: { href: string, children: React.ReactNode, isNew?: boolean }) {
    return (
        <Link href={href} className="relative group text-sm font-medium text-white/70 hover:text-white transition-colors flex items-center gap-2">
            {children}
            {isNew && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-bold">
                    New
                </span>
            )}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-srm-gold transition-all group-hover:w-full opacity-0 group-hover:opacity-100" />
        </Link>
    );
}

function Dropdown({ user, logout }: { user: any, logout: () => void }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <div className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                    {/* Animated Profile Ring */}
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-75 blur-sm animate-pulse"></div>
                    <div className="relative w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/20">
                        <User size={14} className="text-indigo-300" />
                    </div>
                </div>
                <span className="text-sm font-medium text-white max-w-[100px] truncate">{user.name}</span>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-[#0f172a] border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl z-50 origin-top-right"
                    >
                        <div className="p-3 border-b border-white/5">
                            <p className="text-xs text-white/40 uppercase tracking-wider">Signed in as</p>
                            <p className="text-sm font-bold text-white truncate">{user.email}</p>
                        </div>
                        <div className="p-1">
                            {user.role === 'admin' && (
                                <Link href="/dashboard/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 rounded-lg transition-colors">
                                    Dashboard
                                </Link>
                            )}
                            {user.role === 'student' && (
                                <Link href="/dashboard/student" className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:bg-white/5 rounded-lg transition-colors">
                                    Dashboard
                                </Link>
                            )}
                            <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left">
                                <LogOut size={14} /> Sign out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
