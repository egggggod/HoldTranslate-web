"use client"

import React, { useState, useRef } from "react"
import { Sparkles, Sun, Moon, Film, CheckCircle2 } from "lucide-react"
import LiquidGlass from "./LiquidGlass"
import { type TuningSettings } from "./LiquidGlass/TuningDock"

interface SubtitleShowcaseProps {
  dict: any
  accentColor: string
  settings: TuningSettings
}

export default function SubtitleShowcase({ dict, accentColor, settings }: SubtitleShowcaseProps) {
  const [selectedDemo, setSelectedDemo] = useState<"subtitles" | "light" | "dark">("subtitles")
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const showcaseRef = useRef<HTMLDivElement>(null)

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
    <section id="subtitles" className="py-20 px-4 max-w-7xl mx-auto select-none" ref={showcaseRef}>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-sm text-xs font-semibold text-slate-800 mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
          <span>{dict.showcase.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
          {dict.showcase.title}
        </h2>
        <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
          {dict.showcase.desc}
        </p>
      </div>

      {/* Tabs as LiquidGlass Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {demos.map((d) => {
          const Icon = d.icon
          const isCurrent = d.id === selectedDemo
          return (
            <LiquidGlass
              key={d.id}
              mode={settings.mode}
              displacementScale={35}
              blurAmount={settings.blurAmount}
              saturation={settings.saturation}
              aberrationIntensity={settings.aberrationIntensity}
              elasticity={0.3}
              cornerRadius={999}
              overLight={isCurrent ? false : settings.overLight}
              padding="10px 20px"
              style={isCurrent ? { backgroundColor: accentColor } : {}}
              onClick={() => setSelectedDemo(d.id as any)}
              mouseContainer={showcaseRef}
            >
              <div
                className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${
                  isCurrent ? "text-white" : "text-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{d.title.split(" ")[1] || d.title}</span>
              </div>
            </LiquidGlass>
          )
        })}
      </div>

      {/* Showcase Display as LiquidGlass Card */}
      <LiquidGlass
        mode={settings.mode}
        displacementScale={settings.displacementScale * 0.7}
        blurAmount={settings.blurAmount}
        saturation={settings.saturation}
        aberrationIntensity={settings.aberrationIntensity}
        elasticity={0.12}
        cornerRadius={settings.cornerRadius}
        overLight={settings.overLight}
        padding="24px"
        className="w-full"
        mouseContainer={showcaseRef}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Screenshot Display */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-black/10 bg-black/5 shadow-inner group">
            <img
              src={activeDemoObj.src}
              alt={activeDemoObj.alt}
              className="w-full h-auto max-h-[500px] object-contain rounded-xl transition-transform duration-500 group-hover:scale-[1.01]"
              onError={(e) => {
                (e.target as HTMLElement).style.opacity = "0.7"
              }}
            />
          </div>

          {/* Description Column */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-left">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md border border-white/60"
                style={{
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                }}
              >
                <activeDemoObj.icon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {activeDemoObj.title}
              </h3>
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
              {activeDemoObj.desc}
            </p>

            <div className="space-y-3 pt-4 border-t border-black/10 text-xs sm:text-sm text-slate-800 font-semibold">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero visual clutter or bulky card obstruction</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% computed font attribute preservation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Smooth collapse & restoration on secondary hold</span>
              </div>
            </div>
          </div>
        </div>
      </LiquidGlass>
    </section>
  )
}
