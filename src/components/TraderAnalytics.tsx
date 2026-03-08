import React, { useMemo } from 'react';
import type { DealParams, DealResult } from '../model/DealModel';

interface Props {
    params: DealParams;
    metrics: DealResult;
}

export function TraderAnalytics({ params, metrics }: Props) {
    const exchangeColor = params.exchangeFlavor === 'BINGX' ? 'var(--accent-emerald)' : 'var(--accent-blue)';

    const stats = useMemo(() => [
        { label: 'PRODUCT', value: params.productType, sub: 'Execution Layer', color: 'var(--accent-purple)' },
        { label: 'EXCHANGE', value: params.exchangeFlavor, sub: 'Infrastructure', color: exchangeColor },
        { label: 'FEE CAPTURE', value: `${params.F}%`, sub: 'Blended Rate', color: 'var(--accent-cyan)' },
        { label: 'MARGIN', value: `${(metrics.marginBuffer * 100).toFixed(1)}%`, sub: 'Safety Buffer', color: metrics.isSafe ? 'var(--accent-emerald)' : 'var(--accent-rose)' },
    ], [params, metrics, exchangeColor]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* HUD Status Bar */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px'
            }}>
                {stats.map(s => (
                    <div key={s.label} style={{
                        padding: '12px',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', marginBottom: '4px' }}>{s.label}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '0.55rem', fontWeight: 600, color: 'rgba(255,255,255,0.25)', marginTop: '2px' }}>{s.sub}</div>
                    </div>
                ))}
            </div>

            {/* In-depth Analysis Panel */}
            <div style={{
                padding: '16px',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '16px',
                border: '1px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800 }}>LIVE PROJECTIONS</h4>
                    <div style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-emerald)', borderRadius: '4px', fontWeight: 700 }}>
                        {params.exchangeFlavor} OPTIMIZED
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Net Profit Projection</span>
                        <span style={{ fontWeight: 800, color: metrics.netProfit > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                            ${Math.round(metrics.netProfit).toLocaleString()}
                        </span>
                    </div>
                    <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
                        <div style={{
                            width: `${Math.min(100, Math.max(0, (metrics.marginBuffer * 100)))}%`,
                            height: '100%',
                            background: metrics.netProfit > 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                            borderRadius: '2px'
                        }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '4px' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)' }}>Retained per 1M</span>
                        <span style={{ fontWeight: 800, color: 'var(--accent-blue)' }}>
                            ${Math.round(metrics.retainedPer1M).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div style={{
                    marginTop: '8px',
                    padding: '8px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    fontSize: '0.65rem',
                    color: 'rgba(255,255,255,0.5)',
                    fontStyle: 'italic'
                }}>
                    * Based on {params.productType} pricing model for {params.exchangeFlavor === 'BINGX' ? 'BingX Institutional' : 'Generic'} accounts.
                </div>
            </div>
        </div>
    );
}
