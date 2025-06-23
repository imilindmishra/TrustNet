// File: frontend/components/MovingDotsBackground.tsx
"use client"
import React, { useMemo } from 'react';

const MovingDotsBackground = () => {
    const dots = useMemo(() => {
        const numDots = 50; // You can adjust the number of dots
        return Array.from({ length: numDots }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: `${Math.random() * 2 + 1}px`, // Dot size between 1px and 3px
            duration: `${Math.random() * 15 + 10}s`, // Animation duration between 10s and 25s
            delay: `${Math.random() * 5}s`,
        }));
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {dots.map(dot => (
                <div
                    key={dot.id}
                    className="absolute bg-white/50 rounded-full"
                    style={{
                        top: dot.top,
                        left: dot.left,
                        width: dot.size,
                        height: dot.size,
                        animation: `drift ${dot.duration} alternate infinite`,
                        animationDelay: dot.delay,
                    }}
                />
            ))}
        </div>
    );
};

export default MovingDotsBackground;