"use client"

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react"

export interface StudioElementData {
  id: string
  rect: DOMRect
  radius: number
  active: boolean
}

export interface StudioContextType {
  registerElement: (id: string, getInfo: () => { rect: DOMRect; radius: number }) => void
  unregisterElement: (id: string) => void
  getRegisteredElements: () => StudioElementData[]
  isStudioEnabled: boolean
  setIsStudioEnabled: (val: boolean) => void
}

const StudioContext = createContext<StudioContextType | null>(null)

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const elementsRef = useRef<Map<string, () => { rect: DOMRect; radius: number }>>(new Map())
  const [isStudioEnabled, setIsStudioEnabled] = useState(true)

  const registerElement = useCallback((id: string, getInfo: () => { rect: DOMRect; radius: number }) => {
    elementsRef.current.set(id, getInfo)
  }, [])

  const unregisterElement = useCallback((id: string) => {
    elementsRef.current.delete(id)
  }, [])

  const getRegisteredElements = useCallback((): StudioElementData[] => {
    const list: StudioElementData[] = []
    const winH = typeof window !== "undefined" ? window.innerHeight : 1080
    const winW = typeof window !== "undefined" ? window.innerWidth : 1920

    elementsRef.current.forEach((getInfo, id) => {
      try {
        const { rect, radius } = getInfo()
        // Only include if element has size and is near the viewport
        if (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom >= -50 &&
          rect.top <= winH + 50 &&
          rect.right >= -50 &&
          rect.left <= winW + 50
        ) {
          list.push({
            id,
            rect,
            radius,
            active: true,
          })
        }
      } catch {
        // Element may have unmounted
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

    studio.registerElement(id, () => {
      const el = elementRef.current
      if (!el) {
        return {
          rect: new DOMRect(0, 0, 0, 0),
          radius,
        }
      }
      return {
        rect: el.getBoundingClientRect(),
        radius,
      }
    })

    return () => {
      studio.unregisterElement(id)
    }
  }, [studio, id, elementRef, radius, enabled])

  return {
    isStudioActive: Boolean(studio?.isStudioEnabled),
  }
}
