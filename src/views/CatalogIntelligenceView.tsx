import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Star,
} from 'lucide-react';
import { GlassCard } from '../components/common';
import {
  catalogApi,
  type CategoryListResponse,
  type SellerListResponse,
} from '../api';

export const CatalogIntelligenceView: React.FC = () => {
  const [categories, setCategories] = useState<CategoryListResponse | null>(null);
  const [sellers, setSellers] = useState<SellerListResponse | null>(null);

  useEffect(() => {
    catalogApi.getCategories().then(setCategories).catch(console.error);
    catalogApi.getSellers({ page: 1, page_size: 6 }).then(setSellers).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(139,92,246,0.12)] border border-[rgba(139,92,246,0.3)] text-xs font-mono text-[#d8b4fe]">
          <ShoppingBag size={13} className="text-[#c084fc]" />
          <span className="uppercase tracking-wider font-semibold">
            Catalog & Merchant Telemetry
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2 text-white">
          Catalog Intelligence & Seller Logistics
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
          Track 32,951 products across marketplace categories, merchant fulfillment reliability, and
          delivery delay correlations.
        </p>
      </section>

      {/* Top Categories Grid */}
      <GlassCard
        title="Top Performing Product Categories"
        subtitle="Ranked by total historical order volume and average customer review score"
        glow="cyan"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3">
          {categories?.categories?.map((cat) => (
            <div
              key={cat.category}
              className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(56,189,248,0.3)] transition-all space-y-2"
            >
              <div className="flex justify-between items-start">
                <span className="font-semibold text-white text-xs truncate max-w-[150px] capitalize">
                  {cat.category.replace(/_/g, ' ')}
                </span>
                <span className="flex items-center space-x-1 text-[11px] font-mono text-[#fbbf24]">
                  <Star size={11} className="fill-[#fbbf24]" />
                  <span>{(cat.avg_review_score ?? 4.5).toFixed(1)}</span>
                </span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] font-mono">
                {cat.total_units_sold.toLocaleString()} Units Sold
              </div>
              <div className="text-xs font-bold text-[#34d399] font-mono">
                R$ {(cat.total_revenue / 1000).toFixed(1)}k GMV
              </div>
            </div>
          )) ?? (
            <div className="col-span-4 py-6 text-center text-xs text-[var(--text-muted)]">
              Hydrating product categories...
            </div>
          )}
        </div>
      </GlassCard>

      {/* Sellers Directory Sample */}
      <GlassCard
        title="Marketplace Sellers & Delivery Delay Telemetry"
        subtitle="Active merchant fulfillment scores and average transit delays"
        glow="emerald"
      >
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] uppercase text-[10px]">
                <th className="pb-3">Seller Unique ID</th>
                <th className="pb-3">State</th>
                <th className="pb-3">Delivered Orders</th>
                <th className="pb-3">Avg Delay</th>
                <th className="pb-3">Rating</th>
                <th className="pb-3">Total Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {sellers?.items?.map((s) => (
                <tr key={s.seller_id} className="hover:bg-[rgba(255,255,255,0.03)]">
                  <td className="py-2.5 font-bold text-white truncate max-w-[120px]">
                    {s.seller_id.slice(0, 12)}...
                  </td>
                  <td className="py-2.5 text-[var(--text-secondary)]">{s.state ?? 'BR'}</td>
                  <td className="py-2.5 text-white">{s.total_orders_fulfilled}</td>
                  <td className="py-2.5">
                    {(s.avg_delivery_delay_days ?? 0) <= 0 ? (
                      <span className="text-[#34d399]">{s.avg_delivery_delay_days ?? 0}d (Early)</span>
                    ) : (
                      <span className="text-[#f43f5e]">+{s.avg_delivery_delay_days}d (Late)</span>
                    )}
                  </td>
                  <td className="py-2.5 text-[#fbbf24]">★ {(s.avg_review_score ?? 4.5).toFixed(1)}</td>
                  <td className="py-2.5 text-[#34d399] font-bold">
                    R$ {s.total_revenue.toLocaleString()}
                  </td>
                </tr>
              )) ?? (
                <tr>
                  <td colSpan={6} className="py-4 text-center text-[var(--text-muted)]">
                    Loading marketplace sellers...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
