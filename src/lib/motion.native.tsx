import React, { useMemo, useCallback, useState } from "react"
import { Pressable } from "react-native"
import { MotiView, AnimatePresence } from "moti"
import type { MotiProps } from "moti"

type FramerVariants = Record<string, Record<string, any>>

type FramerTransition = {
  duration?: number
  delay?: number
  ease?: [number, number, number, number] | string
  type?: "spring" | "tween"
  stiffness?: number
  damping?: number
  mass?: number
}

type FramerMotionProps = {
  children?: React.ReactNode
  variants?: FramerVariants
  initial?: any
  animate?: any
  exit?: any
  whileInView?: Record<string, any>
  whileHover?: Record<string, any>
  whileTap?: Record<string, any>
  transition?: FramerTransition
  viewport?: { once?: boolean; margin?: string }
  layout?: boolean | string
  layoutId?: string
  custom?: number
  style?: any
  className?: string
  ref?: any
  key?: string | number
  onClick?: (e: any) => void
  onPress?: (e: any) => void
  [key: string]: any
}

function resolveVariants(
  variants: FramerVariants | undefined,
  name: string | undefined,
  custom?: number
): Record<string, any> | undefined {
  if (!variants || !name) return undefined
  const v = variants[name]
  if (typeof v === "function") return v(custom)
  return v
}

function mapTransitionStyle(t?: FramerTransition): MotiProps<any>["transition"] {
  if (!t) return undefined
  const result: any = {}
  if (t.duration) result.duration = t.duration
  if (t.delay) result.delay = t.delay
  if (t.type === "spring") {
    result.type = "spring"
    if (t.stiffness) result.stiffness = t.stiffness
    if (t.damping) result.damping = t.damping
    if (t.mass) result.mass = t.mass
  } else {
    result.type = "timing"
  }
  return result
}

function createMotionComponent() {
  return React.forwardRef<any, FramerMotionProps>((props, ref) => {
    const {
      variants,
      initial,
      animate: animateProp,
      exit,
      whileInView,
      whileHover,
      whileTap,
      transition,
      viewport,
      layout,
      layoutId,
      custom,
      style: styleProp,
      children,
      ...rest
    } = props

    const resolvedInitial = useMemo(
      () => resolveVariants(variants, initial, custom) || initial || undefined,
      [variants, initial, custom]
    )

    const resolvedAnimate = useMemo(() => {
      const base = resolveVariants(variants, animateProp, custom) || animateProp || undefined
      if (!base && whileInView) {
        return { ...resolvedInitial, ...whileInView }
      }
      if (base && whileInView) {
        return { ...base, ...whileInView }
      }
      return base
    }, [variants, animateProp, custom, whileInView, resolvedInitial])

    const resolvedExit = useMemo(
      () => exit || undefined,
      [exit]
    )

    const motiTransition = useMemo(
      () => mapTransitionStyle(transition),
      [transition]
    )

    const [pressed, setPressed] = useState(false)

    const handlePressIn = useCallback(() => {
      setPressed(true)
    }, [])

    const handlePressOut = useCallback(() => {
      setPressed(false)
    }, [])

    const combinedAnimate = useMemo(() => {
      let anim = resolvedAnimate ? { ...resolvedAnimate } : {}
      if (whileTap && pressed) {
        anim = { ...anim, ...whileTap }
      }
      return anim
    }, [resolvedAnimate, whileTap, pressed])

    if (whileTap) {
      return (
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={rest.onPress || rest.onClick}
        >
          <MotiView
            ref={ref}
            from={resolvedInitial}
            animate={combinedAnimate}
            exit={resolvedExit}
            transition={motiTransition}
            style={styleProp}
          >
            {children}
          </MotiView>
        </Pressable>
      )
    }

    return (
      <MotiView
        ref={ref}
        from={resolvedInitial}
        animate={resolvedAnimate}
        exit={resolvedExit}
        transition={motiTransition}
        style={styleProp}
        {...rest}
      >
        {children}
      </MotiView>
    )
  })
}

const comp = createMotionComponent()

export const motion = {
  View: comp,
  div: comp,
  main: comp,
  section: comp,
  header: comp,
  footer: comp,
  nav: comp,
  aside: comp,
  form: comp,
  span: comp,
  button: comp,
  h1: comp,
  h2: comp,
  h3: comp,
  h4: comp,
  p: comp,
  svg: comp,
  img: comp,
  a: comp,
  input: comp,
  label: comp,
}

export { AnimatePresence }
