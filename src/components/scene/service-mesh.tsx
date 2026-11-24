import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useLiveTheme } from './live-theme'

const NODE_COUNT = 12
const PARTICLES_PER_STREAM = 14

function createNodes() {
  const nodes: THREE.Vector3[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = 1 - (i / (NODE_COUNT - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    const dist = 3.9 + (i % 3) * 0.45
    nodes.push(new THREE.Vector3(Math.cos(theta) * r * dist, y * dist * 0.62, Math.sin(theta) * r * dist))
  }
  return nodes
}

function createDotTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.35, 'rgba(255,255,255,0.6)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
  }
  return new THREE.CanvasTexture(canvas)
}

export function ServiceMesh() {
  const live = useLiveTheme()
  const group = useRef<THREE.Group>(null)
  const nodeRefs = useRef<(THREE.Group | null)[]>([])
  const lineMat = useRef<THREE.LineBasicMaterial>(null)
  const pointsMat = useRef<THREE.PointsMaterial>(null)

  const nodes = useMemo(createNodes, [])
  const dotTexture = useMemo(createDotTexture, [])
  const cubeEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(0.42, 0.42, 0.42)), [])
  const heptaEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.CylinderGeometry(0.28, 0.28, 0.12, 7)), [])
  const edgeMatA = useMemo(() => new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9, toneMapped: false }), [])
  const edgeMatB = useMemo(() => new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9, toneMapped: false }), [])

  const linePositions = useMemo(() => {
    const arr = new Float32Array(NODE_COUNT * 6)
    nodes.forEach((n, i) => {
      arr.set([0, 0, 0, n.x, n.y, n.z], i * 6)
    })
    return arr
  }, [nodes])

  const { particlePositions, offsets } = useMemo(() => {
    const total = NODE_COUNT * PARTICLES_PER_STREAM
    return {
      particlePositions: new Float32Array(total * 3),
      offsets: Float32Array.from({ length: total }, (_, i) => (i % PARTICLES_PER_STREAM) / PARTICLES_PER_STREAM + Math.random() * 0.05),
    }
  }, [])

  const pointsGeo = useRef<THREE.BufferGeometry>(null)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1)
    const l = live.current
    if (group.current) group.current.rotation.y += dt * 0.06 * l.speed

    nodeRefs.current.forEach((n, i) => {
      if (!n) return
      n.rotation.x += dt * 0.4 * l.speed
      n.rotation.y += dt * 0.3 * l.speed
      n.position.y = nodes[i].y + Math.sin(state.clock.elapsedTime * 0.8 + i) * 0.12
    })

    const attr = pointsGeo.current?.getAttribute('position') as THREE.BufferAttribute | undefined
    if (attr) {
      for (let s = 0; s < NODE_COUNT; s++) {
        const target = nodes[s]
        const outbound = s % 2 === 0
        for (let p = 0; p < PARTICLES_PER_STREAM; p++) {
          const idx = s * PARTICLES_PER_STREAM + p
          let t = (offsets[idx] + l.time * 0.22) % 1
          if (!outbound) t = 1 - t
          const r = 0.95 + t * 0.05
          attr.setXYZ(idx, target.x * t * r, target.y * t * r, target.z * t * r)
        }
      }
      attr.needsUpdate = true
    }

    lineMat.current?.color.copy(l.primary)
    pointsMat.current?.color.copy(l.primary).lerp(l.secondary, 0.3)
    edgeMatA.color.copy(l.primary)
    edgeMatB.color.copy(l.secondary)
  })

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={lineMat} transparent opacity={0.12} depthWrite={false} />
      </lineSegments>

      <points>
        <bufferGeometry ref={pointsGeo}>
          <bufferAttribute attach="attributes-position" args={[particlePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMat}
          size={0.09}
          map={dotTexture}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          toneMapped={false}
        />
      </points>

      {nodes.map((n, i) => (
        <group
          key={i}
          position={n}
          ref={(g) => {
            nodeRefs.current[i] = g
          }}
        >
          <lineSegments geometry={i % 2 === 0 ? cubeEdges : heptaEdges} material={i % 2 === 0 ? edgeMatA : edgeMatB} />
          <mesh>
            <boxGeometry args={[0.12, 0.12, 0.12]} />
            <meshBasicMaterial color="#F5D061" transparent opacity={0.72} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
