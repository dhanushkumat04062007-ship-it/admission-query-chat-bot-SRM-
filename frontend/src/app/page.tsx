"use client";

import Link from 'next/link';
import { GlowButton } from '../components/ui/GlowButton';
import { GlassCard } from '../components/ui/GlassCard';
import { Sparkles, BookOpen, Building2, GraduationCap, ArrowRight, Bot, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0b1120]">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-srm-maroon/20 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] animate-blob animation-delay-2000" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-srm-gold/10 rounded-full blur-[100px] animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 flex flex-col items-center justify-center min-h-screen pt-20">
        {/* Hero Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-medium text-indigo-300 tracking-wider uppercase">Admissions 2024-25 Live</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50 mb-8 tracking-tight leading-none">
            Academic <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Intelligence.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Navigate your admission journey with <span className="text-white font-semibold">SRMQUERY.AI</span>.
            Instant intelligent answers about courses, hostels, and campus life powered by next-gen LLMs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/chat">
              <GlowButton variant="primary" icon={<Bot size={20} />}>
                Start AI Chat
              </GlowButton>
            </Link>
            <Link href="/dashboard/general">
              <GlowButton variant="outline" icon={<Globe size={18} />}>
                Explore Data
              </GlowButton>
            </Link>
          </div>
        </motion.div>

        {/* Floating Stats / Features */}
        <div className="grid md:grid-cols-3 gap-6 w-full max-w-6xl pb-20">
          <FeatureCard
            delay={0.2}
            icon={<GraduationCap className="text-indigo-400" size={32} />}
            title="AI Admissions"
            desc="Instant eligibility checks and fee analysis powered by our custom trained models."
          />
          <FeatureCard
            delay={0.4}
            icon={<Building2 className="text-srm-gold" size={32} />}
            title="Campus & Hostels"
            desc="Real-time availability of rooms, mess menus, and campus facility insights."
          />
          <FeatureCard
            delay={0.6}
            icon={<Zap className="text-purple-400" size={32} />}
            title="Instant Answers"
            desc="No more waiting for emails. Get 24/7 support for all your admission queries."
          />
        </div>
      </div>

      {/* Footer Minimal */}
      <div className="absolute bottom-6 w-full text-center z-10">
        <p className="text-xs text-slate-600">
          Built for <span className="text-slate-500 font-bold">SRM IST</span> •
          <Link href="/admin/login" className="hover:text-indigo-400 transition-colors ml-2">Admin Console</Link>
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <GlassCard className="h-full group hover:bg-white/10">
        <div className="mb-6 p-4 rounded-2xl bg-white/5 w-fit border border-white/5 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          {desc}
        </p>
      </GlassCard>
    </motion.div>
  );
}
