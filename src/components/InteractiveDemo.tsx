"use client"

import React, { useState, useRef, useEffect, useCallback } from "react"
import LiquidGlass from "./LiquidGlass"
import {
  Sparkles,
  MousePointerClick,
  Check,
  RotateCcw,
  Sliders,
  Tv,
  Globe2,
  Cpu,
  Bookmark,
  Play,
  Volume2,
  Maximize,
} from "lucide-react"

interface InteractiveDemoProps {
  dict: any
  accentColor: string
  onSelectColor: (color: string) => void
}

const PALETTE = [
  { name: "Azure Blue", hex: "#3b82f6" },
  { name: "Aurora Emerald", hex: "#10b981" },
  { name: "Amethyst Purple", hex: "#8b5cf6" },
  { name: "Sunset Rose", hex: "#f43f5e" },
  { name: "Cyber Amber", hex: "#f59e0b" },
  { name: "Titanium Cyan", hex: "#06b6d4" },
]

export default function InteractiveDemo({ dict, accentColor, onSelectColor }: InteractiveDemoProps) {
  const [activeTab, setActiveTab] = useState<"tech" | "video" | "paper">("tech")
  const [activeEngine, setActiveEngine] = useState<"google" | "bing" | "deepseek" | "custom">("google")
  const [subtitleMode, setSubtitleMode] = useState<"bilingual" | "target">("bilingual")
  const [triggerDuration, setTriggerDuration] = useState(500)
  const [glassMode, setGlassMode] = useState<"standard" | "polar" | "prominent" | "shader">("standard")

  // Translation States for simulated blocks
  const [translatedTech, setTranslatedTech] = useState(false)
  const [translatedVideoTitle, setTranslatedVideoTitle] = useState(false)
  const [translatedVideoDesc, setTranslatedVideoDesc] = useState(false)
  const [translatedPaper, setTranslatedPaper] = useState(false)

  // Long-press progress state
  const [holdingId, setHoldingId] = useState<string | null>(null)
  const [holdProgress, setHoldProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseDown = (id: string, toggleAction: () => void) => {
    setHoldingId(id)
    setHoldProgress(0)

    const step = 20
    let elapsed = 0
    progressIntervalRef.current = setInterval(() => {
      elapsed += step
      setHoldProgress(Math.min(100, (elapsed / triggerDuration) * 100))
    }, step)

    timerRef.current = setTimeout(() => {
      toggleAction()
      cancelHold()
    }, triggerDuration)
  }

  const cancelHold = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    timerRef.current = null
    progressIntervalRef.current = null
    setHoldingId(null)
    setHoldProgress(0)
  }, [])

  const resetAll = () => {
    setTranslatedTech(false)
    setTranslatedVideoTitle(false)
    setTranslatedVideoDesc(false)
    setTranslatedPaper(false)
  }

  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="demo" className="py-20 px-4 max-w-7xl mx-auto" ref={containerRef}>
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full crystal-panel text-xs font-semibold text-slate-300 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>{dict.demo.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          {dict.demo.title}
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">{dict.demo.desc}</p>
      </div>

      {/* Main Grid: Sandbox Window + Floating Settings Island */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left / Upper: Browser Mock Simulator (7 cols) */}
        <div className="lg:col-span-7 flex flex-col rounded-3xl crystal-panel overflow-hidden border border-white/15 shadow-2xl">
          {/* Mock Browser Titlebar */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Address Bar */}
            <div className="flex-1 max-w-md mx-4 px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-xs font-mono text-slate-400 text-center truncate">
              {activeTab === "tech" && "https://tech-times.org/ai-fluid-interfaces"}
              {activeTab === "video" && "https://www.youtube.com/watch?v=ht-timedtext"}
              {activeTab === "paper" && "https://arxiv.org/abs/2609.12345v1"}
            </div>

            <button
              onClick={resetAll}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              title={dict.demo.testReset}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 p-2 bg-slate-950/40 border-b border-white/5 overflow-x-auto">
            <button
              onClick={() => setActiveTab("tech")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "tech"
                  ? "bg-white/15 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>{dict.demo.tabTech}</span>
            </button>
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "video"
                  ? "bg-white/15 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>{dict.demo.tabVideo}</span>
            </button>
            <button
              onClick={() => setActiveTab("paper")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === "paper"
                  ? "bg-white/15 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{dict.demo.tabPaper}</span>
            </button>
          </div>

          {/* Interactive Web Sandbox Content */}
          <div className="p-6 sm:p-8 min-h-[380px] bg-gradient-to-b from-slate-900/40 to-slate-950/80 flex flex-col justify-center select-none relative">
            {/* Instruction Tip */}
            <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
              <MousePointerClick className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>{dict.demo.hint}</span>
            </div>

            {/* TAB 1: Tech News Article */}
            {activeTab === "tech" && (
              <div className="space-y-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {dict.demo.techTitle}
                </h3>

                <div
                  onMouseDown={() =>
                    handleMouseDown("tech-p", () => setTranslatedTech((prev) => !prev))
                  }
                  onMouseUp={cancelHold}
                  onMouseLeave={cancelHold}
                  className="relative p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 active:scale-[0.99] border border-transparent hover:border-white/10"
                >
                  {/* Long-press progress ring overlay */}
                  {holdingId === "tech-p" && (
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/90 border border-white/20 text-[10px] font-mono text-cyan-300">
                      <span>{Math.round(holdProgress)}%</span>
                      <div
                        className="w-2.5 h-2.5 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"
                        style={{ borderColor: accentColor }}
                      />
                    </div>
                  )}

                  <p className="text-base text-slate-200 leading-relaxed">
                    {dict.demo.techOriginal}
                  </p>

                  {/* Translated Subtitle Drawer */}
                  {translatedTech && (
                    <div
                      className="mt-3 pt-3 border-t transition-all duration-300 rounded-xl px-3 py-2"
                      style={{
                        backgroundColor: `${accentColor}12`,
                        borderColor: `${accentColor}30`,
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: `${accentColor}25`,
                            color: accentColor,
                          }}
                        >
                          {activeEngine === "google" && "Google Translate"}
                          {activeEngine === "bing" && "Microsoft Translator"}
                          {activeEngine === "deepseek" && "DeepSeek Chat"}
                          {activeEngine === "custom" && "Custom OpenAI"}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">0ms instant</span>
                      </div>
                      <p
                        className="text-base leading-relaxed font-medium"
                        style={{ color: accentColor }}
                      >
                        {dict.demo.techTranslated}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: YouTube Video Card */}
            {activeTab === "video" && (
              <div className="space-y-4">
                {/* Mock Video Player Screen */}
                <div className="relative aspect-video rounded-2xl bg-black overflow-hidden border border-white/10 shadow-lg flex flex-col justify-end p-4 group">
                  <img
                    src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
                    alt="Video thumbnail"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Simulated YouTube Subtitles Overlay */}
                  <div className="relative z-10 text-center mb-2">
                    <div className="inline-block bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-sm sm:text-base font-semibold text-white">
                      {subtitleMode === "bilingual" && (
                        <div>Chrome MV3 Predictive Subtitle Synchronization</div>
                      )}
                      <div className="font-bold text-cyan-300" style={{ color: accentColor }}>
                        Chrome MV3 预测性双语字幕同步预加载渲染
                      </div>
                    </div>
                  </div>

                  {/* Video Controls bar */}
                  <div className="relative z-10 flex items-center justify-between text-white/80 text-xs pt-2 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <Play className="w-4 h-4 fill-white text-white" />
                      <Volume2 className="w-4 h-4" />
                      <span className="font-mono">08:42 / 24:15</span>
                    </div>
                    <Maximize className="w-4 h-4" />
                  </div>
                </div>

                {/* Long-press video title */}
                <div
                  onMouseDown={() =>
                    handleMouseDown("video-title", () =>
                      setTranslatedVideoTitle((prev) => !prev),
                    )
                  }
                  onMouseUp={cancelHold}
                  onMouseLeave={cancelHold}
                  className="p-3 rounded-2xl transition-all cursor-pointer hover:bg-white/5 active:scale-[0.99] border border-transparent hover:border-white/10"
                >
                  <span className="text-xs font-semibold text-cyan-400 block mb-1">
                    {dict.demo.videoTag}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {dict.demo.videoTitleOriginal}
                  </h4>

                  {translatedVideoTitle && (
                    <div
                      className="mt-2 pt-2 border-t text-sm font-semibold"
                      style={{ color: accentColor, borderColor: `${accentColor}30` }}
                    >
                      {dict.demo.videoTitleTranslated}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: Academic Research Paper */}
            {activeTab === "paper" && (
              <div className="space-y-6">
                <div className="border-b border-white/10 pb-3">
                  <span className="text-[11px] font-mono text-purple-400 uppercase tracking-wider block mb-1">
                    arXiv:2609.12345v1 [cs.HC]
                  </span>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                    {dict.demo.paperTitle}
                  </h3>
                </div>

                <div
                  onMouseDown={() =>
                    handleMouseDown("paper-p", () => setTranslatedPaper((prev) => !prev))
                  }
                  onMouseUp={cancelHold}
                  onMouseLeave={cancelHold}
                  className="p-4 rounded-2xl transition-all cursor-pointer hover:bg-white/5 active:scale-[0.99] border border-transparent hover:border-white/10"
                >
                  <p className="text-sm sm:text-base font-serif text-slate-300 leading-relaxed">
                    {dict.demo.paperOriginal}
                  </p>

                  {translatedPaper && (
                    <div
                      className="mt-3 pt-3 border-t transition-all rounded-xl px-3 py-2 font-serif text-sm sm:text-base leading-relaxed"
                      style={{
                        backgroundColor: `${accentColor}10`,
                        borderColor: `${accentColor}30`,
                        color: accentColor,
                      }}
                    >
                      {dict.demo.paperTranslated}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right / Lower: 1:1 Apple VisionOS Liquid Glass Settings Island (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <LiquidGlass
            mode={glassMode}
            displacementScale={45}
            blurAmount={0.2}
            saturation={160}
            elasticity={0.2}
            cornerRadius={28}
            className="w-full"
            padding="28px"
            mouseContainer={containerRef}
          >
            <div className="flex flex-col gap-5 text-left">
              {/* Island Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    {dict.demo.islandTitle}
                  </h3>
                  <p className="text-xs text-slate-400">{dict.demo.islandSubtitle}</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {dict.demo.readyStatus}
                </span>
              </div>

              {/* Translation Engine Selection */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  {dict.demo.engineLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "google", name: dict.demo.engineGoogle },
                    { id: "bing", name: dict.demo.engineBing },
                    { id: "deepseek", name: dict.demo.engineDeepSeek },
                    { id: "custom", name: dict.demo.engineCustom },
                  ].map((engine) => (
                    <button
                      key={engine.id}
                      onClick={() => setActiveEngine(engine.id as any)}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        activeEngine === engine.id
                          ? "bg-white/20 text-white shadow-sm border border-white/30"
                          : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5"
                      }`}
                    >
                      <span className="truncate">{engine.name}</span>
                      {activeEngine === engine.id && (
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subtitle Mode Segmented Control */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  {dict.demo.subtitlesLabel}
                </label>
                <div className="flex rounded-xl p-1 bg-black/30 border border-white/10">
                  <button
                    onClick={() => setSubtitleMode("bilingual")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      subtitleMode === "bilingual"
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {dict.demo.subBilingual}
                  </button>
                  <button
                    onClick={() => setSubtitleMode("target")}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      subtitleMode === "target"
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {dict.demo.subTargetOnly}
                  </button>
                </div>
              </div>

              {/* Color Palette Chips (Zero-Clipping Circular Picker) */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  {dict.demo.themeLabel}
                </label>
                <div className="flex items-center gap-3 p-2 rounded-2xl bg-black/20 border border-white/10">
                  {PALETTE.map((c) => {
                    const isSelected = accentColor.toLowerCase() === c.hex.toLowerCase()
                    return (
                      <button
                        key={c.hex}
                        onClick={() => onSelectColor(c.hex)}
                        title={c.name}
                        className={`w-7 h-7 rounded-full transition-all relative flex items-center justify-center ${
                          isSelected ? "scale-110" : "hover:scale-105 opacity-80 hover:opacity-100"
                        }`}
                        style={{
                          backgroundColor: c.hex,
                          boxShadow: isSelected
                            ? `0 0 0 2px #ffffff, 0 0 15px ${c.hex}`
                            : "none",
                        }}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Trigger Timing Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-300">
                    {dict.demo.triggerTimeLabel}
                  </span>
                  <span className="font-mono text-cyan-300" style={{ color: accentColor }}>
                    {triggerDuration}ms
                  </span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="800"
                  step="50"
                  value={triggerDuration}
                  onChange={(e) => setTriggerDuration(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Refraction Mode (Liquid Glass feature) */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                  Refraction Optical Mode
                </span>
                <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                  {(["standard", "polar", "prominent", "shader"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setGlassMode(m)}
                      className={`py-1 rounded-lg capitalize transition-all ${
                        glassMode === m
                          ? "bg-white/25 text-white font-medium"
                          : "bg-white/5 text-slate-400 hover:text-white"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </LiquidGlass>
        </div>
      </div>
    </section>
  )
}
