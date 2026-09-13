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
    <div className="p-3.5 rounded-xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-xl text-xs space-y-2 min-w-[200px]">
      <div className="flex items-center space-x-2 pb-1.5 border-b border-slate-100">
        <Clock size={14} className="text-violet-600" />
        <span className="font-bold text-slate-900 font-display">
          {formatName(item.business_segment)}
        </span>
      </div>

      <div className="space-y-1 font-mono text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-500">Average Cycle:</span>
          <span className="font-bold text-violet-700">{item.avg_days_to_close.toFixed(1)} days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Fastest Close:</span>
          <span className="text-emerald-600 font-medium">{item.min_days_to_close} days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Slowest Close:</span>
          <span className="text-rose-600 font-medium">{item.max_days_to_close} days</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-slate-100">
          <span className="text-slate-500">Deals Closed:</span>
          <span className="font-bold text-slate-900">{item.closed_deals_count}</span>
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
    <div className="p-3.5 rounded-xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-xl text-xs space-y-2 min-w-[200px]">
      <div className="flex items-center space-x-2 pb-1.5 border-b border-slate-100">
        <Clock size={14} className="text-sky-600" />
        <span className="font-bold text-slate-900 font-display">
          {formatName(item.lead_type)}
        </span>
      </div>

      <div className="space-y-1 font-mono text-[11px]">
        <div className="flex justify-between">
          <span className="text-slate-500">Average Cycle:</span>
          <span className="font-bold text-sky-700">{item.avg_days_to_close.toFixed(1)} days</span>
        </div>
        <div className="flex justify-between pt-1 border-t border-slate-100">
          <span className="text-slate-500">Deals Closed:</span>
          <span className="font-bold text-slate-900">{item.closed_deals_count}</span>
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
      <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
        <div className="h-6 w-48 bg-slate-100 rounded mb-4" />
        <div className="h-64 bg-slate-50 rounded-xl" />
      </div>
    );
  }

  return (
    <div
      data-testid="velocity-distribution-card"
      className={`bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-600">
              <Clock size={16} />
            </span>
            <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">
              Sales Cycle Velocity Distribution
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Time-to-close metrics analyzed across merchant product segments and prospect lead profiles
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('segment')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'segment'
                ? 'bg-violet-50 text-violet-700 border border-violet-200 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Segment
          </button>
          <button
            type="button"
            onClick={() => setViewMode('lead_type')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              viewMode === 'lead_type'
                ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Lead Type
          </button>
        </div>
      </div>

      {/* Velocity Badges & Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-500 block">
              Portfolio Average Cycle
            </span>
            <span className="text-lg font-extrabold text-slate-900 font-display">
              {data.overall_avg_days_to_close.toFixed(1)} Days
            </span>
          </div>
          <span className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 shadow-xs">
            <Clock size={16} />
          </span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-emerald-800 block">
              Fastest Moving Segment
            </span>
            <span className="text-base font-bold text-emerald-700">
              {formatName(data.fastest_segment ?? 'home_appliances')}
            </span>
          </div>
          <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700 shadow-xs">
            <Zap size={16} />
          </span>
        </div>

        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-rose-800 block">
              Longest Sales Cycle
            </span>
            <span className="text-base font-bold text-rose-700">
              {formatName(data.slowest_segment ?? 'fashion_clothing')}
            </span>
          </div>
          <span className="p-2 rounded-lg bg-rose-100 text-rose-700 shadow-xs">
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
                stroke="#f1f5f9"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="displayName"
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
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
                        ? '#10b981'
                        : index === segments.length - 1
                        ? '#f43f5e'
                        : '#8b5cf6'
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
                stroke="#f1f5f9"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="displayName"
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
              />
              <YAxis
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
                unit="d"
              />
              <Tooltip content={<CustomLeadTypeTooltip />} />
              <Bar
                dataKey="avg_days_to_close"
                name="Avg Days to Close"
                fill="#0284c7"
                radius={[6, 6, 0, 0]}
                barSize={40}
              >
                {leadTypes.map((entry, idx) => (
                  <Cell
                    key={`lead-${entry.lead_type}`}
                    fill={idx === 0 ? '#10b981' : idx === 1 ? '#0284c7' : '#f59e0b'}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Subtext info */}
      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-slate-100 pt-2.5">
        <span className="flex items-center space-x-1">
          <CheckCircle2 size={12} className="text-emerald-600" />
          <span>Velocity measured from initial MQL qualification to contract closure</span>
        </span>
        <span>
          Total deals evaluated: {segments.reduce((acc, s) => acc + s.closed_deals_count, 0)}
        </span>
      </div>
    </div>
  );
};
