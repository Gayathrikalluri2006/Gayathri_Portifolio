import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { Car, ChevronRight, Gamepad2, Navigation, ShieldCheck, type LucideIcon } from 'lucide-react'
import { Panel, SectionHeading, Tag } from '../hud/panel'
import { COLORS, projects, type Project } from '../../data/portfolio'

const PROJECT_ICONS: Record<string, LucideIcon> = {
  engine: Gamepad2,
  'aegis-ai': ShieldCheck,
  navigator: Navigation,
  vahana: Car,
}

type ProjectsProps = {
  activeIndex: number
  onSelect: (index: number) => void
}

function ProjectCard({ project, index, active, onSelect }: { project: Project; index: number; active: boolean; onSelect: (i: number) => void }) {
  const Icon = PROJECT_ICONS[project.id]
  const color = project.theme.primary
  const tiltX = useSpring(useMotionValue(0), { stiffness: 240, damping: 22 })
  const tiltY = useSpring(useMotionValue(0), { stiffness: 240, damping: 22 })

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07 }}
      onClick={() => onSelect(index)}
      onMouseEnter={() => onSelect(index)}
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width
        const y = (event.clientY - bounds.top) / bounds.height
        tiltX.set((0.5 - y) * 10)
        tiltY.set((x - 0.5) * 12)
      }}
      onMouseLeave={() => {
        tiltX.set(0)
        tiltY.set(0)
      }}
      onFocus={() => onSelect(index)}
      aria-pressed={active}
      className="glass group relative w-full transform-gpu overflow-hidden rounded-2xl p-4 text-left transition-[border-color,box-shadow] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300"
      style={{
        borderColor: active ? `${color}90` : undefined,
        boxShadow: active ? `0 0 30px -6px ${color}80` : undefined,
      }}
    >
      <motion.div className="relative" style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}>
        {active && <motion.span layoutId="project-active" className="absolute inset-y-0 left-[-1rem] w-0.5 rounded-full" style={{ background: color }} />}
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border" style={{ borderColor: `${color}55`, background: `${color}15` }}>
            <Icon className="h-5 w-5" style={{ color }} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                {String(index + 1).padStart(2, '0')} · {project.type}
              </p>
              <ChevronRight className={`h-4 w-4 transition-transform ${active ? 'translate-x-0.5 text-white' : 'text-slate-600'}`} aria-hidden="true" />
            </div>
            <h3 className="mt-1 font-semibold text-white text-balance">{project.name}</h3>
            <p className="text-sm text-slate-400">{project.tagline}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {project.stack.slice(0, 4).map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
              {project.stack.length > 4 && <Tag>+{project.stack.length - 4}</Tag>}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.button>
  )
}

function ArchitectureInspector({ project }: { project: Project }) {
  const color = project.theme.primary
  const secondary = project.theme.secondary
  return (
    <Panel eyebrow="System architecture & metrics" accent={color} className="lg:sticky lg:top-0">
      <AnimatePresence mode="wait">
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
          transition={{ duration: 0.3 }}
          aria-live="polite"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-2xl font-semibold text-white text-balance">{project.name}</h3>
            <span className="rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest" style={{ borderColor: `${color}60`, color }}>
              {project.type}
            </span>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">Topology</p>
              <ol className="flex flex-col">
                {project.architecture.map((layer, i) => (
                  <motion.li key={layer} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }} className="flex flex-col items-start">
                    <span
                      className="flex w-full items-center gap-2 rounded-lg border bg-slate-950/60 px-3 py-2 font-mono text-xs text-slate-200"
                      style={{ borderColor: `${i % 2 === 0 ? color : secondary}45` }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: i % 2 === 0 ? color : secondary, boxShadow: `0 0 8px ${i % 2 === 0 ? color : secondary}` }} />
                      {layer}
                    </span>
                    {i < project.architecture.length - 1 && (
                      <span aria-hidden="true" className="relative ml-5 h-4 w-px overflow-hidden bg-slate-700">
                        <motion.span
                          className="absolute left-0 h-2 w-px"
                          style={{ background: color }}
                          animate={{ top: ['-50%', '120%'] }}
                          transition={{ duration: 1.1, repeat: Infinity, delay: i * 0.18, ease: 'linear' }}
                        />
                      </span>
                    )}
                  </motion.li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">Metrics</p>
                <dl className="flex flex-col gap-3">
                  {project.metrics.map((m, i) => (
                    <div key={m.label}>
                      <div className="flex items-baseline justify-between gap-2">
                        <dt className="text-xs text-slate-400">{m.label}</dt>
                        <dd className="font-mono text-sm font-semibold text-white">{m.value}</dd>
                      </div>
                      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-800">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: `linear-gradient(90deg, ${color}, ${secondary})` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${m.bar * 100}%` }}
                          transition={{ delay: 0.15 + i * 0.1, duration: 0.9, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <Tag key={s} color={color}>
                      {s}
                    </Tag>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">Highlights</p>
            <ul className="flex flex-col gap-2">
              {project.highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: color }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </AnimatePresence>
    </Panel>
  )
}

export function ProjectsDashboard({ activeIndex, onSelect }: ProjectsProps) {
  return (
    <div>
      <SectionHeading index="03" label="Project Showcase" title="Architecture inspector." accent={COLORS.violet} />
      <p className="-mt-3 mb-6 text-sm text-slate-400">Hover or select a project — the 3D core reshapes and shifts between gold and warm amber.</p>
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-3 lg:col-span-5">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} active={i === activeIndex} onSelect={onSelect} />
          ))}
        </div>
        <div className="lg:col-span-7">
          <ArchitectureInspector project={projects[activeIndex]} />
        </div>
      </div>
    </div>
  )
}
