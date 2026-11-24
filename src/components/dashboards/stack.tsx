import { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, BookOpen, GraduationCap, Languages, Trophy } from 'lucide-react'
import { Panel, SectionHeading } from '../hud/panel'
import { activities, certifications, COLORS, education, research, skillCategories, spokenLanguages } from '../../data/portfolio'

const LEVEL_LABEL = ['', 'Familiar', 'Working', 'Proficient', 'Advanced', 'Expert']

function SkillBadge({ name, level, color }: { name: string; level: number; color: string }) {
  const glow = 6 + level * 4
  const alpha = Math.round(20 + level * 14).toString(16).padStart(2, '0')
  return (
    <li>
      <span
        className="group inline-flex max-w-full min-w-0 items-center gap-2 rounded-lg border bg-slate-950/60 px-2.5 py-1.5 text-sm text-slate-200 transition-all hover:-translate-y-0.5 hover:text-white"
        style={{ borderColor: `${color}${alpha}`, boxShadow: `0 0 ${glow}px -6px ${color}` }}
        title={`${name} — ${LEVEL_LABEL[level]}`}
      >
        <span className="min-w-0 break-words leading-5">{name}</span>
        <span className="flex shrink-0 gap-0.5" aria-label={`${LEVEL_LABEL[level]}, ${level} of 5`} role="img">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1 rounded-sm" style={{ background: i < level ? color : 'rgb(51 65 85)', boxShadow: i < level ? `0 0 4px ${color}` : 'none' }} />
          ))}
        </span>
      </span>
    </li>
  )
}

function SkillMatrix() {
  const [filter, setFilter] = useState<string>('all')
  return (
    <Panel
      eyebrow="Tech stack matrix"
      title="Skills by proficiency"
      accent={COLORS.violet}
      action={<span className="hidden font-mono text-[11px] text-slate-500 sm:block">glow = proficiency</span>}
    >
      <div role="group" aria-label="Filter skill categories" className="-mx-1 mb-5 flex flex-wrap gap-1.5 px-1">
        {[{ id: 'all', label: 'All', color: COLORS.cyan }, ...skillCategories].map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            aria-pressed={filter === c.id}
            className={`shrink-0 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-sky-400 ${
              filter === c.id ? 'text-white' : 'border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
            style={filter === c.id ? { borderColor: c.color, background: `${c.color}1a` } : undefined}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {skillCategories.map((cat) => {
          const dimmed = filter !== 'all' && filter !== cat.id
          return (
            <motion.div
              key={cat.id}
              animate={{ opacity: dimmed ? 0.25 : 1, scale: dimmed ? 0.98 : 1 }}
              className={cat.id === 'devops' ? 'md:col-span-2' : ''}
            >
              <h4 className="mb-2.5 flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest" style={{ color: cat.color }}>
                <span className="h-px w-4" style={{ background: cat.color }} />
                {cat.label}
              </h4>
              <ul className="flex flex-wrap gap-2">
                {cat.skills.map((s) => (
                  <SkillBadge key={s.name} name={s.name} level={s.level} color={cat.color} />
                ))}
              </ul>
            </motion.div>
          )
        })}
      </div>
    </Panel>
  )
}

export function StackDashboard() {
  return (
    <div>
      <SectionHeading index="04" label="Stack, Research & Credentials" title="The toolkit behind the systems." accent={COLORS.violet} />
      <div className="grid gap-5 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SkillMatrix />
        </div>

        <div className="flex flex-col gap-5 lg:col-span-5">
          <Panel eyebrow="Education" accent={COLORS.cyan} action={<GraduationCap className="h-5 w-5 text-[#F5D061]" aria-hidden="true" />}>
            <h3 className="text-lg font-semibold text-white text-balance">{education.degree}</h3>
            <p className="text-sm text-slate-400">
              {education.school} · <span className="font-mono">{education.period}</span>
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-2">
              {education.scores.map((s) => (
                <div key={s.label} className="rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">
                  <dd className="font-mono text-base font-semibold text-white">{s.value}</dd>
                  <dt className="text-[10px] uppercase tracking-wider text-slate-500">{s.label}</dt>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel eyebrow="Research · 2 papers" accent={COLORS.emerald} action={<BookOpen className="h-5 w-5 text-[#F59E0B]" aria-hidden="true" />}>
            <ul className="flex flex-col gap-3">
              {research.map((r, i) => (
                <li key={r.title} className="flex gap-3">
                  <span className="font-mono text-xs text-[#F59E0B]">{`P${i + 1}`}</span>
                  <div>
                    <p className="font-medium text-white">{r.title}</p>
                    <p className="text-sm text-slate-400">{r.detail}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel eyebrow="Certifications" accent={COLORS.violet} action={<Award className="h-5 w-5 text-[#F5D061]" aria-hidden="true" />}>
            <ul className="flex flex-col gap-2">
              {certifications.map((c) => (
                <li key={c.name} className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2">
                  <span className="text-sm text-slate-200">{c.name}</span>
                  <span className="shrink-0 font-mono text-[10px] text-slate-500">{c.issuer}</span>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="grid gap-5 sm:grid-cols-2">
            <Panel eyebrow="Activities" accent={COLORS.cyan} action={<Trophy className="h-4 w-4 text-[#F5D061]" aria-hidden="true" />}>
              <ul className="flex flex-col gap-1.5 text-sm text-slate-300">
                {activities.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            </Panel>
            <Panel eyebrow="Languages" accent={COLORS.emerald} action={<Languages className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />}>
              <ul className="flex flex-wrap gap-1.5 text-sm text-slate-300">
                {spokenLanguages.map((l) => (
                  <li key={l} className="rounded-md border border-slate-700/60 px-2 py-0.5">
                    {l}
                  </li>
                ))}
              </ul>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}
