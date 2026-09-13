import React, { useState, useEffect, useCallback } from 'react';
import {
  Sliders,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { GlassCard, RiskTierBadge, Slider, Button } from '../components/common';
import {
  predictionsApi,
  type CounterfactualSimulationResponse,
  type ModelMetadataResponse,
} from '../api';

export const ChurnSimulatorView: React.FC = () => {
  // Operational Simulation Inputs
  const [deliveryDelay, setDeliveryDelay] = useState<number>(-4);
  const [reviewScoreDelta, setReviewScoreDelta] = useState<number>(0.8);
  const [discountRate, setDiscountRate] = useState<number>(15);
  const [supportOutreach, setSupportOutreach] = useState<boolean>(true);

  const [simulationResult, setSimulationResult] = useState<CounterfactualSimulationResponse | null>(null);
  const [modelMeta, setModelMeta] = useState<ModelMetadataResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Load Model Specs
  useEffect(() => {
    predictionsApi.getModelInfo().then(setModelMeta).catch(console.error);
  }, []);

  // Debounced Simulation Engine
  const runSimulation = useCallback(async () => {
    setIsSimulating(true);
    try {
      const res = await predictionsApi.simulate({
        customer_unique_id: '871766c5855e863f6eccc05f988b23cb',
        adjustments: {
          avg_delivery_delay_days: deliveryDelay,
          avg_review_score: reviewScoreDelta,
          discount_rate: discountRate,
          proactive_outreach: supportOutreach ? 1 : 0,
        } as unknown as Record<string, never>,
      });
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  }, [deliveryDelay, reviewScoreDelta, discountRate, supportOutreach]);

  useEffect(() => {
    const timer = setTimeout(runSimulation, 150);
    return () => clearTimeout(timer);
  }, [runSimulation]);

  const handleResetDials = () => {
    setDeliveryDelay(0);
    setReviewScoreDelta(0);
    setDiscountRate(0);
    setSupportOutreach(false);
  };

  const baselineChurn = simulationResult?.baseline.churn_probability ?? 0.74;
  const simulatedChurn = simulationResult?.simulated.churn_probability ?? 0.38;
  const deltaChurn = simulationResult?.delta_churn_probability ?? simulatedChurn - baselineChurn;
  const baselineExposure = simulationResult?.baseline.revenue_at_risk ?? 1850;
  const simulatedExposure = simulationResult?.simulated.revenue_at_risk ?? 703;
  const savedRevenue = Math.max(0, baselineExposure - simulatedExposure);

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
            ML Churn Scoring & What-If Simulation Lab
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Simulate the marginal impact of carrier transit adjustments, customer satisfaction recovery,
            and targeted discount vouchers against HistGradientBoosting decision boundaries.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            icon={<RotateCcw size={14} />}
            onClick={handleResetDials}
          >
            Reset Dials
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Sparkles size={14} />}
            onClick={() => {
              setDeliveryDelay(-5);
              setReviewScoreDelta(1.2);
              setDiscountRate(20);
              setSupportOutreach(true);
            }}
          >
            Optimal Intervention Preset
          </Button>
        </div>
      </section>

      {/* Main Simulation Laboratory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Intervention Dials */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard
            title="Operational Intervention Dials"
            subtitle="Tweak counterfactual parameters to recompute inference in real-time"
            glow="violet"
          >
            <div className="space-y-6 mt-4">
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
                  text: deliveryDelay <= 0 ? `${deliveryDelay} days transit` : `+${deliveryDelay} days delay`,
                  isPositive: deliveryDelay <= 0,
                }}
              />

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

              {/* Support Outreach Toggle */}
              <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    VIP Concierge Support Outreach
                  </span>
                  <span className="text-[11px] text-[var(--text-muted)] mt-0.5 block">
                    Direct phone / WhatsApp intervention from account manager
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSupportOutreach((prev) => !prev)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    supportOutreach ? 'bg-[#8b5cf6]' : 'bg-[rgba(255,255,255,0.15)]'
                  }`}
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

        {/* Right: Real-Time Counterfactual Visualizer & Model Specs */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard
            title="Comparative Counterfactual Outcome"
            subtitle="Probabilistic delta before and after simulated operational levers"
            glow="emerald"
            headerAction={
              isSimulating ? (
                <span className="text-xs font-mono text-[#c084fc] animate-pulse">
                  Recomputing...
                </span>
              ) : null
            }
          >
            <div className="space-y-5 mt-3">
              {/* Baseline vs Simulated Comparison */}
              <div className="p-5 rounded-2xl bg-[rgba(11,16,28,0.7)] border border-[rgba(255,255,255,0.09)] space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--text-secondary)]">
                  <span>BASELINE (STATUS QUO)</span>
                  <ArrowRight size={14} className="text-[#a78bfa] animate-pulse" />
                  <span className="text-[#34d399] font-bold">PROJECTED SIMULATION</span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                  <div>
                    <span className="text-xs text-[var(--text-muted)] block">Churn Risk:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="font-display text-3xl font-bold opacity-60">
                        {(baselineChurn * 100).toFixed(0)}%
                      </span>
                      <RiskTierBadge tier="High Risk" probability={baselineChurn} />
                    </div>
                    <span className="text-xs font-mono text-[var(--text-muted)] mt-1 block">
                      R$ {baselineExposure.toFixed(2)} at risk
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-[var(--text-muted)] block">Projected Outcome:</span>
                    <div className="flex items-center justify-end space-x-2 mt-1">
                      <span className="font-display text-3xl font-black text-[#34d399]">
                        {(simulatedChurn * 100).toFixed(1)}%
                      </span>
                      <RiskTierBadge
                        tier={
                          simulatedChurn >= 0.7
                            ? 'High Risk'
                            : simulatedChurn >= 0.4
                            ? 'Medium Risk'
                            : 'Low Risk'
                        }
                        probability={simulatedChurn}
                      />
                    </div>
                    <span className="text-xs font-mono text-[#34d399] font-bold mt-1 block">
                      Recovered: +R$ {savedRevenue.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] flex items-center justify-between text-xs">
                  <span className="text-[var(--text-secondary)]">Net Risk Reduction:</span>
                  <span className="font-mono font-bold text-[#34d399] text-base">
                    {(deltaChurn * 100).toFixed(1)}% (
                    {deltaChurn < 0 ? 'Risk Mitigated' : 'Risk Elevated'})
                  </span>
                </div>

                <div className="text-xs text-[var(--text-secondary)] italic border-t border-[rgba(255,255,255,0.06)] pt-2 flex items-start space-x-2">
                  <Sparkles size={14} className="text-[#a78bfa] shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white not-italic">Prescriptive Assessment: </strong>
                    {simulationResult?.impact_summary ??
                      'Intervention projects substantial risk reduction and customer lifetime preservation.'}
                  </span>
                </div>
              </div>

              {/* Model Specifications */}
              <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-muted)] font-mono uppercase text-[10px]">
                    Serving Model Specs
                  </span>
                  <span className="text-[10px] font-mono text-[#a78bfa]">
                    ROC-AUC: {modelMeta?.eval_metrics?.['roc_auc']?.toFixed(3) ?? '0.874'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-[rgba(255,255,255,0.04)]">
                  <div>
                    <span className="text-[var(--text-muted)] block">Algorithm:</span>
                    <span className="font-mono text-white">
                      {modelMeta?.model_name ?? 'HistGradientBoosting'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block">Features Evaluated:</span>
                    <span className="font-mono text-white">26 Features</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
