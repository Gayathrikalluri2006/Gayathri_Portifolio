import { useMemo, useRef, type MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, Sparkles, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { LiveThemeProvider, themeKey, useLiveTheme } from './live-theme'
import { PlasmaCore } from './plasma-core'
import { ParticleGalaxy } from './particle-galaxy'
import { NeuralWeb } from './neural-web'
import { WarpStreaks } from './warp-streaks'
import { HoloFloor } from './holo-floor'
import { Effects } from './effects'
import { OrbitalRings } from './orbital-rings'
import { ServiceMesh } from './service-mesh'
import type { SceneTheme } from '../../data/portfolio'

type SceneProps = {
  theme: SceneTheme
  scrollRef: MutableRefObject<number>
}

function useIsWide() {
  const width = useThree((s) => s.size.width)
  return width >= 1024
}

function CameraRig({ theme, scrollRef }: SceneProps) {
  const isWide = useIsWide()
  const target = useMemo(() => new THREE.Vector3(), [])
  const look = useRef(new THREE.Vector3())
  const lookTarget = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const k = 1 - Math.exp(-dt * 1.8)
    const s = scrollRef.current
    const [x, y, z] = theme.camera
    const zoomOut = isWide ? 0 : 3.5
    const orbit = s * Math.PI * 0.85
    target.set(
      x + Math.sin(orbit) * 2.2 + state.pointer.x * 0.8,
      y + state.pointer.y * 0.5 - s * 1.8 + Math.sin(s * Math.PI) * 0.8,
      z + zoomOut + s * 1.6 + Math.cos(orbit) * 0.5,
    )
    state.camera.position.lerp(target, k)
    lookTarget.set(Math.sin(orbit) * 0.45, -s * 0.8, 0)
    look.current.lerp(lookTarget, k)
    state.camera.lookAt(look.current)
  })
  return null
}

function CoreSystem({ theme }: { theme: SceneTheme }) {
  const isWide = useIsWide()
  const group = useRef<THREE.Group>(null)
  const tilt = useRef<THREE.Group>(null)
  const target = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const k = 1 - Math.exp(-dt * 2)
    const [ox, oy, oz] = theme.coreOffset
    target.set(isWide ? ox : 0, isWide ? oy : 1.2, oz)
    group.current?.position.lerp(target, k)
    if (tilt.current) {
      tilt.current.rotation.x += (-state.pointer.y * 0.35 - tilt.current.rotation.x) * k
      tilt.current.rotation.y += (state.pointer.x * 0.5 - tilt.current.rotation.y) * k
    }
  })

  return (
    <group ref={group}>
      <group ref={tilt}>
        <PlasmaCore geometry={theme.geometry} />
        <OrbitalRings />
        <ServiceMesh />
        <NeuralWeb />
        <ParticleGalaxy />
      </group>
    </group>
  )
}

function ThemedLights() {
  const live = useLiveTheme()
  const a = useRef<THREE.PointLight>(null)
  const b = useRef<THREE.PointLight>(null)
  useFrame(() => {
    a.current?.color.copy(live.current.primary)
    b.current?.color.copy(live.current.secondary)
  })
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight ref={a} position={[4, 4, 5]} intensity={60} distance={30} />
      <pointLight ref={b} position={[-5, -3, -2]} intensity={40} distance={30} />
    </>
  )
}

export default function Scene({ theme, scrollRef }: SceneProps) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 12], fov: 45, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' }}
      eventSource={document.getElementById('root') ?? undefined}
      eventPrefix="client"
      aria-hidden="true"
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 32]} />
      <LiveThemeProvider theme={theme}>
        <ThemedLights />
        <CameraRig theme={theme} scrollRef={scrollRef} />
        <CoreSystem theme={theme} />
        <WarpStreaks />
        <HoloFloor />
        <Effects themeKey={themeKey(theme)} />
      </LiveThemeProvider>
      <Stars radius={50} depth={40} count={1800} factor={3} saturation={0} fade speed={0.6} />
      <Sparkles count={120} scale={[16, 10, 10]} size={2} speed={0.35} opacity={0.5} color={theme.secondary} />
      <AdaptiveDpr pixelated />
    </Canvas>
  )
}
