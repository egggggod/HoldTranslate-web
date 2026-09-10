"use client"

import React, { useState } from "react"
import { Sliders, X, Sparkles, Eye, RotateCcw, Image as ImageIcon, Sun, Moon } from "lucide-react"
import LiquidGlass from "./index"

export interface TuningSettings {
  mode: "standard" | "polar" | "prominent" | "shader"
  displacementScale: number
  blurAmount: number
  saturation: number
  aberrationIntensity: number
  elasticity: number
  cornerRadius: number
  overLight: boolean
  wallpaperIndex: number
}

export const DEFAULT_SETTINGS: TuningSettings = {
  mode: "standard",
  displacementScale: 70,
  blurAmount: 0.45,
  saturation: 140,
  aberrationIntensity: 2,
  elasticity: 0.2,
  cornerRadius: 24,
  overLight: false,
  wallpaperIndex: 0,
}

interface TuningDockProps {
  settings: TuningSettings
  onChange: (newSettings: TuningSettings) => void
  accentColor: string
}

export const WALLPAPERS = [
  {
    name: "Alpine Dawn 晨曦雪山",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85",
  },
  {
    name: "Sunlit Forest 林间晨光",
    url: "https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=2400&q=85",
  },
  {
    name: "Bright Clouds 晴空云海",
    url: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2400&q=85",
  },
  {
    name: "Mountain Lake 澄澈高山湖",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85",
  },
]

export default function TuningDock({ settings, onChange, accentColor }: TuningDockProps) {
  const [isOpen, setIsOpen] = useState(false)

  const update = (key: keyof TuningSettings, value: any) => {
    onChange({
      ...settings,
      [key]: value,
    })
  }

  const reset = () => {
    onChange(DEFAULT_SETTINGS)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expanded Control Panel */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 max-h-[80vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border border-white/60 bg-white/70 backdrop-blur-2xl text-slate-900 transition-all animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-900/10 mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">Liquid Glass Lab</h4>
                <p className="text-[11px] text-slate-500 font-medium">Apple 物理光学实验室微调岛</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reset}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-black/5 transition-colors"
                title="重置为默认值"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-black/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4 text-xs font-medium text-slate-700">
            {/* Scenic Wallpaper Preset */}
            <div>
              <label className="block text-[11px] font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>自然风景底图切换 (Scenic Wallpaper)</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {WALLPAPERS.map((wp, idx) => (
                  <button
                    key={idx}
                    onClick={() => update("wallpaperIndex", idx)}
                    className={`px-2.5 py-1.5 rounded-xl text-[11px] truncate transition-all text-left ${
                      settings.wallpaperIndex === idx
                        ? "bg-slate-900 text-white font-semibold shadow-sm"
                        : "bg-black/5 text-slate-700 hover:bg-black/10"
                    }`}
                  >
                    {wp.name.split(" ")[1] || wp.name}
                  </button>
                ))}
              </div>
            </div>

            {/* OverLight Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-2xl bg-black/5 border border-black/5">
              <div className="flex items-center gap-2">
                {settings.overLight ? (
                  <Sun className="w-4 h-4 text-amber-500" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Over Light 浅色模式</span>
                  <span className="text-[10px] text-slate-500 block">自适应浅色自然风景高对比度</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.overLight}
                onChange={(e) => update("overLight", e.target.checked)}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </div>

            {/* Refraction Mode */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900">折射模式 (Mode)</span>
                <span className="font-mono text-blue-600 font-semibold uppercase">{settings.mode}</span>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {(["standard", "polar", "prominent", "shader"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => update("mode", m)}
                    className={`py-1 rounded-lg text-[11px] capitalize transition-all ${
                      settings.mode === m
                        ? "bg-blue-600 text-white font-semibold shadow"
                        : "bg-black/5 text-slate-700 hover:bg-black/10"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Displacement Scale */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span>边缘位移强度 (Displacement)</span>
                <span className="font-mono text-blue-600 font-bold">{settings.displacementScale}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="1"
                value={settings.displacementScale}
                onChange={(e) => update("displacementScale", Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Blur Amount */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span>背景磨砂模糊 (Blur Amount)</span>
                <span className="font-mono text-emerald-600 font-bold">{settings.blurAmount.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={settings.blurAmount}
                onChange={(e) => update("blurAmount", Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Saturation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span>底层饱和度 (Saturation)</span>
                <span className="font-mono text-purple-600 font-bold">{settings.saturation}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                step="10"
                value={settings.saturation}
                onChange={(e) => update("saturation", Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Chromatic Aberration */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span>色散强度 (Chromatic Aberration)</span>
                <span className="font-mono text-cyan-600 font-bold">{settings.aberrationIntensity}</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={settings.aberrationIntensity}
                onChange={(e) => update("aberrationIntensity", Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Elasticity */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span>物理光标弹性 (Elasticity)</span>
                <span className="font-mono text-amber-600 font-bold">{settings.elasticity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.elasticity}
                onChange={(e) => update("elasticity", Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Corner Radius */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span>圆角曲率 (Corner Radius)</span>
                <span className="font-mono text-pink-600 font-bold">{settings.cornerRadius}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="60"
                step="2"
                value={settings.cornerRadius}
                onChange={(e) => update("cornerRadius", Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating Pill Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl border border-white/70 bg-white/75 hover:bg-white/90 backdrop-blur-xl text-slate-900 transition-all active:scale-95 font-semibold text-xs"
        style={{
          boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8) inset",
        }}
      >
        <div
          className="w-4 h-4 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: accentColor }}
        >
          <Sliders className="w-2.5 h-2.5" />
        </div>
        <span>{isOpen ? "收起实验室" : "Liquid Glass 光学实验室"}</span>
      </button>
    </div>
  )
}
