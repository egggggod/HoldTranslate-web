"use client"

import React, { useRef } from "react"
import { Zap, Target, Maximize2, Smartphone, CheckCircle2, Palette, Sparkles, ArrowUpRight } from "lucide-react"
import LiquidGlass from "./LiquidGlass"
import { type TuningSettings } from "./LiquidGlass/TuningDock"

interface FeatureGridProps {
  dict: any
  accentColor: string
  settings: TuningSettings
}

export default function FeatureGrid({ dict, accentColor, settings }: FeatureGridProps) {
  const gridContainerRef = useRef<HTMLDivElement>(null)

  const features = [
    {
      icon: Zap,
      title: dict.features.f1Title,
      desc: dict.features.f1Desc,
      tag: "Engine",
      color: "#d97706",
      actionText: "0ms Pipeline",
    },
    {
      icon: Target,
      title: dict.features.f2Title,
      desc: dict.features.f2Desc,
      tag: "Typography",
      color: "#2563eb",
      actionText: "1:1 Inspector",
    },
    {
      icon: Maximize2,
      title: dict.features.f3Title,
      desc: dict.features.f3Desc,
      tag: "Architecture",
      color: "#059669",
      actionText: "Zero-Cutout",
    },
    {
      icon: Smartphone,
      title: dict.features.f4Title,
      desc: dict.features.f4Desc,
      tag: "Interface",
      color: "#7c3aed",
      actionText: "225px Lock",
    },
    {
      icon: CheckCircle2,
      title: dict.features.f5Title,
      desc: dict.features.f5Desc,
      tag: "Interaction",
      color: "#0891b2",
      actionText: "120ms Haptic",
    },
    {
      icon: Palette,
      title: dict.features.f6Title,
      desc: dict.features.f6Desc,
      tag: "Theming",
      color: "#e11d48",
      actionText: "Full Sync",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 max-w-7xl mx-auto select-none" ref={gridContainerRef}>
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 border border-white/20 shadow-sm text-xs font-semibold text-white mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>{dict.features.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
          {dict.features.title}
        </h2>
        <p className="text-white/85 text-base sm:text-lg leading-relaxed font-medium drop-shadow-xs">
          {dict.features.desc}
        </p>
      </div>

      {/* Bento Grid: 6 LiquidGlass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <LiquidGlass
              key={i}
              mode={settings.mode}
              displacementScale={settings.displacementScale * 0.65}
              blurAmount={settings.blurAmount}
              saturation={settings.saturation}
              aberrationIntensity={settings.aberrationIntensity}
              elasticity={0.18}
              cornerRadius={settings.cornerRadius}
              overLight={settings.overLight}
              padding="28px"
              className="w-full h-full"
              mouseContainer={gridContainerRef}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md border border-white/40"
                      style={{
                        backgroundColor: `${f.color}25`,
                        color: f.color,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/20 text-white/80 border border-white/10">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-white/80 text-sm leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-white/10 flex items-center justify-between">
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
                    onClick={() => {
                      const el = document.getElementById("demo")
                      if (el) el.scrollIntoView({ behavior: "smooth" })
                    }}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                      <span>{f.actionText}</span>
                      <ArrowUpRight className="w-3 h-3 text-blue-300" />
                    </div>
                  </LiquidGlass>

                  <div
                    className="h-1.5 w-10 rounded-full"
                    style={{ backgroundColor: f.color }}
                  />
                </div>
              </div>
            </LiquidGlass>
          )
        })}
      </div>
    </section>
  )
}
