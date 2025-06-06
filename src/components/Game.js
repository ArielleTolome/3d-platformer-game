import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import './Game.css';
import Player from './Player';
import Path from './Path';
import Obstacle from './Obstacle';
import Coin from './Coin';
import Score from './Score';
import GameOver from './GameOver';

const Game = () => {
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0, z: 0 });
  const [playerLane, setPlayerLane] = useState(1);
  const [obstacles, setObstacles] = useState([]);
  const [collectibles, setCollectibles] = useState([]);
  const [pathSegments, setPathSegments] = useState([]);
  const [speed, setSpeed] = useState(5);
  const gameRef = useRef(null);
  const animationRef = useRef(null);
  const lastTimeRef = useRef(0);

  const LANES = useMemo(() => [-40, 0, 40], []);
  const SEGMENT_LENGTH = 200;
  const VISIBLE_SEGMENTS = 10;

  const generateSegment = useCallback((zPosition) => {
    const segment = {
      id: Math.random(),
      z: zPosition,
      type: 'straight'
    };

    if (Math.random() < 0.3 && zPosition < -400) {
      const obstacleType = Math.random() < 0.5 ? 'block' : 'slide';
      const lane = Math.floor(Math.random() * 3);
      setObstacles(prev => [...prev, {
        id: Math.random(),
        type: obstacleType,
        lane: lane,
        z: zPosition,
        x: LANES[lane]
      }]);
    }

    if (Math.random() < 0.4 && zPosition < -400) {
      const lane = Math.floor(Math.random() * 3);
      setCollectibles(prev => [...prev, {
        id: Math.random(),
        type: 'coin',
        lane: lane,
        z: zPosition,
        x: LANES[lane],
        collected: false
      }]);
    }

    return segment;
  }, [LANES]);

  useEffect(() => {
    const initialSegments = [];
    for (let i = 0; i < VISIBLE_SEGMENTS; i++) {
      initialSegments.push(generateSegment(-i * SEGMENT_LENGTH));
    }
    setPathSegments(initialSegments);
  }, [generateSegment]);

  const handleKeyPress = useCallback((e) => {
    if (gameState !== 'playing') return;

    switch(e.key) {
      case 'ArrowLeft':
        if (playerLane > 0) {
          setPlayerLane(prev => prev - 1);
          setPlayerPosition(prev => ({ ...prev, x: LANES[playerLane - 1] }));
        }
        break;
      case 'ArrowRight':
        if (playerLane < 2) {
          setPlayerLane(prev => prev + 1);
          setPlayerPosition(prev => ({ ...prev, x: LANES[playerLane + 1] }));
        }
        break;
      case 'ArrowUp':
      case ' ':
        setPlayerPosition(prev => ({ ...prev, y: 50 }));
        setTimeout(() => {
          setPlayerPosition(prev => ({ ...prev, y: 0 }));
        }, 500);
        break;
      case 'ArrowDown':
        break;
      default:
        break;
    }
  }, [gameState, playerLane, LANES]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const checkCollisions = useCallback(() => {
    const playerZ = 0;
    const collisionThreshold = 30;

    const activeObstacles = obstacles.filter(obs => 
      Math.abs(obs.z - playerZ) < collisionThreshold
    );

    for (const obstacle of activeObstacles) {
      if (obstacle.lane === playerLane) {
        if (obstacle.type === 'block' && playerPosition.y < 30) {
          setGameState('gameOver');
          return;
        }
        if (obstacle.type === 'slide' && playerPosition.y === 0) {
          setGameState('gameOver');
          return;
        }
      }
    }

    const activeCoins = collectibles.filter(coin => 
      !coin.collected && Math.abs(coin.z - playerZ) < collisionThreshold
    );

    for (const coin of activeCoins) {
      if (coin.lane === playerLane) {
        coin.collected = true;
        setCoins(prev => prev + 1);
        setScore(prev => prev + 10);
      }
    }
  }, [obstacles, collectibles, playerLane, playerPosition.y]);

  const gameLoop = useCallback((timestamp) => {
    if (gameState !== 'playing') return;

    lastTimeRef.current = timestamp;

    const currentSpeed = speed + Math.floor(score / 100) * 0.5;

    setPathSegments(prev => prev.map(segment => ({
      ...segment,
      z: segment.z + currentSpeed
    })));

    setObstacles(prev => prev.map(obstacle => ({
      ...obstacle,
      z: obstacle.z + currentSpeed
    })).filter(obstacle => obstacle.z < 200));

    setCollectibles(prev => prev.map(coin => ({
      ...coin,
      z: coin.z + currentSpeed
    })).filter(coin => coin.z < 200 && !coin.collected));

    setPathSegments(prev => {
      let updated = prev.filter(segment => segment.z < 200);
      
      while (updated.length < VISIBLE_SEGMENTS) {
        const lastZ = updated.length > 0 ? 
          Math.min(...updated.map(s => s.z)) : 0;
        updated.push(generateSegment(lastZ - SEGMENT_LENGTH));
      }
      
      return updated;
    });

    setScore(prev => prev + 1);

    checkCollisions();

    animationRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, speed, score, generateSegment, checkCollisions]);

  useEffect(() => {
    if (gameState === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop, gameState]);

  const handleRestart = () => {
    setGameState('playing');
    setScore(0);
    setCoins(0);
    setPlayerPosition({ x: 0, y: 0, z: 0 });
    setPlayerLane(1);
    setObstacles([]);
    setCollectibles([]);
    setSpeed(5);
    
    const initialSegments = [];
    for (let i = 0; i < VISIBLE_SEGMENTS; i++) {
      initialSegments.push(generateSegment(-i * SEGMENT_LENGTH));
    }
    setPathSegments(initialSegments);
  };

  return (
    <div className="game-container" ref={gameRef}>
      <div className="game-viewport">
        <div className="game-world">
          {pathSegments.map(segment => (
            <Path key={segment.id} segment={segment} />
          ))}
          
          {obstacles.map(obstacle => (
            <Obstacle key={obstacle.id} obstacle={obstacle} />
          ))}
          
          {collectibles.map(coin => (
            !coin.collected && <Coin key={coin.id} coin={coin} />
          ))}
          
          <Player position={playerPosition} lane={playerLane} />
        </div>
      </div>
      
      <Score score={score} coins={coins} />
      
      {gameState === 'gameOver' && (
        <GameOver score={score} coins={coins} onRestart={handleRestart} />
      )}
      
      <div className="controls-hint">
        Use Arrow Keys to move, Space to jump
      </div>
    </div>
  );
};

export default Game;
