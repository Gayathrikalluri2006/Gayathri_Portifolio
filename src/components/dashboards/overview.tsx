import { useCallback, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowDown, Brain, Cloud, Code2, Download, Gauge, Mail, MapPin, Phone, UserRound, type LucideIcon } from 'lucide-react'
import { useCountUp } from '../../hooks/use-count-up'
import { COLORS, education, kpis, profile, type Kpi } from '../../data/portfolio'

const ROLES = ['Software Engineer', 'Backend', 'CI/CD & Cloud', 'Game Systems']
const ROLE_ICONS: LucideIcon[] = [Cloud, Gauge, Brain]

type Telemetry = Kpi & { icon: LucideIcon }

const TELEMETRY: Telemetry[] = [
  ...kpis.slice(0, 3).map((stat, index) => ({ ...stat, icon: ROLE_ICONS[index] })),
  { value: 200, suffix: '+', label: 'Concurrent Reqs', detail: 'Cloud Run', progress: 0.8, color: COLORS.gold, icon: Code2 },
]

function PortraitBadge({ children, className, delay = 0 }: { children: string; className: string; delay?: number }) {
  return (
    <motion.div
      className={`glass absolute z-20 rounded-xl border border-[#D4AF37]/35 px-3 py-2 font-mono text-[9px] tracking-wide text-[#F8FAFC] shadow-[0_0_24px_-12px_rgba(245,208,97,0.8)] sm:text-[10px] ${className}`}
      animate={{ y: [0, -6, 0] }}
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
      className="relative flex h-[390px] w-full items-center justify-center xl:h-[420px]"
      onMouseMove={(event) => {
        const bounds = event.currentTarget.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width
        const y = (event.clientY - bounds.top) / bounds.height
        tiltX.set((0.5 - y) * 8)
        tiltY.set((x - 0.5) * 10)
      }}
      onMouseLeave={() => {
        tiltX.set(0)
        tiltY.set(0)
      }}
    >
      <div aria-hidden="true" className="absolute h-[75%] w-[75%] rounded-full bg-[#D4AF37]/10 blur-[80px]" />
      <motion.div
        className="relative aspect-[4/5] h-[330px] w-auto xl:h-[370px]"
        style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 1000 }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-[#D4AF37]/50 bg-[#0a0a0c] shadow-[0_0_60px_-24px_rgba(212,175,55,0.6)]">
          {imageUnavailable ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_35%,rgba(245,208,97,0.16),transparent_58%),linear-gradient(145deg,#121214,#050505)]">
              <div className="grid h-36 w-36 place-items-center rounded-full border border-[#F5D061]/35 bg-[#D4AF37]/10 shadow-[0_0_45px_-15px_rgba(245,208,97,0.7)]">
                <UserRound className="h-20 w-20 text-[#F5D061]/80" strokeWidth={1} aria-hidden="true" />
              </div>
              <span className="mt-4 font-mono text-4xl font-semibold tracking-[0.3em] text-[#F5D061]">GK</span>
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
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-[#F5D061]">Creative systems</p>
            <p className="mt-1 text-sm font-medium text-[#F8FAFC]">Gayathri Kalluri</p>
          </div>
        </div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-3 rounded-[2.4rem] border border-dashed border-[#F5D061]/45"
          animate={{ rotate: 360 }}
          transition={{ duration: 34, repeat: Infinity, ease: 'linear' }}
        >
          <span className="absolute left-0 top-0 h-7 w-7 rounded-tl-[1.4rem] border-l-2 border-t-2 border-[#F5D061]" />
          <span className="absolute right-0 top-0 h-7 w-7 rounded-tr-[1.4rem] border-r-2 border-t-2 border-[#D4AF37]" />
          <span className="absolute bottom-0 left-0 h-7 w-7 rounded-bl-[1.4rem] border-b-2 border-l-2 border-[#D4AF37]" />
          <span className="absolute bottom-0 right-0 h-7 w-7 rounded-br-[1.4rem] border-b-2 border-r-2 border-[#F5D061]" />
        </motion.div>
      </motion.div>
      <PortraitBadge className="left-[1%] top-[15%]">AWS · GCP · K8s</PortraitBadge>
      <PortraitBadge className="right-[1%] top-[47%]" delay={0.8}>Java · C++ · Python</PortraitBadge>
      <PortraitBadge className="bottom-[12%] left-[2%]" delay={1.4}>8.5 CGPA</PortraitBadge>
    </div>
  )
}

function TelemetryCard({ stat, index }: { stat: Telemetry; index: number }) {
  const value = useCountUp(stat.value, 1500, 150 + index * 120)
  const Icon = stat.icon

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.07 }}
      className="glass relative min-w-0 overflow-hidden rounded-2xl border border-[#D4AF37]/20 p-4 sm:p-5"
    >
      <div aria-hidden="true" className="absolute -right-8 -top-8 h-20 w-20 rounded-full opacity-20 blur-2xl" style={{ background: stat.color }} />
      <div className="relative flex items-center justify-between gap-2">
        <Icon className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
        <span className="font-mono text-[9px] uppercase tracking-widest text-[#A1A1AA]">live</span>
      </div>
      <p className="relative mt-3 font-mono text-2xl font-semibold tabular-nums text-[#F8FAFC] sm:text-3xl">
        {stat.prefix}
        {value.toFixed(stat.decimals ?? 0)}
        <span className="text-[#F5D061]">{stat.suffix}</span>
      </p>
      <p className="relative mt-1 text-sm font-medium text-[#F8FAFC]">{stat.label}</p>
      <p className="relative mt-0.5 text-xs text-[#A1A1AA]">{stat.detail}</p>
      <div className="relative mt-3 h-1 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F5D061]"
          initial={{ width: 0 }}
          animate={{ width: `${stat.progress * 100}%` }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </motion.article>
  )
}

export function OverviewDashboard({ onProgress }: { onProgress: (progress: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    const max = container.scrollHeight - container.clientHeight
    const progress = max > 0 ? container.scrollTop / max : 0
    setActiveSlide(Math.round(progress))
    onProgress(progress)
  }, [onProgress])

  const goToSlide = useCallback((index: number) => {
    const container = containerRef.current
    if (!container) return
    container.scrollTo({ top: index * container.clientHeight, behavior: 'smooth' })
  }, [])

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        aria-label="Overview slides"
        className="hud-scroll h-[calc(100vh-6.5rem)] snap-y snap-mandatory overflow-x-hidden overflow-y-auto scroll-smooth"
      >
        <section className="relative flex h-full snap-start items-center justify-center px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_48%,rgba(212,175,55,0.09),transparent_38%)]" />
        <div className="relative mx-auto grid h-full w-full max-w-7xl grid-cols-1 items-center gap-2 py-4 md:grid-cols-12 md:gap-3">
          <div className="relative z-10 md:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#0a0a0c]/90 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[#F5D061] shadow-[0_0_20px_-10px_rgba(245,208,97,0.8)] sm:text-[10px] sm:tracking-[0.2em]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F5D061] shadow-[0_0_10px_#F5D061]" />
              Available for Software &amp; DevOps Roles
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 text-5xl font-black leading-[0.95] tracking-tight text-[#F8FAFC] xl:text-6xl"
            >
              GAYATHRI
              <span className="gold-gradient mt-1 block">KALLURI</span>
            </motion.h1>
            <p aria-label={ROLES.join(' · ')} className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs leading-relaxed text-[#F5D061] sm:text-sm">
              {ROLES.map((role, index) => (
                <span key={role} className="inline-flex items-center gap-2">
                  <motion.span
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16 + index * 0.12, duration: 0.35 }}
                  >
                    {role}
                  </motion.span>
                  {index < ROLES.length - 1 && <span aria-hidden="true" className="text-[#D4AF37]/70">·</span>}
                </span>
              ))}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => goToSlide(1)}
                className="group inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#050505] shadow-[0_0_26px_rgba(212,175,55,0.4)] transition-all hover:bg-[#F5D061] hover:shadow-[0_0_36px_rgba(245,208,97,0.65)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D061]"
              >
                Explore Profile
                <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </button>
              <a
                href={profile.links.resume}
                download="Gayathri-Kalluri-Resume.pdf"
                className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF37]/40 bg-[#0f0f12]/90 px-4 py-2.5 text-sm font-semibold text-[#F8FAFC] backdrop-blur-md transition-colors hover:border-[#F5D061]/70 hover:text-[#F5D061] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F5D061]"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download Resume
              </a>
            </div>
          </div>
          <div className="relative z-0 flex justify-center md:col-span-5">
            <HolographicPortrait />
          </div>
        </div>
        </section>

        <section className="flex h-full snap-start flex-col justify-center px-6">
        <div className="mx-auto w-full max-w-5xl">
          <article className="rounded-2xl border border-amber-500/20 bg-black/80 p-5 shadow-[0_24px_70px_-38px_rgba(212,175,55,0.35)] backdrop-blur-md sm:p-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#D4AF37] sm:text-xs">
              // 01.2 — Engineer Profile &amp; Education
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-[#F8FAFC] sm:text-2xl">Engineering reliable systems, from code to cloud.</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#E4E4E7] sm:text-base">
              {profile.name} is pursuing {education.degree} at {education.school} with a CGPA of 8.5/10. Across two DevOps internships, she deployed containerized microservices on Kubernetes across AWS, GCP, and Azure, and built CI/CD pipelines. Her engineering work also includes a multithreaded Java/C++ game engine built around OOP and design patterns.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0c]/80 px-3 py-2 text-xs text-[#E4E4E7]">
                <MapPin className="h-3.5 w-3.5 text-[#F5D061]" aria-hidden="true" /> {profile.location}
              </span>
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0c]/80 px-3 py-2 text-xs text-[#E4E4E7] transition-colors hover:text-[#F5D061]">
                <Mail className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" /> {profile.email}
              </a>
              <a href={profile.phoneHref} className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/20 bg-[#0a0a0c]/80 px-3 py-2 text-xs text-[#E4E4E7] transition-colors hover:text-[#F5D061]">
                <Phone className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" /> {profile.phone}
              </a>
            </div>
          </article>
          <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            {TELEMETRY.map((stat, index) => (
              <TelemetryCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
        </section>
      </div>

      <nav aria-label="Overview slide navigation" className="pointer-events-none absolute right-2 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-2">
        {['01 // HERO', '02 // PROFILE & METRICS'].map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => goToSlide(index)}
            aria-current={activeSlide === index ? 'step' : undefined}
            aria-label={`Go to slide ${label}`}
            className={`pointer-events-auto rounded-lg border px-2 py-1.5 font-mono text-[8px] uppercase tracking-wide backdrop-blur-md transition-colors ${
              activeSlide === index ? 'border-[#D4AF37]/60 bg-[#050505]/90 text-[#F5D061]' : 'border-white/10 bg-[#050505]/70 text-[#A1A1AA] hover:text-[#F5D061]'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}
