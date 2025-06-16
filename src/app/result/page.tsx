import { Suspense } from 'react'
import { Metadata } from 'next'
import Image from 'next/image'

interface ResultPageProps {
  searchParams: Promise<{
    bossname?: string
    scoreplayer?: string
    scoreboss?: string
  }>
}

function getBossImage(bossname?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  switch (bossname?.toLowerCase()) {
    case 'lady delayna':
      return 'https://pub-7816c9687d9b47a894436af0a6cc0309.r2.dev/background.png'
    case 'phantom tax':
      return 'https://pub-7816c9687d9b47a894436af0a6cc0309.r2.dev/Card.png'
    case 'dragon':
      return `${baseUrl}/images/dragon-boss.jpg`
    case 'wizard':
      return `${baseUrl}/images/wizard-boss.jpg`
    case 'knight':
      return `${baseUrl}/images/knight-boss.jpg`
    case 'demon':
      return `${baseUrl}/images/demon-boss.jpg`
    default:
      return `${baseUrl}/images/default-boss.jpg`
  }
}

export async function generateMetadata({ searchParams }: ResultPageProps): Promise<Metadata> {
  const params = await searchParams
  const { bossname, scoreplayer, scoreboss } = params
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
  const { bossname, scoreplayer, scoreboss } = params

  const playerScore = parseInt(scoreplayer || '0')
  const bossScore = parseInt(scoreboss || '0')
  const result = playerScore > bossScore ? 'Victory!' : playerScore < bossScore ? 'Defeat!' : 'Draw!'

  // Determine background gradient based on boss
  const getGradientClass = () => {
    switch (bossname?.toLowerCase()) {
      case 'phantom tax':
        return 'bg-gradient-to-r from-blue-900 via-purple-900 to-red-900'
      case 'lady delayna':
      default:
        return 'bg-gradient-to-r from-blue-900 via-purple-900 to-purple-900'
    }
  }
  
  const gradientClass = getGradientClass()
  const isPhantomTax = bossname?.toLowerCase() === 'phantom tax'

  // Determine boss image
  const getBossCharacterImage = () => {
    switch (bossname?.toLowerCase()) {
      case 'lady delayna':
        return '/ladydelayna.png'
      case 'phantom tax':
        return '/phantomtax.png'
      default:
        return null
    }
  }

  const bossCharacterImage = getBossCharacterImage()

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
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-12">
          {/* Player side */}
          <div className="flex flex-col items-center w-48">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 relative mb-4">
              <Image
                src="/player.png"
                alt="Player"
                width={128}
                height={128}
                className="object-contain"
              />
            </div>
            <h3 className="text-white text-lg md:text-xl font-bold mb-4">Player</h3>
            <div className="bg-blue-600 px-6 py-3 rounded-xl min-w-[80px] flex justify-center">
              <span className="text-white text-2xl sm:text-3xl font-bold">{playerScore}</span>
            </div>
          </div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <h2 className="text-4xl md:text-6xl font-bold text-white transform -skew-x-12">VS</h2>
          </div>

          {/* Boss side */}
          <div className="flex flex-col items-center w-48">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 relative mb-4">
              {bossCharacterImage ? (
                <Image
                  src={bossCharacterImage}
                  alt={bossname || 'Boss'}
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
            <h3 className="text-white text-lg md:text-xl font-bold mb-4 uppercase text-center">{bossname || 'Boss'}</h3>
            <div className={`${isPhantomTax ? 'bg-red-600' : 'bg-purple-600'} px-6 py-3 rounded-xl min-w-[80px] flex justify-center`}>
              <span className="text-white text-2xl sm:text-3xl font-bold">{bossScore}</span>
            </div>
          </div>
        </div>

        {/* Result section */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">คุณได้รับชัยชนะ</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 px-4">
            ชัยชนะที่ได้รับสามารถต่อยอดไปในธุรกิจจริง<br />
            ปรึกษาเรา DEVSMITH ช่วยได้
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