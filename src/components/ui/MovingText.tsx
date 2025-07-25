import React, { useState, useEffect } from 'react';

const visionMessages = [
  "Trust",
  "You can take a year creating it",
  "But a minute to destroy it",
  "SuperDoll - Excellence in Service"
];

export function MovingText() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % visionMessages.length);
        setIsVisible(true);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-yellow-400 via-blue-500 to-yellow-400 bg-size-200 animate-gradient-x py-2 overflow-hidden">
      <div className="relative">
        <div 
          className={`text-center text-white font-semibold text-sm transition-all duration-500 transform ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          {visionMessages[currentMessageIndex]}
        </div>
      </div>
    </div>
  );
}
