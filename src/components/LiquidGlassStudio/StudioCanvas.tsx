"use client"

import React, { useEffect, useRef } from "react"
import {
  createProgram,
  createQuadBuffer,
  createFBO,
  loadTexture,
  computeGaussianKernelByRadius,
  type FBO,
} from "./GLUtils"
import {
  vertexShader,
  bgFragmentShader,
  vBlurFragmentShader,
  hBlurFragmentShader,
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

  // Spring cursor state (Apple fluid physics)
  const mouseStateRef = useRef({
    targetX: -2000,
    targetY: -2000,
    currentX: -2000,
    currentY: -2000,
    vx: 0,
    vy: 0,
    inside: false,
  })

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
      console.warn("WebGL2 is not supported. Gracefully degrading to SVG fallback.")
      studio?.setIsStudioEnabled(false)
      return
    }

    let quadBuffer: WebGLBuffer | null = null
    let bgProgram: WebGLProgram | null = null
    let vBlurProgram: WebGLProgram | null = null
    let hBlurProgram: WebGLProgram | null = null
    let mainProgram: WebGLProgram | null = null

    try {
      quadBuffer = createQuadBuffer(gl)
      bgProgram = createProgram(gl, vertexShader, bgFragmentShader)
      vBlurProgram = createProgram(gl, vertexShader, vBlurFragmentShader)
      hBlurProgram = createProgram(gl, vertexShader, hBlurFragmentShader)
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
        vBlurFbo = createFBO(gl, width, height)
        hBlurFbo = createFBO(gl, width, height)
      }
    }

    resizeFBOs()
    window.addEventListener("resize", resizeFBOs)

    // High-performance render pass
    const drawFrame = () => {
      if (!canvas || !gl || !bgProgram || !vBlurProgram || !hBlurProgram || !mainProgram || !quadBuffer) {
        return
      }

      // Spring mouse interpolation
      const m = mouseStateRef.current
      if (m.inside) {
        const stiffness = 0.22
        const damping = 0.70
        m.vx = (m.targetX - m.currentX) * stiffness + m.vx * damping
        m.vy = (m.targetY - m.currentY) * stiffness + m.vy * damping
        m.currentX += m.vx
        m.currentY += m.vy
      } else {
        m.currentX = -3000
        m.currentY = -3000
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

      // Compute Gaussian weights for separable blur passes
      const blurRad = Math.max(1, Math.min(32, s.blurRadius || 2))
      const weights = computeGaussianKernelByRadius(blurRad)
      const fullWeights = new Float32Array(33)
      for (let i = 0; i < weights.length; i++) {
        fullWeights[i] = weights[i]
      }

      // ==========================================
      // PASS 2: Vertical Gaussian Blur -> vBlurFbo
      // ==========================================
      if (bgFbo && vBlurFbo) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, vBlurFbo.framebuffer)
        gl.viewport(0, 0, vBlurFbo.width, vBlurFbo.height)
        gl.useProgram(vBlurProgram)

        const posLoc = gl.getAttribLocation(vBlurProgram, "a_position")
        gl.enableVertexAttribArray(posLoc)
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, bgFbo.texture)
        gl.uniform1i(gl.getUniformLocation(vBlurProgram, "u_image"), 0)
        gl.uniform2f(gl.getUniformLocation(vBlurProgram, "u_resolution"), vBlurFbo.width, vBlurFbo.height)
        gl.uniform1i(gl.getUniformLocation(vBlurProgram, "u_blurRadius"), blurRad)
        const vWeightsLoc = gl.getUniformLocation(vBlurProgram, "u_blurWeights[0]") || gl.getUniformLocation(vBlurProgram, "u_blurWeights")
        gl.uniform1fv(vWeightsLoc, fullWeights)

        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      // ==========================================
      // PASS 3: Horizontal Gaussian Blur -> hBlurFbo
      // ==========================================
      if (vBlurFbo && hBlurFbo) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, hBlurFbo.framebuffer)
        gl.viewport(0, 0, hBlurFbo.width, hBlurFbo.height)
        gl.useProgram(hBlurProgram)

        const posLoc = gl.getAttribLocation(hBlurProgram, "a_position")
        gl.enableVertexAttribArray(posLoc)
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

        gl.activeTexture(gl.TEXTURE0)
        gl.bindTexture(gl.TEXTURE_2D, vBlurFbo.texture)
        gl.uniform1i(gl.getUniformLocation(hBlurProgram, "u_image"), 0)
        gl.uniform2f(gl.getUniformLocation(hBlurProgram, "u_resolution"), hBlurFbo.width, hBlurFbo.height)
        gl.uniform1i(gl.getUniformLocation(hBlurProgram, "u_blurRadius"), blurRad)
        const hWeightsLoc = gl.getUniformLocation(hBlurProgram, "u_blurWeights[0]") || gl.getUniformLocation(hBlurProgram, "u_blurWeights")
        gl.uniform1fv(hWeightsLoc, fullWeights)

        gl.drawArrays(gl.TRIANGLES, 0, 6)
      }

      // ==========================================
      // PASS 4: Official STEP 9 Main Pipeline -> Screen
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

        // Screen Resolution & DPR
        gl.uniform2f(gl.getUniformLocation(mainProgram, "u_resolution"), width, height)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_dpr"), dpr)

        // Cursor drop coordinates (WebGL origin at bottom-left)
        const mouseX = m.targetX * dpr
        const mouseY = height - m.targetY * dpr
        const springX = m.currentX * dpr
        const springY = height - m.currentY * dpr

        gl.uniform2f(gl.getUniformLocation(mainProgram, "u_mouse"), mouseX, mouseY)
        gl.uniform2f(gl.getUniformLocation(mainProgram, "u_mouseSpring"), springX, springY)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_cursorRadius"), 22.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_cursorEnabled"), m.inside ? 1.0 : 0.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_mergeRate"), s.mergeRate ?? 0.035)

        // Studio Official Physical Optical Parameters (matching iyinchao/liquid-glass-studio production values)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_refThickness"), s.refThickness ?? 20.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_refDistance"), s.refDistance ?? 0.05)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_refFactor"), s.refFactor ?? 1.4)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_refDispersion"), s.refDispersion ?? 7.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_refFresnelRange"), 30.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_refFresnelFactor"), (s.refFresnelFactor ?? 20.0) / 100.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_refFresnelHardness"), 20.0 / 100.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_glareRange"), 30.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_glareConvergence"), (s.glareConvergence ?? 50.0) / 100.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_glareOppositeFactor"), 80.0 / 100.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_glareFactor"), (s.glareFactor ?? 90.0) / 100.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_glareHardness"), 20.0 / 100.0)
        gl.uniform1f(
          gl.getUniformLocation(mainProgram, "u_glareAngle"),
          ((s.glareAngle ?? -45.0) * Math.PI) / 180.0,
        )
        gl.uniform1i(gl.getUniformLocation(mainProgram, "u_blurEdge"), 1)
        gl.uniform4f(gl.getUniformLocation(mainProgram, "u_tint"), 1.0, 1.0, 1.0, 0.0)

        // Directional shadow
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_shadowExpand"), s.shadowExpand ?? 25.0)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_shadowFactor"), (s.shadowFactor ?? 15.0) / 100.0)
        gl.uniform2f(gl.getUniformLocation(mainProgram, "u_shadowPosition"), 0.0, -10.0)

        // Squircle Roundness (3.5 for Apple continuous G2 curvature)
        gl.uniform1f(gl.getUniformLocation(mainProgram, "u_shapeRoundness"), s.shapeRoundness ?? 3.5)

        // Pass registered DOM elements
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
            const widthPixels = rect.width * dpr
            const heightPixels = rect.height * dpr
            const radius = Math.min(el.radius * dpr, Math.min(widthPixels, heightPixels) * 0.5)

            gl.uniform4f(elLoc, centerX, centerY, widthPixels, heightPixels)
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
    }

    const loop = () => {
      drawFrame()
      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)

    // Instant Scroll Sync: immediately redraws WebGL upon receiving scroll event
    const handleScroll = () => {
      drawFrame()
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("scroll", handleScroll)
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
      if (vBlurProgram) gl.deleteProgram(vBlurProgram)
      if (hBlurProgram) gl.deleteProgram(hBlurProgram)
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
