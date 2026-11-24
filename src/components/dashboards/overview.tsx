import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowDown, Brain, Cloud, Code2, Download, Gauge, Mail, MapPin, Phone, UserRound, type LucideIcon } from 'lucide-react'
import { useCountUp } from '../../hooks/use-count-up'
import { profile, type SectionId } from '../../data/portfolio'

const ROLES = ['Software Engineer', 'Backend & Cloud Architect', 'CI/CD & Game Systems']

const HERO_STATS: { value: number; prefix?: string; suffix?: string; label: string; icon: LucideIcon }[] = [
  { value: 2, suffix: 'x', label: 'DevOps Internships', icon: Cloud },
  { value: 25, prefix: '~', suffix: '%', label: 'Faster CI/CD', icon: Gauge },
  { value: 88, suffix: '%', label: 'ML Accuracy', icon: Brain },
  { value: 200, suffix: '+', label: 'Concurrent Reqs', icon: Code2 },
]

function RoleSwitcher() {
  const [activeRole, setActiveRole] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => setActiveRole((current) => (current + 1) % ROLES.length), 2600)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <p className="mt-4 min-h-8 font-mono text-sm text-[#F5D061] sm:text-base">
      <span className="sr-only">{ROLES.join(' · ')}</span>
      <span aria-hidden="true" className="inline-flex items-center gap-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={ROLES[activeRole]}
            initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
            transition={{ duration: 0.3 }}
          >
            {ROLES[activeRole]}
          </motion.span>
        </AnimatePresence>
        <motion.span aria-hidden="true" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }} className="h-4 w-px bg-[#F5D061]" />
      </span>
    </p>
  )
}

function HeroStat({ stat, index }: { stat: (typeof HERO_STATS)[number]; index: number }) {
  const value = useCountUp(stat.value, 1500, 150 + index * 120)
  const Icon = stat.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08 }}
      className="min-w-0 px-3 py-3 sm:px-5 sm:py-4"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
        <p className="truncate font-mono text-xl font-semibold tabular-nums text-[#F8FAFC] sm:text-2xl">
          {stat.prefix}
          {value.toFixed(0)}
          <span className="text-[#F5D061]">{stat.suffix}</span>
        </p>
      </div>
      <p className="mt-1 text-[10px] leading-tight text-[#A1A1AA] sm:text-xs">{stat.label}</p>
    </motion.div>
  )
}

function PortraitBadge({ children, className, delay = 0 }: { children: string; className: string; delay?: number }) {
  return (
    <motion.div
      className={`glass absolute z-20 rounded-xl border border-[#D4AF37]/35 px-3 py-2 font-mono text-[10px] tracking-wide text-[#F8FAFC] shadow-[0_0_24px_-12px_rgba(245,208,97,0.8)] sm:text-xs ${className}`}
      animate={{ y: [0, -7, 0] }}
      transition={{ duration: 3.4, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

function HolographicPortrait() {
  const [imageUnavailable, setImageUnavailable] = useState(false)
  const tiltX = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 })
  const tiltY = useSpring(useMotionValue(0), { stiffness: 160, damping: 20 })

  return (
    <div
      className="relative mx-auto flex w-full max-w-lg items-center justify-center py-6 sm:py-9 lg:py-0"
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width
        const y = (event.clientY - bounds.top) / bounds.height
        tiltX.set((0.5 - y) * 9)
        tiltY.set((x - 0.5) * 12)
      }}
      onMouseLeave={() => {
        tiltX.set(0)
        tiltY.set(0)
      }}
    >
      <div aria-hidden="true" className="absolute h-[70%] w-[70%] rounded-full bg-[#D4AF37]/10 blur-[80px]" />
      <motion.div className="relative aspect-[4/5] w-[min(76vw,350px)]" style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000 }}>
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-[#D4AF37]/50 bg-[#0a0a0c] shadow-[0_0_70px_-24px_rgba(212,175,55,0.62)]">
          {imageUnavailable ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,rgba(245,208,97,0.16),transparent_58%),linear-gradient(145deg,#121214,#050505)]">
              <div className="grid h-36 w-36 place-items-center rounded-full border border-[#F5D061]/35 bg-[#D4AF37]/10 shadow-[0_0_45px_-15px_rgba(245,208,97,0.7)] sm:h-44 sm:w-44">
                <UserRound className="h-20 w-20 text-[#F5D061]/80 sm:h-24 sm:w-24" strokeWidth={1} aria-hidden="true" />
              </div>
              <span className="mt-4 font-mono text-4xl font-semibold tracking-[0.3em] text-[#F5D061]">GK</span>
              <span className="mt-2 font-mono text-[9px] uppercase tracking-[0.24em] text-[#A1A1AA]">Portrait coming soon</span>
            </div>
          ) : (
            <img
              src="/profile.jpg"
              alt="Portrait of Gayathri Kalluri"
              onError={() => setImageUnavailable(true)}
              className="h-full w-full object-cover object-center"
            />
          )}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050505]/90 via-transparent to-[#050505]/10" />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-transparent via-[#F5D061]/10 to-transparent"
            animate={{ y: ['-100%', '560%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-x-5 bottom-5 border-l border-[#D4AF37]/70 pl-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-[#F5D061]">Creative systems · 2026</p>
            <p className="mt-1 text-sm font-medium text-[#F8FAFC]">Gayathri Kalluri</p>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 rounded-[2.4rem] border border-dashed border-[#F5D061]/50"
          animate={{ rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute left-0 top-0 h-7 w-7 rounded-tl-[1.4rem] border-l-2 border-t-2 border-[#F5D061]" />
          <span className="absolute right-0 top-0 h-7 w-7 rounded-tr-[1.4rem] border-r-2 border-t-2 border-[#D4AF37]" />
          <span className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-[1.4rem] border-b-2 border-l-2 border-[#D4AF37]" />
          <span className="absolute bottom-0 right-0 h-7 w-7 rounded-br-[1.4rem] border-b-2 border-r-2 border-[#F5D061]" />
        </motion.div>
      </motion.div>

      <PortraitBadge className="-left-3 top-[16%] sm:-left-5" delay={0.2}>AWS · GCP · K8s</PortraitBadge>
      <PortraitBadge className="-right-3 top-[48%] sm:-right-5" delay={0.8}>Java · C++ · Python</PortraitBadge>
      <PortraitBadge className="bottom-[20%] left-[-5%] sm:left-[-3%]" delay={1.4}>8.5 CGPA</PortraitBadge>
    </div>
  )
}

export function OverviewDashboard({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  return (
    <section className="relative -mx-3 -mt-24 grid min-h-screen grid-rows-[1fr_auto] overflow-hidden px-3 pb-28 pt-24 sm:-mx-6 sm:px-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_79%_43%,rgba(212,175,55,0.08),transparent_38%)]" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-5 py-5 lg:grid-cols-12 lg:gap-8">
        <div className="relative z-10 lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#0a0a0c]/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5D061] shadow-[0_0_20px_-10px_rgba(245,208,97,0.8)] sm:text-[10px] sm:tracking-[0.2em]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F5D061] shadow-[0_0_10px_#F5D061]" />
            Available for Software &amp; DevOps Roles
          </div>

          <h1 className="mt-5 text-[clamp(3.2rem,10vw,7.8rem)] font-bold leading-[0.82] tracking-[-0.075em] text-[#F8FAFC] sm:mt-7">
            GAYATHRI
            <span className="gold-gradient mt-2 block">KALLURI</span>
          </h1>

          <RoleSwitcher />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#A1A1AA] sm:text-base">{profile.summary}</p>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#A1A1AA] sm:gap-3">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#F5D061]" aria-hidden="true" />
              {profile.location}
            </span>
            <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-[#F5D061]">
              <Mail className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
              {profile.email}
            </a>
            <a href={profile.phoneHref} className="inline-flex items-center gap-1.5 transition-colors hover:text-[#F5D061]">
              <Phone className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
              {profile.phone}
            </a>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="group inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-[#050505] shadow-[0_0_28px_rgba(212,175,55,0.4)] transition-all hover:bg-[#F5D061] hover:shadow-[0_0_38px_rgba(245,208,97,0.65)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D061]"
            >
              Explore 3D Work
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
            </button>
            <a
              href={profile.links.resume}
              download="Gayathri-Kalluri-Resume.pdf"
              className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-[#0f0f12]/75 px-5 py-3 text-sm font-semibold text-[#F8FAFC] backdrop-blur transition-colors hover:border-[#F5D061]/70 hover:text-[#F5D061] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D061]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download Resume
            </a>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[#A1A1AA]">
            <span>SIMATS Engineering</span>
            <span className="text-[#D4AF37]">B.E. CSE · AI</span>
            <span>2023 — 2027</span>
          </div>
        </div>

        <div className="relative z-0 lg:col-span-5">
          <HolographicPortrait />
        </div>
      </div>

      <div className="glass relative mx-auto grid w-full max-w-7xl grid-cols-2 divide-x divide-y divide-[#D4AF37]/15 overflow-hidden rounded-2xl border border-[#D4AF37]/20 sm:grid-cols-4 sm:divide-y-0">
        {HERO_STATS.map((stat, index) => (
          <HeroStat key={stat.label} stat={stat} index={index} />
        ))}
      </div>
    </section>
  )
}
