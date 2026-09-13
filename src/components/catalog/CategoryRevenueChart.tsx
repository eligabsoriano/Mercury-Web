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
  BarChart3,
  Star,
  Award,
} from 'lucide-react';
import type { CategoryPerformance } from '../../api';

export interface CategoryRevenueChartProps {
  categories?: CategoryPerformance[] | null;
  isLoading?: boolean;
  className?: string;
}

type ChartMetric = 'revenue' | 'units' | 'products';

function formatName(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatBRL(amount: number): string {
  if (amount >= 1_000_000) return `R$ ${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `R$ ${(amount / 1_000).toFixed(0)}k`;
  return `R$ ${amount.toLocaleString()}`;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: CategoryPerformance;
  }>;
}

const CustomCategoryTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;

  return (
    <div
      data-testid="category-chart-tooltip"
      className="p-3.5 rounded-xl bg-white/95 border border-slate-200 shadow-xl backdrop-blur-md text-xs space-y-2 min-w-[220px]"
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
        <div>
          <span className="font-bold text-slate-900 font-display text-sm block">
            {formatName(item.category)}
          </span>
          {item.category_pt && (
            <span className="text-[10px] text-slate-500 italic">
              {item.category_pt}
            </span>
          )}
        </div>
        <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-mono font-bold text-[11px]">
          <Star size={11} className="fill-amber-500 text-amber-500" />
          <span>{(item.avg_review_score ?? 4.0).toFixed(1)}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px]">
        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Gross GMV</span>
          <span className="font-bold text-emerald-700">{formatBRL(item.total_revenue)}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Units Sold</span>
          <span className="font-semibold text-slate-900">{item.total_units_sold.toLocaleString()}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Avg Item Price</span>
          <span className="font-semibold text-sky-700">R$ {item.avg_price.toFixed(2)}</span>
        </div>

        <div>
          <span className="text-slate-500 block text-[10px] uppercase">Catalog Products</span>
          <span className="font-semibold text-slate-900">{item.total_products.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export const CategoryRevenueChart: React.FC<CategoryRevenueChartProps> = ({
  categories,
  isLoading = false,
  className = '',
}) => {
  const [metric, setMetric] = useState<ChartMetric>('revenue');

  const fallbackCategories = useMemo<CategoryPerformance[]>(() => [
    { category: 'health_beauty', category_pt: 'beleza_saude', total_products: 2444, total_units_sold: 9670, total_revenue: 1258600.0, avg_price: 130.15, avg_review_score: 4.18 },
    { category: 'watches_gifts', category_pt: 'relogios_presentes', total_products: 1329, total_units_sold: 5991, total_revenue: 1205000.0, avg_price: 201.14, avg_review_score: 4.02 },
    { category: 'bed_bath_table', category_pt: 'cama_mesa_banho', total_products: 3029, total_units_sold: 11115, total_revenue: 1036800.0, avg_price: 93.28, avg_review_score: 3.92 },
    { category: 'sports_leisure', category_pt: 'esporte_lazer', total_products: 2867, total_units_sold: 8641, total_revenue: 988000.0, avg_price: 114.34, avg_review_score: 4.12 },
    { category: 'computers_accessories', category_pt: 'informatica_acessorios', total_products: 1639, total_units_sold: 7827, total_revenue: 911900.0, avg_price: 116.51, avg_review_score: 3.98 },
    { category: 'furniture_decor', category_pt: 'moveis_decoracao', total_products: 2657, total_units_sold: 8334, total_revenue: 729700.0, avg_price: 87.56, avg_review_score: 3.95 },
    { category: 'housewares', category_pt: 'utilidades_domesticas', total_products: 2335, total_units_sold: 6964, total_revenue: 632200.0, avg_price: 90.78, avg_review_score: 4.08 },
    { category: 'telephony', category_pt: 'telefonia', total_products: 1134, total_units_sold: 4545, total_revenue: 323600.0, avg_price: 71.2, avg_review_score: 3.94 },
  ], []);

  const rawList = categories && categories.length > 0 ? categories : fallbackCategories;

  const chartData = useMemo(() => {
    const list = rawList.map((cat) => ({
      ...cat,
      displayName: formatName(cat.category),
    }));

    // Sort descending by current metric
    list.sort((a, b) => {
      if (metric === 'revenue') return b.total_revenue - a.total_revenue;
      if (metric === 'units') return b.total_units_sold - a.total_units_sold;
      return b.total_products - a.total_products;
    });

    return list;
  }, [rawList, metric]);

  const topCategory = chartData[0];
  const topRated = useMemo(() => {
    return [...chartData].sort((a, b) => (b.avg_review_score ?? 0) - (a.avg_review_score ?? 0))[0];
  }, [chartData]);

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
      data-testid="category-revenue-chart-card"
      className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Header with Title and Mode Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700">
              <BarChart3 size={16} />
            </span>
            <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">
              Product Category Revenue & Volume Distribution
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparative performance of top marketplace product categories ranked by revenue, sales units, or catalog breadth
          </p>
        </div>

        {/* Metric selection buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric('revenue')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              metric === 'revenue'
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gross Revenue
          </button>
          <button
            type="button"
            onClick={() => setMetric('units')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              metric === 'units'
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Units Sold
          </button>
          <button
            type="button"
            onClick={() => setMetric('products')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              metric === 'products'
                ? 'bg-purple-600 text-white font-semibold shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Catalog SKUs
          </button>
        </div>
      </div>

      {/* Summary Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {topCategory && (
          <div className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
            <Award size={15} className="text-emerald-600 shrink-0" />
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">
                Category Revenue Leader
              </span>
              <span className="font-bold text-slate-900">
                {topCategory.displayName}:{' '}
                <span className="text-emerald-700 font-mono">{formatBRL(topCategory.total_revenue)}</span>
              </span>
              <span className="text-[11px] text-slate-600 ml-1.5">
                ({topCategory.total_units_sold.toLocaleString()} units sold)
              </span>
            </div>
          </div>
        )}

        {topRated && (
          <div className="flex items-center space-x-2.5 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs">
            <Star size={15} className="text-amber-500 fill-amber-500 shrink-0" />
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono block">
                Highest Customer Rating
              </span>
              <span className="font-bold text-slate-900">
                {topRated.displayName}:{' '}
                <span className="text-amber-700 font-mono">★ {(topRated.avg_review_score ?? 4.0).toFixed(2)}</span>
              </span>
              <span className="text-[11px] text-slate-600 ml-1.5">
                ({topRated.total_products.toLocaleString()} SKUs)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Recharts Canvas */}
      <div className="w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
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
                if (metric === 'revenue') return formatBRL(v);
                return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toString();
              }}
            />
            <YAxis
              type="category"
              dataKey="displayName"
              width={140}
              tick={{ fill: '#334155', fontSize: 11, fontFamily: 'Inter' }}
            />
            <Tooltip content={<CustomCategoryTooltip />} />

            <Bar
              dataKey={
                metric === 'revenue'
                  ? 'total_revenue'
                  : metric === 'units'
                  ? 'total_units_sold'
                  : 'total_products'
              }
              name={
                metric === 'revenue'
                  ? 'Total Revenue'
                  : metric === 'units'
                  ? 'Units Sold'
                  : 'Catalog SKUs'
              }
              radius={[0, 6, 6, 0]}
              barSize={18}
            >
              {chartData.map((entry, idx) => (
                <Cell
                  key={`cat-${entry.category}`}
                  fill={
                    metric === 'revenue'
                      ? idx === 0
                        ? '#059669'
                        : '#0284c7'
                      : metric === 'units'
                      ? '#4f46e5'
                      : '#9333ea'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
