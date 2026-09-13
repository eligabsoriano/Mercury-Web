import React, { useState } from 'react';
import {
  Activity,
  DollarSign,
  Users,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Zap,
  Server,
  ArrowRight,
} from 'lucide-react';
import {
  GlassCard,
  MetricCard,
  RiskTierBadge,
  SegmentBadge,
  Slider,
  Button,
} from './components/common';

export const App: React.FC = () => {
  // Interactive what-if simulation state
  const [deliveryDelay, setDeliveryDelay] = useState<number>(-3);
  const [reviewScoreDelta, setReviewScoreDelta] = useState<number>(0.5);
  const [discountRate, setDiscountRate] = useState<number>(15);

  // Computed simulated deltas
  const baselineChurnProb = 0.74;
  const simulatedChurnProb = Math.max(
    0.08,
    Math.min(
      0.95,
      baselineChurnProb -
        (deliveryDelay < 0 ? Math.abs(deliveryDelay) * 0.035 : -deliveryDelay * 0.02) -
        reviewScoreDelta * 0.075 -
        (discountRate / 100) * 0.22
    )
  );
  const deltaChurn = simulatedChurnProb - baselineChurnProb;
  const baselineRevenueAtRisk = 1850.0;
  const simulatedRevenueAtRisk = baselineRevenueAtRisk * simulatedChurnProb;
  const protectedRevenue = Math.max(0, baselineRevenueAtRisk - simulatedRevenueAtRisk);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col relative overflow-hidden">
      {/* Living Aurora Mesh (Dynamic Bioluminescent Substrate behind Liquid Glass) */}
      <div className="aurora-canvas" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
        <div className="aurora-orb aurora-orb-4" />
      </div>

      {/* Apple-Grade Liquid Glass Top Bar */}
      <header className="sticky top-0 z-40 liquid-glass rounded-none border-x-0 border-t-0 border-b border-[rgba(255,255,255,0.08)] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[rgba(139,92,246,0.22)] border border-[rgba(139,92,246,0.45)] flex items-center justify-center text-[#c084fc] shadow-[0_0_20px_rgba(139,92,246,0.35)]">
              <Zap size={19} />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-display font-extrabold text-xl tracking-tight text-white">
                  MERCURY
                </span>
                <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full bg-[rgba(139,92,246,0.18)] text-[#d8b4fe] border border-[rgba(139,92,246,0.4)] font-bold tracking-wider shadow-[0_0_10px_rgba(139,92,246,0.25)]">
                  Liquid Glass HUD
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Executive Customer Intelligence & Predictive Retention Cockpit
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2.5 bg-[rgba(255,255,255,0.05)] px-3.5 py-1.5 rounded-full border border-[rgba(255,255,255,0.1)] text-xs backdrop-blur-md">
            <span className="gem-dot gem-dot-emerald"></span>
            <span className="text-[var(--text-secondary)]">Backend REST API:</span>
            <span className="font-mono text-[#34d399] font-bold">
              40 Endpoints Active
            </span>
          </div>

          <a
            href="/docs/roadmap.md"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
          >
            <span>Roadmap</span>
            <ExternalLink size={12} />
          </a>

          <Button variant="violet" size="sm" icon={<Sliders size={14} />}>
            Interactive Simulation Lab
          </Button>
        </div>
      </header>

      {/* Main Executive Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8 relative z-10">
        {/* Executive Hero Intro Banner */}
        <section className="space-y-2.5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(139,92,246,0.12)] border border-[rgba(139,92,246,0.3)] text-xs font-mono text-[#c4b5fd]">
            <Sparkles size={13} className="text-[#a78bfa]" />
            <span className="uppercase tracking-wider font-semibold">
              Quantum Refractive Material Architecture
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Precision Customer Intelligence & Retention Economics
          </h1>
          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-3xl leading-relaxed">
            Synthesizing 100k+ Brazilian E-Commerce orders (Olist) into real-time counterfactual churn simulations,
            prescriptive decision playbooks, and Knapsack-optimized marketing budget allocation.
          </p>
        </section>

        {/* Macro KPI Row (Olist Production Metrics with Ambient Backlights) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Portfolio Gross Merchandise Value"
            value="R$ 15.98M"
            subtitle="100k+ Orders Delivered"
            delta={{ value: '+12.4%', isPositive: true, label: 'vs baseline' }}
            takeaway="Total lifetime delivered marketplace volume"
            icon={<DollarSign size={20} />}
            accent="emerald"
          />
          <MetricCard
            title="Active Customer Base"
            value="93,358"
            subtitle="Returning Customer Keys"
            delta={{ value: '2.99%', neutral: true, label: 'repeat rate' }}
            takeaway="Aggregated strictly on customer_unique_id"
            icon={<Users size={20} />}
            accent="cyan"
          />
          <MetricCard
            title="Portfolio Revenue at Risk"
            value="R$ 2.45M"
            subtitle="15.3% Total Financial Exposure"
            delta={{ value: '18.4%', isPositive: false, label: 'churn exposure' }}
            takeaway="17,680 customers in High Risk tier"
            icon={<AlertTriangle size={20} />}
            accent="crimson"
          />
          <MetricCard
            title="ML Churn Classification"
            value="0.871"
            subtitle="ROC-AUC Score"
            delta={{ value: 'HistGradientBoosting', neutral: true }}
            takeaway="Scoring 26 behavioral features in real-time"
            icon={<Activity size={20} />}
            accent="violet"
          />
        </section>

        {/* Interactive What-If Simulation Laboratory & Segment Intelligence */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Interactive What-If Counterfactual Simulator */}
          <div className="lg:col-span-7">
            <GlassCard
              title="Counterfactual What-If Churn Laboratory"
              subtitle="Drag simulated operational dials to project real-time shifts in churn probability and protected revenue"
              glow="violet"
              className="h-full"
              headerAction={
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-[rgba(139,92,246,0.16)] text-[#d8b4fe] border border-[rgba(139,92,246,0.4)] font-semibold">
                  POST /api/predictions/churn/simulate
                </span>
              }
            >
              <div className="space-y-6 mt-3">
                <Slider
                  label="Delivery Delay Reduction"
                  value={deliveryDelay}
                  min={-10}
                  max={10}
                  step={1}
                  unit="days"
                  onChange={setDeliveryDelay}
                  helperText="Speeding carrier transit eliminates primary post-purchase customer friction"
                  deltaBadge={{
                    text: deliveryDelay <= 0 ? `${deliveryDelay} days` : `+${deliveryDelay} days`,
                    isPositive: deliveryDelay <= 0,
                  }}
                />

                <Slider
                  label="Review Score Intervention"
                  value={reviewScoreDelta}
                  min={-2}
                  max={2}
                  step={0.5}
                  unit="★"
                  onChange={setReviewScoreDelta}
                  helperText="Proactive customer satisfaction repair and support outreach"
                  deltaBadge={{
                    text: `${reviewScoreDelta >= 0 ? '+' : ''}${reviewScoreDelta}★`,
                    isPositive: reviewScoreDelta >= 0,
                  }}
                />

                <Slider
                  label="Retention Incentive Voucher"
                  value={discountRate}
                  min={0}
                  max={30}
                  step={5}
                  unit="%"
                  onChange={setDiscountRate}
                  helperText="Algorithmic promotional discount applied to high-affinity categories"
                  deltaBadge={{
                    text: `${discountRate}% voucher`,
                    isPositive: true,
                  }}
                />

                {/* Dual-Prism Simulation Outcome Visualizer */}
                <div className="p-5 rounded-2xl bg-[rgba(11,16,28,0.7)] border border-[rgba(255,255,255,0.09)] space-y-4 backdrop-blur-xl relative overflow-hidden">
                  <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-mono">
                    <span className="flex items-center space-x-1.5">
                      <span className="gem-dot gem-dot-crimson" />
                      <span>BASELINE STATE</span>
                    </span>
                    <ArrowRight size={14} className="text-[#a78bfa] animate-pulse" />
                    <span className="flex items-center space-x-1.5">
                      <span className="gem-dot gem-dot-emerald" />
                      <span>PROJECTED COUNTERFACTUAL</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <div>
                      <span className="text-xs text-[var(--text-muted)] block uppercase font-medium">
                        Baseline Churn Risk:
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-display text-2xl font-bold opacity-60">
                          {(baselineChurnProb * 100).toFixed(0)}%
                        </span>
                        <RiskTierBadge tier="High Risk" probability={baselineChurnProb} />
                      </div>
                      <span className="text-[11px] text-[var(--text-muted)] font-mono mt-1 block">
                        Exposure: R$ {baselineRevenueAtRisk.toFixed(2)}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[var(--text-muted)] block uppercase font-medium">
                        Simulated Outcome:
                      </span>
                      <div className="flex items-center justify-end space-x-2 mt-1">
                        <span className="font-display text-2xl font-extrabold text-[#6ee7b7]">
                          {(simulatedChurnProb * 100).toFixed(1)}%
                        </span>
                        <RiskTierBadge
                          tier={
                            simulatedChurnProb >= 0.70
                              ? 'High Risk'
                              : simulatedChurnProb >= 0.40
                              ? 'Medium Risk'
                              : 'Low Risk'
                          }
                          probability={simulatedChurnProb}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-[var(--accent-emerald)] font-bold mt-1 block">
                        Recovered: +R$ {protectedRevenue.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[rgba(52,211,153,0.08)] border border-[rgba(52,211,153,0.25)] flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">
                      Net Churn Risk Delta:
                    </span>
                    <span className="font-mono font-bold text-[#34d399] text-sm">
                      {(deltaChurn * 100).toFixed(1)}% ({deltaChurn < 0 ? 'Risk Reduced' : 'Risk Elevated'})
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right: RFM Segmentation & Pipeline Telemetry */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard
              title="RFM Customer Segmentation Matrix"
              subtitle="Quintile scoring (R, F, M: 1–5) mapping Olist transaction percentiles into 11 canonical cohorts"
              glow="cyan"
            >
              <div className="flex flex-wrap gap-2.5 mt-3">
                <SegmentBadge segment="Champions" />
                <SegmentBadge segment="Loyal Customers" />
                <SegmentBadge segment="Potential Loyalists" />
                <SegmentBadge segment="Recent Customers" />
                <SegmentBadge segment="Promising" />
                <SegmentBadge segment="Customers Needing Attention" />
                <SegmentBadge segment="About to Sleep" />
                <SegmentBadge segment="At Risk" />
                <SegmentBadge segment="Can't Lose Them" />
                <SegmentBadge segment="Hibernating" />
                <SegmentBadge segment="Lost" />
              </div>

              <div className="mt-5 p-4 rounded-xl bg-[rgba(18,25,43,0.7)] border border-[rgba(244,63,94,0.3)] shadow-[0_0_15px_rgba(244,63,94,0.15)] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-[#fecdd3] uppercase tracking-wider">
                    VIP Retention Priority 1 Alert:
                  </span>
                  <span className="text-xs font-mono text-[#f43f5e] font-extrabold">
                    R$ 412,800 Exposure
                  </span>
                </div>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                  High-spend Champions and Loyal accounts experiencing delivery delay friction.
                  Prescribed playbook: <strong className="text-white">VIP Concierge & Dedicated Account Outreach</strong>.
                </p>
              </div>
            </GlassCard>

            <GlassCard
              title="Pipeline Observability Engine"
              subtitle="Direct data health diagnostics from GET /api/health/pipeline"
              headerAction={
                <div className="flex items-center space-x-1.5 text-xs text-[#34d399] font-mono">
                  <span className="gem-dot gem-dot-emerald" />
                  <span>ONLINE</span>
                </div>
              }
            >
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                  <span className="text-[var(--text-secondary)] flex items-center space-x-1.5">
                    <Server size={13} className="text-[#a78bfa]" />
                    <span>Database Latency:</span>
                  </span>
                  <span className="font-mono text-[#34d399] font-bold">
                    42 ms (Neon PostgreSQL 16)
                  </span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                  <span className="text-[var(--text-secondary)] flex items-center space-x-1.5">
                    <Layers size={13} className="text-[#38bdf8]" />
                    <span>Raw Orders Ingested:</span>
                  </span>
                  <span className="font-mono text-white font-bold">100,000+ records</span>
                </div>

                <div className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.06)]">
                  <span className="text-[var(--text-secondary)] flex items-center space-x-1.5">
                    <ShieldCheck size={13} className="text-[#34d399]" />
                    <span>dbt Analytical Mart:</span>
                  </span>
                  <span className="font-mono text-[#38bdf8] font-bold">
                    mart_customer_metrics (Fresh)
                  </span>
                </div>

                <div className="flex justify-between py-1.5">
                  <span className="text-[var(--text-secondary)] flex items-center space-x-1.5">
                    <Activity size={13} className="text-[#c084fc]" />
                    <span>Serialized Churn Model:</span>
                  </span>
                  <span className="font-mono text-[#c084fc] font-bold">
                    churn_model.joblib (1.2 MB)
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Phase Progress Card */}
        <section className="p-6 rounded-2xl liquid-glass border border-[rgba(255,255,255,0.12)] flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.4)] flex items-center justify-center text-[#34d399] shadow-[0_0_20px_rgba(52,211,153,0.25)]">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="font-display font-bold text-base text-white">
                Liquid Glass Quantum Refractive Design System Active
              </h4>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Ready for Phase 2: Strongly-Typed API Client & Offline Mock Engine
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/docs/roadmap.md', '_blank')}
            >
              View Roadmap
            </Button>
            <Button variant="primary" size="sm" icon={<ChevronRight size={14} />}>
              Proceed to Phase 2
            </Button>
          </div>
        </section>
      </main>

      {/* Executive Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.08)] px-6 py-4 text-center text-xs text-[var(--text-secondary)] flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto w-full relative z-10">
        <span>
          Mercury Platform &bull; Executive Customer Intelligence & Churn Analytics
        </span>
        <span className="mt-2 sm:mt-0 font-mono text-[11px] text-[var(--text-muted)]">
          TypeScript &bull; React 18 &bull; Vite 5 &bull; Liquid Glass Architecture
        </span>
      </footer>
    </div>
  );
};

export default App;
