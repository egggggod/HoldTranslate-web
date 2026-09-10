"use client"

import React, { useState, useEffect } from "react"
import Head from "next/head"
import dynamic from "next/dynamic"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import InteractiveDemo from "@/components/InteractiveDemo"
import FeatureGrid from "@/components/FeatureGrid"
import SubtitleShowcase from "@/components/SubtitleShowcase"
import QuickInstall from "@/components/QuickInstall"
import Footer from "@/components/Footer"
import TuningDock, { DEFAULT_SETTINGS, WALLPAPERS, type TuningSettings } from "@/components/LiquidGlass/TuningDock"
import { StudioProvider } from "@/components/LiquidGlassStudio/StudioContext"
import { en } from "@/locales/en"
import { zh } from "@/locales/zh"

const StudioCanvas = dynamic(() => import("@/components/LiquidGlassStudio/StudioCanvas"), {
  ssr: false,
})

export default function Home() {
  const [lang, setLang] = useState<"en" | "zh">("zh")
  const [accentColor, setAccentColor] = useState<string>("#2563eb")
  const [settings, setSettings] = useState<TuningSettings>(DEFAULT_SETTINGS)

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const isEnglish = navigator.language.toLowerCase().startsWith("en")
      if (isEnglish) {
        setLang("en")
      }
    }
  }, [])

  const dict = lang === "zh" ? zh : en

  const toggleLang = () => {
    setLang((prev) => (prev === "zh" ? "en" : "zh"))
  }

  const pageTitle =
    lang === "zh"
      ? "HoldTranslate — 沉浸式长按即时网页翻译与优雅复原 · 专为 Google Chrome 打造"
      : "HoldTranslate — Immersive Long-Press Instant Web Translation & Restoration for Chrome"

  const activeWallpaper = WALLPAPERS[settings.wallpaperIndex]?.url || WALLPAPERS[0].url

  return (
    <StudioProvider>
      <Head>
        <title>{pageTitle}</title>
        <meta
          name="description"
          content={
            lang === "zh"
              ? "HoldTranslate 是专为纯粹阅读打造的 Chrome 扩展，长按 500ms 即时呈现双语字幕，零视觉干扰，100% 镜像原生网页排版。"
              : "HoldTranslate is an Apple Liquid Glass styled Chrome extension for immersive long-press instant web and YouTube subtitle translation."
          }
        />
        <meta property="og:title" content={pageTitle} />
        <meta
          property="og:description"
          content="Apple's Liquid Glass effect meets Chrome web translation. Zero popup balloons, zero visual clutter."
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div
        className="min-h-screen text-white selection:bg-blue-600 selection:text-white relative overflow-hidden transition-colors duration-500"
        style={
          {
            "--accent-color": accentColor,
            "--accent-glow": `${accentColor}30`,
          } as React.CSSProperties
        }
      >
        {/* Fullscreen WebGL2 Liquid Glass Studio Renderer */}
        {settings.mode === "studio" && (
          <StudioCanvas wallpaperUrl={activeWallpaper} settings={settings} />
        )}

        {/* High-Resolution Scenic Landscape Background (shown in fallback/non-studio modes) */}
        <div
          className={`fixed inset-0 pointer-events-none -z-20 overflow-hidden transition-opacity duration-700 ${
            settings.mode === "studio" ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            src={activeWallpaper}
            alt="Scenic Background"
            className="w-full h-full object-cover transition-all duration-700 filter brightness-[1.03] contrast-[1.04]"
            style={{
              objectPosition: "center 56%",
              transform: "scale(1.18)",
              transformOrigin: "center center",
            }}
          />
          {/* Subtle contrast overlay for optimal optical glass refraction */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
              settings.overLight ? "bg-black/15" : "bg-transparent"
            }`}
          />
        </div>

        {/* Top Floating Island Navbar */}
        <Navbar
          lang={lang}
          onToggleLang={toggleLang}
          dict={dict}
          accentColor={accentColor}
          settings={settings}
        />

        {/* Hero Section */}
        <Hero dict={dict} accentColor={accentColor} settings={settings} />

        {/* Interactive Long-Press Simulator & Liquid Glass Control Island */}
        <InteractiveDemo
          dict={dict}
          accentColor={accentColor}
          onSelectColor={setAccentColor}
          settings={settings}
          onUpdateSettings={setSettings}
        />

        {/* Six Architectural Pillars Feature Grid */}
        <FeatureGrid dict={dict} accentColor={accentColor} settings={settings} />

        {/* YouTube Subtitles Showcase */}
        <SubtitleShowcase dict={dict} accentColor={accentColor} settings={settings} />

        {/* Quick Install Guide */}
        <QuickInstall dict={dict} accentColor={accentColor} settings={settings} />

        {/* Standard Thinking-Claude Footer */}
        <Footer
          dict={dict}
          lang={lang}
          onToggleLang={toggleLang}
          accentColor={accentColor}
          settings={settings}
        />

        {/* Floating Liquid Glass Optical Lab Tuning Dock */}
        <TuningDock
          settings={settings}
          onChange={setSettings}
          accentColor={accentColor}
        />
      </div>
    </StudioProvider>
  )
}
