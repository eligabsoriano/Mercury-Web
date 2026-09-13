import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import {
  Layers,
  ArrowUpDown,
  Award,
  Zap,
} from 'lucide-react';
import type { ChannelAttribution } from '../../api';

export interface ChannelAttributionChartProps {
  channels?: ChannelAttribution[] | null;
  isLoading?: boolean;
  className?: string;
}

type MetricMode = 'volume' | 'conversion' | 'revenue';
type SortKey = 'leads' | 'deals' | 'conversion' | 'revenue';

const CHANNEL_COLORS: Record<string, string> = {
  organic_search: '#38bdf8',
  paid_search: '#818cf8',
  social_media: '#c084fc',
  direct_traffic: '#34d399',
  email_campaign: '#fbbf24',
  referral: '#f472b6',
  other: '#94a3b8',
};

function formatOriginName(origin: string): string {
  return origin.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatBRL(amount: number): string {
  if (amount >= 1_000_000) return `R$ ${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `R$ ${(amount / 1_000).toFixed(0)}k`;
  return `R$ ${amount.toLocaleString()}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChannelAttribution;
  }>;
}

const CustomAttributionTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  const color = CHANNEL_COLORS[item.origin] || '#38bdf8';

  return (
    <div
      data-testid="channel-tooltip"
      className="p-3.5 rounded-xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-xl text-xs space-y-2 min-w-[220px]"
    >
      <div className="flex items-center space-x-2 pb-1.5 border-b border-slate-100">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="font-bold text-slate-900 font-display text-sm">
          {formatOriginName(item.origin)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px]">
        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Leads Count</span>
          <span className="font-semibold text-slate-800">
            {item.leads_count.toLocaleString()} ({item.share_of_leads_percent.toFixed(1)}%)
          </span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Closed Deals</span>
          <span className="font-semibold text-emerald-600">{item.closed_deals_count}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Conversion Rate</span>
          <span className="font-bold text-sky-600">
            {(item.conversion_rate > 1 ? item.conversion_rate : item.conversion_rate * 100).toFixed(1)}%
          </span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Sales Velocity</span>
          <span className="font-semibold text-amber-600">{item.avg_days_to_close.toFixed(1)} days</span>
        </div>

        <div className="col-span-2 pt-1 border-t border-slate-100">
          <span className="text-slate-500 block text-[10px] uppercase">Realized GMV</span>
          <span className="font-bold text-emerald-600 text-xs">
            {formatBRL(item.total_actual_marketplace_revenue)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const ChannelAttributionChart: React.FC<ChannelAttributionChartProps> = ({
  channels,
  isLoading = false,
  className = '',
}) => {
  const [metricMode, setMetricMode] = useState<MetricMode>('volume');
  const [sortKey, setSortKey] = useState<SortKey>('leads');

  const rawList = useMemo(() => {
    return (
      channels ?? [
        { origin: 'organic_search', leads_count: 2296, share_of_leads_percent: 28.7, closed_deals_count: 271, conversion_rate: 11.8, total_declared_monthly_revenue: 3850000, total_actual_marketplace_revenue: 2980400, avg_days_to_close: 16.2 },
        { origin: 'paid_search', leads_count: 1586, share_of_leads_percent: 19.8, closed_deals_count: 195, conversion_rate: 12.3, total_declared_monthly_revenue: 2900000, total_actual_marketplace_revenue: 2240100, avg_days_to_close: 15.4 },
        { origin: 'social_media', leads_count: 1350, share_of_leads_percent: 16.9, closed_deals_count: 112, conversion_rate: 8.3, total_declared_monthly_revenue: 1650000, total_actual_marketplace_revenue: 1050200, avg_days_to_close: 21.8 },
        { origin: 'direct_traffic', leads_count: 980, share_of_leads_percent: 12.2, closed_deals_count: 118, conversion_rate: 12.0, total_declared_monthly_revenue: 1820000, total_actual_marketplace_revenue: 1190400, avg_days_to_close: 14.8 },
        { origin: 'email_campaign', leads_count: 820, share_of_leads_percent: 10.2, closed_deals_count: 78, conversion_rate: 9.5, total_declared_monthly_revenue: 1200000, total_actual_marketplace_revenue: 680000, avg_days_to_close: 19.1 },
        { origin: 'referral', leads_count: 540, share_of_leads_percent: 6.8, closed_deals_count: 45, conversion_rate: 8.3, total_declared_monthly_revenue: 720000, total_actual_marketplace_revenue: 340000, avg_days_to_close: 22.4 },
        { origin: 'other', leads_count: 428, share_of_leads_percent: 5.4, closed_deals_count: 23, conversion_rate: 5.4, total_declared_monthly_revenue: 410000, total_actual_marketplace_revenue: 161000, avg_days_to_close: 26.5 },
      ]
    );
  }, [channels]);

  // Normalized items with formatted names
  const sortedData = useMemo(() => {
    const list = [...rawList].map((item) => ({
      ...item,
      normalizedConversion: item.conversion_rate > 1 ? item.conversion_rate : item.conversion_rate * 100,
      displayName: formatOriginName(item.origin),
    }));

    list.sort((a, b) => {
      if (sortKey === 'leads') return b.leads_count - a.leads_count;
      if (sortKey === 'deals') return b.closed_deals_count - a.closed_deals_count;
      if (sortKey === 'conversion') return b.normalizedConversion - a.normalizedConversion;
      if (sortKey === 'revenue') return b.total_actual_marketplace_revenue - a.total_actual_marketplace_revenue;
      return 0;
    });

    return list;
  }, [rawList, sortKey]);

  // Highlights
  const topConversion = useMemo(() => {
    if (!sortedData.length) return null;
    return [...sortedData].sort((a, b) => b.normalizedConversion - a.normalizedConversion)[0];
  }, [sortedData]);

  const topRevenue = useMemo(() => {
    if (!sortedData.length) return null;
    return [...sortedData].sort((a, b) => b.total_actual_marketplace_revenue - a.total_actual_marketplace_revenue)[0];
  }, [sortedData]);

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
      data-testid="channel-attribution-card"
      className={`bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden ${className}`}
    >
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-600">
              <Layers size={16} />
            </span>
            <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">
              Origin Channel Attribution &amp; Conversion
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparative performance of inbound acquisition channels across leads volume, won deals, and realized GMV
          </p>
        </div>

        {/* View mode buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setMetricMode('volume');
                setSortKey('leads');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                metricMode === 'volume'
                  ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Leads &amp; Deals
            </button>
            <button
              type="button"
              onClick={() => {
                setMetricMode('conversion');
                setSortKey('conversion');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                metricMode === 'conversion'
                  ? 'bg-violet-50 text-violet-700 border border-violet-200 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Conversion Rate (%)
            </button>
            <button
              type="button"
              onClick={() => {
                setMetricMode('revenue');
                setSortKey('revenue');
              }}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                metricMode === 'revenue'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Realized GMV
            </button>
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <ArrowUpDown size={12} className="text-slate-500" />
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="bg-transparent text-slate-700 focus:text-slate-900 outline-none cursor-pointer text-xs"
            >
              <option value="leads" className="bg-white text-slate-900">Sort: Lead Volume</option>
              <option value="deals" className="bg-white text-slate-900">Sort: Closed Deals</option>
              <option value="conversion" className="bg-white text-slate-900">Sort: Conversion %</option>
              <option value="revenue" className="bg-white text-slate-900">Sort: Realized GMV</option>
            </select>
          </div>
        </div>
      </div>

      {/* Insight Highlight Chips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {topConversion && (
          <div className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-violet-50 border border-violet-100 text-xs">
            <Award size={15} className="text-violet-600 shrink-0" />
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">
                Highest Conversion Efficiency
              </span>
              <span className="font-bold text-slate-900">
                {topConversion.displayName}:{' '}
                <span className="text-violet-700 font-mono">{topConversion.normalizedConversion.toFixed(1)}%</span>
              </span>
              <span className="text-[11px] text-slate-500 ml-1.5">
                ({topConversion.closed_deals_count} won from {topConversion.leads_count.toLocaleString()} leads)
              </span>
            </div>
          </div>
        )}

        {topRevenue && (
          <div className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-xs">
            <Zap size={15} className="text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">
                Top Revenue Producing Channel
              </span>
              <span className="font-bold text-slate-900">
                {topRevenue.displayName}:{' '}
                <span className="text-emerald-700 font-mono">{formatBRL(topRevenue.total_actual_marketplace_revenue)}</span>
              </span>
              <span className="text-[11px] text-slate-500 ml-1.5">
                ({topRevenue.share_of_leads_percent.toFixed(1)}% of total leads)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 10, right: 24, left: 16, bottom: 5 }}
          >
            <CartesianGrid
              stroke="#f1f5f9"
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
              tickFormatter={(v) => {
                if (metricMode === 'revenue') return formatBRL(v);
                if (metricMode === 'conversion') return `${v}%`;
                return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString();
              }}
            />
            <YAxis
              type="category"
              dataKey="displayName"
              width={110}
              tick={{ fill: '#475569', fontSize: 11, fontFamily: 'Inter' }}
            />
            <Tooltip content={<CustomAttributionTooltip />} />

            {metricMode === 'volume' && (
              <>
                <Legend
                  wrapperStyle={{ paddingTop: 8 }}
                  formatter={(value) => (
                    <span className="text-xs text-[var(--text-secondary)] font-medium">
                      {value === 'leads_count' ? 'MQL Registrations' : 'Won Deals Closed'}
                    </span>
                  )}
                />
                <Bar
                  dataKey="leads_count"
                  name="leads_count"
                  fill="#38bdf8"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
                <Bar
                  dataKey="closed_deals_count"
                  name="closed_deals_count"
                  fill="#34d399"
                  radius={[0, 4, 4, 0]}
                  barSize={12}
                />
              </>
            )}

            {metricMode === 'conversion' && (
              <Bar
                dataKey="normalizedConversion"
                name="Conversion Rate"
                radius={[0, 6, 6, 0]}
                barSize={18}
              >
                {sortedData.map((entry) => (
                  <Cell
                    key={`cell-conv-${entry.origin}`}
                    fill={CHANNEL_COLORS[entry.origin] || '#8b5cf6'}
                  />
                ))}
              </Bar>
            )}

            {metricMode === 'revenue' && (
              <Bar
                dataKey="total_actual_marketplace_revenue"
                name="Realized GMV"
                radius={[0, 6, 6, 0]}
                barSize={18}
              >
                {sortedData.map((entry) => (
                  <Cell
                    key={`cell-rev-${entry.origin}`}
                    fill={CHANNEL_COLORS[entry.origin] || '#34d399'}
                  />
                ))}
              </Bar>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
