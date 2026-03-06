import type { DealParams, DealResult } from '../model/DealModel';
import { useLanguage } from '../lib/LanguageContext';

interface Props {
    params: DealParams;
    metrics: DealResult;
}

export function StructuralWarnings({ params, metrics }: Props) {
    const { t } = useLanguage();
    const warnings = [];

    if (params.R > metrics.netProfit && metrics.netProfit > 0) {
        warnings.push({
            id: 'retainer-high',
            label: t('warnLabels.retainer'),
            text: t('warn.highRetainer'),
            severity: 'high'
        });
    }

    if (metrics.breakEvenVolume > 30000000) {
        warnings.push({
            id: 'be-extreme',
            label: t('warnLabels.breakEven'),
            text: t('warn.beExtreme').replace('{val}', (metrics.breakEvenVolume / 1000000).toFixed(1)),
            severity: 'high'
        });
    }

    if (params.P > 70) {
        warnings.push({
            id: 'share-extreme',
            label: t('warnLabels.share'),
            text: t('warn.shareCeil'),
            severity: 'medium'
        });
    }

    if (metrics.marginBuffer < (params.safetyThreshold / 100)) {
        warnings.push({
            id: 'safety-violation',
            label: t('warnLabels.margin'),
            text: t('warn.marginSafety').replace('{val}', (metrics.marginBuffer * 100).toFixed(1)).replace('{thresh}', params.safetyThreshold.toString()),
            severity: 'high'
        });
    }

    if (params.F < 0.02) {
        warnings.push({
            id: 'low-fee',
            label: t('warnLabels.fee'),
            text: t('warn.feeComp'),
            severity: 'medium'
        });
    }

    // Moduł 40/54 — Margin Collapse Detector
    const retainedPer1M = metrics.retainedPer1M;
    if (retainedPer1M < 75) {
        warnings.push({
            id: 'margin-collapse',
            label: t('warnLabels.marginCollapse'),
            text: t('warn.marginCollapseText').replace('{val}', retainedPer1M.toFixed(0)),
            severity: 'high'
        });
    }

    // Moduł 30 — Hunter Detection
    if (params.V > 40_000_000) {
        warnings.push({
            id: 'hunter-detection',
            label: t('warnLabels.hunter'),
            text: t('warn.hunterText'),
            severity: 'medium'
        });
    }

    // Bonus Stacking Risk
    const grossPer1M = (params.F / 100) * 1_000_000;
    const bonusEquivPct = grossPer1M > 0 ? (params.B / grossPer1M) * 100 : 0;
    if (bonusEquivPct > 20) {
        warnings.push({
            id: 'bonus-stacking',
            label: t('warnLabels.bonusStacking'),
            text: t('warn.bonusStackingText').replace('{val}', bonusEquivPct.toFixed(1)),
            severity: 'high'
        });
    }

    // Moduł 41 — High S + High R combo
    if (params.S > 40 && params.R > 2000) {
        warnings.push({
            id: 'high-s-high-r',
            label: t('warnLabels.doubleCost'),
            text: t('warn.doubleCostText'),
            severity: 'high'
        });
    }

    if (warnings.length === 0) {
        return (
            <div style={{ padding: '16px', background: 'rgba(52, 211, 153, 0.05)', color: 'var(--accent-emerald)', borderRadius: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>✅</span> {t('warn.noRisk')}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="panel-header" style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '1rem', marginRight: '6px' }}>⚠️</span> {t('warn.title')}
            </div>
            {warnings.map(w => (
                <div
                    key={w.id}
                    style={{
                        background: w.severity === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                        borderLeft: `3px solid ${w.severity === 'high' ? 'var(--accent-rose)' : 'var(--accent-orange)'}`,
                        padding: '12px',
                        borderRadius: '4px'
                    }}
                >
                    <div style={{ fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', color: w.severity === 'high' ? 'var(--accent-rose)' : 'var(--accent-orange)' }}>
                        {w.label}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#fff', lineHeight: '1.4' }}>
                        {w.text}
                    </div>
                </div>
            ))}
        </div>
    );
}
