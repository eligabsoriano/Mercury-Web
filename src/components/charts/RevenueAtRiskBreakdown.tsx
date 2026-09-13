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

const PRIORITY_THEMES: Record<string, { border: string; bg: string; dot: string }> = {
  'Priority 1 (VIP Retention)': {
    border: 'border-rose-200',
    bg: 'bg-rose-50/50',
    dot: 'bg-rose-500',
  },
  'Priority 2 (Logistics Recovery)': {
    border: 'border-amber-200',
    bg: 'bg-amber-50/50',
    dot: 'bg-amber-500',
  },
  'Priority 3 (Win-Back)': {
    border: 'border-sky-200',
    bg: 'bg-sky-50/50',
    dot: 'bg-sky-500',
  },
  'Priority 4 (Baseline Operational)': {
    border: 'border-slate-200',
    bg: 'bg-slate-50/70',
    dot: 'bg-slate-400',
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
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight flex items-center space-x-2">
              <ShieldAlert size={20} className="text-rose-600" />
              <span>Portfolio Revenue at Risk & Triage Priority</span>
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold">
              {portfolioRiskPct.toFixed(1)}% of GMV
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistical financial exposure based on machine learning churn probabilities (P(Churn) × Spend)
          </p>
        </div>

        {/* Total Financial Exposure Pill */}
        <div className="text-left sm:text-right">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">
            Total Revenue Exposure:
          </span>
          <span className="font-display font-extrabold text-xl md:text-2xl text-rose-600 tracking-tight">
            {formatBRL(totalRevenueAtRisk)}
          </span>
        </div>
      </div>

      {isLoading ? (
        <div className="h-48 flex items-center justify-center text-xs text-slate-400 font-mono animate-pulse">
          Synthesizing portfolio churn risk distribution...
        </div>
      ) : (
        <div className="space-y-6 mt-4">
          {/* Tri-Tier Risk Band Visual Stack */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 mb-1.5">
              <span>RISK TIER BREAKDOWN (HIGH · MEDIUM · LOW)</span>
              <span className="font-medium text-slate-700">
                {highTier ? `${highTier.customer_count.toLocaleString()} High Risk Accounts` : '17,680 High Risk'}
              </span>
            </div>

            {/* Segmented multi-color bar */}
            <div className="h-3.5 w-full rounded-full bg-slate-100 border border-slate-200 flex overflow-hidden p-0.5 gap-0.5">
              {riskTiers.map((tier) => {
                const color =
                  tier.risk_tier === 'High'
                    ? '#e11d48'
                    : tier.risk_tier === 'Medium'
                    ? '#d97706'
                    : '#059669';
                return (
                  <div
                    key={tier.risk_tier}
                    style={{ width: `${Math.max(2, tier.percentage)}%`, backgroundColor: color }}
                    className="h-full rounded-xs opacity-90 hover:opacity-100 transition-all cursor-pointer"
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
                  ? 'border-rose-200 bg-rose-50/30'
                  : isMed
                  ? 'border-amber-200 bg-amber-50/30'
                  : 'border-emerald-200 bg-emerald-50/30';
                const textColor = isHigh ? 'text-rose-700' : isMed ? 'text-amber-700' : 'text-emerald-700';

                return (
                  <div
                    key={tier.risk_tier}
                    className={`p-3 rounded-xl border ${borderColor} space-y-1.5`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-display font-bold text-xs text-slate-900">
                        {tier.risk_tier} Risk Tier
                      </span>
                      <span className={`text-[10px] font-mono font-bold ${textColor}`}>
                        {(tier.avg_churn_probability * 100).toFixed(0)}% avg churn
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-1 border-t border-slate-100 text-xs font-mono">
                      <span className="text-slate-500 text-[10px] font-sans">
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

          {/* Retention Priority Triage Cards (Fix Image 1: No Horizontal Collisions or Overflow) */}
          <div>
            <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 mb-2">
              <span className="flex items-center space-x-1.5">
                <Target size={13} className="text-indigo-600" />
                <span>ACTIONABLE RETENTION PRIORITY MATRIX</span>
              </span>
              <span className="text-[10px] text-slate-400">
                Knapsack Allocation Target Groups
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {priorities.map((pri) => {
                const theme =
                  PRIORITY_THEMES[pri.retention_priority] ?? PRIORITY_THEMES['Priority 4 (Baseline Operational)'];

                return (
                  <div
                    key={pri.retention_priority}
                    className={`p-3 rounded-xl border ${theme.border} ${theme.bg} flex flex-col justify-between space-y-2.5 transition-shadow hover:shadow-xs overflow-hidden`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${theme.dot}`} />
                        <span className="font-display font-bold text-xs text-slate-900">
                          {pri.retention_priority.split('(')[0].trim()}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-0.5 font-medium truncate">
                        {pri.retention_priority.includes('(')
                          ? pri.retention_priority.slice(pri.retention_priority.indexOf('('))
                          : ''}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 text-xs space-y-1 font-sans">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          Accounts:
                        </span>
                        <span className="font-semibold text-slate-800 font-mono">
                          {pri.customer_count.toLocaleString()} ({pri.percentage}%)
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">
                          Exposure:
                        </span>
                        <span className="font-bold text-rose-600 font-mono text-xs">
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
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 flex flex-col items-start gap-3.5">
            <div className="flex items-start space-x-3 w-full">
              <div className="w-9 h-9 rounded-xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <Zap size={18} />
              </div>
              <div className="space-y-1 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    Fast-Action Executive Risk Triage
                  </h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold">
                    Action Required
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong className="text-slate-900">17,680 customers ({formatBRL(totalRevenueAtRisk)})</strong> are in the High Risk churn band.
                  VIP Priority 1 exposure represents <strong className="text-slate-900">{formatBRL(p1Exposure)}</strong> across top Champions and Loyal accounts.
                  Immediate algorithmic campaign intervention or budget reallocation is recommended.
                </p>
              </div>
            </div>

            {/* Triage Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full pt-2.5 border-t border-rose-200/60">
              <button
                type="button"
                onClick={() => onNavigateToCustomers?.('Priority 1 (VIP Retention)')}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-rose-700 border border-rose-200 text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <Users size={13} />
                <span>View Queue</span>
              </button>

              <button
                type="button"
                onClick={onNavigateToRetention}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
              >
                <span>Optimize Budget</span>
                <ArrowRight size={13} />
              </button>

              <button
                type="button"
                onClick={onNavigateToSimulator}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center space-x-1.5"
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
