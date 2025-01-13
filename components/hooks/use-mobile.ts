'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
} 