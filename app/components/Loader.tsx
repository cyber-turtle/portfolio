'use client';

import { useEffect, useState } from 'react';

interface LoaderProps {
  onLoadingComplete?: () => void;
}

export default function Loader({ onLoadingComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loaderBar = document.getElementById('loader-bar');
    let currentProgress = 0;

    const loadInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 100) currentProgress = 100;
      
      setProgress(currentProgress);

      if (currentProgress === 100) {
        clearInterval(loadInterval);
        // Wait for user interaction
      }
    }, 200);

    return () => clearInterval(loadInterval);
  }, []);

  const handleStart = () => {
    // Trigger transition
    document.body.classList.add('loaded');
    
    // Notify parent to start audio immediately
    if (onLoadingComplete) onLoadingComplete();

    // Remove from DOM for performance after transition
    setTimeout(() => {
      document.body.classList.add('loaded-complete');
    }, 1200);
  };

  return (
    <>
      <div className="loader-panel panel-left"></div>
      <div className="loader-panel panel-right"></div>
      
      <div className="loader-content-wrapper mix-blend-exclusion text-white z-50">
        <div className={`loader-bar-container ${progress === 100 ? 'hide' : ''}`}>
          <div className="w-64 h-[1px] bg-white/20 mx-auto overflow-hidden mb-6 relative">
              <div 
                id="loader-bar" 
                className="h-full bg-white transition-all duration-300 absolute left-0 top-0"
                style={{ width: `${progress}%` }}
              ></div>
          </div>
          <div className="text-xs uppercase tracking-[0.3em] font-light">
            Initializing Assets <span className="animate-pulse">...</span>
          </div>
        </div>
        
        <div className={`loader-btn-container ${progress === 100 ? 'show' : ''} absolute inset-0 flex items-center justify-center`}>
           <button 
             onClick={handleStart}
             className="text-lg md:text-xl uppercase tracking-[0.5em] font-bold hover:scale-110 transition-transform duration-300 animate-pulse cursor-pointer relative group"
           >
             <span className="relative z-10">Enter Experience</span>
             <span className="absolute inset-0 bg-white/10 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
           </button>
        </div>
      </div>
    </>
  );
}
