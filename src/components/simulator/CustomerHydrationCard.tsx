import React, { useState } from 'react';
import {
  UserCheck,
  Search,
  Copy,
  Check,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  MapPin,
  Clock,
  ShoppingBag,
} from 'lucide-react';
import { GlassCard, RiskTierBadge, SegmentBadge } from '../common';
import { mockCustomersList } from '../../api/mocks/data';

interface CustomerHydrationCardProps {
  selectedCustomerId: string | null;
  onSelectCustomerId: (id: string | null) => void;
  onHydrateBaseline: (id: string) => void;
}

const FEATURED_CANDIDATE_CUSTOMERS = [
  {
    id: '8d50f5eadf502056fa2f144b30424d35',
    label: 'High Risk (Lost) • R$ 382 • SP',
    tier: 'High' as const,
  },
  {
    id: '0a0a9211241f324ab049630b956872d8',
    label: 'High Risk (At Risk) • R$ 412 • RJ',
    tier: 'High' as const,
  },
  {
    id: '3977529608a9133437c6671319932829',
    label: "Can't Lose Them (VIP) • R$ 785 • MG",
    tier: 'High' as const,
  },
  {
    id: 'c8460e4251689ba205045f3ea17884a1',
    label: 'Need Attention • R$ 265 • RS',
    tier: 'Medium' as const,
  },
  {
    id: '47c1a3033b8b7b2b8e94850e51ff0eb5',
    label: 'Champion • R$ 1,240 • PR',
    tier: 'Low' as const,
  },
];

export const CustomerHydrationCard: React.FC<CustomerHydrationCardProps> = ({
  selectedCustomerId,
  onSelectCustomerId,
  onHydrateBaseline,
}) => {
  const [inputVal, setInputVal] = useState('');
  const [copied, setCopied] = useState(false);

  const activeCustomer = selectedCustomerId
    ? mockCustomersList.find((c) => c.customer_unique_id === selectedCustomerId) || null
    : null;

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleApplyInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      onSelectCustomerId(inputVal.trim());
      onHydrateBaseline(inputVal.trim());
    }
  };

  return (
    <GlassCard
      title="Customer Feature Hydration & Baseline Context"
      subtitle="Hydrate baseline features from live database records or evaluate synthetic customer archetypes"
      headerAction={
        selectedCustomerId ? (
          <button
            type="button"
            onClick={() => {
              onSelectCustomerId(null);
              setInputVal('');
            }}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 hover:bg-slate-50 shadow-sm transition-colors font-mono"
          >
            <RotateCcw size={11} />
            <span>Clear Selection</span>
          </button>
        ) : null
      }
    >
      <div className="space-y-4 mt-2">
        {/* Quick-Pick Featured At-Risk Accounts */}
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
            Quick-Select Candidate Accounts:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {FEATURED_CANDIDATE_CUSTOMERS.map((cust) => {
              const isSelected = selectedCustomerId === cust.id;
              return (
                <button
                  key={cust.id}
                  type="button"
                  onClick={() => {
                    onSelectCustomerId(cust.id);
                    onHydrateBaseline(cust.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
                    isSelected
                      ? 'bg-sky-50 text-sky-700 border border-sky-300 font-bold shadow-sm'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      cust.tier === 'High'
                        ? 'bg-rose-500'
                        : cust.tier === 'Medium'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <span>{cust.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search by Customer Unique ID Input */}
        <form onSubmit={handleApplyInput} className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Or enter / paste Customer Unique ID (e.g. 871766c5855e863f6...)"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-mono font-semibold hover:bg-sky-700 shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Hydrate
          </button>
        </form>

        {/* Hydrated Customer Profile Display */}
        {activeCustomer ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
              <div className="flex items-center space-x-2">
                <span className="p-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-700">
                  <UserCheck size={14} />
                </span>
                <span className="font-mono text-xs text-slate-900 font-bold tracking-tight">
                  {activeCustomer.customer_unique_id}
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(activeCustomer.customer_unique_id)}
                  title="Copy Customer ID"
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <SegmentBadge segment={activeCustomer.segment || 'Recent Customers'} />
                <RiskTierBadge
                  tier={activeCustomer.risk_tier || 'Medium'}
                  probability={activeCustomer.churn_probability ?? 0.5}
                />
              </div>
            </div>

            {/* Micro Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block flex items-center space-x-1">
                  <MapPin size={10} className="text-sky-600" />
                  <span>Location</span>
                </span>
                <span className="text-slate-900 font-semibold mt-0.5 block capitalize">
                  {activeCustomer.city}, {activeCustomer.state}
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block flex items-center space-x-1">
                  <ShoppingBag size={10} className="text-emerald-600" />
                  <span>Lifetime Spend</span>
                </span>
                <span className="text-slate-900 font-bold mt-0.5 block">
                  R$ {activeCustomer.lifetime_spend.toFixed(2)} ({activeCustomer.lifetime_orders} orders)
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block flex items-center space-x-1">
                  <Clock size={10} className="text-amber-600" />
                  <span>Customer Tenure</span>
                </span>
                <span className="text-slate-900 font-semibold mt-0.5 block">
                  {activeCustomer.customer_lifespan_days} Days ({activeCustomer.recency_days}d recency)
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                <span className="text-[10px] text-slate-500 block flex items-center space-x-1">
                  <ShieldAlert size={10} className="text-rose-600" />
                  <span>Revenue Exposure</span>
                </span>
                <span className="text-rose-600 font-bold mt-0.5 block">
                  R$ {(activeCustomer.revenue_at_risk ?? 0).toFixed(2)} at risk
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-700">
              <Sparkles size={14} className="text-purple-600" />
              <span>
                Evaluating <strong className="text-slate-900 font-semibold">Synthetic High-Exposure Archetype</strong> (145 days tenure, R$ 340.00 spend, 3.5 days carrier delay)
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white text-purple-700 border border-purple-200 font-medium">
              Generic Sandbox
            </span>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
