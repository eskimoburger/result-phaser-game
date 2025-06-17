'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { BOSS_CONFIG, type BossKey } from '@/lib/constants'
import ConfettiEffect from '@/components/ConfettiEffect'

interface ResultDisplayProps {
  bossname: string
  playerScore: number
  bossScore: number
  result: 'Victory!' | 'Defeat!' | 'Draw!'
}

export default function ResultDisplay({ bossname, playerScore, bossScore, result }: ResultDisplayProps) {
  // Get boss configuration
  const bossKey = bossname?.toLowerCase() as BossKey
  const bossConfig = bossKey && BOSS_CONFIG[bossKey] ? BOSS_CONFIG[bossKey] : null
  
  const gradientClass = bossConfig?.gradient || 'bg-gradient-to-r from-blue-900 via-purple-900 to-purple-900'
  const bossCharacterImage = bossConfig?.characterImage || null
  const bossScoreColor = bossConfig?.scoreColor || 'bg-purple-600'

  // State to track if share button should be hidden (prevents hydration mismatch)
  const [hideShareButton, setHideShareButton] = useState(false)

  // Check URL parameters after component mounts (client-side only)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const shouldHide = urlParams.get('share') === 'false' || urlParams.get('share') === '0'
    setHideShareButton(shouldHide)
  }, [])

  const handleShare = async () => {
    try {
      console.log('Share button clicked')
      
      // Check if window object is available (client-side)
      if (typeof window === 'undefined') {
        console.error('Window object not available')
        return
      }
      
      // Get URL parameters for sharing
      const urlParams = new URLSearchParams(window.location.search)
      const eventId = urlParams.get('event_id') || ''
      const sessionId = urlParams.get('session_id') || ''
      const participantId = urlParams.get('participant_id') || ''
      
      console.log('URL Parameters:', { eventId, sessionId, participantId })
      
      const shareTitle = `Battle Result: ${result} vs ${bossname || 'Boss'} - Player: ${playerScore} | ${bossname || 'Boss'}: ${bossScore}`
      const shareUrl = `https://result-marketing.devsmithdev.xyz/minigame-codeclean/result?event_id=${eventId}&session_id=${sessionId}&participant_id=${participantId}&hashtag=#devsmith`
      
      console.log('Share data:', { shareTitle, shareUrl })

      if (navigator.share) {
        console.log('Using native Web Share API')
        try {
          await navigator.share({
            title: shareTitle,
            text: shareTitle,
            url: shareUrl
          })
          console.log('Content shared successfully')
        } catch (error) {
          console.error('Error sharing content:', error)
          // If Web Share API fails (e.g., no user gesture), fall back to other methods
          if (error instanceof Error && (error.name === 'NotAllowedError' || error.message.includes('user gesture'))) {
            console.log('Web Share API requires user gesture, falling back to other methods')
            // Fall back to the same logic as non-Web Share API devices
            const userAgent = navigator.userAgent || navigator.vendor
            if (/android/i.test(userAgent)) {
              console.log('Android device detected, opening Facebook share')
              const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
              window.open(facebookShareUrl, '_blank', 'noopener,noreferrer')
            } else {
              console.log('Non-Android device, showing alert')
              alert('Please click the share button to share your results.')
            }
          }
        }
      } else {
        console.log('Web Share API not available, using fallback')
        // Fallback for devices that do not support the Web Share API
        const userAgent = navigator.userAgent || navigator.vendor
        console.log('User agent:', userAgent)
        
        if (/android/i.test(userAgent)) {
          console.log('Android device detected, opening Facebook share')
          const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
          window.open(facebookShareUrl, '_blank', 'noopener,noreferrer')
        } else {
          console.log('Non-Android device, showing alert')
          alert('Web Share API is not supported on this device.')
        }
      }
    } catch (error) {
      console.error('Unexpected error in handleShare:', error)
    }
  }



  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Confetti Effect */}
      <ConfettiEffect trigger={result === 'Victory!'} type="victory" />
      
      {/* Background gradient */}
      <div className={`absolute inset-0 ${gradientClass}`} />
      
      {/* Lightning effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent transform rotate-12 opacity-70" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
        {/* Battle display */}
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-8 sm:mb-12 px-2 sm:px-4">
          {/* Player side */}
          <div className="flex flex-col items-center flex-1 max-w-[120px] sm:max-w-[150px] md:max-w-none md:w-48">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 relative mb-2 sm:mb-4">
              <Image
                src="/player.png"
                alt="Player character avatar ready for battle"
                width={128}
                height={128}
                className="object-contain"
              />
            </div>
            <h3 className="text-white text-sm sm:text-base md:text-xl font-bold mb-2 sm:mb-4">Player</h3>
            <div className="bg-blue-600 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl min-w-[60px] sm:min-w-[80px] flex justify-center" aria-label={`Player score: ${playerScore}`}>
              <span className="text-white text-lg sm:text-xl md:text-2xl font-bold">{playerScore}</span>
            </div>
          </div>

          {/* VS */}
          <div className="flex items-center justify-center mx-2 sm:mx-4">
            <h2 className="text-2xl sm:text-3xl md:text-6xl font-bold text-white transform -skew-x-12">VS</h2>
          </div>

          {/* Boss side */}
          <div className="flex flex-col items-center flex-1 max-w-[120px] sm:max-w-[150px] md:max-w-none md:w-48">
            <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 relative mb-2 sm:mb-4">
              {bossCharacterImage ? (
                <Image
                  src={bossCharacterImage}
                  alt={`${bossConfig?.name || bossname || 'Boss'} character avatar ready for battle`}
                  width={128}
                  height={128}
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full bg-purple-700 rounded-full flex items-center justify-center border-4 border-purple-600">
                  <span className="text-4xl">👹</span>
                </div>
              )}
            </div>
            <h3 className="text-white text-xs sm:text-base md:text-xl font-bold mb-2 sm:mb-4 uppercase text-center break-words">{bossConfig?.name || bossname || 'Boss'}</h3>
            <div className={`${bossScoreColor} px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl min-w-[60px] sm:min-w-[80px] flex justify-center`} aria-label={`Boss score: ${bossScore}`}>
              <span className="text-white text-lg sm:text-xl md:text-2xl font-bold">{bossScore}</span>
            </div>
          </div>
        </div>

        {/* Result section */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            {result === 'Victory!' ? 'คุณได้รับชัยชนะ' : result === 'Defeat!' ? 'คุณพ่ายแพ้' : 'เสมอกัน'}
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-gray-200 mb-6 sm:mb-8 px-4">
            {result === 'Victory!' ? (
              <>
                ชัยชนะที่ได้รับสามารถต่อยอดไปในธุรกิจจริง<br className="hidden sm:block" />
                <span className="block sm:inline">ปรึกษาเรา DEVSMITH ช่วยได้</span>
              </>
            ) : result === 'Defeat!' ? (
              <>ความพ่ายแพ้คือบทเรียน ลองใหม่อีกครั้ง!</>
            ) : (
              <>การเสมอกันแสดงถึงความสามารถที่ใกล้เคียงกัน</>
            )}
          </p>
          
          {/* Result badge */}
          <div className={`inline-block text-2xl sm:text-3xl font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-2xl ${
            result === 'Victory!' ? 'bg-green-500 text-white' :
            result === 'Defeat!' ? 'bg-red-500 text-white' :
            'bg-yellow-500 text-white'
          }`}>
            {result === 'Victory!' ? 'ชัยชนะ!' : result === 'Defeat!' ? 'พ่ายแพ้!' : 'เสมอ!'}
          </div>
          
          {/* Share button - conditionally rendered */}
          {!hideShareButton && (
            <div className="mt-6 sm:mt-8">
              <button
                onClick={handleShare}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                แชร์ผลลัพธ์
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}