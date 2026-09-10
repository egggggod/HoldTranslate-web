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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/30 shadow-sm text-xs font-semibold text-white mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>{dict.showcase.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
          {dict.showcase.title}
        </h2>
        <p className="text-white/85 text-base sm:text-lg leading-relaxed font-medium drop-shadow-xs">
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
              overLight={settings.overLight}
              padding="10px 20px"
              onClick={() => setSelectedDemo(d.id as any)}
              mouseContainer={showcaseRef}
            >
              <div
                className={`flex items-center gap-2 text-xs sm:text-sm font-bold ${
                  isCurrent ? "text-white" : "text-white/75"
                }`}
              >
                {isCurrent && (
                  <span
                    className="w-2 h-2 rounded-full animate-pulse shadow-sm"
                    style={{ backgroundColor: accentColor }}
                  />
                )}
                <Icon className={`w-4 h-4 ${isCurrent ? "text-blue-300" : ""}`} />
                <span>{d.title.split(" ")[1] || d.title}</span>
              </div>
            </LiquidGlass>
          )
        })}
      </div>

      {/* Showcase Display as LiquidGlass Card */}
      <LiquidGlass
        mode={settings.mode}
        displacementScale={settings.displacementScale * 0.85}
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
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden border border-white/25 bg-white/5 shadow-inner group">
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
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md border border-white/40"
                style={{
                  backgroundColor: `${accentColor}25`,
                  color: accentColor,
                }}
              >
                <activeDemoObj.icon className="w-5 h-5 text-blue-300" />
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {activeDemoObj.title}
              </h3>
            </div>

            <p className="text-white/85 text-sm sm:text-base leading-relaxed font-medium">
              {activeDemoObj.desc}
            </p>

            <div className="space-y-3 pt-4 border-t border-white/10 text-xs sm:text-sm text-white/90 font-semibold">
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
      </LiquidGlass>
    </section>
  )
}
