import { Component, type ReactNode } from 'react'

type Props = { fallback: ReactNode; children: ReactNode }

export class SceneBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('3D scene failed, falling back to 2D lite mode:', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
