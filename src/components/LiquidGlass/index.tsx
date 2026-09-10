"use client"

import React, { type CSSProperties, forwardRef, useCallback, useEffect, useId, useRef, useState } from "react"
import { ShaderDisplacementGenerator, fragmentShaders } from "./shader-utils"
import { displacementMap, polarDisplacementMap, prominentDisplacementMap } from "./utils"

// Generate shader-based displacement map using shaderUtils
const generateShaderDisplacementMap = (width: number, height: number): string => {
  if (typeof window === "undefined" || typeof document === "undefined") return ""
  try {
    const generator = new ShaderDisplacementGenerator({
      width: Math.max(width, 32),
      height: Math.max(height, 32),
      fragment: fragmentShaders.liquidGlass,
    })
    const dataUrl = generator.updateShader()
    generator.destroy()
    return dataUrl
  } catch {
    return ""
  }
}

const getMap = (mode: "standard" | "polar" | "prominent" | "shader", shaderMapUrl?: string) => {
  switch (mode) {
    case "standard":
      return displacementMap
    case "polar":
      return polarDisplacementMap
    case "prominent":
      return prominentDisplacementMap
    case "shader":
      return shaderMapUrl || displacementMap
    default:
      return displacementMap
  }
}

/* ---------- SVG filter (edge-only displacement) ---------- */
const GlassFilter: React.FC<{
  id: string
  displacementScale: number
  aberrationIntensity: number
  width: number
  height: number
  mode: "standard" | "polar" | "prominent" | "shader"
  shaderMapUrl?: string
}> = ({ id, displacementScale, aberrationIntensity, width, height, mode, shaderMapUrl }) => (
  <svg style={{ position: "absolute", width, height }} aria-hidden="true">
    <defs>
      <radialGradient id={`${id}-edge-mask`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="black" stopOpacity="0" />
        <stop offset={`${Math.max(30, 80 - aberrationIntensity * 2)}%`} stopColor="black" stopOpacity="0" />
        <stop offset="100%" stopColor="white" stopOpacity="1" />
      </radialGradient>
      <filter id={id} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
        <feImage
          id="feimage"
          x="0"
          y="0"
          width="100%"
          height="100%"
          result="DISPLACEMENT_MAP"
          href={getMap(mode, shaderMapUrl)}
          preserveAspectRatio="xMidYMid slice"
        />

        <feColorMatrix
          in="DISPLACEMENT_MAP"
          type="matrix"
          values="0.3 0.3 0.3 0 0
                 0.3 0.3 0.3 0 0
                 0.3 0.3 0.3 0 0
                 0 0 0 1 0"
          result="EDGE_INTENSITY"
        />
        <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
          <feFuncA type="discrete" tableValues={`0 ${aberrationIntensity * 0.05} 1`} />
        </feComponentTransfer>

        <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

        {/* Red channel displacement */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={displacementScale * (mode === "shader" ? 1 : -1)}
          xChannelSelector="R"
          yChannelSelector="B"
          result="RED_DISPLACED"
        />
        <feColorMatrix
          in="RED_DISPLACED"
          type="matrix"
          values="1 0 0 0 0
                 0 0 0 0 0
                 0 0 0 0 0
                 0 0 0 1 0"
          result="RED_CHANNEL"
        />

        {/* Green channel displacement */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={displacementScale * ((mode === "shader" ? 1 : -1) - aberrationIntensity * 0.05)}
          xChannelSelector="R"
          yChannelSelector="B"
          result="GREEN_DISPLACED"
        />
        <feColorMatrix
          in="GREEN_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                 0 1 0 0 0
                 0 0 0 0 0
                 0 0 0 1 0"
          result="GREEN_CHANNEL"
        />

        {/* Blue channel displacement */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={displacementScale * ((mode === "shader" ? 1 : -1) - aberrationIntensity * 0.1)}
          xChannelSelector="R"
          yChannelSelector="B"
          result="BLUE_DISPLACED"
        />
        <feColorMatrix
          in="BLUE_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                 0 0 0 0 0
                 0 0 1 0 0
                 0 0 0 1 0"
          result="BLUE_CHANNEL"
        />

        <feBlend in="GREEN_CHANNEL" in2="BLUE_CHANNEL" mode="screen" result="GB_COMBINED" />
        <feBlend in="RED_CHANNEL" in2="GB_COMBINED" mode="screen" result="RGB_COMBINED" />
        <feGaussianBlur in="RGB_COMBINED" stdDeviation={Math.max(0.1, 0.5 - aberrationIntensity * 0.1)} result="ABERRATED_BLURRED" />
        <feComposite in="ABERRATED_BLURRED" in2="EDGE_MASK" operator="in" result="EDGE_ABERRATION" />

        <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feComposite in="CENTER_ORIGINAL" in2="INVERTED_MASK" operator="in" result="CENTER_CLEAN" />
        <feComposite in="EDGE_ABERRATION" in2="CENTER_CLEAN" operator="over" />
      </filter>
    </defs>
  </svg>
)

/* ---------- Glass Container ---------- */
const GlassContainer = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    className?: string
    style?: React.CSSProperties
    displacementScale?: number
    blurAmount?: number
    saturation?: number
    aberrationIntensity?: number
    mouseOffset?: { x: number; y: number }
    onMouseLeave?: () => void
    onMouseEnter?: () => void
    onMouseDown?: () => void
    onMouseUp?: () => void
    active?: boolean
    overLight?: boolean
    cornerRadius?: number
    padding?: string
    glassSize?: { width: number; height: number }
    onClick?: () => void
    mode?: "standard" | "polar" | "prominent" | "shader"
    isHovered?: boolean
  }>
>(
  (
    {
      children,
      className = "",
      style,
      displacementScale = 60,
      blurAmount = 0.1,
      saturation = 140,
      aberrationIntensity = 2,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      active = false,
      overLight = true,
      cornerRadius = 999,
      padding = "16px 24px",
      glassSize = { width: 270, height: 69 },
      onClick,
      mode = "standard",
      isHovered = false,
      mouseOffset,
    },
    ref,
  ) => {
    const rawId = useId()
    const filterId = "glass-filter-" + rawId.replace(/:/g, "")
    const [shaderMapUrl, setShaderMapUrl] = useState<string>("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
      setMounted(true)
    }, [])

    const isFirefox = mounted && typeof navigator !== "undefined" && navigator.userAgent.toLowerCase().includes("firefox")

    useEffect(() => {
      if (mode === "shader" && glassSize.width > 0 && glassSize.height > 0) {
        const url = generateShaderDisplacementMap(glassSize.width, glassSize.height)
        setShaderMapUrl(url)
      }
    }, [mode, glassSize.width, glassSize.height])

    const backdropStyle = {
      filter: isFirefox ? undefined : `url(#${filterId})`,
      backdropFilter: `blur(${(overLight ? 16 : 8) + blurAmount * 36}px) saturate(${saturation}%)`,
      WebkitBackdropFilter: `blur(${(overLight ? 16 : 8) + blurAmount * 36}px) saturate(${saturation}%)`,
    }

    const mouseX = mouseOffset?.x || 0
    const mouseY = mouseOffset?.y || 0

    const { backgroundColor: _ignoredBg, ...cleanStyle } = style || {}
    const outerStyle: React.CSSProperties = {
      borderRadius: `${cornerRadius}px`,
      ...cleanStyle,
    }

    return (
      <div
        ref={ref}
        className={`relative ${className} ${active ? "active" : ""} ${Boolean(onClick) ? "cursor-pointer" : ""}`}
        style={outerStyle}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      >
        <GlassFilter
          mode={mode}
          id={filterId}
          displacementScale={displacementScale}
          aberrationIntensity={aberrationIntensity}
          width={glassSize.width}
          height={glassSize.height}
          shaderMapUrl={shaderMapUrl}
        />

        <div
          className="glass-inner"
          style={{
            borderRadius: `${cornerRadius}px`,
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            width: "100%",
            height: "100%",
            padding,
            overflow: "hidden",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            backgroundColor: "transparent",
            boxShadow: overLight
              ? "0px 16px 70px rgba(0, 0, 0, 0.75)"
              : "0px 12px 40px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* backdrop refraction layer */}
          <span
            className="glass__warp pointer-events-none"
            style={
              {
                ...backdropStyle,
                position: "absolute",
                inset: "0",
              } as CSSProperties
            }
          />

          {/* User Content */}
          <div
            className="relative z-10 w-full transition-colors duration-200 text-white"
            style={{
              textShadow: overLight
                ? "0px 2px 12px rgba(0, 0, 0, 0)"
                : "0px 2px 12px rgba(0, 0, 0, 0.4)",
            }}
          >
            {children}
          </div>
        </div>

        {/* Border layer 1 - Screen blend mode highlight (outside overflow:hidden so rim shadow is unclipped) */}
        <span
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            borderRadius: `${cornerRadius}px`,
            padding: "1.5px",
            mixBlendMode: "screen",
            opacity: 0.2,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            boxShadow:
              "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
            background: `linear-gradient(
              ${135 + mouseX * 1.2}deg,
              rgba(255, 255, 255, 0.0) 0%,
              rgba(255, 255, 255, ${0.12 + Math.abs(mouseX) * 0.008}) ${Math.max(10, 33 + mouseY * 0.3)}%,
              rgba(255, 255, 255, ${0.4 + Math.abs(mouseX) * 0.012}) ${Math.min(90, 66 + mouseY * 0.4)}%,
              rgba(255, 255, 255, 0.0) 100%
            )`,
          }}
        />

        {/* Border layer 2 - Overlay blend mode highlight (outside overflow:hidden so rim shadow is unclipped) */}
        <span
          className="pointer-events-none absolute inset-0 transition-opacity duration-200"
          style={{
            borderRadius: `${cornerRadius}px`,
            padding: "1.5px",
            mixBlendMode: "overlay",
            opacity: 1,
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            boxShadow:
              "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
            background: `linear-gradient(
              ${135 + mouseX * 1.2}deg,
              rgba(255, 255, 255, 0.0) 0%,
              rgba(255, 255, 255, ${0.32 + Math.abs(mouseX) * 0.008}) ${Math.max(10, 33 + mouseY * 0.3)}%,
              rgba(255, 255, 255, ${0.6 + Math.abs(mouseX) * 0.012}) ${Math.min(90, 66 + mouseY * 0.4)}%,
              rgba(255, 255, 255, 0.0) 100%
            )`,
          }}
        />

        {/* Hover Specular Light Sheen (3 layers from original repo) */}
        {Boolean(onClick) && (
          <>
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-200"
              style={{
                borderRadius: `${cornerRadius}px`,
                opacity: isHovered || active ? 0.5 : 0,
                backgroundImage:
                  "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%)",
                mixBlendMode: "overlay",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-200"
              style={{
                borderRadius: `${cornerRadius}px`,
                opacity: active ? 0.5 : 0,
                backgroundImage:
                  "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 80%)",
                mixBlendMode: "overlay",
              }}
            />
            <div
              className="pointer-events-none absolute inset-0 transition-all duration-200"
              style={{
                borderRadius: `${cornerRadius}px`,
                opacity: isHovered ? 0.4 : active ? 0.8 : 0,
                backgroundImage: `radial-gradient(circle at ${50 + mouseX * 0.5}% ${Math.max(
                  0,
                  30 + mouseY * 0.5,
                )}%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)`,
                mixBlendMode: "overlay",
              }}
            />
          </>
        )}
      </div>
    )
  },
)

GlassContainer.displayName = "GlassContainer"

export interface LiquidGlassProps {
  children: React.ReactNode
  displacementScale?: number
  blurAmount?: number
  saturation?: number
  aberrationIntensity?: number
  elasticity?: number
  cornerRadius?: number
  globalMousePos?: { x: number; y: number }
  mouseOffset?: { x: number; y: number }
  mouseContainer?: React.RefObject<HTMLElement | null> | null
  className?: string
  padding?: string
  style?: React.CSSProperties
  overLight?: boolean
  mode?: "standard" | "polar" | "prominent" | "shader"
  onClick?: () => void
}

export default function LiquidGlass({
  children,
  displacementScale = 70,
  blurAmount = 0.45,
  saturation = 140,
  aberrationIntensity = 2,
  elasticity = 0.2,
  cornerRadius = 24,
  globalMousePos: externalGlobalMousePos,
  mouseOffset: externalMouseOffset,
  mouseContainer = null,
  className = "",
  padding = "16px 24px",
  overLight = false,
  style = {},
  mode = "standard",
  onClick,
}: LiquidGlassProps) {
  const glassRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [glassSize, setGlassSize] = useState({ width: 270, height: 69 })
  const [internalGlobalMousePos, setInternalGlobalMousePos] = useState({ x: 0, y: 0 })
  const [internalMouseOffset, setInternalMouseOffset] = useState({ x: 0, y: 0 })

  const globalMousePos = externalGlobalMousePos || internalGlobalMousePos
  const mouseOffset = externalMouseOffset || internalMouseOffset

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = mouseContainer?.current || glassRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      setInternalMouseOffset({
        x: ((e.clientX - centerX) / (rect.width || 1)) * 100,
        y: ((e.clientY - centerY) / (rect.height || 1)) * 100,
      })

      setInternalGlobalMousePos({
        x: e.clientX,
        y: e.clientY,
      })
    },
    [mouseContainer],
  )

  useEffect(() => {
    if (externalGlobalMousePos && externalMouseOffset) return

    const container = mouseContainer?.current || glassRef.current
    if (!container) return

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove, mouseContainer, externalGlobalMousePos, externalMouseOffset])

  useEffect(() => {
    const updateGlassSize = () => {
      if (glassRef.current) {
        const rect = glassRef.current.getBoundingClientRect()
        setGlassSize({ width: Math.round(rect.width), height: Math.round(rect.height) })
      }
    }
    updateGlassSize()
    window.addEventListener("resize", updateGlassSize)
    return () => window.removeEventListener("resize", updateGlassSize)
  }, [])

  // Calculate directional scaling based on mouse position (mimics Apple's liquid stretch)
  const calculateDirectionalScale = useCallback(() => {
    if (!elasticity || elasticity <= 0 || !globalMousePos.x || !globalMousePos.y || !glassRef.current) {
      return "scale(1)"
    }

    const rect = glassRef.current.getBoundingClientRect()
    const pillCenterX = rect.left + rect.width / 2
    const pillCenterY = rect.top + rect.height / 2
    const pillWidth = glassSize.width || rect.width
    const pillHeight = glassSize.height || rect.height

    const deltaX = globalMousePos.x - pillCenterX
    const deltaY = globalMousePos.y - pillCenterY

    const edgeDistanceX = Math.max(0, Math.abs(deltaX) - pillWidth / 2)
    const edgeDistanceY = Math.max(0, Math.abs(deltaY) - pillHeight / 2)
    const edgeDistance = Math.sqrt(edgeDistanceX * edgeDistanceX + edgeDistanceY * edgeDistanceY)

    const activationZone = 250
    if (edgeDistance > activationZone) return "scale(1)"

    const fadeInFactor = 1 - edgeDistance / activationZone
    const centerDistance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    if (centerDistance === 0) return "scale(1)"

    const normalizedX = deltaX / centerDistance
    const normalizedY = deltaY / centerDistance

    const stretchIntensity = Math.min(centerDistance / 300, 1) * elasticity * fadeInFactor
    const scaleX = 1 + Math.abs(normalizedX) * stretchIntensity * 0.18 - Math.abs(normalizedY) * stretchIntensity * 0.08
    const scaleY = 1 + Math.abs(normalizedY) * stretchIntensity * 0.18 - Math.abs(normalizedX) * stretchIntensity * 0.08

    return `scaleX(${Math.max(0.92, Math.min(1.12, scaleX))}) scaleY(${Math.max(0.92, Math.min(1.12, scaleY))})`
  }, [globalMousePos, elasticity, glassSize])

  const transformScale = isActive && Boolean(onClick) ? "scale(0.96)" : calculateDirectionalScale()

  const combinedStyle: React.CSSProperties = {
    ...style,
    transform: style.transform ? `${style.transform} ${transformScale}` : transformScale,
    transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
  }

  return (
    <GlassContainer
      ref={glassRef}
      className={className}
      style={combinedStyle}
      cornerRadius={cornerRadius}
      displacementScale={overLight ? displacementScale * 0.6 : displacementScale}
      blurAmount={blurAmount}
      saturation={saturation}
      aberrationIntensity={aberrationIntensity}
      glassSize={glassSize}
      padding={padding}
      mouseOffset={mouseOffset}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      active={isActive}
      overLight={overLight}
      onClick={onClick}
      mode={mode}
      isHovered={isHovered}
    >
      {children}
    </GlassContainer>
  )
}
