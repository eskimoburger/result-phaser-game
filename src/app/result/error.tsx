'use client'

export default function Error({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Battle Error!</h2>
        <p className="text-gray-300 mb-6">
          Invalid battle parameters. Please check your scores and boss name.
        </p>
        <button
          onClick={() => reset()}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}