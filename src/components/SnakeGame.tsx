import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Direction, GameStatus, Point } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = Direction.UP;
const GAME_SPEED = 80;

export const SnakeGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  
  const moveSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case Direction.UP: newHead.y -= 1; break;
        case Direction.DOWN: newHead.y += 1; break;
        case Direction.LEFT: newHead.x -= 1; break;
        case Direction.RIGHT: newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || 
        newHead.x >= GRID_SIZE || 
        newHead.y < 0 || 
        newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 1);
        generateFood(newSnake);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food]);

  const generateFood = (currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== Direction.DOWN) setDirection(Direction.UP); break;
        case 'ArrowDown': if (direction !== Direction.UP) setDirection(Direction.DOWN); break;
        case 'ArrowLeft': if (direction !== Direction.RIGHT) setDirection(Direction.LEFT); break;
        case 'ArrowRight': if (direction !== Direction.LEFT) setDirection(Direction.RIGHT); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (status === GameStatus.PLAYING) {
      const interval = setInterval(moveSnake, GAME_SPEED);
      return () => clearInterval(interval);
    }
  }, [status, moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#ff00ff22';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#00ffff' : '#ff00ff';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
      
      // Glitch effect on head
      if (index === 0 && Math.random() > 0.9) {
        ctx.fillStyle = '#fff';
        ctx.fillRect(segment.x * cellSize - 2, segment.y * cellSize - 2, cellSize + 4, cellSize + 4);
      }
    });

    // Draw food
    ctx.fillStyle = '#fff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    ctx.fillRect(food.x * cellSize + 4, food.y * cellSize + 4, cellSize - 8, cellSize - 8);
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setStatus(GameStatus.PLAYING);
    generateFood(INITIAL_SNAKE);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border-4 border-[#00ffff] bg-black relative overflow-hidden screen-tear">
      <div className="flex justify-between w-full font-mono text-xs mb-2">
        <span className="text-[#ff00ff]">DATA_POINTS: {score.toString().padStart(4, '0')}</span>
        <span className="text-[#00ffff]">SECTOR: 0x7F</span>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-[#ff00ff] bg-black"
        />

        <AnimatePresence>
          {status !== GameStatus.PLAYING && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 font-mono"
            >
              {status === GameStatus.GAME_OVER && (
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-[#ff00ff] glitch-text mb-2" data-text="CRITICAL_FAILURE">
                    CRITICAL_FAILURE
                  </h2>
                  <p className="text-[#00ffff] text-[10px]">RECOVERY_FAILED // SCORE: {score}</p>
                </div>
              )}

              <Button
                onClick={startGame}
                className="bg-transparent border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black font-mono px-8 py-4 rounded-none transition-all uppercase tracking-widest"
              >
                {status === GameStatus.IDLE ? '[ INITIALIZE_LINK ]' : '[ REBOOT_SYSTEM ]'}
              </Button>
              
              <p className="mt-6 text-[8px] text-[#ff00ff] uppercase tracking-[0.2em]">
                INPUT_REQUIRED: ARROW_KEYS
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
