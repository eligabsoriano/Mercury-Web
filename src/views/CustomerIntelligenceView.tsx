import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { GlassCard, RiskTierBadge, SegmentBadge, Button } from '../components/common';
import { customersApi, type CustomerSummary } from '../api';

interface CustomerIntelligenceViewProps {
  selectedCustomerId?: string | null;
  onSelectCustomer?: (customerId: string) => void;
}

export const CustomerIntelligenceView: React.FC<CustomerIntelligenceViewProps> = ({
  selectedCustomerId,
  onSelectCustomer,
}) => {
  const [search, setSearch] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [totalCount, setTotalCount] = useState(96096);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadCustomers() {
      setIsLoading(true);
      try {
        const res = await customersApi.list({
          page: 1,
          page_size: 10,
          search: search || undefined,
          segment: segmentFilter !== 'all' ? segmentFilter : undefined,
          risk_tier: riskFilter !== 'all' ? riskFilter : undefined,
        });
        if (isMounted) {
          setCustomers(res.items);
          setTotalCount(res.pagination.total_items);
        }
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadCustomers();
    return () => {
      isMounted = false;
    };
  }, [search, segmentFilter, riskFilter]);

  return (
    <div className="space-y-8">
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
            Granular customer profiling aggregated by customer_unique_id with RFM quintile assignment,
            HistGradientBoosting churn risk scoring, and prescriptive retention playbook routing.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => window.open('/api/customers/export', '_blank')}
          >
            Export CSV
          </Button>
          <Button
            variant="violet"
            size="sm"
            icon={<Sparkles size={14} />}
            onClick={() => onSelectCustomer && onSelectCustomer('8d50f5eadf502056fa2f144b30424d35')}
          >
            Quick 360 Demo
          </Button>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <GlassCard className="p-4" glow="cyan">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by unique ID, state, or location..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-[rgba(255,255,255,0.04)] text-white placeholder:text-[var(--text-muted)] border border-[rgba(255,255,255,0.08)] rounded-xl outline-none focus:border-[rgba(56,189,248,0.5)] transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-1.5 text-xs text-[var(--text-muted)]">
              <Filter size={13} />
              <span>Risk:</span>
            </div>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-[rgba(14,20,36,0.9)] text-xs text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-1.5 outline-none"
            >
              <option value="all">All Risk Tiers</option>
              <option value="High Risk">High Risk (P &ge; 70%)</option>
              <option value="Medium Risk">Medium Risk (40% - 70%)</option>
              <option value="Low Risk">Low Risk (P &lt; 40%)</option>
            </select>

            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="bg-[rgba(14,20,36,0.9)] text-xs text-white border border-[rgba(255,255,255,0.1)] rounded-xl px-3 py-1.5 outline-none"
            >
              <option value="all">All RFM Segments</option>
              <option value="Champions">Champions</option>
              <option value="Loyal Customers">Loyal Customers</option>
              <option value="At Risk">At Risk</option>
              <option value="Can't Lose Them">Can't Lose Them</option>
              <option value="Hibernating">Hibernating</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Customers Data Table */}
      <GlassCard
        title={`Customer Directory (${totalCount.toLocaleString()} Total Buyers)`}
        subtitle="Real-time multi-dimensional scoring hydrated from data warehouse"
        glow="cyan"
      >
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] font-mono uppercase text-[10px]">
                <th className="pb-3 font-semibold">Customer Unique ID</th>
                <th className="pb-3 font-semibold">State</th>
                <th className="pb-3 font-semibold">RFM Cohort</th>
                <th className="pb-3 font-semibold">Orders</th>
                <th className="pb-3 font-semibold">Lifetime Spend</th>
                <th className="pb-3 font-semibold">Delivery Delay</th>
                <th className="pb-3 font-semibold">Churn Risk</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)] font-mono">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[var(--text-muted)] font-sans">
                    Hydrating customer intelligence directory...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[var(--text-muted)] font-sans">
                    No customers match current filter criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr
                    key={c.customer_unique_id}
                    className={`hover:bg-[rgba(255,255,255,0.03)] transition-colors group ${
                      selectedCustomerId === c.customer_unique_id
                        ? 'bg-[rgba(139,92,246,0.12)]'
                        : ''
                    }`}
                  >
                    <td className="py-3 font-bold text-white flex items-center space-x-2">
                      <span className="truncate max-w-[140px]">{c.customer_unique_id}</span>
                    </td>
                    <td className="py-3 text-[var(--text-secondary)]">{c.state ?? 'BR'}</td>
                    <td className="py-3">
                      <SegmentBadge segment={c.segment ?? 'At Risk'} />
                    </td>
                    <td className="py-3 text-white font-bold">{c.lifetime_orders}</td>
                    <td className="py-3 text-[#34d399] font-bold">
                      R$ {c.lifetime_spend.toFixed(2)}
                    </td>
                    <td className="py-3 text-[var(--text-secondary)]">
                      {c.recency_days !== null && c.recency_days !== undefined
                        ? `${c.recency_days}d recency`
                        : 'Active'}
                    </td>
                    <td className="py-3">
                      <RiskTierBadge
                        tier={c.risk_tier ?? 'Low Risk'}
                        probability={c.churn_probability ?? 0.05}
                      />
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectCustomer && onSelectCustomer(c.customer_unique_id)}
                        className="p-1.5 rounded-lg bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(139,92,246,0.25)] text-[var(--text-secondary)] hover:text-white transition-all inline-flex items-center space-x-1"
                      >
                        <span className="text-[10px] font-sans">360</span>
                        <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
