"use client"

import React, { useState, useEffect } from "react"
import Head from "next/head"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import InteractiveDemo from "@/components/InteractiveDemo"
import FeatureGrid from "@/components/FeatureGrid"
import SubtitleShowcase from "@/components/SubtitleShowcase"
import QuickInstall from "@/components/QuickInstall"
import Footer from "@/components/Footer"
import { en } from "@/locales/en"
import { zh } from "@/locales/zh"

export default function Home() {
  const [lang, setLang] = useState<"en" | "zh">("zh")
  const [accentColor, setAccentColor] = useState<string>("#3b82f6")

  useEffect(() => {
    // Detect browser default language on mount
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

  return (
    <>
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
        className="min-h-screen bg-[#060913] text-slate-100 selection:bg-blue-500 selection:text-white relative overflow-hidden"
        style={
          {
            "--accent-color": accentColor,
            "--accent-glow": `${accentColor}40`,
          } as React.CSSProperties
        }
      >
        {/* Top Navbar */}
        <Navbar
          lang={lang}
          onToggleLang={toggleLang}
          dict={dict}
          accentColor={accentColor}
        />

        {/* Hero Section */}
        <Hero dict={dict} accentColor={accentColor} />

        {/* Interactive Long-Press Simulator & Liquid Glass Island */}
        <InteractiveDemo
          dict={dict}
          accentColor={accentColor}
          onSelectColor={setAccentColor}
        />

        {/* Six Architectural Pillars Feature Grid */}
        <FeatureGrid dict={dict} accentColor={accentColor} />

        {/* YouTube Subtitles Showcase */}
        <SubtitleShowcase dict={dict} accentColor={accentColor} />

        {/* Quick Install Guide */}
        <QuickInstall dict={dict} accentColor={accentColor} />

        {/* Standard Thinking-Claude Footer */}
        <Footer
          dict={dict}
          lang={lang}
          onToggleLang={toggleLang}
          accentColor={accentColor}
        />
      </div>
    </>
  )
}
