"use client"

import React from "react"
import { Zap, Target, Maximize2, Smartphone, CheckCircle2, Palette, Sparkles } from "lucide-react"

interface FeatureGridProps {
  dict: any
  accentColor: string
}

export default function FeatureGrid({ dict, accentColor }: FeatureGridProps) {
  const features = [
    {
      icon: Zap,
      title: dict.features.f1Title,
      desc: dict.features.f1Desc,
      tag: "Engine",
      color: "#f59e0b",
    },
    {
      icon: Target,
      title: dict.features.f2Title,
      desc: dict.features.f2Desc,
      tag: "Typography",
      color: "#3b82f6",
    },
    {
      icon: Maximize2,
      title: dict.features.f3Title,
      desc: dict.features.f3Desc,
      tag: "Architecture",
      color: "#10b981",
    },
    {
      icon: Smartphone,
      title: dict.features.f4Title,
      desc: dict.features.f4Desc,
      tag: "Interface",
      color: "#8b5cf6",
    },
    {
      icon: CheckCircle2,
      title: dict.features.f5Title,
      desc: dict.features.f5Desc,
      tag: "Interaction",
      color: "#06b6d4",
    },
    {
      icon: Palette,
      title: dict.features.f6Title,
      desc: dict.features.f6Desc,
      tag: "Theming",
      color: "#f43f5e",
    },
  ]

  return (
    <section id="features" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full crystal-panel text-xs font-semibold text-slate-300 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>{dict.features.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          {dict.features.title}
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">{dict.features.desc}</p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <div
              key={i}
              className="relative p-7 rounded-3xl crystal-panel crystal-card-hover flex flex-col justify-between overflow-hidden group"
              style={{
                "--accent-glow": `${f.color}25`,
              } as any}
            >
              {/* Background gradient hint on hover */}
              <div
                className="absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none -z-10"
                style={{ backgroundColor: f.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/10"
                    style={{
                      backgroundColor: `${f.color}20`,
                      color: f.color,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400">
                    {f.tag}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">{f.desc}</p>
              </div>

              {/* Bottom accent glow bar */}
              <div
                className="mt-6 h-1 w-12 rounded-full opacity-40 group-hover:w-full group-hover:opacity-100 transition-all duration-300"
                style={{ backgroundColor: f.color }}
              />
            </div>
          )
        })}
      </div>
    </section>
  )
}
