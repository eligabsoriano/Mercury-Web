import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ShoppingBag,
  Star,
  Package,
  Award,
  Truck,
  RefreshCw,
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { GlassCard, MetricCard } from '../components/common';
import {
  CategoryRevenueChart,
  SellerPerformanceScatter,
} from '../components/catalog';
import {
  catalogApi,
  type CategoryListResponse,
  type SellerListResponse,
  type ProductListResponse,
} from '../api';

export interface CatalogIntelligenceViewProps {
  initialCategories?: CategoryListResponse | null;
  initialSellers?: SellerListResponse | null;
  initialProducts?: ProductListResponse | null;
}

type CategorySort = 'revenue' | 'units' | 'rating' | 'products';
type SellerSort = 'revenue' | 'rating' | 'delay' | 'orders';

function formatCategoryName(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatBRL(amount: number): string {
  if (amount >= 1_000_000) return `R$ ${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000) return `R$ ${(amount / 1_000).toFixed(1)}k`;
  return `R$ ${amount.toLocaleString()}`;
}

export const CatalogIntelligenceView: React.FC<CatalogIntelligenceViewProps> = ({
  initialCategories,
  initialSellers,
  initialProducts,
}) => {
  const [categories, setCategories] = useState<CategoryListResponse | null>(initialCategories ?? null);
  const [sellers, setSellers] = useState<SellerListResponse | null>(initialSellers ?? null);
  const [products, setProducts] = useState<ProductListResponse | null>(initialProducts ?? null);
  const [isLoading, setIsLoading] = useState<boolean>(!initialCategories);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now');

  // Category grid sorting
  const [categorySort, setCategorySort] = useState<CategorySort>('revenue');

  // Sellers table state
  const [sellerSearch, setSellerSearch] = useState<string>('');
  const [sellerStateFilter, setSellerStateFilter] = useState<string>('all');
  const [sellerSort, setSellerSort] = useState<SellerSort>('revenue');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 5;

  const fetchData = useCallback(async (showRefreshingState = false) => {
    if (showRefreshingState) setIsRefreshing(true);
    try {
      const [catRes, sellersRes, prodRes] = await Promise.all([
        catalogApi.getCategories(),
        catalogApi.getSellers({ page: 1, page_size: 20 }),
        catalogApi.getProducts({ page: 1, page_size: 20 }),
      ]);

      setCategories(catRes);
      setSellers(sellersRes);
      setProducts(prodRes);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Failed to hydrate catalog intelligence data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!initialCategories) {
      fetchData();
    }
  }, [fetchData, initialCategories]);

  // Max category revenue for relative progress bar calculation
  const maxCategoryRevenue = useMemo(() => {
    if (!categories?.categories?.length) return 1258600;
    return Math.max(...categories.categories.map((c) => c.total_revenue));
  }, [categories?.categories]);

  // Sorted categories
  const sortedCategories = useMemo(() => {
    const list = [...(categories?.categories ?? [])];
    list.sort((a, b) => {
      if (categorySort === 'revenue') return b.total_revenue - a.total_revenue;
      if (categorySort === 'units') return b.total_units_sold - a.total_units_sold;
      if (categorySort === 'rating') return (b.avg_review_score ?? 0) - (a.avg_review_score ?? 0);
      if (categorySort === 'products') return b.total_products - a.total_products;
      return 0;
    });
    return list;
  }, [categories?.categories, categorySort]);

  // Top category highlights
  const topRevenueCat = sortedCategories[0];
  const highestRatedCat = useMemo(() => {
    if (!categories?.categories?.length) return null;
    return [...categories.categories].sort(
      (a, b) => (b.avg_review_score ?? 0) - (a.avg_review_score ?? 0)
    )[0];
  }, [categories?.categories]);

  // Filtered & sorted sellers
  const filteredSellers = useMemo(() => {
    let list = [...(sellers?.items ?? [])];

    // State filter
    if (sellerStateFilter !== 'all') {
      list = list.filter((s) => s.state?.toUpperCase() === sellerStateFilter.toUpperCase());
    }

    // Search query
    if (sellerSearch) {
      const q = sellerSearch.toLowerCase();
      list = list.filter(
        (s) =>
          s.seller_id.toLowerCase().includes(q) ||
          s.city?.toLowerCase().includes(q) ||
          s.state?.toLowerCase().includes(q)
      );
    }

    // Sorting
    list.sort((a, b) => {
      if (sellerSort === 'revenue') return b.total_revenue - a.total_revenue;
      if (sellerSort === 'rating') return (b.avg_review_score ?? 0) - (a.avg_review_score ?? 0);
      if (sellerSort === 'delay') return (a.avg_delivery_delay_days ?? 0) - (b.avg_delivery_delay_days ?? 0);
      if (sellerSort === 'orders') return b.total_orders_fulfilled - a.total_orders_fulfilled;
      return 0;
    });

    return list;
  }, [sellers?.items, sellerStateFilter, sellerSearch, sellerSort]);

  // Paginated sellers
  const totalSellerPages = Math.max(1, Math.ceil(filteredSellers.length / pageSize));
  const displayedSellers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSellers.slice(start, start + pageSize);
  }, [filteredSellers, currentPage, pageSize]);

  return (
    <div data-testid="catalog-intelligence-view" className="space-y-8 pb-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(139,92,246,0.12)] border border-[rgba(139,92,246,0.3)] text-xs font-mono text-[#d8b4fe]">
            <ShoppingBag size={13} className="text-[#c084fc]" />
            <span className="uppercase tracking-wider font-semibold">
              Catalog & Merchant Telemetry
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2 text-white">
            Catalog Intelligence & Seller Logistics
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-3xl">
            Monitor {products?.pagination?.total_items ? products.pagination.total_items.toLocaleString() : '32,951'} catalog items
            across marketplace categories, merchant fulfillment reliability scores, and logistics delivery risk correlations.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-mono text-[var(--text-muted)] block">Last Synced</span>
            <span className="text-xs font-mono text-[var(--text-secondary)]">{lastRefreshed}</span>
          </div>

          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.1)] text-white text-xs font-medium transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing ? 'animate-spin text-[#38bdf8]' : ''} />
            <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>
        </div>
      </section>

      {/* 4 Category & Catalog KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Product Categories"
          value={categories?.total_categories ?? 8}
          subtitle="Indexed verticals"
          delta={{
            value: '100%',
            label: 'active coverage',
            isPositive: true,
          }}
          takeaway="Covers major consumer retail verticals from beauty to technology"
          accent="violet"
          icon={<ShoppingBag size={20} />}
        />

        <MetricCard
          title="Products Catalogued"
          value={(products?.pagination?.total_items ?? 32951).toLocaleString()}
          subtitle="Distinct SKUs"
          delta={{
            value: '+12.4%',
            label: 'YoY catalog growth',
            isPositive: true,
          }}
          takeaway="Bed bath & table holds the largest catalog with 3,029 SKUs"
          accent="cyan"
          icon={<Package size={20} />}
        />

        <MetricCard
          title="Top Category Revenue"
          value={topRevenueCat ? formatBRL(topRevenueCat.total_revenue) : 'R$ 1.26M'}
          subtitle={topRevenueCat ? formatCategoryName(topRevenueCat.category) : 'Health Beauty'}
          delta={{
            value: topRevenueCat ? `${topRevenueCat.total_units_sold.toLocaleString()} units` : '9,670 units',
            label: 'sold',
            isPositive: true,
          }}
          takeaway="Health & Beauty leads all categories in total GMV throughput"
          accent="emerald"
          icon={<Award size={20} />}
        />

        <MetricCard
          title="Highest Rated Category"
          value={highestRatedCat ? `★ ${(highestRatedCat.avg_review_score ?? 4.18).toFixed(2)}` : '★ 4.18'}
          subtitle={highestRatedCat ? formatCategoryName(highestRatedCat.category) : 'Health Beauty'}
          delta={{
            value: '+0.20',
            label: 'above average',
            isPositive: true,
          }}
          takeaway="Highest customer satisfaction rating across the marketplace"
          accent="amber"
          icon={<Star size={20} />}
        />
      </div>

      {/* Product Categories Interactive Grid */}
      <GlassCard
        title="Marketplace Product Categories Scorecard"
        subtitle="Ranked performance, revenue contribution share, and customer review scores across categories"
        glow="cyan"
      >
        {/* Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.06)]">
          <span className="text-xs text-[var(--text-secondary)] font-mono">
            Displaying {sortedCategories.length} product categories
          </span>

          <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-xs self-start sm:self-auto">
            <span className="text-[var(--text-muted)] text-[11px] px-2">Sort:</span>
            <button
              type="button"
              onClick={() => setCategorySort('revenue')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                categorySort === 'revenue'
                  ? 'bg-[rgba(52,211,153,0.2)] text-[#34d399] border border-[rgba(52,211,153,0.4)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Revenue
            </button>
            <button
              type="button"
              onClick={() => setCategorySort('units')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                categorySort === 'units'
                  ? 'bg-[rgba(56,189,248,0.2)] text-[#38bdf8] border border-[rgba(56,189,248,0.4)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Units Sold
            </button>
            <button
              type="button"
              onClick={() => setCategorySort('rating')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                categorySort === 'rating'
                  ? 'bg-[rgba(251,191,36,0.2)] text-[#fbbf24] border border-[rgba(251,191,36,0.4)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Rating (★)
            </button>
            <button
              type="button"
              onClick={() => setCategorySort('products')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                categorySort === 'products'
                  ? 'bg-[rgba(192,132,252,0.2)] text-[#c084fc] border border-[rgba(192,132,252,0.4)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              SKUs
            </button>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {sortedCategories.map((cat, index) => {
            const sharePercent = maxCategoryRevenue > 0 ? (cat.total_revenue / maxCategoryRevenue) * 100 : 80;

            return (
              <div
                key={cat.category}
                className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(56,189,248,0.4)] hover:bg-[rgba(255,255,255,0.04)] transition-all duration-300 space-y-3 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-mono font-bold text-[var(--text-muted)]">
                        #{index + 1}
                      </span>
                      <span className="font-bold text-white text-xs truncate max-w-[140px] block">
                        {formatCategoryName(cat.category)}
                      </span>
                    </div>
                    {cat.category_pt && (
                      <span className="text-[10px] text-[var(--text-muted)] italic block mt-0.5">
                        {cat.category_pt}
                      </span>
                    )}
                  </div>

                  <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-[rgba(251,191,36,0.12)] text-[11px] font-mono font-bold text-[#fbbf24]">
                    <Star size={11} className="fill-[#fbbf24]" />
                    <span>{(cat.avg_review_score ?? 4.0).toFixed(1)}</span>
                  </span>
                </div>

                <div className="space-y-1.5 font-mono text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)] text-[11px]">Gross GMV:</span>
                    <span className="font-bold text-[#34d399]">{formatBRL(cat.total_revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)] text-[11px]">Units Sold:</span>
                    <span className="text-white font-medium">{cat.total_units_sold.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)] text-[11px]">Avg Unit Price:</span>
                    <span className="text-[#38bdf8] font-medium">R$ {cat.avg_price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[var(--text-muted)] text-[11px]">Distinct SKUs:</span>
                    <span className="text-[var(--text-secondary)]">{cat.total_products.toLocaleString()}</span>
                  </div>
                </div>

                {/* Relative Revenue Share Bar */}
                <div className="pt-2 border-t border-[rgba(255,255,255,0.04)]">
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] mb-1 font-mono">
                    <span>Revenue Share:</span>
                    <span>{sharePercent.toFixed(0)}% of leader</span>
                  </div>
                  <div className="w-full bg-[rgba(255,255,255,0.06)] rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#38bdf8] to-[#34d399] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, sharePercent)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Category Revenue Distribution Chart */}
      <CategoryRevenueChart
        categories={categories?.categories}
        isLoading={isLoading}
      />

      {/* Seller Logistics Performance Scatter Chart */}
      <SellerPerformanceScatter
        sellers={sellers?.items}
        isLoading={isLoading}
      />

      {/* Marketplace Sellers Directory */}
      <GlassCard
        title="Marketplace Merchants & Delivery Health Directory"
        subtitle="Active merchant fulfillment scores, on-time delivery percentages, and freight transit delay risks"
        glow="emerald"
      >
        {/* Table Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.06)]">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search Seller ID, city, state..."
              value={sellerSearch}
              onChange={(e) => {
                setSellerSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.09)] text-xs text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#34d399] transition-all w-56 sm:w-64"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* State filter */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-xs">
              <Filter size={12} className="text-[var(--text-muted)]" />
              <select
                value={sellerStateFilter}
                onChange={(e) => {
                  setSellerStateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-[var(--text-secondary)] focus:text-white outline-none cursor-pointer text-xs"
              >
                <option value="all" className="bg-[#0f172a] text-white">All States</option>
                <option value="SP" className="bg-[#0f172a] text-white">SP (São Paulo)</option>
                <option value="RJ" className="bg-[#0f172a] text-white">RJ (Rio de Janeiro)</option>
                <option value="MG" className="bg-[#0f172a] text-white">MG (Minas Gerais)</option>
                <option value="PR" className="bg-[#0f172a] text-white">PR (Paraná)</option>
                <option value="RS" className="bg-[#0f172a] text-white">RS (Rio Grande do Sul)</option>
                <option value="BA" className="bg-[#0f172a] text-white">BA (Bahia)</option>
                <option value="SC" className="bg-[#0f172a] text-white">SC (Santa Catarina)</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-xs">
              <ArrowUpDown size={12} className="text-[var(--text-muted)]" />
              <select
                value={sellerSort}
                onChange={(e) => setSellerSort(e.target.value as SellerSort)}
                className="bg-transparent text-[var(--text-secondary)] focus:text-white outline-none cursor-pointer text-xs"
              >
                <option value="revenue" className="bg-[#0f172a] text-white">Sort: Revenue</option>
                <option value="rating" className="bg-[#0f172a] text-white">Sort: Rating</option>
                <option value="delay" className="bg-[#0f172a] text-white">Sort: Delivery Health</option>
                <option value="orders" className="bg-[#0f172a] text-white">Sort: Orders Fulfilled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] uppercase text-[10px]">
                <th className="pb-3 pl-2">Seller ID</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Delivered Orders</th>
                <th className="pb-3">Items Sold</th>
                <th className="pb-3">Avg Line Value</th>
                <th className="pb-3">Total GMV</th>
                <th className="pb-3">Customer Rating</th>
                <th className="pb-3">Late Rate</th>
                <th className="pb-3 pr-2">Delivery Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {displayedSellers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-xs text-[var(--text-muted)]">
                    No merchants match the specified criteria.
                  </td>
                </tr>
              ) : (
                displayedSellers.map((s) => {
                  const delay = s.avg_delivery_delay_days ?? 0;
                  const isEarly = delay <= 0;
                  const isSevereLate = s.late_delivery_rate > 0.1 || delay > 2;

                  return (
                    <tr
                      key={s.seller_id}
                      className="hover:bg-[rgba(255,255,255,0.03)] transition-colors"
                    >
                      <td className="py-3 pl-2 font-bold text-white tracking-wider">
                        {s.seller_id.slice(0, 14)}...
                      </td>

                      <td className="py-3 text-[var(--text-secondary)] capitalize">
                        {s.city ?? 'São Paulo'}, <span className="text-white font-bold">{s.state ?? 'BR'}</span>
                      </td>

                      <td className="py-3 text-white font-semibold">
                        {s.total_orders_fulfilled.toLocaleString()}
                      </td>

                      <td className="py-3 text-[var(--text-secondary)]">
                        {s.total_items_sold.toLocaleString()}
                      </td>

                      <td className="py-3 text-[#38bdf8]">
                        R$ {s.avg_item_value.toFixed(2)}
                      </td>

                      <td className="py-3 text-[#34d399] font-bold">
                        {formatBRL(s.total_revenue)}
                      </td>

                      <td className="py-3">
                        <span className="inline-flex items-center space-x-1 text-[#fbbf24] font-bold">
                          <Star size={11} className="fill-[#fbbf24]" />
                          <span>{(s.avg_review_score ?? 4.0).toFixed(1)}</span>
                        </span>
                      </td>

                      <td className="py-3">
                        <span
                          className={`font-semibold ${
                            isSevereLate ? 'text-[#f43f5e]' : 'text-[#34d399]'
                          }`}
                        >
                          {(s.late_delivery_rate * 100).toFixed(1)}%
                        </span>
                      </td>

                      <td className="py-3 pr-2">
                        {isEarly ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[rgba(52,211,153,0.15)] text-[#34d399] border border-[rgba(52,211,153,0.3)]">
                            <ShieldCheck size={11} />
                            <span>{Math.abs(delay).toFixed(1)}d Early</span>
                          </span>
                        ) : isSevereLate ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[rgba(244,63,94,0.15)] text-[#f43f5e] border border-[rgba(244,63,94,0.3)]">
                            <AlertTriangle size={11} />
                            <span>+{delay.toFixed(1)}d Late</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[rgba(251,191,36,0.15)] text-[#fbbf24] border border-[rgba(251,191,36,0.3)]">
                            <Truck size={11} />
                            <span>+{delay.toFixed(1)}d Normal</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Sellers Pagination Footer */}
        <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
          <div className="text-[var(--text-secondary)] font-mono">
            Showing <span className="text-white font-semibold">{displayedSellers.length}</span> of{' '}
            <span className="text-white font-semibold">
              {sellers?.pagination?.total_items ? sellers.pagination.total_items.toLocaleString() : filteredSellers.length}
            </span> marketplace sellers
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={14} />
              <span>Previous</span>
            </button>

            <span className="px-2 font-mono text-[var(--text-secondary)]">
              Page {currentPage} of {totalSellerPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalSellerPages, p + 1))}
              disabled={currentPage >= totalSellerPages}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <span>Next</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
