"use client"

import React, { useRef } from "react"
import { Download, Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from "lucide-react"
import LiquidGlass from "./LiquidGlass"
import { type TuningSettings } from "./LiquidGlass/TuningDock"

interface HeroProps {
  dict: any
  accentColor: string
  settings: TuningSettings
}

export default function Hero({ dict, accentColor, settings }: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  return (
    <section
      ref={heroRef}
      className="relative min-h-[92vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 text-center select-none"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Apple VisionOS Liquid Glass Top Pill Badge */}
        <div className="mb-6">
          <LiquidGlass
            mode={settings.mode}
            displacementScale={settings.displacementScale * 0.5}
            blurAmount={settings.blurAmount}
            saturation={settings.saturation}
            aberrationIntensity={settings.aberrationIntensity}
            elasticity={0.2}
            cornerRadius={999}
            overLight={settings.overLight}
            padding="6px 18px"
            mouseContainer={heroRef}
          >
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-white">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span>{dict.hero.badge}</span>
            </div>
          </LiquidGlass>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-md leading-[1.12] mb-6">
          {dict.hero.title}
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${accentColor} 0%, #a78bfa 50%, #f472b6 100%)`,
            }}
          >
            {dict.hero.titleHighlight}
          </span>
        </h1>

        {/* Hero Tagline */}
        <p className="max-w-2xl text-base sm:text-lg text-white/90 font-medium leading-relaxed mb-10 text-balance drop-shadow-md">
          {dict.hero.tagline}
        </p>

        {/* Action Buttons as LiquidGlass */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14">
          <LiquidGlass
            mode={settings.mode}
            displacementScale={settings.displacementScale}
            blurAmount={settings.blurAmount}
            saturation={settings.saturation}
            aberrationIntensity={settings.aberrationIntensity}
            elasticity={settings.elasticity}
            cornerRadius={999}
            overLight={settings.overLight}
            padding="14px 32px"
            onClick={() => {
              window.location.href =
                "https://github.com/egggggod/HoldTranslate-plugin-for-chrome/releases/download/v1.7.0/holdtranslate-chrome-extension-v1.7.0.zip"
            }}
            mouseContainer={heroRef}
          >
            <div className="flex items-center gap-2.5 text-sm sm:text-base font-bold text-white">
              <Download className="w-5 h-5 text-blue-300" />
              <span>{dict.hero.downloadCta}</span>
            </div>
          </LiquidGlass>

          <LiquidGlass
            mode={settings.mode}
            displacementScale={settings.displacementScale * 0.95}
            blurAmount={settings.blurAmount}
            saturation={settings.saturation}
            aberrationIntensity={settings.aberrationIntensity}
            elasticity={settings.elasticity}
            cornerRadius={999}
            overLight={settings.overLight}
            padding="14px 28px"
            onClick={() => {
              const el = document.getElementById("demo")
              if (el) el.scrollIntoView({ behavior: "smooth" })
            }}
            mouseContainer={heroRef}
          >
            <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-white">
              <span>{dict.hero.demoCta}</span>
              <ArrowRight className="w-4 h-4 text-blue-300" />
            </div>
          </LiquidGlass>
        </div>

        {/* 3 Metric Cards as LiquidGlass Cards */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <LiquidGlass
            mode={settings.mode}
            displacementScale={settings.displacementScale * 0.75}
            blurAmount={settings.blurAmount}
            saturation={settings.saturation}
            aberrationIntensity={settings.aberrationIntensity}
            elasticity={0.15}
            cornerRadius={18}
            overLight={settings.overLight}
            padding="10px 18px"
            mouseContainer={heroRef}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{dict.hero.manifestBadge}</span>
            </div>
          </LiquidGlass>

          <LiquidGlass
            mode={settings.mode}
            displacementScale={settings.displacementScale * 0.4}
            blurAmount={settings.blurAmount}
            saturation={settings.saturation}
            aberrationIntensity={settings.aberrationIntensity}
            elasticity={0.15}
            cornerRadius={18}
            overLight={settings.overLight}
            padding="10px 18px"
            mouseContainer={heroRef}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{dict.hero.speedBadge}</span>
            </div>
          </LiquidGlass>

          <LiquidGlass
            mode={settings.mode}
            displacementScale={settings.displacementScale * 0.4}
            blurAmount={settings.blurAmount}
            saturation={settings.saturation}
            aberrationIntensity={settings.aberrationIntensity}
            elasticity={0.15}
            cornerRadius={18}
            overLight={settings.overLight}
            padding="10px 18px"
            mouseContainer={heroRef}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>{dict.hero.licenseBadge}</span>
            </div>
          </LiquidGlass>
        </div>
      </div>
    </section>
  )
}
