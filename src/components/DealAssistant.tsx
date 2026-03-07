import React, { useState } from 'react';
import type { DealParams, DealResult } from '../model/DealModel';
import { useLanguage } from '../lib/LanguageContext';

interface Props {
    params: DealParams;
    metrics: DealResult;
    dealScore: number;
}

interface QA {
    questionKey: string;
    emoji: string;
    answerKey: string;
    getAnswer: (p: DealParams, m: DealResult, s: number, t: (k: string) => string) => string;
}

const interpolate = (str: string, params: Record<string, any>) => {
    let result = str;
    for (const key in params) {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key]);
    }
    return result;
};

const QA_LIST: QA[] = [
    {
        questionKey: 'assistantQs.qSafe',
        emoji: '🛡️',
        answerKey: 'assistantAnswers.qSafe',
        getAnswer: (p, m, s, t) => {
            const buffer = (m.marginBuffer * 100).toFixed(1);
            const profit = (m.netProfit).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
            if (m.status === 'BLOCKED') return interpolate(t('assistantAnswers.qSafe.blocked'), { buffer, thresh: p.safetyThreshold });
            if (m.status === 'SAFE') return interpolate(t('assistantAnswers.qSafe.safe'), { score: s, buffer, profit });
            if (m.status === 'WARNING') return interpolate(t('assistantAnswers.qSafe.warn'), { score: s, buffer });
            return interpolate(t('assistantAnswers.qSafe.crit'), { buffer });
        }
    },
    {
        questionKey: 'assistantQs.qChange',
        emoji: '🎯',
        answerKey: 'assistantAnswers.qChange',
        getAnswer: (p, m, _s, t) => {
            if (p.R > m.netProfit * 0.5 && p.R > 0)
                return interpolate(t('assistantAnswers.qChange.retainer'), { val: p.R.toLocaleString(), pct: ((p.R / Math.max(m.netProfit, 1)) * 100).toFixed(0) });
            if (p.S > 42)
                return interpolate(t('assistantAnswers.qChange.subSplit'), { val: p.S });
            if (p.B > 100)
                return interpolate(t('assistantAnswers.qChange.bonus'), { val: p.B, pct: ((p.B / 350) * 100).toFixed(1) });
            if (p.P > 58) {
                const recapture = ((p.V / 1e6) * (p.F / 100) * 0.05 * 1e6).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                return interpolate(t('assistantAnswers.qChange.share'), { val: p.P, recapture });
            }
            return interpolate(t('assistantAnswers.qChange.balanced'), { target: (p.V * 1.2 / 1e6).toFixed(0) });
        }
    },
    {
        questionKey: 'assistantQs.qBreak',
        emoji: '📐',
        answerKey: 'assistantAnswers.qBreak',
        getAnswer: (p, m, _s, t) => {
            const beM = m.breakEvenVolume / 1e6;
            const currentM = p.V / 1e6;
            const pct = currentM > 0 ? ((currentM - beM) / currentM * 100).toFixed(0) : '0';
            if (m.breakEvenVolume <= 0)
                return t('assistantAnswers.qBreak.none');
            if (beM > currentM)
                return interpolate(t('assistantAnswers.qBreak.below'), { be: beM.toFixed(1), current: currentM.toFixed(1), gap: (beM - currentM).toFixed(1) });
            return interpolate(t('assistantAnswers.qBreak.above'), { be: beM.toFixed(1), current: currentM.toFixed(0), pct, drop: (currentM - beM).toFixed(1) });
        }
    },
    {
        questionKey: 'assistantQs.qRisk',
        emoji: '💣',
        answerKey: 'assistantAnswers.qRisk',
        getAnswer: (p, _m, _s, t) => {
            if (p.B === 0) return t('assistantAnswers.qRisk.none');
            const eq = ((p.B / 350) * 100).toFixed(1);
            if (parseFloat(eq) > 28.6) return interpolate(t('assistantAnswers.qRisk.high'), { val: p.B, pct: eq });
            if (parseFloat(eq) > 15) return interpolate(t('assistantAnswers.qRisk.elevated'), { pct: eq });
            return interpolate(t('assistantAnswers.qRisk.low'), { val: p.B, pct: eq });
        }
    },
    {
        questionKey: 'assistantQs.qNegotiation',
        emoji: '♟️',
        answerKey: 'assistantAnswers.qNegotiation',
        getAnswer: (p, m, _s, t) => {
            if (p.R > m.netProfit * 0.45 && p.R > 500)
                return interpolate(t('assistantAnswers.qNegotiation.move1'), { r1: Math.round(p.R * 0.4).toLocaleString(), r2: Math.round(p.R * 0.35).toLocaleString(), r3: Math.round(p.R * 0.25).toLocaleString() });
            if (p.S > 40)
                return interpolate(t('assistantAnswers.qNegotiation.move2'), { val: p.S });
            if (p.B > 100)
                return t('assistantAnswers.qNegotiation.move3');
            return interpolate(t('assistantAnswers.qNegotiation.move4'), { val: p.S });
        }
    },
    {
        questionKey: 'assistantQs.qRetained',
        emoji: '💰',
        answerKey: 'assistantAnswers.qRetained',
        getAnswer: (_p, m, _s, t) => {
            const r1m = m.retainedPer1M;
            const val = r1m.toFixed(0);
            if (r1m < 80) return interpolate(t('assistantAnswers.qRetained.collapse'), { val });
            if (r1m < 140) return interpolate(t('assistantAnswers.qRetained.low'), { val });
            const fee = (0.035 - (0.035 * (1 - r1m / 350))).toFixed(3);
            return interpolate(t('assistantAnswers.qRetained.healthy'), { val, pct: (r1m / 350 * 100).toFixed(0), fee });
        }
    },
];

export const DealAssistant: React.FC<Props> = ({ params, metrics, dealScore }) => {
    const { t } = useLanguage();
    const [activeQ, setActiveQ] = useState<number | null>(null);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '4px' }}>
                🤖 {t('assistantQs.title')}
            </div>
            {QA_LIST.map((qa, i) => {
                const isActive = activeQ === i;
                return (
                    <div key={i} style={{
                        border: `1px solid ${isActive ? 'rgba(96,165,250,0.5)' : 'rgba(255,255,255,0.06)'}`,
                        borderRadius: '10px',
                        overflow: 'hidden',
                        transition: 'border-color 0.2s',
                        backdropFilter: 'blur(10px)',
                    }}>
                        <button
                            onClick={() => setActiveQ(isActive ? null : i)}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                background: isActive ? 'rgba(96,165,250,0.08)' : 'rgba(255,255,255,0.02)',
                                border: 'none',
                                color: isActive ? '#93c5fd' : 'rgba(255,255,255,0.7)',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textAlign: 'left',
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'center',
                                transition: 'all 0.2s',
                            }}
                        >
                            <span style={{ fontSize: '1rem' }}>{qa.emoji}</span>
                            <span style={{ flex: 1 }}>{t(qa.questionKey)}</span>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{isActive ? '▲' : '▼'}</span>
                        </button>
                        {isActive && (
                            <div style={{
                                padding: '12px 14px',
                                background: 'rgba(0,0,0,0.3)',
                                borderTop: '1px solid rgba(255,255,255,0.05)',
                                fontSize: '0.78rem',
                                color: 'rgba(255,255,255,0.75)',
                                lineHeight: 1.6,
                            }}>
                                {qa.getAnswer(params, metrics, dealScore, t)}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
