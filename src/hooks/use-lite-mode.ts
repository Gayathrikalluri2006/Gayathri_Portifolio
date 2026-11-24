import { useCallback, useState } from 'react'

const STORAGE_KEY = 'gk-lite-mode'

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

function initialLiteMode() {
  if (typeof window === 'undefined') return false
  if (!supportsWebGL()) return true
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored !== null) return stored === '1'
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useLiteMode() {
  const [lite, setLite] = useState(initialLiteMode)
  const [webgl] = useState(() => typeof window !== 'undefined' && supportsWebGL())

  const toggle = useCallback(() => {
    setLite((prev) => {
      const next = webgl ? !prev : true
      window.localStorage.setItem(STORAGE_KEY, next ? '1' : '0')
      return next
    })
  }, [webgl])

  return { lite, toggle, webgl }
}
