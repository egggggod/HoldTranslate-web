"use client"

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react"

export interface StudioElementData {
  id: string
  rect: DOMRect
  radius: number
  active: boolean
}

export interface CachedElement {
  el: HTMLElement
  radius: number
  // Absolute page coordinates (relative to document body)
  pageLeft: number
  pageTop: number
  width: number
  height: number
}

export interface StudioContextType {
  registerElement: (id: string, el: HTMLElement, radius: number) => void
  unregisterElement: (id: string) => void
  getRegisteredElements: () => StudioElementData[]
  remeasureAll: () => void
  isStudioEnabled: boolean
  setIsStudioEnabled: (val: boolean) => void
}

const StudioContext = createContext<StudioContextType | null>(null)

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const elementsMapRef = useRef<Map<string, CachedElement>>(new Map())
  const [isStudioEnabled, setIsStudioEnabled] = useState(true)

  const measureElement = useCallback((el: HTMLElement, radius: number): CachedElement => {
    const rect = el.getBoundingClientRect()
    const scrollX = typeof window !== "undefined" ? window.scrollX || window.pageXOffset || 0 : 0
    const scrollY = typeof window !== "undefined" ? window.scrollY || window.pageYOffset || 0 : 0
    return {
      el,
      radius,
      pageLeft: rect.left + scrollX,
      pageTop: rect.top + scrollY,
      width: rect.width,
      height: rect.height,
    }
  }, [])

  const remeasureAll = useCallback(() => {
    const scrollX = typeof window !== "undefined" ? window.scrollX || window.pageXOffset || 0 : 0
    const scrollY = typeof window !== "undefined" ? window.scrollY || window.pageYOffset || 0 : 0

    elementsMapRef.current.forEach((cached, id) => {
      if (cached.el && cached.el.isConnected) {
        const rect = cached.el.getBoundingClientRect()
        cached.pageLeft = rect.left + scrollX
        cached.pageTop = rect.top + scrollY
        cached.width = rect.width
        cached.height = rect.height
      } else {
        elementsMapRef.current.delete(id)
      }
    })
  }, [])

  useEffect(() => {
    const handleResize = () => {
      remeasureAll()
    }
    window.addEventListener("resize", handleResize, { passive: true })
    window.addEventListener("orientationchange", handleResize, { passive: true })

    // Observer on document body to catch layout shifts
    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined" && typeof document !== "undefined" && document.body) {
      ro = new ResizeObserver(() => {
        remeasureAll()
      })
      ro.observe(document.body)
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
      ro?.disconnect()
    }
  }, [remeasureAll])

  const registerElement = useCallback(
    (id: string, el: HTMLElement, radius: number) => {
      const data = measureElement(el, radius)
      elementsMapRef.current.set(id, data)
    },
    [measureElement],
  )

  const unregisterElement = useCallback((id: string) => {
    elementsMapRef.current.delete(id)
  }, [])

  const getRegisteredElements = useCallback((): StudioElementData[] => {
    const list: StudioElementData[] = []
    const winH = typeof window !== "undefined" ? window.innerHeight : 1080
    const winW = typeof window !== "undefined" ? window.innerWidth : 1920
    const scrollX = typeof window !== "undefined" ? window.scrollX || window.pageXOffset || 0 : 0
    const scrollY = typeof window !== "undefined" ? window.scrollY || window.pageYOffset || 0 : 0

    elementsMapRef.current.forEach((cached, id) => {
      // Pure mathematical offset: zero DOM reflow during scrolling
      const top = cached.pageTop - scrollY
      const left = cached.pageLeft - scrollX
      const bottom = top + cached.height
      const right = left + cached.width

      // Only include elements visible in or adjacent to the viewport
      if (
        cached.width > 0 &&
        cached.height > 0 &&
        bottom >= -60 &&
        top <= winH + 60 &&
        right >= -60 &&
        left <= winW + 60
      ) {
        list.push({
          id,
          rect: new DOMRect(left, top, cached.width, cached.height),
          radius: cached.radius,
          active: true,
        })
      }
    })
    return list
  }, [])

  return (
    <StudioContext.Provider
      value={{
        registerElement,
        unregisterElement,
        getRegisteredElements,
        remeasureAll,
        isStudioEnabled,
        setIsStudioEnabled,
      }}
    >
      {children}
    </StudioContext.Provider>
  )
}

export function useStudio() {
  return useContext(StudioContext)
}

export function useStudioElement(
  id: string,
  elementRef: React.RefObject<HTMLElement | null>,
  radius = 24,
  enabled = true,
) {
  const studio = useStudio()

  useEffect(() => {
    if (!studio || !enabled) return

    const el = elementRef.current
    if (!el) return

    studio.registerElement(id, el, radius)

    // ResizeObserver on the individual element to update bounds if size changes
    let ro: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        if (elementRef.current) {
          studio.registerElement(id, elementRef.current, radius)
        }
      })
      ro.observe(el)
    }

    return () => {
      ro?.disconnect()
      studio.unregisterElement(id)
    }
  }, [studio, id, elementRef, radius, enabled])

  return {
    isStudioActive: Boolean(studio?.isStudioEnabled),
  }
}
