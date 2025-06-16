import { Suspense } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { QUERY_PARAMS, BOSS_CONFIG, isValidScore, sanitizeBossName, type BossKey } from '@/lib/constants'

interface ResultPageProps {
  searchParams: Promise<{
    [QUERY_PARAMS.BOSS_NAME]?: string
    [QUERY_PARAMS.PLAYER_SCORE]?: string
    [QUERY_PARAMS.BOSS_SCORE]?: string
  }>
}

function getBossImage(bossname?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const bossKey = bossname?.toLowerCase() as BossKey
  
  if (bossKey && BOSS_CONFIG[bossKey]) {
    return BOSS_CONFIG[bossKey].ogImage
  }
  
  return `${baseUrl}/images/default-boss.svg`
}

export async function generateMetadata({ searchParams }: ResultPageProps): Promise<Metadata> {
  const params = await searchParams
  const bossname = sanitizeBossName(params[QUERY_PARAMS.BOSS_NAME])
  const scoreplayer = params[QUERY_PARAMS.PLAYER_SCORE]
  const scoreboss = params[QUERY_PARAMS.BOSS_SCORE]
  
  const playerScore = parseInt(scoreplayer || '0')
  const bossScore = parseInt(scoreboss || '0')
  const result = playerScore > bossScore ? 'Victory!' : playerScore < bossScore ? 'Defeat!' : 'Draw!'
  
  const bossImage = getBossImage(bossname)
  const title = `Battle Result: ${result} vs ${bossname || 'Boss'}`
  const description = `Player: ${playerScore} | ${bossname || 'Boss'}: ${bossScore} - ${result}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: bossImage,
          width: 1200,
          height: 630,
          alt: `Battle against ${bossname || 'Boss'} - ${result}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bossImage],
    },
  }
}

async function ResultContent({ searchParams }: ResultPageProps) {
  const params = await searchParams
  const rawBossName = params[QUERY_PARAMS.BOSS_NAME]
  const rawPlayerScore = params[QUERY_PARAMS.PLAYER_SCORE]
  const rawBossScore = params[QUERY_PARAMS.BOSS_SCORE]
  
  // Validate inputs
  if (!isValidScore(rawPlayerScore) || !isValidScore(rawBossScore)) {
    notFound()
  }
  
  const bossname = sanitizeBossName(rawBossName)
  const playerScore = parseInt(rawPlayerScore || '0')
  const bossScore = parseInt(rawBossScore || '0')
  const result = playerScore > bossScore ? 'Victory!' : playerScore < bossScore ? 'Defeat!' : 'Draw!'
  
  // Get boss configuration
  const bossKey = bossname?.toLowerCase() as BossKey
  const bossConfig = bossKey && BOSS_CONFIG[bossKey] ? BOSS_CONFIG[bossKey] : null
  
  const gradientClass = bossConfig?.gradient || 'bg-gradient-to-r from-blue-900 via-purple-900 to-purple-900'
  const bossCharacterImage = bossConfig?.characterImage || null
  const bossScoreColor = bossConfig?.scoreColor || 'bg-purple-600'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
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
        </div>
      </div>
    </div>
  )
}

export default function ResultPage({ searchParams }: ResultPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent searchParams={searchParams} />
    </Suspense>
  )
}