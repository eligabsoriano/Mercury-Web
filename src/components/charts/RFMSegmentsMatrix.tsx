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

// Color palette for segments
const SEGMENT_COLORS: Record<string, { bg: string; border: string; text: string; hex: string }> = {
  Champions: { bg: 'rgba(52,211,153,0.14)', border: 'rgba(52,211,153,0.35)', text: '#6ee7b7', hex: '#34d399' },
  'Loyal Customers': { bg: 'rgba(56,189,248,0.14)', border: 'rgba(56,189,248,0.35)', text: '#7dd3fc', hex: '#38bdf8' },
  'Potential Loyalists': { bg: 'rgba(96,165,250,0.14)', border: 'rgba(96,165,250,0.35)', text: '#93c5fd', hex: '#60a5fa' },
  'Recent Customers': { bg: 'rgba(167,139,250,0.14)', border: 'rgba(167,139,250,0.35)', text: '#c4b5fd', hex: '#a78bfa' },
  Promising: { bg: 'rgba(192,132,252,0.14)', border: 'rgba(192,132,252,0.35)', text: '#d8b4fe', hex: '#c084fc' },
  'Customers Needing Attention': { bg: 'rgba(251,191,36,0.14)', border: 'rgba(251,191,36,0.35)', text: '#fde68a', hex: '#fbbf24' },
  'About to Sleep': { bg: 'rgba(245,158,11,0.14)', border: 'rgba(245,158,11,0.35)', text: '#fcd34d', hex: '#f59e0b' },
  'At Risk': { bg: 'rgba(244,63,94,0.14)', border: 'rgba(244,63,94,0.35)', text: '#fda4af', hex: '#f43f5e' },
  "Can't Lose Them": { bg: 'rgba(225,29,72,0.18)', border: 'rgba(225,29,72,0.45)', text: '#fecdd3', hex: '#e11d48' },
  Hibernating: { bg: 'rgba(100,116,139,0.18)', border: 'rgba(100,116,139,0.35)', text: '#cbd5e1', hex: '#64748b' },
  Lost: { bg: 'rgba(71,85,105,0.22)', border: 'rgba(71,85,105,0.4)', text: '#94a3b8', hex: '#475569' },
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
    <div className="liquid-glass rounded-2xl p-5 md:p-6 border border-[rgba(255,255,255,0.09)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
      {/* Header with View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.07)]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display font-bold text-lg text-white tracking-tight">
              RFM Customer Segmentation Matrix
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[rgba(56,189,248,0.14)] text-[#7dd3fc] border border-[rgba(56,189,248,0.3)] font-semibold">
              11 Quintile Cohorts
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Quintile scoring (R, F, M: 1–5) mapping Olist transaction percentiles into distinct behavioral cohorts
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="inline-flex rounded-xl p-1 bg-[rgba(15,23,42,0.8)] border border-[rgba(255,255,255,0.08)]">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              viewMode === 'grid'
                ? 'bg-[rgba(56,189,248,0.22)] text-[#7dd3fc] border border-[rgba(56,189,248,0.35)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <LayoutGrid size={13} />
            <span>Grid Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`flex items-center space-x-1.5 px-3 py-1 text-xs rounded-lg font-medium transition-all ${
              viewMode === 'chart'
                ? 'bg-[rgba(56,189,248,0.22)] text-[#7dd3fc] border border-[rgba(56,189,248,0.35)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <BarChart3 size={13} />
            <span>Revenue Share</span>
          </button>
        </div>
      </div>

      {/* Proportional Segment Distribution Bar */}
      <div className="mt-4 pt-1">
        <div className="flex justify-between items-center text-[11px] font-mono text-[var(--text-secondary)] mb-1.5">
          <span>PORTFOLIO DISTRIBUTION BY SEGMENT</span>
          <span>{totalCustomers.toLocaleString()} Unique Customer Accounts</span>
        </div>
        <div className="h-3 w-full rounded-full bg-[rgba(15,23,42,0.8)] border border-[rgba(255,255,255,0.08)] flex overflow-hidden p-0.5 gap-0.5">
          {segments.map((seg) => {
            const color = SEGMENT_COLORS[seg.segment]?.hex ?? '#8b5cf6';
            const isCurrent = seg.segment === activeSegmentName;
            return (
              <div
                key={seg.segment}
                style={{
                  width: `${Math.max(1, seg.percentage)}%`,
                  backgroundColor: color,
                  opacity: isCurrent ? 1 : 0.65,
                }}
                className="h-full rounded-sm cursor-pointer transition-all hover:opacity-100 hover:scale-y-110"
                onClick={() => setActiveSegmentName(seg.segment)}
                title={`${seg.segment}: ${seg.percentage}% (${seg.customer_count.toLocaleString()} customers)`}
              />
            );
          })}
        </div>
      </div>

      {/* Content: Grid Mode vs Chart Mode */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-xs text-[var(--text-secondary)] font-mono animate-pulse">
          Hydrating RFM customer segmentation...
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
          {segments.map((seg) => {
            const isSelected = seg.segment === activeSegmentName;
            const style = SEGMENT_COLORS[seg.segment] ?? {
              bg: 'rgba(255,255,255,0.05)',
              border: 'rgba(255,255,255,0.1)',
              text: '#fff',
              hex: '#8b5cf6',
            };
            const spendShare = totalSpend > 0 ? (seg.total_spend / totalSpend) * 100 : 0;

            return (
              <div
                key={seg.segment}
                onClick={() => setActiveSegmentName(seg.segment)}
                className={`p-3.5 rounded-xl transition-all cursor-pointer border relative overflow-hidden group ${
                  isSelected
                    ? 'border-[rgba(56,189,248,0.6)] bg-[rgba(30,41,59,0.7)] shadow-[0_0_20px_rgba(56,189,248,0.2)]'
                    : 'border-[rgba(255,255,255,0.06)] bg-[rgba(15,23,42,0.5)] hover:border-[rgba(255,255,255,0.16)] hover:bg-[rgba(30,41,59,0.4)]'
                }`}
              >
                {/* Active selection glow pill */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-2 h-2 m-2 rounded-full bg-[#38bdf8] shadow-[0_0_8px_#38bdf8]" />
                )}

                <div className="flex items-center justify-between">
                  <span
                    className="font-display font-bold text-xs"
                    style={{ color: style.text }}
                  >
                    {seg.segment}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text-muted)]">
                    {seg.percentage}% of base
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2.5 pt-2 border-t border-[rgba(255,255,255,0.05)] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block font-sans">
                      Customers
                    </span>
                    <span className="font-bold text-white">
                      {seg.customer_count.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block font-sans">
                      Total Spend
                    </span>
                    <span className="font-bold text-[#6ee7b7]">
                      {formatBRL(seg.total_spend)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-[var(--text-secondary)] font-mono mt-2 pt-2 border-t border-[rgba(255,255,255,0.04)]">
                  <span>Avg: {formatBRL(seg.avg_spend)}</span>
                  <span>Recency: {seg.avg_recency_days}d</span>
                </div>

                {/* Progress bar of spend share */}
                <div className="w-full h-1 rounded-full bg-[rgba(255,255,255,0.08)] mt-2 overflow-hidden">
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
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="segment"
                tick={{ fill: '#e2e8f0', fontSize: 11, fontFamily: 'Outfit', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={125}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const item = payload[0].payload as SegmentDistribution;
                  return (
                    <div className="liquid-glass p-3 rounded-xl border border-[rgba(255,255,255,0.12)] shadow-xl text-xs backdrop-blur-xl">
                      <div className="font-display font-bold text-white mb-1">
                        {item.segment}
                      </div>
                      <div className="space-y-1 font-mono">
                        <div className="text-[#6ee7b7]">
                          Total Spend: {formatBRL(item.total_spend)}
                        </div>
                        <div className="text-white">
                          Customer Count: {item.customer_count.toLocaleString()} ({item.percentage}%)
                        </div>
                        <div className="text-[var(--text-secondary)]">
                          Avg Spend / Order: {formatBRL(item.avg_spend)}
                        </div>
                        <div className="text-[var(--text-muted)]">
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
                    fill={SEGMENT_COLORS[entry.segment]?.hex ?? '#38bdf8'}
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
        <div className="mt-5 p-4 rounded-xl bg-[rgba(15,23,42,0.85)] border border-[rgba(56,189,248,0.3)] shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold font-display text-sm shrink-0 border"
                style={{
                  backgroundColor: SEGMENT_COLORS[selectedSegment.segment]?.bg ?? 'rgba(56,189,248,0.15)',
                  borderColor: SEGMENT_COLORS[selectedSegment.segment]?.border ?? 'rgba(56,189,248,0.4)',
                  color: SEGMENT_COLORS[selectedSegment.segment]?.text ?? '#7dd3fc',
                }}
              >
                RFM
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-display font-bold text-sm text-white">
                    {selectedSegment.segment}
                  </h4>
                  <SegmentBadge segment={selectedSegment.segment} />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[rgba(255,255,255,0.06)] text-[var(--text-secondary)]">
                    {selectedSegment.customer_count.toLocaleString()} Accounts ({selectedSegment.percentage}%)
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                  {activeStrategy?.summary}
                </p>
              </div>
            </div>

            {/* Prescribed Playbook & Jump to Directory CTA */}
            <div className="flex flex-wrap items-center gap-3 self-end lg:self-center">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">
                  Recommended Playbook:
                </span>
                <span className="text-xs font-semibold text-white">
                  {activeStrategy?.playbook}
                </span>
              </div>

              <button
                type="button"
                onClick={() => onSelectSegment?.(selectedSegment.segment)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[rgba(56,189,248,0.16)] text-[#7dd3fc] border border-[rgba(56,189,248,0.35)] text-xs font-medium hover:bg-[rgba(56,189,248,0.25)] transition-all cursor-pointer"
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
