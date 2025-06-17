'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface ConfettiEffectProps {
  trigger: boolean
  type?: 'victory' | 'celebration'
}

export default function ConfettiEffect({ trigger, type = 'victory' }: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger) return

    const runConfetti = () => {
      if (type === 'victory') {
        // Victory burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
        })

        // Side bursts
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFD700', '#FF6B6B', '#4ECDC4']
          })
        }, 250)

        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#45B7D1', '#96CEB4', '#FFEAA7']
          })
        }, 400)
      } else {
        // Simple celebration
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        })
      }
    }

    runConfetti()
  }, [trigger, type])

  return null
}