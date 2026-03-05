import { useEffect, useState } from 'react';

export function WhaleEffect({ isWhale }: { isWhale: boolean }) {
    const [showAlert, setShowAlert] = useState(false);

    const [hasPlayed, setHasPlayed] = useState(false);

    useEffect(() => {
        if (isWhale && !hasPlayed) {
            setShowAlert(true);
            setHasPlayed(true);
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isWhale, hasPlayed]);

    if (!isWhale || (!showAlert && hasPlayed)) return null;

    return (
        <>
            {showAlert && (
                <div className="whale-alert">
                    ⚠️ WHALE DETECTED ⚠️
                    <div style={{ fontSize: '0.8rem', marginTop: '10px', opacity: 0.7 }}>
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
