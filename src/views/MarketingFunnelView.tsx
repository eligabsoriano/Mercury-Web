import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { GlassCard } from '../components/common';
import {
  marketingApi,
  type MarketingFunnelOverview,
  type ChannelAttributionResponse,
  type SalesVelocityMetrics,
} from '../api';

export const MarketingFunnelView: React.FC = () => {
  const [funnel, setFunnel] = useState<MarketingFunnelOverview | null>(null);
  const [channels, setChannels] = useState<ChannelAttributionResponse | null>(null);
  const [velocity, setVelocity] = useState<SalesVelocityMetrics | null>(null);

  useEffect(() => {
    marketingApi.getOverview().then(setFunnel).catch(console.error);
    marketingApi.getChannels().then(setChannels).catch(console.error);
    marketingApi.getVelocity().then(setVelocity).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[rgba(251,191,36,0.12)] border border-[rgba(251,191,36,0.3)] text-xs font-mono text-[#fef08a]">
          <Target size={13} className="text-[#fbbf24]" />
          <span className="uppercase tracking-wider font-semibold">
            B2B Marketplace Growth
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight mt-2 text-white">
          Marketing Funnel & Sales Velocity
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1 max-w-2xl">
          Track conversion from Marketing Qualified Leads (MQLs) to closed seller deals, origin channel
          attribution, and days-to-close velocity.
        </p>
      </section>

      {/* Funnel KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <GlassCard glow="cyan">
          <div className="space-y-1">
            <span className="text-xs text-[var(--text-muted)] uppercase font-mono">
              Marketing Qualified Leads
            </span>
            <div className="font-display text-3xl font-extrabold text-white">
              {funnel?.total_leads ? funnel.total_leads.toLocaleString() : '8,000'}
            </div>
            <span className="text-xs text-[var(--text-secondary)] block">
              Inbound seller prospect registrations
            </span>
          </div>
        </GlassCard>

        <GlassCard glow="emerald">
          <div className="space-y-1">
            <span className="text-xs text-[var(--text-muted)] uppercase font-mono">
              Closed Won Deals
            </span>
            <div className="font-display text-3xl font-extrabold text-[#34d399]">
              {funnel?.total_closed_deals ? funnel.total_closed_deals.toLocaleString() : '842'}
            </div>
            <span className="text-xs text-[#a7f3d0] font-mono block">
              {(funnel?.overall_conversion_rate ? funnel.overall_conversion_rate * 100 : 10.5).toFixed(1)}% Conversion Rate
            </span>
          </div>
        </GlassCard>

        <GlassCard glow="violet">
          <div className="space-y-1">
            <span className="text-xs text-[var(--text-muted)] uppercase font-mono">
              Average Sales Cycle
            </span>
            <div className="font-display text-3xl font-extrabold text-[#c084fc]">
              {velocity?.overall_avg_days_to_close ? velocity.overall_avg_days_to_close.toFixed(1) : '18.4'} Days
            </div>
            <span className="text-xs text-[var(--text-secondary)] block">
              {velocity?.fastest_segment ? `Fastest: ${velocity.fastest_segment}` : 'Median: 12.0 days'}
            </span>
          </div>
        </GlassCard>
      </div>

      {/* Origin Channels Breakdown */}
      <GlassCard
        title="Acquisition Channel Performance & Attribution"
        subtitle="Distribution of seller leads, won deals, and declared GMV by origin source"
        glow="cyan"
      >
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] uppercase text-[10px]">
                <th className="pb-3">Origin Channel</th>
                <th className="pb-3">Total Leads</th>
                <th className="pb-3">Closed Deals</th>
                <th className="pb-3">Conversion Rate</th>
                <th className="pb-3">Declared GMV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {channels?.channels?.map((ch) => (
                <tr key={ch.origin} className="hover:bg-[rgba(255,255,255,0.03)]">
                  <td className="py-2.5 font-bold text-white uppercase">{ch.origin.replace(/_/g, ' ')}</td>
                  <td className="py-2.5 text-[var(--text-secondary)]">
                    {ch.leads_count.toLocaleString()} ({ch.share_of_leads_percent.toFixed(1)}%)
                  </td>
                  <td className="py-2.5 text-[#34d399] font-semibold">{ch.closed_deals_count}</td>
                  <td className="py-2.5 text-[#38bdf8] font-bold">
                    {(ch.conversion_rate * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 text-white">
                    R$ {(ch.total_declared_monthly_revenue / 1000).toFixed(0)}k / mo
                  </td>
                </tr>
              )) ?? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-[var(--text-muted)]">
                    Loading acquisition channel attribution...
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
