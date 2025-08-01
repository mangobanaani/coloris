"use client";

import React, { useState, useEffect, useCallback } from 'react';

// --- Helper Functions & Constants ---

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const BLOCK_COLORS = ['#f87171', '#60a5fa', '#4ade80', '#facc15', '#a78bfa']; // Red, Blue, Green, Yellow, Purple
const BASE_GAME_SPEED = 800;
const FAST_DROP_SPEED = 50;
const SPEED_INCREASE_INTERVAL = 60000; // 60 seconds
const SPEED_INCREMENT = 75; // ms to reduce speed by
const MIN_SPEED = 150; // Fastest possible speed

const createEmptyGrid = () => Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(null));

const getRandomColor = () => BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];

const generateNewBlock = () => ({
  x: Math.floor(GRID_WIDTH / 2),
  y: 0,
  colors: [getRandomColor(), getRandomColor(), getRandomColor()],
});

// --- Game Components ---

const WavyTitle = ({ text, ...props }: { text: string, className?: string, style?: React.CSSProperties }) => {
    const [time, setTime] = useState(0);
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    useEffect(() => {
        if (!mounted) return;
        
        const interval = setInterval(() => {
            setTime(prev => prev + 0.1);
        }, 50); // Update every 50ms for smooth animation
        
        return () => {
            clearInterval(interval);
        };
    }, [mounted]);
    
    // Don't render animation until mounted (avoid hydration mismatch)
    if (!mounted) {
        return <h1 {...props}>{text}</h1>;
    }

    return (
        <h1 {...props}>
            {text.split('').map((char, index) => {
                const yOffset = Math.sin(time + index * 0.7) * 10;
                const displayChar = char === ' ' ? '\u00A0' : char;
                return (
                    <span key={index} style={{ display: 'inline-block', transform: `translateY(${yOffset}px)` }}>
                        {displayChar}
                    </span>
                );
            })}
        </h1>
    );
};

const Block = React.memo(({ color }: { color: string | null }) => {
  if (color === 'clearing') {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-1/2 h-1/2 bg-white/80 rounded-full animate-ping" />
      </div>
    );
  }
  return (
    <div className="w-full h-full transition-colors duration-300 p-0.5">
      {color && (
          <div 
              className="w-full h-full rounded-sm shadow-inner"
              style={{ 
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}, inset 0 0 5px rgba(255,255,255,0.5)`,
                  filter: 'brightness(1.1)'
              }} 
          />
      )}
    </div>
  );
});

const GameGrid = React.memo(({ grid }: { grid: (string | null)[][] }) => (
  <div
    className="grid grid-cols-10 grid-rows-20 bg-black/20 backdrop-blur-md border border-white/10 rounded-lg shadow-2xl"
    style={{
      width: 'min(80vw, 320px)',
      height: 'min(160vw, 640px)',
      gridTemplateRows: `repeat(${GRID_HEIGHT}, 1fr)`,
    }}
  >
    {grid.map((row, y) =>
      row.map((color, x) => <Block key={`${y}-${x}`} color={color} />)
    )}
  </div>
));

type BlockType = {
    x: number;
    y: number;
    colors: string[];
} | null;

const NextBlockPreview = React.memo(({ block }: { block: BlockType }) => (
    <div className="p-4 bg-glass rounded-lg shadow-lg w-full text-center" 
         style={{ 
             padding: '1rem', 
             backgroundColor: 'rgba(255, 255, 255, 0.1)',
             backdropFilter: 'blur(12px)',
             borderRadius: '0.5rem',
             boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
             width: '100%',
             textAlign: 'center',
             border: '1px solid rgba(255, 255, 255, 0.2)'
         }}>
        <span className="block text-sm text-gray-300 uppercase tracking-widest mb-2" 
              style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  color: 'rgb(209, 213, 219)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.1em', 
                  marginBottom: '0.5rem' 
              }}>
            Next
        </span>
        <div className="flex flex-col items-center mx-auto w-8 h-24" 
             style={{ 
                 display: 'flex', 
                 flexDirection: 'column', 
                 alignItems: 'center', 
                 margin: '0 auto', 
                 width: '2rem', 
                 height: '6rem' 
             }}>
            {block?.colors.map((color, i) => (
                <div key={i} className="w-8 h-8 p-1" style={{ width: '2rem', height: '2rem', padding: '0.25rem' }}>
                    <div className="w-full h-full rounded-sm" 
                         style={{ 
                             width: '100%', 
                             height: '100%', 
                             borderRadius: '2px', 
                             backgroundColor: color, 
                             filter: 'brightness(1.1)' 
                         }} />
                </div>
            ))}
        </div>
    </div>
));


const ColorisGame = () => {
  // --- State Management ---
  const [grid, setGrid] = useState<(string | null)[][]>(createEmptyGrid());
  const [currentBlock, setCurrentBlock] = useState<BlockType>(null);
  const [nextBlock, setNextBlock] = useState<BlockType>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [baseGameSpeed, setBaseGameSpeed] = useState(BASE_GAME_SPEED);
  const [isDropping, setIsDropping] = useState(false);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Touch gesture state
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);
  const [showTouchFeedback, setShowTouchFeedback] = useState(false);

  // --- Core Game Logic ---

  const checkForMatches = useCallback((gridToCheck: (string | null)[][]) => {
    let newGrid = gridToCheck.map(row => [...row]);
    const toClear = new Set<string>();

    // Vertical check
    for (let x = 0; x < GRID_WIDTH; x++) {
        for (let y = 0; y < GRID_HEIGHT - 2; y++) {
            const color = newGrid[y][x];
            if (color && newGrid[y+1][x] === color && newGrid[y+2][x] === color) {
                let i = y;
                while(i < GRID_HEIGHT && newGrid[i][x] === color) { toClear.add(`${i},${x}`); i++; }
            }
        }
    }
    
    // Horizontal check
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH - 2; x++) {
            const color = newGrid[y][x];
            if (color && newGrid[y][x+1] === color && newGrid[y][x+2] === color) {
                let i = x;
                while(i < GRID_WIDTH && newGrid[y][i] === color) { toClear.add(`${y},${i}`); i++; }
            }
        }
    }

    if (toClear.size > 0) {
        const blastZone = new Set(toClear);
        toClear.forEach(coord => {
            const [y, x] = coord.split(',').map(Number);
            [[y-1,x],[y+1,x],[y,x-1],[y,x+1]].forEach(([r,c]) => {
                if (r >= 0 && r < GRID_HEIGHT && c >= 0 && c < GRID_WIDTH && newGrid[r][c]) {
                    blastZone.add(`${r},${c}`);
                }
            });
        });

        let gridWithClearing = newGrid.map(row => [...row]);
        blastZone.forEach(coord => {
            const [y, x] = coord.split(',').map(Number);
            gridWithClearing[y][x] = 'clearing';
        });
        setGrid(gridWithClearing);
        setScore(prev => prev + blastZone.size * 10);

        setTimeout(() => {
            let gridAfterClear = newGrid.map(row => [...row]);
            blastZone.forEach(coord => {
                const [y, x] = coord.split(',').map(Number);
                gridAfterClear[y][x] = null;
            });

            for (let x = 0; x < GRID_WIDTH; x++) {
                let emptySpaces = 0;
                for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
                    if (gridAfterClear[y][x] === null) { emptySpaces++; } 
                    else if (emptySpaces > 0) {
                        gridAfterClear[y + emptySpaces][x] = gridAfterClear[y][x];
                        gridAfterClear[y][x] = null;
                    }
                }
            }
            setGrid(gridAfterClear);
            setTimeout(() => checkForMatches(gridAfterClear), 200);
        }, 200);
        return true;
    }
    return false;
  }, []);

  const spawnBlock = useCallback(() => {
    const newNextBlock = generateNewBlock();
    setCurrentBlock(nextBlock);
    setNextBlock(newNextBlock);

    if (nextBlock) {
       if (grid[nextBlock.y]?.[nextBlock.x] || grid[nextBlock.y + 1]?.[nextBlock.x] || grid[nextBlock.y + 2]?.[nextBlock.x]) {
         setGameOver(true);
       }
    }
  }, [grid, nextBlock]);

  const isValidMove = (block: BlockType, checkGrid: (string | null)[][]) => {
    if (!block) return false;
    for (let i = 0; i < block.colors.length; i++) {
        const newY = block.y + i;
        const newX = block.x;
        if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) return false;
        if (checkGrid[newY] && checkGrid[newY][newX]) return false;
    }
    return true;
  };

  const placeBlockOnGrid = useCallback(() => {
    if (!currentBlock) return;
    const newGrid = grid.map(row => [...row]);
    for (let i = 0; i < currentBlock.colors.length; i++) {
      if (currentBlock.y + i < GRID_HEIGHT) {
        newGrid[currentBlock.y + i][currentBlock.x] = currentBlock.colors[i];
      }
    }
    setCurrentBlock(null);
    if(!checkForMatches(newGrid)) {
        setGrid(newGrid);
    }
  }, [currentBlock, grid, checkForMatches]);

  // --- Game Loop ---
  useEffect(() => {
    // Don't start the game loop if game is not started or is over
    if (!gameStarted || gameOver) return;
    
    // Spawn first block if needed
    if (!currentBlock) {
      spawnBlock();
      return; // Return early - another effect will run once currentBlock is set
    }

    // Set up game interval with proper speed
    const currentSpeed = isDropping ? FAST_DROP_SPEED : baseGameSpeed;
    const gameInterval = setInterval(() => {
        if (currentBlock) {
            const nextPos = { ...currentBlock, y: currentBlock.y + 1 };
            if (isValidMove(nextPos, grid)) {
                setCurrentBlock(nextPos);
            } else {
                placeBlockOnGrid();
            }
        }
    }, currentSpeed);

    // Clean up interval on unmount or when dependencies change
    return () => {
      clearInterval(gameInterval);
    };
  }, [gameStarted, gameOver, currentBlock, grid, spawnBlock, placeBlockOnGrid, baseGameSpeed, isDropping]);
  
  // --- Speed Increase Timer ---
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    // Create speed increase timer
    const speedTimer = setInterval(() => {
        setBaseGameSpeed(prev => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
    }, SPEED_INCREASE_INTERVAL);
    
    // Proper cleanup to prevent memory leaks and freezes after game over
    return () => {
      clearInterval(speedTimer);
    };
  }, [gameStarted, gameOver]);

  // --- Player Controls ---
  const moveBlock = (dx: number) => {
    if (!currentBlock || gameOver) return;
    const newBlock = { ...currentBlock, x: currentBlock.x + dx };
    if (isValidMove(newBlock, grid)) setCurrentBlock(newBlock);
  };

  const rotateBlock = () => {
    if (!currentBlock || gameOver) return;
    const newBlock = { ...currentBlock, colors: [currentBlock.colors[2], currentBlock.colors[0], currentBlock.colors[1]] };
    if (isValidMove(newBlock, grid)) setCurrentBlock(newBlock);
  };
  
  const hardDrop = () => {
      if (!currentBlock || gameOver) return;
      let finalY = currentBlock.y;
      while(isValidMove({ ...currentBlock, y: finalY + 1 }, grid)) {
          finalY++;
      }
      const finalBlock = {...currentBlock, y: finalY};
      
      const newGrid = grid.map(row => [...row]);
      for (let i = 0; i < finalBlock.colors.length; i++) {
        if (finalBlock.y + i < GRID_HEIGHT) {
            newGrid[finalBlock.y + i][finalBlock.x] = finalBlock.colors[i];
        }
      }
      setCurrentBlock(null);
      if(!checkForMatches(newGrid)) {
        setGrid(newGrid);
      }
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver || !gameStarted) return;
    e.preventDefault();
    switch (e.key) {
      case 'ArrowLeft': moveBlock(-1); break;
      case 'ArrowRight': moveBlock(1); break;
      case 'ArrowUp': rotateBlock(); break;
      case 'ArrowDown': setIsDropping(true); break;
      case ' ': hardDrop(); break;
    }
  }, [currentBlock, gameOver, gameStarted, hardDrop]); // Back to original dependencies

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (gameOver || !gameStarted) return;
    if (e.key === 'ArrowDown') {
      setIsDropping(false);
    }
  }, [gameOver, gameStarted]);

  // Touch gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!gameStarted || gameOver) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setTouchEnd(null);
    setShowTouchFeedback(true);
  }, [gameStarted, gameOver]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart) return;
    const touch = e.touches[0];
    setTouchEnd({ x: touch.clientX, y: touch.clientY });
  }, [touchStart]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd || !gameStarted || gameOver) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }

    const deltaX = touchEnd.x - touchStart.x;
    const deltaY = touchEnd.y - touchStart.y;
    
    // More sensitive swipe detection for better mobile experience
    const minSwipeDistance = 30; // Reduced from 50 for more responsive controls
    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine swipe direction with improved logic
    if (absDeltaX > absDeltaY && absDeltaX > minSwipeDistance) {
      // Horizontal swipe - move left/right
      if (deltaX > 0) {
        moveBlock(1); // Swipe right
      } else {
        moveBlock(-1); // Swipe left
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > minSwipeDistance) {
      // Vertical swipe
      if (deltaY > 0) {
        // Swipe down - check distance for soft vs hard drop
        if (absDeltaY > 80) {
          hardDrop(); // Long swipe down - hard drop
        } else {
          // Short swipe down - soft drop (single step)
          const nextPos = { ...currentBlock!, y: currentBlock!.y + 1 };
          if (currentBlock && isValidMove(nextPos, grid)) {
            setCurrentBlock(nextPos);
          }
        }
      } else {
        rotateBlock(); // Swipe up - rotate
      }
    } else if (absDeltaX < 20 && absDeltaY < 20) {
      // Tap (very small movement) - rotate
      rotateBlock();
    }

    setTouchStart(null);
    setTouchEnd(null);
    
    // Hide touch feedback after a short delay
    setTimeout(() => setShowTouchFeedback(false), 200);
  }, [touchStart, touchEnd, gameStarted, gameOver, moveBlock, rotateBlock, hardDrop, currentBlock, grid, isValidMove]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 768);
    };
    
    const detectTouchDevice = () => {
      setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    
    // Set initial values
    handleResize();
    detectTouchDevice();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleKeyDown, handleKeyUp]);
  
  // --- Game State Management ---
  const startGame = useCallback(() => {
    setGrid(createEmptyGrid());
    setScore(0);
    setGameOver(false);
    setCurrentBlock(null);  // Clear current block first
    setIsDropping(false);
    setBaseGameSpeed(BASE_GAME_SPEED);
    
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      setGameStarted(true);
    }, 10);
    
    // Initialize blocks after a small delay
    setTimeout(() => {
      const firstBlock = generateNewBlock();
      const secondBlock = generateNewBlock();
      setCurrentBlock(firstBlock);
      setNextBlock(secondBlock);
    }, 20);
  }, []);

  // --- Rendering ---
  const displayGrid = grid.map(row => [...row]);
  if (currentBlock) {
    currentBlock.colors.forEach((color, i) => {
      const y = currentBlock.y + i;
      const x = currentBlock.x;
      if (y >= 0 && y < GRID_HEIGHT && x >= 0 && x < GRID_WIDTH) {
        displayGrid[y][x] = color;
      }
    });
  }

  return (
    <div 
      className="bg-gradient-to-br from-indigo-900 via-gray-900 to-purple-900 text-white min-h-screen flex flex-col items-center justify-center p-4 font-sans"
    >
        <WavyTitle 
            text="Coloris" 
            className="text-5xl font-bold mb-6 tracking-wider uppercase" 
            style={{textShadow: '0 0 15px rgba(255,255,255,0.5)'}}
        />
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div 
              className="relative"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{ 
                touchAction: 'none', // Prevent default touch behaviors
                position: 'relative'
              }}
            >
                <GameGrid grid={displayGrid} />
                
                {/* Touch feedback indicator */}
                {isTouchDevice && showTouchFeedback && touchStart && (
                  <div
                    style={{
                      position: 'absolute',
                      left: touchStart.x - 20,
                      top: touchStart.y - 20,
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      border: '2px solid rgba(255, 255, 255, 0.6)',
                      pointerEvents: 'none',
                      animation: 'touchPulse 0.2s ease-out',
                      zIndex: 10
                    }}
                  />
                )}
                {(!gameStarted || gameOver) && (
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.5rem'
                    }}>
                        {gameOver && <h2 style={{
                            fontSize: '2.25rem',
                            fontWeight: 'bold',
                            color: '#f87171',
                            textShadow: '0 0 10px #ef4444'
                        }}>Game Over</h2>}
                        {gameOver && <p style={{
                            fontSize: '1.25rem',
                            marginTop: '0.5rem'
                        }}>Final Score: {score}</p>}
                        <button 
                            onClick={startGame}
                            style={{
                                marginTop: '1.5rem',
                                paddingLeft: '2rem',
                                paddingRight: '2rem',
                                paddingTop: '0.75rem',
                                paddingBottom: '0.75rem',
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                borderWidth: '1px',
                                borderRadius: '0.5rem',
                                fontSize: '1.25rem',
                                fontWeight: 'bold',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                transition: 'all 300ms',
                                transform: 'scale(1)',
                                cursor: 'pointer'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                                e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.transform = 'scale(1)';
                            }}
                        >
                            {gameOver ? 'Play Again' : 'Start Game'}
                        </button>
                    </div>
                )}
            </div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isWideScreen ? 'flex-start' : 'center',
                gap: '1rem',
                width: '14rem'
            }}>
                <div style={{
                    fontSize: '1.5rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    textAlign: 'center',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <span style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        color: 'rgb(209, 213, 219)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>Score</span>
                    <span style={{
                        fontSize: '2.25rem',
                        fontWeight: '300'
                    }}>{score}</span>
                </div>
                
                <NextBlockPreview block={nextBlock} />
                
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '0.5rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    textAlign: 'left',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        textAlign: 'center',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em'
                    }}>Controls</h3>
                    {isTouchDevice ? (
                        <ul style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            color: 'rgb(209, 213, 219)'
                        }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Move</span> 
                                <span style={{ fontWeight: 'bold', color: '#93c5fd' }}>Swipe ← →</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Rotate</span> 
                                <span style={{ fontWeight: 'bold', color: '#93c5fd' }}>Tap / Swipe ↑</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Soft Drop</span> 
                                <span style={{ fontWeight: 'bold', color: '#93c5fd' }}>Short Swipe ↓</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Hard Drop</span> 
                                <span style={{ fontWeight: 'bold', color: '#93c5fd' }}>Long Swipe ↓</span>
                            </li>
                            <li style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)' }}>
                                Swipe anywhere on the game area
                            </li>
                        </ul>
                    ) : (
                        <ul style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            color: 'rgb(209, 213, 219)'
                        }}>
                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Move</span> 
                                <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#93c5fd' }}>← →</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Rotate</span> 
                                <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#93c5fd' }}>↑</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Soft Drop</span> 
                                <span style={{ fontWeight: 'bold', fontSize: '1.125rem', color: '#93c5fd' }}>↓</span>
                            </li>
                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Hard Drop</span> 
                                <span style={{ fontWeight: 'bold', color: '#93c5fd' }}>Space</span>
                            </li>
                        </ul>
                    )}
                </div>
                
                {/* Copyright footer */}
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.05em'
                }}>
                    <p>© mangobanaani 2025. Licensed under GNU GPL v3.0</p>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ColorisGame;
