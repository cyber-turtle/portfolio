'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
    const dotRef = useRef<HTMLDivElement>(null);
    const outlineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dot = dotRef.current;
        const outline = outlineRef.current;

        if (!dot || !outline) return;

        const handleMouseMove = (e: MouseEvent) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Dot follows instantly
            dot.style.left = `${posX}px`;
            dot.style.top = `${posY}px`;

            // Outline follows with animation
            outline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
             window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} id="cursor-dot" />
            <div ref={outlineRef} id="cursor-outline" />
            
            {/* Grain Overlay - moved here to be part of global UI elements */}
            <div id="noise-overlay" />
            <style jsx global>{`
                #cursor-dot, #cursor-outline {
                    position: fixed;
                    top: 0;
                    left: 0;
                    transform: translate(-50%, -50%);
                    border-radius: 50%;
                    z-index: 20000;
                    pointer-events: none;
                    mix-blend-mode: difference;
                }
                #cursor-dot {
                    width: 8px;
                    height: 8px;
                    background-color: white;
                }
                #cursor-outline {
                    width: 40px;
                    height: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    transition: width 0.2s, height 0.2s, background-color 0.2s;
                }
                body:hover #cursor-outline {
                    width: 60px;
                    height: 60px;
                    background-color: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(2px);
                    border-color: transparent;
                }
                #noise-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 50;
                    opacity: 0.07;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
            `}</style>
        </>
    );
}
