import React from 'react';
import {
  Wallet,
  Users,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { GlassCard, Slider } from '../common';
import type { BudgetAllocationResult } from '../../api';

interface KnapsackAllocationBreakdownProps {
  budget: number;
  onBudgetChange: (val: number) => void;
  allocation: BudgetAllocationResult | null;
  loading?: boolean;
}

const BUDGET_PRESETS = [
  { label: 'R$ 25k', value: 25000 },
  { label: 'R$ 50k', value: 50000 },
  { label: 'R$ 75k', value: 75000 },
  { label: 'R$ 150k', value: 150000 },
  { label: 'R$ 250k', value: 250000 },
];

export const KnapsackAllocationBreakdown: React.FC<KnapsackAllocationBreakdownProps> = ({
  budget,
  onBudgetChange,
  allocation,
  loading = false,
}) => {
  const allocatedBudget = allocation?.allocated_budget ?? budget;
  const remainingBudget = allocation?.remaining_budget ?? 0;
  const totalCustomers = allocation?.total_customers_targeted ?? 1650;
  const grossRecovered = allocation?.total_gross_recovered ?? 221650;
  const netValue = allocation?.total_net_value ?? 146650;
  const portfolioRoi = allocation?.portfolio_roi ?? 195.5;
  const portfolioEfficiency = allocation?.portfolio_efficiency ?? 2.95;

  return (
    <GlassCard
      title="Knapsack Retention Capital Deployment Optimizer"
      subtitle="Greedy algorithmic optimization selecting the highest-ROI interventions under budget constraint"
      glow="emerald"
      headerAction={
        loading ? (
          <span className="text-xs font-mono text-[#34d399] animate-pulse">
            Optimizing Portfolio...
          </span>
        ) : (
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[rgba(52,211,153,0.15)] text-[#6ee7b7] border border-[rgba(52,211,153,0.3)] font-bold">
            POST /api/retention/campaigns/optimize-budget
          </span>
        )
      }
    >
      <div className="space-y-6 mt-3">
        {/* Budget Control Slider and Presets */}
        <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center space-x-1.5">
              <Wallet size={13} className="text-[#34d399]" />
              <span>Target Capital Deployment Ceiling</span>
            </span>

            {/* Quick Budget Presets */}
            <div className="flex flex-wrap items-center gap-1.5">
              {BUDGET_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onBudgetChange(preset.value)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-mono transition-colors ${
                    budget === preset.value
                      ? 'bg-[rgba(52,211,153,0.25)] text-[#34d399] border border-[rgba(52,211,153,0.4)] font-bold'
                      : 'bg-[rgba(255,255,255,0.04)] text-[var(--text-secondary)] border border-[rgba(255,255,255,0.08)] hover:text-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <Slider
            label="Total Available Retention Budget"
            value={budget}
            min={5000}
            max={250000}
            step={5000}
            unit="BRL"
            onChange={onBudgetChange}
            helperText="Algorithmic Knapsack solver greedily funds candidate pools with the highest marginal return per BRL."
            deltaBadge={{
              text: `R$ ${budget.toLocaleString()}`,
              isPositive: true,
            }}
          />
        </div>

        {/* 4 Macro Portfolio KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-[var(--text-muted)] block flex items-center space-x-1">
              <Wallet size={12} className="text-[#34d399]" />
              <span>Allocated Capital</span>
            </span>
            <span className="font-display text-2xl font-extrabold text-white mt-1 block">
              R$ {allocatedBudget.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-[#34d399] mt-0.5 block">
              Remaining: R$ {Math.max(0, remainingBudget).toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-[var(--text-muted)] block flex items-center space-x-1">
              <Users size={12} className="text-[#38bdf8]" />
              <span>Target Customers</span>
            </span>
            <span className="font-display text-2xl font-extrabold text-[#38bdf8] mt-1 block">
              {totalCustomers.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5 block">
              Across {allocation?.allocations?.length ?? 5} candidate pools
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-[var(--text-muted)] block flex items-center space-x-1">
              <TrendingUp size={12} className="text-[#34d399]" />
              <span>Expected Recovered GMV</span>
            </span>
            <span className="font-display text-2xl font-extrabold text-[#34d399] mt-1 block">
              R$ {grossRecovered.toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-[#6ee7b7] mt-0.5 block">
              Net Value: +R$ {netValue.toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-[var(--text-muted)] block flex items-center space-x-1">
              <Percent size={12} className="text-[#c084fc]" />
              <span>Blended Portfolio ROI</span>
            </span>
            <span className="font-display text-2xl font-extrabold text-[#c084fc] mt-1 block">
              {portfolioRoi.toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-[#d8b4fe] mt-0.5 block">
              Efficiency: {portfolioEfficiency.toFixed(2)}x capital multiplier
            </span>
          </div>
        </div>

        {/* Candidate Pool Allocations Visualizer */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center space-x-1.5">
              <Sparkles size={13} className="text-[#34d399]" />
              <span>Ranked Candidate Pool Allocations</span>
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              Greedy Knapsack Efficiency Ordering
            </span>
          </div>

          <div className="space-y-3">
            {allocation?.allocations?.map((pool) => {
              const coveragePct = Math.round(pool.coverage_ratio * 100);
              const isFullyFunded = coveragePct >= 100;
              const isPartiallyFunded = coveragePct > 0 && coveragePct < 100;

              return (
                <div
                  key={pool.pool_name}
                  className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)] transition-colors space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white text-sm">
                          {pool.pool_name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(255,255,255,0.04)] text-[var(--text-secondary)] border border-[rgba(255,255,255,0.07)]">
                          {pool.playbook_id}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--text-muted)] font-mono mt-0.5 block">
                        Marginal Efficiency: {pool.marginal_efficiency.toFixed(2)}x GMV / BRL
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isFullyFunded ? (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.3)] text-[#34d399] text-[10px] font-mono font-bold">
                          <CheckCircle2 size={11} />
                          <span>100% Fully Funded</span>
                        </span>
                      ) : isPartiallyFunded ? (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[rgba(251,191,36,0.15)] border border-[rgba(251,191,36,0.3)] text-[#fbbf24] text-[10px] font-mono font-bold">
                          <Clock size={11} />
                          <span>{coveragePct}% Partial Budget</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] text-[10px] font-mono">
                          <AlertCircle size={11} />
                          <span>Unfunded</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Coverage Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1 text-[var(--text-secondary)]">
                      <span>
                        Targeted: <strong className="text-white">{pool.customers_targeted.toLocaleString()}</strong> / {pool.max_available_customers.toLocaleString()} accounts
                      </span>
                      <span className="font-bold text-[#34d399]">{coveragePct}%</span>
                    </div>
                    <div className="w-full h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isFullyFunded
                            ? 'bg-gradient-to-r from-[#059669] to-[#34d399]'
                            : isPartiallyFunded
                            ? 'bg-gradient-to-r from-[#d97706] to-[#fbbf24]'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${Math.min(100, coveragePct)}%` }}
                      />
                    </div>
                  </div>

                  {/* Pool Economic Return Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-[rgba(255,255,255,0.05)] text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        Allocated Spend
                      </span>
                      <span className="text-white font-bold">
                        R$ {pool.allocated_spend.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        Gross Recovered
                      </span>
                      <span className="text-[#34d399] font-bold">
                        R$ {pool.gross_revenue_saved.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        Net Economic Gain
                      </span>
                      <span className="text-[#6ee7b7] font-bold">
                        +R$ {pool.net_value.toLocaleString()}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[var(--text-muted)] block">
                        Pool Net ROI
                      </span>
                      <span className="text-[#c084fc] font-bold">
                        {pool.pool_roi.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
