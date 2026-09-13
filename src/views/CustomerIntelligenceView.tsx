import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  ArrowUpDown,
  RotateCcw,
  ShieldAlert,
  ListFilter,
  DollarSign,
  TrendingDown,
  UserCheck,
  ChevronLeft,
} from 'lucide-react';
import { GlassCard, RiskTierBadge, SegmentBadge, PriorityBadge, Button } from '../components/common';
import { Customer360Modal } from '../components/customers';
import { customersApi, type CustomerSummary } from '../api';

export interface CustomerIntelligenceViewProps {
  selectedCustomerId?: string | null;
  onSelectCustomer?: (customerId: string | null) => void;
  onNavigateToSimulator?: (customerId: string) => void;
}

export const CustomerIntelligenceView: React.FC<CustomerIntelligenceViewProps> = ({
  selectedCustomerId,
  onSelectCustomer,
  onNavigateToSimulator,
}) => {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'all' | 'at-risk'>('all');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Sorting & Pagination State
  const [sortBy, setSortBy] = useState<string>('lifetime_spend');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Data & Loading State
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [totalCount, setTotalCount] = useState<number>(96096);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Drawer / Modal State
  const [modalCustomerId, setModalCustomerId] = useState<string | null>(selectedCustomerId ?? null);

  // Sync incoming selectedCustomerId prop
  useEffect(() => {
    if (selectedCustomerId) {
      setModalCustomerId(selectedCustomerId);
    }
  }, [selectedCustomerId]);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search change
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Customers Data
  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'at-risk') {
        const res = await customersApi.getAtRisk({
          page: currentPage,
          page_size: pageSize,
          risk_tier: riskFilter !== 'all' ? riskFilter : undefined,
          retention_priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        });
        setCustomers(res.items);
        setTotalCount(res.pagination.total_items);
        setTotalPages(res.pagination.total_pages);
      } else {
        const res = await customersApi.list({
          page: currentPage,
          page_size: pageSize,
          search: debouncedSearch || undefined,
          segment: segmentFilter !== 'all' ? segmentFilter : undefined,
          risk_tier: riskFilter !== 'all' ? riskFilter : undefined,
          state: stateFilter !== 'all' ? stateFilter : undefined,
          sort_by: sortBy,
          sort_direction: sortDirection,
        });
        setCustomers(res.items);
        setTotalCount(res.pagination.total_items);
        setTotalPages(res.pagination.total_pages);
      }
    } catch (err) {
      console.error('Failed to load customers list:', err);
    } finally {
      setIsLoading(false);
    }
  }, [
    activeTab,
    currentPage,
    pageSize,
    debouncedSearch,
    segmentFilter,
    riskFilter,
    stateFilter,
    priorityFilter,
    sortBy,
    sortDirection,
  ]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle Sort Change
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
    setCurrentPage(1);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSegmentFilter('all');
    setRiskFilter('all');
    setStateFilter('all');
    setPriorityFilter('all');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    segmentFilter !== 'all' ||
    riskFilter !== 'all' ||
    stateFilter !== 'all' ||
    priorityFilter !== 'all';

  // Export CSV Handler
  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const csvData = await customersApi.exportCSV({
        segment: segmentFilter !== 'all' ? segmentFilter : undefined,
        risk_tier: riskFilter !== 'all' ? riskFilter : undefined,
        state: stateFilter !== 'all' ? stateFilter : undefined,
      });

      const blob =
        typeof csvData === 'string'
          ? new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
          : (csvData as Blob);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `mercury_customers_${activeTab}_export_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Open 360 Modal for customer
  const handleOpenModal = (id: string) => {
    setModalCustomerId(id);
    if (onSelectCustomer) {
      onSelectCustomer(id);
    }
  };

  const handleCloseModal = () => {
    setModalCustomerId(null);
    if (onSelectCustomer) {
      onSelectCustomer(null);
    }
  };

  // Aggregates for current page
  const pageAggregates = useMemo(() => {
    const totalSpend = customers.reduce((acc, c) => acc + c.lifetime_spend, 0);
    const totalRisk = customers.reduce((acc, c) => acc + (c.revenue_at_risk ?? 0), 0);
    const avgProb =
      customers.length > 0
        ? customers.reduce((acc, c) => acc + (c.churn_probability ?? 0), 0) / customers.length
        : 0;
    const repeatBuyers = customers.filter((c) => c.lifetime_orders >= 2).length;
    return { totalSpend, totalRisk, avgProb, repeatBuyers };
  }, [customers]);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-mono text-sky-700">
            <Users size={13} className="text-sky-600" />
            <span className="uppercase tracking-wider font-semibold">
              Olist Customer 360 Registry
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2 text-slate-900">
            Customer Intelligence & Risk Directory
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Granular customer profiling aggregated by <code className="font-mono text-slate-900 bg-slate-100 px-1 py-0.5 rounded text-xs">customer_unique_id</code> with RFM quintile assignment,
            HistGradientBoosting churn risk inference, and prescriptive retention routing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={handleExportCSV}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button
            variant="violet"
            size="sm"
            icon={<Sparkles size={14} />}
            onClick={() => handleOpenModal('8d50f5eadf502056fa2f144b30424d35')}
          >
            Quick 360 Demo
          </Button>
        </div>
      </section>

      {/* Mode Tabs (All Customers vs Priority At-Risk Queue) */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              setCurrentPage(1);
            }}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'all'
                ? 'text-slate-900 border-sky-600 bg-sky-50/50'
                : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users size={14} />
            <span>All Customers</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 border border-slate-200 text-slate-600">
              96,096
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('at-risk');
              setCurrentPage(1);
            }}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'at-risk'
                ? 'text-rose-700 border-rose-600 bg-rose-50/50'
                : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert size={14} className="text-rose-600" />
            <span>Priority At-Risk Queue</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-50 text-rose-700 font-bold border border-rose-200">
              17,680
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-500 font-mono">
          <span>Active View: {activeTab === 'all' ? 'Universal Registry' : 'Intervention Queue'}</span>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-700">
            <ListFilter size={16} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-500">
              Matching Records
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              {totalCount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
            <DollarSign size={16} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-500">
              Page Revenue at Risk
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              R$ {pageAggregates.totalRisk.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700">
            <TrendingDown size={16} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-500">
              Avg Churn Probability
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              {(pageAggregates.avgProb * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
            <UserCheck size={16} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-slate-500">
              Repeat Buyers (Page)
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              {pageAggregates.repeatBuyers} / {customers.length}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-faceted Search & Filter Suite */}
      <GlassCard className="p-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer_unique_id, city, or state..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl outline-none focus:border-sky-500 transition-all font-mono"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Risk Tier */}
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white text-xs text-slate-700 border border-slate-200 rounded-xl px-3 py-1.5 outline-none hover:border-slate-300 transition-colors"
            >
              <option value="all">All Risk Tiers</option>
              <option value="High Risk">High Risk (P &ge; 70%)</option>
              <option value="Medium Risk">Medium Risk (30% - 70%)</option>
              <option value="Low Risk">Low Risk (P &lt; 30%)</option>
            </select>

            {/* RFM Segment */}
            <select
              value={segmentFilter}
              onChange={(e) => {
                setSegmentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white text-xs text-slate-700 border border-slate-200 rounded-xl px-3 py-1.5 outline-none hover:border-slate-300 transition-colors"
            >
              <option value="all">All RFM Segments</option>
              <option value="Champions">Champions</option>
              <option value="Loyal Customers">Loyal Customers</option>
              <option value="Potential Loyalists">Potential Loyalists</option>
              <option value="Recent Customers">Recent Customers</option>
              <option value="Promising">Promising</option>
              <option value="Customers Needing Attention">Customers Needing Attention</option>
              <option value="About to Sleep">About to Sleep</option>
              <option value="At Risk">At Risk</option>
              <option value="Can't Lose Them">Can't Lose Them</option>
              <option value="Hibernating">Hibernating</option>
              <option value="Lost">Lost</option>
            </select>

            {/* State Filter */}
            <select
              value={stateFilter}
              onChange={(e) => {
                setStateFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white text-xs text-slate-700 border border-slate-200 rounded-xl px-3 py-1.5 outline-none hover:border-slate-300 transition-colors font-mono"
            >
              <option value="all">All States</option>
              <option value="SP">SP (São Paulo)</option>
              <option value="RJ">RJ (Rio de Janeiro)</option>
              <option value="MG">MG (Minas Gerais)</option>
              <option value="RS">RS (Rio Grande do Sul)</option>
              <option value="PR">PR (Paraná)</option>
              <option value="SC">SC (Santa Catarina)</option>
              <option value="BA">BA (Bahia)</option>
              <option value="DF">DF (Distrito Federal)</option>
              <option value="PE">PE (Pernambuco)</option>
              <option value="CE">CE (Ceará)</option>
              <option value="GO">GO (Goiás)</option>
            </select>

            {/* Retention Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white text-xs text-slate-700 border border-slate-200 rounded-xl px-3 py-1.5 outline-none hover:border-slate-300 transition-colors"
            >
              <option value="all">All Priorities</option>
              <option value="Priority 1">Priority 1 (VIP)</option>
              <option value="Priority 2">Priority 2 (Logistics)</option>
              <option value="Priority 3">Priority 3 (Win-Back)</option>
              <option value="Priority 4">Priority 4 (Baseline)</option>
            </select>

            {/* Reset Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all text-xs flex items-center space-x-1"
                title="Reset all filters"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {/* High-Density Customers Data Table */}
      <GlassCard
        title={`${activeTab === 'at-risk' ? 'Priority At-Risk Queue' : 'Customer Intelligence Directory'} (${totalCount.toLocaleString()} Accounts)`}
        subtitle={
          activeTab === 'at-risk'
            ? 'High-exposure churn accounts requiring urgent intervention routing'
            : 'Multi-dimensional RFM quintiles and real-time HistGradientBoosting risk scoring'
        }
      >
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-mono uppercase text-[10px]">
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('customer_unique_id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Customer ID & Location</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th className="pb-3 font-semibold">RFM Segment</th>
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('lifetime_orders')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Orders</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('lifetime_spend')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Lifetime Spend</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('recency_days')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Recency</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('churn_probability')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Churn Risk P(Churn)</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-slate-900 transition-colors"
                  onClick={() => handleSort('revenue_at_risk')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Revenue at Risk</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th className="pb-3 font-semibold">Retention Priority</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-sans">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                      <span>Querying customer registry...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-sans">
                    <AlertTriangle size={24} className="mx-auto mb-2 opacity-40 text-amber-500" />
                    <p>No customer records match the specified filters.</p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-sky-600 hover:underline font-medium"
                    >
                      Clear active filters
                    </button>
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.customer_unique_id}
                    onClick={() => handleOpenModal(c.customer_unique_id)}
                    className={`hover:bg-slate-50 cursor-pointer transition-colors group ${
                      modalCustomerId === c.customer_unique_id
                        ? 'bg-indigo-50/70'
                        : ''
                    }`}
                  >
                    {/* Customer ID & City / State */}
                    <td className="py-3 font-medium text-slate-900">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold truncate max-w-[130px]" title={c.customer_unique_id}>
                          {c.customer_unique_id}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono uppercase">
                          {c.state ?? 'BR'}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 capitalize truncate max-w-[150px]">
                        {c.city ?? 'Brasil'}
                      </div>
                    </td>

                    {/* Segment */}
                    <td className="py-3">
                      <SegmentBadge segment={c.segment ?? 'At Risk'} />
                    </td>

                    {/* Orders */}
                    <td className="py-3 text-slate-900 font-bold">
                      {c.lifetime_orders}
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3 text-emerald-700 font-bold">
                      R$ {c.lifetime_spend.toFixed(2)}
                    </td>

                    {/* Recency */}
                    <td className="py-3 text-slate-600">
                      {c.recency_days !== null && c.recency_days !== undefined
                        ? `${c.recency_days}d`
                        : 'Active'}
                    </td>

                    {/* Churn Risk */}
                    <td className="py-3">
                      <RiskTierBadge
                        tier={c.risk_tier ?? 'Low'}
                        probability={c.churn_probability ?? 0.05}
                      />
                    </td>

                    {/* Revenue at Risk */}
                    <td className="py-3 font-bold text-rose-600">
                      R$ {(c.revenue_at_risk ?? (c.lifetime_spend * (c.churn_probability ?? 0.1))).toFixed(2)}
                    </td>

                    {/* Retention Priority */}
                    <td className="py-3">
                      <PriorityBadge priority={c.retention_priority ?? 'Priority 4'} />
                    </td>

                    {/* Action Button */}
                    <td className="py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleOpenModal(c.customer_unique_id)}
                        className="p-1.5 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 shadow-sm transition-all inline-flex items-center space-x-1"
                        title="View Customer 360 Profile"
                      >
                        <span className="text-[10px] font-sans font-semibold">360</span>
                        <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pt-4 mt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-2">
            <span>
              Showing{' '}
              <strong className="text-slate-900 font-mono">
                {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, totalCount)}
              </strong>{' '}
              of <strong className="text-slate-900 font-mono">{totalCount.toLocaleString()}</strong> accounts
            </span>

            <span className="text-slate-300">|</span>

            <div className="flex items-center space-x-1 text-[11px]">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white text-slate-900 border border-slate-200 rounded-lg px-2 py-0.5 outline-none font-mono text-[11px]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 font-mono">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all text-slate-700 flex items-center"
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>

            <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs border border-slate-200">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm transition-all text-slate-700 flex items-center"
              title="Next Page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Slide-Over Customer 360 Modal */}
      <Customer360Modal
        isOpen={modalCustomerId !== null}
        customerId={modalCustomerId}
        onClose={handleCloseModal}
        onNavigateToSimulator={onNavigateToSimulator}
      />
    </div>
  );
};
