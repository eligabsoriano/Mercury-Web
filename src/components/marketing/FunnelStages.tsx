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
      <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
        <div className="h-32 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div
      data-testid="funnel-stages-card"
      className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6 relative z-10">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700">
              <TrendingUp size={16} />
            </span>
            <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">
              Seller Acquisition Funnel Architecture
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            End-to-end conversion efficiency from top-of-funnel MQL registrations to active marketplace sellers
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-700 font-semibold">
            <Percent size={12} />
            <span>{endToEndRate.toFixed(2)}% Overall Yield</span>
          </span>
        </div>
      </div>

      {/* Stepped Funnel Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {/* Stage 1: MQLs */}
        <div className="group relative rounded-xl p-4 bg-sky-50/50 border border-sky-200 hover:border-sky-300 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-700 font-bold flex items-center space-x-1.5">
              <Users size={13} />
              <span>1. Top of Funnel</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-mono font-bold">
              100%
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-display">
            {totalLeads.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-800 mt-0.5">
            Marketing Qualified Leads (MQL)
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Inbound seller leads across organic, paid, and outbound channels
          </p>
          <div className="w-full bg-sky-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-sky-500 h-full rounded-full w-full" />
          </div>
        </div>

        {/* Stage 2: Won Deals */}
        <div className="group relative rounded-xl p-4 bg-purple-50/50 border border-purple-200 hover:border-purple-300 transition-all duration-300">
          {/* Connector Badge from Stage 1 */}
          <div className="hidden md:flex items-center justify-center absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border border-purple-200 text-purple-600 shadow-sm">
            <ArrowRight size={13} />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-purple-700 font-bold flex items-center space-x-1.5">
              <CheckCircle2 size={13} />
              <span>2. Sales Conversion</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-mono font-bold">
              {conversionRate.toFixed(1)}% Won
            </span>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-display">
            {totalClosedDeals.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-800 mt-0.5">
            Closed Won Merchant Deals
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Contract-signed merchants onboarded via sales representatives
          </p>
          <div className="w-full bg-purple-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, conversionRate * 4)}%` }}
            />
          </div>
        </div>

        {/* Stage 3: Active Marketplace Sellers */}
        <div className="group relative rounded-xl p-4 bg-emerald-50/50 border border-emerald-200 hover:border-emerald-300 transition-all duration-300">
          {/* Connector Badge from Stage 2 */}
          <div className="hidden md:flex items-center justify-center absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white border border-emerald-200 text-emerald-600 shadow-sm">
            <ArrowRight size={13} />
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-700 font-bold flex items-center space-x-1.5">
              <Store size={13} />
              <span>3. Fulfilled Activation</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-mono font-bold">
              {activationRate.toFixed(1)}% Active
            </span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-display">
            {activeSellers.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-slate-800 mt-0.5">
            Active Marketplace Sellers
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Converted merchants who successfully fulfilled live marketplace orders
          </p>
          <div className="w-full bg-emerald-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, activationRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Revenue Realization Comparison Section */}
      <div className="mt-5 pt-4 border-t border-slate-200 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <DollarSign size={14} className="text-amber-500" />
            <span className="text-xs font-semibold text-slate-900">
              Revenue Realization Bridge: Self-Declared vs Realized GMV
            </span>
          </div>
          <div className="text-xs font-mono text-slate-500">
            Realization Ratio:{' '}
            <span className="text-emerald-700 font-bold">{revenueRatio.toFixed(1)}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2.5">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
              Total Self-Declared Monthly Revenue
            </span>
            <span className="text-base font-bold text-slate-900 font-mono">
              {formatCurrency(declaredRevenue)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Prospect projected monthly run-rate during sales intake
            </span>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] text-emerald-700 uppercase tracking-wider block font-mono">
              Actual Realized Marketplace GMV
            </span>
            <span className="text-base font-bold text-emerald-700 font-mono">
              {formatCurrency(actualRevenue)}
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Net verified historical order GMV from converted active sellers
            </span>
          </div>
        </div>

        {/* Dual progress comparison bar - Solid Fill, No Gradient */}
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, revenueRatio)}%` }}
            title={`Realized GMV: ${revenueRatio.toFixed(1)}%`}
          />
        </div>
      </div>
    </div>
  );
};
