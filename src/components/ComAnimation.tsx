import { ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import useStateRealtime from '@/hooks/useStateRealtime'
import { isBrowser } from '@/utils'

const AnimationWrapper = styled.div`
  ${props => {
    const { time, delay, type, play, distance } = props.theme as any

    if (!isBrowser) {
      return null
    }

    if (delay || !play) {
      return css`
        visibility: hidden;
        opacity: 0;
      `
    }

    const distancePx = `${distance}px`
    const animationTime = `${time}ms`

    const animationSlideUp = keyframes`
      from {
        opacity: 0;
        transform: translate3d(0, ${distancePx}, 0);
      }
      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }  
    `
    const animationFadeOut = keyframes`
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    `

    switch (type) {
      case 'slide':
        return css`
          animation: ${animationSlideUp} ${animationTime} ease-in-out 1;
        `
      default:
        return css`
          animation: ${animationFadeOut} ${animationTime} ease-in-out 1;
        `
    }
  }};
`

interface AnimationProps {
  children: ReactNode
  type?: 'fade' | 'slide'
  distance?: number
  time?: number
  delay?: number
}
const ComAnimation = ({ children, delay = 0, time = 400, type = 'fade', distance = 30 }: AnimationProps) => {
  const [delaying, setDelayTime] = useState<number>(delay)
  const [play, startAnimation, getRealAnimation] = useStateRealtime(false)
  const animationRef = useRef(null)
  useEffect(() => {
    const animationDom: any = animationRef.current
    const animationIntersection = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (!getRealAnimation()) {
          startAnimation(true)
          delay && setTimeout(() => setDelayTime(0), delay)
        }
      }
    })
    animationIntersection.observe(animationDom)
    return () => {
      animationIntersection.disconnect()
    }
  }, [delay])

  return (
    <AnimationWrapper theme={{ delay: delaying, time, type, play, distance }} ref={animationRef}>
      {children}
    </AnimationWrapper>
  )
}

export default ComAnimation
