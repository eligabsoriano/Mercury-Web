import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Package,
  Calendar,
} from 'lucide-react';
import type { RevenueTrendPoint } from '../../api';

interface RevenueTrendChartProps {
  data: RevenueTrendPoint[] | null;
  isLoading?: boolean;
}

type TimeRangeFilter = 'all' | '12m' | '6m';
type SecondaryMetric = 'none' | 'orders' | 'late_rate';

function formatPeriod(period: string): string {
  const [year, month] = period.split('-');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const idx = parseInt(month, 10) - 1;
  return `${monthNames[idx] ?? month} '${year.slice(2)}`;
}

function formatFullPeriod(period: string): string {
  const [year, month] = period.split('-');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const idx = parseInt(month, 10) - 1;
  return `${monthNames[idx] ?? month} ${year}`;
}

function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }).format(amount);
}

// Custom Tooltip Component
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
    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xl min-w-[230px] text-xs">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
        <span className="font-display font-bold text-slate-900 text-sm">
          {formatFullPeriod(point.period)}
        </span>
        <span className="font-mono text-[10px] text-indigo-700 px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 font-semibold">
          {point.period}
        </span>
      </div>

      <div className="space-y-1.5 font-mono">
        <div className="flex justify-between items-center">
          <span className="text-slate-500 flex items-center space-x-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Delivered GMV:</span>
          </span>
          <span className="font-bold text-emerald-700 text-sm">
            {formatBRL(point.gmv)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 flex items-center space-x-1.5 font-sans">
            <Package size={13} className="text-sky-600" />
            <span>Total Orders:</span>
          </span>
          <span className="font-semibold text-slate-900">
            {point.orders_count.toLocaleString()} orders
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-slate-500 flex items-center space-x-1.5 font-sans">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>Avg Order Value:</span>
          </span>
          <span className="font-semibold text-slate-800">
            R$ {point.avg_order_value.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-1 border-t border-slate-100">
          <span className="text-slate-500 font-sans">Late Delivery Rate:</span>
          <span
            className={`font-semibold ${
              isLateHigh ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {(point.late_order_rate * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export const RevenueTrendChart: React.FC<RevenueTrendChartProps> = ({
  data,
  isLoading = false,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRangeFilter>('all');
  const [secondaryMetric, setSecondaryMetric] = useState<SecondaryMetric>('orders');

  const filteredTrends = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (timeRange === '6m') return data.slice(-6);
    if (timeRange === '12m') return data.slice(-12);
    return data;
  }, [data, timeRange]);

  const stats = useMemo(() => {
    if (!filteredTrends.length) {
      return { totalGMV: 0, totalOrders: 0, peakPeriod: '', peakGMV: 0 };
    }
    let totalGMV = 0;
    let totalOrders = 0;
    let peakGMV = 0;
    let peakPeriod = '';

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
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm relative overflow-hidden">
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
              Historical Delivered GMV & Order Velocity
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
              Monthly Timeseries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Gross merchandise value (product + shipping) delivered across 18 operational calendar months
          </p>
        </div>

        {/* Action Controls: Range Selector & Metric Mode */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time Range Tabs */}
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setTimeRange('all')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                timeRange === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Time (18m)
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('12m')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                timeRange === '12m'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Trailing 12m
            </button>
            <button
              type="button"
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                timeRange === '6m'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Recent 6m
            </button>
          </div>

          {/* Secondary Metric Toggle */}
          <div className="inline-flex rounded-xl p-0.5 bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setSecondaryMetric('orders')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                secondaryMetric === 'orders'
                  ? 'bg-white text-sky-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              + Orders
            </button>
            <button
              type="button"
              onClick={() => setSecondaryMetric('late_rate')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                secondaryMetric === 'late_rate'
                  ? 'bg-white text-rose-700 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              + Late Rate
            </button>
            <button
              type="button"
              onClick={() => setSecondaryMetric('none')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                secondaryMetric === 'none'
                  ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                  : 'text-slate-500 hover:text-slate-900'
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
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-mono animate-pulse">
            Hydrating timeseries revenue telemetry...
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={filteredTrends}
              margin={{ top: 12, right: 12, left: -8, bottom: 0 }}
            >
              <CartesianGrid
                stroke="#f1f5f9"
                strokeDasharray="3 3"
                vertical={false}
              />

              <XAxis
                dataKey="period"
                tickFormatter={formatPeriod}
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />

              {/* Primary Y-Axis: GMV */}
              <YAxis
                yAxisId="gmv"
                tickFormatter={(val: number) => `R$ ${(val / 1000).toFixed(0)}k`}
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
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
                  tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
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
                  fill="#0284c7"
                  fillOpacity={0.7}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
              )}

              {secondaryMetric === 'late_rate' && (
                <Bar
                  yAxisId="secondary"
                  dataKey="late_order_rate"
                  name="Late Delivery Rate"
                  fill="#e11d48"
                  fillOpacity={0.7}
                  radius={[4, 4, 0, 0]}
                  maxBarSize={24}
                />
              )}

              {/* Primary Area Layer: GMV */}
              <Area
                yAxisId="gmv"
                type="monotone"
                dataKey="gmv"
                name="Delivered GMV"
                stroke="#059669"
                strokeWidth={2}
                fillOpacity={0.12}
                fill="#059669"
                activeDot={{
                  r: 5,
                  fill: '#059669',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer Executive Telemetry Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <TrendingUp size={16} />
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Period Delivered Volume:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {formatBRL(stats.totalGMV)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
            <Package size={16} />
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">Total Ingested Orders:</span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {stats.totalOrders.toLocaleString()} orders
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
            <Calendar size={16} />
          </div>
          <div>
            <span className="text-slate-500 text-[11px] block">All-Time Peak Velocity:</span>
            <span className="font-mono font-bold text-indigo-700 text-sm">
              {stats.peakPeriod ? `${formatPeriod(stats.peakPeriod)} (${formatBRL(stats.peakGMV)})` : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
