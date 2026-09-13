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
  organic_search: { bg: 'bg-[rgba(56,189,248,0.12)]', text: 'text-[#7dd3fc]', border: 'border-[rgba(56,189,248,0.3)]' },
  paid_search: { bg: 'bg-[rgba(129,140,248,0.12)]', text: 'text-[#a5b4fc]', border: 'border-[rgba(129,140,248,0.3)]' },
  social_media: { bg: 'bg-[rgba(192,132,252,0.12)]', text: 'text-[#d8b4fe]', border: 'border-[rgba(192,132,252,0.3)]' },
  direct_traffic: { bg: 'bg-[rgba(52,211,153,0.12)]', text: 'text-[#6ee7b7]', border: 'border-[rgba(52,211,153,0.3)]' },
  email_campaign: { bg: 'bg-[rgba(251,191,36,0.12)]', text: 'text-[#fde68a]', border: 'border-[rgba(251,191,36,0.3)]' },
  referral: { bg: 'bg-[rgba(244,114,182,0.12)]', text: 'text-[#fbcfe8]', border: 'border-[rgba(244,114,182,0.3)]' },
  other: { bg: 'bg-[rgba(148,163,184,0.12)]', text: 'text-[#cbd5e1]', border: 'border-[rgba(148,163,184,0.3)]' },
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
      className={`liquid-glass rounded-2xl p-6 border border-[rgba(255,255,255,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.36)] relative overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-[rgba(56,189,248,0.12)] border border-[rgba(56,189,248,0.3)] text-[#38bdf8]">
              <Users size={16} />
            </span>
            <h3 className="font-display text-lg font-bold text-white tracking-tight">
              Marketing Qualified Leads & Seller Intake Directory
            </h3>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            Browse prospect registrations, acquisition channel origin, and conversion outcomes
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search MQL ID, segment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.09)] text-xs text-white placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#38bdf8] transition-all w-48 sm:w-56"
            />
          </div>

          {/* Status filter buttons */}
          <div className="flex items-center p-1 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'all'
                  ? 'bg-[rgba(255,255,255,0.12)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('won')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'won'
                  ? 'bg-[rgba(139,92,246,0.25)] text-[#d8b4fe] border border-[rgba(139,92,246,0.4)]'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Won Deals
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === 'active'
                  ? 'bg-[rgba(52,211,153,0.25)] text-[#34d399] border border-[rgba(52,211,153,0.4)]'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Active Sellers
            </button>
          </div>

          {/* Origin channel filter */}
          <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-xs">
            <Filter size={12} className="text-[var(--text-muted)]" />
            <select
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value)}
              className="bg-transparent text-[var(--text-secondary)] focus:text-white outline-none cursor-pointer text-xs"
            >
              <option value="all" className="bg-[#0f172a] text-white">All Channels</option>
              <option value="organic_search" className="bg-[#0f172a] text-white">Organic Search</option>
              <option value="paid_search" className="bg-[#0f172a] text-white">Paid Search</option>
              <option value="social_media" className="bg-[#0f172a] text-white">Social Media</option>
              <option value="direct_traffic" className="bg-[#0f172a] text-white">Direct Traffic</option>
              <option value="email_campaign" className="bg-[#0f172a] text-white">Email Campaign</option>
              <option value="referral" className="bg-[#0f172a] text-white">Referral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] uppercase text-[10px]">
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
          <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[var(--text-muted)]">
                  Loading marketing leads directory...
                </td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-xs text-[var(--text-muted)]">
                  No leads match the specified criteria.
                </td>
              </tr>
            ) : (
              filteredLeads.map((lead) => {
                const originStyle = ORIGIN_COLORS[lead.origin] || ORIGIN_COLORS.other;

                return (
                  <tr
                    key={lead.mql_id}
                    className="hover:bg-[rgba(255,255,255,0.03)] transition-colors group"
                  >
                    <td className="py-3 pl-2 font-bold text-white tracking-wider">
                      {lead.mql_id}
                    </td>

                    <td className="py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${originStyle.bg} ${originStyle.text} ${originStyle.border}`}
                      >
                        {formatOrigin(lead.origin)}
                      </span>
                    </td>

                    <td className="py-3 text-[var(--text-secondary)] capitalize">
                      {lead.business_segment ? lead.business_segment.replace(/_/g, ' ') : '—'}
                    </td>

                    <td className="py-3 text-[var(--text-secondary)] capitalize">
                      {lead.lead_type ? lead.lead_type.replace(/_/g, ' ') : 'Standard'}
                    </td>

                    <td className="py-3">
                      {lead.days_to_close != null ? (
                        <span
                          className={`inline-flex items-center space-x-1 font-semibold ${
                            lead.days_to_close <= 14
                              ? 'text-[#34d399]'
                              : lead.days_to_close <= 20
                              ? 'text-[#fbbf24]'
                              : 'text-[#f43f5e]'
                          }`}
                        >
                          <Clock size={11} />
                          <span>{lead.days_to_close}d</span>
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)]">—</span>
                      )}
                    </td>

                    <td className="py-3 text-white font-medium">
                      {formatBRL(lead.declared_monthly_revenue)}
                    </td>

                    <td className="py-3 text-[#34d399] font-bold">
                      {lead.actual_marketplace_revenue != null
                        ? formatBRL(lead.actual_marketplace_revenue)
                        : <span className="text-[var(--text-muted)] font-normal">—</span>}
                    </td>

                    <td className="py-3 pr-2">
                      <div className="flex items-center space-x-1.5">
                        {lead.is_won ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[rgba(139,92,246,0.18)] text-[#d8b4fe] border border-[rgba(139,92,246,0.35)]">
                            <CheckCircle2 size={10} />
                            <span>Won</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium uppercase bg-[rgba(255,255,255,0.05)] text-[var(--text-muted)] border border-[rgba(255,255,255,0.1)]">
                            In Pipeline
                          </span>
                        )}

                        {lead.is_active_marketplace_seller && (
                          <span
                            title="Active Marketplace Seller (Orders Fulfilled)"
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-[rgba(52,211,153,0.18)] text-[#34d399] border border-[rgba(52,211,153,0.35)] shadow-[0_0_8px_rgba(52,211,153,0.2)]"
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
      <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
        <div className="text-[var(--text-secondary)] font-mono">
          Showing <span className="text-white font-semibold">{filteredLeads.length}</span> of{' '}
          <span className="text-white font-semibold">{totalItems.toLocaleString()}</span> registered leads
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={14} />
            <span>Previous</span>
          </button>

          <span className="px-2 font-mono text-[var(--text-secondary)]">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white hover:bg-[rgba(255,255,255,0.08)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
