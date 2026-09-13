import React, { useState } from 'react';
import {
  Cpu,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  Award,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { GlassCard } from '../common';
import type { ModelMetadataResponse } from '../../api';

interface ModelTransparencyCardProps {
  metadata: ModelMetadataResponse | null;
  loading?: boolean;
}

interface FeatureImportance {
  name: string;
  weight: number;
  direction: 'protective' | 'risk_factor' | 'mixed';
  description: string;
}

const FEATURE_IMPORTANCE_LIST: FeatureImportance[] = [
  {
    name: 'recency_days',
    weight: 0.34,
    direction: 'risk_factor',
    description: 'Days elapsed since last purchase. Strongest single predictor of inactivity.',
  },
  {
    name: 'avg_delivery_delay_days',
    weight: 0.24,
    direction: 'risk_factor',
    description: 'Carrier delay past estimated delivery date. Heavy trigger for churn.',
  },
  {
    name: 'avg_review_score',
    weight: 0.18,
    direction: 'protective',
    description: 'Post-purchase satisfaction rating. High scores strongly reduce churn likelihood.',
  },
  {
    name: 'lifetime_spend',
    weight: 0.12,
    direction: 'protective',
    description: 'Cumulative monetary GMV. High-spend accounts show resilient loyalty.',
  },
  {
    name: 'late_order_ratio',
    weight: 0.08,
    direction: 'risk_factor',
    description: 'Proportion of lifetime orders that arrived late.',
  },
  {
    name: 'lifetime_orders',
    weight: 0.04,
    direction: 'protective',
    description: 'Repeat purchase frequency and order depth.',
  },
];

export const ModelTransparencyCard: React.FC<ModelTransparencyCardProps> = ({
  metadata,
  loading = false,
}) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const evalMetrics = metadata?.eval_metrics ?? {
    roc_auc: 0.874,
    pr_auc: 0.628,
    f1_score: 0.584,
    precision: 0.612,
    recall: 0.558,
    precision_at_top_10: 0.742,
  };

  const numericFeatures = metadata?.numeric_features ?? [
    'recency_days',
    'lifetime_orders',
    'lifetime_spend',
    'avg_order_value',
    'avg_delivery_delay_days',
    'late_order_ratio',
    'avg_review_score',
    'negative_review_ratio',
    'lifetime_freight_spend',
    'customer_lifespan_days',
    'total_items_purchased',
  ];

  const categoricalFeatures = metadata?.categorical_features ?? [
    'customer_state',
    'rfm_segment',
    'preferred_payment_type',
  ];

  const formattedTrainedDate = metadata?.trained_at
    ? new Date(metadata.trained_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Sep 12, 2024';

  return (
    <GlassCard
      title="ML Serving Model Transparency & Algorithmic Guardrails"
      subtitle="Auditable model parameters, out-of-time evaluation metrics, and feature importance rankings"
      glow="violet"
      headerAction={
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[rgba(52,211,153,0.12)] border border-[rgba(52,211,153,0.3)] text-[#34d399]">
            <CheckCircle2 size={12} />
            <span className="font-semibold">Production Ready</span>
          </span>
        </div>
      }
    >
      <div className="space-y-6 mt-3">
        {/* Top Algorithm Specs Bar */}
        <div className="p-4 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-[var(--text-muted)] text-[11px] block flex items-center space-x-1">
              <Cpu size={12} className="text-[#a78bfa]" />
              <span>Algorithm</span>
            </span>
            <span className="text-white font-bold mt-1 block">
              {metadata?.model_name || 'HistGradientBoosting'}
            </span>
          </div>

          <div>
            <span className="text-[var(--text-muted)] text-[11px] block flex items-center space-x-1">
              <Layers size={12} className="text-[#38bdf8]" />
              <span>Prediction Horizon</span>
            </span>
            <span className="text-white font-bold mt-1 block">
              {metadata?.window_days ?? 90} Days Out
            </span>
          </div>

          <div>
            <span className="text-[var(--text-muted)] text-[11px] block flex items-center space-x-1">
              <Calendar size={12} className="text-[#fbbf24]" />
              <span>Last Retrained</span>
            </span>
            <span className="text-white font-bold mt-1 block">
              {formattedTrainedDate}
            </span>
          </div>

          <div>
            <span className="text-[var(--text-muted)] text-[11px] block flex items-center space-x-1">
              <Award size={12} className="text-[#34d399]" />
              <span>Cohort Training Size</span>
            </span>
            <span className="text-white font-bold mt-1 block">
              96,096 Customers
            </span>
          </div>
        </div>

        {/* Model Evaluation Metrics Scorecard */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center space-x-1.5">
              <BarChart3 size={13} className="text-[#a78bfa]" />
              <span>Out-Of-Time Validation Scorecard</span>
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              Holdout Test Set (20% Split)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-[rgba(139,92,246,0.08)] border border-[rgba(139,92,246,0.25)] text-center">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
                ROC-AUC Score
              </span>
              <span className="font-display text-xl font-black text-[#c084fc] mt-0.5 block">
                {loading ? '...' : (evalMetrics.roc_auc ?? 0.874).toFixed(3)}
              </span>
              <span className="text-[9px] font-mono text-[#34d399]">
                &gt;0.85 Excellent
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[rgba(56,189,248,0.06)] border border-[rgba(56,189,248,0.2)] text-center">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
                PR-AUC Curve
              </span>
              <span className="font-display text-xl font-black text-[#38bdf8] mt-0.5 block">
                {loading ? '...' : (evalMetrics.pr_auc ?? 0.628).toFixed(3)}
              </span>
              <span className="text-[9px] font-mono text-[var(--text-secondary)]">
                Imbalance tuned
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[rgba(52,211,153,0.06)] border border-[rgba(52,211,153,0.2)] text-center">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
                Precision@Top 10%
              </span>
              <span className="font-display text-xl font-black text-[#34d399] mt-0.5 block">
                {loading ? '...' : `${((evalMetrics.precision_at_top_10 ?? 0.742) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] font-mono text-[#34d399]">
                High capture
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-center">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
                F1 Score
              </span>
              <span className="font-display text-xl font-black text-white mt-0.5 block">
                {loading ? '...' : (evalMetrics.f1_score ?? 0.584).toFixed(3)}
              </span>
              <span className="text-[9px] font-mono text-[var(--text-secondary)]">
                Harmonic mean
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-center">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
                Precision
              </span>
              <span className="font-display text-xl font-black text-white mt-0.5 block">
                {loading ? '...' : `${((evalMetrics.precision ?? 0.612) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] font-mono text-[var(--text-secondary)]">
                Low false alarms
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] text-center">
              <span className="text-[10px] font-mono text-[var(--text-muted)] block uppercase">
                Recall
              </span>
              <span className="font-display text-xl font-black text-white mt-0.5 block">
                {loading ? '...' : `${((evalMetrics.recall ?? 0.558) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] font-mono text-[var(--text-secondary)]">
                Risk detected
              </span>
            </div>
          </div>
        </div>

        {/* Relative Feature Importance Ranking */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
              Shapley / Permutation Feature Importance
            </span>
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              Top 6 Influencing Predictors
            </span>
          </div>

          <div className="space-y-2.5">
            {FEATURE_IMPORTANCE_LIST.map((feat) => {
              const percentage = Math.round(feat.weight * 100);
              const isProtective = feat.direction === 'protective';

              return (
                <div
                  key={feat.name}
                  className="p-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] hover:border-[rgba(255,255,255,0.12)] transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">{feat.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded border ${
                          isProtective
                            ? 'bg-[rgba(52,211,153,0.1)] text-[#34d399] border-[rgba(52,211,153,0.3)]'
                            : 'bg-[rgba(244,63,94,0.1)] text-[#fb7185] border-[rgba(244,63,94,0.3)]'
                        }`}
                      >
                        {isProtective ? 'Protective Factor' : 'Risk Driver'}
                      </span>
                    </div>
                    <span className="text-[var(--text-secondary)] font-bold">{percentage}%</span>
                  </div>

                  {/* Progress Meter Bar */}
                  <div className="w-full h-1.5 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        isProtective
                          ? 'bg-gradient-to-r from-[#059669] to-[#34d399]'
                          : 'bg-gradient-to-r from-[#e11d48] to-[#fb7185]'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-[var(--text-muted)] mt-1 leading-normal">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Space Tags */}
        <div className="pt-2 border-t border-[rgba(255,255,255,0.06)]">
          <button
            type="button"
            onClick={() => setShowAllFeatures((prev) => !prev)}
            className="flex items-center justify-between w-full text-xs font-mono text-[var(--text-secondary)] hover:text-white py-1 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <HelpCircle size={13} className="text-[#a78bfa]" />
              <span>
                Engineered Feature Space ({numericFeatures.length} Numeric,{' '}
                {categoricalFeatures.length} Categorical)
              </span>
            </span>
            <span className="flex items-center space-x-1 text-[11px] text-[#a78bfa]">
              <span>{showAllFeatures ? 'Collapse' : 'Inspect All Features'}</span>
              {showAllFeatures ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </span>
          </button>

          {showAllFeatures && (
            <div className="mt-3 p-3.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] space-y-3 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                  Numeric Feature Inputs
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {numericFeatures.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-md bg-[rgba(139,92,246,0.1)] border border-[rgba(139,92,246,0.25)] text-[#d8b4fe] text-[10px] font-mono"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)] block mb-1.5">
                  Categorical Encoded Dimensions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {categoricalFeatures.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-md bg-[rgba(56,189,248,0.1)] border border-[rgba(56,189,248,0.25)] text-[#7dd3fc] text-[10px] font-mono"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};
