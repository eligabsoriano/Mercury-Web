import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Store,
  ChevronLeft,
  ChevronRight,
  Clock,
} from 'lucide-react';
import type { MarketingLeadSummary, PaginationMeta } from '../../api';

export interface LeadsDirectoryProps {
  leads?: MarketingLeadSummary[] | null;
  pagination?: PaginationMeta | null;
  isLoading?: boolean;
  onPageChange?: (newPage: number) => void;
  className?: string;
}

const ORIGIN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  organic_search: { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  paid_search: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  social_media: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  direct_traffic: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  email_campaign: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  referral: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
  other: { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

function formatOrigin(origin: string): string {
  return origin.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatBRL(amount?: number | null): string {
  if (amount == null) return '—';
  return `R$ ${amount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
}

export const LeadsDirectory: React.FC<LeadsDirectoryProps> = ({
  leads,
  pagination,
  isLoading = false,
  onPageChange,
  className = '',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'won' | 'active'>('all');
  const [originFilter, setOriginFilter] = useState<string>('all');
  const [localPage, setLocalPage] = useState<number>(1);

  const fallbackLeads = useMemo<MarketingLeadSummary[]>(() => [
    { mql_id: 'mql-001', origin: 'organic_search', business_segment: 'health_beauty', lead_type: 'online_medium', won_date: '2018-04-12T14:20:00Z', declared_monthly_revenue: 25000.0, actual_marketplace_revenue: 34200.0, days_to_close: 14, is_won: true, is_active_marketplace_seller: true },
    { mql_id: 'mql-002', origin: 'paid_search', business_segment: 'home_appliances', lead_type: 'online_big', won_date: '2018-05-02T10:15:00Z', declared_monthly_revenue: 60000.0, actual_marketplace_revenue: 82400.0, days_to_close: 9, is_won: true, is_active_marketplace_seller: true },
    { mql_id: 'mql-003', origin: 'social_media', business_segment: 'fashion_clothing', lead_type: 'offline_small', won_date: '2018-06-18T16:45:00Z', declared_monthly_revenue: 12000.0, actual_marketplace_revenue: 9500.0, days_to_close: 26, is_won: true, is_active_marketplace_seller: false },
    { mql_id: 'mql-004', origin: 'direct_traffic', business_segment: 'computers_accessories', lead_type: 'online_medium', won_date: '2018-03-24T11:30:00Z', declared_monthly_revenue: 35000.0, actual_marketplace_revenue: 41200.0, days_to_close: 15, is_won: true, is_active_marketplace_seller: true },
    { mql_id: 'mql-005', origin: 'email_campaign', business_segment: 'sports_leisure', lead_type: 'online_medium', won_date: '2018-04-29T15:00:00Z', declared_monthly_revenue: 20000.0, actual_marketplace_revenue: 18900.0, days_to_close: 18, is_won: true, is_active_marketplace_seller: true },
    { mql_id: 'mql-006', origin: 'referral', business_segment: 'health_beauty', lead_type: 'offline_small', won_date: null, declared_monthly_revenue: 8000.0, actual_marketplace_revenue: null, days_to_close: null, is_won: false, is_active_marketplace_seller: false },
    { mql_id: 'mql-007', origin: 'organic_search', business_segment: 'home_appliances', lead_type: 'online_big', won_date: '2018-02-19T09:00:00Z', declared_monthly_revenue: 75000.0, actual_marketplace_revenue: 98000.0, days_to_close: 11, is_won: true, is_active_marketplace_seller: true },
    { mql_id: 'mql-008', origin: 'paid_search', business_segment: 'computers_accessories', lead_type: 'online_medium', won_date: null, declared_monthly_revenue: 22000.0, actual_marketplace_revenue: null, days_to_close: null, is_won: false, is_active_marketplace_seller: false },
  ], []);

  const rawLeads = leads && leads.length > 0 ? leads : fallbackLeads;

  // Filtered items
  const filteredLeads = useMemo(() => {
    return rawLeads.filter((lead) => {
      // Status filter
      if (statusFilter === 'won' && !lead.is_won) return false;
      if (statusFilter === 'active' && !lead.is_active_marketplace_seller) return false;

      // Origin filter
      if (originFilter !== 'all' && lead.origin !== originFilter) return false;

      // Search term
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesMql = lead.mql_id.toLowerCase().includes(query);
        const matchesSegment = lead.business_segment?.toLowerCase().includes(query);
        const matchesOrigin = lead.origin.toLowerCase().includes(query);
        if (!matchesMql && !matchesSegment && !matchesOrigin) return false;
      }

      return true;
    });
  }, [rawLeads, statusFilter, originFilter, searchTerm]);

  // Current page calculations
  const totalItems = pagination?.total_items ?? filteredLeads.length;
  const totalPages = pagination?.total_pages ?? Math.max(1, Math.ceil(filteredLeads.length / 5));
  const currentPage = pagination?.page ?? localPage;

  const handlePrevPage = () => {
    const next = Math.max(1, currentPage - 1);
    setLocalPage(next);
    onPageChange?.(next);
  };

  const handleNextPage = () => {
    const next = Math.min(totalPages, currentPage + 1);
    setLocalPage(next);
    onPageChange?.(next);
  };

  return (
    <div
      data-testid="leads-directory-card"
      className={`bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs relative overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-600">
              <Users size={16} />
            </span>
            <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">
              Marketing Qualified Leads &amp; Seller Intake Directory
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse prospect registrations, acquisition channel origin, and conversion outcomes
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search MQL ID, segment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-all w-48 sm:w-56"
            />
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('won')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'won'
                  ? 'bg-violet-50 text-violet-700 border border-violet-200 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Won Deals
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active Sellers
            </button>
          </div>

          {/* Origin channel filter */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <Filter size={12} className="text-slate-500" />
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="bg-transparent text-slate-700 focus:text-slate-900 outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-white text-slate-900">All Channels</option>
              <option value="organic_search" className="bg-white text-slate-900">Organic Search</option>
              <option value="paid_search" className="bg-white text-slate-900">Paid Search</option>
              <option value="social_media" className="bg-white text-slate-900">Social Media</option>
              <option value="direct_traffic" className="bg-white text-slate-900">Direct Traffic</option>
              <option value="email_campaign" className="bg-white text-slate-900">Email Campaign</option>
              <option value="referral" className="bg-white text-slate-900">Referral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px]">
              <th className="pb-3 pl-2">MQL ID</th>
              <th className="pb-3">Origin Channel</th>
              <th className="pb-3">Segment</th>
              <th className="pb-3">Lead Type</th>
              <th className="pb-3">Days to Close</th>
              <th className="pb-3">Declared GMV</th>
              <th className="pb-3">Realized GMV</th>
              <th className="pb-3 pr-2">Deal Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                  Loading marketing leads directory...
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                  No leads match the specified criteria.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const originStyle = ORIGIN_COLORS[lead.origin] || ORIGIN_COLORS.other;

                return (
                  <tr
                    key={lead.mql_id}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="py-3 pl-2 font-bold text-slate-900 tracking-wider">
                      {lead.mql_id}
                    </td>

                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${originStyle.bg} ${originStyle.text} ${originStyle.border}`}
                      >
                        {formatOrigin(lead.origin)}
                      </span>
                    </td>

                    <td className="py-3 text-slate-600 capitalize">
                      {lead.business_segment ? lead.business_segment.replace(/_/g, ' ') : '—'}
                    </td>

                    <td className="py-3 text-slate-600 capitalize">
                      {lead.lead_type ? lead.lead_type.replace(/_/g, ' ') : 'Standard'}
                    </td>

                    <td className="py-3">
                      {lead.days_to_close != null ? (
                        <span
                          className={`inline-flex items-center space-x-1 font-semibold ${
                            lead.days_to_close <= 14
                              ? 'text-emerald-600'
                              : lead.days_to_close <= 20
                              ? 'text-amber-600'
                              : 'text-rose-600'
                          }`}
                        >
                          <Clock size={11} />
                          <span>{lead.days_to_close}d</span>
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3 text-slate-800 font-medium">
                      {formatBRL(lead.declared_monthly_revenue)}
                    </td>

                    <td className="py-3 text-emerald-600 font-bold">
                      {lead.actual_marketplace_revenue != null
                        ? formatBRL(lead.actual_marketplace_revenue)
                        : <span className="text-slate-400 font-normal">—</span>}
                    </td>

                    <td className="py-3 pr-2">
                      <div className="flex items-center space-x-1.5">
                        {lead.is_won ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-violet-50 text-violet-700 border border-violet-200">
                            <CheckCircle2 size={10} />
                            <span>Won</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase bg-slate-100 text-slate-500 border border-slate-200">
                            In Pipeline
                          </span>
                        )}

                        {lead.is_active_marketplace_seller && (
                          <span
                            title="Active Marketplace Seller (Orders Fulfilled)"
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200"
                          >
                            <Store size={10} />
                            <span>Active</span>
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <div className="text-slate-500 font-mono">
          Showing <span className="text-slate-900 font-semibold">{filteredLeads.length}</span> of{' '}
          <span className="text-slate-900 font-semibold">{totalItems.toLocaleString()}</span> registered leads
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          <span className="px-2 font-mono text-slate-500">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
