// Game.js
import React, { useState, useEffect } from 'react';
import './Game.css';

// Komponen Node 
const Node = ({ id, left, top, onClick, piece, isValidMove, isSelected }) => {
  return (
    <div
      className={`node ${piece ? `node-${piece}` : ''} 
        ${isValidMove ? 'valid-move' : ''}
        ${isSelected ? 'selected' : ''}`}
      style={{ left: `${left}px`, top: `${top}px` }}
      onClick={() => onClick(id, { left, top })}
    />
  );
};

// Komponen Line sama seperti sebelumnya
const Line = ({ left, top, width, height, rotate }) => {
  return (
    <div
      className="line"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: width ? `${width}px` : "2px",
        height: height ? `${height}px` : "2px",
        transform: rotate ? `rotate(${rotate}deg)` : "none",
      }}
    />
  );
};

const Game = () => {
  // State game
  const [gamePhase, setGamePhase] = useState('SETUP'); // SETUP, UWONG_INIT, MACAN_INIT, PLAYING
  const [currentPlayer, setCurrentPlayer] = useState(null); // 'uwong' atau 'macan'
  const [selectedNode, setSelectedNode] = useState(null);
  const [boardState, setBoardState] = useState({});
  const [uwongPieces, setUwongPieces] = useState(21);
  const [uwongPlaced, setUwongPlaced] = useState(0);
  const [macanPlaced, setMacanPlaced] = useState(0);
  const [capturedPieces, setCapturedPieces] = useState(0);
  const [validMoves, setValidMoves] = useState([]);
  const [squareFormation, setSquareFormation] = useState([]);
  const [gameMessage, setGameMessage] = useState('Klik "Mulai Suit" untuk memulai permainan!');

  // Nodes configuration - Tambahkan array nodes Anda di sini
  const nodes = [
    { id: 1, left: 0, top: 0 },
    { id: 2, left: 160, top: 0 },
    { id: 3, left: 240, top: 0 },
    { id: 4, left: 320, top: 0 },
    { id: 5, left: 400, top: 0 },
    { id: 6, left: 480, top: 0 },
    { id: 7, left: 640, top: 0 },
    { id: 8, left: 80, top: 80 },
    { id: 9, left: 160, top: 80 },
    { id: 10, left: 240, top: 80 },
    { id: 11, left: 320, top: 80 },
    { id: 12, left: 400, top: 80 },
    { id: 13, left: 480, top: 80 },
    { id: 14, left: 560, top: 80 },
    { id: 15, left: 0, top: 160 },
    { id: 16, left: 80, top: 160 },
    { id: 17, left: 160, top: 160 },
    { id: 18, left: 240, top: 160 },
    { id: 19, left: 320, top: 160 },
    { id: 20, left: 400, top: 160 },
    { id: 21, left: 480, top: 160 },
    { id: 22, left: 560, top: 160 },
    { id: 23, left: 640, top: 160 },
    { id: 24, left: 80, top: 240 },
    { id: 25, left: 160, top: 240 },
    { id: 26, left: 240, top: 240 },
    { id: 27, left: 320, top: 240 },
    { id: 28, left: 400, top: 240 },
    { id: 29, left: 480, top: 240 },
    { id: 30, left: 560, top: 240 },
    { id: 31, left: 0, top: 320 },
    { id: 32, left: 160, top: 320 },
    { id: 33, left: 240, top: 320 },
    { id: 34, left: 320, top: 320 },
    { id: 35, left: 400, top: 320 },
    { id: 36, left: 480, top: 320 },
    { id: 37, left: 640, top: 320 }
  ];

  // Helper Functions
  const isAdjacent = (node1, node2) => {
    const n1 = nodes.find(n => n.id === node1);
    const n2 = nodes.find(n => n.id === node2);
    if (!n1 || !n2) return false;

    const dx = Math.abs(n1.left - n2.left);
    const dy = Math.abs(n1.top - n2.top);
    
    // Mengecek apakah node bersebelahan (termasuk diagonal)
    return (dx <= 80 && dy <= 80) && (dx === 0 || dy === 0 || dx === dy);
  };

  const getValidMoves = (nodeId) => {
    if (!nodeId) return [];
    
    return nodes
      .filter(node => {
        // Jika ada piece di node tujuan, bukan valid move
        if (boardState[node.id]) return false;
        
        // Cek apakah bersebelahan
        return isAdjacent(nodeId, node.id);
      })
      .map(node => node.id);
  };

  const isValidSquareFormation = (newNodeId) => {
    if (uwongPlaced < 8) return true;
    
    const currentFormation = [...squareFormation, newNodeId];
    // Implementasi pengecekan formasi persegi
    // Ini adalah versi sederhana, Anda mungkin perlu mengimplementasi
    // logika yang lebih kompleks sesuai aturan game
    return true;
  };

  const canCapture = (fromId, toId) => {
    if (currentPlayer !== 'macan') return false;
    
    const from = nodes.find(n => n.id === fromId);
    const to = nodes.find(n => n.id === toId);
    if (!from || !to) return false;

    // Implementasi logika penangkapan
    // Perlu mengecek apakah ada pion uwong dalam jumlah ganjil
    // dalam satu garis lurus antara from dan to
    return false;
  };

  const handleNodeClick = (id, position) => {
    switch (gamePhase) {
      case 'SETUP':
        return handleSetupPhase();
      case 'UWONG_INIT':
        return handleUwongInitPhase(id);
      case 'MACAN_INIT':
        return handleMacanInitPhase(id);
      case 'PLAYING':
        return handlePlayingPhase(id);
      default:
        return;
    }
  };

  const handleSetupPhase = () => {
    const winner = Math.random() < 0.5 ? 'uwong' : 'macan';
    setCurrentPlayer(winner);
    setGamePhase('UWONG_INIT');
    setGameMessage(`${winner === 'uwong' ? 'Uwong' : 'Macan'} menang suit! Silakan letakkan 9 pion pertama.`);
  };

  const handleUwongInitPhase = (id) => {
    if (currentPlayer !== 'uwong' || boardState[id] || !isValidSquareFormation(id)) return;

    setBoardState(prev => ({ ...prev, [id]: 'uwong' }));
    setUwongPlaced(prev => prev + 1);
    setUwongPieces(prev => prev - 1);
    setSquareFormation(prev => [...prev, id]);

    if (uwongPlaced === 8) {
      setGamePhase('MACAN_INIT');
      setCurrentPlayer('macan');
      setGameMessage('Giliran Macan meletakkan pionnya');
    }
  };

  const handleMacanInitPhase = (id) => {
    if (currentPlayer !== 'macan' || boardState[id]) return;

    setBoardState(prev => ({ ...prev, [id]: 'macan' }));
    setMacanPlaced(prev => prev + 1);

    if (macanPlaced === 0) {
      setGamePhase('PLAYING');
      setCurrentPlayer('uwong');
      setGameMessage('Permainan dimulai! Giliran Uwong');
    }
  };

  const handlePlayingPhase = (id) => {
    if (!selectedNode) {
      // Memilih pion untuk digerakkan
      if (boardState[id] === currentPlayer) {
        setSelectedNode(id);
        setValidMoves(getValidMoves(id));
      }
    } else {
      // Memindahkan pion yang dipilih
      if (validMoves.includes(id)) {
        const canCaptureMove = canCapture(selectedNode, id);
        
        // Eksekusi perpindahan
        setBoardState(prev => {
          const newState = { ...prev };
          delete newState[selectedNode];
          newState[id] = currentPlayer;
          return newState;
        });

        if (canCaptureMove) {
          // Handle penangkapan pion
          setCapturedPieces(prev => prev + 1);
        }

        // Ganti giliran
        setCurrentPlayer(prev => prev === 'uwong' ? 'macan' : 'uwong');
        setGameMessage(`Giliran ${currentPlayer === 'uwong' ? 'Macan' : 'Uwong'}`);
      }
      
      setSelectedNode(null);
      setValidMoves([]);
    }
  };

  const checkWinCondition = () => {
    if (capturedPieces >= 7) {
      return 'MACAN_WINS';
    }
    // Tambahkan kondisi menang lainnya
    return null;
  };

  useEffect(() => {
    const winner = checkWinCondition();
    if (winner) {
      setGameMessage(`Game Over! ${winner === 'MACAN_WINS' ? 'Macan' : 'Uwong'} Menang!`);
      setGamePhase('GAME_OVER');
    }
  }, [boardState, capturedPieces]);

  return (
    <div className="game-container">
      <h1 className="game-title">Macan-Uwongan</h1>
      
      <div className="game-info">
        <p>{gameMessage}</p>
        <p>Pion Uwong tersisa: {uwongPieces}</p>
        <p>Pion tertangkap: {capturedPieces}</p>
        
        {gamePhase === 'SETUP' && (
          <button className="start-button" onClick={() => handleNodeClick(null)}>
            Mulai Suit
          </button>
        )}
      </div>

      <div className="grid-container">
        {/* Render Nodes */}
        {nodes.map(({ id, left, top }) => (
          <Node
            key={id}
            id={id}
            left={left}
            top={top}
            piece={boardState[id]}
            isSelected={selectedNode === id}
            isValidMove={validMoves.includes(id)}
            onClick={handleNodeClick}
          />
        ))}

        {/* Tambahkan komponen Line Anda di sini */}
        {/* ... Lines dari kode asli Anda ... */}
<Line left={165} top={5} width={80} />
        <Line left={245} top={5} width={80} />
        <Line left={325} top={5} width={80} />
        <Line left={405} top={5} width={80} />
        <Line left={165} top={85} width={80} />
        <Line left={245} top={85} width={80} />
        <Line left={325} top={85} width={80} />
        <Line left={405} top={85} width={80} />
        <Line left={5} top={165} width={80} />
        <Line left={85} top={165} width={80} />
        <Line left={165} top={165} width={80} />
        <Line left={245} top={165} width={80} />
        <Line left={325} top={165} width={80} />
        <Line left={405} top={165} width={80} />
        <Line left={485} top={165} width={80} />
        <Line left={565} top={165} width={80} />
        <Line left={165} top={245} width={80} />
        <Line left={245} top={245} width={80} />
        <Line left={325} top={245} width={80} />
        <Line left={405} top={245} width={80} />
        <Line left={165} top={325} width={80} />
        <Line left={245} top={325} width={80} />
        <Line left={325} top={325} width={80} />
        <Line left={405} top={325} width={80} />
        <Line left={5} top={5} height={80} />
        <Line left={5} top={85} height={80} />
        <Line left={5} top={165} height={80} />
        <Line left={5} top={245} height={80} />
        <Line left={85} top={85} height={80} />
        <Line left={85} top={165} height={80} />
        <Line left={165} top={5} height={80} />
        <Line left={165} top={85} height={80} />
        <Line left={165} top={165} height={80} />
        <Line left={165} top={245} height={80} />
        <Line left={245} top={5} height={80} />
        <Line left={245} top={85} height={80} />
        <Line left={245} top={165} height={80} />
        <Line left={245} top={245} height={80} />
        <Line left={325} top={5} height={80} />
        <Line left={325} top={85} height={80} />
        <Line left={325} top={165} height={80} />
        <Line left={325} top={245} height={80} />
        <Line left={405} top={5} height={80} />
        <Line left={405} top={85} height={80} />
        <Line left={405} top={165} height={80} />
        <Line left={405} top={245} height={80} />
        <Line left={485} top={5} height={80} />
        <Line left={485} top={85} height={80} />
        <Line left={485} top={165} height={80} />
        <Line left={485} top={245} height={80} />
        <Line left={565} top={85} height={80} />
        <Line left={565} top={165} height={80} />
        <Line left={645} top={5} height={80} />
        <Line left={645} top={85} height={80} />
        <Line left={645} top={165} height={80} />
        <Line left={645} top={245} height={80} />
        <Line left={45} top={-12} height={115} rotate={-45} />
        <Line left={205} top={-12} height={115} rotate={-45} />
        <Line left={365} top={-12} height={115} rotate={-45} />
        <Line left={125} top={68} height={115} rotate={-45} />
        <Line left={285} top={68} height={115} rotate={-45} />
        <Line left={445} top={68} height={115} rotate={-45} />
        <Line left={205} top={148} height={115} rotate={-45} />
        <Line left={365} top={148} height={115} rotate={-45} />
        <Line left={525} top={148} height={115} rotate={-45} />
        <Line left={285} top={228} height={115} rotate={-45} />
        <Line left={445} top={228} height={115} rotate={-45} />
        <Line left={605} top={228} height={115} rotate={-45} />
        <Line left={285} top={-12} height={115} rotate={45} />
        <Line left={445} top={-12} height={115} rotate={45} />
        <Line left={605} top={-12} height={115} rotate={45} />
        <Line left={205} top={68} height={115} rotate={45} />
        <Line left={365} top={68} height={115} rotate={45} />
        <Line left={525} top={68} height={115} rotate={45} />
        <Line left={125} top={148} height={115} rotate={45} />
        <Line left={285} top={148} height={115} rotate={45} />
        <Line left={445} top={148} height={115} rotate={45} />
        <Line left={45} top={228} height={115} rotate={45} />
        <Line left={205} top={228} height={115} rotate={45} />
        <Line left={365} top={228} height={115} rotate={45} />
      </div>
    </div>
  );
};

export default Game;