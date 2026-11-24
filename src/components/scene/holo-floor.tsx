import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLiveTheme } from './live-theme'

const vertex = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`

const fragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uTime;
  uniform float uPulse;
  varying vec3 vWorld;
  void main() {
    vec2 uv = vWorld.xz / 1.6;
    uv.y += uTime * 0.6;
    vec2 g = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
    float line = 1.0 - min(min(g.x, g.y), 1.0);
    float dist = length(vWorld.xz);
    float fade = 1.0 - smoothstep(4.0, 34.0, dist);
    float shockRing = uPulse > 0.0 ? smoothstep(2.5, 0.0, abs(dist - (1.0 - uPulse) * 40.0)) * uPulse : 0.0;
    float ripple = pow(sin(dist * 0.9 - uTime * 2.2) * 0.5 + 0.5, 12.0);
    vec3 col = uA * line * 0.55 + uB * ripple * 0.18 + mix(uA, vec3(1.0, 0.91, 0.68), 0.4) * shockRing * 1.4;
    float a = (line * 0.55 + ripple * 0.18 + shockRing) * fade;
    gl_FragColor = vec4(col * fade, a);
  }
`

/** Infinite scrolling holo-grid with a shockwave ring fired on every section switch. */
export function HoloFloor() {
  const live = useLiveTheme()
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPulse: { value: 0 }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() } }),
    [],
  )

  useFrame(() => {
    const l = live.current
    uniforms.uTime.value = l.time
    uniforms.uPulse.value = l.pulse
    uniforms.uA.value.copy(l.primary)
    uniforms.uB.value.copy(l.secondary)
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.6, 0]}>
      <planeGeometry args={[90, 90, 1, 1]} />
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
