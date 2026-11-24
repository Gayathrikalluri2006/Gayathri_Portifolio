import { useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useLiveTheme } from './live-theme'

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  uniform float uSize;
  uniform vec3 uA;
  uniform vec3 uB;
  attribute float aRadius;
  attribute float aAngle;
  attribute float aHeight;
  attribute float aRand;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float r = aRadius;
    float ang = aAngle + uTime * (0.9 / (0.5 + r * 0.3));
    vec3 p = vec3(cos(ang) * r, aHeight * (0.25 + 0.06 * r), sin(ang) * r);
    p.y += sin(ang * 3.0 + uTime) * 0.08;
    p += normalize(p + 0.0001) * uPulse * uPulse * aRand * 3.5;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * (0.35 + aRand) / -mv.z;
    vColor = mix(uA, uB, smoothstep(2.5, 10.0, r));
    vColor = mix(vColor, vec3(1.0, 0.91, 0.68), step(0.985, aRand) * 0.8);
    vAlpha = (0.35 + aRand * 0.65) * (1.0 - smoothstep(9.0, 13.0, r));
  }
`

const fragment = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = a * a * vAlpha;
    gl_FragColor = vec4(vColor * a * 1.6, a);
  }
`

function buildGalaxy(count: number) {
  const radius = new Float32Array(count)
  const angle = new Float32Array(count)
  const height = new Float32Array(count)
  const rand = new Float32Array(count)
  const arms = 4
  for (let i = 0; i < count; i++) {
    const r = 2.4 + Math.pow(Math.random(), 1.7) * 10
    const arm = ((i % arms) / arms) * Math.PI * 2
    const spread = (Math.random() - 0.5) * (0.9 - Math.min(r / 14, 0.6))
    radius[i] = r
    angle[i] = arm + r * 0.42 + spread * 2.2
    height[i] = (Math.random() + Math.random() + Math.random() - 1.5) * 1.4
    rand[i] = Math.random()
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
  geo.setAttribute('aRadius', new THREE.BufferAttribute(radius, 1))
  geo.setAttribute('aAngle', new THREE.BufferAttribute(angle, 1))
  geo.setAttribute('aHeight', new THREE.BufferAttribute(height, 1))
  geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
  return geo
}

export function ParticleGalaxy() {
  const live = useLiveTheme()
  const isWide = useThree((s) => s.size.width >= 768)
  const dpr = useThree((s) => s.viewport.dpr)
  const geometry = useMemo(() => buildGalaxy(isWide ? 22000 : 9000), [isWide])
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uSize: { value: 0 },
      uA: { value: new THREE.Color() },
      uB: { value: new THREE.Color() },
    }),
    [],
  )

  useFrame(() => {
    const l = live.current
    uniforms.uTime.value = l.time
    uniforms.uPulse.value = l.pulse
    uniforms.uSize.value = 34 * dpr
    uniforms.uA.value.copy(l.primary)
    uniforms.uB.value.copy(l.secondary)
  })

  return (
    <points geometry={geometry} rotation={[0.38, 0, 0.12]} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
