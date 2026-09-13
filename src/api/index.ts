import { apiFetch } from './client';
import type { components } from '../types/api';

export * from './client';
export * from './mocks/data';

// -------------------------------------------------------------------------
// 1. Analytics Domain API
// -------------------------------------------------------------------------

export const analyticsApi = {
  getOverview: (params?: { bypass_cache?: boolean }) =>
    apiFetch('/api/analytics/overview', 'get', { params }),

  getSegments: (params?: { bypass_cache?: boolean }) =>
    apiFetch('/api/analytics/segments', 'get', { params }),

  getRFM: (params?: { bypass_cache?: boolean }) =>
    apiFetch('/api/analytics/rfm', 'get', { params }),

  getRevenueAtRisk: (params?: { bypass_cache?: boolean }) =>
    apiFetch('/api/analytics/revenue-at-risk', 'get', { params }),

  getRevenueTrends: (params?: { interval?: string; bypass_cache?: boolean }) =>
    apiFetch('/api/analytics/revenue', 'get', { params }),

  getRetentionCohorts: (params?: { bypass_cache?: boolean }) =>
    apiFetch('/api/analytics/retention', 'get', { params }),

  getCacheStats: () =>
    apiFetch('/api/analytics/cache/stats', 'get'),

  clearCache: () =>
    apiFetch('/api/analytics/cache/clear', 'post'),
};

// -------------------------------------------------------------------------
// 2. Customers Domain API
// -------------------------------------------------------------------------

export const customersApi = {
  list: (params?: {
    page?: number;
    page_size?: number;
    segment?: string;
    risk_tier?: string;
    state?: string;
    search?: string;
    sort_by?: string;
    sort_direction?: string;
  }) => apiFetch('/api/customers', 'get', { params }),

  getAtRisk: (params?: {
    page?: number;
    page_size?: number;
    risk_tier?: string | null;
    retention_priority?: string | null;
  }) => apiFetch('/api/customers/at-risk', 'get', { params }),

  getSegments: () =>
    apiFetch('/api/customers/segments', 'get'),

  getDetail: (id: string) =>
    apiFetch('/api/customers/{customer_unique_id}', 'get', {
      pathParams: { customer_unique_id: id },
    }),

  getRFM: (id: string) =>
    apiFetch('/api/customers/{customer_unique_id}/rfm', 'get', {
      pathParams: { customer_unique_id: id },
    }),

  getChurn: (id: string) =>
    apiFetch('/api/customers/{customer_unique_id}/churn', 'get', {
      pathParams: { customer_unique_id: id },
    }),

  exportCSV: (params?: { segment?: string; risk_tier?: string; state?: string }) =>
    apiFetch('/api/customers/export', 'get', { params }),
};

// -------------------------------------------------------------------------
// 3. Machine Learning & Predictions API
// -------------------------------------------------------------------------

export const predictionsApi = {
  score: (body: components['schemas']['ChurnPredictionInput']) =>
    apiFetch('/api/predictions/churn', 'post', { body }),

  simulate: (body: components['schemas']['CounterfactualSimulationRequest']) =>
    apiFetch('/api/predictions/churn/simulate', 'post', { body }),

  simulateCustomer: (id: string, adjustments: Record<string, unknown>) =>
    apiFetch('/api/predictions/churn/simulate/{customer_unique_id}', 'post', {
      pathParams: { customer_unique_id: id },
      body: adjustments as unknown as Record<string, never>,
    }),

  getModelInfo: () =>
    apiFetch('/api/predictions/model/info', 'get'),
};

// -------------------------------------------------------------------------
// 4. Prescriptive Retention & Knapsack Optimizer API
// -------------------------------------------------------------------------

export const retentionApi = {
  getPlaybooks: () =>
    apiFetch('/api/retention/playbooks', 'get'),

  getPlaybook: (id: string) =>
    apiFetch('/api/retention/playbooks/{playbook_id}', 'get', {
      pathParams: { playbook_id: id },
    }),

  simulateROI: (body: components['schemas']['CampaignSimulationRequest']) =>
    apiFetch('/api/retention/campaigns/simulate-roi', 'post', { body }),

  optimizeBudget: (body: components['schemas']['BudgetAllocationRequest']) =>
    apiFetch('/api/retention/campaigns/optimize-budget', 'post', { body }),

  getRecommendation: (customerId: string) =>
    apiFetch('/api/retention/recommendations/{customer_unique_id}', 'get', {
      pathParams: { customer_unique_id: customerId },
    }),
};

// -------------------------------------------------------------------------
// 5. Marketing Funnel & Attribution API
// -------------------------------------------------------------------------

export const marketingApi = {
  getOverview: () =>
    apiFetch('/api/marketing/overview', 'get'),

  getChannels: () =>
    apiFetch('/api/marketing/channels', 'get'),

  getVelocity: () =>
    apiFetch('/api/marketing/velocity', 'get'),

  getSegments: () =>
    apiFetch('/api/marketing/segments', 'get'),

  getLeads: (params?: {
    page?: number;
    page_size?: number;
    origin?: string;
    business_segment?: string;
  }) => apiFetch('/api/marketing/leads', 'get', { params }),
};

// -------------------------------------------------------------------------
// 6. Catalog Intelligence API (Products & Sellers)
// -------------------------------------------------------------------------

export const catalogApi = {
  getProducts: (params?: {
    page?: number;
    page_size?: number;
    category?: string;
  }) => apiFetch('/api/products', 'get', { params }),

  getCategories: () =>
    apiFetch('/api/products/categories', 'get'),

  getProduct: (id: string) =>
    apiFetch('/api/products/{product_id}', 'get', {
      pathParams: { product_id: id },
    }),

  getSellers: (params?: {
    page?: number;
    page_size?: number;
    state?: string;
  }) => apiFetch('/api/sellers', 'get', { params }),

  getSeller: (id: string) =>
    apiFetch('/api/sellers/{seller_id}', 'get', {
      pathParams: { seller_id: id },
    }),
};

// -------------------------------------------------------------------------
// 7. Health & Telemetry API
// -------------------------------------------------------------------------

export const healthApi = {
  getHealth: () =>
    apiFetch('/api/health', 'get'),

  getPipelineHealth: () =>
    apiFetch('/api/health/pipeline', 'get'),

  getRoot: () =>
    apiFetch('/', 'get'),
};

// -------------------------------------------------------------------------
// 8. Authentication API
// -------------------------------------------------------------------------

export const authApi = {
  getToken: () =>
    apiFetch('/api/auth/token', 'post'),

  getMe: () =>
    apiFetch('/api/auth/me', 'get'),
};
