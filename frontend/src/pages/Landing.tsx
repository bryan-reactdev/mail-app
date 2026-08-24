import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { LayoutDashboard, Shield, Users } from 'lucide-react'
import Prism from '@/components/Prism'
import Aurora from '@/components/Aurora'
import { LandingFooter } from '@/components/landing/LandingFooter'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import {
  BlurFade,
  BlurFadeItem,
  BlurFadeStagger,
} from '@/components/magicui/blur-fade'
import { BorderBeam } from '@/components/magicui/border-beam'

const features = [
  {
    icon: Users,
    title: 'Gestión de usuarios',
    description: 'Directorio de usuarios, roles y permisos desde un panel centralizado.',
  },
  {
    icon: Shield,
    title: 'Autenticación segura',
    description: 'Login, registro y soporte SSO listos para integrar con tu ecosistema.',
  },
  {
    icon: LayoutDashboard,
    title: 'Panel administrativo',
    description: 'Dashboard, tablas y componentes reutilizables para construir tu producto.',
  },
] as const

const LANDING_AURORA_STOPS = ['#5b3fd4', '#6ee7a8', '#7c5cbf'] as const

export default function Landing() {
  return (
    <div className="relative min-h-screen min-h-[100dvh] overflow-x-hidden bg-[#1b1e27] text-white">
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-0 h-[min(70vh,680px)]"
        aria-hidden
      >
        <Aurora
          origin="bottom"
          colorStops={[...LANDING_AURORA_STOPS]}
          amplitude={1.05}
          blend={0.55}
          speed={0.85}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[#1b1e27]/45 to-[#1b1e27]/90" />
      </div>

      <div className="relative z-10">
        <LandingNavbar />

        <section className="relative flex min-h-screen min-h-[100dvh] flex-col">
          <div className="pointer-events-none absolute inset-0">
            <Prism
              animationType="rotate"
              timeScale={0.5}
              height={3.5}
              baseWidth={5.5}
              scale={3.6}
              glow={1}
              bloom={1}
              noise={0}
              hueShift={0}
              colorFrequency={1}
              transparent
              suspendWhenOffscreen
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1b1e27]/20 to-[#1b1e27]" />
          </div>

          <BlurFadeStagger
            className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-20 pt-28 text-center"
            stagger={0.12}
            delayChildren={0.1}
            once={false}
            amount={0.5}
            margin="0px"
          >
            <BlurFadeItem direction="down" yOffset={12}>
              <div className="mb-8 inline-flex overflow-hidden rounded-full border border-white/10 text-[0.7rem] font-semibold tracking-wide">
                <span className="bg-white px-3 py-1.5 text-black">BASE</span>
                <span className="bg-white/10 px-3 py-1.5 text-white/75">
                  Starter listo para personalizar
                </span>
              </div>
            </BlurFadeItem>

            <BlurFadeItem direction="up" yOffset={10}>
              <p className="text-primary mb-3 text-sm font-medium tracking-wide uppercase">
                Base App
              </p>
            </BlurFadeItem>

            <BlurFadeItem direction="up" yOffset={24} blur={10}>
              <h1 className="max-w-3xl text-[2.1rem] font-bold leading-[1.08] tracking-tight sm:text-[3.25rem] sm:leading-[1.05]">
                Tu aplicación, con lo esencial ya resuelto
              </h1>
            </BlurFadeItem>

            <BlurFadeItem direction="up" yOffset={20}>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
                React, autenticación, panel administrativo, tablas de usuarios y componentes UI.
                Renombra el branding y construye tu producto encima.
              </p>
            </BlurFadeItem>

            <BlurFadeItem direction="up" yOffset={16}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/login"
                    className="inline-flex h-11 items-center rounded-full bg-white px-7 text-sm font-semibold text-black"
                  >
                    Acceder al panel
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="inline-flex h-11 items-center rounded-full border border-white/15 bg-white/5 px-7 text-sm font-semibold text-white/90 backdrop-blur-sm transition-colors duration-200 hover:bg-white/10"
                  >
                    Crear cuenta
                  </Link>
                </motion.div>
              </div>
            </BlurFadeItem>
          </BlurFadeStagger>
        </section>

        <section id="features" className="relative border-t border-white/6 py-20">
          <div className="mx-auto max-w-5xl px-4">
            <BlurFade direction="up" yOffset={20} amount={0.4}>
              <h2 className="mb-3 text-center text-2xl font-bold sm:text-3xl">
                Lo que incluye
              </h2>
            </BlurFade>
            <BlurFade direction="up" yOffset={16} delay={0.08} amount={0.4}>
              <p className="mx-auto mb-12 max-w-2xl text-center text-sm leading-relaxed text-white/55 sm:text-base">
                Infraestructura probada para arrancar rápido: auth, roles, layout, landing y CRUD de usuarios.
              </p>
            </BlurFade>

            <BlurFadeStagger className="grid gap-5 sm:grid-cols-3" stagger={0.12}>
              {features.map((feature, i) => {
                const Icon = feature.icon
                return (
                  <BlurFadeItem
                    key={feature.title}
                    direction={i === 1 ? 'up' : i === 0 ? 'left' : 'right'}
                    xOffset={28}
                    yOffset={20}
                  >
                    <motion.div
                      className="group relative h-full overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm"
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    >
                      <BorderBeam
                        size={160}
                        duration={12}
                        className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                      />
                      <Icon className="text-primary relative z-10 mb-4 size-7" />
                      <h3 className="relative z-10 font-semibold">{feature.title}</h3>
                      <p className="relative z-10 mt-2 text-sm leading-relaxed text-white/55">
                        {feature.description}
                      </p>
                    </motion.div>
                  </BlurFadeItem>
                )
              })}
            </BlurFadeStagger>
          </div>
        </section>

        <LandingFooter />
      </div>
    </div>
  )
}
