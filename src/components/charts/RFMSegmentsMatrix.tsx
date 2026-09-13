import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import {
  ArrowRight,
  LayoutGrid,
  BarChart3,
} from 'lucide-react';
import type { SegmentsOverview, SegmentDistribution } from '../../api';
import { SegmentBadge } from '../common/Badges';

interface RFMSegmentsMatrixProps {
  data: SegmentsOverview | null;
  onSelectSegment?: (segmentName: string) => void;
  isLoading?: boolean;
}

// Color palette for segments in light mode
const SEGMENT_COLORS: Record<string, { bg: string; border: string; text: string; hex: string }> = {
  Champions: { bg: '#ecfdf5', border: '#a7f3d0', text: '#059669', hex: '#059669' },
  'Loyal Customers': { bg: '#f0f9ff', border: '#bae6fd', text: '#0284c7', hex: '#0284c7' },
  'Potential Loyalists': { bg: '#eff6ff', border: '#bfdbfe', text: '#2563eb', hex: '#2563eb' },
  'Recent Customers': { bg: '#eef2ff', border: '#c7d2fe', text: '#4f46e5', hex: '#4f46e5' },
  Promising: { bg: '#f5f3ff', border: '#ddd6fe', text: '#7c3aed', hex: '#7c3aed' },
  'Customers Needing Attention': { bg: '#fffbeb', border: '#fde68a', text: '#d97706', hex: '#d97706' },
  'About to Sleep': { bg: '#fff7ed', border: '#fed7aa', text: '#ea580c', hex: '#ea580c' },
  'At Risk': { bg: '#fff1f2', border: '#fecdd3', text: '#e11d48', hex: '#e11d48' },
  "Can't Lose Them": { bg: '#ffe4e6', border: '#fda4af', text: '#be123c', hex: '#be123c' },
  Hibernating: { bg: '#f8fafc', border: '#e2e8f0', text: '#475569', hex: '#64748b' },
  Lost: { bg: '#f1f5f9', border: '#cbd5e1', text: '#64748b', hex: '#475569' },
};

// Strategic playbook guidance by segment
const SEGMENT_STRATEGY: Record<string, { summary: string; playbook: string; urgency: 'High' | 'Medium' | 'Low' }> = {
  Champions: {
    summary: 'High spenders, highest purchase frequency, recent orders. Reward with early access, executive gifting, and zero friction.',
    playbook: 'VIP Concierge & Dedicated Account Outreach',
    urgency: 'High',
  },
  'Loyal Customers': {
    summary: 'Consistent buyers with solid basket size. Upsell complementary categories and offer loyalty tier status recognition.',
    playbook: 'VIP Loyalty Nurture & Tier Recognition',
    urgency: 'Medium',
  },
  'Potential Loyalists': {
    summary: 'Recent buyers with good spend. Convert to repeat habit through personalized cross-sell and post-purchase follow-up.',
    playbook: 'Automated Win-Back & Promotional Re-engagement',
    urgency: 'Medium',
  },
  'Recent Customers': {
    summary: 'Newly acquired shoppers. Build brand trust and drive second purchase within 30-day onboarding window.',
    playbook: 'Baseline Operational Communication',
    urgency: 'Low',
  },
  Promising: {
    summary: 'Recent shoppers with moderate spend. Incentivize next order with timed free shipping coupons.',
    playbook: 'Logistics Friction Recovery & Shipping Waiver',
    urgency: 'Low',
  },
  'Customers Needing Attention': {
    summary: 'Above average spend but recency is decaying (>120 days). Reactivate before transition into At Risk.',
    playbook: 'Customer Sentiment Repair & Quality Resolution',
    urgency: 'Medium',
  },
  'About to Sleep': {
    summary: 'Sub-average recency and frequency. High risk of abandonment unless triggered with compelling value proposition.',
    playbook: 'Automated Win-Back & Promotional Re-engagement',
    urgency: 'High',
  },
  'At Risk': {
    summary: 'Previously high-value buyers who have not purchased in 250+ days. Immediate high-priority save campaign required.',
    playbook: 'Logistics Friction Recovery & Shipping Waiver',
    urgency: 'High',
  },
  "Can't Lose Them": {
    summary: 'Highest historical lifetime spenders now dormant (>300 days). Massive revenue exposure; requires direct executive concierge.',
    playbook: 'VIP Concierge & Dedicated Account Outreach',
    urgency: 'High',
  },
  Hibernating: {
    summary: 'Low recency, low frequency, low spend. Low-cost automated email campaigns or catalog refresh broadcasts.',
    playbook: 'Baseline Operational Communication',
    urgency: 'Low',
  },
  Lost: {
    summary: 'Dormant over 400+ days. Only target if cost per reactivation is under R$ 1.00; prune from active remarketing lists.',
    playbook: 'Baseline Operational Communication',
    urgency: 'Low',
  },
};

function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(amount);
}

export const RFMSegmentsMatrix: React.FC<RFMSegmentsMatrixProps> = ({
  data,
  onSelectSegment,
  isLoading = false,
}) => {
  const [activeSegmentName, setActiveSegmentName] = useState<string>('Champions');
  const [viewMode, setViewMode] = useState<'grid' | 'chart'>('grid');

  const segments = useMemo(() => data?.segments ?? [], [data]);

  // Total customer and spend aggregations
  const totalSpend = useMemo(
    () => segments.reduce((sum, s) => sum + s.total_spend, 0),
    [segments]
  );
  const totalCustomers = data?.total_customers ?? 96096;

  // Active selected segment data
  const selectedSegment = useMemo(() => {
    return (
      segments.find((s) => s.segment === activeSegmentName) ??
      segments[0] ??
      null
    );
  }, [segments, activeSegmentName]);

  const activeStrategy = selectedSegment ? SEGMENT_STRATEGY[selectedSegment.segment] : null;

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm relative">
      {/* Header with View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
              RFM Customer Segmentation Matrix
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
              11 Quintile Cohorts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Quintile scoring (R, F, M: 1–5) mapping Olist transaction percentiles into distinct behavioral cohorts
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutGrid size={13} />
            <span>Grid Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
              viewMode === 'chart'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <BarChart3 size={13} />
            <span>Revenue Share</span>
          </button>
        </div>
      </div>

      {/* Proportional Segment Distribution Bar */}
      <div className="mt-4 pt-1">
        <div className="flex justify-between items-center text-[11px] font-mono text-slate-500 mb-1.5">
          <span>PORTFOLIO DISTRIBUTION BY SEGMENT</span>
          <span className="font-medium text-slate-700">{totalCustomers.toLocaleString()} Unique Customer Accounts</span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100 border border-slate-200 flex overflow-hidden p-0.5 gap-0.5">
          {segments.map((seg) => {
            const color = SEGMENT_COLORS[seg.segment]?.hex ?? '#4f46e5';
            const isCurrent = seg.segment === activeSegmentName;
            return (
              <div
                key={seg.segment}
                style={{
                  width: `${Math.max(1, seg.percentage)}%`,
                  backgroundColor: color,
                  opacity: isCurrent ? 1 : 0.6,
                }}
                className="h-full rounded-xs cursor-pointer transition-all hover:opacity-100 hover:scale-y-110"
                onClick={() => setActiveSegmentName(seg.segment)}
                title={`${seg.segment}: ${seg.percentage}% (${seg.customer_count.toLocaleString()} customers)`}
              />
            );
          })}
        </div>
      </div>

      {/* Content: Grid Mode vs Chart Mode */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400 font-mono animate-pulse">
          Hydrating RFM customer segmentation...
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
          {segments.map((seg) => {
            const isSelected = seg.segment === activeSegmentName;
            const style = SEGMENT_COLORS[seg.segment] ?? {
              bg: '#f8fafc',
              border: '#e2e8f0',
              text: '#0f172a',
              hex: '#4f46e5',
            };
            const spendShare = totalSpend > 0 ? (seg.total_spend / totalSpend) * 100 : 0;

            return (
              <div
                key={seg.segment}
                role="button"
                tabIndex={0}
                data-testid={`segment-card-${seg.segment.toLowerCase()}`}
                onClick={() => setActiveSegmentName(seg.segment)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setActiveSegmentName(seg.segment);
                  }
                }}
                className={`p-3.5 rounded-xl transition-all cursor-pointer border relative overflow-hidden group shadow-2xs ${
                  isSelected
                    ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {/* Active selection dot */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-2 h-2 m-2 rounded-full bg-indigo-600" />
                )}

                <div className="flex items-center justify-between">
                  <span
                    className="font-display font-bold text-xs"
                    style={{ color: style.text }}
                  >
                    {seg.segment}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {seg.percentage}% of base
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-slate-100 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">
                      Customers
                    </span>
                    <span className="font-bold text-slate-900">
                      {seg.customer_count.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">
                      Total Spend
                    </span>
                    <span className="font-bold text-emerald-700">
                      {formatBRL(seg.total_spend)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-100">
                  <span>Avg: {formatBRL(seg.avg_spend)}</span>
                  <span>Recency: {seg.avg_recency_days}d</span>
                </div>

                {/* Progress bar of spend share */}
                <div className="w-full h-1 rounded-full bg-slate-100 mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, spendShare * 2)}%`,
                      backgroundColor: style.hex,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Recharts Horizontal Bar View for Revenue Breakdown */
        <div className="mt-4 w-full h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={segments}
              layout="vertical"
              margin={{ top: 10, right: 20, left: 130, bottom: 0 }}
            >
              <XAxis
                type="number"
                tickFormatter={(val: number) => `R$ ${(val / 1000).toFixed(0)}k`}
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="segment"
                tick={{ fill: '#334155', fontSize: 11, fontFamily: 'Outfit', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={125}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as SegmentDistribution;
                  return (
                    <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xl text-xs">
                      <div className="font-display font-bold text-slate-900 mb-1">
                        {item.segment}
                      </div>
                      <div className="space-y-1 font-mono">
                        <div className="text-emerald-700 font-semibold">
                          Total Spend: {formatBRL(item.total_spend)}
                        </div>
                        <div className="text-slate-800">
                          Customer Count: {item.customer_count.toLocaleString()} ({item.percentage}%)
                        </div>
                        <div className="text-slate-600">
                          Avg Spend / Order: {formatBRL(item.avg_spend)}
                        </div>
                        <div className="text-slate-500">
                          Avg Recency: {item.avg_recency_days} days
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="total_spend"
                radius={[0, 4, 4, 0]}
                onClick={(item) => setActiveSegmentName(item.segment)}
                cursor="pointer"
              >
                {segments.map((entry) => (
                  <Cell
                    key={entry.segment}
                    fill={SEGMENT_COLORS[entry.segment]?.hex ?? '#0284c7'}
                    opacity={entry.segment === activeSegmentName ? 1 : 0.75}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Selected Segment Strategic Deep-Dive Inspection Panel */}
      {selectedSegment && (
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-display text-sm shrink-0 border"
                style={{
                  backgroundColor: SEGMENT_COLORS[selectedSegment.segment]?.bg ?? '#eff6ff',
                  borderColor: SEGMENT_COLORS[selectedSegment.segment]?.border ?? '#bfdbfe',
                  color: SEGMENT_COLORS[selectedSegment.segment]?.text ?? '#1d4ed8',
                }}
              >
                RFM
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-display font-bold text-sm text-slate-900">
                    {selectedSegment.segment}
                  </h4>
                  <SegmentBadge segment={selectedSegment.segment} />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 font-medium">
                    {selectedSegment.customer_count.toLocaleString()} Accounts ({selectedSegment.percentage}%)
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {activeStrategy?.summary}
                </p>
              </div>
            </div>

            {/* Prescribed Playbook & Jump to Directory CTA */}
            <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] uppercase font-mono text-slate-400 block">
                  Recommended Playbook:
                </span>
                <span className="text-xs font-semibold text-slate-800">
                  {activeStrategy?.playbook}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectSegment?.(selectedSegment.segment)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <span>Filter Customers</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
