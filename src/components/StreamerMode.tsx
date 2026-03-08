import React from 'react';

interface Props {
    isActive: boolean;
    onToggle: (val: boolean) => void;
}

export function StreamerMode({ isActive, onToggle }: Props) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: isActive ? 'rgba(236, 72, 153, 0.1)' : 'rgba(255,255,255,0.02)',
                borderRadius: '12px',
                border: isActive ? '1px solid var(--accent-pink)' : '1px solid var(--border-light)',
                transition: 'all 0.3s ease'
            }}>
                <div>
                    <div style={{
                        fontSize: '0.85rem',
                        fontWeight: 800,
                        color: isActive ? 'var(--accent-pink)' : 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        {isActive ? '🔴 STREAMER MODE ON' : '⚪ STREAMER MODE OFF'}
                        {isActive && <span className="pulse-dot" style={{ width: '8px', height: '8px', background: 'var(--accent-pink)', borderRadius: '50%' }} />}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Automatic masking of sensitive deal figures & analytics
                    </div>
                </div>
                <button
                    onClick={() => onToggle(!isActive)}
                    className="storm-btn"
                    style={{
                        padding: '6px 16px',
                        background: isActive ? 'var(--accent-pink)' : 'rgba(255,255,255,0.05)',
                        color: isActive ? '#fff' : 'var(--text-secondary)',
                        border: 'none',
                        fontSize: '0.7rem',
                        fontWeight: 700
                    }}
                >
                    {isActive ? 'SHUT DOWN' : 'ACTIVATE'}
                </button>
            </div>

            {isActive && (
                <div className="fade-in" style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(191, 90, 242, 0.1) 100%)',
                    borderRadius: '16px',
                    border: '1px solid rgba(236, 72, 153, 0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-10%', right: '-10%', fontSize: '4rem', opacity: 0.1, rotate: '15deg' }}>💎</div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ padding: '8px', background: 'var(--accent-pink)', borderRadius: '8px', color: '#fff' }}>🎰</div>
                        <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 900, color: '#fff', letterSpacing: '0.05em' }}>GAMBLING OVERLAY</div>
                            <div style={{ fontSize: '0.6rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>STREAM-READY VIsUALS</div>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {['HIGH STAKES', 'WHALE HUNTER', 'PROFIT RAIN'].map(label => (
                            <div key={label} style={{
                                padding: '10px 4px',
                                background: 'rgba(0,0,0,0.3)',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontSize: '0.6rem',
                                fontWeight: 800,
                                color: 'var(--accent-cyan)',
                                border: '1px solid rgba(100, 210, 255, 0.2)'
                            }}>
                                {label}
                            </div>
                        ))}
                    </div>

                    <div style={{
                        marginTop: '8px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '10px',
                        fontSize: '0.7rem',
                        lineHeight: 1.4,
                        color: 'rgba(255,255,255,0.8)',
                        borderLeft: '4px solid var(--accent-pink)'
                    }}>
                        "Rain" effect is now tuned for maximum engagement. All private PnL figures are blurred for your audience.
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="storm-btn" style={{ flex: 1, background: 'var(--accent-blue)', fontSize: '0.65rem' }}>TRIGGER SOL RAIN</button>
                        <button className="storm-btn" style={{ flex: 1, background: 'var(--accent-purple)', fontSize: '0.65rem' }}>WHALE ALERT</button>
                    </div>
                </div>
            )}
        </div>
    );
}
