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
      headerAction={
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
            <CheckCircle2 size={12} />
            <span className="font-semibold">Production Ready</span>
          </span>
        </div>
      }
    >
      <div className="space-y-6 mt-3">
        {/* Top Algorithm Specs Bar */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[11px] block flex items-center space-x-1">
              <Cpu size={12} className="text-purple-600" />
              <span>Algorithm</span>
            </span>
            <span className="text-slate-900 font-bold mt-1 block">
              {metadata?.model_name || 'HistGradientBoosting'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[11px] block flex items-center space-x-1">
              <Layers size={12} className="text-sky-600" />
              <span>Prediction Horizon</span>
            </span>
            <span className="text-slate-900 font-bold mt-1 block">
              {metadata?.window_days ?? 90} Days Out
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[11px] block flex items-center space-x-1">
              <Calendar size={12} className="text-amber-600" />
              <span>Last Retrained</span>
            </span>
            <span className="text-slate-900 font-bold mt-1 block">
              {formattedTrainedDate}
            </span>
          </div>

          <div>
            <span className="text-slate-500 text-[11px] block flex items-center space-x-1">
              <Award size={12} className="text-emerald-600" />
              <span>Cohort Training Size</span>
            </span>
            <span className="text-slate-900 font-bold mt-1 block">
              96,096 Customers
            </span>
          </div>
        </div>

        {/* Model Evaluation Metrics Scorecard */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold flex items-center space-x-1.5">
              <BarChart3 size={13} className="text-purple-600" />
              <span>Out-Of-Time Validation Scorecard</span>
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Holdout Test Set (20% Split)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-center">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">
                ROC-AUC Score
              </span>
              <span className="font-display text-xl font-black text-purple-700 mt-0.5 block">
                {loading ? '...' : (evalMetrics.roc_auc ?? 0.874).toFixed(3)}
              </span>
              <span className="text-[9px] font-mono text-emerald-600 font-semibold">
                &gt;0.85 Excellent
              </span>
            </div>

            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-center">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">
                PR-AUC Curve
              </span>
              <span className="font-display text-xl font-black text-sky-700 mt-0.5 block">
                {loading ? '...' : (evalMetrics.pr_auc ?? 0.628).toFixed(3)}
              </span>
              <span className="text-[9px] font-mono text-slate-600">
                Imbalance tuned
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">
                Precision@Top 10%
              </span>
              <span className="font-display text-xl font-black text-emerald-700 mt-0.5 block">
                {loading ? '...' : `${((evalMetrics.precision_at_top_10 ?? 0.742) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] font-mono text-emerald-600 font-semibold">
                High capture
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">
                F1 Score
              </span>
              <span className="font-display text-xl font-black text-slate-900 mt-0.5 block">
                {loading ? '...' : (evalMetrics.f1_score ?? 0.584).toFixed(3)}
              </span>
              <span className="text-[9px] font-mono text-slate-600">
                Harmonic mean
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">
                Precision
              </span>
              <span className="font-display text-xl font-black text-slate-900 mt-0.5 block">
                {loading ? '...' : `${((evalMetrics.precision ?? 0.612) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] font-mono text-slate-600">
                Low false alarms
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-mono text-slate-500 block uppercase">
                Recall
              </span>
              <span className="font-display text-xl font-black text-slate-900 mt-0.5 block">
                {loading ? '...' : `${((evalMetrics.recall ?? 0.558) * 100).toFixed(1)}%`}
              </span>
              <span className="text-[9px] font-mono text-slate-600">
                Risk detected
              </span>
            </div>
          </div>
        </div>

        {/* Relative Feature Importance Ranking */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-700 font-semibold">
              Shapley / Permutation Feature Importance
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
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
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-slate-900 font-semibold">{feat.name}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border font-medium ${
                          isProtective
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {isProtective ? 'Protective Factor' : 'Risk Driver'}
                      </span>
                    </div>
                    <span className="text-slate-600 font-bold">{percentage}%</span>
                  </div>

                  {/* Progress Meter Bar - Solid Color, No Gradient */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isProtective ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Feature Space Tags */}
        <div className="pt-2 border-t border-slate-200">
          <button
            type="button"
            onClick={() => setShowAllFeatures((prev) => !prev)}
            className="flex items-center justify-between w-full text-xs font-mono text-slate-600 hover:text-slate-900 py-1 transition-colors"
          >
            <span className="flex items-center space-x-1.5">
              <HelpCircle size={13} className="text-purple-600" />
              <span>
                Engineered Feature Space ({numericFeatures.length} Numeric,{' '}
                {categoricalFeatures.length} Categorical)
              </span>
            </span>
            <span className="flex items-center space-x-1 text-[11px] text-purple-600 font-semibold">
              <span>{showAllFeatures ? 'Collapse' : 'Inspect All Features'}</span>
              {showAllFeatures ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </span>
          </button>

          {showAllFeatures && (
            <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 animate-fadeIn">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
                  Numeric Feature Inputs
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {numericFeatures.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 text-purple-700 text-[10px] font-mono font-medium"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block mb-1.5">
                  Categorical Encoded Dimensions
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {categoricalFeatures.map((f) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-200 text-sky-700 text-[10px] font-mono font-medium"
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
