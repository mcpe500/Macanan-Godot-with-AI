import { useMacananGame } from './MacananGameContext';

const AIvsAI = () => {
  const {
    board,
    message,
    uwongPawnsInHand,
    uwongTotal,
    boardRef,
    handleClick,
    renderConnections
  } = useMacananGame();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="relative w-full max-w-4xl mx-auto" ref={boardRef}>
        <svg className="absolute w-full h-full pointer-events-none">
          {renderConnections()}
        </svg>
        <div className="flex flex-col items-center gap-4">
          <div className="text-xl font-bold text-center">{message}</div>
          <div className="flex justify-center items-center gap-8">
            {/* Left Wing */}
            <div className="grid grid-cols-1 gap-20">
              {[25, 27, 29].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                    board[index] === 'macan' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
                  onClick={() => handleClick(index)}
                >{index}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[26, 28, 30].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                    board[index] === 'macan' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
                  onClick={() => handleClick(index)}
                >{index}</button>
              ))}
            </div>

            {/* Main 5x5 Grid */}
            <div className="grid grid-cols-5 gap-4">
              {Array(25).fill(null).map((_, index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                    board[index] === 'macan' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
                  onClick={() => handleClick(index)}
                >{index}</button>
              ))}
            </div>

            {/* Right Wing */}
            <div className="grid grid-cols-1 gap-4">
              {[31, 33, 35].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                    board[index] === 'macan' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
                  onClick={() => handleClick(index)}
                >{index}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-20">
              {[32, 34, 36].map((index) => (
                <button
                  key={index}
                  data-position={index}
                  className={`w-12 h-12 rounded-full bg-gray-200 relative z-10 ${
                    board[index] === 'uwong' ? 'bg-green-500' :
                    board[index] === 'macan' ? 'bg-red-500' :
                    'bg-gray-200'
                  }`}
                  onClick={() => handleClick(index)}
                >{index}</button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm">Remaining Unused Uwong pawns: {uwongPawnsInHand}</div>
          </div>
          <div className="mt-2">
            <div className="text-sm">Total Uwong pawns: {uwongTotal}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIvsAI;