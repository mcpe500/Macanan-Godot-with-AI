import React from 'react'
import {Link} from 'react-router-dom';

function GameModeSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center bg-white p-12 rounded-lg shadow-xl ">
        <h1 className="text-4xl mb-4 text-blue-600 font-bold">Which type game Will You Play</h1>
        <p className="text-xl mb-4 text-gray-600">Get ready for an exciting adventure!</p>
        <Link
          to="/human-vs-human"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 mb-3 inline-block"
        >
          Human vs Human
        </Link><br/>
        <Link
          to="/human-vs-ai-macan"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 mb-3 inline-block"
        >
          Human vs AI (Macan)
        </Link><br/>
        <Link
          to="/human-vs-ai-uwong"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 mb-3 inline-block"
        >
          Human vs AI (Uwong)
        </Link><br/>
        <Link
          to="/ai-vs-ai"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition duration-200 inline-block"
        >
          AI vs AI
        </Link>
      </div>
    </div>
  )
}

export default GameModeSelection