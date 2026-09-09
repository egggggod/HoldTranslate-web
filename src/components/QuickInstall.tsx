"use client"

import React, { useState } from "react"
import { Download, Terminal, Check, Copy, Sparkles, FolderArchive, Settings2, PlayCircle } from "lucide-react"

interface QuickInstallProps {
  dict: any
  accentColor: string
}

export default function QuickInstall({ dict, accentColor }: QuickInstallProps) {
  const [copied, setCopied] = useState(false)
  const gitCmd = "git clone https://github.com/egggggod/HoldTranslate-plugin-for-chrome.git"

  const handleCopy = () => {
    navigator.clipboard.writeText(gitCmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const steps = [
    {
      icon: FolderArchive,
      num: "01",
      title: dict.install.step1Title,
      desc: dict.install.step1Desc,
      action: (
        <a
          href="https://github.com/egggggod/HoldTranslate-plugin-for-chrome/releases/download/v1.7.0/holdtranslate-chrome-extension-v1.7.0.zip"
          className="inline-flex items-center gap-2 px-4 py-2 mt-3 rounded-xl text-xs font-semibold text-white shadow-md transition-all hover:brightness-110 active:scale-95"
          style={{ backgroundColor: accentColor }}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{dict.install.step1Btn}</span>
        </a>
      ),
    },
    {
      icon: Settings2,
      num: "02",
      title: dict.install.step2Title,
      desc: dict.install.step2Desc,
      extra: (
        <code className="block mt-2 px-2.5 py-1 rounded bg-black/40 border border-white/10 text-[11px] font-mono text-cyan-300">
          chrome://extensions/
        </code>
      ),
    },
    {
      icon: PlayCircle,
      num: "03",
      title: dict.install.step3Title,
      desc: dict.install.step3Desc,
    },
  ]

  return (
    <section id="install" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full crystal-panel text-xs font-semibold text-slate-300 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>{dict.install.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          {dict.install.title}
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">{dict.install.desc}</p>
      </div>

      {/* Steps Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {steps.map((s, idx) => {
          const Icon = s.icon
          return (
            <div
              key={idx}
              className="relative p-7 rounded-3xl crystal-panel flex flex-col justify-between border border-white/15 shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/10"
                    style={{
                      backgroundColor: `${accentColor}20`,
                      color: accentColor,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-2xl font-black text-white/20">{s.num}</span>
                </div>

                <h3 className="text-lg font-bold text-white mb-2.5">{s.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{s.desc}</p>
                {s.extra}
              </div>

              {s.action && <div className="pt-4">{s.action}</div>}
            </div>
          )
        })}
      </div>

      {/* Developer Git Clone Option */}
      <div className="crystal-panel rounded-2xl p-5 sm:p-6 border border-white/10 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-slate-400 shrink-0" />
          <span className="text-xs sm:text-sm font-mono text-slate-300 truncate">
            {gitCmd}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/15 transition-all shrink-0 active:scale-95"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </section>
  )
}
