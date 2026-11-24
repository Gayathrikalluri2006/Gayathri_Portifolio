import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Boxes, Building2, Calendar, CodeXml, Container, Hammer, MapPin, Rocket, Terminal, type LucideIcon } from 'lucide-react'
import { Panel, SectionHeading, Tag } from '../hud/panel'
import { COLORS, experiences, pipelineStages, type Experience } from '../../data/portfolio'

const STAGE_ICONS: LucideIcon[] = [CodeXml, Hammer, Container, Boxes, Rocket]

const LOG_LINES = [
  { tag: 'git', text: 'push origin feature/api-gateway → PR #87 opened', color: COLORS.violet },
  { tag: 'jenkins', text: 'build #142 passed in 3m12s (−25% vs baseline)', color: COLORS.cyan },
  { tag: 'actions', text: 'workflow ci.yml · 48 tests passed · 0 failed', color: COLORS.cyan },
  { tag: 'docker', text: 'image svc-auth:1.4.2 pushed (multi-stage, 84MB)', color: COLORS.emerald },
  { tag: 'k8s', text: 'deployment/svc-auth rolled out 3/3 replicas [qa]', color: COLORS.emerald },
  { tag: 'hpa', text: 'svc-orders scaled 2 → 4 pods on cpu > 70%', color: COLORS.emerald },
  { tag: 'gitlab', text: 'pipeline #311 stage=deploy env=dev ✓', color: COLORS.violet },
  { tag: 'uptime', text: 'p99 latency nominal · 99.9% availability', color: COLORS.cyan },
  { tag: 'k8s', text: 'rollback svc-payments → rev 12 completed', color: COLORS.emerald },
]

function PipelineVisualizer() {
  const [auto, setAuto] = useState(0)
  const [pinned, setPinned] = useState<number | null>(null)
  const active = pinned ?? auto

  useEffect(() => {
    if (pinned !== null) return
    const id = setInterval(() => setAuto((i) => (i + 1) % pipelineStages.length), 1800)
    return () => clearInterval(id)
  }, [pinned])

  const stage = pipelineStages[active]

  return (
    <Panel
      eyebrow="Live pipeline"
      title="CI/CD flow visualizer"
      accent={COLORS.emerald}
      action={
        <span className="font-mono text-[11px] text-slate-500">{pinned === null ? 'auto-cycling · click a stage to pin' : 'pinned · click again to resume'}</span>
      }
    >
      <div className="relative px-1 pt-2">
        <div className="absolute left-[10%] right-[10%] top-[30px] h-px bg-slate-700/80" aria-hidden="true" />
        <motion.div
          aria-hidden="true"
          className="gold-beam absolute top-[30px] h-px"
          style={{ left: '10%' }}
          animate={{ width: `${(active / (pipelineStages.length - 1)) * 80}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
        <motion.span
          aria-hidden="true"
          className="absolute top-[26px] h-2 w-2 -translate-x-1/2 rounded-full bg-[#F5D061] shadow-[0_0_14px_#D4AF37]"
          animate={{ left: `${10 + (active / (pipelineStages.length - 1)) * 80}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
        <ol className="relative grid grid-cols-5 gap-1">
          {pipelineStages.map((s, i) => {
            const Icon = STAGE_ICONS[i]
            const done = i <= active
            const isActive = i === active
            return (
              <li key={s.id} className="flex flex-col items-center">
                <button
                  type="button"
                  onClick={() => setPinned((p) => (p === i ? null : i))}
                  onMouseEnter={() => setPinned(i)}
                  aria-pressed={pinned === i}
                  aria-label={`${s.label} stage`}
                  className="flex flex-col items-center gap-2 rounded-xl p-1 focus-visible:outline-2 focus-visible:outline-amber-300"
                >
                  <span
                    className="grid h-11 w-11 place-items-center rounded-xl border transition-all duration-500 sm:h-12 sm:w-12"
                    style={{
                      borderColor: done ? `${COLORS.emerald}aa` : 'rgb(51 65 85)',
                      background: isActive ? `${COLORS.emerald}25` : 'rgb(2 6 23 / 0.7)',
                      boxShadow: isActive ? `0 0 24px ${COLORS.emerald}80` : 'none',
                    }}
                  >
                    <Icon className={`h-5 w-5 transition-colors ${done ? 'text-amber-200' : 'text-slate-500'}`} aria-hidden="true" />
                  </span>
                  <span className={`font-mono text-[10px] sm:text-xs ${isActive ? 'text-white' : 'text-slate-400'}`}>{s.label}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="mt-5 rounded-xl border border-slate-700/60 bg-slate-950/50 p-4"
          aria-live="polite"
        >
          <p className="font-mono text-xs text-[#F5D061]">
            stage[{active}] :: {stage.label.toLowerCase()}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">{stage.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {stage.tools.map((t) => (
              <Tag key={t} color={COLORS.emerald}>
                {t}
              </Tag>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </Panel>
  )
}

function LiveConsole() {
  const [count, setCount] = useState(5)

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1700)
    return () => clearInterval(id)
  }, [])

  const lines = Array.from({ length: 6 }, (_, i) => {
    const n = count - 5 + i
    return { n, ...LOG_LINES[((n % LOG_LINES.length) + LOG_LINES.length) % LOG_LINES.length] }
  })

  return (
    <Panel eyebrow="Telemetry stream" title="Deploy log" accent={COLORS.cyan} action={<Terminal className="h-4 w-4 text-[#F5D061]" aria-hidden="true" />}>
      <div className="h-[168px] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 p-3 font-mono text-[11px] leading-6" aria-hidden="true">
        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <motion.p key={l.n} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="truncate text-slate-400">
              <span className="text-slate-600">{String(l.n).padStart(4, '0')} </span>
              <span style={{ color: l.color }}>[{l.tag}]</span> {l.text}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {[
          { v: '−25%', l: 'build time' },
          { v: '4', l: 'containerized' },
          { v: '~10', l: 'workflows tuned' },
        ].map((s) => (
          <div key={s.l} className="rounded-lg border border-slate-800 bg-slate-950/50 px-2 py-2">
            <p className="font-mono text-lg font-semibold text-white">{s.v}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{s.l}</p>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function ExperienceCard({ exp, index }: { exp: Experience; index: number }) {
  return (
    <motion.li initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.12 }} className="relative pl-8">
      <span
        aria-hidden="true"
        className="absolute left-[3px] top-6 h-3 w-3 rounded-full border-2 bg-obsidian"
        style={{ borderColor: exp.color, boxShadow: `0 0 12px ${exp.color}` }}
      />
      <Panel accent={exp.color}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm" style={{ color: exp.color }}>
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              {exp.company}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 font-mono text-xs text-slate-400 sm:flex-col sm:items-end sm:gap-1">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {exp.period}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {exp.location}
            </span>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2">
          {exp.metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">
              <dd className="font-mono text-base font-semibold text-white">{m.value}</dd>
              <dt className="text-[10px] uppercase tracking-wider text-slate-500">{m.label}</dt>
            </div>
          ))}
        </dl>

        <ul className="mt-4 flex flex-col gap-2">
          {exp.bullets.map((b) => (
            <li key={b} className="flex gap-2.5 text-sm leading-relaxed text-slate-300">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: exp.color }} />
              {b}
            </li>
          ))}
        </ul>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {exp.tags.map((t) => (
            <Tag key={t} color={exp.color}>
              {t}
            </Tag>
          ))}
        </div>
      </Panel>
    </motion.li>
  )
}

export function DevOpsDashboard() {
  return (
    <div>
      <SectionHeading index="02" label="DevOps & Cloud Telemetry" title="Shipping containers to Kubernetes, reliably." accent={COLORS.emerald} />
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PipelineVisualizer />
        </div>
        <div className="lg:col-span-2">
          <LiveConsole />
        </div>
      </div>

      <h3 className="mb-4 mt-10 font-mono text-xs uppercase tracking-[0.25em] text-slate-400">Experience timeline</h3>
      <ol className="relative flex flex-col gap-5 before:absolute before:bottom-4 before:left-[8px] before:top-4 before:w-px before:bg-gradient-to-b before:from-emerald-500/60 before:via-sky-500/40 before:to-transparent">
        {experiences.map((exp, i) => (
          <ExperienceCard key={exp.company} exp={exp} index={i} />
        ))}
      </ol>
    </div>
  )
}
