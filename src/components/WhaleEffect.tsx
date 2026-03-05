import { useEffect, useState } from 'react';

export function WhaleEffect({ isWhale }: { isWhale: boolean }) {
    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        if (isWhale) {
            setShowAlert(true);
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [isWhale]);

    if (!isWhale) return null;

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
