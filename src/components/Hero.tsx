"use client"

import React from "react"
import { Download, Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react"

interface HeroProps {
  dict: any
  accentColor: string
}

export default function Hero({ dict, accentColor }: HeroProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-28 pb-16 px-4 overflow-hidden text-center">
      {/* Aurora Ambient Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[450px] rounded-full blur-[120px] opacity-40 animate-float-slow"
          style={{
            background: `radial-gradient(circle, ${accentColor} 0%, rgba(139, 92, 246, 0.4) 50%, rgba(6, 9, 19, 0) 70%)`,
          }}
        />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[350px] rounded-full bg-cyan-500/20 blur-[100px] animate-float-reverse" />
        <div className="absolute top-1/2 right-1/4 w-[450px] h-[350px] rounded-full bg-purple-600/20 blur-[110px] animate-float-slow" />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Apple VisionOS Liquid Glass Badge */}
        <div className="relative group mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full crystal-panel text-xs sm:text-sm font-medium text-slate-200 overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>{dict.hero.badge}</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          {dict.hero.title}
          <br />
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400"
            style={{
              backgroundImage: `linear-gradient(135deg, #ffffff 0%, ${accentColor} 50%, #c084fc 100%)`,
            }}
          >
            {dict.hero.titleHighlight}
          </span>
        </h1>

        {/* Hero Tagline */}
        <p className="max-w-2xl text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-10 text-balance">
          {dict.hero.tagline}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-12 w-full sm:w-auto">
          <a
            href="https://github.com/egggggod/HoldTranslate-plugin-for-chrome/releases/download/v1.7.0/holdtranslate-chrome-extension-v1.7.0.zip"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl font-semibold text-white shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 10px 30px -5px ${accentColor}60, 0 0 0 1px rgba(255, 255, 255, 0.2) inset`,
            }}
          >
            <Download className="w-5 h-5" />
            <span>{dict.hero.downloadCta}</span>
          </a>

          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-slate-200 crystal-panel hover:bg-white/10 hover:text-white transition-all duration-200 active:scale-[0.98]"
          >
            <span>{dict.hero.demoCta}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Badges Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{dict.hero.manifestBadge}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{dict.hero.speedBadge}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-white/10 backdrop-blur-md">
            <Layers className="w-4 h-4 text-blue-400" />
            <span>{dict.hero.licenseBadge}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
