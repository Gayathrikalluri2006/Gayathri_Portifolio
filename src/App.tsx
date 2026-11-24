import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navbar } from './components/hud/navbar'
import { ActionDock } from './components/hud/action-dock'
import { LiteBackground } from './components/hud/lite-background'
import { SceneBoundary } from './components/hud/scene-boundary'
import { OverviewDashboard } from './components/dashboards/overview'
import { DevOpsDashboard } from './components/dashboards/devops'
import { ProjectsDashboard } from './components/dashboards/projects'
import { StackDashboard } from './components/dashboards/stack'
import { useLiteMode } from './hooks/use-lite-mode'
import { projects, sectionThemes, type SceneTheme, type SectionId } from './data/portfolio'

const Scene = lazy(() => import('./components/scene/Scene'))

export default function App() {
  const [section, setSection] = useState<SectionId>('overview')
  const [projectIndex, setProjectIndex] = useState(0)
  const [booting, setBooting] = useState(true)
  const { lite, toggle, webgl } = useLiteMode()
  const scrollRef = useRef(0)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setBooting(false), 1200)
    return () => window.clearTimeout(timer)
  }, [])

  const theme: SceneTheme = useMemo(() => {
    const base = sectionThemes[section]
    if (section !== 'projects') return base
    return { ...base, ...projects[projectIndex].theme }
  }, [section, projectIndex])

  const navigate = useCallback((id: SectionId) => {
    setSection(id)
    scrollRef.current = 0
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const onOverviewProgress = useCallback((progress: number) => {
    scrollRef.current = progress
  }, [])

  const onScroll = useCallback(() => {
    const el = mainRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    scrollRef.current = max > 0 ? el.scrollTop / max : 0
  }, [])

  const liteFallback = <LiteBackground theme={theme} />

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="fixed inset-0 z-0">
        {lite ? (
          liteFallback
        ) : (
          <SceneBoundary fallback={liteFallback}>
            <Suspense fallback={liteFallback}>
              <Scene theme={theme} scrollRef={scrollRef} />
            </Suspense>
          </SceneBoundary>
        )}
      </div>
      <div aria-hidden="true" className="hud-grid pointer-events-none fixed inset-0 z-[1]" />
      <div aria-hidden="true" className="scanlines pointer-events-none fixed inset-0 z-[1]" />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgb(5_5_5/0.82)_100%)]" />

      <Navbar active={section} accent={theme.primary} onChange={navigate} lite={lite} onToggleLite={toggle} webgl={webgl} />

      <main ref={mainRef} onScroll={onScroll} className="hud-scroll fixed inset-x-0 bottom-12 top-14 z-10 overflow-y-auto">
        <div
          id="hud-panel"
          role="tabpanel"
          aria-labelledby={`tab-${section}`}
          className={section === 'overview' ? 'h-full' : 'mx-auto w-full max-w-7xl px-3 pb-16 pt-5 sm:px-6'}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={section}
              className={section === 'overview' ? 'h-full' : ''}
              initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(10px)' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {section === 'overview' && <OverviewDashboard onProgress={onOverviewProgress} />}
              {section === 'devops' && <DevOpsDashboard />}
              {section === 'projects' && <ProjectsDashboard activeIndex={projectIndex} onSelect={setProjectIndex} />}
              {section === 'stack' && <StackDashboard />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <ActionDock accent={theme.primary} />

      <AnimatePresence>
        {booting && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-[#050505]"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            role="status"
            aria-live="polite"
          >
            <div className="w-[min(88vw,34rem)] rounded-2xl border border-[#D4AF37]/30 bg-[#0a0a0c]/90 p-6 shadow-[0_0_70px_-30px_rgba(212,175,55,0.65)] sm:p-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#F5D061]">Gayathri Kalluri · Creative Systems</p>
              <p className="mt-5 font-mono text-sm text-[#F8FAFC] sm:text-base">INITIALIZING 3D GOLD-CORE ENVIRONMENT...</p>
              <div className="mt-4 h-px overflow-hidden bg-white/10">
                <motion.div
                  className="gold-beam h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.05, ease: 'easeInOut' }}
                />
              </div>
              <p className="mt-3 font-mono text-xs tracking-widest text-[#A1A1AA]">SYSTEM CHECK <span className="text-[#F5D061]">[OK]</span></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
