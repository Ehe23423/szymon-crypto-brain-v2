import React, { useState, useCallback } from 'react';

export function SolanaRain() {
    const [particles, setParticles] = useState<{ id: number; left: string; duration: string }[]>([]);

    const triggerRain = useCallback(() => {
        const newParticles = Array.from({ length: 40 }).map((_, i) => ({
            id: Date.now() + i,
            left: Math.random() * 100 + 'vw',
            duration: 2 + Math.random() * 2 + 's'
        }));
        setParticles(newParticles);
        setTimeout(() => setParticles([]), 4000);
    }, []);

    // Expose trigger globally for easier integration
    (window as any).triggerSolanaRain = triggerRain;

    return {
        RainComponent: (
            <>
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="sol-coin"
                        style={{ left: p.left, animationDuration: p.duration }}
                    />
                ))}
            </>
        ),
        triggerRain
    };
}
