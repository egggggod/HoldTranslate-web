"use client"

import React, { useState } from "react"
import { Sparkles, Sun, Moon, Film, CheckCircle2 } from "lucide-react"

interface SubtitleShowcaseProps {
  dict: any
  accentColor: string
}

export default function SubtitleShowcase({ dict, accentColor }: SubtitleShowcaseProps) {
  const [selectedDemo, setSelectedDemo] = useState<"subtitles" | "light" | "dark">("subtitles")
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

  const demos = [
    {
      id: "subtitles",
      title: dict.showcase.cardSubTitle,
      desc: dict.showcase.cardSubDesc,
      icon: Film,
      src: `${basePath}/assets/demo-subtitles.png`,
      alt: dict.showcase.imgSubtitlesAlt,
    },
    {
      id: "light",
      title: dict.showcase.cardLightTitle,
      desc: dict.showcase.cardLightDesc,
      icon: Sun,
      src: `${basePath}/assets/demo-light.png`,
      alt: dict.showcase.imgLightAlt,
    },
    {
      id: "dark",
      title: dict.showcase.cardDarkTitle,
      desc: dict.showcase.cardDarkDesc,
      icon: Moon,
      src: `${basePath}/assets/demo-dark.png`,
      alt: dict.showcase.imgDarkAlt,
    },
  ]

  const activeDemoObj = demos.find((d) => d.id === selectedDemo) || demos[0]

  return (
    <section id="subtitles" className="py-20 px-4 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full crystal-panel text-xs font-semibold text-slate-300 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{dict.showcase.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          {dict.showcase.title}
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">{dict.showcase.desc}</p>
      </div>

      {/* Interactive Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {demos.map((d) => {
          const Icon = d.icon
          const isCurrent = d.id === selectedDemo
          return (
            <button
              key={d.id}
              onClick={() => setSelectedDemo(d.id as any)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                isCurrent
                  ? "bg-white/20 text-white border border-white/30 shadow-lg scale-105"
                  : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{d.title.split(" ")[1] || d.title}</span>
            </button>
          )
        })}
      </div>

      {/* Showcase Display Card */}
      <div className="crystal-panel rounded-3xl p-4 sm:p-8 border border-white/15 shadow-2xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Screenshot Display */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 shadow-2xl group">
            <img
              src={activeDemoObj.src}
              alt={activeDemoObj.alt}
              className="w-full h-auto max-h-[500px] object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
              onError={(e) => {
                // If local path is different during static generation
                (e.target as HTMLElement).style.opacity = "0.7"
              }}
            />
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
          </div>

          {/* Description Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                style={{
                  backgroundColor: `${accentColor}25`,
                  color: accentColor,
                }}
              >
                <activeDemoObj.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {activeDemoObj.title}
              </h3>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {activeDemoObj.desc}
            </p>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero visual clutter or bulky card obstruction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% computed font attribute preservation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Smooth collapse & restoration on secondary hold</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
