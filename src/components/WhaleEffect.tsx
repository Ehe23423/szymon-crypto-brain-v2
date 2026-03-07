import { useEffect, useState } from 'react';

export function WhaleEffect({ isWhale }: { isWhale: boolean }) {
    const [showAlert, setShowAlert] = useState(false);

    const [hasPlayed, setHasPlayed] = useState(false);

    useEffect(() => {
        const sessionPlayed = sessionStorage.getItem('whale_effect_played');
        console.log('WhaleEffect Check:', { isWhale, sessionPlayed, hasPlayed });

        if (isWhale && !sessionPlayed && !hasPlayed) {
            console.log('TRIGGERING WHALE ALERT');
            setShowAlert(true);
            setHasPlayed(true);
            sessionStorage.setItem('whale_effect_played', 'true');
        } else if (!isWhale) {
            setShowAlert(false);
        }
    }, [isWhale, hasPlayed]);

    useEffect(() => {
        let timer: any;
        if (showAlert) {
            timer = setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [showAlert]);

    if (!isWhale && !showAlert) return null;

    return (
        <>
            {showAlert && (
                <div className="whale-alert">
                    <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '16px', filter: 'drop-shadow(0 0 20px rgba(139, 233, 253, 0.5))' }}>🐋</span>
                    WHALE DETECTED
                    <div style={{ fontSize: '1rem', marginTop: '12px', opacity: 0.9, color: 'var(--accent-blue)', letterSpacing: '0.15em', fontWeight: 600, textTransform: 'uppercase' }}>
                        CRYPTO VIBE ENGINE ACTIVE
                    </div>
                </div>
            )}
            <div className="whale-overlay">
                <div className="whale-sprite">🐳</div>
            </div>
        </>
    );
}
