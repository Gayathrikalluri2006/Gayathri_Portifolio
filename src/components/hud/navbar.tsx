import { motion } from 'framer-motion'
import { Boxes, Cpu, LayoutDashboard, Layers, Monitor, Zap, type LucideIcon } from 'lucide-react'
import { sections, type SectionId } from '../../data/portfolio'

const ICONS: Record<SectionId, LucideIcon> = {
  overview: LayoutDashboard,
  devops: Cpu,
  projects: Boxes,
  stack: Layers,
}

type NavbarProps = {
  active: SectionId
  accent: string
  onChange: (id: SectionId) => void
  lite: boolean
  onToggleLite: () => void
  webgl: boolean
}

export function Navbar({ active, accent, onChange, lite, onToggleLite, webgl }: NavbarProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 h-14 border-b border-amber-500/15 bg-[#050505]/90 px-2 backdrop-blur-md sm:px-4">
      <nav aria-label="Dashboards" className="mx-auto flex h-full max-w-7xl items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => onChange('overview')}
          className="flex shrink-0 items-center gap-2 rounded-xl px-1 focus-visible:outline-2 focus-visible:outline-amber-300"
          aria-label="Gayathri Kalluri — go to overview"
        >
          <span
            className="grid h-8 w-8 place-items-center rounded-lg border font-mono text-sm font-semibold text-white transition-colors duration-700"
            style={{ borderColor: `${accent}80`, boxShadow: `0 0 18px ${accent}55, inset 0 0 12px ${accent}30` }}
          >
            GK
          </span>
          <span className="hidden font-mono text-xs leading-tight text-slate-400 lg:block">
            gayathri.kalluri
            <span className="block transition-colors duration-700" style={{ color: accent }}>
              ~/command-center
            </span>
          </span>
        </button>

        <div role="tablist" aria-label="Portfolio sections" className="scrollbar-none flex h-full flex-1 items-center justify-center gap-0.5 overflow-x-auto sm:gap-1">
          {sections.map((s) => {
            const Icon = ICONS[s.id]
            const isActive = s.id === active
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                id={`tab-${s.id}`}
                aria-selected={isActive}
                aria-controls="hud-panel"
                onClick={() => onChange(s.id)}
                className={`relative flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-2 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-amber-300 sm:gap-2 sm:px-3 sm:text-sm ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-xl border bg-white/5"
                    style={{ borderColor: `${accent}55`, boxShadow: `0 0 22px ${accent}30` }}
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative h-4 w-4" aria-hidden="true" style={isActive ? { color: accent } : undefined} />
                <span className="relative hidden font-mono text-[10px] text-slate-500 md:inline">{s.index}</span>
                <span className="relative hidden sm:inline">{s.short}</span>
                <span className="sr-only sm:hidden">{s.label}</span>
              </button>
            )
          })}
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={lite}
          onClick={onToggleLite}
          disabled={!webgl}
          title={webgl ? 'Toggle 2D Lite Mode for low-power devices' : '3D unavailable on this device'}
          className="flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-[#D4AF37]/25 px-2 text-[10px] text-slate-300 transition-colors hover:border-[#D4AF37]/60 focus-visible:outline-2 focus-visible:outline-amber-300 disabled:opacity-60 sm:gap-2 sm:px-2.5 sm:text-xs"
        >
          {lite ? <Monitor className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" /> : <Zap className="h-4 w-4 text-[#F5D061]" aria-hidden="true" />}
          <span className="hidden font-mono sm:inline">2D Lite</span>
          <span className="sr-only sm:hidden">2D Lite Mode</span>
          <span aria-hidden="true" className={`relative h-4 w-7 rounded-full transition-colors ${lite ? 'bg-amber-500/70' : 'bg-slate-700'}`}>
            <span className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${lite ? 'left-3.5' : 'left-0.5'}`} />
          </span>
        </button>
      </nav>
    </header>
  )
}
