import React from 'react';
import {
  Users,
  CheckCircle2,
  Store,
  ArrowRight,
  DollarSign,
  TrendingUp,
  Percent,
} from 'lucide-react';
import type { MarketingFunnelOverview } from '../../api';

export interface FunnelStagesProps {
  overview?: MarketingFunnelOverview | null;
  isLoading?: boolean;
  className?: string;
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) {
    return `R$ ${(amount / 1_000_000).toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    return `R$ ${(amount / 1_000).toFixed(1)}k`;
  }
  return `R$ ${amount.toLocaleString()}`;
}

export const FunnelStages: React.FC<FunnelStagesProps> = ({
  overview,
  isLoading = false,
  className = '',
}) => {
  const totalLeads = overview?.total_leads ?? 8000;
  const totalClosedDeals = overview?.total_closed_deals ?? 842;
  const activeSellers = overview?.active_marketplace_sellers_count ?? 420;
  const conversionRate = overview?.overall_conversion_rate ?? 10.525;
  const activationRate = overview?.seller_activation_rate ?? 49.88;
  const declaredRevenue = overview?.total_declared_monthly_revenue ?? 14250000;
  const actualRevenue = overview?.total_actual_marketplace_revenue ?? 8642100;
  const revenueRatio = declaredRevenue > 0 ? (actualRevenue / declaredRevenue) * 100 : 60.6;
  const endToEndRate = totalLeads > 0 ? (activeSellers / totalLeads) * 100 : 5.25;

  if (isLoading) {
    return (
      <div className="liquid-glass rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] animate-pulse">
        <div className="h-6 w-48 bg-[rgba(255,255,255,0.08)] rounded mb-4" />
        <div className="h-32 bg-[rgba(255,255,255,0.04)] rounded-xl" />
      </div>
    );
  }

  return (
    <div
      data-testid="funnel-stages-card"
      className={`liquid-glass rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.36)] relative overflow-hidden ${className}`}
    >
      {/* Background ambient lighting */}
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-[radial-gradient(circle,rgba(56,189,248,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[radial-gradient(circle,rgba(52,211,153,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[rgba(56,189,248,0.12)] border border-[rgba(56,189,248,0.3)] text-[#38bdf8]">
              <TrendingUp size={16} />
            </span>
            <h3 className="font-display text-lg font-bold text-white tracking-tight">
              Seller Acquisition Funnel Architecture
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            End-to-end conversion efficiency from top-of-funnel MQL registrations to active marketplace sellers
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] text-xs font-mono text-[#34d399]">
            <Percent size={12} />
            <span className="font-semibold">{endToEndRate.toFixed(2)}% Overall Yield</span>
          </span>
        </div>
      </div>

      {/* Stepped Funnel Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Stage 1: MQLs */}
        <div className="group relative rounded-xl p-4 bg-gradient-to-b from-[rgba(56,189,248,0.08)] to-[rgba(56,189,248,0.02)] border border-[rgba(56,189,248,0.25)] hover:border-[rgba(56,189,248,0.5)] transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#38bdf8] font-bold flex items-center space-x-1.5">
              <Users size={13} />
              <span>1. Top of Funnel</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(56,189,248,0.15)] text-[#7dd3fc] font-mono">
              100%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-display">
            {totalLeads.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">
            Marketing Qualified Leads (MQL)
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Inbound seller leads across organic, paid, and outbound channels
          </p>
          <div className="w-full bg-[rgba(255,255,255,0.06)] rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-[#38bdf8] to-[#0284c7] h-full rounded-full w-full" />
          </div>
        </div>

        {/* Stage 2: Won Deals */}
        <div className="group relative rounded-xl p-4 bg-gradient-to-b from-[rgba(139,92,246,0.08)] to-[rgba(139,92,246,0.02)] border border-[rgba(139,92,246,0.25)] hover:border-[rgba(139,92,246,0.5)] transition-all duration-300">
          {/* Connector Badge from Stage 1 */}
          <div className="hidden md:flex items-center justify-center absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#0f172a] border border-[rgba(139,92,246,0.5)] text-[#c084fc] shadow-lg">
            <ArrowRight size={13} />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#c084fc] font-bold flex items-center space-x-1.5">
              <CheckCircle2 size={13} />
              <span>2. Sales Conversion</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(139,92,246,0.2)] text-[#d8b4fe] font-mono font-bold">
              {conversionRate.toFixed(1)}% Won
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white font-display">
            {totalClosedDeals.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">
            Closed Won Merchant Deals
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Contract-signed merchants onboarded via sales representatives
          </p>
          <div className="w-full bg-[rgba(255,255,255,0.06)] rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, conversionRate * 4)}%` }}
            />
          </div>
        </div>

        {/* Stage 3: Active Marketplace Sellers */}
        <div className="group relative rounded-xl p-4 bg-gradient-to-b from-[rgba(52,211,153,0.08)] to-[rgba(52,211,153,0.02)] border border-[rgba(52,211,153,0.25)] hover:border-[rgba(52,211,153,0.5)] transition-all duration-300">
          {/* Connector Badge from Stage 2 */}
          <div className="hidden md:flex items-center justify-center absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-[#0f172a] border border-[rgba(52,211,153,0.5)] text-[#34d399] shadow-lg">
            <ArrowRight size={13} />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#34d399] font-bold flex items-center space-x-1.5">
              <Store size={13} />
              <span>3. Fulfilled Activation</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(52,211,153,0.2)] text-[#a7f3d0] font-mono font-bold">
              {activationRate.toFixed(1)}% Active
            </span>
          </div>
          <div className="text-2xl font-extrabold text-[#34d399] font-display">
            {activeSellers.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-[var(--text-primary)] mt-0.5">
            Active Marketplace Sellers
          </div>
          <p className="text-[11px] text-[var(--text-muted)] mt-1">
            Converted merchants who successfully fulfilled live marketplace orders
          </p>
          <div className="w-full bg-[rgba(255,255,255,0.06)] rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#34d399] to-[#10b981] h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, activationRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Revenue Realization Comparison Section */}
      <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.06)] relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <DollarSign size={14} className="text-[#fbbf24]" />
            <span className="text-xs font-semibold text-white">
              Revenue Realization Bridge: Self-Declared vs Realized GMV
            </span>
          </div>
          <div className="text-xs font-mono text-[var(--text-secondary)]">
            Realization Ratio:{' '}
            <span className="text-[#34d399] font-bold">{revenueRatio.toFixed(1)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
          <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)]">
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-mono">
              Total Self-Declared Monthly Revenue
            </span>
            <span className="text-base font-bold text-white font-mono">
              {formatCurrency(declaredRevenue)}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5">
              Prospect projected monthly run-rate during sales intake
            </span>
          </div>

          <div className="p-3 rounded-lg bg-[rgba(52,211,153,0.04)] border border-[rgba(52,211,153,0.2)]">
            <span className="text-[10px] text-[#a7f3d0] uppercase tracking-wider block font-mono">
              Actual Realized Marketplace GMV
            </span>
            <span className="text-base font-bold text-[#34d399] font-mono">
              {formatCurrency(actualRevenue)}
            </span>
            <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5">
              Net verified historical order GMV from converted active sellers
            </span>
          </div>
        </div>

        {/* Dual progress comparison bar */}
        <div className="w-full bg-[rgba(255,255,255,0.06)] rounded-full h-2 overflow-hidden flex">
          <div
            className="bg-gradient-to-r from-[#34d399] to-[#059669] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, revenueRatio)}%` }}
            title={`Realized GMV: ${revenueRatio.toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  );
};
