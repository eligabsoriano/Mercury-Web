import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
} from 'lucide-react';
import { GlassCard, Slider } from '../common';
import {
  retentionApi,
  type CampaignSimulationResult,
  type RetentionPlaybook,
} from '../../api';

interface CampaignROICalculatorProps {
  playbooks: RetentionPlaybook[];
  preselectedPlaybook?: RetentionPlaybook | null;
}

export const CampaignROICalculator: React.FC<CampaignROICalculatorProps> = ({
  playbooks,
  preselectedPlaybook,
}) => {
  // Input Controls
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string>('custom');
  const [targetCustomerCount, setTargetCustomerCount] = useState<number>(1000);
  const [costPerCustomer, setCostPerCustomer] = useState<number>(25.0);
  const [expectedSaveRate, setExpectedSaveRate] = useState<number>(25); // as percentage 25%
  const [targetRevenueAtRisk, setTargetRevenueAtRisk] = useState<number>(250000);

  // Result & Loading
  const [simulationResult, setSimulationResult] = useState<CampaignSimulationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Sync external preselected playbook
  useEffect(() => {
    if (preselectedPlaybook) {
      setSelectedPlaybookId(preselectedPlaybook.playbook_id);
      setCostPerCustomer(preselectedPlaybook.default_cost_per_customer);
      setExpectedSaveRate(
        Math.round(((preselectedPlaybook.estimated_save_rate_min + preselectedPlaybook.estimated_save_rate_max) / 2) * 100)
      );
    }
  }, [preselectedPlaybook]);

  // Handle Playbook Selection Dropdown
  const handlePlaybookChange = (id: string) => {
    setSelectedPlaybookId(id);
    if (id === 'custom') return;

    const pb = playbooks.find((p) => p.playbook_id === id);
    if (pb) {
      setCostPerCustomer(pb.default_cost_per_customer);
      const avgSaveRate = Math.round(
        ((pb.estimated_save_rate_min + pb.estimated_save_rate_max) / 2) * 100
      );
      setExpectedSaveRate(avgSaveRate);
    }
  };

  // Debounced API Request
  const abortControllerRef = useRef<AbortController | null>(null);

  const calculateROI = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsCalculating(true);
    try {
      const res = await retentionApi.simulateROI({
        playbook_id: selectedPlaybookId !== 'custom' ? selectedPlaybookId : undefined,
        target_customer_count: targetCustomerCount,
        cost_per_customer: costPerCustomer,
        expected_save_rate: expectedSaveRate / 100,
        target_revenue_at_risk: targetRevenueAtRisk,
      });
      setSimulationResult(res);
    } catch (err) {
      if ((err as Error)?.name !== 'AbortError') {
        console.error('Campaign simulation error:', err);
      }
    } finally {
      setIsCalculating(false);
    }
  }, [
    selectedPlaybookId,
    targetCustomerCount,
    costPerCustomer,
    expectedSaveRate,
    targetRevenueAtRisk,
  ]);

  useEffect(() => {
    const timer = setTimeout(calculateROI, 300);
    return () => clearTimeout(timer);
  }, [calculateROI]);

  const totalCost = simulationResult?.total_campaign_cost ?? targetCustomerCount * costPerCustomer;
  const grossSaved =
    simulationResult?.gross_revenue_saved ?? targetRevenueAtRisk * (expectedSaveRate / 100);
  const netSaved = simulationResult?.net_saved_value ?? grossSaved - totalCost;
  const isProfitable = simulationResult?.is_profitable ?? netSaved > 0;
  const roi = simulationResult?.roi_percentage ?? (totalCost > 0 ? (netSaved / totalCost) * 100 : 0);
  const breakEvenRate =
    simulationResult?.break_even_save_rate ??
    (targetRevenueAtRisk > 0 ? totalCost / targetRevenueAtRisk : 0);
  const efficiency =
    simulationResult?.capital_efficiency_multiplier ?? (totalCost > 0 ? grossSaved / totalCost : 0);
  const projectedSaved =
    simulationResult?.projected_customers_saved ??
    Math.round(targetCustomerCount * (expectedSaveRate / 100));

  return (
    <GlassCard
      title="Campaign ROI & Financial Economics Simulator"
      subtitle="Model marginal financial return, break-even save rates, and net value creation before committing capital"
      glow="cyan"
      headerAction={
        isCalculating ? (
          <span className="text-xs font-mono text-sky-600 animate-pulse">
            Recomputing ROI...
          </span>
        ) : (
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-bold">
            POST /api/retention/campaigns/simulate-roi
          </span>
        )
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-3">
        {/* Left: Input Parameters (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Playbook Preset Dropdown */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label
              htmlFor="playbook-select"
              className="text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold block flex items-center space-x-1.5"
            >
              <Calculator size={13} className="text-sky-600" />
              <span>Intervention Strategy Baseline:</span>
            </label>
            <select
              id="playbook-select"
              value={selectedPlaybookId}
              onChange={(e) => handlePlaybookChange(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-sky-500 transition-colors shadow-xs"
            >
              <option value="custom">Custom Campaign Configuration</option>
              {playbooks.map((pb) => (
                <option key={pb.playbook_id} value={pb.playbook_id}>
                  {pb.name} (R$ {pb.default_cost_per_customer}/cust)
                </option>
              ))}
            </select>
          </div>

          {/* Sliders */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-5">
            <Slider
              label="Targeted Customer Count"
              value={targetCustomerCount}
              min={100}
              max={10000}
              step={100}
              unit="accounts"
              onChange={setTargetCustomerCount}
              helperText="Number of at-risk accounts enrolled in this specific intervention."
              deltaBadge={{
                text: `${targetCustomerCount.toLocaleString()} customers`,
                isPositive: true,
              }}
            />

            <Slider
              label="Intervention Cost Per Customer"
              value={costPerCustomer}
              min={1}
              max={100}
              step={1}
              unit="BRL"
              onChange={(val) => {
                setCostPerCustomer(val);
                setSelectedPlaybookId('custom');
              }}
              helperText="Outreach expense, discount incentive, or account manager overhead per targeted account."
              deltaBadge={{
                text: `R$ ${costPerCustomer.toFixed(2)}`,
                isPositive: true,
              }}
            />

            <Slider
              label="Expected Save Rate"
              value={expectedSaveRate}
              min={1}
              max={50}
              step={1}
              unit="%"
              onChange={(val) => {
                setExpectedSaveRate(val);
                setSelectedPlaybookId('custom');
              }}
              helperText="Projected percentage of targeted accounts retained who make a subsequent order."
              deltaBadge={{
                text: `${expectedSaveRate}% save rate`,
                isPositive: true,
              }}
            />

            <Slider
              label="Target Revenue at Risk"
              value={targetRevenueAtRisk}
              min={10000}
              max={1000000}
              step={10000}
              unit="BRL"
              onChange={setTargetRevenueAtRisk}
              helperText="Total cumulative gross revenue at risk across all targeted accounts."
              deltaBadge={{
                text: `R$ ${targetRevenueAtRisk.toLocaleString()}`,
                isPositive: true,
              }}
            />
          </div>
        </div>

        {/* Right: Real-time Economic Outcome Scorecard (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500">
              <span>FINANCIAL PERFORMANCE FORECAST</span>
              <span
                className={`px-2.5 py-0.5 rounded-full font-bold flex items-center space-x-1 ${
                  isProfitable
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {isProfitable ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                <span>{isProfitable ? 'Profitable Campaign' : 'Unfavorable Economics'}</span>
              </span>
            </div>

            {/* Big Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div>
                <span className="text-xs text-slate-500 block flex items-center space-x-1">
                  <DollarSign size={12} className="text-amber-500" />
                  <span>Total Campaign Cost</span>
                </span>
                <span className="font-display text-2xl font-black text-slate-900 mt-1 block">
                  R$ {totalCost.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
                  R$ {costPerCustomer.toFixed(2)} × {targetCustomerCount.toLocaleString()} cust
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block flex items-center space-x-1">
                  <TrendingUp size={12} className="text-emerald-600" />
                  <span>Gross Protected GMV</span>
                </span>
                <span className="font-display text-2xl font-black text-emerald-600 mt-1 block">
                  R$ {grossSaved.toLocaleString()}
                </span>
                <span className="text-[10px] font-mono text-emerald-700 mt-0.5 block font-medium">
                  {projectedSaved.toLocaleString()} accounts saved
                </span>
              </div>
            </div>

            {/* Net Economic Gain Banner */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
                isProfitable
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-rose-50 border-rose-200'
              }`}
            >
              <div>
                <span className="text-slate-600 block text-[10px] uppercase">
                  Net Value Created
                </span>
                <span
                  className={`font-display text-2xl font-black ${
                    isProfitable ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {netSaved >= 0 ? `+R$ ${netSaved.toLocaleString()}` : `-R$ ${Math.abs(netSaved).toLocaleString()}`}
                </span>
              </div>

              <div className="text-right">
                <span className="text-slate-600 block text-[10px] uppercase">
                  Net ROI
                </span>
                <span
                  className={`font-display text-2xl font-black ${
                    isProfitable ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {roi >= 0 ? `+${roi.toFixed(1)}%` : `${roi.toFixed(1)}%`}
                </span>
              </div>
            </div>

            {/* Break-Even & Efficiency Secondary Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block flex items-center space-x-1">
                  <Scale size={11} className="text-sky-600" />
                  <span>Break-Even Save Rate</span>
                </span>
                <span className="text-slate-900 font-bold text-base mt-0.5 block">
                  {(breakEvenRate * 100).toFixed(2)}%
                </span>
                <span className="text-[9px] text-slate-400">
                  Required to prevent net loss
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block flex items-center space-x-1">
                  <Percent size={11} className="text-violet-600" />
                  <span>Capital Efficiency Multiplier</span>
                </span>
                <span className="text-violet-700 font-bold text-base mt-0.5 block">
                  {efficiency.toFixed(2)}x
                </span>
                <span className="text-[9px] text-slate-400">
                  GMV protected per BRL spent
                </span>
              </div>
            </div>

            {/* Executive Recommendation Banner */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start space-x-2 text-xs">
              <Sparkles size={14} className="text-sky-600 shrink-0 mt-0.5" />
              <p className="text-slate-600 leading-relaxed">
                <strong className="text-slate-900 font-semibold">Executive Assessment: </strong>
                {simulationResult?.recommendation ??
                  (isProfitable
                    ? `Highly attractive deployment: Yields ${roi.toFixed(1)}% Net ROI with ${efficiency.toFixed(2)}x capital multiplier.`
                    : `Unfavorable: Intervention cost exceeds expected saved GMV. Requires minimum save rate of ${(breakEvenRate * 100).toFixed(1)}% to break even.`)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
