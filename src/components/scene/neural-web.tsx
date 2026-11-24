import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLiveTheme } from './live-theme'

const NODE_COUNT = 72
const LINKS_PER_NODE = 2

const lineVertex = /* glsl */ `
  attribute float aT;
  attribute float aPhase;
  varying float vT;
  varying float vPhase;
  void main() {
    vT = aT;
    vPhase = aPhase;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const lineFragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform float uTime;
  uniform float uPulse;
  varying float vT;
  varying float vPhase;
  void main() {
    float head = fract(uTime * 0.32 + vPhase);
    float signal = smoothstep(0.14, 0.0, abs(vT - head));
    vec3 col = mix(uB, uA, signal);
    float a = 0.07 + signal * (1.1 + uPulse * 1.5);
    gl_FragColor = vec4(col * a, a);
  }
`

function buildWeb() {
  const nodes: THREE.Vector3[] = []
  for (let i = 0; i < NODE_COUNT; i++) {
    const dir = new THREE.Vector3().randomDirection()
    dir.y *= 0.6
    nodes.push(dir.normalize().multiplyScalar(4.2 + Math.random() * 3.2))
  }

  const positions: number[] = []
  const ts: number[] = []
  const phases: number[] = []
  const seen = new Set<string>()
  nodes.forEach((node, i) => {
    const nearest = nodes
      .map((other, j) => ({ j, d: node.distanceToSquared(other) }))
      .filter(({ j }) => j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, LINKS_PER_NODE)
    nearest.forEach(({ j }) => {
      const id = i < j ? `${i}-${j}` : `${j}-${i}`
      if (seen.has(id)) return
      seen.add(id)
      const phase = Math.random()
      positions.push(node.x, node.y, node.z, nodes[j].x, nodes[j].y, nodes[j].z)
      ts.push(0, 1)
      phases.push(phase, phase)
    })
  })

  const lines = new THREE.BufferGeometry()
  lines.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  lines.setAttribute('aT', new THREE.Float32BufferAttribute(ts, 1))
  lines.setAttribute('aPhase', new THREE.Float32BufferAttribute(phases, 1))

  const points = new THREE.BufferGeometry().setFromPoints(nodes)
  return { lines, points }
}

/** A slowly rotating synapse lattice with signals racing along each edge. */
export function NeuralWeb() {
  const live = useLiveTheme()
  const group = useRef<THREE.Group>(null)
  const nodeMat = useRef<THREE.PointsMaterial>(null)
  const { lines, points } = useMemo(buildWeb, [])
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPulse: { value: 0 }, uA: { value: new THREE.Color() }, uB: { value: new THREE.Color() } }),
    [],
  )

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.1)
    const l = live.current
    uniforms.uTime.value = l.time
    uniforms.uPulse.value = l.pulse
    uniforms.uA.value.copy(l.primary)
    uniforms.uB.value.copy(l.secondary)
    nodeMat.current?.color.copy(l.primary)
    if (group.current) {
      group.current.rotation.y -= dt * 0.04 * l.speed
      group.current.scale.setScalar(1 + l.pulse * l.pulse * 0.25)
    }
  })

  return (
    <group ref={group}>
      <lineSegments geometry={lines}>
        <shaderMaterial
          vertexShader={lineVertex}
          fragmentShader={lineFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
      <points geometry={points}>
        <pointsMaterial
          ref={nodeMat}
          size={0.12}
          sizeAttenuation
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </points>
    </group>
  )
}
