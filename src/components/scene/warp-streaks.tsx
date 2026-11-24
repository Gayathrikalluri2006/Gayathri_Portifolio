import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLiveTheme } from './live-theme'

const RANGE = 70

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  attribute vec3 aSeed;
  attribute float aEnd;
  varying float vFade;
  varying float vEnd;
  void main() {
    float z = -50.0 + mod(aSeed.z + uTime, ${RANGE.toFixed(1)});
    float len = 0.25 + uPulse * uPulse * 9.0;
    vec3 p = vec3(aSeed.xy, z - aEnd * len);
    vFade = smoothstep(-50.0, -32.0, z) * (1.0 - smoothstep(6.0, 16.0, z));
    vEnd = aEnd;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uPulse;
  varying float vFade;
  varying float vEnd;
  void main() {
    vec3 col = mix(vec3(1.0, 0.91, 0.68), mix(uA, uB, vEnd), 0.7);
    float a = vFade * (1.0 - vEnd * 0.9) * (0.18 + uPulse * 1.6);
    gl_FragColor = vec4(col * a, a);
  }
`

function buildStreaks(count: number) {
  const seeds = new Float32Array(count * 2 * 3)
  const ends = new Float32Array(count * 2)
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2
    const r = 3 + Math.pow(Math.random(), 0.7) * 16
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r * 0.7
    const z = Math.random() * RANGE
    for (let e = 0; e < 2; e++) {
      const idx = i * 2 + e
      seeds.set([x, y, z], idx * 3)
      ends[idx] = e
    }
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 2 * 3), 3))
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 3))
  geo.setAttribute('aEnd', new THREE.BufferAttribute(ends, 1))
  return geo
}

/** Data streaks that idle as drifting light and stretch into hyperspace on every section switch. */
export function WarpStreaks() {
  const live = useLiveTheme()
  const geometry = useMemo(() => buildStreaks(1100), [])
  const warpTime = useRef(0)
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPulse: { value: 0 }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() } }),
    [],
  )

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    const l = live.current
    warpTime.current += dt * (2.5 + l.pulse * l.pulse * 70)
    uniforms.uTime.value = warpTime.current
    uniforms.uPulse.value = l.pulse
    uniforms.uA.value.copy(l.primary)
    uniforms.uB.value.copy(l.secondary)
  })

  return (
    <lineSegments geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  )
}
