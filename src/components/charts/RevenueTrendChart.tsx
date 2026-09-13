import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Calendar, TrendingUp, DollarSign, Package, AlertCircle } from 'lucide-react';
import type { RevenueAnalyticsResponse, RevenueTrendPoint } from '../../api';

interface RevenueTrendChartProps {
  data: RevenueAnalyticsResponse | null;
  isLoading?: boolean;
}

type TimeRange = 'all' | '12m' | '6m';
type SecondaryMetric = 'orders' | 'late_rate' | 'none';

// Format YYYY-MM into human-friendly short month (e.g. 'Nov 17')
function formatPeriod(period: string): string {
  const parts = period.split('-');
  if (parts.length < 2) return period;
  const monthIdx = parseInt(parts[1], 10) - 1;
  const yearShort = parts[0].slice(2);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[monthIdx] || parts[1]} '${yearShort}`;
}

// Format full month name (e.g. 'November 2017')
function formatFullPeriod(period: string): string {
  const parts = period.split('-');
  if (parts.length < 2) return period;
  const monthIdx = parseInt(parts[1], 10) - 1;
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${monthNames[monthIdx] || parts[1]} ${parts[0]}`;
}

// Format BRL currency
function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Custom Liquid Glass Tooltip Component
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    payload: RevenueTrendPoint;
  }>;
  label?: string;
}

const CustomLiquidGlassTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const point = payload[0].payload;
  const isLateHigh = point.late_order_rate >= 0.08;

  return (
    <div className="liquid-glass p-4 rounded-2xl border border-[rgba(255,255,255,0.14)] shadow-[0_12px_32px_rgba(0,0,0,0.55)] min-w-[240px] text-xs backdrop-blur-2xl">
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[rgba(255,255,255,0.08)]">
        <span className="font-display font-bold text-white text-sm">
          {formatFullPeriod(point.period)}
        </span>
        <span className="font-mono text-[10px] text-[var(--accent-cyan)] px-2 py-0.5 rounded-full bg-[rgba(56,189,248,0.12)] border border-[rgba(56,189,248,0.25)]">
          {point.period}
        </span>
      </div>

      <div className="space-y-2 font-mono">
        <div className="flex justify-between items-center">
          <span className="text-[var(--text-secondary)] flex items-center space-x-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-[#34d399] shadow-[0_0_8px_#34d399]" />
            <span>Delivered GMV:</span>
          </span>
          <span className="font-bold text-[#6ee7b7] text-sm">
            {formatBRL(point.gmv)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[var(--text-secondary)] flex items-center space-x-1.5 font-sans">
            <Package size={13} className="text-[#38bdf8]" />
            <span>Total Orders:</span>
          </span>
          <span className="font-semibold text-white">
            {point.orders_count.toLocaleString()} orders
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[var(--text-secondary)] flex items-center space-x-1.5 font-sans">
            <DollarSign size={13} className="text-[#a78bfa]" />
            <span>Avg Order Value:</span>
          </span>
          <span className="font-semibold text-[#c084fc]">
            {formatBRL(point.avg_order_value)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1.5 border-t border-[rgba(255,255,255,0.06)]">
          <span className="text-[var(--text-secondary)] flex items-center space-x-1.5 font-sans">
            <AlertCircle size={13} className={isLateHigh ? 'text-[#f43f5e]' : 'text-[var(--text-muted)]'} />
            <span>Late Delivery Rate:</span>
          </span>
          <span className={`font-semibold ${isLateHigh ? 'text-[#f87171]' : 'text-[var(--text-secondary)]'}`}>
            {(point.late_order_rate * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({ data, isLoading = false }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('all');
  const [secondaryMetric, setSecondaryMetric] = useState<SecondaryMetric>('orders');
  // Filter trends based on active time range
  const filteredTrends = useMemo(() => {
    const raw = data?.trends ?? [];
    if (!raw.length) return [];
    if (timeRange === '6m') return raw.slice(-6);
    if (timeRange === '12m') return raw.slice(-12);
    return raw;
  }, [data?.trends, timeRange]);

  // Aggregate stats for executive summary pills
  const stats = useMemo(() => {
    if (!filteredTrends.length) return { totalGMV: 0, totalOrders: 0, peakPeriod: '', peakGMV: 0 };
    let totalGMV = 0;
    let totalOrders = 0;
    let peakPeriod = '';
    let peakGMV = 0;

    for (const p of filteredTrends) {
      totalGMV += p.gmv;
      totalOrders += p.orders_count;
      if (p.gmv > peakGMV) {
        peakGMV = p.gmv;
        peakPeriod = p.period;
      }
    }
    return { totalGMV, totalOrders, peakPeriod, peakGMV };
  }, [filteredTrends]);

  return (
    <div className="liquid-glass rounded-2xl p-5 md:p-6 border border-[rgba(255,255,255,0.09)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative overflow-hidden">
      {/* Background specular sheen */}
      <div className="absolute top-0 right-1/4 w-96 h-44 bg-[radial-gradient(ellipse_at_top,rgba(52,211,153,0.12),transparent_70%)] pointer-events-none" />

      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.07)]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display font-bold text-lg text-white tracking-tight">
              Historical Delivered GMV & Order Velocity
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[rgba(52,211,153,0.14)] text-[#6ee7b7] border border-[rgba(52,211,153,0.3)] font-semibold">
              Monthly Timeseries
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Gross merchandise value (product + shipping) delivered across 18 operational calendar months
          </p>
        </div>

        {/* Action Controls: Range Selector & Metric Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Tabs */}
          <div className="inline-flex rounded-xl p-1 bg-[rgba(15,23,42,0.8)] border border-[rgba(255,255,255,0.08)]">
            <button
              type="button"
              onClick={() => setTimeRange('all')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                timeRange === 'all'
                  ? 'bg-[rgba(52,211,153,0.22)] text-[#6ee7b7] border border-[rgba(52,211,153,0.35)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              All Time (18m)
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('12m')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                timeRange === '12m'
                  ? 'bg-[rgba(52,211,153,0.22)] text-[#6ee7b7] border border-[rgba(52,211,153,0.35)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              Trailing 12m
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                timeRange === '6m'
                  ? 'bg-[rgba(52,211,153,0.22)] text-[#6ee7b7] border border-[rgba(52,211,153,0.35)] shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              Recent 6m
            </button>
          </div>

          {/* Secondary Metric Toggle */}
          <div className="inline-flex rounded-xl p-1 bg-[rgba(15,23,42,0.8)] border border-[rgba(255,255,255,0.08)] text-xs">
            <button
              type="button"
              onClick={() => setSecondaryMetric('orders')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                secondaryMetric === 'orders'
                  ? 'bg-[rgba(56,189,248,0.22)] text-[#7dd3fc] border border-[rgba(56,189,248,0.35)]'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              + Orders
            </button>
            <button
              type="button"
              onClick={() => setSecondaryMetric('late_rate')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                secondaryMetric === 'late_rate'
                  ? 'bg-[rgba(244,63,94,0.22)] text-[#fda4af] border border-[rgba(244,63,94,0.35)]'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              + Late Rate
            </button>
            <button
              type="button"
              onClick={() => setSecondaryMetric('none')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                secondaryMetric === 'none'
                  ? 'bg-[rgba(255,255,255,0.12)] text-white'
                  : 'text-[var(--text-muted)] hover:text-white'
              }`}
            >
              GMV Only
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-5 w-full h-[320px]">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-[var(--text-secondary)] font-mono animate-pulse">
            Hydrating timeseries revenue telemetry...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredTrends}
              margin={{ top: 12, right: 12, left: -8, bottom: 0 }}
            >
              <defs>
                {/* Delivered GMV Gradient */}
                <linearGradient id="mercuryGmvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#34d399" stopOpacity={0.45} />
                  <stop offset="60%" stopColor="#34d399" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#34d399" stopOpacity={0.0} />
                </linearGradient>

                {/* Orders Bar Gradient */}
                <linearGradient id="mercuryOrdersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.75} />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.18} />
                </linearGradient>

                {/* Late Rate Bar Gradient */}
                <linearGradient id="mercuryLateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.75} />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="period"
                tickFormatter={formatPeriod}
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                tickLine={false}
              />

              {/* Primary Y-Axis: GMV */}
              <YAxis
                yAxisId="gmv"
                tickFormatter={(val: number) => `R$ ${(val / 1000).toFixed(0)}k`}
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
                axisLine={false}
                tickLine={false}
                width={65}
              />

              {/* Secondary Y-Axis: Orders or Late Rate */}
              {secondaryMetric !== 'none' && (
                <YAxis
                  yAxisId="secondary"
                  orientation="right"
                  tickFormatter={(val: number) =>
                    secondaryMetric === 'late_rate'
                      ? `${(val * 100).toFixed(0)}%`
                      : `${(val / 1000).toFixed(1)}k`
                  }
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
                  axisLine={false}
                  tickLine={false}
                  width={45}
                />
              )}

              <Tooltip content={<CustomLiquidGlassTooltip />} />

              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '8px', fontSize: '11px', fontFamily: 'Inter' }}
              />

              {/* Secondary Bar Layer */}
              {secondaryMetric === 'orders' && (
                <Bar
                  yAxisId="secondary"
                  dataKey="orders_count"
                  name="Orders Delivered"
                  fill="url(#mercuryOrdersGradient)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              )}

              {secondaryMetric === 'late_rate' && (
                <Bar
                  yAxisId="secondary"
                  dataKey="late_order_rate"
                  name="Late Delivery Rate"
                  fill="url(#mercuryLateGradient)"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={28}
                />
              )}

              {/* Primary Area Layer: GMV */}
              <Area
                yAxisId="gmv"
                type="monotone"
                dataKey="gmv"
                name="Delivered GMV"
                stroke="#34d399"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#mercuryGmvGradient)"
                activeDot={{
                  r: 6,
                  fill: '#34d399',
                  stroke: '#0f172a',
                  strokeWidth: 3,
                  className: 'animate-pulse',
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Executive Telemetry Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-3 border-t border-[rgba(255,255,255,0.06)] text-xs">
        <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[rgba(15,23,42,0.5)] border border-[rgba(255,255,255,0.05)]">
          <div className="w-8 h-8 rounded-lg bg-[rgba(52,211,153,0.15)] flex items-center justify-center text-[#34d399]">
            <TrendingUp size={16} />
          </div>
          <div>
            <span className="text-[var(--text-muted)] text-[11px] block">Period Delivered Volume:</span>
            <span className="font-mono font-bold text-white text-sm">
              {formatBRL(stats.totalGMV)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[rgba(15,23,42,0.5)] border border-[rgba(255,255,255,0.05)]">
          <div className="w-8 h-8 rounded-lg bg-[rgba(56,189,248,0.15)] flex items-center justify-center text-[#38bdf8]">
            <Package size={16} />
          </div>
          <div>
            <span className="text-[var(--text-muted)] text-[11px] block">Total Ingested Orders:</span>
            <span className="font-mono font-bold text-white text-sm">
              {stats.totalOrders.toLocaleString()} orders
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-[rgba(15,23,42,0.5)] border border-[rgba(255,255,255,0.05)]">
          <div className="w-8 h-8 rounded-lg bg-[rgba(139,92,246,0.15)] flex items-center justify-center text-[#c084fc]">
            <Calendar size={16} />
          </div>
          <div>
            <span className="text-[var(--text-muted)] text-[11px] block">All-Time Peak Velocity:</span>
            <span className="font-mono font-bold text-[#c4b5fd] text-sm">
              {stats.peakPeriod ? `${formatPeriod(stats.peakPeriod)} (${formatBRL(stats.peakGMV)})` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
