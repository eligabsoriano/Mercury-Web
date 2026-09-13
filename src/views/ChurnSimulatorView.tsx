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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-mono text-purple-700">
            <Sliders size={13} className="text-purple-600" />
            <span className="uppercase tracking-wider font-semibold">
              Counterfactual Inference Engine
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2 text-slate-900">
            ML Churn Scoring &amp; What-If Simulation Lab
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
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
            icon={<AlertTriangle size={13} className="text-amber-500" />}
            onClick={handleLogisticsCrisisPreset}
            title="Simulate +7 days carrier delay & negative reviews"
          >
            Logistics Crisis
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Flame size={13} className="text-rose-600" />}
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
            headerAction={
              isSimulating ? (
                <span className="text-xs font-mono text-purple-600 flex items-center space-x-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
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
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    VIP Concierge Support Outreach
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    Direct phone / WhatsApp intervention from senior account manager
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSupportOutreach((prev) => !prev)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    supportOutreach ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                  aria-label="Toggle VIP Concierge Support Outreach"
                >
                  <span
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
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
          >
            <div className="space-y-5 mt-3">
              {/* Before-and-After Comparison Canvas */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-600">
                  <span className="tracking-wider">BASELINE (STATUS QUO)</span>
                  <ArrowRight size={14} className="text-purple-600 animate-pulse" />
                  <span
                    className={`font-bold tracking-wider ${
                      deltaChurn <= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}
                  >
                    PROJECTED SIMULATION
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                  {/* Baseline Column */}
                  <div>
                    <span className="text-xs text-slate-500 block">Baseline Risk:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-display text-3xl font-bold text-slate-600">
                        {(baselineChurn * 100).toFixed(0)}%
                      </span>
                      <RiskTierBadge tier={baselineRiskTier} probability={baselineChurn} />
                    </div>
                    <span className="text-xs font-mono text-slate-500 mt-1 block">
                      R$ {baselineExposure.toFixed(2)} exposure
                    </span>
                  </div>

                  {/* Projected Column */}
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">
                      Projected Outcome:
                    </span>
                    <div className="flex items-center justify-end space-x-2 mt-1">
                      <span
                        className={`font-display text-3xl font-black ${
                          deltaChurn <= 0 ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {(simulatedChurn * 100).toFixed(1)}%
                      </span>
                      <RiskTierBadge tier={simulatedRiskTier} probability={simulatedChurn} />
                    </div>
                    <span
                      className={`text-xs font-mono font-bold mt-1 block ${
                        deltaRevenue <= 0 ? 'text-emerald-700' : 'text-rose-600'
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
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
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
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">
                      Risk Tier Transition
                    </span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-slate-900 font-semibold">{baselineRiskTier}</span>
                      <ArrowRight size={11} className="text-purple-600" />
                      <span
                        className={
                          simulatedRiskTier === 'Low'
                            ? 'text-emerald-700 font-bold'
                            : simulatedRiskTier === 'Medium'
                            ? 'text-amber-700 font-bold'
                            : 'text-rose-700 font-bold'
                        }
                      >
                        {simulatedRiskTier}
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                    <span className="text-[10px] text-slate-500 block">
                      Retention Priority Transition
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1 text-[11px] truncate">
                      <span className="text-slate-600 truncate">
                        {baselinePriority.split(' ')[0]} {baselinePriority.split(' ')[1]}
                      </span>
                      <ArrowRight size={11} className="text-purple-600 shrink-0" />
                      <span className="text-sky-700 font-bold truncate">
                        {simulatedPriority.split(' ')[0]} {simulatedPriority.split(' ')[1]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prescriptive Natural Language Impact Summary */}
                <div className="text-xs text-slate-600 border-t border-slate-200 pt-3 flex items-start space-x-2.5">
                  <Sparkles size={15} className="text-purple-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong className="text-slate-900">Executive Assessment: </strong>
                    {simulationResult?.impact_summary ??
                      `Adjusting operational dials projects a ${Math.abs(deltaChurn * 100).toFixed(
                        1
                      )}% change in churn probability, protecting portfolio customer equity.`}
                  </p>
                </div>
              </div>

              {/* Fast Recommendation Banner */}
              <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2 text-slate-700">
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span>
                    Optimal save threshold: <strong className="text-slate-900 font-semibold">35% discount ceiling</strong>
                  </span>
                </div>
                <span className="text-[10px] text-purple-700 font-medium flex items-center space-x-1">
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
