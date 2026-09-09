"use client"

import React, { useState, useRef, useCallback } from "react"
import LiquidGlass from "./LiquidGlass"
import { type TuningSettings } from "./LiquidGlass/TuningDock"
import {
  Sparkles,
  MousePointerClick,
  Check,
  RotateCcw,
  Sliders,
  Tv,
  Globe2,
  Bookmark,
  Play,
  Volume2,
  Maximize,
} from "lucide-react"

interface InteractiveDemoProps {
  dict: any
  accentColor: string
  onSelectColor: (color: string) => void
  settings: TuningSettings
  onUpdateSettings: (newSettings: TuningSettings) => void
}

const PALETTE = [
  { name: "Azure Blue", hex: "#2563eb" },
  { name: "Aurora Emerald", hex: "#059669" },
  { name: "Amethyst Purple", hex: "#7c3aed" },
  { name: "Sunset Rose", hex: "#e11d48" },
  { name: "Cyber Amber", hex: "#d97706" },
  { name: "Titanium Cyan", hex: "#0891b2" },
]

export default function InteractiveDemo({
  dict,
  accentColor,
  onSelectColor,
  settings,
  onUpdateSettings,
}: InteractiveDemoProps) {
  const [activeTab, setActiveTab] = useState<"tech" | "video" | "paper">("tech")
  const [activeEngine, setActiveEngine] = useState<"google" | "bing" | "deepseek" | "custom">("google")
  const [subtitleMode, setSubtitleMode] = useState<"bilingual" | "target">("bilingual")
  const [triggerDuration, setTriggerDuration] = useState(500)

  // Translation States
  const [translatedTech, setTranslatedTech] = useState(false)
  const [translatedVideoTitle, setTranslatedVideoTitle] = useState(false)
  const [translatedPaper, setTranslatedPaper] = useState(false)

  // Long-press state
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
    setTranslatedPaper(false)
  }

  const demoContainerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="demo" className="py-20 px-4 max-w-7xl mx-auto select-none" ref={demoContainerRef}>
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/20 border border-white/20 shadow-sm text-xs font-semibold text-white mb-4 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-blue-300" />
          <span>{dict.demo.badge}</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-md">
          {dict.demo.title}
        </h2>
        <p className="text-white/85 text-base sm:text-lg leading-relaxed font-medium drop-shadow-xs">
          {dict.demo.desc}
        </p>
      </div>

      {/* Main Layout: Browser Simulator Card (7 cols) + Control Island (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Browser Mock Card */}
        <div className="lg:col-span-7">
          <LiquidGlass
            mode={settings.mode}
            displacementScale={settings.displacementScale * 0.7}
            blurAmount={settings.blurAmount}
            saturation={settings.saturation}
            aberrationIntensity={settings.aberrationIntensity}
            elasticity={0.12}
            cornerRadius={settings.cornerRadius}
            overLight={settings.overLight}
            padding="0px"
            className="w-full"
            mouseContainer={demoContainerRef}
          >
            <div className="flex flex-col w-full overflow-hidden">
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/15 bg-white/10 backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-xs" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-xs" />
                </div>

                <div className="flex-1 max-w-xs sm:max-w-sm mx-4 px-3 py-1 rounded-full bg-black/20 border border-white/15 text-xs font-mono text-white/80 text-center truncate">
                  {activeTab === "tech" && "https://tech-times.org/ai-fluid-interfaces"}
                  {activeTab === "video" && "https://www.youtube.com/watch?v=ht-timedtext"}
                  {activeTab === "paper" && "https://arxiv.org/abs/2609.12345v1"}
                </div>

                <LiquidGlass
                  mode={settings.mode}
                  displacementScale={25}
                  blurAmount={settings.blurAmount}
                  saturation={settings.saturation}
                  aberrationIntensity={settings.aberrationIntensity}
                  elasticity={0.3}
                  cornerRadius={999}
                  overLight={settings.overLight}
                  padding="6px"
                  onClick={resetAll}
                >
                  <RotateCcw className="w-3.5 h-3.5 text-white/80" />
                </LiquidGlass>
              </div>

              {/* Tabs as LiquidGlass Buttons */}
              <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-black/10">
                <LiquidGlass
                  mode={settings.mode}
                  displacementScale={35}
                  blurAmount={settings.blurAmount}
                  saturation={settings.saturation}
                  aberrationIntensity={settings.aberrationIntensity}
                  elasticity={0.25}
                  cornerRadius={14}
                  overLight={settings.overLight}
                  padding="6px 14px"
                  onClick={() => setActiveTab("tech")}
                >
                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold ${
                      activeTab === "tech" ? "text-white" : "text-white/70"
                    }`}
                  >
                    <Globe2 className={`w-3.5 h-3.5 ${activeTab === "tech" ? "text-blue-300" : ""}`} />
                    <span>{dict.demo.tabTech}</span>
                    {activeTab === "tech" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse ml-0.5" />
                    )}
                  </div>
                </LiquidGlass>

                <LiquidGlass
                  mode={settings.mode}
                  displacementScale={35}
                  blurAmount={settings.blurAmount}
                  saturation={settings.saturation}
                  aberrationIntensity={settings.aberrationIntensity}
                  elasticity={0.25}
                  cornerRadius={14}
                  overLight={settings.overLight}
                  padding="6px 14px"
                  onClick={() => setActiveTab("video")}
                >
                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold ${
                      activeTab === "video" ? "text-white" : "text-white/70"
                    }`}
                  >
                    <Tv className={`w-3.5 h-3.5 ${activeTab === "video" ? "text-blue-300" : ""}`} />
                    <span>{dict.demo.tabVideo}</span>
                    {activeTab === "video" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse ml-0.5" />
                    )}
                  </div>
                </LiquidGlass>

                <LiquidGlass
                  mode={settings.mode}
                  displacementScale={35}
                  blurAmount={settings.blurAmount}
                  saturation={settings.saturation}
                  aberrationIntensity={settings.aberrationIntensity}
                  elasticity={0.25}
                  cornerRadius={14}
                  overLight={settings.overLight}
                  padding="6px 14px"
                  onClick={() => setActiveTab("paper")}
                >
                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold ${
                      activeTab === "paper" ? "text-white" : "text-white/70"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${activeTab === "paper" ? "text-blue-300" : ""}`} />
                    <span>{dict.demo.tabPaper}</span>
                    {activeTab === "paper" && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse ml-0.5" />
                    )}
                  </div>
                </LiquidGlass>
              </div>

              {/* Sandbox Inner Body */}
              <div className="p-6 sm:p-8 min-h-[380px] flex flex-col justify-center relative">
                {/* Hold Hint Badge */}
                <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[11px] font-bold text-blue-200 bg-blue-500/20 px-2.5 py-1 rounded-full border border-blue-400/40 shadow-xs backdrop-blur-xs">
                  <MousePointerClick className="w-3.5 h-3.5 animate-pulse" />
                  <span>{dict.demo.hint}</span>
                </div>

                {/* TAB 1: Tech Article */}
                {activeTab === "tech" && (
                  <div className="space-y-5">
                    <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                      {dict.demo.techTitle}
                    </h3>

                    <div
                      onMouseDown={() =>
                        handleMouseDown("tech-p", () => setTranslatedTech((prev) => !prev))
                      }
                      onMouseUp={cancelHold}
                      onMouseLeave={cancelHold}
                      className="relative p-5 rounded-2xl transition-all cursor-pointer bg-white/10 hover:bg-white/20 border border-white/25 shadow-md"
                    >
                      {holdingId === "tech-p" && (
                        <div className="absolute top-2 right-2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 text-white text-[11px] font-mono shadow-md border border-white/20">
                          <span>{Math.round(holdProgress)}%</span>
                          <div
                            className="w-2.5 h-2.5 rounded-full border-2 border-white border-t-transparent animate-spin"
                          />
                        </div>
                      )}

                      <p className="text-sm sm:text-base text-white/90 leading-relaxed font-medium">
                        {dict.demo.techOriginal}
                      </p>

                      {translatedTech && (
                        <div
                          className="mt-4 pt-3 border-t transition-all rounded-xl px-3 py-2.5 bg-white/15"
                          style={{
                            borderColor: `${accentColor}50`,
                          }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-blue-200 border border-white/30"
                            >
                              {activeEngine === "google" && "Google Translate"}
                              {activeEngine === "bing" && "Microsoft Translator"}
                              {activeEngine === "deepseek" && "DeepSeek Chat"}
                              {activeEngine === "custom" && "Custom OpenAI"}
                            </span>
                            <span className="text-[10px] text-white/70 font-mono font-bold">0ms instant</span>
                          </div>
                          <p
                            className="text-sm sm:text-base leading-relaxed font-bold text-blue-200"
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
                    <div className="relative aspect-video rounded-2xl bg-black overflow-hidden border border-white/40 shadow-xl flex flex-col justify-end p-4">
                      <img
                        src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
                        alt="Video thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                      {/* YouTube Subtitle Overlay */}
                      <div className="relative z-10 text-center mb-2">
                        <div className="inline-block bg-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs sm:text-sm font-semibold text-white shadow-lg">
                          {subtitleMode === "bilingual" && (
                            <div className="text-white/90">Chrome MV3 Predictive Subtitle Synchronization</div>
                          )}
                          <div className="font-bold text-amber-300">
                            Chrome MV3 预测性双语字幕同步预加载渲染
                          </div>
                        </div>
                      </div>

                      <div className="relative z-10 flex items-center justify-between text-white/90 text-xs pt-2 border-t border-white/20">
                        <div className="flex items-center gap-3">
                          <Play className="w-4 h-4 fill-white text-white" />
                          <Volume2 className="w-4 h-4" />
                          <span className="font-mono">08:42 / 24:15</span>
                        </div>
                        <Maximize className="w-4 h-4" />
                      </div>
                    </div>

                    <div
                      onMouseDown={() =>
                        handleMouseDown("video-title", () =>
                          setTranslatedVideoTitle((prev) => !prev),
                        )
                      }
                      onMouseUp={cancelHold}
                      onMouseLeave={cancelHold}
                      className="p-4 rounded-2xl transition-all cursor-pointer bg-white/10 hover:bg-white/20 border border-white/25 shadow-md"
                    >
                      <span className="text-xs font-bold text-blue-300 block mb-1">
                        {dict.demo.videoTag}
                      </span>
                      <h4 className="text-base font-bold text-white leading-snug">
                        {dict.demo.videoTitleOriginal}
                      </h4>

                      {translatedVideoTitle && (
                        <div
                          className="mt-2.5 pt-2.5 border-t text-sm font-bold text-blue-200"
                          style={{ borderColor: `${accentColor}40` }}
                        >
                          {dict.demo.videoTitleTranslated}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: Academic Paper */}
                {activeTab === "paper" && (
                  <div className="space-y-5">
                    <div className="border-b border-white/20 pb-2.5">
                      <span className="text-[11px] font-mono font-bold text-purple-300 uppercase tracking-wider block mb-1">
                        arXiv:2609.12345v1 [cs.HC]
                      </span>
                      <h3 className="text-xl font-serif font-bold text-white leading-tight">
                        {dict.demo.paperTitle}
                      </h3>
                    </div>

                    <div
                      onMouseDown={() =>
                        handleMouseDown("paper-p", () => setTranslatedPaper((prev) => !prev))
                      }
                      onMouseUp={cancelHold}
                      onMouseLeave={cancelHold}
                      className="p-5 rounded-2xl transition-all cursor-pointer bg-white/10 hover:bg-white/20 border border-white/25 shadow-md"
                    >
                      <p className="text-sm font-serif text-white/90 leading-relaxed font-medium">
                        {dict.demo.paperOriginal}
                      </p>

                      {translatedPaper && (
                        <div
                          className="mt-3 pt-3 border-t font-serif text-sm font-bold leading-relaxed rounded-xl px-3 py-2 bg-white/15 text-blue-200"
                          style={{
                            borderColor: `${accentColor}40`,
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
          </LiquidGlass>
        </div>

        {/* Right: 1:1 Apple VisionOS Liquid Glass Control Island (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <LiquidGlass
            mode={settings.mode}
            displacementScale={settings.displacementScale * 0.8}
            blurAmount={settings.blurAmount}
            saturation={settings.saturation}
            aberrationIntensity={settings.aberrationIntensity}
            elasticity={settings.elasticity}
            cornerRadius={settings.cornerRadius}
            overLight={settings.overLight}
            padding="26px"
            className="w-full"
            mouseContainer={demoContainerRef}
          >
            <div className="flex flex-col gap-5 text-left">
              {/* Island Header */}
              <div className="flex items-center justify-between border-b border-white/20 pb-3">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-300" />
                    <span>{dict.demo.islandTitle}</span>
                  </h3>
                  <p className="text-xs text-white/80 font-medium">{dict.demo.islandSubtitle}</p>
                </div>
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                  {dict.demo.readyStatus}
                </span>
              </div>

              {/* Translation Engine Selection as LiquidGlass Buttons */}
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  {dict.demo.engineLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "google", name: dict.demo.engineGoogle },
                    { id: "bing", name: dict.demo.engineBing },
                    { id: "deepseek", name: dict.demo.engineDeepSeek },
                    { id: "custom", name: dict.demo.engineCustom },
                  ].map((engine) => {
                    const isSelected = activeEngine === engine.id
                    return (
                      <LiquidGlass
                        key={engine.id}
                        mode={settings.mode}
                        displacementScale={30}
                        blurAmount={settings.blurAmount}
                        saturation={settings.saturation}
                        aberrationIntensity={settings.aberrationIntensity}
                        elasticity={0.3}
                        cornerRadius={14}
                        overLight={settings.overLight}
                        padding="8px 12px"
                        onClick={() => setActiveEngine(engine.id as any)}
                      >
                        <div
                          className={`flex items-center justify-between w-full text-xs font-bold ${
                            isSelected ? "text-white" : "text-white/70"
                          }`}
                        >
                          <span className="truncate">{engine.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-300 shrink-0 ml-1" />}
                        </div>
                      </LiquidGlass>
                    )
                  })}
                </div>
              </div>

              {/* Subtitle Mode as LiquidGlass Buttons */}
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  {dict.demo.subtitlesLabel}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <LiquidGlass
                    mode={settings.mode}
                    displacementScale={30}
                    blurAmount={settings.blurAmount}
                    saturation={settings.saturation}
                    aberrationIntensity={settings.aberrationIntensity}
                    elasticity={0.3}
                    cornerRadius={14}
                    overLight={settings.overLight}
                    padding="8px 12px"
                    onClick={() => setSubtitleMode("bilingual")}
                  >
                    <div
                      className={`text-center w-full text-xs font-bold ${
                        subtitleMode === "bilingual" ? "text-white" : "text-white/70"
                      }`}
                    >
                      {dict.demo.subBilingual}
                      {subtitleMode === "bilingual" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block ml-1.5 align-middle" />
                      )}
                    </div>
                  </LiquidGlass>

                  <LiquidGlass
                    mode={settings.mode}
                    displacementScale={30}
                    blurAmount={settings.blurAmount}
                    saturation={settings.saturation}
                    aberrationIntensity={settings.aberrationIntensity}
                    elasticity={0.3}
                    cornerRadius={14}
                    overLight={settings.overLight}
                    padding="8px 12px"
                    onClick={() => setSubtitleMode("target")}
                  >
                    <div
                      className={`text-center w-full text-xs font-bold ${
                        subtitleMode === "target" ? "text-white" : "text-white/70"
                      }`}
                    >
                      {dict.demo.subTargetOnly}
                      {subtitleMode === "target" && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block ml-1.5 align-middle" />
                      )}
                    </div>
                  </LiquidGlass>
                </div>
              </div>

              {/* Color Palette Chips as LiquidGlass Circular Buttons */}
              <div>
                <label className="text-xs font-bold text-white block mb-2">
                  {dict.demo.themeLabel}
                </label>
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/25 border border-white/20">
                  {PALETTE.map((c) => {
                    const isSelected = accentColor.toLowerCase() === c.hex.toLowerCase()
                    return (
                      <LiquidGlass
                        key={c.hex}
                        mode={settings.mode}
                        displacementScale={20}
                        blurAmount={settings.blurAmount}
                        saturation={settings.saturation}
                        aberrationIntensity={settings.aberrationIntensity}
                        elasticity={0.4}
                        cornerRadius={999}
                        overLight={settings.overLight}
                        padding="4px"
                        onClick={() => onSelectColor(c.hex)}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center transition-transform hover:scale-105"
                          style={{
                            backgroundColor: c.hex,
                            boxShadow: isSelected
                              ? `0 0 0 2px #ffffff, 0 0 12px ${c.hex}`
                              : "none",
                          }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </LiquidGlass>
                    )
                  })}
                </div>
              </div>

              {/* Trigger Timing Slider */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-white">{dict.demo.triggerTimeLabel}</span>
                  <span className="font-mono font-bold text-blue-300">{triggerDuration}ms</span>
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

              {/* Refraction Mode Quick Switcher */}
              <div>
                <span className="text-[11px] font-bold text-white/90 block mb-1.5">
                  Refraction Modes (Liquid Glass)
                </span>
                <div className="grid grid-cols-4 gap-1 text-[11px]">
                  {(["standard", "polar", "prominent", "shader"] as const).map((m) => (
                    <LiquidGlass
                      key={m}
                      mode={m}
                      displacementScale={20}
                      blurAmount={settings.blurAmount}
                      saturation={settings.saturation}
                      aberrationIntensity={settings.aberrationIntensity}
                      elasticity={0.3}
                      cornerRadius={10}
                      overLight={settings.overLight}
                      padding="4px"
                      onClick={() => onUpdateSettings({ ...settings, mode: m })}
                    >
                      <div
                        className={`text-center w-full capitalize font-bold ${
                          settings.mode === m ? "text-white" : "text-white/70"
                        }`}
                      >
                        {m}
                        {settings.mode === m && (
                          <span className="w-1 h-1 rounded-full bg-blue-400 inline-block ml-1 align-middle" />
                        )}
                      </div>
                    </LiquidGlass>
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
