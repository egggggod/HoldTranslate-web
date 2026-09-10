/**
 * WebGL2 MultiPass Pipeline & Texture Utilities
 * Adapted from iyinchao/liquid-glass-studio
 */

export function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error("Failed to create WebGLShader")
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader compile error: ${info}\nSource:\n${source}`)
  }
  return shader
}

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexShaderSource: string,
  fragmentShaderSource: string,
): WebGLProgram {
  const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  const program = gl.createProgram()
  if (!program) throw new Error("Failed to create WebGLProgram")
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(`Program link error: ${info}`)
  }
  return program
}

export interface FBO {
  framebuffer: WebGLFramebuffer
  texture: WebGLTexture
  width: number
  height: number
}

export function createFBO(gl: WebGL2RenderingContext, width: number, height: number): FBO {
  const texture = gl.createTexture()
  if (!texture) throw new Error("Failed to create texture")

  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  )
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const framebuffer = gl.createFramebuffer()
  if (!framebuffer) throw new Error("Failed to create framebuffer")
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  )

  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    throw new Error(`Framebuffer incomplete: ${status}`)
  }

  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  gl.bindTexture(gl.TEXTURE_2D, null)

  return { framebuffer, texture, width, height }
}

export function createQuadBuffer(gl: WebGL2RenderingContext): WebGLBuffer {
  const buffer = gl.createBuffer()
  if (!buffer) throw new Error("Failed to create quad buffer")
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  // Two triangles covering clip-space [-1, 1]
  const positions = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
  ])
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  return buffer
}

export function loadTexture(
  gl: WebGL2RenderingContext,
  url: string,
  onLoad?: (img: HTMLImageElement, tex: WebGLTexture) => void,
): WebGLTexture {
  const texture = gl.createTexture()
  if (!texture) throw new Error("Failed to create texture")

  // Default 1x1 placeholder pixel
  gl.bindTexture(gl.TEXTURE_2D, texture)
  const pixel = new Uint8Array([30, 41, 59, 255])
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    pixel,
  )

  const image = new Image()
  image.crossOrigin = "anonymous"
  image.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      image,
    )
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.bindTexture(gl.TEXTURE_2D, null)
    if (onLoad) onLoad(image, texture)
  }
  image.src = url
  return texture
}

export function computeGaussianKernelByRadius(radius: number): number[] {
  const r = Math.max(1, Math.min(32, Math.round(radius)))
  const sigma = Math.max(0.01, r / 3.0)
  const kernel: number[] = []
  let sum = 0
  for (let i = 0; i <= r; i++) {
    const weight = Math.exp(-0.5 * (i * i) / (sigma * sigma))
    kernel.push(weight)
    sum += i === 0 ? weight : weight * 2
  }
  return kernel.map((w) => w / sum)
}
