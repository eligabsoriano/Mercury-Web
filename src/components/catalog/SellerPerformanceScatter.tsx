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
      className="p-3.5 rounded-xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md text-xs space-y-2 min-w-[230px]"
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <div>
          <span className="font-bold text-slate-900 font-mono text-xs block">
            {seller.seller_id.slice(0, 12)}...
          </span>
          <span className="text-[10px] text-slate-500 capitalize">
            {seller.city ?? 'São Paulo'}, {seller.state ?? 'BR'}
          </span>
        </div>
        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-mono font-bold text-[11px]">
          <Star size={11} className="fill-amber-500 text-amber-500" />
          <span>{(seller.avg_review_score ?? 4.0).toFixed(2)}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px]">
        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Gross GMV</span>
          <span className="font-bold text-emerald-700">{formatBRL(seller.total_revenue)}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Delivered Orders</span>
          <span className="font-semibold text-slate-900">{seller.total_orders_fulfilled}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Avg Line Item</span>
          <span className="font-semibold text-sky-700">R$ {seller.avg_item_value.toFixed(1)}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Transit Lead Time</span>
          <span
            className={`font-semibold ${
              isDelayPositive ? 'text-rose-600' : 'text-emerald-700'
            }`}
          >
            {isDelayPositive ? `+${seller.avg_delivery_delay_days}d late` : `${seller.avg_delivery_delay_days}d early`}
          </span>
        </div>

        <div className="col-span-2 pt-1 border-t border-slate-100 flex items-center justify-between">
          <span className="text-slate-500 text-[10px] uppercase">Late Delivery Rate</span>
          <span
            className={`font-bold ${
              isLateHigh ? 'text-rose-600' : 'text-emerald-700'
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
      <div className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
        <div className="h-64 bg-slate-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div
      data-testid="seller-performance-scatter-card"
      className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
              <Store size={16} />
            </span>
            <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">
              Seller Revenue vs Satisfaction Matrix
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Correlation between merchant gross GMV, customer review rating (★), and logistics delivery reliability
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] font-mono self-start sm:self-auto">
          <span className="flex items-center space-x-1 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>&lt;5% Late</span>
          </span>
          <span className="flex items-center space-x-1 text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>5–10% Late</span>
          </span>
          <span className="flex items-center space-x-1 text-rose-700">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>&gt;10% Late</span>
          </span>
        </div>
      </div>

      {/* Summary quadrant stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-500 block">
              Active Sellers Mapped
            </span>
            <span className="text-base font-bold text-slate-900 font-display">
              {scatterData.length} Merchants
            </span>
          </div>
          <span className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500">
            <Store size={16} />
          </span>
        </div>

        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-amber-700 block">
              Mean Review Rating
            </span>
            <span className="text-base font-bold text-amber-800 font-mono">
              ★ {avgSatisfaction.toFixed(2)} / 5.0
            </span>
          </div>
          <span className="p-2 rounded-lg bg-amber-100 text-amber-700">
            <Star size={16} className="fill-amber-500" />
          </span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono text-emerald-700 block">
              Logistics Health
            </span>
            <span className="text-base font-bold text-emerald-800">
              {(
                (scatterData.filter((s) => s.late_delivery_rate <= 0.08).length /
                  scatterData.length) *
                100
              ).toFixed(0)}
              % On-Time Target
            </span>
          </div>
          <span className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
            <ShieldCheck size={16} />
          </span>
        </div>
      </div>

      {/* Recharts Scatter Canvas */}
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 24, bottom: 10, left: 10 }}>
            <CartesianGrid
              stroke="#f1f5f9"
              strokeDasharray="3 3"
            />
            <XAxis
              type="number"
              dataKey="x"
              name="Revenue"
              unit=""
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
              tickFormatter={(v) => formatBRL(v)}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Rating"
              domain={[3.5, 5.0]}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'Inter' }}
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
                let fill = '#059669';
                if (entry.late_delivery_rate > 0.1) fill = '#e11d48';
                else if (entry.late_delivery_rate > 0.05) fill = '#d97706';

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

      <div className="mt-2 text-center text-[11px] text-slate-500 font-mono">
        Bubble diameter represents total delivered orders fulfilled by each merchant
      </div>
    </div>
  );
};
