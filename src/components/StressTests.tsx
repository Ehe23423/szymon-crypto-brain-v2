import type { DealParams } from '../model/DealModel';
import { calculateDealMetrics } from '../model/DealModel';

interface Props {
    baseParams: DealParams;
}

export function StressTests({ baseParams }: Props) {
    const formatUSD = (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Math.round(val));

    const scenarios = [
        {
            id: 'vol_drop',
            title: 'Volume -40%',
            params: { ...baseParams, V: baseParams.V * 0.6 }
        },
        {
            id: 'fee_comp',
            title: 'Fee Compression (0.028%)',
            params: { ...baseParams, F: 0.028 }
        },
        {
            id: 'partner_greed',
            title: 'Partner Greed (+10pp)',
            params: { ...baseParams, P: Math.min(80, baseParams.P + 10) }
        }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', height: '100%', overflowX: 'auto', paddingBottom: '4px' }}>
            {scenarios.map(s => {
                const m = calculateDealMetrics(s.params);
                const survived = m.netProfit > 0;
                return (
                    <div key={s.id} style={{
                        padding: '12px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.02)',
                        border: `1px solid ${survived ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        minWidth: '140px',
                        flex: 1
                    }}>
                        <h4 style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', margin: 0, fontWeight: 800 }}>{s.title}</h4>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px' }}>
                            <div style={{ fontSize: '1rem', fontWeight: 900, color: survived ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                                {survived ? 'SURVIVED' : 'FAILED'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                Profit: {formatUSD(m.netProfit)}
                            </div>
                        </div>
                        <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                                width: `${Math.min(100, Math.max(0, m.marginBuffer * 200))}%`,
                                height: '100%',
                                background: survived ? 'var(--accent-emerald)' : 'var(--accent-rose)'
                            }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
