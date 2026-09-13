import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Clock,
  Zap,
  Turtle,
  CheckCircle2,
} from 'lucide-react';
import type { SalesVelocityMetrics, VelocityBySegment, VelocityByLeadType } from '../../api';

export interface VelocityDistributionChartProps {
  velocity?: SalesVelocityMetrics | null;
  isLoading?: boolean;
  className?: string;
}

type VelocityViewMode = 'segment' | 'lead_type';

function formatName(name: string): string {
  return name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

interface SegmentTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: VelocityBySegment;
  }>;
}

const CustomSegmentTooltip: React.FC<SegmentTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div className="p-3.5 rounded-xl bg-[rgba(15,23,42,0.94)] border border-[rgba(255,255,255,0.12)] shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs space-y-2 min-w-[200px]">
      <div className="flex items-center space-x-2 pb-1.5 border-b border-[rgba(255,255,255,0.08)]">
        <Clock size={14} className="text-[#c084fc]" />
        <span className="font-bold text-white font-display">
          {formatName(item.business_segment)}
        </span>
      </div>

      <div className="space-y-1 font-mono text-[11px]">
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Average Cycle:</span>
          <span className="font-bold text-[#c084fc]">{item.avg_days_to_close.toFixed(1)} days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Fastest Close:</span>
          <span className="text-[#34d399] font-medium">{item.min_days_to_close} days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Slowest Close:</span>
          <span className="text-[#f43f5e] font-medium">{item.max_days_to_close} days</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-[rgba(255,255,255,0.06)]">
          <span className="text-[var(--text-muted)]">Deals Closed:</span>
          <span className="font-bold text-white">{item.closed_deals_count}</span>
        </div>
      </div>
    </div>
  );
};

interface LeadTypeTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: VelocityByLeadType;
  }>;
}

const CustomLeadTypeTooltip: React.FC<LeadTypeTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div className="p-3.5 rounded-xl bg-[rgba(15,23,42,0.94)] border border-[rgba(255,255,255,0.12)] shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs space-y-2 min-w-[200px]">
      <div className="flex items-center space-x-2 pb-1.5 border-b border-[rgba(255,255,255,0.08)]">
        <Clock size={14} className="text-[#38bdf8]" />
        <span className="font-bold text-white font-display">
          {formatName(item.lead_type)}
        </span>
      </div>

      <div className="space-y-1 font-mono text-[11px]">
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Average Cycle:</span>
          <span className="font-bold text-[#38bdf8]">{item.avg_days_to_close.toFixed(1)} days</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-[rgba(255,255,255,0.06)]">
          <span className="text-[var(--text-muted)]">Deals Closed:</span>
          <span className="font-bold text-white">{item.closed_deals_count}</span>
        </div>
      </div>
    </div>
  );
};

export const VelocityDistributionChart: React.FC<VelocityDistributionChartProps> = ({
  velocity,
  isLoading = false,
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<VelocityViewMode>('segment');

  const defaultVelocity = useMemo<SalesVelocityMetrics>(() => ({
    overall_avg_days_to_close: 18.4,
    fastest_segment: 'home_appliances',
    slowest_segment: 'fashion_clothing',
    velocity_by_segment: [
      { business_segment: 'home_appliances', avg_days_to_close: 14.2, min_days_to_close: 3, max_days_to_close: 32, closed_deals_count: 142 },
      { business_segment: 'health_beauty', avg_days_to_close: 15.8, min_days_to_close: 4, max_days_to_close: 36, closed_deals_count: 184 },
      { business_segment: 'sports_leisure', avg_days_to_close: 17.5, min_days_to_close: 5, max_days_to_close: 42, closed_deals_count: 136 },
      { business_segment: 'computers_accessories', avg_days_to_close: 19.4, min_days_to_close: 6, max_days_to_close: 48, closed_deals_count: 118 },
      { business_segment: 'fashion_clothing', avg_days_to_close: 24.1, min_days_to_close: 8, max_days_to_close: 60, closed_deals_count: 92 },
    ],
    velocity_by_lead_type: [
      { lead_type: 'online_big', avg_days_to_close: 12.4, closed_deals_count: 210 },
      { lead_type: 'online_medium', avg_days_to_close: 17.8, closed_deals_count: 380 },
      { lead_type: 'offline_small', avg_days_to_close: 25.6, closed_deals_count: 252 },
    ],
  }), []);

  const data = velocity ?? defaultVelocity;
  const segments = useMemo(() => {
    return (data.velocity_by_segment ?? []).map((s) => ({
      ...s,
      displayName: formatName(s.business_segment),
    }));
  }, [data.velocity_by_segment]);

  const leadTypes = useMemo(() => {
    return (data.velocity_by_lead_type ?? []).map((l) => ({
      ...l,
      displayName: formatName(l.lead_type),
    }));
  }, [data.velocity_by_lead_type]);

  if (isLoading) {
    return (
      <div className="liquid-glass rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] animate-pulse">
        <div className="h-6 w-48 bg-[rgba(255,255,255,0.08)] rounded mb-4" />
        <div className="h-64 bg-[rgba(255,255,255,0.04)] rounded-xl" />
      </div>
    );
  }

  return (
    <div
      data-testid="velocity-distribution-card"
      className={`liquid-glass rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.36)] relative overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[rgba(192,132,252,0.12)] border border-[rgba(192,132,252,0.3)] text-[#c084fc]">
              <Clock size={16} />
            </span>
            <h3 className="font-display text-lg font-bold text-white tracking-tight">
              Sales Cycle Velocity Distribution
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Time-to-close metrics analyzed across merchant product segments and prospect lead profiles
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('segment')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'segment'
                ? 'bg-[rgba(192,132,252,0.2)] text-[#d8b4fe] border border-[rgba(192,132,252,0.4)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            By Segment
          </button>
          <button
            type="button"
            onClick={() => setViewMode('lead_type')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'lead_type'
                ? 'bg-[rgba(56,189,248,0.2)] text-[#7dd3fc] border border-[rgba(56,189,248,0.4)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-white'
            }`}
          >
            By Lead Type
          </button>
        </div>
      </div>

      {/* Velocity Badges & Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">
              Portfolio Average Cycle
            </span>
            <span className="text-lg font-extrabold text-white font-display">
              {data.overall_avg_days_to_close.toFixed(1)} Days
            </span>
          </div>
          <span className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)]">
            <Clock size={16} />
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.2)] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#a7f3d0] block">
              Fastest Moving Segment
            </span>
            <span className="text-base font-bold text-[#34d399]">
              {formatName(data.fastest_segment ?? 'home_appliances')}
            </span>
          </div>
          <span className="p-2 rounded-lg bg-[rgba(52,211,153,0.15)] text-[#34d399]">
            <Zap size={16} />
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(244,63,94,0.05)] border border-[rgba(244,63,94,0.2)] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#fda4af] block">
              Longest Sales Cycle
            </span>
            <span className="text-base font-bold text-[#f43f5e]">
              {formatName(data.slowest_segment ?? 'fashion_clothing')}
            </span>
          </div>
          <span className="p-2 rounded-lg bg-[rgba(244,63,94,0.15)] text-[#f43f5e]">
            <Turtle size={16} />
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'segment' ? (
            <BarChart
              data={segments}
              margin={{ top: 10, right: 16, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="displayName"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
                unit="d"
              />
              <Tooltip content={<CustomSegmentTooltip />} />
              <Bar
                dataKey="avg_days_to_close"
                name="Avg Days to Close"
                radius={[6, 6, 0, 0]}
                barSize={32}
              >
                {segments.map((entry, index) => (
                  <Cell
                    key={`seg-${entry.business_segment}`}
                    fill={
                      index === 0
                        ? '#34d399'
                        : index === segments.length - 1
                        ? '#f43f5e'
                        : '#c084fc'
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={leadTypes}
              margin={{ top: 10, right: 16, left: -10, bottom: 5 }}
            >
              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="displayName"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
                unit="d"
              />
              <Tooltip content={<CustomLeadTypeTooltip />} />
              <Bar
                dataKey="avg_days_to_close"
                name="Avg Days to Close"
                fill="#38bdf8"
                radius={[6, 6, 0, 0]}
                barSize={40}
              >
                {leadTypes.map((entry, idx) => (
                  <Cell
                    key={`lead-${entry.lead_type}`}
                    fill={idx === 0 ? '#34d399' : idx === 1 ? '#38bdf8' : '#fbbf24'}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Subtext info */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono border-t border-[rgba(255,255,255,0.04)] pt-2.5">
        <span className="flex items-center space-x-1">
          <CheckCircle2 size={12} className="text-[#34d399]" />
          <span>Velocity measured from initial MQL qualification to contract closure</span>
        </span>
        <span>
          Total deals evaluated: {segments.reduce((acc, s) => acc + s.closed_deals_count, 0)}
        </span>
      </div>
    </div>
  );
};
