import { motion } from 'motion/react'
import { BlurFade } from '@/components/magicui/blur-fade'
import { BorderBeam } from '@/components/magicui/border-beam'

interface AuthCardProps {
  title: string
  description: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <BlurFade direction="up" yOffset={28} blur={10} amount={0.35} margin="0px" className="w-full max-w-md">
      <motion.div
        className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm sm:p-9"
        whileHover={{ scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 220, damping: 28 }}
      >
        <BorderBeam size={200} duration={14} borderWidth={1.25} />

        <p className="text-primary mb-2 text-xs font-semibold uppercase tracking-wide">
          Mail App
        </p>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-white/55">{description}</p>

        <div className="mt-8">{children}</div>
        {footer && <div className="mt-6">{footer}</div>}
      </motion.div>
    </BlurFade>
  )
}
