"use client"

import React, { useState, useEffect } from "react"
import { Github, Download, Globe, Sparkles } from "lucide-react"

interface NavbarProps {
  lang: "en" | "zh"
  onToggleLang: () => void
  dict: any
  accentColor: string
}

export default function Navbar({ lang, onToggleLang, dict, accentColor }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pb-2 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center justify-between gap-3 sm:gap-6 px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 ${
          scrolled
            ? "bg-slate-900/80 backdrop-blur-xl shadow-2xl border border-white/15"
            : "bg-slate-900/50 backdrop-blur-lg border border-white/10"
        }`}
        style={{
          boxShadow: scrolled
            ? `0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 20px ${accentColor}25`
            : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Brand */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-lg p-0.5 bg-gradient-to-tr from-white/20 to-white/5 border border-white/20">
            <img
              src={`${basePath}/icons/icon48.png`}
              alt="HoldTranslate Logo"
              className="w-full h-full object-contain rounded-lg"
              onError={(e) => {
                // Fallback icon if image path in local dev is missing
                (e.target as HTMLElement).style.display = "none"
              }}
            />
          </div>
          <span className="font-semibold tracking-tight text-white flex items-center gap-1.5 text-sm sm:text-base">
            {dict.nav.brand}
            <span
              className="text-[10px] font-mono px-1.5 py-0.5 rounded-full font-medium transition-colors"
              style={{
                backgroundColor: `${accentColor}25`,
                color: accentColor,
                border: `1px solid ${accentColor}40`,
              }}
            >
              {dict.nav.version}
            </span>
          </span>
        </a>

        {/* Center navigation links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <a href="#demo" className="hover:text-white transition-colors">
            {dict.nav.demo}
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            {dict.nav.features}
          </a>
          <a href="#subtitles" className="hover:text-white transition-colors">
            {dict.nav.subtitles}
          </a>
          <a href="#install" className="hover:text-white transition-colors">
            {dict.nav.install}
          </a>
        </div>

        {/* Right action buttons */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 transition-all active:scale-95"
            title={lang === "en" ? "切换为简体中文" : "Switch to English"}
          >
            <Globe className="w-3.5 h-3.5 opacity-80" />
            <span>{lang === "en" ? "中文" : "EN"}</span>
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com/egggggod/HoldTranslate-web"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>

          {/* Direct Download Button */}
          <a
            href="https://github.com/egggggod/HoldTranslate-plugin-for-chrome/releases/download/v1.7.0/holdtranslate-chrome-extension-v1.7.0.zip"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white shadow-lg transition-all hover:brightness-110 active:scale-95"
            style={{
              backgroundColor: accentColor,
              boxShadow: `0 4px 14px ${accentColor}50`,
            }}
          >
            <Download className="w-3.5 h-3.5" />
            <span>{dict.nav.download}</span>
          </a>
        </div>
      </nav>
    </header>
  )
}
