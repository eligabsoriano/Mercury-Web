import React, { useState, useMemo } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import type { RetentionAnalyticsResponse, CohortRetentionPoint } from '../../api';

interface CohortRetentionHeatmapProps {
  data: RetentionAnalyticsResponse | null;
  isLoading?: boolean;
}

// Format '2017-01' into 'Jan 2017'
function formatCohortMonth(cohort: string): string {
  const parts = cohort.split('-');
  if (parts.length < 2) return cohort;
  const monthIdx = parseInt(parts[1], 10) - 1;
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[monthIdx] || parts[1]} ${parts[0]}`;
}

// Get dynamic background and text color based on retention rate percentage
function getCellStyles(rate: number | undefined, isM0: boolean): { bg: string; text: string; border?: string } {
  if (rate === undefined) {
    return { bg: 'rgba(255,255,255,0.015)', text: '#334155' };
  }
  if (isM0) {
    return {
      bg: 'rgba(52,211,153,0.3)',
      text: '#6ee7b7',
      border: 'rgba(52,211,153,0.45)',
    };
  }
  if (rate >= 6.0) {
    return {
      bg: 'rgba(52,211,153,0.4)',
      text: '#ecfdf5',
      border: 'rgba(52,211,153,0.6)',
    };
  }
  if (rate >= 4.0) {
    return {
      bg: 'rgba(20,184,166,0.32)',
      text: '#ccfbf1',
      border: 'rgba(20,184,166,0.45)',
    };
  }
  if (rate >= 2.5) {
    return {
      bg: 'rgba(56,189,248,0.24)',
      text: '#e0f2fe',
      border: 'rgba(56,189,248,0.35)',
    };
  }
  if (rate >= 1.0) {
    return {
      bg: 'rgba(139,92,246,0.18)',
      text: '#ede9fe',
      border: 'rgba(139,92,246,0.25)',
    };
  }
  if (rate > 0) {
    return {
      bg: 'rgba(100,116,139,0.14)',
      text: '#94a3b8',
    };
  }
  return {
    bg: 'rgba(255,255,255,0.02)',
    text: '#475569',
  };
}

export const CohortRetentionHeatmap: React.FC<CohortRetentionHeatmapProps> = ({
  data,
  isLoading = false,
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    cohort: CohortRetentionPoint;
    monthKey: string;
    monthIndex: number;
    rate: number;
  } | null>(null);

  const cohorts = useMemo(() => data?.cohorts ?? [], [data]);

  // Months to display: M0 through M11 (or M12)
  const monthKeys = useMemo(() => {
    return ['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9', 'm10', 'm11', 'm12'];
  }, []);

  // Calculate average retention rate per lifecycle period (excluding M0)
  const periodAverages = useMemo(() => {
    const avgs: Record<string, { sum: number; count: number }> = {};
    for (const k of monthKeys) {
      avgs[k] = { sum: 0, count: 0 };
    }

    for (const c of cohorts) {
      for (const k of monthKeys) {
        if (c.retention_rates && c.retention_rates[k] !== undefined) {
          avgs[k].sum += c.retention_rates[k];
          avgs[k].count += 1;
        }
      }
    }

    const result: Record<string, number> = {};
    for (const k of monthKeys) {
      result[k] = avgs[k].count > 0 ? avgs[k].sum / avgs[k].count : 0;
    }
    return result;
  }, [cohorts, monthKeys]);

  return (
    <div className="liquid-glass rounded-2xl p-5 md:p-6 border border-[rgba(255,255,255,0.09)] shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(255,255,255,0.07)]">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display font-bold text-lg text-white tracking-tight">
              12-Month Cohort Retention Decay Matrix
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[rgba(139,92,246,0.14)] text-[#c4b5fd] border border-[rgba(139,92,246,0.3)] font-semibold">
              Survival Analysis
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Percentage of customers from each monthly acquisition cohort returning to place subsequent orders
          </p>
        </div>

        {/* Legend Scale */}
        <div className="flex items-center space-x-2 text-[11px] font-mono text-[var(--text-muted)]">
          <span className="text-[10px] uppercase font-sans">Survival Rate:</span>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-[rgba(100,116,139,0.2)] border border-[rgba(100,116,139,0.3)]" title="< 1%" />
            <span className="w-3 h-3 rounded bg-[rgba(139,92,246,0.3)] border border-[rgba(139,92,246,0.4)]" title="1.0 - 2.5%" />
            <span className="w-3 h-3 rounded bg-[rgba(56,189,248,0.35)] border border-[rgba(56,189,248,0.45)]" title="2.5 - 4.0%" />
            <span className="w-3 h-3 rounded bg-[rgba(20,184,166,0.45)] border border-[rgba(20,184,166,0.55)]" title="4.0 - 6.0%" />
            <span className="w-3 h-3 rounded bg-[rgba(52,211,153,0.6)] border border-[rgba(52,211,153,0.7)]" title="≥ 6.0%" />
          </div>
          <span className="text-[10px] text-[#6ee7b7] font-bold">High (6%+)</span>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-xs text-[var(--text-secondary)] font-mono animate-pulse">
          Calculating monthly cohort survival vectors...
        </div>
      ) : (
        <div className="overflow-x-auto mt-4 pb-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.08)]">
                <th className="py-2.5 px-3 text-left font-sans font-semibold text-[var(--text-secondary)] uppercase text-[10px] tracking-wider min-w-[100px]">
                  Cohort
                </th>
                <th className="py-2.5 px-3 text-right font-sans font-semibold text-[var(--text-secondary)] uppercase text-[10px] tracking-wider min-w-[70px]">
                  Size
                </th>
                {monthKeys.map((k, idx) => (
                  <th
                    key={k}
                    className="py-2.5 px-2 text-center font-mono font-medium text-[var(--text-muted)] text-[10px] min-w-[46px]"
                  >
                    {idx === 0 ? 'M0' : `+${idx}m`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.03)] font-mono text-[11px]">
              {cohorts.map((cohort) => {
                return (
                  <tr key={cohort.cohort_month} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-2 px-3 text-left font-sans font-medium text-white whitespace-nowrap">
                      {formatCohortMonth(cohort.cohort_month)}
                    </td>
                    <td className="py-2 px-3 text-right text-[var(--text-secondary)] font-mono">
                      {cohort.cohort_size.toLocaleString()}
                    </td>
                    {monthKeys.map((k, idx) => {
                      const rate = cohort.retention_rates?.[k];
                      const style = getCellStyles(rate, idx === 0);
                      const hasValue = rate !== undefined;

                      return (
                        <td
                          key={k}
                          onMouseEnter={() => {
                            if (hasValue) {
                              setHoveredCell({
                                cohort,
                                monthKey: k,
                                monthIndex: idx,
                                rate,
                              });
                            }
                          }}
                          onMouseLeave={() => setHoveredCell(null)}
                          className="p-1 text-center"
                        >
                          <div
                            style={{
                              backgroundColor: style.bg,
                              color: style.text,
                              borderColor: style.border || 'transparent',
                            }}
                            className={`py-1 px-1 rounded-md text-[10px] font-bold border transition-all cursor-default ${
                              hasValue ? 'hover:scale-110 hover:shadow-lg' : 'opacity-20'
                            }`}
                          >
                            {hasValue ? `${rate.toFixed(idx === 0 ? 0 : 1)}%` : '—'}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}

              {/* Lifecycle Period Averages Row */}
              <tr className="bg-[rgba(15,23,42,0.65)] font-bold border-t border-[rgba(255,255,255,0.1)]">
                <td className="py-2.5 px-3 text-left font-sans text-xs text-[#a78bfa]">
                  Average Decay
                </td>
                <td className="py-2.5 px-3 text-right text-[var(--text-muted)] text-[10px]">
                  Portfolio
                </td>
                {monthKeys.map((k, idx) => {
                  const avg = periodAverages[k] ?? 0;
                  return (
                    <td key={k} className="p-1 text-center font-mono text-[10px] text-white">
                      <div className="py-1 px-1 rounded bg-[rgba(255,255,255,0.06)]">
                        {idx === 0 ? '100%' : `${avg.toFixed(1)}%`}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Hovered Cell Detail Flyout / Tooltip */}
      {hoveredCell && (
        <div className="mt-3 p-3 rounded-xl bg-[rgba(15,23,42,0.95)] border border-[rgba(139,92,246,0.4)] shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(139,92,246,0.2)] flex items-center justify-center text-[#c084fc]">
              <Calendar size={15} />
            </div>
            <div>
              <span className="font-display font-bold text-white">
                Cohort: {formatCohortMonth(hoveredCell.cohort.cohort_month)}
              </span>
              <span className="text-[11px] text-[var(--text-muted)] ml-2">
                ({hoveredCell.cohort.cohort_size.toLocaleString()} accounts acquired)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 font-mono text-xs">
            <div>
              <span className="text-[var(--text-muted)] text-[10px] block font-sans">
                Lifecycle Period:
              </span>
              <span className="font-bold text-white">
                Month {hoveredCell.monthIndex} (+{hoveredCell.monthIndex * 30} days)
              </span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-[10px] block font-sans">
                Survival Rate:
              </span>
              <span className="font-bold text-[#6ee7b7]">
                {hoveredCell.rate.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-[var(--text-muted)] text-[10px] block font-sans">
                Retained Buyers:
              </span>
              <span className="font-bold text-[#38bdf8]">
                ~{Math.round((hoveredCell.cohort.cohort_size * hoveredCell.rate) / 100).toLocaleString()} buyers
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Executive Cohort Retention Takeaway Callout */}
      <div className="mt-4 p-4 rounded-xl bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.25)] flex items-start space-x-3 text-xs">
        <Sparkles size={16} className="text-[#a78bfa] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-display font-bold text-white flex items-center space-x-2">
            <span>Executive Cohort Takeaway: Single-Purchase Marketplace Drop-Off</span>
            <span className="text-[10px] font-mono text-[#34d399] px-2 py-0.5 rounded-full bg-[rgba(52,211,153,0.15)] border border-[rgba(52,211,153,0.3)]">
              High Leverage Area
            </span>
          </div>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Marketplace customers exhibit typical steep single-order churn, dropping from 100% to an average of
            <strong> 4.9%</strong> in Month 1 and stabilizing between <strong>2.0% – 3.5%</strong> across trailing quarters.
            Because aggregate repeat buyer rate is <strong>2.99%</strong>, lifting Month 1 re-engagement by +200 bps
            unlocks an estimated <strong className="text-white">+R$ 1.84M in annual recurring GMV</strong> without additional customer acquisition cost (CAC).
          </p>
        </div>
      </div>
    </div>
  );
};
