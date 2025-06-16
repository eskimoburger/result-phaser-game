import Link from 'next/link'

export default function Home() {
  const exampleBattles = [
    {
      boss: 'Lady Delayna',
      playerScore: 150,
      bossScore: 120,
      result: 'Victory'
    },
    {
      boss: 'Phantom Tax',
      playerScore: 80,
      bossScore: 100,
      result: 'Defeat'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-4">
      <div className="text-center w-full">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">Battle Results Demo</h1>
        
        <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 px-2">
            Click on any battle result below to view the result page
          </p>
          
          {exampleBattles.map((battle, index) => (
            <Link
              key={index}
              href={`/result?bossname=${encodeURIComponent(battle.boss)}&scoreplayer=${battle.playerScore}&scoreboss=${battle.bossScore}`}
              className="block bg-gray-800 hover:bg-gray-700 transition-colors rounded-lg p-4 sm:p-6 text-left mx-2 sm:mx-0"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-1 sm:mb-2">
                    vs {battle.boss}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-400">
                    Player: {battle.playerScore} | Boss: {battle.bossScore}
                  </p>
                </div>
                <div className={`text-xl sm:text-2xl font-bold ${
                  battle.result === 'Victory' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {battle.result}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="mt-8 sm:mt-12 text-gray-400 px-4">
          <p className="text-sm sm:text-base">Example URLs:</p>
          <code className="block mt-2 text-xs sm:text-sm bg-gray-800 p-3 sm:p-4 rounded break-all">
            /result?bossname=Lady%20Delayna&scoreplayer=150&scoreboss=120
          </code>
        </div>
      </div>
    </div>
  )
}