import { motion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  yOffset?: number
  xOffset?: number
  blur?: number
  /** Animate when element enters viewport (default). Set false for mount-only (e.g. hero). */
  inView?: boolean
  /** If true, only animate once. If false, re-animates on scroll exit/enter. */
  once?: boolean
  direction?: Direction
  /** Viewport trigger threshold */
  amount?: number | 'some' | 'all'
  margin?: string
}

function getHiddenOffset(
  direction: Direction,
  xOffset: number,
  yOffset: number,
): { x: number; y: number } {
  switch (direction) {
    case 'up':
      return { x: 0, y: yOffset }
    case 'down':
      return { x: 0, y: -yOffset }
    case 'left':
      return { x: xOffset, y: 0 }
    case 'right':
      return { x: -xOffset, y: 0 }
    default:
      return { x: 0, y: 0 }
  }
}

const ease = [0.21, 0.47, 0.32, 0.98] as const

function buildMotionState(
  offset: { x: number; y: number },
  reduced: boolean,
  blur: number,
  visible: boolean,
) {
  if (reduced) {
    return visible ? { opacity: 1, x: 0, y: 0, scale: 1 } : { opacity: visible ? 1 : 0, x: 0, y: 0, scale: 1 }
  }

  if (visible) {
    return { opacity: 1, x: 0, y: 0, scale: 1 }
  }

  // Scale mimics the soft blur entrance without animating filter (GPU-friendly).
  const scale = blur > 0 ? 0.97 : 1
  return { opacity: 0, x: offset.x, y: offset.y, scale }
}

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.55,
  yOffset = 16,
  xOffset = 16,
  blur = 8,
  inView = true,
  once = true,
  direction = 'up',
  amount = 0.35,
  margin = '-60px',
}: BlurFadeProps) {
  const reduced = useReducedMotion()
  const offset = getHiddenOffset(direction, xOffset, yOffset)
  const hidden = buildMotionState(offset, reduced, blur, false)
  const visible = buildMotionState(offset, reduced, blur, true)
  const transition = reduced
    ? { duration: 0.01, delay: 0 }
    : { duration, delay, ease }

  const motionClass = cn(className, !reduced && 'will-change-[transform,opacity]')

  if (inView) {
    return (
      <motion.div
        initial={hidden}
        whileInView={visible}
        viewport={{ once, amount, margin }}
        transition={transition}
        className={motionClass}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={hidden}
      animate={visible}
      exit={hidden}
      transition={transition}
      className={motionClass}
    >
      {children}
    </motion.div>
  )
}

interface BlurFadeStaggerProps {
  children: React.ReactNode
  className?: string
  stagger?: number
  delayChildren?: number
  once?: boolean
  amount?: number | 'some' | 'all'
  margin?: string
}

export function BlurFadeStagger({
  children,
  className,
  stagger = 0.1,
  delayChildren = 0.05,
  once = true,
  amount = 0.2,
  margin = '-40px',
}: BlurFadeStaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

interface BlurFadeItemProps {
  children: React.ReactNode
  className?: string
  direction?: Direction
  yOffset?: number
  xOffset?: number
  blur?: number
  duration?: number
}

export function BlurFadeItem({
  children,
  className,
  direction = 'up',
  yOffset = 20,
  xOffset = 20,
  blur = 8,
  duration = 0.5,
}: BlurFadeItemProps) {
  const reduced = useReducedMotion()
  const offset = getHiddenOffset(direction, xOffset, yOffset)
  const scale = reduced || blur <= 0 ? 1 : 0.97

  const variants: Variants = reduced
    ? {
        hidden: { opacity: 1, x: 0, y: 0, scale: 1 },
        visible: { opacity: 1, x: 0, y: 0, scale: 1 },
      }
    : {
        hidden: {
          opacity: 0,
          x: offset.x,
          y: offset.y,
          scale,
        },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: { duration, ease },
        },
      }

  return (
    <motion.div variants={variants} className={cn(className, !reduced && 'will-change-[transform,opacity]')}>
      {children}
    </motion.div>
  )
}
