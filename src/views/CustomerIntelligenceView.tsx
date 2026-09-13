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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(56,189,248,0.12)] border border-[rgba(56,189,248,0.3)] text-xs font-mono text-[#7dd3fc]">
            <Users size={13} className="text-[#38bdf8]" />
            <span className="uppercase tracking-wider font-semibold">
              Olist Customer 360 Registry
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2 text-white">
            Customer Intelligence & Risk Directory
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
            Granular customer profiling aggregated by <code className="font-mono text-white text-xs">customer_unique_id</code> with RFM quintile assignment,
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
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)]">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('all');
              setCurrentPage(1);
            }}
            className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'all'
                ? 'text-white border-[#38bdf8] bg-[rgba(56,189,248,0.06)]'
                : 'text-[var(--text-secondary)] border-transparent hover:text-white hover:bg-[rgba(255,255,255,0.02)]'
            }`}
          >
            <Users size={14} />
            <span>All Customers</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(255,255,255,0.08)] text-[var(--text-secondary)]">
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
                ? 'text-white border-[#f43f5e] bg-[rgba(244,63,94,0.08)]'
                : 'text-[var(--text-secondary)] border-transparent hover:text-white hover:bg-[rgba(255,255,255,0.02)]'
            }`}
          >
            <ShieldAlert size={14} className="text-[#f43f5e]" />
            <span>Priority At-Risk Queue</span>
            <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[rgba(244,63,94,0.2)] text-[#fda4af] font-bold border border-[rgba(244,63,94,0.35)]">
              17,680
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-xs text-[var(--text-muted)] font-mono">
          <span>Active View: {activeTab === 'all' ? 'Universal Registry' : 'Intervention Queue'}</span>
        </div>
      </div>

      {/* Summary Stat Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[rgba(56,189,248,0.12)] text-[#38bdf8]">
            <ListFilter size={16} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
              Matching Records
            </div>
            <div className="text-base font-bold font-mono text-white">
              {totalCount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[rgba(244,63,94,0.12)] text-[#f43f5e]">
            <DollarSign size={16} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
              Page Revenue at Risk
            </div>
            <div className="text-base font-bold font-mono text-white">
              R$ {pageAggregates.totalRisk.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[rgba(251,191,36,0.12)] text-[#fbbf24]">
            <TrendingDown size={16} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
              Avg Churn Probability
            </div>
            <div className="text-base font-bold font-mono text-white">
              {(pageAggregates.avgProb * 100).toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[rgba(52,211,153,0.12)] text-[#34d399]">
            <UserCheck size={16} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-[var(--text-muted)]">
              Repeat Buyers (Page)
            </div>
            <div className="text-base font-bold font-mono text-white">
              {pageAggregates.repeatBuyers} / {customers.length}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-faceted Search & Filter Suite */}
      <GlassCard className="p-4" glow={activeTab === 'at-risk' ? 'crimson' : 'cyan'}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer_unique_id, city, or state..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[rgba(255,255,255,0.04)] text-white placeholder:text-[var(--text-muted)] border border-[rgba(255,255,255,0.08)] rounded-xl outline-none focus:border-[rgba(56,189,248,0.5)] transition-all font-mono"
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
              className="bg-[rgba(14,20,36,0.9)] text-xs text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-1.5 outline-none hover:border-[rgba(255,255,255,0.2)] transition-colors"
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
              className="bg-[rgba(14,20,36,0.9)] text-xs text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-1.5 outline-none hover:border-[rgba(255,255,255,0.2)] transition-colors"
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
              className="bg-[rgba(14,20,36,0.9)] text-xs text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-1.5 outline-none hover:border-[rgba(255,255,255,0.2)] transition-colors font-mono"
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
              className="bg-[rgba(14,20,36,0.9)] text-xs text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-1.5 outline-none hover:border-[rgba(255,255,255,0.2)] transition-colors"
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
                className="p-1.5 rounded-xl border border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-white transition-all text-xs flex items-center space-x-1"
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
        glow={activeTab === 'at-risk' ? 'crimson' : 'cyan'}
      >
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] font-mono uppercase text-[10px]">
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('customer_unique_id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Customer ID & Location</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th className="pb-3 font-semibold">RFM Segment</th>
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('lifetime_orders')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Orders</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('lifetime_spend')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Lifetime Spend</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('recency_days')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Recency</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort('churn_probability')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Churn Risk P(Churn)</span>
                    <ArrowUpDown size={11} className="opacity-60" />
                  </div>
                </th>
                <th
                  className="pb-3 font-semibold cursor-pointer hover:text-white transition-colors"
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

            <tbody className="divide-y divide-[rgba(255,255,255,0.04)] font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[var(--text-muted)] font-sans">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-ping" />
                      <span>Querying customer registry...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[var(--text-muted)] font-sans">
                    <AlertTriangle size={24} className="mx-auto mb-2 opacity-40 text-[#fbbf24]" />
                    <p>No customer records match the specified filters.</p>
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-2 text-xs text-[var(--neon-cyan)] hover:underline"
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
                    className={`hover:bg-[rgba(255,255,255,0.03)] cursor-pointer transition-colors group ${
                      modalCustomerId === c.customer_unique_id
                        ? 'bg-[rgba(139,92,246,0.12)]'
                        : ''
                    }`}
                  >
                    {/* Customer ID & City / State */}
                    <td className="py-3 font-medium text-white">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold truncate max-w-[130px]" title={c.customer_unique_id}>
                          {c.customer_unique_id}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] font-mono uppercase">
                          {c.state ?? 'BR'}
                        </span>
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] capitalize truncate max-w-[150px]">
                        {c.city ?? 'Brasil'}
                      </div>
                    </td>

                    {/* Segment */}
                    <td className="py-3">
                      <SegmentBadge segment={c.segment ?? 'At Risk'} />
                    </td>

                    {/* Orders */}
                    <td className="py-3 text-white font-bold">
                      {c.lifetime_orders}
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3 text-[#34d399] font-bold">
                      R$ {c.lifetime_spend.toFixed(2)}
                    </td>

                    {/* Recency */}
                    <td className="py-3 text-[var(--text-secondary)]">
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
                    <td className="py-3 font-bold text-[#f43f5e]">
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
                        className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(139,92,246,0.25)] text-[var(--text-secondary)] hover:text-white transition-all inline-flex items-center space-x-1"
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
        <div className="pt-4 mt-2 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center space-x-2">
            <span>
              Showing{' '}
              <strong className="text-white font-mono">
                {totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, totalCount)}
              </strong>{' '}
              of <strong className="text-white font-mono">{totalCount.toLocaleString()}</strong> accounts
            </span>

            <span className="text-[var(--text-muted)]">|</span>

            <div className="flex items-center space-x-1 text-[11px]">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-[rgba(14,20,36,0.9)] text-white border border-[rgba(255,255,255,0.1)] rounded-lg px-2 py-0.5 outline-none font-mono text-[11px]"
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
              className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white flex items-center"
              title="Previous Page"
            >
              <ChevronLeft size={14} />
            </button>

            <span className="px-3 py-1 rounded-lg bg-[rgba(255,255,255,0.05)] text-white text-xs border border-[rgba(255,255,255,0.08)]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-white flex items-center"
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
