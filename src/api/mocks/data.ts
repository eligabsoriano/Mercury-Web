import type { components } from '../../types/api';

export type PortfolioOverview = components['schemas']['PortfolioOverview'];
export type SegmentsOverview = components['schemas']['SegmentsOverview'];
export type SegmentDistribution = components['schemas']['SegmentDistribution'];
export type RFMScorecard = components['schemas']['RFMScorecard'];
export type RevenueAtRiskOverview = components['schemas']['RevenueAtRiskOverview'];
export type RiskTierSummary = components['schemas']['RiskTierSummary'];
export type RetentionPrioritySummary = components['schemas']['RetentionPrioritySummary'];
export type RevenueAnalyticsResponse = components['schemas']['RevenueAnalyticsResponse'];
export type RevenueTrendPoint = components['schemas']['RevenueTrendPoint'];
export type RetentionAnalyticsResponse = components['schemas']['RetentionAnalyticsResponse'];
export type CohortRetentionPoint = components['schemas']['CohortRetentionPoint'];
export type CustomerListResponse = components['schemas']['CustomerListResponse'];
export type CustomerSummary = components['schemas']['CustomerSummary'];
export type CustomerDetail = components['schemas']['CustomerDetail'];
export type ChurnPredictionResult = components['schemas']['ChurnPredictionResult'];
export type ChurnPredictionInput = components['schemas']['ChurnPredictionInput'];
export type CounterfactualSimulationRequest = components['schemas']['CounterfactualSimulationRequest'];
export type CounterfactualSimulationResponse = components['schemas']['CounterfactualSimulationResponse'];
export type ModelMetadataResponse = components['schemas']['ModelMetadataResponse'];
export type RetentionPlaybook = components['schemas']['RetentionPlaybook'];
export type CampaignSimulationRequest = components['schemas']['CampaignSimulationRequest'];
export type CampaignSimulationResult = components['schemas']['CampaignSimulationResult'];
export type BudgetAllocationRequest = components['schemas']['BudgetAllocationRequest'];
export type BudgetAllocationResult = components['schemas']['BudgetAllocationResult'];
export type CustomerPlaybookRecommendation = components['schemas']['CustomerPlaybookRecommendation'];
export type MarketingFunnelOverview = components['schemas']['MarketingFunnelOverview'];
export type ChannelAttributionResponse = components['schemas']['ChannelAttributionResponse'];
export type SalesVelocityMetrics = components['schemas']['SalesVelocityMetrics'];
export type SegmentPerformanceResponse = components['schemas']['SegmentPerformanceResponse'];
export type MarketingLeadsListResponse = components['schemas']['MarketingLeadsListResponse'];
export type ProductListResponse = components['schemas']['ProductListResponse'];
export type CategoryListResponse = components['schemas']['CategoryListResponse'];
export type ProductSummary = components['schemas']['ProductSummary'];
export type SellerListResponse = components['schemas']['SellerListResponse'];
export type SellerDetail = components['schemas']['SellerDetail'];
export type PipelineHealthResponse = components['schemas']['PipelineHealthResponse'];
export type HealthResponse = components['schemas']['HealthResponse'];
export type TokenResponse = components['schemas']['TokenResponse'];
export type UserIdentity = components['schemas']['UserIdentity'];
export type ChannelAttribution = components['schemas']['ChannelAttribution'];
export type VelocityBySegment = components['schemas']['VelocityBySegment'];
export type VelocityByLeadType = components['schemas']['VelocityByLeadType'];
export type MarketingLeadSummary = components['schemas']['MarketingLeadSummary'];
export type CategorySummary = components['schemas']['CategorySummary'];
export type CategoryPerformance = CategorySummary;
export type SellerSummary = components['schemas']['SellerSummary'];
export type PaginationMeta = components['schemas']['PaginationMeta'];

// -------------------------------------------------------------------------
// 1. Health & Pipeline Observability
// -------------------------------------------------------------------------

export const mockHealth: HealthResponse = {
  app_name: 'Mercury Customer Intelligence API',
  status: 'ok',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
  database: {} as Record<string, never>,
};

export const mockPipelineHealth: PipelineHealthResponse = {
  status: 'ok',
  database_connected: true,
  database_latency_ms: 38,
  timestamp: new Date().toISOString(),
  anomalies: [],
  freshness: {
    pipeline_freshness_status: 'fresh',
    last_order_timestamp: '2018-08-29T15:00:37Z',
    last_pipeline_run: {
      run_id: 'pipeline-run-2024-09-12-0800',
      status: 'success',
      start_time: '2024-09-12T08:00:00Z',
      end_time: '2024-09-12T08:04:18Z',
      duration_seconds: 258,
      steps_executed: [
        'raw_stream_ingest',
        'dbt_staging_build',
        'dbt_marts_refresh',
        'rfm_segmentation_engine',
        'train_churn_model',
        'anomaly_detection_audit',
      ],
    },
  },
  table_counts: {
    raw_customers: 99441,
    raw_orders: 99441,
    mart_customer_metrics: 96096,
    mart_fact_orders: 99441,
    mart_marketing_funnel: 8000,
    ml_rfm_segments: 96096,
    ml_churn_predictions: 96096,
  },
  model: {
    artifact_found: true,
    artifact_path: 'artifacts/churn_model.joblib',
    features_count: 24,
    file_size_bytes: 4892014,
    is_trained: true,
    last_modified: '2024-09-12T08:03:52Z',
    model_type: 'HistGradientBoostingClassifier',
  },
};

// -------------------------------------------------------------------------
// 2. Auth & Current Identity
// -------------------------------------------------------------------------

export const mockToken: TokenResponse = {
  access_token: 'mercury-executive-jwt-session-token-live',
  token_type: 'bearer',
  expires_in: 86400,
};

export const mockUserIdentity: UserIdentity = {
  authenticated: true,
  auth_type: 'bearer',
  user: 'executive-vp-growth',
  roles: ['c_level_executive', 'retention_lead', 'ml_analyst'],
};

// -------------------------------------------------------------------------
// 3. Analytics Overview & Segmentations
// -------------------------------------------------------------------------

export const mockPortfolioOverview: PortfolioOverview = {
  total_customers: 96096,
  total_orders: 99441,
  total_revenue: 15984250.8,
  avg_order_value: 160.74,
  repeat_buyer_rate: 2.99,
  avg_churn_probability: 0.442,
  high_risk_customers_count: 17680,
  high_risk_percentage: 18.4,
  portfolio_revenue_at_risk: 2452300.5,
  portfolio_risk_percentage: 15.34,
  vip_retention_revenue_at_risk: 842100.2,
};

export const mockSegmentsOverview: SegmentsOverview = {
  total_customers: 96096,
  segments: [
    {
      segment: 'Champions',
      customer_count: 5765,
      percentage: 6.0,
      avg_spend: 384.5,
      total_spend: 2216642.5,
      avg_frequency: 2.4,
      avg_recency_days: 38,
    },
    {
      segment: 'Loyal Customers',
      customer_count: 8648,
      percentage: 9.0,
      avg_spend: 245.2,
      total_spend: 2120489.6,
      avg_frequency: 1.8,
      avg_recency_days: 64,
    },
    {
      segment: 'Potential Loyalists',
      customer_count: 11531,
      percentage: 12.0,
      avg_spend: 182.4,
      total_spend: 2103254.4,
      avg_frequency: 1.2,
      avg_recency_days: 82,
    },
    {
      segment: 'Recent Customers',
      customer_count: 6726,
      percentage: 7.0,
      avg_spend: 154.1,
      total_spend: 1036476.6,
      avg_frequency: 1.0,
      avg_recency_days: 28,
    },
    {
      segment: 'Promising',
      customer_count: 7687,
      percentage: 8.0,
      avg_spend: 142.3,
      total_spend: 1093860.1,
      avg_frequency: 1.0,
      avg_recency_days: 74,
    },
    {
      segment: 'Customers Needing Attention',
      customer_count: 10570,
      percentage: 11.0,
      avg_spend: 168.9,
      total_spend: 1785273.0,
      avg_frequency: 1.1,
      avg_recency_days: 142,
    },
    {
      segment: 'About to Sleep',
      customer_count: 9609,
      percentage: 10.0,
      avg_spend: 138.2,
      total_spend: 1327963.8,
      avg_frequency: 1.0,
      avg_recency_days: 198,
    },
    {
      segment: 'At Risk',
      customer_count: 12492,
      percentage: 13.0,
      avg_spend: 195.4,
      total_spend: 2440936.8,
      avg_frequency: 1.1,
      avg_recency_days: 278,
    },
    {
      segment: "Can't Lose Them",
      customer_count: 3844,
      percentage: 4.0,
      avg_spend: 412.8,
      total_spend: 1586799.2,
      avg_frequency: 2.1,
      avg_recency_days: 312,
    },
    {
      segment: 'Hibernating',
      customer_count: 11531,
      percentage: 12.0,
      avg_spend: 118.6,
      total_spend: 1367576.6,
      avg_frequency: 1.0,
      avg_recency_days: 364,
    },
    {
      segment: 'Lost',
      customer_count: 7693,
      percentage: 8.0,
      avg_spend: 117.8,
      total_spend: 906235.4,
      avg_frequency: 1.0,
      avg_recency_days: 480,
    },
  ],
};

export const mockRevenueAtRiskOverview: RevenueAtRiskOverview = {
  total_revenue_at_risk: 2452300.5,
  total_historical_spend: 15984250.8,
  portfolio_risk_percentage: 15.34,
  by_risk_tier: [
    {
      risk_tier: 'High',
      customer_count: 17680,
      percentage: 18.4,
      avg_churn_probability: 0.814,
      total_revenue_at_risk: 1480200.5,
    },
    {
      risk_tier: 'Medium',
      customer_count: 29790,
      percentage: 31.0,
      avg_churn_probability: 0.492,
      total_revenue_at_risk: 732100.0,
    },
    {
      risk_tier: 'Low',
      customer_count: 48626,
      percentage: 50.6,
      avg_churn_probability: 0.186,
      total_revenue_at_risk: 240000.0,
    },
  ],
  by_retention_priority: [
    {
      retention_priority: 'Priority 1 (VIP Retention)',
      customer_count: 3844,
      percentage: 4.0,
      total_revenue_at_risk: 842100.2,
    },
    {
      retention_priority: 'Priority 2 (Logistics Recovery)',
      customer_count: 5120,
      percentage: 5.3,
      total_revenue_at_risk: 638100.3,
    },
    {
      retention_priority: 'Priority 3 (Win-Back)',
      customer_count: 8716,
      percentage: 9.1,
      total_revenue_at_risk: 420000.0,
    },
    {
      retention_priority: 'Priority 4 (Baseline Operational)',
      customer_count: 78416,
      percentage: 81.6,
      total_revenue_at_risk: 552100.0,
    },
  ],
};

export const mockRevenueTrends: RevenueAnalyticsResponse = {
  interval: 'month',
  total_periods: 18,
  trends: [
    { period: '2017-01', gmv: 120350.0, orders_count: 800, delivered_count: 750, avg_order_value: 150.44, total_freight: 15800.0, late_order_rate: 0.082 },
    { period: '2017-02', gmv: 247300.0, orders_count: 1680, delivered_count: 1590, avg_order_value: 147.2, total_freight: 31200.0, late_order_rate: 0.076 },
    { period: '2017-03', gmv: 374300.0, orders_count: 2570, delivered_count: 2450, avg_order_value: 145.64, total_freight: 48900.0, late_order_rate: 0.071 },
    { period: '2017-04', gmv: 358200.0, orders_count: 2390, delivered_count: 2280, avg_order_value: 149.87, total_freight: 46200.0, late_order_rate: 0.068 },
    { period: '2017-05', gmv: 506100.0, orders_count: 3690, delivered_count: 3510, avg_order_value: 137.15, total_freight: 64100.0, late_order_rate: 0.065 },
    { period: '2017-06', gmv: 433100.0, orders_count: 3230, delivered_count: 3080, avg_order_value: 134.09, total_freight: 56900.0, late_order_rate: 0.074 },
    { period: '2017-07', gmv: 592400.0, orders_count: 4020, delivered_count: 3840, avg_order_value: 147.36, total_freight: 76200.0, late_order_rate: 0.069 },
    { period: '2017-08', gmv: 674300.0, orders_count: 4310, delivered_count: 4120, avg_order_value: 156.45, total_freight: 84300.0, late_order_rate: 0.062 },
    { period: '2017-09', gmv: 724900.0, orders_count: 4280, delivered_count: 4100, avg_order_value: 169.37, total_freight: 89400.0, late_order_rate: 0.067 },
    { period: '2017-10', gmv: 779200.0, orders_count: 4630, delivered_count: 4420, avg_order_value: 168.29, total_freight: 95800.0, late_order_rate: 0.064 },
    { period: '2017-11', gmv: 1194800.0, orders_count: 7540, delivered_count: 7150, avg_order_value: 158.46, total_freight: 154200.0, late_order_rate: 0.114 },
    { period: '2017-12', gmv: 878400.0, orders_count: 5670, delivered_count: 5390, avg_order_value: 154.92, total_freight: 112400.0, late_order_rate: 0.098 },
    { period: '2018-01', gmv: 1115000.0, orders_count: 7260, delivered_count: 6910, avg_order_value: 153.58, total_freight: 142100.0, late_order_rate: 0.075 },
    { period: '2018-02', gmv: 992400.0, orders_count: 6720, delivered_count: 6390, avg_order_value: 147.68, total_freight: 128900.0, late_order_rate: 0.088 },
    { period: '2018-03', gmv: 1159600.0, orders_count: 7210, delivered_count: 6860, avg_order_value: 160.83, total_freight: 149800.0, late_order_rate: 0.124 },
    { period: '2018-04', gmv: 1160700.0, orders_count: 6930, delivered_count: 6610, avg_order_value: 167.49, total_freight: 152100.0, late_order_rate: 0.079 },
    { period: '2018-05', gmv: 1153900.0, orders_count: 6870, delivered_count: 6580, avg_order_value: 167.96, total_freight: 151400.0, late_order_rate: 0.072 },
    { period: '2018-06', gmv: 1023800.0, orders_count: 6160, delivered_count: 5920, avg_order_value: 166.2, total_freight: 134500.0, late_order_rate: 0.068 },
  ],
};

export const mockCohortRetention: RetentionAnalyticsResponse = {
  total_cohorts: 12,
  cohorts: [
    { cohort_month: '2017-01', cohort_size: 764, retention_rates: { m0: 100, m1: 3.9, m2: 2.9, m3: 1.0, m4: 3.9, m5: 1.0, m6: 3.9, m7: 1.0, m8: 1.0, m9: 0.0, m10: 3.9, m11: 2.6, m12: 1.3 } },
    { cohort_month: '2017-02', cohort_size: 1752, retention_rates: { m0: 100, m1: 2.3, m2: 2.9, m3: 1.7, m4: 4.0, m5: 1.1, m6: 2.3, m7: 1.7, m8: 1.7, m9: 2.3, m10: 1.1, m11: 0.6 } },
    { cohort_month: '2017-03', cohort_size: 2636, retention_rates: { m0: 100, m1: 5.0, m2: 3.4, m3: 3.8, m4: 3.4, m5: 1.5, m6: 1.5, m7: 3.0, m8: 3.4, m9: 0.8, m10: 3.8 } },
    { cohort_month: '2017-04', cohort_size: 2352, retention_rates: { m0: 100, m1: 6.0, m2: 2.1, m3: 1.7, m4: 2.6, m5: 2.6, m6: 2.6, m7: 3.4, m8: 3.0, m9: 1.7 } },
    { cohort_month: '2017-05', cohort_size: 3596, retention_rates: { m0: 100, m1: 4.7, m2: 4.7, m3: 3.9, m4: 3.1, m5: 3.3, m6: 4.2, m7: 1.7, m8: 2.5 } },
    { cohort_month: '2017-06', cohort_size: 3139, retention_rates: { m0: 100, m1: 4.8, m2: 3.5, m3: 4.1, m4: 4.1, m5: 3.8, m6: 3.8, m7: 2.2 } },
    { cohort_month: '2017-07', cohort_size: 3894, retention_rates: { m0: 100, m1: 5.1, m2: 3.3, m3: 2.6, m4: 2.8, m5: 3.3, m6: 1.3 } },
    { cohort_month: '2017-08', cohort_size: 4184, retention_rates: { m0: 100, m1: 6.7, m2: 3.3, m3: 2.6, m4: 3.6, m5: 5.3 } },
    { cohort_month: '2017-09', cohort_size: 4130, retention_rates: { m0: 100, m1: 6.8, m2: 5.3, m3: 2.9, m4: 4.6 } },
    { cohort_month: '2017-10', cohort_size: 4470, retention_rates: { m0: 100, m1: 6.9, m2: 2.5, m3: 2.2 } },
    { cohort_month: '2017-11', cohort_size: 7305, retention_rates: { m0: 100, m1: 5.5, m2: 3.8 } },
    { cohort_month: '2017-12', cohort_size: 5487, retention_rates: { m0: 100, m1: 2.6 } },
  ],
};

// -------------------------------------------------------------------------
// 4. Customers Directory & 360 Detail
// -------------------------------------------------------------------------

export const mockCustomersList: CustomerSummary[] = [
  {
    customer_unique_id: '8d50f5eadf502056fa2f144b30424d35',
    city: 'sao paulo',
    state: 'SP',
    lifetime_orders: 16,
    lifetime_spend: 2845.6,
    avg_order_value: 177.85,
    churn_probability: 0.124,
    risk_tier: 'Low',
    segment: 'Champions',
    retention_priority: 'Priority 1 (VIP Retention)',
    revenue_at_risk: 352.85,
    first_purchased_at: '2017-05-15T10:24:00Z',
    latest_purchased_at: '2018-08-18T14:32:00Z',
    is_repeat_buyer: 1,
    recency_days: 11,
    customer_lifespan_days: 460,
  },
  {
    customer_unique_id: '0a0a9211241f324ab049630b956872d8',
    city: 'rio de janeiro',
    state: 'RJ',
    lifetime_orders: 3,
    lifetime_spend: 1980.4,
    avg_order_value: 660.13,
    churn_probability: 0.785,
    risk_tier: 'High',
    segment: "Can't Lose Them",
    retention_priority: 'Priority 1 (VIP Retention)',
    revenue_at_risk: 1554.61,
    first_purchased_at: '2017-02-10T12:00:00Z',
    latest_purchased_at: '2017-11-20T09:15:00Z',
    is_repeat_buyer: 1,
    recency_days: 282,
    customer_lifespan_days: 283,
  },
  {
    customer_unique_id: '3977529608a9133437c6671319932829',
    city: 'belo horizonte',
    state: 'MG',
    lifetime_orders: 2,
    lifetime_spend: 1420.0,
    avg_order_value: 710.0,
    churn_probability: 0.842,
    risk_tier: 'High',
    segment: 'At Risk',
    retention_priority: 'Priority 2 (Logistics Recovery)',
    revenue_at_risk: 1195.64,
    first_purchased_at: '2017-06-01T15:30:00Z',
    latest_purchased_at: '2017-12-14T18:45:00Z',
    is_repeat_buyer: 1,
    recency_days: 258,
    customer_lifespan_days: 196,
  },
  {
    customer_unique_id: 'c8460e4251689ba205045f3ea17884a1',
    city: 'curitiba',
    state: 'PR',
    lifetime_orders: 4,
    lifetime_spend: 1240.5,
    avg_order_value: 310.12,
    churn_probability: 0.468,
    risk_tier: 'Medium',
    segment: 'Loyal Customers',
    retention_priority: 'Priority 1 (VIP Retention)',
    revenue_at_risk: 580.55,
    first_purchased_at: '2017-08-20T11:10:00Z',
    latest_purchased_at: '2018-06-12T16:20:00Z',
    is_repeat_buyer: 1,
    recency_days: 78,
    customer_lifespan_days: 296,
  },
  {
    customer_unique_id: '47c1a3033b8b7b2b8e94850e51ff0eb5',
    city: 'porto alegre',
    state: 'RS',
    lifetime_orders: 2,
    lifetime_spend: 980.2,
    avg_order_value: 490.1,
    churn_probability: 0.724,
    risk_tier: 'High',
    segment: 'At Risk',
    retention_priority: 'Priority 2 (Logistics Recovery)',
    revenue_at_risk: 709.66,
    first_purchased_at: '2017-04-18T14:15:00Z',
    latest_purchased_at: '2017-10-25T11:40:00Z',
    is_repeat_buyer: 1,
    recency_days: 308,
    customer_lifespan_days: 190,
  },
  {
    customer_unique_id: 'b6c0834e7368a97737e50f45773ff97d',
    city: 'campinas',
    state: 'SP',
    lifetime_orders: 1,
    lifetime_spend: 520.0,
    avg_order_value: 520.0,
    churn_probability: 0.382,
    risk_tier: 'Medium',
    segment: 'Promising',
    retention_priority: 'Priority 3 (Win-Back)',
    revenue_at_risk: 198.64,
    first_purchased_at: '2018-06-25T09:00:00Z',
    latest_purchased_at: '2018-06-25T09:00:00Z',
    is_repeat_buyer: 0,
    recency_days: 65,
    customer_lifespan_days: 0,
  },
  {
    customer_unique_id: '7c67e1448b00f6e969d365cea6b010ab',
    city: 'salvador',
    state: 'BA',
    lifetime_orders: 1,
    lifetime_spend: 340.0,
    avg_order_value: 340.0,
    churn_probability: 0.895,
    risk_tier: 'High',
    segment: 'Lost',
    retention_priority: 'Priority 3 (Win-Back)',
    revenue_at_risk: 304.3,
    first_purchased_at: '2017-03-12T16:00:00Z',
    latest_purchased_at: '2017-03-12T16:00:00Z',
    is_repeat_buyer: 0,
    recency_days: 535,
    customer_lifespan_days: 0,
  },
  {
    customer_unique_id: 'a73c31ff732c51f478ec1c70e3009bc2',
    city: 'brasilia',
    state: 'DF',
    lifetime_orders: 3,
    lifetime_spend: 890.4,
    avg_order_value: 296.8,
    churn_probability: 0.225,
    risk_tier: 'Low',
    segment: 'Potential Loyalists',
    retention_priority: 'Priority 4 (Baseline Operational)',
    revenue_at_risk: 200.34,
    first_purchased_at: '2018-01-14T10:00:00Z',
    latest_purchased_at: '2018-07-20T14:10:00Z',
    is_repeat_buyer: 1,
    recency_days: 40,
    customer_lifespan_days: 187,
  },
  {
    customer_unique_id: 'f4907109f2919f7e8b7be45eb393699b',
    city: 'florianopolis',
    state: 'SC',
    lifetime_orders: 5,
    lifetime_spend: 1650.8,
    avg_order_value: 330.16,
    churn_probability: 0.182,
    risk_tier: 'Low',
    segment: 'Champions',
    retention_priority: 'Priority 1 (VIP Retention)',
    revenue_at_risk: 300.45,
    first_purchased_at: '2017-09-05T14:20:00Z',
    latest_purchased_at: '2018-08-10T11:15:00Z',
    is_repeat_buyer: 1,
    recency_days: 19,
    customer_lifespan_days: 339,
  },
  {
    customer_unique_id: '1b6c7548a2a1f793737a528a366474bb',
    city: 'recife',
    state: 'PE',
    lifetime_orders: 1,
    lifetime_spend: 420.0,
    avg_order_value: 420.0,
    churn_probability: 0.824,
    risk_tier: 'High',
    segment: 'At Risk',
    retention_priority: 'Priority 2 (Logistics Recovery)',
    revenue_at_risk: 346.08,
    first_purchased_at: '2017-05-18T08:30:00Z',
    latest_purchased_at: '2017-05-18T08:30:00Z',
    is_repeat_buyer: 0,
    recency_days: 468,
    customer_lifespan_days: 0,
  },
  {
    customer_unique_id: '9f8e7d6c5b4a39281726354410293847',
    city: 'fortaleza',
    state: 'CE',
    lifetime_orders: 2,
    lifetime_spend: 780.5,
    avg_order_value: 390.25,
    churn_probability: 0.648,
    risk_tier: 'Medium',
    segment: 'Customers Needing Attention',
    retention_priority: 'Priority 3 (Win-Back)',
    revenue_at_risk: 505.76,
    first_purchased_at: '2017-10-12T17:40:00Z',
    latest_purchased_at: '2018-04-05T13:20:00Z',
    is_repeat_buyer: 1,
    recency_days: 146,
    customer_lifespan_days: 175,
  },
  {
    customer_unique_id: '5e4d3c2b1a0987654321fedcba098765',
    city: 'goiania',
    state: 'GO',
    lifetime_orders: 1,
    lifetime_spend: 290.0,
    avg_order_value: 290.0,
    churn_probability: 0.421,
    risk_tier: 'Medium',
    segment: 'About to Sleep',
    retention_priority: 'Priority 3 (Win-Back)',
    revenue_at_risk: 122.09,
    first_purchased_at: '2018-02-14T19:00:00Z',
    latest_purchased_at: '2018-02-14T19:00:00Z',
    is_repeat_buyer: 0,
    recency_days: 196,
    customer_lifespan_days: 0,
  },
  {
    customer_unique_id: '3b2a1c0d9e8f7a6b5c4d3e2f1a0b9c8d',
    city: 'ribeirao preto',
    state: 'SP',
    lifetime_orders: 6,
    lifetime_spend: 2120.0,
    avg_order_value: 353.33,
    churn_probability: 0.152,
    risk_tier: 'Low',
    segment: 'Loyal Customers',
    retention_priority: 'Priority 1 (VIP Retention)',
    revenue_at_risk: 322.24,
    first_purchased_at: '2017-03-20T09:40:00Z',
    latest_purchased_at: '2018-07-28T16:50:00Z',
    is_repeat_buyer: 1,
    recency_days: 32,
    customer_lifespan_days: 495,
  },
  {
    customer_unique_id: '8c7b6a5d4e3f2a1b0c9d8e7f6a5b4c3d',
    city: 'niteroi',
    state: 'RJ',
    lifetime_orders: 2,
    lifetime_spend: 1180.2,
    avg_order_value: 590.1,
    churn_probability: 0.764,
    risk_tier: 'High',
    segment: "Can't Lose Them",
    retention_priority: 'Priority 1 (VIP Retention)',
    revenue_at_risk: 901.67,
    first_purchased_at: '2017-01-22T14:10:00Z',
    latest_purchased_at: '2017-10-30T10:00:00Z',
    is_repeat_buyer: 1,
    recency_days: 303,
    customer_lifespan_days: 281,
  },
  {
    customer_unique_id: '4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d',
    city: 'joinville',
    state: 'SC',
    lifetime_orders: 1,
    lifetime_spend: 180.5,
    avg_order_value: 180.5,
    churn_probability: 0.284,
    risk_tier: 'Low',
    segment: 'Recent Customers',
    retention_priority: 'Priority 4 (Baseline Operational)',
    revenue_at_risk: 51.26,
    first_purchased_at: '2018-08-01T15:00:00Z',
    latest_purchased_at: '2018-08-01T15:00:00Z',
    is_repeat_buyer: 0,
    recency_days: 28,
    customer_lifespan_days: 0,
  },
  {
    customer_unique_id: '6f5e4d3c2b1a0987654321fedcba1234',
    city: 'santos',
    state: 'SP',
    lifetime_orders: 3,
    lifetime_spend: 940.0,
    avg_order_value: 313.33,
    churn_probability: 0.542,
    risk_tier: 'Medium',
    segment: 'Customers Needing Attention',
    retention_priority: 'Priority 3 (Win-Back)',
    revenue_at_risk: 509.48,
    first_purchased_at: '2017-11-15T12:00:00Z',
    latest_purchased_at: '2018-04-12T18:20:00Z',
    is_repeat_buyer: 1,
    recency_days: 139,
    customer_lifespan_days: 148,
  },
  {
    customer_unique_id: '2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d',
    city: 'uberlandia',
    state: 'MG',
    lifetime_orders: 1,
    lifetime_spend: 310.0,
    avg_order_value: 310.0,
    churn_probability: 0.912,
    risk_tier: 'High',
    segment: 'Lost',
    retention_priority: 'Priority 3 (Win-Back)',
    revenue_at_risk: 282.72,
    first_purchased_at: '2017-02-14T09:10:00Z',
    latest_purchased_at: '2017-02-14T09:10:00Z',
    is_repeat_buyer: 0,
    recency_days: 561,
    customer_lifespan_days: 0,
  },
  {
    customer_unique_id: '7e6d5c4b3a2f10987654321fedcba567',
    city: 'caxias do sul',
    state: 'RS',
    lifetime_orders: 4,
    lifetime_spend: 1480.0,
    avg_order_value: 370.0,
    churn_probability: 0.354,
    risk_tier: 'Medium',
    segment: 'Potential Loyalists',
    retention_priority: 'Priority 4 (Baseline Operational)',
    revenue_at_risk: 523.92,
    first_purchased_at: '2017-07-10T11:30:00Z',
    latest_purchased_at: '2018-06-22T14:40:00Z',
    is_repeat_buyer: 1,
    recency_days: 68,
    customer_lifespan_days: 347,
  },
];

export const mockCustomerDetail: CustomerDetail = {
  customer_unique_id: '8d50f5eadf502056fa2f144b30424d35',
  city: 'sao paulo',
  state: 'SP',
  zip_prefix: '01419',
  lifetime_orders: 16,
  lifetime_spend: 2845.6,
  avg_order_value: 177.85,
  lifetime_product_spend: 2480.0,
  lifetime_freight_spend: 365.6,
  is_repeat_buyer: 1,
  first_purchased_at: '2017-05-15T10:24:00Z',
  latest_purchased_at: '2018-08-18T14:32:00Z',
  recency_days: 11,
  customer_lifespan_days: 460,
  basket: {
    lifetime_items: 22,
    avg_items_per_order: 1.38,
    total_unique_products_purchased: 18,
    total_unique_sellers_contacted: 12,
  },
  fulfillment: {
    avg_delivery_delay_days: -3.4,
    has_late_delivery: 0,
    late_order_ratio: 0.0,
    late_orders_count: 0,
    max_delivery_delay_days: 0.0,
  },
  reviews: {
    avg_review_score: 4.85,
    has_negative_review: 0,
    negative_reviews_count: 0,
    positive_reviews_count: 15,
    total_reviews_submitted: 16,
    negative_review_ratio: 0.0,
  },
  rfm: {
    customer_unique_id: '8d50f5eadf502056fa2f144b30424d35',
    r_score: 5,
    f_score: 5,
    m_score: 5,
    rfm_score: 5.0,
    rfm_label: '555',
    segment: 'Champions',
    recency_days: 11,
    frequency: 16,
    monetary: 2845.6,
    computed_at: '2024-09-12T08:02:14Z',
  },
  churn: {
    customer_unique_id: '8d50f5eadf502056fa2f144b30424d35',
    churn_probability: 0.124,
    is_churned: 0,
    monetary_value: 2845.6,
    risk_tier: 'Low',
    retention_priority: 'Priority 1 (VIP Retention)',
    revenue_at_risk: 352.85,
    predicted_at: '2024-09-12T08:03:52Z',
  },
};

export const mockCustomerRecommendation: CustomerPlaybookRecommendation = {
  customer_unique_id: '0a0a9211241f324ab049630b956872d8',
  risk_tier: 'High',
  churn_probability: 0.785,
  revenue_at_risk: 1554.61,
  primary_friction: 'Prolonged Recency Inactivity & Carrier Delivery Delay',
  recommended_playbook: {
    playbook_id: 'vip_concierge',
    name: 'VIP Concierge & Dedicated Account Outreach',
    description: 'Personal phone outreach from growth team with custom replacement vouchers and exclusive product reserves.',
    intervention_channel: 'Phone & Concierge',
    default_cost_per_customer: 45.0,
    estimated_save_rate_min: 0.28,
    estimated_save_rate_max: 0.45,
    target_criteria: 'Monetary spend >= R$ 1,000, Champions & Can\'t Lose Them segments',
    recommended_action: 'Deploy high-touch customer success specialist within 24 hours with dedicated R$ 120 voucher.',
    action_template: 'Olá {first_name}, notei que sua última entrega sofreu atraso. Como nosso cliente VIP, providenciei R$ 120 em crédito e atendimento dedicado.',
  },
  projected_net_gain: 522.65,
  expected_gross_recovery: 567.65,
  suggested_message: 'Prezado cliente, identificamos o atrito no seu pedido recente. Preparamos uma compensação de frete e consultoria exclusiva para sua próxima aquisição.',
};

// -------------------------------------------------------------------------
// 5. Prescriptive Retention Playbooks & Campaign ROI
// -------------------------------------------------------------------------

export const mockRetentionPlaybooks: RetentionPlaybook[] = [
  {
    playbook_id: 'vip_concierge',
    name: 'VIP Concierge & Dedicated Account Outreach',
    description: 'High-touch 1-on-1 personalized outreach by Senior Customer Success managers for high-value Champions and VIP accounts.',
    intervention_channel: 'Phone & WhatsApp VIP',
    default_cost_per_customer: 45.0,
    estimated_save_rate_min: 0.28,
    estimated_save_rate_max: 0.45,
    target_criteria: 'Monetary spend >= R$ 1,000, Champions & Can\'t Lose Them segments',
    recommended_action: 'Direct concierge call offering custom product sourcing and VIP creditline.',
    action_template: 'Olá {name}, identificamos sua importância para o nosso ecossistema. Preparamos um canal exclusivo para seus próximos pedidos.',
  },
  {
    playbook_id: 'logistics_friction_recovery',
    name: 'Logistics Friction Recovery & Shipping Waiver',
    description: 'Automatic freight refund and priority carrier routing for customers who experienced late delivery or carrier delays.',
    intervention_channel: 'Automated SMS & Email',
    default_cost_per_customer: 22.5,
    estimated_save_rate_min: 0.2,
    estimated_save_rate_max: 0.35,
    target_criteria: 'Late delivery flag = 1 or carrier delivery delay >= 3 days',
    recommended_action: 'Automated freight voucher with express shipping upgrade on next 3 orders.',
    action_template: 'Sentimos muito pela demora no seu último pedido. Seu próximo frete é 100% por nossa conta com entrega prioritária expressa.',
  },
  {
    playbook_id: 'sentiment_repair_service',
    name: 'Customer Sentiment Repair & Quality Resolution',
    description: 'Priority ticket escalation and product replacement voucher for buyers who submitted negative 1-2 star reviews.',
    intervention_channel: 'Direct Email Escalation',
    default_cost_per_customer: 28.0,
    estimated_save_rate_min: 0.22,
    estimated_save_rate_max: 0.38,
    target_criteria: 'Negative review submitted (1-2 stars), recent purchase',
    recommended_action: 'Immediate senior CS outreach with 20% apology discount and product guarantee.',
    action_template: 'Lemos atentamente sua avaliação sobre o item recebido. Gostaríamos de reparar essa experiência com reposição imediata.',
  },
  {
    playbook_id: 'automated_reengagement',
    name: 'Automated Win-Back & Promotional Re-engagement',
    description: 'Algorithmic dynamic discount coupons triggered when customer recency passes 180 days with no purchase.',
    intervention_channel: 'Email & Push Notification',
    default_cost_per_customer: 8.5,
    estimated_save_rate_min: 0.09,
    estimated_save_rate_max: 0.18,
    target_criteria: 'At Risk or About to Sleep segments, recency >= 180 days',
    recommended_action: '15% limited-time discount voucher tailored to customer favorite categories.',
    action_template: 'Faz tempo que não nos vemos! Separamos 15% OFF nas categorias que você mais gosta, válido até domingo.',
  },
  {
    playbook_id: 'loyalty_nurture',
    name: 'VIP Loyalty Nurture & Tier Recognition',
    description: 'Gamified status tier progression and milestone perks for rising Potential Loyalists and Recent buyers.',
    intervention_channel: 'In-App & Email',
    default_cost_per_customer: 5.0,
    estimated_save_rate_min: 0.06,
    estimated_save_rate_max: 0.12,
    target_criteria: 'Potential Loyalists or Promising segments, 1-2 lifetime orders',
    recommended_action: 'Unlock Bronze/Silver member perks, early access to marketplace flash deals.',
    action_template: 'Parabéns! Você alcançou o nível Ouro em compras. Aproveite frete reduzido e ofertas antecipadas.',
  },
  {
    playbook_id: 'organic_nurture',
    name: 'Baseline Operational Communication',
    description: 'Zero-cost informational newsletters, catalog curation, and seasonal recommendation digests.',
    intervention_channel: 'Email Newsletter',
    default_cost_per_customer: 0.5,
    estimated_save_rate_min: 0.02,
    estimated_save_rate_max: 0.05,
    target_criteria: 'Active buyers, low churn risk, baseline maintenance',
    recommended_action: 'Bi-weekly catalog updates based on past category purchases.',
    action_template: 'Confira as novidades selecionadas para sua casa nesta semana no marketplace.',
  },
];

// -------------------------------------------------------------------------
// 6. ML Model Info & Churn Scoring
// -------------------------------------------------------------------------

export const mockModelMetadata: ModelMetadataResponse = {
  model_name: 'HistGradientBoostingClassifier',
  window_days: 90,
  trained_at: '2024-09-12T08:03:52Z',
  eval_metrics: {
    roc_auc: 0.874,
    pr_auc: 0.628,
    f1_score: 0.584,
    precision: 0.612,
    recall: 0.558,
    precision_at_top_10: 0.742,
  },
  numeric_features: [
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
  ],
  categorical_features: ['customer_state', 'rfm_segment', 'preferred_payment_type'],
};

// -------------------------------------------------------------------------
// 7. Marketing Funnel, Attribution & Sales Velocity
// -------------------------------------------------------------------------

export const mockMarketingFunnel: MarketingFunnelOverview = {
  total_leads: 8000,
  total_closed_deals: 842,
  overall_conversion_rate: 10.525,
  active_marketplace_sellers_count: 420,
  seller_activation_rate: 49.88,
  avg_days_to_close: 18.4,
  total_declared_monthly_revenue: 14250000.0,
  total_actual_marketplace_revenue: 8642100.0,
};

export const mockChannelAttribution: ChannelAttributionResponse = {
  total_channels: 7,
  channels: [
    { origin: 'organic_search', leads_count: 2296, share_of_leads_percent: 28.7, closed_deals_count: 271, conversion_rate: 11.8, total_declared_monthly_revenue: 3850000.0, total_actual_marketplace_revenue: 2980400.0, avg_days_to_close: 16.2 },
    { origin: 'paid_search', leads_count: 1586, share_of_leads_percent: 19.8, closed_deals_count: 195, conversion_rate: 12.3, total_declared_monthly_revenue: 2900000.0, total_actual_marketplace_revenue: 2240100.0, avg_days_to_close: 15.4 },
    { origin: 'social_media', leads_count: 1350, share_of_leads_percent: 16.9, closed_deals_count: 112, conversion_rate: 8.3, total_declared_monthly_revenue: 1650000.0, total_actual_marketplace_revenue: 1050200.0, avg_days_to_close: 21.8 },
    { origin: 'direct_traffic', leads_count: 980, share_of_leads_percent: 12.2, closed_deals_count: 118, conversion_rate: 12.0, total_declared_monthly_revenue: 1820000.0, total_actual_marketplace_revenue: 1190400.0, avg_days_to_close: 14.8 },
    { origin: 'email_campaign', leads_count: 820, share_of_leads_percent: 10.2, closed_deals_count: 78, conversion_rate: 9.5, total_declared_monthly_revenue: 1200000.0, total_actual_marketplace_revenue: 680000.0, avg_days_to_close: 19.1 },
    { origin: 'referral', leads_count: 540, share_of_leads_percent: 6.8, closed_deals_count: 45, conversion_rate: 8.3, total_declared_monthly_revenue: 720000.0, total_actual_marketplace_revenue: 340000.0, avg_days_to_close: 22.4 },
    { origin: 'other', leads_count: 428, share_of_leads_percent: 5.4, closed_deals_count: 23, conversion_rate: 5.4, total_declared_monthly_revenue: 410000.0, total_actual_marketplace_revenue: 161000.0, avg_days_to_close: 26.5 },
  ],
};

export const mockSalesVelocity: SalesVelocityMetrics = {
  overall_avg_days_to_close: 18.4,
  fastest_segment: 'direct_traffic',
  slowest_segment: 'other',
  velocity_by_segment: [
    { business_segment: 'home_appliances', avg_days_to_close: 14.2, min_days_to_close: 3, max_days_to_close: 32, closed_deals_count: 142 },
    { business_segment: 'health_beauty', avg_days_to_close: 15.8, min_days_to_close: 4, max_days_to_close: 36, closed_deals_count: 184 },
    { business_segment: 'sports_leisure', avg_days_to_close: 17.5, min_days_to_close: 5, max_days_to_close: 42, closed_deals_count: 136 },
    { business_segment: 'computers_accessories', avg_days_to_close: 19.4, min_days_to_close: 6, max_days_to_close: 48, closed_deals_count: 118 },
    { business_segment: 'fashion_clothing', avg_days_to_close: 24.1, min_days_to_close: 8, max_days_to_close: 60, closed_deals_count: 92 },
  ],
  velocity_by_lead_type: [
    { lead_type: 'online_big', avg_days_to_close: 12.4, closed_deals_count: 210 },
    { lead_type: 'online_medium', avg_days_to_close: 17.8, closed_deals_count: 380 },
    { lead_type: 'offline_small', avg_days_to_close: 25.6, closed_deals_count: 252 },
  ],
};

export const mockSegmentPerformance: SegmentPerformanceResponse = {
  total_segments: 5,
  segments: [
    { business_segment: 'home_appliances', closed_deals_count: 142, active_sellers_count: 86, avg_declared_monthly_revenue: 28500.0, total_declared_monthly_revenue: 4047000.0, total_actual_marketplace_revenue: 2450000.0 },
    { business_segment: 'health_beauty', closed_deals_count: 184, active_sellers_count: 98, avg_declared_monthly_revenue: 22400.0, total_declared_monthly_revenue: 4121600.0, total_actual_marketplace_revenue: 2180000.0 },
    { business_segment: 'sports_leisure', closed_deals_count: 136, active_sellers_count: 72, avg_declared_monthly_revenue: 18200.0, total_declared_monthly_revenue: 2475200.0, total_actual_marketplace_revenue: 1540000.0 },
    { business_segment: 'computers_accessories', closed_deals_count: 118, active_sellers_count: 64, avg_declared_monthly_revenue: 31000.0, total_declared_monthly_revenue: 3658000.0, total_actual_marketplace_revenue: 1420000.0 },
    { business_segment: 'fashion_clothing', closed_deals_count: 92, active_sellers_count: 48, avg_declared_monthly_revenue: 14500.0, total_declared_monthly_revenue: 1334000.0, total_actual_marketplace_revenue: 820000.0 },
  ],
};

export const mockMarketingLeads: MarketingLeadsListResponse = {
  items: [
    { mql_id: 'mql-001', origin: 'organic_search', business_segment: 'health_beauty', lead_type: 'online_medium', won_date: '2018-04-12T14:20:00Z', declared_monthly_revenue: 25000.0, actual_marketplace_revenue: 34200.0, days_to_close: 14, is_won: true, is_active_marketplace_seller: true },
    { mql_id: 'mql-002', origin: 'paid_search', business_segment: 'home_appliances', lead_type: 'online_big', won_date: '2018-05-02T10:15:00Z', declared_monthly_revenue: 60000.0, actual_marketplace_revenue: 82400.0, days_to_close: 9, is_won: true, is_active_marketplace_seller: true },
    { mql_id: 'mql-003', origin: 'social_media', business_segment: 'fashion_clothing', lead_type: 'offline_small', won_date: '2018-06-18T16:45:00Z', declared_monthly_revenue: 12000.0, actual_marketplace_revenue: 9500.0, days_to_close: 26, is_won: true, is_active_marketplace_seller: false },
    { mql_id: 'mql-004', origin: 'direct_traffic', business_segment: 'computers_accessories', lead_type: 'online_medium', won_date: '2018-03-24T11:30:00Z', declared_monthly_revenue: 35000.0, actual_marketplace_revenue: 41200.0, days_to_close: 15, is_won: true, is_active_marketplace_seller: true },
    { mql_id: 'mql-005', origin: 'email_campaign', business_segment: 'sports_leisure', lead_type: 'online_medium', won_date: '2018-04-29T15:00:00Z', declared_monthly_revenue: 20000.0, actual_marketplace_revenue: 18900.0, days_to_close: 18, is_won: true, is_active_marketplace_seller: true },
  ],
  pagination: {
    page: 1,
    page_size: 20,
    total_items: 842,
    total_pages: 43,
    has_next: true,
    has_prev: false,
  },
};

// -------------------------------------------------------------------------
// 8. Catalog Intelligence: Products & Sellers
// -------------------------------------------------------------------------

export const mockCategories: CategoryListResponse = {
  total_categories: 10,
  categories: [
    { category: 'bed_bath_table', category_pt: 'cama_mesa_banho', total_products: 3029, total_units_sold: 11115, total_revenue: 1036800.0, avg_price: 93.28, avg_review_score: 3.92 },
    { category: 'health_beauty', category_pt: 'beleza_saude', total_products: 2444, total_units_sold: 9670, total_revenue: 1258600.0, avg_price: 130.15, avg_review_score: 4.18 },
    { category: 'sports_leisure', category_pt: 'esporte_lazer', total_products: 2867, total_units_sold: 8641, total_revenue: 988000.0, avg_price: 114.34, avg_review_score: 4.12 },
    { category: 'furniture_decor', category_pt: 'moveis_decoracao', total_products: 2657, total_units_sold: 8334, total_revenue: 729700.0, avg_price: 87.56, avg_review_score: 3.95 },
    { category: 'computers_accessories', category_pt: 'informatica_acessorios', total_products: 1639, total_units_sold: 7827, total_revenue: 911900.0, avg_price: 116.51, avg_review_score: 3.98 },
    { category: 'housewares', category_pt: 'utilidades_domesticas', total_products: 2335, total_units_sold: 6964, total_revenue: 632200.0, avg_price: 90.78, avg_review_score: 4.08 },
    { category: 'watches_gifts', category_pt: 'relogios_presentes', total_products: 1329, total_units_sold: 5991, total_revenue: 1205000.0, avg_price: 201.14, avg_review_score: 4.02 },
    { category: 'telephony', category_pt: 'telefonia', total_products: 1134, total_units_sold: 4545, total_revenue: 323600.0, avg_price: 71.2, avg_review_score: 3.94 },
    { category: 'kitchen_dining_laundry_garden_furniture', category_pt: 'moveis_cozinha_area_de_servico_jantar_e_jardim', total_products: 94, total_units_sold: 274, total_revenue: 57100.0, avg_price: 206.50, avg_review_score: 3.88 },
    { category: 'portateis_cozinha_e_preparadores_de_alimentos', category_pt: 'portateis_cozinha_e_preparadores_de_alimentos', total_products: 10, total_units_sold: 14, total_revenue: 4200.0, avg_price: 183.51, avg_review_score: 3.52 },
  ],
};

export const mockProducts: ProductListResponse = {
  items: [
    { product_id: 'prod-001-bed-bath', category_name_en: 'bed_bath_table', avg_unit_price: 119.9, total_units_sold: 527, total_orders_count: 492, total_revenue: 63187.3, avg_review_score: 4.3 },
    { product_id: 'prod-002-health-lux', category_name_en: 'health_beauty', avg_unit_price: 189.5, total_units_sold: 412, total_orders_count: 385, total_revenue: 78074.0, avg_review_score: 4.6 },
    { product_id: 'prod-003-sports-pro', category_name_en: 'sports_leisure', avg_unit_price: 249.0, total_units_sold: 384, total_orders_count: 350, total_revenue: 95616.0, avg_review_score: 4.4 },
    { product_id: 'prod-004-tech-dock', category_name_en: 'computers_accessories', avg_unit_price: 345.0, total_units_sold: 295, total_orders_count: 275, total_revenue: 101775.0, avg_review_score: 4.1 },
    { product_id: 'prod-005-decor-lamp', category_name_en: 'furniture_decor', avg_unit_price: 89.9, total_units_sold: 450, total_orders_count: 410, total_revenue: 40455.0, avg_review_score: 3.8 },
  ],
  pagination: {
    page: 1,
    page_size: 20,
    total_items: 32951,
    total_pages: 1648,
    has_next: true,
    has_prev: false,
  },
};

export const mockSellers: SellerListResponse = {
  items: [
    { seller_id: 'seller-sp-001', city: 'sao paulo', state: 'SP', total_orders_fulfilled: 1840, total_items_sold: 2150, total_revenue: 298400.0, avg_item_value: 138.79, avg_review_score: 4.42, late_delivery_rate: 0.048, avg_delivery_delay_days: -3.8, total_unique_products: 45 },
    { seller_id: 'seller-rj-002', city: 'rio de janeiro', state: 'RJ', total_orders_fulfilled: 1420, total_items_sold: 1680, total_revenue: 245100.0, avg_item_value: 145.89, avg_review_score: 4.18, late_delivery_rate: 0.076, avg_delivery_delay_days: -1.2, total_unique_products: 38 },
    { seller_id: 'seller-mg-003', city: 'belo horizonte', state: 'MG', total_orders_fulfilled: 980, total_items_sold: 1120, total_revenue: 168900.0, avg_item_value: 150.8, avg_review_score: 4.31, late_delivery_rate: 0.052, avg_delivery_delay_days: -2.4, total_unique_products: 29 },
    { seller_id: 'seller-pr-004', city: 'curitiba', state: 'PR', total_orders_fulfilled: 870, total_items_sold: 990, total_revenue: 142500.0, avg_item_value: 143.94, avg_review_score: 4.25, late_delivery_rate: 0.064, avg_delivery_delay_days: -2.1, total_unique_products: 24 },
    { seller_id: 'seller-rs-005', city: 'porto alegre', state: 'RS', total_orders_fulfilled: 760, total_items_sold: 840, total_revenue: 119800.0, avg_item_value: 142.62, avg_review_score: 3.92, late_delivery_rate: 0.114, avg_delivery_delay_days: 1.4, total_unique_products: 21 },
  ],
  pagination: {
    page: 1,
    page_size: 20,
    total_items: 3095,
    total_pages: 155,
    has_next: true,
    has_prev: false,
  },
};

// -------------------------------------------------------------------------
// 9. Interactive Simulation Engines (Offline Handlers)
// -------------------------------------------------------------------------

/**
 * Calculates simulated churn probability from input operational features.
 */
export function simulateChurn(input: Partial<ChurnPredictionInput>): ChurnPredictionResult {
  const lifespan = input.customer_lifespan_days ?? 120;
  const orders = input.lifetime_orders ?? 1;
  const spend = input.lifetime_spend ?? 150;
  const delay = input.avg_delivery_delay_days ?? 0;
  const review = input.avg_review_score ?? 4.0;
  const isRepeat = (input.is_repeat_buyer ?? (orders >= 2 ? 1 : 0)) === 1;

  // Logistic score computation
  let z = -1.2;
  z += (lifespan < 90 ? 0.35 : -0.2);
  z += delay * 0.18;
  z -= (review - 3.0) * 0.65;
  if (isRepeat) z -= 0.85;
  if (spend > 500) z -= 0.35;

  const prob = Math.max(0.02, Math.min(0.98, 1 / (1 + Math.exp(-z))));
  const roundedProb = Number(prob.toFixed(4));
  const revenueAtRisk = Number((roundedProb * spend).toFixed(2));

  let riskTier = 'Low';
  let retentionPriority = 'Priority 4 (Baseline Operational)';
  if (roundedProb >= 0.7) {
    riskTier = 'High';
    retentionPriority = spend >= 400 ? 'Priority 1 (VIP Retention)' : 'Priority 2 (Logistics Recovery)';
  } else if (roundedProb >= 0.3) {
    riskTier = 'Medium';
    retentionPriority = 'Priority 3 (Win-Back)';
  }

  return {
    churn_probability: roundedProb,
    monetary_value: spend,
    risk_tier: riskTier,
    retention_priority: retentionPriority,
    revenue_at_risk: revenueAtRisk,
    top_feature_contributions: [
      {
        feature: 'customer_lifespan_days',
        value: lifespan,
        direction: lifespan < 90 ? 'increases_risk' : 'decreases_risk',
        description: `${lifespan} days customer tenure`,
      },
      {
        feature: 'avg_delivery_delay_days',
        value: delay,
        direction: delay > 0 ? 'increases_risk' : 'decreases_risk',
        description: delay > 0 ? `${delay.toFixed(1)} days carrier delay` : 'On-time fulfillment',
      },
      {
        feature: 'avg_review_score',
        value: review,
        direction: review < 3.5 ? 'increases_risk' : 'decreases_risk',
        description: `${review.toFixed(1)} star satisfaction score`,
      },
    ],
  };
}

/**
 * Handles POST /api/predictions/churn/simulate
 */
export function simulateCounterfactual(
  req: CounterfactualSimulationRequest
): CounterfactualSimulationResponse {
  const foundCust = req.customer_unique_id
    ? mockCustomersList.find((c) => c.customer_unique_id === req.customer_unique_id)
    : null;

  const baseInput: Partial<ChurnPredictionInput> = req.base_features || {
    customer_lifespan_days: foundCust?.customer_lifespan_days ?? 145,
    lifetime_orders: foundCust?.lifetime_orders ?? 1,
    lifetime_spend: foundCust?.lifetime_spend ?? 340.0,
    avg_delivery_delay_days: foundCust
      ? (foundCust.risk_tier === 'High' ? 4.5 : foundCust.risk_tier === 'Medium' ? 1.5 : -2.0)
      : 3.5,
    avg_review_score: foundCust
      ? (foundCust.risk_tier === 'High' ? 2.5 : foundCust.risk_tier === 'Medium' ? 3.5 : 4.8)
      : 3.0,
  };

  const baseline = simulateChurn(baseInput);

  // Apply adjustments
  const adj = (req.adjustments || {}) as Record<string, number>;
  const discountMitigation = adj.discount_rate ? (adj.discount_rate / 100) * 0.15 : 0;
  const outreachMitigation = adj.proactive_outreach ? 0.08 : 0;

  const simulatedInput: Partial<ChurnPredictionInput> = {
    ...baseInput,
    avg_delivery_delay_days:
      adj.avg_delivery_delay_days !== undefined
        ? (baseInput.avg_delivery_delay_days ?? 0) + adj.avg_delivery_delay_days
        : baseInput.avg_delivery_delay_days,
    avg_review_score:
      adj.avg_review_score !== undefined
        ? Math.max(1, Math.min(5, (baseInput.avg_review_score ?? 4) + adj.avg_review_score))
        : baseInput.avg_review_score,
    lifetime_orders:
      adj.order_frequency_delta !== undefined
        ? Math.max(1, (baseInput.lifetime_orders ?? 1) + adj.order_frequency_delta)
        : baseInput.lifetime_orders,
  };

  const rawSimulated = simulateChurn(simulatedInput);
  const mitigatedProb = Math.max(
    0.05,
    Math.min(0.95, rawSimulated.churn_probability - discountMitigation - outreachMitigation)
  );
  const roundedProb = Number(mitigatedProb.toFixed(3));
  const simulatedSpend = simulatedInput.lifetime_spend ?? baseInput.lifetime_spend ?? 340;
  const simulatedRevenueAtRisk = Number((simulatedSpend * roundedProb).toFixed(2));

  let simulatedRiskTier = 'Low';
  let simulatedRetentionPriority = 'Priority 4 (Baseline Operational)';
  if (roundedProb >= 0.7) {
    simulatedRiskTier = 'High';
    simulatedRetentionPriority =
      simulatedSpend >= 400 ? 'Priority 1 (VIP Retention)' : 'Priority 2 (Logistics Recovery)';
  } else if (roundedProb >= 0.3) {
    simulatedRiskTier = 'Medium';
    simulatedRetentionPriority = 'Priority 3 (Win-Back)';
  }

  const simulated = {
    ...rawSimulated,
    churn_probability: roundedProb,
    risk_tier: simulatedRiskTier,
    retention_priority: simulatedRetentionPriority,
    revenue_at_risk: simulatedRevenueAtRisk,
  };

  const deltaProb = Number((simulated.churn_probability - baseline.churn_probability).toFixed(4));
  const deltaRevenue = Number((simulated.revenue_at_risk - baseline.revenue_at_risk).toFixed(2));

  let summary = 'Operational adjustments maintain stable churn risk exposure.';
  if (deltaProb < 0) {
    const savings = Math.abs(deltaRevenue);
    summary = `Operational intervention reduces churn probability by ${Math.abs(deltaProb * 100).toFixed(1)}%, protecting R$ ${savings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} in portfolio exposure.`;
  } else if (deltaProb > 0) {
    summary = `Degraded operations increase churn risk by ${(deltaProb * 100).toFixed(1)}%, exposing R$ ${deltaRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} to churn.`;
  }

  return {
    baseline,
    simulated,
    delta_churn_probability: deltaProb,
    delta_revenue_at_risk: deltaRevenue,
    impact_summary: summary,
    risk_tier_transition: `${baseline.risk_tier} -> ${simulated.risk_tier}`,
    retention_priority_transition: `${baseline.retention_priority} -> ${simulated.retention_priority}`,
    customer_unique_id: req.customer_unique_id ?? null,
  };
}

/**
 * Handles POST /api/retention/campaigns/simulate-roi
 */
export function simulateCampaignROI(req: CampaignSimulationRequest): CampaignSimulationResult {
  const count = req.target_customer_count || 1000;
  const costPerCust = req.cost_per_customer || 25.0;
  const targetRevenueAtRisk = req.target_revenue_at_risk || 250000.0;
  const saveRate = req.expected_save_rate || 0.25;

  const totalCost = Number((count * costPerCust).toFixed(2));
  const grossSaved = Number((targetRevenueAtRisk * saveRate).toFixed(2));
  const netSaved = Number((grossSaved - totalCost).toFixed(2));
  const roi = totalCost > 0 ? Number(((netSaved / totalCost) * 100).toFixed(1)) : 0;
  const breakEvenRate = targetRevenueAtRisk > 0 ? Number((totalCost / targetRevenueAtRisk).toFixed(4)) : 0;
  const efficiency = totalCost > 0 ? Number((grossSaved / totalCost).toFixed(2)) : 0;

  return {
    playbook_id: req.playbook_id ?? null,
    target_customer_count: count,
    target_revenue_at_risk: targetRevenueAtRisk,
    total_campaign_cost: totalCost,
    gross_revenue_saved: grossSaved,
    net_saved_value: netSaved,
    roi_percentage: roi,
    break_even_save_rate: breakEvenRate,
    capital_efficiency_multiplier: efficiency,
    projected_customers_saved: Math.round(count * saveRate),
    is_profitable: netSaved > 0,
    recommendation:
      netSaved > 0
        ? `Highly recommended: Yields ${roi}% net ROI with ${efficiency}x capital multiplier.`
        : 'Cautious: Estimated campaign cost exceeds expected saved revenue.',
  };
}

/**
 * Handles POST /api/retention/campaigns/optimize-budget (Knapsack Solver)
 */
export function optimizeRetentionBudget(req: BudgetAllocationRequest): BudgetAllocationResult {
  const totalBudget = req.total_budget || 50000;
  let remaining = totalBudget;

  const defaultPools = [
    { pool_name: 'VIP Concierge (Champions & Can\'t Lose)', playbook_id: 'vip_concierge', available_customers: 1200, cost_per_customer: 45.0, expected_save_rate: 0.38, total_revenue_at_risk: 480000.0 },
    { pool_name: 'Logistics Recovery (Late Delivery Victims)', playbook_id: 'logistics_friction_recovery', available_customers: 2400, cost_per_customer: 22.5, expected_save_rate: 0.28, total_revenue_at_risk: 360000.0 },
    { pool_name: 'Sentiment Repair (Negative Reviewers)', playbook_id: 'sentiment_repair_service', available_customers: 1800, cost_per_customer: 28.0, expected_save_rate: 0.30, total_revenue_at_risk: 280000.0 },
    { pool_name: 'Automated Win-Back (At Risk Accounts)', playbook_id: 'automated_reengagement', available_customers: 5000, cost_per_customer: 8.5, expected_save_rate: 0.14, total_revenue_at_risk: 425000.0 },
    { pool_name: 'Loyalty Nurture (Recent High Value)', playbook_id: 'loyalty_nurture', available_customers: 3500, cost_per_customer: 5.0, expected_save_rate: 0.08, total_revenue_at_risk: 175000.0 },
  ];

  const candidatePools = req.candidate_pools && req.candidate_pools.length > 0 ? req.candidate_pools : defaultPools;

  // Sort candidate pools by marginal efficiency (revenue saved per dollar spent)
  const scored = candidatePools.map((p) => {
    const grossPotential = p.total_revenue_at_risk * p.expected_save_rate;
    const fullCost = p.available_customers * p.cost_per_customer;
    const efficiency = fullCost > 0 ? grossPotential / fullCost : 0;
    return { ...p, efficiency, fullCost, grossPotential };
  }).sort((a, b) => b.efficiency - a.efficiency);

  let totalDeployed = 0;
  let totalSaved = 0;
  let totalCustomersTargeted = 0;

  const allocations = scored.map((pool) => {
    const needed = pool.fullCost;
    const allocated = Math.min(remaining, needed);
    remaining -= allocated;
    totalDeployed += allocated;

    const coverage = needed > 0 ? allocated / needed : 0;
    const fundedCust = Math.floor(pool.available_customers * coverage);
    const grossSaved = pool.grossPotential * coverage;
    const netVal = grossSaved - allocated;
    const roi = allocated > 0 ? (netVal / allocated) * 100 : 0;

    totalSaved += grossSaved;
    totalCustomersTargeted += fundedCust;

    return {
      pool_name: pool.pool_name,
      playbook_id: pool.playbook_id,
      allocated_spend: Number(allocated.toFixed(2)),
      coverage_ratio: Number(coverage.toFixed(3)),
      customers_targeted: fundedCust,
      max_available_customers: pool.available_customers,
      gross_revenue_saved: Number(grossSaved.toFixed(2)),
      net_value: Number(netVal.toFixed(2)),
      pool_roi: Number(roi.toFixed(1)),
      marginal_efficiency: Number(pool.efficiency.toFixed(2)),
    };
  });

  const totalNet = totalSaved - totalDeployed;
  const portfolioRoi = totalDeployed > 0 ? (totalNet / totalDeployed) * 100 : 0;
  const portfolioEff = totalDeployed > 0 ? totalSaved / totalDeployed : 0;

  return {
    total_budget: totalBudget,
    allocated_budget: Number(totalDeployed.toFixed(2)),
    remaining_budget: Number(remaining.toFixed(2)),
    total_customers_targeted: totalCustomersTargeted,
    total_gross_recovered: Number(totalSaved.toFixed(2)),
    total_net_value: Number(totalNet.toFixed(2)),
    portfolio_roi: Number(portfolioRoi.toFixed(1)),
    portfolio_efficiency: Number(portfolioEff.toFixed(2)),
    allocations,
  };
}
