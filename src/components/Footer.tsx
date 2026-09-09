"use client"

import React, { useRef } from "react"
import { Github, Globe, Sparkles } from "lucide-react"
import LiquidGlass from "./LiquidGlass"
import { type TuningSettings } from "./LiquidGlass/TuningDock"

interface FooterProps {
  dict: any
  lang: "en" | "zh"
  onToggleLang: () => void
  accentColor: string
  settings: TuningSettings
}

export default function Footer({ dict, lang, onToggleLang, accentColor, settings }: FooterProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const footerRef = useRef<HTMLDivElement>(null)

  return (
    <footer ref={footerRef} className="relative mt-20 border-t border-white/10 bg-black/25 backdrop-blur-2xl py-14 px-4 text-white/80 text-sm select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        {/* Brand & Slogan */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="flex items-center gap-2.5">
            <img
              src={`${basePath}/icons/icon48.png`}
              alt="HoldTranslate"
              className="w-7 h-7 rounded-full shadow-xs"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none"
              }}
            />
            <span className="text-lg font-extrabold text-white tracking-tight">HoldTranslate</span>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/15">
              v1.7.0
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/70 font-medium max-w-sm">{dict.footer.slogan}</p>
          <p className="text-[11px] text-white/50">{dict.footer.releaseNotice}</p>
        </div>

        {/* Links as LiquidGlass Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
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
              window.open("https://github.com/egggggod/HoldTranslate-web", "_blank")
            }}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Github className="w-3.5 h-3.5 text-blue-300" />
              <span>{dict.footer.sourceCode}</span>
            </div>
          </LiquidGlass>

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
              window.open("https://github.com/egggggod/HoldTranslate-plugin-for-chrome/releases", "_blank")
            }}
          >
            <span className="text-xs font-bold text-white">{dict.footer.releases}</span>
          </LiquidGlass>

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
              window.open("https://github.com/egggggod/HoldTranslate-plugin-for-chrome/issues", "_blank")
            }}
          >
            <span className="text-xs font-bold text-white">{dict.footer.issues}</span>
          </LiquidGlass>

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
            onClick={onToggleLang}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Globe className="w-3.5 h-3.5 text-blue-300" />
              <span>{lang === "en" ? "简体中文" : "English"}</span>
            </div>
          </LiquidGlass>
        </div>
      </div>

      {/* Acknowledgments & Copyright */}
      <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60 font-medium">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
          <span>{dict.footer.acknowledgments}</span>
        </div>
        <div>
          <span>{dict.footer.copyright}</span>
        </div>
      </div>
    </footer>
  )
}
