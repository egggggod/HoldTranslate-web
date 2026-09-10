"use client"

import React, { useState } from "react"
import { Sliders, X, Sparkles, RotateCcw, Image as ImageIcon } from "lucide-react"

export interface TuningSettings {
  mode: "studio" | "standard" | "polar" | "prominent" | "shader"
  // Studio Official Physical Optical Parameters
  refThickness: number
  refFactor: number
  refDistance: number
  refDispersion: number
  refFresnelFactor: number
  glareFactor: number
  glareConvergence: number
  glareAngle: number
  blurRadius: number
  mergeRate: number
  shapeRoundness: number
  shadowFactor: number
  shadowExpand: number
  wallpaperIndex: number
  // Legacy / Fallback Parameters
  displacementScale: number
  blurAmount: number
  saturation: number
  aberrationIntensity: number
  elasticity: number
  cornerRadius: number
  overLight: boolean
}

export const DEFAULT_SETTINGS: TuningSettings = {
  mode: "studio",
  // Studio Defaults (100% matched to liquid-glass-studio.vercel.app)
  refThickness: 20,
  refFactor: 1.4,
  refDistance: 0.05,
  refDispersion: 7.0,
  refFresnelFactor: 20.0,
  glareFactor: 90.0,
  glareConvergence: 50.0,
  glareAngle: -45.0,
  blurRadius: 2,
  mergeRate: 0.035,
  shapeRoundness: 3.5,
  shadowFactor: 15.0,
  shadowExpand: 25.0,
  wallpaperIndex: 0,
  // Legacy Fallback Defaults
  displacementScale: 95,
  blurAmount: 0.25,
  saturation: 140,
  aberrationIntensity: 2.5,
  elasticity: 0.35,
  cornerRadius: 24,
  overLight: false,
}

interface TuningDockProps {
  settings: TuningSettings
  onChange: (newSettings: TuningSettings) => void
  accentColor: string
}

export const WALLPAPERS = [
  {
    name: "Golden Sunburst 强光逆光日落 (原演示同款)",
    url: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=2400&q=85",
  },
  {
    name: "Brighton Pier 夕照海岸码头 (card.png 同款)",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85",
  },
  {
    name: "Misty Blue Ridges 晨雾山脊 (button.png 同款)",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=85",
  },
  {
    name: "Forest Sunbeams 森林破晓光束",
    url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2400&q=85",
  },
  {
    name: "Alpine Dawn 晨曦雪山",
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2400&q=85",
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

  const isStudio = settings.mode === "studio"

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Expanded Control Panel */}
      {isOpen && (
        <div className="mb-4 w-84 sm:w-96 max-h-[82vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border border-white/60 bg-white/75 backdrop-blur-2xl text-slate-900 transition-all animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-900/10 mb-4">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold tracking-tight">Liquid Glass Studio</h4>
                <p className="text-[11px] text-slate-500 font-medium">Apple 物理光学实验室 (STEP 9)</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={reset}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-black/5 transition-colors"
                title="重置为 Studio 官方默认配置"
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

            {/* Mode Selector */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900">渲染管线模式 (Engine Mode)</span>
                <span className="font-mono text-blue-600 font-semibold uppercase">{settings.mode}</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {(["studio", "standard", "polar", "prominent", "shader"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => update("mode", m)}
                    className={`py-1 rounded-lg text-[10px] capitalize transition-all ${
                      settings.mode === m
                        ? "bg-blue-600 text-white font-semibold shadow"
                        : "bg-black/5 text-slate-700 hover:bg-black/10"
                    }`}
                  >
                    {m === "studio" ? "Studio ⚡" : m}
                  </button>
                ))}
              </div>
            </div>

            {/* Studio Official Physical Controls */}
            {isStudio ? (
              <>
                {/* Refraction Factor (n) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>物理折射率 (Refractive Index / n)</span>
                    <span className="font-mono text-blue-600 font-bold">{settings.refFactor.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="2.5"
                    step="0.02"
                    value={settings.refFactor}
                    onChange={(e) => update("refFactor", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Lens Thickness */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>透镜厚度 (Lens Thickness)</span>
                    <span className="font-mono text-indigo-600 font-bold">{settings.refThickness}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="1"
                    value={settings.refThickness}
                    onChange={(e) => update("refThickness", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Refraction Distance */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>折射位移距离 (Refraction Distance)</span>
                    <span className="font-mono text-purple-600 font-bold">{settings.refDistance.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="0.15"
                    step="0.005"
                    value={settings.refDistance}
                    onChange={(e) => update("refDistance", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* RGB Dispersion */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>RGB 物理色散 (Dispersion)</span>
                    <span className="font-mono text-cyan-600 font-bold">{settings.refDispersion.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={settings.refDispersion}
                    onChange={(e) => update("refDispersion", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Glare Angle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>定向高光入射角 (Glare Angle)</span>
                    <span className="font-mono text-amber-600 font-bold">{settings.glareAngle}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={settings.glareAngle}
                    onChange={(e) => update("glareAngle", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Glare Convergence */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>高光聚焦度 (Glare Convergence)</span>
                    <span className="font-mono text-orange-600 font-bold">{settings.glareConvergence}</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="2"
                    value={settings.glareConvergence}
                    onChange={(e) => update("glareConvergence", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Fresnel Factor */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>菲涅尔反光强度 (Fresnel Factor)</span>
                    <span className="font-mono text-pink-600 font-bold">{settings.refFresnelFactor}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={settings.refFresnelFactor}
                    onChange={(e) => update("refFresnelFactor", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Blur Radius */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>高斯磨砂半径 (Blur Radius)</span>
                    <span className="font-mono text-emerald-600 font-bold">{settings.blurRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    step="1"
                    value={settings.blurRadius}
                    onChange={(e) => update("blurRadius", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Merge Rate (smin) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>光标水滴融合度 (Blob Merge Rate)</span>
                    <span className="font-mono text-teal-600 font-bold">{settings.mergeRate.toFixed(3)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.08"
                    step="0.005"
                    value={settings.mergeRate}
                    onChange={(e) => update("mergeRate", Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Squircle Roundness */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>Apple G2 连续圆角曲率 (Squircle)</span>
                    <span className="font-mono text-rose-600 font-bold">{settings.shapeRoundness.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="6.0"
                    step="0.2"
                    value={settings.shapeRoundness}
                    onChange={(e) => update("shapeRoundness", Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </>
            ) : (
              /* Fallback SVG Controls */
              <>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>SVG 边缘位移 (Displacement)</span>
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
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span>CSS 磨砂模糊 (Blur Amount)</span>
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
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Pill Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full shadow-2xl border border-white/70 bg-white/80 hover:bg-white/95 backdrop-blur-xl text-slate-900 transition-all active:scale-95 font-semibold text-xs"
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
