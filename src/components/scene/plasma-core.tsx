import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLiveTheme } from './live-theme'
import { simplexNoise } from './glsl'
import type { GeometryKind } from '../../data/portfolio'

const plasmaVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPulse;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDisp;
  ${simplexNoise}
  void main() {
    float n = snoise(normal * 1.4 + vec3(uTime * 0.45));
    float n2 = snoise(normal * 4.2 - vec3(uTime * 0.9)) * 0.35;
    float d = (n + n2) * (0.2 + uPulse * 0.45);
    vec3 p = position + normal * d;
    vDisp = d;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = normalize(-mv.xyz);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`

const plasmaFragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uTime;
  uniform float uPulse;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vDisp;
  void main() {
    float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
    vec3 col = mix(uB, uA, smoothstep(-0.25, 0.35, vDisp));
    col *= 0.25 + max(vDisp, 0.0) * 2.6;
    float bands = smoothstep(0.9, 1.0, sin(vDisp * 55.0 + uTime * 3.0));
    col += bands * uA * (0.7 + uPulse);
    col += fres * mix(uB, vec3(1.0, 0.91, 0.68), 0.2) * 1.4;
    gl_FragColor = vec4(col, 1.0);
  }
`

const haloVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vView = normalize(-mv.xyz);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`

const haloFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float rim = pow(max(dot(vNormal, vView), 0.0), 3.0);
    gl_FragColor = vec4(uColor * rim * uIntensity, rim);
  }
`

function ShellGeometry({ kind }: { kind: GeometryKind }) {
  switch (kind) {
    case 'torusKnot':
      return <torusKnotGeometry args={[1.55, 0.3, 160, 12]} />
    case 'octahedron':
      return <octahedronGeometry args={[2.4, 1]} />
    case 'dodecahedron':
      return <dodecahedronGeometry args={[2.3, 0]} />
    case 'box':
      return <boxGeometry args={[3, 3, 3, 4, 4, 4]} />
    default:
      return <icosahedronGeometry args={[2.3, 1]} />
  }
}

function MorphShell({ kind }: { kind: GeometryKind }) {
  const live = useLiveTheme()
  const group = useRef<THREE.Group>(null)
  const lineMat = useRef<THREE.MeshBasicMaterial>(null)
  const pointMat = useRef<THREE.PointsMaterial>(null)

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    const g = group.current
    if (!g) return
    const l = live.current
    const s = g.scale.x + (1 - g.scale.x) * (1 - Math.exp(-dt * 3.5))
    g.scale.setScalar(s)
    g.rotation.x -= dt * 0.15 * l.speed
    g.rotation.y += dt * 0.22 * l.speed
    lineMat.current?.color.copy(l.secondary)
    pointMat.current?.color.copy(l.primary)
  })

  return (
    <group ref={group} scale={0.3}>
      <mesh>
        <ShellGeometry kind={kind} />
        <meshBasicMaterial ref={lineMat} wireframe transparent opacity={0.28} toneMapped={false} />
      </mesh>
      <points>
        <ShellGeometry kind={kind} />
        <pointsMaterial ref={pointMat} size={0.07} sizeAttenuation transparent opacity={0.9} toneMapped={false} />
      </points>
    </group>
  )
}

export function PlasmaCore({ geometry }: { geometry: GeometryKind }) {
  const live = useLiveTheme()
  const core = useRef<THREE.Mesh>(null)

  const plasmaUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uA: { value: new THREE.Color() },
      uB: { value: new THREE.Color() },
    }),
    [],
  )
  const haloUniforms = useMemo(() => ({ uColor: { value: new THREE.Color() }, uIntensity: { value: 1 } }), [])

  useFrame((_, delta) => {
    const l = live.current
    plasmaUniforms.uTime.value = l.time
    plasmaUniforms.uPulse.value = l.pulse
    plasmaUniforms.uA.value.copy(l.primary)
    plasmaUniforms.uB.value.copy(l.secondary)
    haloUniforms.uColor.value.copy(l.primary)
    haloUniforms.uIntensity.value = 0.9 + l.pulse * 1.6
    if (core.current) core.current.rotation.y += Math.min(delta, 0.1) * 0.2
  })

  return (
    <group>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.35, 48]} />
        <shaderMaterial vertexShader={plasmaVertex} fragmentShader={plasmaFragment} uniforms={plasmaUniforms} toneMapped={false} />
      </mesh>
      <mesh scale={1.85}>
        <sphereGeometry args={[1.35, 48, 48]} />
        <shaderMaterial
          vertexShader={haloVertex}
          fragmentShader={haloFragment}
          uniforms={haloUniforms}
          side={THREE.BackSide}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <MorphShell key={geometry} kind={geometry} />
    </group>
  )
}
