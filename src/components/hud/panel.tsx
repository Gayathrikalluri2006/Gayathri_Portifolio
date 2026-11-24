import type { ReactNode } from 'react'

type PanelProps = {
  children: ReactNode
  className?: string
  eyebrow?: string
  title?: string
  accent?: string
  action?: ReactNode
}

export function Panel({ children, className = '', eyebrow, title, accent = '#D4AF37', action }: PanelProps) {
  return (
    <section className={`glass relative overflow-hidden rounded-2xl p-5 sm:p-6 ${className}`}>
      <span aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-3 w-3 border-l border-t" style={{ borderColor: accent }} />
      <span aria-hidden="true" className="pointer-events-none absolute right-0 top-0 h-3 w-3 border-r border-t" style={{ borderColor: accent }} />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 h-3 w-3 border-b border-l" style={{ borderColor: accent }} />
      <span aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 h-3 w-3 border-b border-r" style={{ borderColor: accent }} />
      {(eyebrow || title) && (
        <header className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow && (
              <p className="font-mono text-[11px] uppercase tracking-[0.2em]" style={{ color: accent }}>
                {eyebrow}
              </p>
            )}
            {title && <h3 className="mt-1 text-lg font-semibold text-white text-balance">{title}</h3>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export function Tag({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span
      className="inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] text-slate-300"
      style={{ borderColor: color ? `${color}40` : 'rgb(148 163 184 / 0.2)', background: color ? `${color}10` : 'rgb(15 23 42 / 0.5)' }}
    >
      {children}
    </span>
  )
}

export function SectionHeading({ index, label, title, accent }: { index: string; label: string; title: string; accent: string }) {
  return (
    <div className="mb-6">
      <p className="font-mono text-xs uppercase tracking-[0.25em]" style={{ color: accent }}>
        {`// ${index} — ${label}`}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white text-balance sm:text-4xl">{title}</h2>
    </div>
  )
}
