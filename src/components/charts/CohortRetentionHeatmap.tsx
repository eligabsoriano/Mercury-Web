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

// Get dynamic background and text color based on retention rate percentage for light mode
function getCellStyles(rate: number | undefined, isM0: boolean): { bg: string; text: string; border?: string } {
  if (rate === undefined) {
    return { bg: '#f8fafc', text: '#cbd5e1' };
  }
  if (isM0) {
    return {
      bg: '#ecfdf5',
      text: '#047857',
      border: '#a7f3d0',
    };
  }
  if (rate >= 6.0) {
    return {
      bg: '#d1fae5',
      text: '#065f46',
      border: '#6ee7b7',
    };
  }
  if (rate >= 4.0) {
    return {
      bg: '#ccfbf1',
      text: '#0f766e',
      border: '#5eead4',
    };
  }
  if (rate >= 2.5) {
    return {
      bg: '#e0f2fe',
      text: '#0369a1',
      border: '#7dd3fc',
    };
  }
  if (rate >= 1.0) {
    return {
      bg: '#eef2ff',
      text: '#4338ca',
      border: '#c7d2fe',
    };
  }
  if (rate > 0) {
    return {
      bg: '#f1f5f9',
      text: '#475569',
      border: '#e2e8f0',
    };
  }
  return {
    bg: '#f8fafc',
    text: '#94a3b8',
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
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-display font-bold text-lg text-slate-900 tracking-tight">
              12-Month Cohort Retention Decay Matrix
            </h3>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
              Survival Analysis
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Percentage of customers from each monthly acquisition cohort returning to place subsequent orders
          </p>
        </div>

        {/* Legend Scale */}
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-500">
          <span className="text-[10px] uppercase font-sans">Survival Rate:</span>
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200" title="< 1%" />
            <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-200" title="1.0 - 2.5%" />
            <span className="w-3 h-3 rounded bg-sky-100 border border-sky-200" title="2.5 - 4.0%" />
            <span className="w-3 h-3 rounded bg-teal-100 border border-teal-200" title="4.0 - 6.0%" />
            <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-200" title="≥ 6.0%" />
          </div>
          <span className="text-[10px] text-emerald-700 font-bold">High (6%+)</span>
        </div>
      </div>

      {/* Heatmap Matrix Table */}
      {isLoading ? (
        <div className="h-64 flex items-center justify-center text-xs text-slate-400 font-mono animate-pulse">
          Calculating monthly cohort survival vectors...
        </div>
      ) : (
        <div className="overflow-x-auto mt-4 pb-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-2.5 px-3 text-left font-sans font-semibold text-slate-600 uppercase text-[10px] tracking-wider min-w-[100px]">
                  Cohort
                </th>
                <th className="py-2.5 px-3 text-right font-sans font-semibold text-slate-600 uppercase text-[10px] tracking-wider min-w-[70px]">
                  Size
                </th>
                {monthKeys.map((k, idx) => (
                  <th
                    key={k}
                    className="py-2.5 px-2 text-center font-mono font-medium text-slate-400 text-[10px] min-w-[46px]"
                  >
                    {idx === 0 ? 'M0' : `+${idx}m`}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {cohorts.map((cohort) => {
                return (
                  <tr key={cohort.cohort_month} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2 px-3 text-left font-sans font-medium text-slate-900 whitespace-nowrap">
                      {formatCohortMonth(cohort.cohort_month)}
                    </td>
                    <td className="py-2 px-3 text-right text-slate-500 font-mono">
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
                              hasValue ? 'hover:scale-110 hover:shadow-sm' : 'opacity-30'
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
              <tr className="bg-slate-50 font-bold border-t border-slate-200">
                <td className="py-2.5 px-3 text-left font-sans text-xs text-indigo-700">
                  Average Decay
                </td>
                <td className="py-2.5 px-3 text-right text-slate-400 text-[10px]">
                  Portfolio
                </td>
                {monthKeys.map((k, idx) => {
                  const avg = periodAverages[k] ?? 0;
                  return (
                    <td key={k} className="p-1 text-center font-mono text-[10px] text-slate-800">
                      <div className="py-1 px-1 rounded bg-white border border-slate-200 shadow-2xs">
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
        <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-150">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Calendar size={15} />
            </div>
            <div>
              <span className="font-display font-bold text-slate-900">
                Cohort: {formatCohortMonth(hoveredCell.cohort.cohort_month)}
              </span>
              <span className="text-[11px] text-slate-500 ml-2">
                ({hoveredCell.cohort.cohort_size.toLocaleString()} accounts acquired)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 font-mono text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">
                Lifecycle Period:
              </span>
              <span className="font-bold text-slate-900">
                Month {hoveredCell.monthIndex} (+{hoveredCell.monthIndex * 30} days)
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">
                Survival Rate:
              </span>
              <span className="font-bold text-emerald-700">
                {hoveredCell.rate.toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-sans">
                Retained Buyers:
              </span>
              <span className="font-bold text-sky-700">
                ~{Math.round((hoveredCell.cohort.cohort_size * hoveredCell.rate) / 100).toLocaleString()} buyers
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Executive Cohort Retention Takeaway Callout */}
      <div className="mt-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 flex items-start space-x-3 text-xs">
        <Sparkles size={16} className="text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-display font-bold text-slate-900 flex items-center space-x-2">
            <span>Executive Cohort Takeaway: Single-Purchase Marketplace Drop-Off</span>
            <span className="text-[10px] font-mono text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 font-semibold">
              High Leverage Area
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Marketplace customers exhibit typical steep single-order churn, dropping from 100% to an average of
            <strong className="text-slate-900"> 4.9%</strong> in Month 1 and stabilizing between <strong className="text-slate-900">2.0% – 3.5%</strong> across trailing quarters.
            Because aggregate repeat buyer rate is <strong className="text-slate-900">2.99%</strong>, lifting Month 1 re-engagement by +200 bps
            unlocks an estimated <strong className="text-emerald-700 font-bold">+R$ 1.84M in annual recurring GMV</strong> without additional customer acquisition cost (CAC).
          </p>
        </div>
      </div>
    </div>
  );
};
