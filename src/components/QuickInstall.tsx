"use client"

import React, { useState, useRef } from "react"
import { Download, Terminal, Check, Copy, Sparkles, FolderArchive, Settings2, PlayCircle } from "lucide-react"
import LiquidGlass from "./LiquidGlass"
import { type TuningSettings } from "./LiquidGlass/TuningDock"

interface QuickInstallProps {
  dict: any
  accentColor: string
  settings: TuningSettings
}

export default function QuickInstall({ dict, accentColor, settings }: QuickInstallProps) {
  const [copied, setCopied] = useState(false)
  const installRef = useRef<HTMLDivElement>(null)
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
        <LiquidGlass
          mode={settings.mode}
          displacementScale={35}
          blurAmount={settings.blurAmount}
          saturation={settings.saturation}
          aberrationIntensity={settings.aberrationIntensity}
          elasticity={0.3}
          cornerRadius={999}
          overLight={false}
          padding="8px 18px"
          style={{ backgroundColor: accentColor }}
          onClick={() => {
            window.location.href =
              "https://github.com/egggggod/HoldTranslate-plugin-for-chrome/releases/download/v1.7.0/holdtranslate-chrome-extension-v1.7.0.zip"
          }}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <Download className="w-3.5 h-3.5" />
            <span>{dict.install.step1Btn}</span>
          </div>
        </LiquidGlass>
      ),
    },
    {
      icon: Settings2,
      num: "02",
      title: dict.install.step2Title,
      desc: dict.install.step2Desc,
      extra: (
        <LiquidGlass
          mode={settings.mode}
          displacementScale={20}
          blurAmount={settings.blurAmount}
          saturation={settings.saturation}
          aberrationIntensity={settings.aberrationIntensity}
          elasticity={0.15}
          cornerRadius={12}
          overLight={settings.overLight}
          padding="6px 12px"
          className="mt-3 inline-block"
        >
          <code className="text-xs font-mono font-bold text-blue-700">
            chrome://extensions/
          </code>
        </LiquidGlass>
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
    <section id="install" className="py-20 px-4 max-w-7xl mx-auto select-none" ref={installRef}>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm text-xs font-semibold text-slate-800 mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{dict.install.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {dict.install.title}
        </h2>
        <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
          {dict.install.desc}
        </p>
      </div>

      {/* 3 Steps Cards as LiquidGlass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {steps.map((s, idx) => {
          const Icon = s.icon
          return (
            <LiquidGlass
              key={idx}
              mode={settings.mode}
              displacementScale={settings.displacementScale * 0.6}
              blurAmount={settings.blurAmount}
              saturation={settings.saturation}
              aberrationIntensity={settings.aberrationIntensity}
              elasticity={0.15}
              cornerRadius={settings.cornerRadius}
              overLight={settings.overLight}
              padding="28px"
              className="w-full h-full"
              mouseContainer={installRef}
            >
              <div className="flex flex-col justify-between h-full text-left">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border border-white/60"
                      style={{
                        backgroundColor: `${accentColor}20`,
                        color: accentColor,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-3xl font-black text-slate-400/40">{s.num}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">{s.title}</h3>
                  <p className="text-slate-700 text-sm leading-relaxed font-medium">{s.desc}</p>
                  {s.extra}
                </div>

                {s.action && <div className="pt-6">{s.action}</div>}
              </div>
            </LiquidGlass>
          )
        })}
      </div>

      {/* Developer Terminal Box as LiquidGlass Card */}
      <div className="max-w-2xl mx-auto">
        <LiquidGlass
          mode={settings.mode}
          displacementScale={30}
          blurAmount={settings.blurAmount}
          saturation={settings.saturation}
          aberrationIntensity={settings.aberrationIntensity}
          elasticity={0.15}
          cornerRadius={20}
          overLight={settings.overLight}
          padding="16px 20px"
          className="w-full"
          mouseContainer={installRef}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3 w-full sm:w-auto truncate">
              <Terminal className="w-5 h-5 text-slate-700 shrink-0" />
              <span className="text-xs sm:text-sm font-mono font-bold text-slate-900 truncate">
                {gitCmd}
              </span>
            </div>

            <LiquidGlass
              mode={settings.mode}
              displacementScale={25}
              blurAmount={settings.blurAmount}
              saturation={settings.saturation}
              aberrationIntensity={settings.aberrationIntensity}
              elasticity={0.3}
              cornerRadius={999}
              overLight={settings.overLight}
              padding="6px 14px"
              onClick={handleCopy}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </div>
            </LiquidGlass>
          </div>
        </LiquidGlass>
      </div>
    </section>
  )
}
