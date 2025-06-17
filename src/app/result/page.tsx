import { Suspense } from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { QUERY_PARAMS, BOSS_CONFIG, isValidScore, sanitizeBossName, type BossKey } from '@/lib/constants'
import ResultDisplay from '@/components/ResultDisplay'

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

  return (
    <ResultDisplay
      bossname={bossname}
      playerScore={playerScore}
      bossScore={bossScore}
      result={result}
    />
  )
}

export default function ResultPage({ searchParams }: ResultPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultContent searchParams={searchParams} />
    </Suspense>
  )
}