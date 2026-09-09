"use client"

import React, { useRef } from "react"
import { Github, Download, Globe } from "lucide-react"
import LiquidGlass from "./LiquidGlass"
import { type TuningSettings } from "./LiquidGlass/TuningDock"

interface NavbarProps {
  lang: "en" | "zh"
  onToggleLang: () => void
  dict: any
  accentColor: string
  settings: TuningSettings
}

export default function Navbar({ lang, onToggleLang, dict, accentColor, settings }: NavbarProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""
  const navContainerRef = useRef<HTMLDivElement>(null)

  return (
    <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-4 pt-4 pb-2 pointer-events-none">
      <div ref={navContainerRef} className="pointer-events-auto">
        <LiquidGlass
          mode={settings.mode}
          displacementScale={settings.displacementScale * 0.5}
          blurAmount={settings.blurAmount}
          saturation={settings.saturation}
          aberrationIntensity={settings.aberrationIntensity}
          elasticity={0.15}
          cornerRadius={999}
          overLight={settings.overLight}
          padding="6px 14px"
          mouseContainer={navContainerRef}
        >
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* Brand Logo & Version Pill */}
            <a href="#" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm p-0.5 bg-white/60 border border-white/80">
                <img
                  src={`${basePath}/icons/icon48.png`}
                  alt="HoldTranslate Logo"
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none"
                  }}
                />
              </div>
              <span
                className={`font-bold tracking-tight text-sm sm:text-base flex items-center gap-1.5 ${
                  settings.overLight ? "text-slate-900" : "text-white"
                }`}
              >
                {dict.nav.brand}
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold shadow-xs"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    color: accentColor,
                    border: `1px solid ${accentColor}40`,
                  }}
                >
                  {dict.nav.version}
                </span>
              </span>
            </a>

            {/* Navigation Links */}
            <div
              className={`hidden md:flex items-center gap-5 text-xs sm:text-sm font-semibold ${
                settings.overLight ? "text-slate-700" : "text-slate-200"
              }`}
            >
              <a href="#demo" className="hover:text-blue-600 transition-colors">
                {dict.nav.demo}
              </a>
              <a href="#features" className="hover:text-blue-600 transition-colors">
                {dict.nav.features}
              </a>
              <a href="#subtitles" className="hover:text-blue-600 transition-colors">
                {dict.nav.subtitles}
              </a>
              <a href="#install" className="hover:text-blue-600 transition-colors">
                {dict.nav.install}
              </a>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Language Switcher Button */}
              <LiquidGlass
                mode={settings.mode}
                displacementScale={30}
                blurAmount={settings.blurAmount}
                saturation={settings.saturation}
                aberrationIntensity={settings.aberrationIntensity}
                elasticity={0.3}
                cornerRadius={999}
                overLight={settings.overLight}
                padding="5px 12px"
                onClick={onToggleLang}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold select-none">
                  <Globe className="w-3.5 h-3.5 opacity-80" />
                  <span>{lang === "en" ? "中文" : "EN"}</span>
                </div>
              </LiquidGlass>

              {/* GitHub Link Button */}
              <LiquidGlass
                mode={settings.mode}
                displacementScale={30}
                blurAmount={settings.blurAmount}
                saturation={settings.saturation}
                aberrationIntensity={settings.aberrationIntensity}
                elasticity={0.3}
                cornerRadius={999}
                overLight={settings.overLight}
                padding="6px 8px"
                onClick={() => {
                  window.open("https://github.com/egggggod/HoldTranslate-web", "_blank")
                }}
              >
                <Github className="w-4 h-4" />
              </LiquidGlass>

              {/* Download Release Button */}
              <LiquidGlass
                mode={settings.mode}
                displacementScale={40}
                blurAmount={settings.blurAmount}
                saturation={settings.saturation}
                aberrationIntensity={settings.aberrationIntensity}
                elasticity={0.35}
                cornerRadius={999}
                overLight={false}
                padding="6px 14px"
                style={{
                  backgroundColor: accentColor,
                }}
                onClick={() => {
                  window.location.href =
                    "https://github.com/egggggod/HoldTranslate-plugin-for-chrome/releases/download/v1.7.0/holdtranslate-chrome-extension-v1.7.0.zip"
                }}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white select-none">
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{dict.nav.download}</span>
                </div>
              </LiquidGlass>
            </div>
          </div>
        </LiquidGlass>
      </div>
    </header>
  )
}
