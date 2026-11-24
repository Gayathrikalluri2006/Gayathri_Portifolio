import { createContext, useContext, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { SceneTheme } from '../../data/portfolio'

export type LiveTheme = {
  primary: THREE.Color
  secondary: THREE.Color
  speed: number
  time: number
  /** 1 right after a section/project switch, decays to 0 — drives warp, glitch and shockwaves. */
  pulse: number
}

const LiveThemeContext = createContext<MutableRefObject<LiveTheme> | null>(null)

export function useLiveTheme() {
  const ctx = useContext(LiveThemeContext)
  if (!ctx) throw new Error('useLiveTheme must be used inside LiveThemeProvider')
  return ctx
}

export function themeKey(theme: SceneTheme) {
  return `${theme.primary}|${theme.secondary}|${theme.geometry}|${theme.camera.join(',')}`
}

export function LiveThemeProvider({ theme, children }: { theme: SceneTheme; children: ReactNode }) {
  const live = useRef<LiveTheme>({
    primary: new THREE.Color(theme.primary),
    secondary: new THREE.Color(theme.secondary),
    speed: theme.speed,
    time: 0,
    pulse: 1,
  })
  const targetPrimary = useMemo(() => new THREE.Color(theme.primary), [theme.primary])
  const targetSecondary = useMemo(() => new THREE.Color(theme.secondary), [theme.secondary])
  const key = themeKey(theme)

  useEffect(() => {
    live.current.pulse = 1
  }, [key])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    const k = 1 - Math.exp(-dt * 2.5)
    const l = live.current
    l.primary.lerp(targetPrimary, k)
    l.secondary.lerp(targetSecondary, k)
    l.speed += (theme.speed - l.speed) * k
    l.pulse = Math.max(0, l.pulse - dt * 0.9)
    l.time += dt * (l.speed + l.pulse * l.pulse * 5)
  })

  return <LiveThemeContext.Provider value={live}>{children}</LiveThemeContext.Provider>
}
