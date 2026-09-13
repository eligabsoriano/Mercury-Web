import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Flame,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { GlassCard, RiskTierBadge, Slider, Button } from '../components/common';
import { ModelTransparencyCard, CustomerHydrationCard } from '../components/simulator';
import {
  predictionsApi,
  type CounterfactualSimulationResponse,
  type ModelMetadataResponse,
} from '../api';

interface ChurnSimulatorViewProps {
  initialCustomerId?: string | null;
  onSelectCustomer?: (id: string | null) => void;
}

export const ChurnSimulatorView: React.FC<ChurnSimulatorViewProps> = ({
  initialCustomerId = null,
  onSelectCustomer,
}) => {
  // Customer Baseline Hydration
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    initialCustomerId || '8d50f5eadf502056fa2f144b30424d35'
  );

  // Operational Simulation Inputs (4 Core Dials + VIP Outreach)
  const [deliveryDelay, setDeliveryDelay] = useState<number>(-4);
  const [reviewScoreDelta, setReviewScoreDelta] = useState<number>(0.8);
  const [discountRate, setDiscountRate] = useState<number>(15);
  const [orderFrequencyDelta, setOrderFrequencyDelta] = useState<number>(1);
  const [supportOutreach, setSupportOutreach] = useState<boolean>(true);

  // Asynchronous Result & Telemetry
  const [simulationResult, setSimulationResult] =
    useState<CounterfactualSimulationResponse | null>(null);
  const [modelMeta, setModelMeta] = useState<ModelMetadataResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isLoadingMeta, setIsLoadingMeta] = useState(false);

  // Sync prop changes
  useEffect(() => {
    if (initialCustomerId !== undefined && initialCustomerId !== null) {
      setSelectedCustomerId(initialCustomerId);
    }
  }, [initialCustomerId]);

  // Load Model Specs
  useEffect(() => {
    setIsLoadingMeta(true);
    predictionsApi
      .getModelInfo()
      .then((meta) => {
        setModelMeta(meta);
      })
      .catch(console.error)
      .finally(() => setIsLoadingMeta(false));
  }, []);

  const handleSelectCustomer = (id: string | null) => {
    setSelectedCustomerId(id);
    if (onSelectCustomer) {
      onSelectCustomer(id);
    }
  };

  // Debounced Simulation Execution
  const abortControllerRef = useRef<AbortController | null>(null);

  const runSimulation = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsSimulating(true);
    try {
      const res = await predictionsApi.simulate({
        customer_unique_id: selectedCustomerId || undefined,
        adjustments: {
          avg_delivery_delay_days: deliveryDelay,
          avg_review_score: reviewScoreDelta,
          discount_rate: discountRate,
          order_frequency_delta: orderFrequencyDelta,
          proactive_outreach: supportOutreach ? 1 : 0,
        } as unknown as Record<string, never>,
      });
      setSimulationResult(res);
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        console.error('Simulation error:', err);
      }
    } finally {
      setIsSimulating(false);
    }
  }, [
    selectedCustomerId,
    deliveryDelay,
    reviewScoreDelta,
    discountRate,
    orderFrequencyDelta,
    supportOutreach,
  ]);

  // 300ms Debounce Timer
  useEffect(() => {
    const timer = setTimeout(runSimulation, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [runSimulation]);

  // Preset Handlers
  const handleResetDials = () => {
    setDeliveryDelay(0);
    setReviewScoreDelta(0);
    setDiscountRate(0);
    setOrderFrequencyDelta(0);
    setSupportOutreach(false);
  };

  const handleOptimalPreset = () => {
    setDeliveryDelay(-5);
    setReviewScoreDelta(1.2);
    setDiscountRate(20);
    setOrderFrequencyDelta(2);
    setSupportOutreach(true);
  };

  const handleLogisticsCrisisPreset = () => {
    setDeliveryDelay(7);
    setReviewScoreDelta(-1.5);
    setDiscountRate(0);
    setOrderFrequencyDelta(-1);
    setSupportOutreach(false);
  };

  const handleWinBackPreset = () => {
    setDeliveryDelay(-3);
    setReviewScoreDelta(0.8);
    setDiscountRate(30);
    setOrderFrequencyDelta(1);
    setSupportOutreach(true);
  };

  // Metrics Extraction
  const baselineChurn = simulationResult?.baseline.churn_probability ?? 0.74;
  const simulatedChurn = simulationResult?.simulated.churn_probability ?? 0.38;
  const deltaChurn =
    simulationResult?.delta_churn_probability ??
    Number((simulatedChurn - baselineChurn).toFixed(3));
  const baselineExposure = simulationResult?.baseline.revenue_at_risk ?? 1850.0;
  const simulatedExposure = simulationResult?.simulated.revenue_at_risk ?? 703.0;
  const deltaRevenue =
    simulationResult?.delta_revenue_at_risk ??
    Number((simulatedExposure - baselineExposure).toFixed(2));
  const savedRevenue = Math.max(0, -deltaRevenue);

  const baselineRiskTier = simulationResult?.baseline.risk_tier ?? 'High';
  const simulatedRiskTier = simulationResult?.simulated.risk_tier ?? 'Medium';
  const baselinePriority =
    simulationResult?.baseline.retention_priority ?? 'Priority 1 (VIP Retention)';
  const simulatedPriority =
    simulationResult?.simulated.retention_priority ?? 'Priority 3 (Win-Back)';

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(139,92,246,0.12)] border border-[rgba(139,92,246,0.3)] text-xs font-mono text-[#d8b4fe]">
            <Sliders size={13} className="text-[#c084fc]" />
            <span className="uppercase tracking-wider font-semibold">
              Counterfactual Inference Engine
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2 text-white">
            ML Churn Scoring &amp; What-If Simulation Lab
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Simulate the marginal impact of carrier transit adjustments, customer satisfaction
            recovery, order frequency shifts, and targeted promotional vouchers against
            HistGradientBoosting decision boundaries.
          </p>
        </div>

        {/* Action Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw size={13} />}
            onClick={handleResetDials}
            title="Set all dials to zero adjustment"
          >
            Reset
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<AlertTriangle size={13} className="text-[#fbbf24]" />}
            onClick={handleLogisticsCrisisPreset}
            title="Simulate +7 days carrier delay & negative reviews"
          >
            Logistics Crisis
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Flame size={13} className="text-[#f43f5e]" />}
            onClick={handleWinBackPreset}
            title="Aggressive discount and win-back intervention"
          >
            Win-Back Push
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Sparkles size={13} />}
            onClick={handleOptimalPreset}
            title="Balanced expedited delivery and concierge outreach"
          >
            Optimal Preset
          </Button>
        </div>
      </section>

      {/* Customer Hydration Card */}
      <CustomerHydrationCard
        selectedCustomerId={selectedCustomerId}
        onSelectCustomerId={handleSelectCustomer}
        onHydrateBaseline={() => runSimulation()}
      />

      {/* Main Simulation Laboratory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Operational Dials */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard
            title="Operational Intervention Dials"
            subtitle="Adjust counterfactual parameters to recompute ML inference with 300ms debounce"
            glow="violet"
            headerAction={
              isSimulating ? (
                <span className="text-xs font-mono text-[#c084fc] flex items-center space-x-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#c084fc]" />
                  <span>Computing...</span>
                </span>
              ) : null
            }
          >
            <div className="space-y-6 mt-4">
              {/* Dial 1: Carrier Delivery Delay */}
              <Slider
                label="Carrier Delivery Delay Adjustment"
                value={deliveryDelay}
                min={-10}
                max={10}
                step={1}
                unit="days"
                onChange={setDeliveryDelay}
                helperText="Negative values reflect expedited carrier delivery; positive values simulate logistical delays."
                deltaBadge={{
                  text:
                    deliveryDelay <= 0
                      ? `${deliveryDelay} days transit`
                      : `+${deliveryDelay} days delay`,
                  isPositive: deliveryDelay <= 0,
                }}
              />

              {/* Dial 2: Customer Review Score Shift */}
              <Slider
                label="Customer Review Score Shift"
                value={reviewScoreDelta}
                min={-2}
                max={2}
                step={0.5}
                unit="★"
                onChange={setReviewScoreDelta}
                helperText="Simulated effect of proactive outreach resolving order dissatisfaction."
                deltaBadge={{
                  text: `${reviewScoreDelta >= 0 ? '+' : ''}${reviewScoreDelta} Stars`,
                  isPositive: reviewScoreDelta >= 0,
                }}
              />

              {/* Dial 3: Retention Discount Incentive */}
              <Slider
                label="Retention Discount Incentive"
                value={discountRate}
                min={0}
                max={30}
                step={5}
                unit="%"
                onChange={setDiscountRate}
                helperText="Promotional voucher applied to customer's high-frequency category."
                deltaBadge={{
                  text: `${discountRate}% promotional voucher`,
                  isPositive: true,
                }}
              />

              {/* Dial 4: Order Frequency Delta */}
              <Slider
                label="Order Cadence / Frequency Delta"
                value={orderFrequencyDelta}
                min={-2}
                max={5}
                step={1}
                unit="orders"
                onChange={setOrderFrequencyDelta}
                helperText="Projected change in lifetime order count over the next 90 days."
                deltaBadge={{
                  text:
                    orderFrequencyDelta >= 0
                      ? `+${orderFrequencyDelta} orders`
                      : `${orderFrequencyDelta} orders`,
                  isPositive: orderFrequencyDelta >= 0,
                }}
              />

              {/* Dial 5: Proactive Support Outreach Toggle */}
              <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    VIP Concierge Support Outreach
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">
                    Direct phone / WhatsApp intervention from senior account manager
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSupportOutreach((prev) => !prev)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    supportOutreach ? 'bg-[#8b5cf6]' : 'bg-[rgba(255,255,255,0.15)]'
                  }`}
                  aria-label="Toggle VIP Concierge Support Outreach"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      supportOutreach ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Column: Comparative Outcome Visualizer & Transition Cards */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard
            title="Comparative Counterfactual Outcome"
            subtitle="Probabilistic delta before and after simulated operational levers"
            glow={deltaChurn <= 0 ? 'emerald' : 'crimson'}
          >
            <div className="space-y-5 mt-3">
              {/* Before-and-After Comparison Canvas */}
              <div className="p-5 rounded-2xl bg-[rgba(11,16,28,0.75)] border border-[rgba(255,255,255,0.09)] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
                  <span className="tracking-wider">BASELINE (STATUS QUO)</span>
                  <ArrowRight size={14} className="text-[#a78bfa] animate-pulse" />
                  <span
                    className={`font-bold tracking-wider ${
                      deltaChurn <= 0 ? 'text-[#34d399]' : 'text-[#f43f5e]'
                    }`}
                  >
                    PROJECTED SIMULATION
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  {/* Baseline Column */}
                  <div>
                    <span className="text-xs text-[var(--text-muted)] block">Baseline Risk:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-display text-3xl font-bold opacity-60">
                        {(baselineChurn * 100).toFixed(0)}%
                      </span>
                      <RiskTierBadge tier={baselineRiskTier} probability={baselineChurn} />
                    </div>
                    <span className="text-xs font-mono text-[var(--text-muted)] mt-1 block">
                      R$ {baselineExposure.toFixed(2)} exposure
                    </span>
                  </div>

                  {/* Projected Column */}
                  <div className="text-right">
                    <span className="text-xs text-[var(--text-muted)] block">
                      Projected Outcome:
                    </span>
                    <div className="flex items-center justify-end space-x-2 mt-1">
                      <span
                        className={`font-display text-3xl font-black ${
                          deltaChurn <= 0 ? 'text-[#34d399]' : 'text-[#f43f5e]'
                        }`}
                      >
                        {(simulatedChurn * 100).toFixed(1)}%
                      </span>
                      <RiskTierBadge tier={simulatedRiskTier} probability={simulatedChurn} />
                    </div>
                    <span
                      className={`text-xs font-mono font-bold mt-1 block ${
                        deltaRevenue <= 0 ? 'text-[#34d399]' : 'text-[#f43f5e]'
                      }`}
                    >
                      {deltaRevenue <= 0
                        ? `Protected: +R$ ${savedRevenue.toFixed(2)}`
                        : `Increased Risk: R$ ${simulatedExposure.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Net Risk Reduction Badge Bar */}
                <div
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                    deltaChurn <= 0
                      ? 'bg-[rgba(52,211,153,0.1)] border-[rgba(52,211,153,0.3)] text-[#34d399]'
                      : 'bg-[rgba(244,63,94,0.1)] border-[rgba(244,63,94,0.3)] text-[#f43f5e]'
                  }`}
                >
                  <span className="font-semibold">
                    {deltaChurn <= 0 ? 'Net Churn Risk Mitigation:' : 'Net Churn Risk Elevation:'}
                  </span>
                  <span className="font-mono font-bold text-base">
                    {deltaChurn <= 0 ? '' : '+'}
                    {(deltaChurn * 100).toFixed(1)}%
                  </span>
                </div>

                {/* Transition Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono pt-1">
                  <div className="p-2.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">
                      Risk Tier Transition
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-white font-semibold">{baselineRiskTier}</span>
                      <ArrowRight size={11} className="text-[#a78bfa]" />
                      <span
                        className={
                          simulatedRiskTier === 'Low'
                            ? 'text-[#34d399] font-bold'
                            : simulatedRiskTier === 'Medium'
                            ? 'text-[#fbbf24] font-bold'
                            : 'text-[#f43f5e] font-bold'
                        }
                      >
                        {simulatedRiskTier}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                    <span className="text-[10px] text-[var(--text-muted)] block">
                      Retention Priority Transition
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1 text-[11px] truncate">
                      <span className="text-[var(--text-secondary)] truncate">
                        {baselinePriority.split(' ')[0]} {baselinePriority.split(' ')[1]}
                      </span>
                      <ArrowRight size={11} className="text-[#a78bfa] shrink-0" />
                      <span className="text-[#38bdf8] font-bold truncate">
                        {simulatedPriority.split(' ')[0]} {simulatedPriority.split(' ')[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prescriptive Natural Language Impact Summary */}
                <div className="text-xs text-[var(--text-secondary)] border-t border-[rgba(255,255,255,0.06)] pt-3 flex items-start space-x-2.5">
                  <Sparkles size={15} className="text-[#a78bfa] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-white">Executive Assessment: </strong>
                    {simulationResult?.impact_summary ??
                      `Adjusting operational dials projects a ${Math.abs(deltaChurn * 100).toFixed(
                        1
                      )}% change in churn probability, protecting portfolio customer equity.`}
                  </p>
                </div>
              </div>

              {/* Fast Recommendation Banner */}
              <div className="p-3.5 rounded-xl bg-[rgba(139,92,246,0.06)] border border-[rgba(139,92,246,0.2)] flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2 text-[var(--text-secondary)]">
                  <CheckCircle size={14} className="text-[#34d399]" />
                  <span>
                    Optimal save threshold: <strong className="text-white">35% discount ceiling</strong>
                  </span>
                </div>
                <span className="text-[10px] text-[#a78bfa] flex items-center space-x-1">
                  <HelpCircle size={11} />
                  <span>ROI Constrained</span>
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Model Transparency & Algorithmic Guardrails Card */}
      <ModelTransparencyCard metadata={modelMeta} loading={isLoadingMeta} />
    </div>
  );
};
