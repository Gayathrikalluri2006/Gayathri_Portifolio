import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLiveTheme } from './live-theme'

const RINGS = [
  { radius: 2.2, tilt: [Math.PI / 2.3, 0, 0.2], speed: 0.55, packets: 3, usePrimary: true },
  { radius: 2.7, tilt: [Math.PI / 1.8, 0.6, -0.3], speed: -0.4, packets: 2, usePrimary: false },
  { radius: 3.2, tilt: [Math.PI / 2.6, -0.5, 0.9], speed: 0.28, packets: 4, usePrimary: true },
] as const

function Ring({ radius, tilt, speed, packets, usePrimary }: (typeof RINGS)[number]) {
  const live = useLiveTheme()
  const spinner = useRef<THREE.Group>(null)
  const ringMat = useRef<THREE.MeshBasicMaterial>(null)
  const packetMats = useRef<(THREE.MeshBasicMaterial | null)[]>([])

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    const l = live.current
    if (spinner.current) spinner.current.rotation.z += dt * speed * l.speed
    const color = usePrimary ? l.primary : l.secondary
    ringMat.current?.color.copy(color)
    packetMats.current.forEach((m) => m?.color.copy(usePrimary ? l.secondary : l.primary))
  })

  return (
    <group rotation={tilt as unknown as [number, number, number]}>
      <group ref={spinner}>
        <mesh>
          <torusGeometry args={[radius, 0.035, 8, 160]} />
          <meshStandardMaterial color="#171719" metalness={0.88} roughness={0.38} />
        </mesh>
        <mesh>
          <torusGeometry args={[radius, 0.008, 8, 160]} />
          <meshBasicMaterial ref={ringMat} transparent opacity={0.55} toneMapped={false} />
        </mesh>
        {Array.from({ length: packets }).map((_, i) => {
          const a = (i / packets) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * radius, Math.sin(a) * radius, 0]}>
              <sphereGeometry args={[0.055, 12, 12]} />
              <meshBasicMaterial
                ref={(m) => {
                  packetMats.current[i] = m
                }}
                toneMapped={false}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

export function OrbitalRings() {
  return (
    <group>
      {RINGS.map((r, i) => (
        <Ring key={i} {...r} />
      ))}
    </group>
  )
}
