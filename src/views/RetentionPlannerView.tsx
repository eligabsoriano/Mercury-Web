import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Layers,
  Calculator,
  Filter,
} from 'lucide-react';
import {
  PlaybookCard,
  KnapsackAllocationBreakdown,
  CampaignROICalculator,
} from '../components/retention';
import {
  retentionApi,
  mockRetentionPlaybooks,
  type RetentionPlaybook,
  type BudgetAllocationResult,
} from '../api';

export const RetentionPlannerView: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<RetentionPlaybook[]>(mockRetentionPlaybooks);
  const [budget, setBudget] = useState<number>(75000);
  const [allocation, setAllocation] = useState<BudgetAllocationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<string>('all');
  const [activePlaybookForROI, setActivePlaybookForROI] = useState<RetentionPlaybook | null>(null);

  // Section references for jump links
  const knapsackSectionRef = useRef<HTMLDivElement | null>(null);
  const playbooksSectionRef = useRef<HTMLDivElement | null>(null);
  const calculatorSectionRef = useRef<HTMLDivElement | null>(null);

  // Load Playbooks Catalog
  useEffect(() => {
    retentionApi
      .getPlaybooks()
      .then((pbs) => {
        if (Array.isArray(pbs) && pbs.length > 0) {
          setPlaybooks(pbs);
        }
      })
      .catch(console.error);
  }, []);

  // Run Knapsack Optimization whenever budget changes
  useEffect(() => {
    let active = true;
    setIsOptimizing(true);
    retentionApi
      .optimizeBudget({
        total_budget: budget,
      })
      .then((res) => {
        if (active) {
          setAllocation(res);
        }
      })
      .catch((err) => {
        console.error('Optimization error:', err);
      })
      .finally(() => {
        if (active) {
          setIsOptimizing(false);
        }
      });

    return () => {
      active = false;
    };
  }, [budget]);

  // Handle Playbook "Simulate ROI" Click
  const handleSimulatePlaybook = (playbook: RetentionPlaybook) => {
    setActivePlaybookForROI(playbook);
    if (typeof calculatorSectionRef.current?.scrollIntoView === 'function') {
      calculatorSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Channel filters for playbooks
  const filteredPlaybooks = playbooks.filter((p) => {
    if (selectedChannelFilter === 'all') return true;
    const channel = p.intervention_channel.toLowerCase();
    if (selectedChannelFilter === 'vip') {
      return channel.includes('phone') || channel.includes('vip') || channel.includes('whatsapp');
    }
    if (selectedChannelFilter === 'logistics') {
      return channel.includes('carrier') || channel.includes('sms') || channel.includes('freight');
    }
    if (selectedChannelFilter === 'support') {
      return channel.includes('review') || channel.includes('escalation');
    }
    if (selectedChannelFilter === 'automated') {
      return channel.includes('push') || channel.includes('automated');
    }
    if (selectedChannelFilter === 'loyalty') {
      return channel.includes('in-app') || channel.includes('loyalty');
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(52,211,153,0.12)] border border-[rgba(52,211,153,0.3)] text-xs font-mono text-[#a7f3d0]">
            <Briefcase size={13} className="text-[#34d399]" />
            <span className="uppercase tracking-wider font-semibold">
              Algorithmic Capital Allocation
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2 text-white">
            Retention Economics &amp; Playbook Planner
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Deploy Knapsack budget optimization to maximize recovered gross merchandise value across
            6 canonical retention playbooks, and model custom campaign economics in real-time.
          </p>
        </div>

        {/* Jump Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => knapsackSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.25)] text-xs font-mono text-[#34d399] hover:bg-[rgba(52,211,153,0.2)] transition-colors"
          >
            <Briefcase size={12} />
            <span>Knapsack Optimizer</span>
          </button>

          <button
            type="button"
            onClick={() => playbooksSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.25)] text-xs font-mono text-[#c084fc] hover:bg-[rgba(139,92,246,0.2)] transition-colors"
          >
            <Layers size={12} />
            <span>Playbooks Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => calculatorSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.25)] text-xs font-mono text-[#38bdf8] hover:bg-[rgba(56,189,248,0.2)] transition-colors"
          >
            <Calculator size={12} />
            <span>Campaign ROI Lab</span>
          </button>
        </div>
      </section>

      {/* Section 1: Knapsack Budget Deployment Optimizer */}
      <div ref={knapsackSectionRef}>
        <KnapsackAllocationBreakdown
          budget={budget}
          onBudgetChange={setBudget}
          allocation={allocation}
          loading={isOptimizing}
        />
      </div>

      {/* Section 2: Canonical Retention Playbook Catalog */}
      <div ref={playbooksSectionRef} className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-xl text-white flex items-center space-x-2">
              <Layers size={18} className="text-[#a78bfa]" />
              <span>Canonical Retention Playbook Catalog</span>
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              6 battle-tested retention workflows calibrated against customer lifetime value and
              churn severity
            </p>
          </div>

          {/* Channel Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-mono">
            <Filter size={12} className="text-[var(--text-muted)] mr-1" />
            <button
              type="button"
              onClick={() => setSelectedChannelFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedChannelFilter === 'all'
                  ? 'bg-[rgba(139,92,246,0.25)] text-white border border-[rgba(139,92,246,0.4)] font-bold'
                  : 'bg-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] border border-[rgba(255,255,255,0.06)] hover:text-white'
              }`}
            >
              All Channels ({playbooks.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannelFilter('vip')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedChannelFilter === 'vip'
                  ? 'bg-[rgba(139,92,246,0.25)] text-white border border-[rgba(139,92,246,0.4)] font-bold'
                  : 'bg-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] border border-[rgba(255,255,255,0.06)] hover:text-white'
              }`}
            >
              VIP Concierge
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannelFilter('logistics')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedChannelFilter === 'logistics'
                  ? 'bg-[rgba(139,92,246,0.25)] text-white border border-[rgba(139,92,246,0.4)] font-bold'
                  : 'bg-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] border border-[rgba(255,255,255,0.06)] hover:text-white'
              }`}
            >
              Logistics Recovery
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannelFilter('support')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedChannelFilter === 'support'
                  ? 'bg-[rgba(139,92,246,0.25)] text-white border border-[rgba(139,92,246,0.4)] font-bold'
                  : 'bg-[rgba(255,255,255,0.03)] text-[var(--text-secondary)] border border-[rgba(255,255,255,0.06)] hover:text-white'
              }`}
            >
              Quality &amp; Sentiment
            </button>
          </div>
        </div>

        {/* 6 Playbooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlaybooks.map((p) => (
            <PlaybookCard
              key={p.playbook_id}
              playbook={p}
              onSimulateCampaign={handleSimulatePlaybook}
            />
          ))}
        </div>
      </div>

      {/* Section 3: Dynamic Campaign ROI Calculator */}
      <div ref={calculatorSectionRef}>
        <CampaignROICalculator
          playbooks={playbooks}
          preselectedPlaybook={activePlaybookForROI}
        />
      </div>
    </div>
  );
};
