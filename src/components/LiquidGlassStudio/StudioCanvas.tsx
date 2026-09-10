"use client"

import React, { useEffect, useRef } from "react"
import {
  createProgram,
  createQuadBuffer,
  createFBO,
  loadTexture,
  type FBO,
} from "./GLUtils"
import {
  vertexShader,
  bgFragmentShader,
  blurFragmentShader,
  mainFragmentShader,
} from "./shaders"
import { useStudio } from "./StudioContext"
import { type TuningSettings } from "../LiquidGlass/TuningDock"

interface StudioCanvasProps {
  wallpaperUrl: string
  settings: TuningSettings
}

export default function StudioCanvas({ wallpaperUrl, settings }: StudioCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const studio = useStudio()

  // Spring cursor state
  const mouseStateRef = useRef({
    targetX: -1000,
    targetY: -1000,
    currentX: -1000,
    currentY: -1000,
    vx: 0,
    vy: 0,
    inside: false,
  })

  // Settings ref for render loop
  const settingsRef = useRef(settings)
  useEffect(() => {
    settingsRef.current = settings
  }, [settings])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseStateRef.current.targetX = e.clientX
      mouseStateRef.current.targetY = e.clientY
      mouseStateRef.current.inside = true
    }

    const handleMouseLeave = () => {
      mouseStateRef.current.inside = false
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext("webgl2", {
      antialias: false,
      alpha: true,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
    })

    if (!gl) {
      console.warn("WebGL2 is not supported in this browser. Degrading to CSS fallback.")
      studio?.setIsStudioEnabled(false)
      return
    }

    let quadBuffer: WebGLBuffer | null = null
    let bgProgram: WebGLProgram | null = null
    let blurProgram: WebGLProgram | null = null
    let mainProgram: WebGLProgram | null = null

    try {
      quadBuffer = createQuadBuffer(gl)
      bgProgram = createProgram(gl, vertexShader, bgFragmentShader)
      blurProgram = createProgram(gl, vertexShader, blurFragmentShader)
      mainProgram = createProgram(gl, vertexShader, mainFragmentShader)
    } catch (err) {
      console.error("Failed to initialize WebGL2 Studio shaders:", err)
      studio?.setIsStudioEnabled(false)
      return
    }

    let bgFbo: FBO | null = null
    let vBlurFbo: FBO | null = null
    let hBlurFbo: FBO | null = null

    let wallpaperTex: WebGLTexture | null = null
    let imgResolution: [number, number] = [1920, 1080]

    // Load initial wallpaper
    wallpaperTex = loadTexture(gl, wallpaperUrl, (img) => {
      imgResolution = [img.naturalWidth || 1920, img.naturalHeight || 1080]
    })

    let animationFrameId: number
    let dpr = 1
    let width = 1
    let height = 1

    const resizeFBOs = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const displayWidth = Math.round(window.innerWidth * dpr)
      const displayHeight = Math.round(window.innerHeight * dpr)

      if (width !== displayWidth || height !== displayHeight) {
        width = displayWidth
        height = displayHeight
        canvas.width = width
        canvas.height = height

        if (bgFbo) {
          gl.deleteTexture(bgFbo.texture)
          gl.deleteFramebuffer(bgFbo.framebuffer)
        }
        if (vBlurFbo) {
          gl.deleteTexture(vBlurFbo.texture)
          gl.deleteFramebuffer(vBlurFbo.framebuffer)
        }
        if (hBlurFbo) {
          gl.deleteTexture(hBlurFbo.texture)
          gl.deleteFramebuffer(hBlurFbo.framebuffer)
        }

        bgFbo = createFBO(gl, width, height)
        // Half-resolution for blur FBOs gives buttery 60-120fps and extra soft Gaussian bloom
        const blurW = Math.max(16, Math.round(width * 0.5))
        const blurH = Math.max(16, Math.round(height * 0.5))
        vBlurFbo = createFBO(gl, blurW, blurH)
        hBlurFbo = createFBO(gl, blurW, blurH)
      }
    }

    resizeFBOs()
    window.addEventListener("resize", resizeFBOs)

    // Render loop
    const render = () => {
      if (!canvas || !gl || !bgProgram || !blurProgram || !mainProgram || !quadBuffer) {
        return
      }

      // Spring mouse interpolation (Hooke's law with damping)
      const m = mouseStateRef.current
      if (m.inside) {
        const stiffness = 0.22
        const damping = 0.70
        m.vx = (m.targetX - m.currentX) * stiffness + m.vx * damping
        m.vy = (m.targetY - m.currentY) * stiffness + m.vy * damping
        m.currentX += m.vx
        m.currentY += m.vy
      } else {
        m.currentX = -2000
        m.currentY = -2000
        m.vx = 0
        m.vy = 0
      }

      const s = settingsRef.current
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer)

      // ==========================================
      // PASS 1: Background Pass -> bgFbo
      // ==========================================
      if (bgFbo && wallpaperTex) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, bgFbo.framebuffer)
        gl.viewport(0, 0, bgFbo.width, bgFbo.height)
        gl.useProgram(bgProgram)

        const posLoc = gl.getAttribLocation(bgProgram, "a_position")
        gl.enableVertexAttribArray(posLoc)
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, wallpaperTex)
        gl.uniform1i(gl.getUniformLocation(bgProgram, "u_image"), 0)
        gl.uniform2f(gl.getUniformLocation(bgProgram, "u_resolution"), bgFbo.width, bgFbo.height)
        gl.uniform2f(gl.getUniformLocation(bgProgram, "u_imageResolution"), imgResolution[0], imgResolution[1])

        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      // ==========================================
      // PASS 2: Vertical Gaussian Blur -> vBlurFbo
      // ==========================================
      if (bgFbo && vBlurFbo) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, vBlurFbo.framebuffer)
        gl.viewport(0, 0, vBlurFbo.width, vBlurFbo.height)
        gl.useProgram(blurProgram)

        const posLoc = gl.getAttribLocation(blurProgram, "a_position")
        gl.enableVertexAttribArray(posLoc)
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, bgFbo.texture)
        gl.uniform1i(gl.getUniformLocation(blurProgram, "u_image"), 0)
        gl.uniform2f(gl.getUniformLocation(blurProgram, "u_resolution"), vBlurFbo.width, vBlurFbo.height)
        gl.uniform2f(gl.getUniformLocation(blurProgram, "u_direction"), 0.0, 1.0)
        gl.uniform1f(gl.getUniformLocation(blurProgram, "u_blurRadius"), Math.max(1.0, s.blurAmount * 24.0 * dpr))

        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      // ==========================================
      // PASS 3: Horizontal Gaussian Blur -> hBlurFbo
      // ==========================================
      if (vBlurFbo && hBlurFbo) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, hBlurFbo.framebuffer)
        gl.viewport(0, 0, hBlurFbo.width, hBlurFbo.height)
        gl.useProgram(blurProgram)

        const posLoc = gl.getAttribLocation(blurProgram, "a_position")
        gl.enableVertexAttribArray(posLoc)
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, vBlurFbo.texture)
        gl.uniform1i(gl.getUniformLocation(blurProgram, "u_image"), 0)
        gl.uniform2f(gl.getUniformLocation(blurProgram, "u_resolution"), hBlurFbo.width, hBlurFbo.height)
        gl.uniform2f(gl.getUniformLocation(blurProgram, "u_direction"), 1.0, 0.0)
        gl.uniform1f(gl.getUniformLocation(blurProgram, "u_blurRadius"), Math.max(1.0, s.blurAmount * 24.0 * dpr))

        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      // ==========================================
      // PASS 4: Main Physical Shader -> Screen
      // ==========================================
      if (bgFbo && hBlurFbo) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null)
        gl.viewport(0, 0, width, height)
        gl.useProgram(mainProgram)

        const posLoc = gl.getAttribLocation(mainProgram, "a_position")
        gl.enableVertexAttribArray(posLoc)
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

        // Texture Unit 0: Sharp Background
        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, bgFbo.texture)
        gl.uniform1i(gl.getUniformLocation(mainProgram, "u_bg"), 0)

        // Texture Unit 1: Frosted Blurred Background
        gl.activeTexture(gl.TEXTURE1)
        gl.bindTexture(gl.TEXTURE_2D, hBlurFbo.texture)
        gl.uniform1i(gl.getUniformLocation(mainProgram, "u_blurredBg"), 1)

        // Screen Resolution
        gl.uniform2f(gl.getUniformLocation(mainProgram, "u_resolution"), width, height)

        // Cursor drop coordinates (WebGL origin at bottom-left)
        const springX = m.currentX * dpr
        const springY = height - m.currentY * dpr
        gl.uniform2f(gl.getUniformLocation(mainProgram, "u_springMouse"), springX, springY)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_cursorRadius"), 22.0 * dpr)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_cursorEnabled"), m.inside ? 1.0 : 0.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_mergeRate"), (s.elasticity * 60.0 + 15.0) * dpr)

        // Physical Optical Parameters
        // Mapping tuning settings to physical uniforms:
        const refFactor = 1.0 + (s.displacementScale / 100.0) * 0.6 // 1.0 ~ 1.9
        const refThickness = Math.max(8.0, (s.displacementScale * 0.7 + 20.0)) * dpr
        const dispersion = (s.aberrationIntensity / 10.0) * 0.05
        const fresnelFactor = s.overLight ? 0.35 : 0.45
        const glareAngle = (45.0 * Math.PI) / 180.0
        const glareConvergence = 14.0
        const glareOpposite = 0.3

        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_refFactor"), refFactor)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_refThickness"), refThickness)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_dispersion"), dispersion)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_fresnelFactor"), fresnelFactor)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_glareAngle"), glareAngle)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_glareConvergence"), glareConvergence)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_glareOpposite"), glareOpposite)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_overLight"), s.overLight ? 1.0 : 0.0)

        // Feed Registered Elements into Shader Uniforms
        const elements = studio ? studio.getRegisteredElements() : []
        const MAX_ELEMENTS = 24
        const count = Math.min(elements.length, MAX_ELEMENTS)
        gl.uniform1i(gl.getUniformLocation(mainProgram, "u_elementCount"), count)

        for (let i = 0; i < MAX_ELEMENTS; i++) {
          const elLoc = gl.getUniformLocation(mainProgram, `u_elements[${i}]`)
          const radLoc = gl.getUniformLocation(mainProgram, `u_elementRadius[${i}]`)
          const actLoc = gl.getUniformLocation(mainProgram, `u_elementActive[${i}]`)

          if (i < count) {
            const el = elements[i]
            const rect = el.rect
            const centerX = (rect.left + rect.width * 0.5) * dpr
            const centerY = height - (rect.top + rect.height * 0.5) * dpr
            const halfW = (rect.width * 0.5) * dpr
            const halfH = (rect.height * 0.5) * dpr
            const radius = Math.min(el.radius * dpr, Math.min(halfW, halfH))

            gl.uniform4f(elLoc, centerX, centerY, halfW, halfH)
            gl.uniform1f(radLoc, radius)
            gl.uniform1f(actLoc, 1.0)
          } else {
            gl.uniform4f(elLoc, 0, 0, 0, 0)
            gl.uniform1f(radLoc, 0)
            gl.uniform1f(actLoc, 0.0)
          }
        }

        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("resize", resizeFBOs)
      if (wallpaperTex) gl.deleteTexture(wallpaperTex)
      if (bgFbo) {
        gl.deleteTexture(bgFbo.texture)
        gl.deleteFramebuffer(bgFbo.framebuffer)
      }
      if (vBlurFbo) {
        gl.deleteTexture(vBlurFbo.texture)
        gl.deleteFramebuffer(vBlurFbo.framebuffer)
      }
      if (hBlurFbo) {
        gl.deleteTexture(hBlurFbo.texture)
        gl.deleteFramebuffer(hBlurFbo.framebuffer)
      }
      if (quadBuffer) gl.deleteBuffer(quadBuffer)
      if (bgProgram) gl.deleteProgram(bgProgram)
      if (blurProgram) gl.deleteProgram(blurProgram)
      if (mainProgram) gl.deleteProgram(mainProgram)
    }
  }, [wallpaperUrl, studio])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 w-full h-full"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  )
}
