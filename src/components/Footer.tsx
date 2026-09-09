"use client"

import React from "react"
import { Github, Globe, Heart, Shield, Sparkles } from "lucide-react"

interface FooterProps {
  dict: any
  lang: "en" | "zh"
  onToggleLang: () => void
  accentColor: string
}

export default function Footer({ dict, lang, onToggleLang, accentColor }: FooterProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-slate-950/80 backdrop-blur-2xl py-14 px-4 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* Brand & Slogan */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2.5">
            <img
              src={`${basePath}/icons/icon48.png`}
              alt="HoldTranslate"
              className="w-7 h-7 rounded-lg shadow"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none"
              }}
            />
            <span className="text-lg font-bold text-white tracking-tight">HoldTranslate</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              v1.7.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm">{dict.footer.slogan}</p>
          <p className="text-[11px] text-slate-500">{dict.footer.releaseNotice}</p>
        </div>

        {/* Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium">
          <a
            href="https://github.com/egggggod/HoldTranslate-web"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Github className="w-4 h-4" />
            <span>{dict.footer.sourceCode}</span>
          </a>
          <a
            href="https://github.com/egggggod/HoldTranslate-plugin-for-chrome/releases"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {dict.footer.releases}
          </a>
          <a
            href="https://github.com/egggggod/HoldTranslate-plugin-for-chrome/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            {dict.footer.issues}
          </a>
          <button
            onClick={onToggleLang}
            className="hover:text-white transition-colors flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{lang === "en" ? "简体中文" : "English"}</span>
          </button>
        </div>
      </div>

      {/* Acknowledgments & Copyright */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{dict.footer.acknowledgments}</span>
        </div>
        <div>
          <span>{dict.footer.copyright}</span>
        </div>
      </div>
    </footer>
  )
}
