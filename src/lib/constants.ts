// URL Query Parameters
export const QUERY_PARAMS = {
  BOSS_NAME: 'bossname',
  PLAYER_SCORE: 'scoreplayer',
  BOSS_SCORE: 'scoreboss',
} as const

// Boss Configuration
export const BOSS_CONFIG = {
  'lady delayna': {
    name: 'Lady Delayna',
    ogImage: process.env.NEXT_PUBLIC_LADY_DELAYNA_OG_IMAGE || '/images/lady-delayna-og.svg',
    characterImage: '/ladydelayna.png',
    gradient: 'bg-gradient-to-r from-blue-900 via-purple-900 to-purple-900',
    scoreColor: 'bg-purple-600',
  },
  'phantom tax': {
    name: 'Phantom Tax',
    ogImage: process.env.NEXT_PUBLIC_PHANTOM_TAX_OG_IMAGE || '/images/phantom-tax-og.svg',
    characterImage: '/phantomtax.png',
    gradient: 'bg-gradient-to-r from-blue-900 via-purple-900 to-red-900',
    scoreColor: 'bg-red-600',
  },
} as const

export type BossKey = keyof typeof BOSS_CONFIG

// Validation
export const isValidScore = (score: string | undefined): boolean => {
  if (!score) return false
  const num = parseInt(score, 10)
  return !isNaN(num) && num >= 0 && num <= 999999
}

export const sanitizeBossName = (name: string | undefined): string => {
  if (!name) return ''
  // Remove any HTML tags and limit length
  return name.replace(/<[^>]*>/g, '').slice(0, 50)
}