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
  // Interactive what-if simulation demo state
  const [deliveryDelay, setDeliveryDelay] = useState<number>(0);
  const [reviewScoreDelta, setReviewScoreDelta] = useState<number>(0);
  const [discountRate, setDiscountRate] = useState<number>(10);

  // Computed simulated deltas
  const simulatedChurnProb = Math.max(
    0.05,
    Math.min(0.95, 0.72 - (deliveryDelay < 0 ? Math.abs(deliveryDelay) * 0.03 : -deliveryDelay * 0.02) - reviewScoreDelta * 0.08 - (discountRate / 100) * 0.25)
  );
  const baselineChurnProb = 0.72;
  const deltaChurn = simulatedChurnProb - baselineChurnProb;
  const protectedRevenue = Math.max(0, -deltaChurn * 1250);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col">
      {/* Executive Top Navigation Header */}
      <header className="sticky top-0 z-40 bg-[hsla(222,47%,7%,0.85)] backdrop-blur-md border-b border-[var(--border-subtle)] px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[hsla(263,70%,58%,0.2)] border border-[var(--border-focus)] flex items-center justify-center text-[var(--accent-violet)] shadow-violet">
              <Activity size={18} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-lg tracking-tight text-primary">
                  MERCURY
                </span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[hsla(158,64%,52%,0.15)] text-[var(--accent-emerald)] border border-[var(--border-emerald)] font-semibold">
                  Phase 1 Live
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)]">
                Executive Customer Intelligence & Retention Platform
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-[var(--bg-panel)] px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] text-xs">
            <span className="pulse-dot pulse-dot-emerald"></span>
            <span className="text-[var(--text-secondary)]">Backend API:</span>
            <span className="font-mono text-[var(--accent-emerald)] font-semibold">
              40 Endpoints Ready
            </span>
          </div>

          <a
            href="/docs/roadmap.md"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1.5 text-xs text-[var(--text-secondary)] hover:text-primary transition-colors"
          >
            <span>Roadmap</span>
            <ExternalLink size={12} />
          </a>

          <Button variant="violet" size="sm" icon={<Sliders size={14} />}>
            Interactive Workspace
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
        {/* Executive Hero Intro */}
        <section className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-[var(--accent-violet)]">
            <Layers size={14} />
            <span className="uppercase tracking-wider">Executive Command Center</span>
            <span>/</span>
            <span>Design System & Architecture Baseline</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
            Customer Intelligence, Churn Risk & Retention Optimization
          </h1>
          <p className="text-sm md:text-base text-[var(--text-secondary)] max-w-3xl">
            Synthesizing 100k+ Brazilian E-Commerce orders (Olist) into predictive churn models,
            real-time counterfactual simulations, and Knapsack-optimized budget allocation.
          </p>
        </section>

        {/* Macro KPI Row (Olist Production Metrics Baseline) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            title="Total Portfolio GMV"
            value="R$ 15.98M"
            subtitle="96,096 Customers"
            delta={{ value: '+12.4%', isPositive: true, label: 'vs last cycle' }}
            takeaway="Total lifetime delivered sales volume"
            icon={<DollarSign size={20} />}
            accent="emerald"
          />
          <MetricCard
            title="Active Customer Base"
            value="93,358"
            subtitle="Unique Returning Keys"
            delta={{ value: '2.99%', neutral: true, label: 'repeat rate' }}
            takeaway="Aggregated strictly on customer_unique_id"
            icon={<Users size={20} />}
            accent="cyan"
          />
          <MetricCard
            title="Portfolio Revenue at Risk"
            value="R$ 2.45M"
            subtitle="15.3% of Total GMV"
            delta={{ value: '18.4%', isPositive: false, label: 'churn exposure' }}
            takeaway="17,680 customers at risk of churn"
            icon={<AlertTriangle size={20} />}
            accent="crimson"
          />
          <MetricCard
            title="ML Model Accuracy"
            value="0.871"
            subtitle="ROC-AUC Score"
            delta={{ value: 'HistGradientBoosting', neutral: true }}
            takeaway="Scoring 26 behavioral features in real-time"
            icon={<Activity size={20} />}
            accent="violet"
          />
        </section>

        {/* Two-Column Showcase: Interactive What-If Simulator & RFM Segment Badges */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: What-If Counterfactual Churn Simulator Preview */}
          <div className="lg:col-span-7">
            <GlassCard
              title="Counterfactual What-If Churn Simulator"
              subtitle="Adjust simulated operational features to preview real-time changes in churn probability"
              glow="violet"
              className="h-full"
              headerAction={
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[hsla(263,70%,58%,0.15)] text-[var(--accent-violet)] border border-[var(--border-focus)]">
                  POST /api/predictions/churn/simulate
                </span>
              }
            >
              <div className="space-y-6 mt-2">
                <Slider
                  label="Delivery Delay Adjustment"
                  value={deliveryDelay}
                  min={-10}
                  max={10}
                  step={1}
                  unit="days"
                  onChange={setDeliveryDelay}
                  helperText="Faster transit reduces post-purchase friction"
                  deltaBadge={{
                    text: deliveryDelay <= 0 ? `${deliveryDelay} days` : `+${deliveryDelay} days`,
                    isPositive: deliveryDelay <= 0,
                  }}
                />

                <Slider
                  label="Review Score Delta"
                  value={reviewScoreDelta}
                  min={-2}
                  max={2}
                  step={0.5}
                  unit="★"
                  onChange={setReviewScoreDelta}
                  helperText="Proactive customer sentiment resolution"
                  deltaBadge={{
                    text: `${reviewScoreDelta >= 0 ? '+' : ''}${reviewScoreDelta}★`,
                    isPositive: reviewScoreDelta >= 0,
                  }}
                />

                <Slider
                  label="Retention Discount Voucher"
                  value={discountRate}
                  min={0}
                  max={30}
                  step={5}
                  unit="%"
                  onChange={setDiscountRate}
                  helperText="Promotional re-engagement coupon"
                  deltaBadge={{
                    text: `${discountRate}% off`,
                    isPositive: true,
                  }}
                />

                {/* Live Output Delta Comparison Card */}
                <div className="p-4 rounded-xl bg-[hsla(222,45%,9%,0.8)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono">
                    <span>BASELINE: P(CHURN) 72%</span>
                    <span>SIMULATED OUTCOME</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-[var(--text-secondary)] block">
                        Simulated Churn Risk:
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="font-display text-2xl font-bold">
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
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-[var(--text-secondary)] block">
                        Net Revenue Protected:
                      </span>
                      <span className="font-display text-2xl font-bold text-gradient-emerald mt-1 block">
                        R$ {protectedRevenue.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[var(--text-secondary)] italic border-t border-[hsla(217,33%,25%,0.3)] pt-2 mt-2">
                    {deltaChurn < 0 ? (
                      <>
                        Simulated intervention reduces churn probability by{' '}
                        <strong className="text-[var(--accent-emerald)]">
                          {(Math.abs(deltaChurn) * 100).toFixed(1)}%
                        </strong>
                        , shifting customer into a safer retention tier.
                      </>
                    ) : (
                      'No positive intervention applied yet.'
                    )}
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Right: RFM Segmentation & Prescriptive Playbooks Overview */}
          <div className="lg:col-span-5 space-y-6">
            <GlassCard
              title="RFM Customer Segments (11 Canonical Cohorts)"
              subtitle="Quintile scoring (R, F, M: 1–5) based on Olist transaction percentiles"
            >
              <div className="flex flex-wrap gap-2 mt-2">
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

              <div className="mt-5 p-3.5 rounded-lg bg-[hsla(222,40%,14%,0.6)] border border-[var(--border-subtle)] space-y-1.5 text-xs">
                <div className="flex justify-between font-medium">
                  <span className="text-primary">VIP Retention Priority 1:</span>
                  <span className="text-[var(--accent-crimson)] font-mono">R$ 412,800 at risk</span>
                </div>
                <p className="text-[var(--text-muted)] text-[11px]">
                  Champions and Loyal accounts currently exhibiting P(Churn) &ge; 70% requiring immediate executive outreach.
                </p>
              </div>
            </GlassCard>

            <GlassCard
              title="Data Pipeline & Observability Engine"
              subtitle="Real-time storage verification and health checks"
              headerAction={<span className="pulse-dot pulse-dot-emerald"></span>}
            >
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-[hsla(217,33%,25%,0.3)]">
                  <span className="text-[var(--text-secondary)]">Database Latency:</span>
                  <span className="font-mono text-[var(--accent-emerald)] font-semibold">
                    42 ms (Neon PostgreSQL 16)
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[hsla(217,33%,25%,0.3)]">
                  <span className="text-[var(--text-secondary)]">Raw Orders Ingested:</span>
                  <span className="font-mono text-primary font-semibold">100,000+ rows</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[hsla(217,33%,25%,0.3)]">
                  <span className="text-[var(--text-secondary)]">dbt Mart Analytics:</span>
                  <span className="font-mono text-[var(--accent-cyan)] font-semibold">
                    mart_customer_metrics (Fresh)
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[var(--text-secondary)]">Churn Model Artifact:</span>
                  <span className="font-mono text-[var(--accent-violet)] font-semibold">
                    churn_model.joblib (1.2 MB)
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Phased Roadmap Progress Indicator */}
        <section className="p-5 rounded-2xl bg-[hsla(222,40%,12%,0.5)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[hsla(158,64%,52%,0.15)] border border-[var(--border-emerald)] flex items-center justify-center text-[var(--accent-emerald)]">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="font-display font-semibold text-sm text-primary">
                Phase 1 Complete: Project Scaffold & Design System Tokens
              </h4>
              <p className="text-xs text-[var(--text-muted)]">
                Next up: Phase 2 — Strongly-Typed API Client & Offline Mock Engine
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('/docs/roadmap.md', '_blank')}
            >
              View Full Roadmap
            </Button>
            <Button variant="primary" size="sm" icon={<ChevronRight size={14} />}>
              Proceed to Phase 2
            </Button>
          </div>
        </section>
      </main>

      {/* Executive Footer */}
      <footer className="border-t border-[var(--border-subtle)] px-6 py-4 text-center text-xs text-[var(--text-muted)] flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto w-full">
        <span>
          Mercury Platform &bull; Executive Customer Intelligence & Churn Analytics
        </span>
        <span className="mt-2 sm:mt-0 font-mono text-[11px]">
          TypeScript &bull; React 18 &bull; Vite 5 &bull; Recharts
        </span>
      </footer>
    </div>
  );
};

export default App;
