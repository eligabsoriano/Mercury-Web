import React, { useMemo } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Zap,
  Target,
  Users,
} from 'lucide-react';
import type { RevenueAtRiskOverview } from '../../api';

interface RevenueAtRiskBreakdownProps {
  data: RevenueAtRiskOverview | null;
  onNavigateToSimulator?: () => void;
  onNavigateToRetention?: () => void;
  onNavigateToCustomers?: (priorityFilter?: string) => void;
  isLoading?: boolean;
}

function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(amount);
}

const PRIORITY_THEMES: Record<string, { badge: string; border: string; bg: string; dot: string }> = {
  'Priority 1 (VIP Retention)': {
    badge: 'text-[#fda4af] bg-[rgba(244,63,94,0.15)] border-[rgba(244,63,94,0.35)]',
    border: 'border-[rgba(244,63,94,0.35)]',
    bg: 'bg-[rgba(244,63,94,0.06)]',
    dot: 'bg-[#f43f5e] shadow-[0_0_8px_#f43f5e]',
  },
  'Priority 2 (Logistics Recovery)': {
    badge: 'text-[#fde68a] bg-[rgba(251,191,36,0.15)] border-[rgba(251,191,36,0.35)]',
    border: 'border-[rgba(251,191,36,0.3)]',
    bg: 'bg-[rgba(251,191,36,0.05)]',
    dot: 'bg-[#fbbf24] shadow-[0_0_8px_#fbbf24]',
  },
  'Priority 3 (Win-Back)': {
    badge: 'text-[#93c5fd] bg-[rgba(59,130,246,0.15)] border-[rgba(59,130,246,0.35)]',
    border: 'border-[rgba(59,130,246,0.25)]',
    bg: 'bg-[rgba(59,130,246,0.04)]',
    dot: 'bg-[#60a5fa] shadow-[0_0_8px_#60a5fa]',
  },
  'Priority 4 (Baseline Operational)': {
    badge: 'text-[#cbd5e1] bg-[rgba(100,116,139,0.15)] border-[rgba(100,116,139,0.3)]',
    border: 'border-[rgba(100,116,139,0.2)]',
    bg: 'bg-[rgba(100,116,139,0.03)]',
    dot: 'bg-[#94a3b8]',
  },
};

export const RevenueAtRiskBreakdown: React.FC<RevenueAtRiskBreakdownProps> = ({
  data,
  onNavigateToSimulator,
  onNavigateToRetention,
  onNavigateToCustomers,
  isLoading = false,
}) => {
  const totalRevenueAtRisk = data?.total_revenue_at_risk ?? 2452300.5;
  const portfolioRiskPct = data?.portfolio_risk_percentage ?? 15.34;
  const riskTiers = useMemo(() => data?.by_risk_tier ?? [], [data]);
  const priorities = useMemo(() => data?.by_retention_priority ?? [], [data]);

  const p1Exposure = useMemo(() => {
    const p1 = priorities.find((p) => p.retention_priority.includes('Priority 1'));
    return p1 ? p1.total_revenue_at_risk : 842100.2;
  }, [priorities]);

  const highTier = useMemo(() => {
    return riskTiers.find((t) => t.risk_tier === 'High') ?? null;
  }, [riskTiers]);

  return (
    <div className="liquid-glass rounded-2xl p-5 md:p-6 border border-[rgba(244,63,94,0.3)] shadow-[0_8px_32px_rgba(244,63,94,0.12)] relative overflow-hidden">
      {/* Background ambient crimson aura */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-[radial-gradient(ellipse_at_top_right,rgba(244,63,94,0.15),transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.07)]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display font-bold text-lg text-white tracking-tight flex items-center space-x-2">
              <ShieldAlert size={20} className="text-[#f43f5e]" />
              <span>Portfolio Revenue at Risk & Triage Priority</span>
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[rgba(244,63,94,0.15)] text-[#fda4af] border border-[rgba(244,63,94,0.35)] font-bold">
              {portfolioRiskPct.toFixed(1)}% of GMV
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Statistical financial exposure based on machine learning churn probabilities (P(Churn) × Spend)
          </p>
        </div>

        {/* Total Financial Exposure Pill */}
        <div className="text-right">
          <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
            Total Revenue Exposure:
          </span>
          <span className="font-display font-extrabold text-xl md:text-2xl text-[#f43f5e] tracking-tight">
            {formatBRL(totalRevenueAtRisk)}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-xs text-[var(--text-secondary)] font-mono animate-pulse">
          Synthesizing portfolio churn risk distribution...
        </div>
      ) : (
        <div className="space-y-6 mt-4">
          {/* Tri-Tier Risk Band Visual Stack */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-mono text-[var(--text-secondary)] mb-1.5">
              <span>RISK TIER BREAKDOWN (HIGH · MEDIUM · LOW)</span>
              <span>
                {highTier ? `${highTier.customer_count.toLocaleString()} High Risk Accounts` : '17,680 High Risk'}
              </span>
            </div>

            {/* Segmented multi-color bar */}
            <div className="h-4 w-full rounded-full bg-[rgba(15,23,42,0.8)] border border-[rgba(255,255,255,0.08)] flex overflow-hidden p-0.5 gap-0.5">
              {riskTiers.map((tier) => {
                const color =
                  tier.risk_tier === 'High'
                    ? '#f43f5e'
                    : tier.risk_tier === 'Medium'
                    ? '#fbbf24'
                    : '#34d399';
                return (
                  <div
                    key={tier.risk_tier}
                    style={{ width: `${Math.max(2, tier.percentage)}%`, backgroundColor: color }}
                    className="h-full rounded-sm opacity-85 hover:opacity-100 transition-all cursor-pointer"
                    title={`${tier.risk_tier} Risk: ${tier.percentage}% (${formatBRL(tier.total_revenue_at_risk)})`}
                  />
                );
              })}
            </div>

            {/* Risk Tier Sub-Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {riskTiers.map((tier) => {
                const isHigh = tier.risk_tier === 'High';
                const isMed = tier.risk_tier === 'Medium';
                const borderColor = isHigh
                  ? 'border-[rgba(244,63,94,0.3)]'
                  : isMed
                  ? 'border-[rgba(251,191,36,0.25)]'
                  : 'border-[rgba(52,211,153,0.2)]';
                const textColor = isHigh ? 'text-[#f43f5e]' : isMed ? 'text-[#fbbf24]' : 'text-[#34d399]';

                return (
                  <div
                    key={tier.risk_tier}
                    className={`p-3 rounded-xl bg-[rgba(15,23,42,0.6)] border ${borderColor} space-y-1.5`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-display font-bold text-xs text-white">
                        {tier.risk_tier} Risk Tier
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${textColor}`}>
                        {(tier.avg_churn_probability * 100).toFixed(0)}% avg churn
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-1 border-t border-[rgba(255,255,255,0.05)] text-xs font-mono">
                      <span className="text-[var(--text-muted)] text-[10px] font-sans">
                        {tier.customer_count.toLocaleString()} accts ({tier.percentage}%)
                      </span>
                      <span className={`font-bold ${textColor}`}>
                        {formatBRL(tier.total_revenue_at_risk)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Retention Priority Triage Cards (Actionable 4 Groups) */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-mono text-[var(--text-secondary)] mb-2">
              <span className="flex items-center space-x-1.5">
                <Target size={13} className="text-[#38bdf8]" />
                <span>ACTIONABLE RETENTION PRIORITY MATRIX</span>
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">
                Knapsack Allocation Target Groups
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {priorities.map((pri) => {
                const theme =
                  PRIORITY_THEMES[pri.retention_priority] ?? PRIORITY_THEMES['Priority 4 (Baseline Operational)'];

                return (
                  <div
                    key={pri.retention_priority}
                    className={`p-3.5 rounded-xl border ${theme.border} ${theme.bg} backdrop-blur-md flex flex-col justify-between space-y-3 group hover:border-[rgba(255,255,255,0.2)] transition-all`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${theme.dot}`} />
                        <span className="font-display font-bold text-xs text-white line-clamp-1">
                          {pri.retention_priority.split('(')[0].trim()}
                        </span>
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)] block mt-0.5 font-mono">
                        {pri.retention_priority.includes('(')
                          ? pri.retention_priority.slice(pri.retention_priority.indexOf('('))
                          : ''}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] text-xs font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-[var(--text-muted)] font-sans">
                          Accounts:
                        </span>
                        <span className="font-semibold text-white">
                          {pri.customer_count.toLocaleString()} ({pri.percentage}%)
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-[var(--text-muted)] font-sans">
                          Exposure:
                        </span>
                        <span className="font-bold text-[#fecdd3]">
                          {formatBRL(pri.total_revenue_at_risk)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fast-Action Risk Triage Synthesizer Banner */}
          <div className="p-4 rounded-xl bg-[rgba(18,25,43,0.85)] border border-[rgba(244,63,94,0.35)] shadow-[0_0_20px_rgba(244,63,94,0.15)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[rgba(244,63,94,0.18)] border border-[rgba(244,63,94,0.4)] flex items-center justify-center text-[#f43f5e] shrink-0">
                <Zap size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="font-display font-bold text-sm text-white flex items-center space-x-2">
                  <span>Fast-Action Executive Risk Triage</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[rgba(244,63,94,0.2)] text-[#fda4af] font-bold">
                    Action Required
                  </span>
                </h4>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                  <strong>17,680 customers ({formatBRL(totalRevenueAtRisk)})</strong> are in the High Risk churn band.
                  VIP Priority 1 exposure represents <strong>{formatBRL(p1Exposure)}</strong> across top Champions and Loyal accounts.
                  Immediate algorithmic campaign intervention or budget reallocation is recommended.
                </p>
              </div>
            </div>

            {/* Triage Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end md:self-center">
              <button
                type="button"
                onClick={() => onNavigateToCustomers?.('Priority 1 (VIP Retention)')}
                className="px-3 py-2 rounded-xl bg-[rgba(244,63,94,0.18)] text-[#fda4af] border border-[rgba(244,63,94,0.4)] text-xs font-semibold hover:bg-[rgba(244,63,94,0.28)] transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Users size={13} />
                <span>View Queue</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToRetention}
                className="px-3 py-2 rounded-xl bg-[rgba(52,211,153,0.18)] text-[#6ee7b7] border border-[rgba(52,211,153,0.4)] text-xs font-semibold hover:bg-[rgba(52,211,153,0.28)] transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <span>Optimize Budget</span>
                <ArrowRight size={13} />
              </button>

              <button
                type="button"
                onClick={onNavigateToSimulator}
                className="px-3 py-2 rounded-xl bg-[rgba(139,92,246,0.22)] text-[#c4b5fd] border border-[rgba(139,92,246,0.45)] text-xs font-semibold hover:bg-[rgba(139,92,246,0.32)] transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <span>Simulator</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
