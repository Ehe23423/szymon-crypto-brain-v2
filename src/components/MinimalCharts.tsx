import type { DealParams } from '../model/DealModel';
import { calculateDealMetrics } from '../model/DealModel';

interface Props { params: DealParams; }

export function MinimalCharts({ params }: Props) {
    const volPoints = [1, 5, 10, 20, 30, 40, 50];

    const chartData = volPoints.map(vM => {
        const m = calculateDealMetrics({ ...params, V: vM * 1_000_000 });
        return {
            x: vM,
            net: m.netProfit,
            retained: m.exchangeRetained,
            partner: m.partnerPool,
            gross: m.grossFees
        };
    });

    const maxVal = Math.max(...chartData.map(d => d.gross), 1000);
    const H = 200, W = 600; // Expanded height and width
    const getX = (v: number) => ((v - 1) / (50 - 1)) * W;
    const getY = (v: number) => H - (v / maxVal) * H;

    // Build the paths
    const buildPath = (key: 'gross' | 'retained' | 'partner') =>
        chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(d.x)} ${getY(d[key])}`).join(' ');

    const fmt = (n: number) => n >= 1_000_000 ? `$${(n / 1e6).toFixed(1)}M` : n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${Math.round(n)}`;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }} className="terminal-grid">

                {/* A. SUMMARY STATS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--accent-purple)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        💎 Margin Efficiency
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
                            {((calculateDealMetrics(params).netProfit / calculateDealMetrics(params).grossFees) * 100).toFixed(1)}%
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Net Yield on Gross Volume</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--accent-emerald)' }}>● Retained</span>
                            <span style={{ color: '#fff' }}>{fmt(calculateDealMetrics(params).exchangeRetained)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'var(--accent-purple)' }}>● Partner</span>
                            <span style={{ color: '#fff' }}>{fmt(calculateDealMetrics(params).partnerPool)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                            <span style={{ color: 'rgba(255,255,255,0.3)' }}>● Total Fees</span>
                            <span style={{ color: '#fff' }}>{fmt(calculateDealMetrics(params).grossFees)}</span>
                        </div>
                    </div>
                </div>

                {/* B. MULTI-LAYER AREA CHART */}
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-light)', position: 'relative' }}>
                    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%', display: 'block', overflow: 'visible' }}>
                        {/* Area layers */}
                        <path d={`${buildPath('gross')} L ${W} ${H} L 0 ${H} Z`} fill="rgba(139, 233, 253, 0.03)" />
                        <path d={`${buildPath('retained')} L ${W} ${H} L 0 ${H} Z`} fill="rgba(80, 250, 123, 0.08)" />
                        <path d={`${buildPath('partner')} L ${W} ${H} L 0 ${H} Z`} fill="rgba(189, 147, 249, 0.12)" />

                        {/* Line outlines */}
                        <path d={buildPath('gross')} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />
                        <path d={buildPath('retained')} fill="none" stroke="var(--accent-emerald)" strokeWidth="2.5" />
                        <path d={buildPath('partner')} fill="none" stroke="var(--accent-purple)" strokeWidth="2.5" />

                        {/* Interactive Markers */}
                        {chartData.map((d, i) => (
                            <g key={i}>
                                <circle cx={getX(d.x)} cy={getY(d.retained)} r="4" fill="var(--bg-dark)" stroke="var(--accent-emerald)" strokeWidth="2" />
                            </g>
                        ))}

                        {/* Labels */}
                        <text x="0" y={H + 15} fontSize="10" fill="var(--text-secondary)" fontWeight="700">1M VOL</text>
                        <text x={W - 40} y={H + 15} fontSize="10" fill="var(--text-secondary)" fontWeight="700">50M VOL</text>
                    </svg>
                </div>
            </div>
        </div>
    );
}
