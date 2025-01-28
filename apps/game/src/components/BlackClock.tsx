import React, { useEffect, useState, useRef } from 'react';
import { Chess } from 'chess.js';

interface ClockProps {
  chess: Chess;
  initialTime: number;
  addedTime: number | null;
}

function BlackClock({ chess, initialTime, addedTime }: ClockProps) {
  const [blackTime, setBlackTime] = useState(() => (initialTime || 0) * 60);
  const blackInterval = useRef<NodeJS.Timeout | null>(null);

  const startClock = () => {
    stopClock();
    blackInterval.current = setInterval(() => {
      setBlackTime((prev) => Math.max(prev - 1, 0));
    }, 1000);
  };

  const stopClock = () => {
    if (blackInterval.current) {
      clearInterval(blackInterval.current);
    }
  };

  // Handle turn change and start clock
  useEffect(() => {
    stopClock();

    if (chess.turn() === 'b') {
      console.log("black turn")
      if (addedTime) {
        setBlackTime((prev) => prev + addedTime * 60);
      }
      startClock();
    }

    return () => {
      stopClock(); // Clean up on unmount
    };
  }, [chess.turn()]);

  // Update blackTime when initialTime changes
  useEffect(() => {
    setBlackTime((initialTime || 0) * 60);
  }, [initialTime]);

  return (
    <div className="text-white text-2xl font-popins font-bold bg-black p-2">
      {isNaN(blackTime) ? "00:00" : formatTime(blackTime)}
      black
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

export default BlackClock;
