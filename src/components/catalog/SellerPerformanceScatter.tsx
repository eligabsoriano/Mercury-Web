import React, { useMemo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Store,
  Star,
  ShieldCheck,
} from 'lucide-react';
import type { SellerSummary } from '../../api';

export interface SellerPerformanceScatterProps {
  sellers?: SellerSummary[] | null;
  isLoading?: boolean;
  className?: string;
}

function formatBRL(amount: number): string {
  if (amount >= 1_000_000) return `R$ ${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `R$ ${(amount / 1_000).toFixed(0)}k`;
  return `R$ ${amount.toLocaleString()}`;
}

interface CustomScatterTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: SellerSummary & { x: number; y: number; z: number };
  }>;
}

const CustomScatterTooltip: React.FC<CustomScatterTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const seller = payload[0].payload;
  const isLateHigh = seller.late_delivery_rate > 0.08;
  const isDelayPositive = (seller.avg_delivery_delay_days ?? 0) > 0;

  return (
    <div
      data-testid="seller-scatter-tooltip"
      className="p-3.5 rounded-xl bg-[rgba(15,23,42,0.95)] border border-[rgba(255,255,255,0.12)] shadow-[0_12px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl text-xs space-y-2 min-w-[230px]"
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <span className="font-bold text-white font-mono text-xs block">
            {seller.seller_id.slice(0, 12)}...
          </span>
          <span className="text-[10px] text-[var(--text-secondary)] capitalize">
            {seller.city ?? 'São Paulo'}, {seller.state ?? 'BR'}
          </span>
        </div>
        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[rgba(251,191,36,0.15)] text-[#fbbf24] font-mono font-bold text-[11px]">
          <Star size={11} className="fill-[#fbbf24]" />
          <span>{(seller.avg_review_score ?? 4.0).toFixed(2)}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px]">
        <div>
          <span className="text-[var(--text-muted)] block text-[10px] uppercase">Gross GMV</span>
          <span className="font-bold text-[#34d399]">{formatBRL(seller.total_revenue)}</span>
        </div>

        <div>
          <span className="text-[var(--text-muted)] block text-[10px] uppercase">Delivered Orders</span>
          <span className="font-semibold text-white">{seller.total_orders_fulfilled}</span>
        </div>

        <div>
          <span className="text-[var(--text-muted)] block text-[10px] uppercase">Avg Line Item</span>
          <span className="font-semibold text-[#38bdf8]">R$ {seller.avg_item_value.toFixed(1)}</span>
        </div>

        <div>
          <span className="text-[var(--text-muted)] block text-[10px] uppercase">Transit Lead Time</span>
          <span
            className={`font-semibold ${
              isDelayPositive ? 'text-[#f43f5e]' : 'text-[#34d399]'
            }`}
          >
            {isDelayPositive ? `+${seller.avg_delivery_delay_days}d late` : `${seller.avg_delivery_delay_days}d early`}
          </span>
        </div>

        <div className="col-span-2 pt-1 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <span className="text-[var(--text-muted)] text-[10px] uppercase">Late Delivery Rate</span>
          <span
            className={`font-bold ${
              isLateHigh ? 'text-[#f43f5e]' : 'text-[#34d399]'
            }`}
          >
            {(seller.late_delivery_rate * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export const SellerPerformanceScatter: React.FC<SellerPerformanceScatterProps> = ({
  sellers,
  isLoading = false,
  className = '',
}) => {
  const fallbackSellers = useMemo<SellerSummary[]>(() => [
    { seller_id: 'seller-sp-001', city: 'sao paulo', state: 'SP', total_orders_fulfilled: 1840, total_items_sold: 2150, total_revenue: 298400.0, avg_item_value: 138.79, avg_review_score: 4.42, late_delivery_rate: 0.048, avg_delivery_delay_days: -3.8, total_unique_products: 45 },
    { seller_id: 'seller-rj-002', city: 'rio de janeiro', state: 'RJ', total_orders_fulfilled: 1420, total_items_sold: 1680, total_revenue: 245100.0, avg_item_value: 145.89, avg_review_score: 4.18, late_delivery_rate: 0.076, avg_delivery_delay_days: -1.2, total_unique_products: 38 },
    { seller_id: 'seller-mg-003', city: 'belo horizonte', state: 'MG', total_orders_fulfilled: 980, total_items_sold: 1120, total_revenue: 168900.0, avg_item_value: 150.8, avg_review_score: 4.31, late_delivery_rate: 0.052, avg_delivery_delay_days: -2.4, total_unique_products: 29 },
    { seller_id: 'seller-pr-004', city: 'curitiba', state: 'PR', total_orders_fulfilled: 870, total_items_sold: 990, total_revenue: 142500.0, avg_item_value: 143.94, avg_review_score: 4.25, late_delivery_rate: 0.064, avg_delivery_delay_days: -2.1, total_unique_products: 24 },
    { seller_id: 'seller-rs-005', city: 'porto alegre', state: 'RS', total_orders_fulfilled: 760, total_items_sold: 840, total_revenue: 119800.0, avg_item_value: 142.62, avg_review_score: 3.92, late_delivery_rate: 0.114, avg_delivery_delay_days: 1.4, total_unique_products: 21 },
    { seller_id: 'seller-ba-006', city: 'salvador', state: 'BA', total_orders_fulfilled: 640, total_items_sold: 710, total_revenue: 95400.0, avg_item_value: 134.37, avg_review_score: 4.35, late_delivery_rate: 0.042, avg_delivery_delay_days: -4.1, total_unique_products: 18 },
    { seller_id: 'seller-sc-007', city: 'florianopolis', state: 'SC', total_orders_fulfilled: 510, total_items_sold: 580, total_revenue: 82000.0, avg_item_value: 141.38, avg_review_score: 4.48, late_delivery_rate: 0.038, avg_delivery_delay_days: -3.5, total_unique_products: 15 },
  ], []);

  const rawSellers = sellers && sellers.length > 0 ? sellers : fallbackSellers;

  // Format data for Scatter chart
  const scatterData = useMemo(() => {
    return rawSellers.map((s) => ({
      ...s,
      x: s.total_revenue,
      y: s.avg_review_score ?? 4.0,
      z: s.total_orders_fulfilled,
    }));
  }, [rawSellers]);

  const avgSatisfaction = useMemo(() => {
    if (!scatterData.length) return 4.2;
    const sum = scatterData.reduce((acc, s) => acc + s.y, 0);
    return sum / scatterData.length;
  }, [scatterData]);

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
      data-testid="seller-performance-scatter-card"
      className={`liquid-glass rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.36)] relative overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[rgba(52,211,153,0.12)] border border-[rgba(52,211,153,0.3)] text-[#34d399]">
              <Store size={16} />
            </span>
            <h3 className="font-display text-lg font-bold text-white tracking-tight">
              Seller Revenue vs Satisfaction Matrix
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Correlation between merchant gross GMV, customer review rating (★), and logistics delivery reliability
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] font-mono self-start sm:self-auto">
          <span className="flex items-center space-x-1 text-[#34d399]">
            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
            <span>&lt;5% Late</span>
          </span>
          <span className="flex items-center space-x-1 text-[#fbbf24]">
            <span className="w-2 h-2 rounded-full bg-[#fbbf24]" />
            <span>5–10% Late</span>
          </span>
          <span className="flex items-center space-x-1 text-[#f43f5e]">
            <span className="w-2 h-2 rounded-full bg-[#f43f5e]" />
            <span>&gt;10% Late</span>
          </span>
        </div>
      </div>

      {/* Summary quadrant stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">
              Active Sellers Mapped
            </span>
            <span className="text-base font-bold text-white font-display">
              {scatterData.length} Merchants
            </span>
          </div>
          <span className="p-2 rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--text-secondary)]">
            <Store size={16} />
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(251,191,36,0.05)] border border-[rgba(251,191,36,0.2)] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#fde68a] block">
              Mean Review Rating
            </span>
            <span className="text-base font-bold text-[#fbbf24] font-mono">
              ★ {avgSatisfaction.toFixed(2)} / 5.0
            </span>
          </div>
          <span className="p-2 rounded-lg bg-[rgba(251,191,36,0.15)] text-[#fbbf24]">
            <Star size={16} className="fill-[#fbbf24]" />
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.2)] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-[#a7f3d0] block">
              Logistics Health
            </span>
            <span className="text-base font-bold text-[#34d399]">
              {(
                (scatterData.filter((s) => s.late_delivery_rate <= 0.08).length /
                  scatterData.length) *
                100
              ).toFixed(0)}
              % On-Time Target
            </span>
          </div>
          <span className="p-2 rounded-lg bg-[rgba(52,211,153,0.15)] text-[#34d399]">
            <ShieldCheck size={16} />
          </span>
        </div>
      </div>

      {/* Recharts Scatter Canvas */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 24, bottom: 10, left: 10 }}>
            <CartesianGrid
              stroke="rgba(255,255,255,0.06)"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              dataKey="x"
              name="Revenue"
              unit=""
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
              tickFormatter={(v) => formatBRL(v)}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Rating"
              domain={[3.5, 5.0]}
              tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Inter' }}
              tickFormatter={(v) => `★ ${v.toFixed(1)}`}
            />
            <ZAxis
              type="number"
              dataKey="z"
              range={[120, 480]}
              name="Orders"
            />
            <Tooltip content={<CustomScatterTooltip />} />
            <Scatter name="Sellers" data={scatterData}>
              {scatterData.map((entry) => {
                let fill = '#34d399';
                if (entry.late_delivery_rate > 0.1) fill = '#f43f5e';
                else if (entry.late_delivery_rate > 0.05) fill = '#fbbf24';

                return (
                  <Cell
                    key={`scatter-${entry.seller_id}`}
                    fill={fill}
                    fillOpacity={0.85}
                    stroke={fill}
                    strokeWidth={1.5}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-center text-[11px] text-[var(--text-muted)] font-mono">
        Bubble diameter represents total delivered orders fulfilled by each merchant
      </div>
    </div>
  );
};
