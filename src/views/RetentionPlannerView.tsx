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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800">
            <Briefcase size={13} className="text-emerald-600" />
            <span className="uppercase tracking-wider font-semibold">
              Algorithmic Capital Allocation
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2 text-slate-900">
            Retention Economics &amp; Playbook Planner
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Deploy Knapsack budget optimization to maximize recovered gross merchandise value across
            6 canonical retention playbooks, and model custom campaign economics in real-time.
          </p>
        </div>

        {/* Jump Navigation Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => knapsackSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-colors shadow-xs"
          >
            <Briefcase size={12} />
            <span>Knapsack Optimizer</span>
          </button>

          <button
            type="button"
            onClick={() => playbooksSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-200 text-xs font-mono text-violet-700 hover:bg-violet-100 hover:border-violet-300 transition-colors shadow-xs"
          >
            <Layers size={12} />
            <span>Playbooks Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => calculatorSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-xs font-mono text-sky-700 hover:bg-sky-100 hover:border-sky-300 transition-colors shadow-xs"
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
            <h2 className="font-display font-bold text-xl text-slate-900 flex items-center space-x-2">
              <Layers size={18} className="text-violet-600" />
              <span>Canonical Retention Playbook Catalog</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              6 battle-tested retention workflows calibrated against customer lifetime value and
              churn severity
            </p>
          </div>

          {/* Channel Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs font-mono">
            <Filter size={12} className="text-slate-400 mr-1" />
            <button
              type="button"
              onClick={() => setSelectedChannelFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedChannelFilter === 'all'
                  ? 'bg-violet-600 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              All Channels ({playbooks.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannelFilter('vip')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedChannelFilter === 'vip'
                  ? 'bg-violet-600 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              VIP Concierge
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannelFilter('logistics')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedChannelFilter === 'logistics'
                  ? 'bg-violet-600 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Logistics Recovery
            </button>
            <button
              type="button"
              onClick={() => setSelectedChannelFilter('support')}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                selectedChannelFilter === 'support'
                  ? 'bg-violet-600 text-white font-semibold shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:bg-slate-50'
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
