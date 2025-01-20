import React from 'react'

function Option() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center bg-white p-12 rounded-lg shadow-xl ">
        <h1 className="text-4xl mb-4 text-blue-600 font-bold">Which type game Will You Play</h1>
        <p className="text-xl mb-4 text-gray-600">Get ready for an exciting adventure!</p>
        <a 
          href="/game"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 mb-3 inline-block"
        >
          2 Player
        </a><br />
        <a 
          href="/AIMacan"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 mb-3 inline-block"
        >
          Uwong Vs Macan Ai
        </a><br />
        <a 
          href="/AIUwong"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 mb-3 inline-block"
        >
          Uwong Ai Vs Macan
        </a><br />
        <a 
          href="/AIvsAI"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 inline-block"
        >
          AI vs AI
        </a>
      </div>
    </div>
  )
}

export default Option 