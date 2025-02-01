import  { useEffect, useState, useRef } from 'react';
import { Chess } from 'chess.js';

interface ClockProps {
  chess: Chess;
  initialTime: number;
  addedTime: number | null;
}

function WhiteClock({ chess, initialTime, addedTime }: ClockProps) {
  const [whiteTime, setWhiteTime] = useState(() => (initialTime || 0) * 60);
  const whiteInterval = useRef<NodeJS.Timeout | null>(null);

  const startClock = () => {
    stopClock();
    whiteInterval.current = setInterval(() => {
      setWhiteTime((prev) => Math.max(prev - 1, 0));
    }, 1000);
  };

  const stopClock = () => {
    if (whiteInterval.current) {
      clearInterval(whiteInterval.current);
    }
  };

  // Handle turn change and start clock
  useEffect(() => {
    stopClock();

    if (chess.turn() === 'w') {
      if (addedTime) {
        setWhiteTime((prev) => prev + addedTime * 60);
      }
      startClock();
    }

    return () => {
      stopClock(); // Clean up on unmount
    };
  }, [chess.turn()]);

  // Update whiteTime when initialTime changes
  useEffect(() => {
    setWhiteTime((initialTime || 0) * 60);
  }, [initialTime]);

  return (
    <div className="text-white text-2xl font-popins font-bold bg-black p-2">
      {isNaN(whiteTime) ? "00:00" : formatTime(whiteTime)}
    </div>
  );
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours > 0 ? hours + ':' : ''}${minutes
    .toString()
    .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export default WhiteClock;
