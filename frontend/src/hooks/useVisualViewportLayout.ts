import { useEffect, useState, type CSSProperties } from 'react'

const KEYBOARD_THRESHOLD_PX = 80
const VIEWPORT_PADDING_PX = 16

export interface VisualViewportLayout {
  offsetTop: number
  height: number
  keyboardOpen: boolean
}

function readViewportLayout(): VisualViewportLayout {
  if (typeof window === 'undefined') {
    return { offsetTop: 0, height: 0, keyboardOpen: false }
  }

  const vv = window.visualViewport
  if (!vv) {
    return {
      offsetTop: 0,
      height: window.innerHeight,
      keyboardOpen: false,
    }
  }

  return {
    offsetTop: vv.offsetTop,
    height: vv.height,
    keyboardOpen: window.innerHeight - vv.height > KEYBOARD_THRESHOLD_PX,
  }
}

export function getModalContainerMotion(layout: VisualViewportLayout) {
  return {
    top: layout.keyboardOpen ? layout.offsetTop : 0,
    height: layout.height,
  }
}

export function getModalContainerStyle(layout: VisualViewportLayout): CSSProperties {
  return {
    alignItems: layout.keyboardOpen ? 'flex-start' : 'center',
    paddingTop: layout.keyboardOpen
      ? `max(${VIEWPORT_PADDING_PX}px, env(safe-area-inset-top))`
      : 'env(safe-area-inset-top)',
    paddingBottom: layout.keyboardOpen
      ? `max(${VIEWPORT_PADDING_PX}px, env(safe-area-inset-bottom))`
      : 'env(safe-area-inset-bottom)',
  }
}

export function useVisualViewportLayout(enabled: boolean): VisualViewportLayout {
  const [layout, setLayout] = useState(readViewportLayout)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const vv = window.visualViewport
    if (!vv) return

    const update = () => setLayout(readViewportLayout())

    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    window.addEventListener('orientationchange', update)

    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      window.removeEventListener('orientationchange', update)
    }
  }, [enabled])

  return layout
}
