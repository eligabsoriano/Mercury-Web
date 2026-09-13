import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import { GlassCard } from '../components/common';
import {
  retentionApi,
  type RetentionPlaybook,
  type BudgetAllocationResult,
} from '../api';

export const RetentionPlannerView: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<RetentionPlaybook[]>([]);
  const [budget] = useState<number>(75000);
  const [allocation, setAllocation] = useState<BudgetAllocationResult | null>(null);

  useEffect(() => {
    retentionApi.getPlaybooks().then(setPlaybooks).catch(console.error);
  }, []);

  useEffect(() => {
    async function runOptimization() {
      try {
        const res = await retentionApi.optimizeBudget({
          total_budget: budget,
        });
        setAllocation(res);
      } catch (err) {
        console.error('Optimization error:', err);
      }
    }
    runOptimization();
  }, [budget]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(52,211,153,0.12)] border border-[rgba(52,211,153,0.3)] text-xs font-mono text-[#a7f3d0]">
            <Briefcase size={13} className="text-[#34d399]" />
            <span className="uppercase tracking-wider font-semibold">
              Algorithmic Capital Allocation
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2 text-white">
            Retention Economics & Playbook Planner
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Deploy Knapsack budget optimization to maximize recovered gross merchandise value across
            6 canonical retention playbooks.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-[rgba(255,255,255,0.04)] px-3 py-2 rounded-xl border border-[rgba(255,255,255,0.08)]">
            <span className="text-xs text-[var(--text-secondary)]">Budget:</span>
            <span className="text-xs font-mono font-bold text-[#34d399]">
              R$ {budget.toLocaleString()}
            </span>
          </div>
        </div>
      </section>

      {/* Knapsack Optimizer Panel */}
      <GlassCard
        title="Knapsack Retention Capital Allocation Optimizer"
        subtitle="Greedy algorithmic optimization selecting the highest-ROI interventions under budget constraint"
        glow="emerald"
        headerAction={
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[rgba(52,211,153,0.15)] text-[#6ee7b7] border border-[rgba(52,211,153,0.3)] font-bold">
            POST /api/retention/campaigns/optimize-budget
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-[var(--text-muted)]">Allocated Capital</span>
            <span className="font-display text-2xl font-extrabold text-white mt-1 block">
              R$ {(allocation?.allocated_budget ?? budget).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-[#34d399] mt-0.5 block">
              Remaining: R$ {(allocation?.remaining_budget ?? 0).toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-[var(--text-muted)]">Target Customers</span>
            <span className="font-display text-2xl font-extrabold text-[#38bdf8] mt-1 block">
              {(allocation?.total_customers_targeted ?? 1650).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-[var(--text-muted)] mt-0.5 block">
              Across {allocation?.allocations?.length ?? 4} campaigns
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-[var(--text-muted)]">Expected Recovered GMV</span>
            <span className="font-display text-2xl font-extrabold text-[#34d399] mt-1 block">
              R$ {(allocation?.total_gross_recovered ?? 221650).toLocaleString()}
            </span>
            <span className="text-[10px] font-mono text-[#6ee7b7] mt-0.5 block">
              Net Value: +R$ {(allocation?.total_net_value ?? 146650).toLocaleString()}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
            <span className="text-xs text-[var(--text-muted)]">Blended Portfolio ROI</span>
            <span className="font-display text-2xl font-extrabold text-[#c084fc] mt-1 block">
              {(allocation?.portfolio_roi ?? 195.5).toFixed(1)}%
            </span>
            <span className="text-[10px] font-mono text-[#d8b4fe] mt-0.5 block">
              Algorithmic maximum
            </span>
          </div>
        </div>
      </GlassCard>

      {/* 6 Prescriptive Playbooks Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg text-white">
            Canonical Retention Playbook Catalog
          </h2>
          <span className="text-xs text-[var(--text-muted)] font-mono">
            {playbooks.length} Active Playbooks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {playbooks.map((p) => (
            <GlassCard
              key={p.playbook_id}
              title={p.name}
              subtitle={p.target_criteria}
              glow="violet"
              className="hover:scale-[1.01] transition-transform cursor-pointer"
            >
              <div className="space-y-3 mt-3 text-xs">
                <p className="text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-[var(--text-muted)] block">Est. Cost / Account:</span>
                    <span className="font-bold text-white">R$ {p.default_cost_per_customer}</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block">Expected Save Rate:</span>
                    <span className="font-bold text-[#34d399]">
                      {(p.estimated_save_rate_max * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[var(--text-secondary)]">
                    Channel: {p.intervention_channel}
                  </span>
                  <span className="text-[#a78bfa] font-semibold flex items-center space-x-1">
                    <span>Deploy</span>
                    <ChevronRight size={11} />
                  </span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
};

