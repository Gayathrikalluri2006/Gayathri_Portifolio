import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, ChromaticAberration, EffectComposer, Glitch, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction, GlitchMode, type BloomEffect, type ChromaticAberrationEffect } from 'postprocessing'
import * as THREE from 'three'
import { useLiveTheme } from './live-theme'

export function Effects({ themeKey }: { themeKey: string }) {
  const live = useLiveTheme()
  const chroma = useRef<ChromaticAberrationEffect>(null)
  const bloom = useRef<BloomEffect>(null)
  const [glitching, setGlitching] = useState(false)
  const baseOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0006), [])
  const glitchDelay = useMemo(() => new THREE.Vector2(0, 0.05), [])
  const glitchDuration = useMemo(() => new THREE.Vector2(0.1, 0.25), [])
  const glitchStrength = useMemo(() => new THREE.Vector2(0.15, 0.4), [])
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    setGlitching(true)
    const id = window.setTimeout(() => setGlitching(false), 380)
    return () => window.clearTimeout(id)
  }, [themeKey])

  useFrame(() => {
    const p = live.current.pulse
    const o = 0.0006 + p * p * 0.007
    chroma.current?.offset.set(o, o * 0.6)
    if (bloom.current) bloom.current.intensity = 1.25 + p * 1.6
  })

  return (
    <EffectComposer multisampling={0}>
      <Bloom ref={bloom} mipmapBlur luminanceThreshold={0.12} luminanceSmoothing={0.3} intensity={1.25} radius={0.78} />
      <ChromaticAberration ref={chroma} offset={baseOffset} radialModulation={false} modulationOffset={0} />
      <Glitch
        active={glitching}
        delay={glitchDelay}
        duration={glitchDuration}
        strength={glitchStrength}
        mode={GlitchMode.CONSTANT_MILD}
        ratio={0.6}
      />
      <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={0.18} />
      <Vignette eskil={false} offset={0.2} darkness={0.85} />
    </EffectComposer>
  )
}
