import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  UserCheck,
  MapPin,
  Calendar,
  DollarSign,
  ShoppingBag,
  Clock,
  Truck,
  Star,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Package,
} from 'lucide-react';
import { RiskTierBadge, SegmentBadge, PriorityBadge, Button } from '../common';
import {
  customersApi,
  retentionApi,
  type CustomerDetail,
  type CustomerPlaybookRecommendation,
  type ChurnPredictionResult,
} from '../../api';

export interface Customer360ModalProps {
  isOpen: boolean;
  customerId: string | null;
  onClose: () => void;
  onNavigateToSimulator?: (customerId: string) => void;
}

export const Customer360Modal: React.FC<Customer360ModalProps> = ({
  isOpen,
  customerId,
  onClose,
  onNavigateToSimulator,
}) => {
  const [detail, setDetail] = useState<CustomerDetail | null>(null);
  const [recommendation, setRecommendation] = useState<CustomerPlaybookRecommendation | null>(null);
  const [churnResult, setChurnResult] = useState<ChurnPredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'fulfillment' | 'recommendation'>('overview');

  // Fetch Customer 360 data
  const loadCustomerData = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const [detailRes, recRes, churnRes] = await Promise.all([
        customersApi.getDetail(id),
        retentionApi.getRecommendation(id).catch(() => null),
        customersApi.getChurn(id).catch(() => null),
      ]);
      setDetail(detailRes);
      setRecommendation(recRes);
      setChurnResult(churnRes);
    } catch (err) {
      console.error('Failed to load Customer 360 profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && customerId) {
      loadCustomerData(customerId);
    } else {
      setDetail(null);
      setRecommendation(null);
      setChurnResult(null);
      setActiveTab('overview');
    }
  }, [isOpen, customerId, loadCustomerData]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Copy Customer ID
  const handleCopyId = () => {
    if (!customerId) return;
    navigator.clipboard.writeText(customerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Copy Intervention Script
  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  if (!isOpen) return null;

  // Normalized Probability
  const churnProbRaw =
    churnResult?.churn_probability ?? detail?.churn?.churn_probability ?? 0.15;
  const churnProb = churnProbRaw > 1 ? churnProbRaw : churnProbRaw * 100;
  const riskTier = churnResult?.risk_tier ?? detail?.churn?.risk_tier ?? 'Low';
  const retentionPriority =
    churnResult?.retention_priority ?? detail?.churn?.retention_priority ?? 'Priority 4 (Baseline Operational)';
  const revenueAtRisk =
    churnResult?.revenue_at_risk ??
    detail?.churn?.revenue_at_risk ??
    ((churnProb / 100) * (detail?.lifetime_spend ?? 0));

  // Risk Color Scheme
  const isHighRisk = riskTier.toLowerCase().includes('high');
  const isMediumRisk = riskTier.toLowerCase().includes('medium');
  const riskColor = isHighRisk ? '#f43f5e' : isMediumRisk ? '#fbbf24' : '#34d399';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      aria-modal="true"
      role="dialog"
      aria-label="Customer 360 Profile"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[rgba(3,6,15,0.75)] backdrop-blur-md backdrop-fade-in transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Drawer Container */}
      <div className="relative w-full max-w-2xl bg-[linear-gradient(180deg,rgba(14,20,36,0.97)_0%,rgba(9,13,24,0.99)_100%)] border-l border-[rgba(255,255,255,0.12)] shadow-[0_0_70px_rgba(0,0,0,0.85)] z-10 flex flex-col h-full drawer-slide-in overflow-hidden">
        {/* Top Specular Edge */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* Header Bar */}
        <div className="p-6 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[rgba(139,92,246,0.15)] border border-[rgba(139,92,246,0.35)] flex items-center justify-center text-[#c084fc] shadow-[0_0_20px_rgba(139,92,246,0.25)] shrink-0">
              <UserCheck size={24} />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-[rgba(56,189,248,0.15)] text-[#7dd3fc] border border-[rgba(56,189,248,0.3)] font-semibold">
                  Customer 360
                </span>
                {detail?.is_repeat_buyer ? (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-[rgba(52,211,153,0.15)] text-[#6ee7b7] border border-[rgba(52,211,153,0.3)] font-semibold">
                    Repeat Buyer
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] border border-[rgba(255,255,255,0.15)]">
                    Single Order
                  </span>
                )}
                {detail?.rfm?.segment && <SegmentBadge segment={detail.rfm.segment} />}
              </div>

              {/* Customer ID & Copy */}
              <div className="flex items-center space-x-2 mt-1.5">
                <h2 className="font-mono text-base font-bold text-white tracking-tight truncate max-w-[280px] sm:max-w-[360px]">
                  {customerId}
                </h2>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1 rounded-md bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] text-[var(--text-secondary)] hover:text-white transition-all text-xs flex items-center space-x-1"
                  title="Copy Customer ID"
                >
                  {copiedId ? (
                    <>
                      <Check size={12} className="text-[#34d399]" />
                      <span className="text-[10px] text-[#34d399] font-mono">Copied</span>
                    </>
                  ) : (
                    <Copy size={12} />
                  )}
                </button>
              </div>

              {/* Geolocation & Recency */}
              <div className="flex items-center space-x-4 mt-1 text-xs text-[var(--text-secondary)] flex-wrap gap-y-1">
                <span className="flex items-center space-x-1">
                  <MapPin size={12} className="text-[var(--neon-cyan)]" />
                  <span className="capitalize">{detail?.city ?? 'São Paulo'}</span>,{' '}
                  <span className="font-mono font-bold text-white uppercase">{detail?.state ?? 'SP'}</span>
                  {detail?.zip_prefix && (
                    <span className="text-[var(--text-muted)] font-mono ml-1">({detail.zip_prefix})</span>
                  )}
                </span>
                <span className="flex items-center space-x-1">
                  <Clock size={12} className="text-[var(--neon-amber)]" />
                  <span>
                    {detail?.recency_days !== null && detail?.recency_days !== undefined
                      ? `${detail.recency_days} days recency`
                      : 'Active'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Customer 360 Drawer"
            className="p-2 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.1)] text-[var(--text-secondary)] hover:text-white transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* View Tabs */}
        <div className="px-6 border-b border-[rgba(255,255,255,0.08)] flex items-center space-x-6 bg-[rgba(0,0,0,0.2)]">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'text-white border-[#8b5cf6]'
                : 'text-[var(--text-secondary)] border-transparent hover:text-white'
            }`}
          >
            Churn Risk & RFM 360
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fulfillment')}
            className={`py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'fulfillment'
                ? 'text-white border-[#8b5cf6]'
                : 'text-[var(--text-secondary)] border-transparent hover:text-white'
            }`}
          >
            Basket & Fulfillment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('recommendation')}
            className={`py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 flex items-center space-x-1.5 ${
              activeTab === 'recommendation'
                ? 'text-white border-[#8b5cf6]'
                : 'text-[var(--text-secondary)] border-transparent hover:text-white'
            }`}
          >
            <Sparkles size={13} className="text-[#a78bfa]" />
            <span>Prescriptive Playbook</span>
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {isLoading ? (
            <div className="space-y-4 py-8">
              <div className="h-28 rounded-2xl bg-[rgba(255,255,255,0.03)] animate-pulse" />
              <div className="h-40 rounded-2xl bg-[rgba(255,255,255,0.03)] animate-pulse" />
              <div className="h-32 rounded-2xl bg-[rgba(255,255,255,0.03)] animate-pulse" />
            </div>
          ) : !detail ? (
            <div className="py-12 text-center text-[var(--text-muted)]">
              <AlertTriangle size={32} className="mx-auto mb-2 opacity-50" />
              <p>Customer profile data unavailable for ID: {customerId}</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW (Churn Risk & RFM Scorecard) */}
              {activeTab === 'overview' && (
                <>
                  {/* Top Key Financials */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                      <div className="flex items-center space-x-1.5 text-xs text-[var(--text-muted)]">
                        <DollarSign size={13} className="text-[#34d399]" />
                        <span>Lifetime Spend</span>
                      </div>
                      <div className="text-lg font-black font-display text-white mt-1">
                        R$ {detail.lifetime_spend.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        AOV: R$ {detail.avg_order_value.toFixed(2)}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                      <div className="flex items-center space-x-1.5 text-xs text-[var(--text-muted)]">
                        <ShoppingBag size={13} className="text-[#38bdf8]" />
                        <span>Completed Orders</span>
                      </div>
                      <div className="text-lg font-black font-display text-white mt-1">
                        {detail.lifetime_orders} {detail.lifetime_orders === 1 ? 'order' : 'orders'}
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {detail.is_repeat_buyer ? 'Returning Buyer' : 'First-Time Buyer'}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)]">
                      <div className="flex items-center space-x-1.5 text-xs text-[var(--text-muted)]">
                        <Calendar size={13} className="text-[#c084fc]" />
                        <span>Lifespan Tenure</span>
                      </div>
                      <div className="text-lg font-black font-display text-white mt-1">
                        {detail.customer_lifespan_days ?? 0} days
                      </div>
                      <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                        {detail.first_purchased_at
                          ? new Date(detail.first_purchased_at).toLocaleDateString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent'}
                      </div>
                    </div>
                  </div>

                  {/* Churn Risk Gauge Card */}
                  <div
                    className="p-5 rounded-2xl border relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, rgba(14,20,36,0.9) 0%, rgba(${
                        isHighRisk ? '244,63,94' : isMediumRisk ? '251,191,36' : '52,211,153'
                      },0.08) 100%)`,
                      borderColor: `rgba(${
                        isHighRisk ? '244,63,94' : isMediumRisk ? '251,191,36' : '52,211,153'
                      },0.35)`,
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <RiskTierBadge tier={riskTier} />
                          <PriorityBadge priority={retentionPriority} />
                        </div>
                        <h3 className="font-display font-bold text-lg text-white mt-2">
                          HistGradientBoosting Churn Risk
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5 max-w-sm">
                          Evaluated against 100k+ Olist transactions using recency, delivery delay, review sentiment, and freight burden.
                        </p>
                      </div>

                      {/* Radial Progress Gauge */}
                      <div className="flex items-center space-x-3 shrink-0">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-[rgba(255,255,255,0.08)]"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              strokeWidth="3.5"
                              strokeDasharray={`${churnProb}, 100`}
                              strokeLinecap="round"
                              stroke={riskColor}
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-sm font-black font-mono text-white">
                              {churnProb.toFixed(1)}%
                            </span>
                            <span className="text-[8px] uppercase tracking-wider text-[var(--text-muted)] font-mono">
                              P(Churn)
                            </span>
                          </div>
                        </div>

                        <div>
                          <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
                            Monetary Exposure
                          </div>
                          <div className="text-base font-bold font-mono text-white">
                            R$ {revenueAtRisk.toFixed(2)}
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)]">
                            At-Risk Gross Value
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Top Risk Drivers / Shapley Feature Contributions */}
                  <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white flex items-center space-x-1.5">
                        <TrendingDown size={14} className="text-[#f43f5e]" />
                        <span>Key Churn Drivers & Feature Contributions</span>
                      </h4>
                      <span className="text-[10px] text-[var(--text-muted)] font-mono">
                        SHAP Directional Weights
                      </span>
                    </div>

                    <div className="space-y-2">
                      {churnResult?.top_feature_contributions && churnResult.top_feature_contributions.length > 0 ? (
                        churnResult.top_feature_contributions.map((fc) => {
                          const isInc = fc.direction === 'increases_risk';
                          const isDec = fc.direction === 'decreases_risk';
                          return (
                            <div
                              key={fc.feature}
                              className="p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center space-x-2">
                                <div
                                  className={`w-5 h-5 rounded-md flex items-center justify-center ${
                                    isInc
                                      ? 'bg-[rgba(244,63,94,0.15)] text-[#f43f5e]'
                                      : isDec
                                      ? 'bg-[rgba(52,211,153,0.15)] text-[#34d399]'
                                      : 'bg-[rgba(255,255,255,0.08)] text-[var(--text-secondary)]'
                                  }`}
                                >
                                  {isInc ? (
                                    <TrendingUp size={12} />
                                  ) : isDec ? (
                                    <TrendingDown size={12} />
                                  ) : (
                                    <Minus size={12} />
                                  )}
                                </div>
                                <span className="font-mono text-white font-medium">
                                  {fc.feature.replace(/_/g, ' ')}
                                </span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span className="text-[var(--text-secondary)] text-[11px]">
                                  {fc.description}
                                </span>
                                <span
                                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                    isInc
                                      ? 'bg-[rgba(244,63,94,0.15)] text-[#fda4af]'
                                      : 'bg-[rgba(52,211,153,0.15)] text-[#6ee7b7]'
                                  }`}
                                >
                                  {isInc ? '+ Risk' : '- Risk'}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <>
                          <div className="p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex items-center justify-between text-xs">
                            <span className="font-mono text-white">recency_days</span>
                            <span className="text-[var(--text-secondary)]">
                              {detail.recency_days} days inactive (+Risk)
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex items-center justify-between text-xs">
                            <span className="font-mono text-white">avg_delivery_delay_days</span>
                            <span className="text-[var(--text-secondary)]">
                              {detail.fulfillment.avg_delivery_delay_days !== null &&
                              detail.fulfillment.avg_delivery_delay_days !== undefined &&
                              detail.fulfillment.avg_delivery_delay_days > 0
                                ? `+${detail.fulfillment.avg_delivery_delay_days.toFixed(1)}d carrier delay (+Risk)`
                                : 'On-time delivery (-Risk)'}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex items-center justify-between text-xs">
                            <span className="font-mono text-white">avg_review_score</span>
                            <span className="text-[var(--text-secondary)]">
                              {(detail.reviews.avg_review_score ?? 4.5).toFixed(1)} stars rating
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* RFM Scorecard */}
                  {detail.rfm && (
                    <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white">
                          RFM Quintile Matrix Drilldown
                        </h4>
                        <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[rgba(139,92,246,0.15)] text-[#d8b4fe] border border-[rgba(139,92,246,0.3)]">
                          Score: {detail.rfm.rfm_label}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                          <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
                            Recency (R)
                          </div>
                          <div className="text-xl font-black font-display text-[#38bdf8] mt-0.5">
                            {detail.rfm.r_score} / 5
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                            {detail.rfm.recency_days} days
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                          <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
                            Frequency (F)
                          </div>
                          <div className="text-xl font-black font-display text-[#c084fc] mt-0.5">
                            {detail.rfm.f_score} / 5
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                            {detail.rfm.frequency} orders
                          </div>
                        </div>

                        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
                          <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
                            Monetary (M)
                          </div>
                          <div className="text-xl font-black font-display text-[#34d399] mt-0.5">
                            {detail.rfm.m_score} / 5
                          </div>
                          <div className="text-[10px] text-[var(--text-secondary)] mt-0.5">
                            R$ {detail.rfm.monetary.toFixed(0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* TAB 2: BASKET & FULFILLMENT */}
              {activeTab === 'fulfillment' && (
                <div className="space-y-4">
                  {/* Basket Metrics */}
                  <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)]">
                    <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white mb-3 flex items-center space-x-1.5">
                      <Package size={14} className="text-[#38bdf8]" />
                      <span>Basket Diversity & Merchandise</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="text-[10px] text-[var(--text-muted)]">Total Items</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">
                          {detail.basket.lifetime_items}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="text-[10px] text-[var(--text-muted)]">Items / Order</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">
                          {detail.basket.avg_items_per_order.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="text-[10px] text-[var(--text-muted)]">Unique Products</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">
                          {detail.basket.total_unique_products_purchased}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="text-[10px] text-[var(--text-muted)]">Sellers Contacted</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">
                          {detail.basket.total_unique_sellers_contacted}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fulfillment Delay */}
                  <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)]">
                    <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white mb-3 flex items-center space-x-1.5">
                      <Truck size={14} className="text-[#fbbf24]" />
                      <span>Fulfillment Speed & Delivery Friction</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="text-[10px] text-[var(--text-muted)]">Avg Delivery Delay</div>
                        <div
                          className={`text-base font-bold font-mono mt-0.5 ${
                            detail.fulfillment.avg_delivery_delay_days &&
                            detail.fulfillment.avg_delivery_delay_days > 0
                              ? 'text-[#f43f5e]'
                              : 'text-[#34d399]'
                          }`}
                        >
                          {detail.fulfillment.avg_delivery_delay_days !== null &&
                          detail.fulfillment.avg_delivery_delay_days !== undefined
                            ? `${detail.fulfillment.avg_delivery_delay_days > 0 ? '+' : ''}${detail.fulfillment.avg_delivery_delay_days.toFixed(1)}d`
                            : '0d'}
                        </div>
                        <div className="text-[9px] text-[var(--text-muted)]">vs estimated date</div>
                      </div>
                      <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="text-[10px] text-[var(--text-muted)]">Late Orders Count</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">
                          {detail.fulfillment.late_orders_count}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="text-[10px] text-[var(--text-muted)]">Late Order Ratio</div>
                        <div className="text-base font-bold font-mono text-white mt-0.5">
                          {(detail.fulfillment.late_order_ratio * 100).toFixed(1)}%
                        </div>
                      </div>
                      <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)]">
                        <div className="text-[10px] text-[var(--text-muted)]">Late Experience</div>
                        <div className="text-xs font-bold font-mono mt-1">
                          {detail.fulfillment.has_late_delivery ? (
                            <span className="text-[#fda4af] bg-[rgba(244,63,94,0.15)] px-2 py-0.5 rounded">
                              Delayed
                            </span>
                          ) : (
                            <span className="text-[#6ee7b7] bg-[rgba(52,211,153,0.15)] px-2 py-0.5 rounded">
                              On-Time
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Freight & Review Economics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Freight Spend */}
                    <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)]">
                      <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white mb-2 flex items-center space-x-1.5">
                        <DollarSign size={14} className="text-[#34d399]" />
                        <span>Spend Composition</span>
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Product Items</span>
                          <span className="font-mono text-white">
                            R$ {detail.lifetime_product_spend.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Freight / Shipping</span>
                          <span className="font-mono text-[#fbbf24]">
                            R$ {detail.lifetime_freight_spend.toFixed(2)}
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-[rgba(255,255,255,0.06)] flex justify-between items-center font-bold">
                          <span className="text-white">Freight Burden Ratio</span>
                          <span className="font-mono text-[#38bdf8]">
                            {detail.lifetime_spend > 0
                              ? `${((detail.lifetime_freight_spend / detail.lifetime_spend) * 100).toFixed(1)}%`
                              : '0%'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Review Ratings */}
                    <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)]">
                      <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white mb-2 flex items-center space-x-1.5">
                        <Star size={14} className="text-[#fbbf24]" />
                        <span>Customer Satisfaction</span>
                      </h4>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Average Review Score</span>
                          <span className="font-mono font-bold text-white flex items-center space-x-1">
                            <span>{(detail.reviews.avg_review_score ?? 4.5).toFixed(2)}</span>
                            <Star size={11} className="text-[#fbbf24] fill-[#fbbf24]" />
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Negative Review Ratio</span>
                          <span className="font-mono text-white">
                            {(detail.reviews.negative_review_ratio * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="pt-1.5 border-t border-[rgba(255,255,255,0.06)] flex justify-between items-center">
                          <span className="text-[var(--text-secondary)]">Total Reviews</span>
                          <span className="font-mono text-white">
                            {detail.reviews.total_reviews_submitted}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PRESCRIPTIVE PLAYBOOK RECOMMENDATION */}
              {activeTab === 'recommendation' && (
                <div className="space-y-4">
                  {recommendation ? (
                    <>
                      {/* Playbook Hero Card */}
                      <div className="p-5 rounded-2xl bg-[linear-gradient(135deg,rgba(139,92,246,0.18)_0%,rgba(14,20,36,0.95)_100%)] border border-[rgba(139,92,246,0.4)] shadow-[0_0_25px_rgba(139,92,246,0.2)]">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[rgba(139,92,246,0.25)] text-[#d8b4fe] border border-[rgba(139,92,246,0.45)] font-bold">
                            Prescriptive Playbook Recommendation
                          </span>
                          <span className="text-xs font-mono text-[var(--text-muted)]">
                            Channel: {recommendation.recommended_playbook.intervention_channel}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-bold text-white mt-2">
                          {recommendation.recommended_playbook.name}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-1">
                          {recommendation.recommended_playbook.description}
                        </p>

                        <div className="mt-3 p-3 rounded-xl bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.06)]">
                          <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
                            Diagnosed Primary Friction
                          </div>
                          <div className="text-xs font-medium text-white mt-0.5">
                            {recommendation.primary_friction}
                          </div>
                        </div>
                      </div>

                      {/* Intervention Financial Economics */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
                          <div className="text-[10px] text-[var(--text-muted)] font-mono">Action Cost</div>
                          <div className="text-base font-bold font-mono text-white mt-0.5">
                            R$ {recommendation.recommended_playbook.default_cost_per_customer.toFixed(2)}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
                          <div className="text-[10px] text-[var(--text-muted)] font-mono">Save Rate Range</div>
                          <div className="text-base font-bold font-mono text-[#38bdf8] mt-0.5">
                            {(recommendation.recommended_playbook.estimated_save_rate_min * 100).toFixed(0)}% –{' '}
                            {(recommendation.recommended_playbook.estimated_save_rate_max * 100).toFixed(0)}%
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
                          <div className="text-[10px] text-[var(--text-muted)] font-mono">Gross Recovery</div>
                          <div className="text-base font-bold font-mono text-[#34d399] mt-0.5">
                            R$ {recommendation.expected_gross_recovery.toFixed(2)}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
                          <div className="text-[10px] text-[var(--text-muted)] font-mono">Projected Net Gain</div>
                          <div className="text-base font-bold font-mono text-[#a78bfa] mt-0.5">
                            R$ {recommendation.projected_net_gain.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {/* Action Script Template */}
                      <div className="p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)]">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-display font-semibold text-xs uppercase tracking-wider text-white">
                            Intervention Script Template
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyScript(
                                recommendation.suggested_message ||
                                  recommendation.recommended_playbook.action_template
                              )
                            }
                            className="text-[11px] text-[var(--neon-violet)] hover:text-white transition-all flex items-center space-x-1"
                          >
                            {copiedScript ? (
                              <>
                                <Check size={12} className="text-[#34d399]" />
                                <span className="text-[#34d399]">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={12} />
                                <span>Copy Script</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] italic bg-[rgba(0,0,0,0.35)] p-3.5 rounded-xl border border-[rgba(255,255,255,0.04)] font-sans leading-relaxed">
                          "{recommendation.suggested_message || recommendation.recommended_playbook.action_template}"
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="py-8 text-center text-[var(--text-muted)] text-xs">
                      No automated recommendation found for this customer.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-5 border-t border-[rgba(255,255,255,0.08)] bg-[rgba(14,20,36,0.9)] flex items-center justify-between gap-3">
          <div className="text-xs text-[var(--text-muted)]">
            ID: <span className="font-mono text-white">{customerId?.slice(0, 8)}...</span>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
            {onNavigateToSimulator && customerId && (
              <Button
                variant="violet"
                size="sm"
                icon={<ArrowRight size={14} />}
                onClick={() => {
                  onClose();
                  onNavigateToSimulator(customerId);
                }}
              >
                Simulate Churn What-If
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
