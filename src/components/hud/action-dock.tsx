import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Download } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from './brand-icons'
import { profile } from '../../data/portfolio'

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  }
}

const itemClass =
  'flex h-10 items-center gap-2 rounded-xl px-3 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-sky-400'

export function ActionDock({ accent }: { accent: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 24 }}
        className="glass pointer-events-auto flex items-center gap-1 rounded-2xl p-1.5"
      >
        <a href={profile.links.github} target="_blank" rel="noreferrer" className={itemClass} aria-label="GitHub profile">
          <GithubIcon />
          <span className="hidden md:inline">GitHub</span>
        </a>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className={itemClass} aria-label="LinkedIn profile">
          <LinkedinIcon />
          <span className="hidden md:inline">LinkedIn</span>
        </a>
        <button
          type="button"
          onClick={async () => setCopied(await copyText(profile.email))}
          className={itemClass}
          aria-label={copied ? 'Email copied to clipboard' : `Copy email ${profile.email}`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={copied ? 'ok' : 'copy'} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}>
              {copied ? <Check className="h-4 w-4 text-[#F5D061]" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
            </motion.span>
          </AnimatePresence>
          <span className="hidden font-mono text-xs sm:inline">{copied ? 'Copied!' : profile.email}</span>
        </button>
        <span className="mx-1 h-6 w-px bg-slate-700/70" aria-hidden="true" />
        <a
          href={profile.links.resume}
          download="Gayathri-Kalluri-Resume.pdf"
          className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-slate-950 transition-[box-shadow,background-color] duration-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
          style={{ backgroundColor: accent, boxShadow: `0 0 24px ${accent}70` }}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span>Resume</span>
        </a>
        <span className="sr-only" role="status" aria-live="polite">
          {copied ? 'Email address copied to clipboard' : ''}
        </span>
      </motion.div>
    </div>
  )
}
