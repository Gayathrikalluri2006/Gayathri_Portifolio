import type { SceneTheme } from '../../data/portfolio'

export function LiteBackground({ theme }: { theme: SceneTheme }) {
  const { primary, secondary } = theme
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-obsidian">
      <div
        className="absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `radial-gradient(circle at 70% 40%, ${primary}26, transparent 45%), radial-gradient(circle at 20% 80%, ${secondary}1f, transparent 40%)`,
        }}
      />
      <div className="absolute right-[8%] top-1/2 hidden aspect-square w-[34vw] max-w-[520px] -translate-y-1/2 lg:block">
        <div
          className="absolute inset-[30%] rounded-full transition-[background,box-shadow] duration-1000"
          style={{
            background: `radial-gradient(circle at 35% 35%, ${secondary}, ${primary} 55%, #050505 100%)`,
            boxShadow: `0 0 80px ${primary}80`,
            animation: 'lite-pulse 4s ease-in-out infinite',
          }}
        />
        <div className="absolute inset-[14%] rounded-full border border-dashed transition-colors duration-1000" style={{ borderColor: `${primary}66`, animation: 'lite-spin 30s linear infinite' }} />
        <div className="absolute inset-0 rounded-full border transition-colors duration-1000" style={{ borderColor: `${secondary}40`, animation: 'lite-spin 50s linear infinite reverse' }}>
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: secondary, boxShadow: `0 0 12px ${secondary}` }} />
        </div>
      </div>
    </div>
  )
}
