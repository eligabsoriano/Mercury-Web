import type { paths } from '../types/api';
import {
  mockHealth,
  mockPipelineHealth,
  mockToken,
  mockUserIdentity,
  mockPortfolioOverview,
  mockSegmentsOverview,
  mockRevenueAtRiskOverview,
  mockRevenueTrends,
  mockCohortRetention,
  mockCustomersList,
  mockCustomerDetail,
  mockCustomerRecommendation,
  mockRetentionPlaybooks,
  mockModelMetadata,
  mockMarketingFunnel,
  mockChannelAttribution,
  mockSalesVelocity,
  mockSegmentPerformance,
  mockMarketingLeads,
  mockCategories,
  mockProducts,
  mockSellers,
  simulateChurn,
  simulateCounterfactual,
  simulateCampaignROI,
  optimizeRetentionBudget,
} from './mocks/data';

// -------------------------------------------------------------------------
// Connection & Telemetry State
// -------------------------------------------------------------------------

export interface ConnectionState {
  status: 'connected' | 'offline' | 'connecting';
  latencyMs: number | null;
  isMock: boolean;
  lastChecked: string;
}

let connectionState: ConnectionState = {
  status: 'offline',
  latencyMs: null,
  isMock: true,
  lastChecked: new Date().toISOString(),
};

const listeners = new Set<(state: ConnectionState) => void>();

export function getConnectionState(): ConnectionState {
  return { ...connectionState };
}

export function subscribeConnectionState(listener: (state: ConnectionState) => void): () => void {
  listeners.add(listener);
  listener(getConnectionState());
  return () => {
    listeners.delete(listener);
  };
}

function updateConnectionState(next: Partial<ConnectionState>): void {
  connectionState = {
    ...connectionState,
    ...next,
    lastChecked: new Date().toISOString(),
  };
  listeners.forEach((fn) => fn(connectionState));
}

// -------------------------------------------------------------------------
// Client Configuration
// -------------------------------------------------------------------------

// Safely access environment variables in browser Vite and Node/testing runtimes
const env =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env
    : ({} as Record<string, string | undefined>);

const BASE_URL = (env.VITE_API_BASE_URL as string) || 'http://localhost:8000';
const API_KEY = (env.VITE_API_KEY as string) || '';
const AUTH_TOKEN = (env.VITE_AUTH_TOKEN as string) || '';
const FORCE_MOCK = (env.VITE_FORCE_MOCK as string) === 'true';

// -------------------------------------------------------------------------
// Type Helpers for Path Operations
// -------------------------------------------------------------------------

type ExtractSuccessResponse<Op> = Op extends { responses: { 200: { content: { 'application/json': infer R } } } }
  ? R
  : Op extends { responses: { 201: { content: { 'application/json': infer R } } } }
  ? R
  : Op extends { responses: { 200: { content: { 'text/csv': infer R } } } }
  ? R
  : Op extends { responses: { [key: number]: { content: { 'application/json': infer R } } } }
  ? R
  : unknown;

type ExtractRequestBody<Op> = Op extends { requestBody: { content: { 'application/json': infer B } } }
  ? B
  : Op extends { requestBody?: { content: { 'application/json': infer B } } }
  ? B
  : undefined;

type ExtractQueryParams<Op> = Op extends { parameters: { query?: infer Q } }
  ? Q
  : Op extends { parameters: { query: infer Q } }
  ? Q
  : undefined;

type ExtractPathParams<Op> = Op extends { parameters: { path?: infer P } }
  ? P
  : Op extends { parameters: { path: infer P } }
  ? P
  : Record<string, string | number>;

export interface ApiFetchOptions<Op> {
  params?: ExtractQueryParams<Op>;
  pathParams?: ExtractPathParams<Op>;
  body?: ExtractRequestBody<Op>;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  timeoutMs?: number;
  skipMockFallback?: boolean;
}

// -------------------------------------------------------------------------
// Typed apiFetch Core Function
// -------------------------------------------------------------------------

export async function apiFetch<
  P extends keyof paths,
  M extends keyof paths[P] = keyof paths[P]
>(
  path: P,
  method: M = 'get' as M,
  options?: ApiFetchOptions<paths[P][M]>
): Promise<ExtractSuccessResponse<paths[P][M]>> {
  // If explicitly forced to mock mode, bypass network entirely
  if (FORCE_MOCK) {
    return resolveMockFallback(path, method, options);
  }

  // Construct absolute URL replacing path parameters e.g. {id}
  let resolvedPath = String(path);
  if (options?.pathParams) {
    for (const [paramKey, paramVal] of Object.entries(options.pathParams)) {
      resolvedPath = resolvedPath.replace(`{${paramKey}}`, encodeURIComponent(String(paramVal)));
    }
  }

  const url = new URL(resolvedPath, BASE_URL);

  // Append query parameters if provided
  if (options?.params) {
    for (const [queryKey, queryVal] of Object.entries(options.params)) {
      if (queryVal !== undefined && queryVal !== null) {
        url.searchParams.append(queryKey, String(queryVal));
      }
    }
  }

  // Configure HTTP headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options?.headers || {}),
  };

  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }
  if (AUTH_TOKEN) {
    headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }

  // Timeout handling via AbortController
  const timeoutMs = options?.timeoutMs || 4000;
  const controller = new AbortController();
  const timeoutTimer = setTimeout(() => controller.abort(), timeoutMs);

  const startTime = performance.now();

  try {
    const response = await fetch(url.toString(), {
      method: String(method).toUpperCase(),
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
      signal: options?.signal || controller.signal,
    });

    clearTimeout(timeoutTimer);

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
    }

    const latency = Math.round(performance.now() - startTime);
    updateConnectionState({
      status: 'connected',
      latencyMs: latency,
      isMock: false,
    });

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return (await response.json()) as ExtractSuccessResponse<paths[P][M]>;
    }
    return (await response.text()) as ExtractSuccessResponse<paths[P][M]>;
  } catch (err) {
    clearTimeout(timeoutTimer);

    // If caller forbade fallback, propagate error
    if (options?.skipMockFallback) {
      updateConnectionState({
        status: 'offline',
        latencyMs: null,
        isMock: false,
      });
      throw err;
    }

    // Otherwise gracefully degrade to typed mock fallback
    updateConnectionState({
      status: 'offline',
      latencyMs: null,
      isMock: true,
    });

    return resolveMockFallback(path, method, options);
  }
}

// -------------------------------------------------------------------------
// Route Mock Dispatcher
// -------------------------------------------------------------------------

function resolveMockFallback<
  P extends keyof paths,
  M extends keyof paths[P]
>(
  path: P,
  method: M,
  options?: ApiFetchOptions<paths[P][M]>
): ExtractSuccessResponse<paths[P][M]> {
  const p = String(path);
  const m = String(method).toLowerCase();
  const pathParams = (options?.pathParams || {}) as Record<string, string | number>;
  const body = options?.body as Record<string, unknown> | undefined;

  let result: unknown;

  // Root & Health
  if (p === '/' && m === 'get') {
    result = { service: 'mercury-backend', status: 'operational', version: '1.0.0' };
  } else if ((p === '/health' || p === '/api/health') && m === 'get') {
    result = mockHealth;
  } else if (p === '/api/health/pipeline' && m === 'get') {
    result = mockPipelineHealth;
  } else if (p === '/api/auth/token' && m === 'post') {
    result = mockToken;
  } else if (p === '/api/auth/me' && m === 'get') {
    result = mockUserIdentity;
  } else if (p === '/api/analytics/overview' && m === 'get') {
    result = mockPortfolioOverview;
  } else if ((p === '/api/analytics/segments' || p === '/api/analytics/rfm') && m === 'get') {
    result = mockSegmentsOverview;
  } else if (p === '/api/analytics/revenue-at-risk' && m === 'get') {
    result = mockRevenueAtRiskOverview;
  } else if (p === '/api/analytics/revenue' && m === 'get') {
    result = mockRevenueTrends;
  } else if (p === '/api/analytics/retention' && m === 'get') {
    result = mockCohortRetention;
  } else if (p === '/api/analytics/cache/stats' && m === 'get') {
    result = { hits: 1420, misses: 112, evictions: 8, hit_ratio: 0.927, memory_items: 24 };
  } else if (p === '/api/analytics/cache/clear' && m === 'post') {
    result = { status: 'success', cleared_entries: 24, timestamp: new Date().toISOString() };
  } else if (p === '/api/customers' && m === 'get') {
    result = {
      items: mockCustomersList,
      pagination: {
        page: 1,
        page_size: 20,
        total_items: mockCustomersList.length,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      },
    };
  } else if (p === '/api/customers/at-risk' && m === 'get') {
    const atRiskItems = mockCustomersList.filter((c) => c.risk_tier === 'High');
    result = {
      items: atRiskItems,
      pagination: {
        page: 1,
        page_size: 20,
        total_items: atRiskItems.length,
        total_pages: 1,
        has_next: false,
        has_prev: false,
      },
    };
  } else if (p === '/api/customers/segments' && m === 'get') {
    result = mockSegmentsOverview;
  } else if (p === '/api/customers/export' && m === 'get') {
    const headers = 'customer_unique_id,city,state,lifetime_orders,lifetime_spend,churn_probability,risk_tier,segment\n';
    const rows = mockCustomersList
      .map(
        (c) =>
          `${c.customer_unique_id},${c.city},${c.state},${c.lifetime_orders},${c.lifetime_spend},${c.churn_probability},${c.risk_tier},${c.segment}`
      )
      .join('\n');
    result = headers + rows;
  } else if ((p === '/api/customers/{customer_unique_id}' || p === '/api/customers/{id}') && m === 'get') {
    const customerId = String(pathParams.customer_unique_id || pathParams.id || mockCustomerDetail.customer_unique_id);
    result = {
      ...mockCustomerDetail,
      customer_unique_id: customerId,
    };
  } else if ((p === '/api/customers/{customer_unique_id}/rfm' || p === '/api/customers/{id}/rfm') && m === 'get') {
    const customerId = String(pathParams.customer_unique_id || pathParams.id || mockCustomerDetail.customer_unique_id);
    result = mockCustomerDetail.rfm || {
      customer_unique_id: customerId,
      r_score: 5,
      f_score: 5,
      m_score: 5,
      rfm_score: 5.0,
      rfm_label: '555',
      segment: 'Champions',
      recency_days: 11,
      frequency: 16,
      monetary: 2845.6,
    };
  } else if ((p === '/api/customers/{customer_unique_id}/churn' || p === '/api/customers/{id}/churn') && m === 'get') {
    result = simulateChurn({
      customer_lifespan_days: 11,
      lifetime_orders: 16,
      lifetime_spend: 2845.6,
      avg_review_score: 4.85,
    });
  } else if (p === '/api/predictions/churn' && m === 'post') {
    result = simulateChurn(body || {});
  } else if (p === '/api/predictions/churn/simulate' && m === 'post') {
    result = simulateCounterfactual(
      (body || { adjustments: {} }) as unknown as Parameters<typeof simulateCounterfactual>[0]
    );
  } else if (
    (p === '/api/predictions/churn/simulate/{customer_unique_id}' || p === '/api/predictions/churn/simulate/{id}') &&
    m === 'post'
  ) {
    const customerId = String(pathParams.customer_unique_id || pathParams.id || 'cust-sim');
    result = simulateCounterfactual({
      customer_unique_id: customerId,
      adjustments: (body?.adjustments || {}) as Record<string, never>,
    });
  } else if (p === '/api/predictions/model/info' && m === 'get') {
    result = mockModelMetadata;
  } else if (p === '/api/retention/playbooks' && m === 'get') {
    result = mockRetentionPlaybooks;
  } else if ((p === '/api/retention/playbooks/{playbook_id}' || p === '/api/retention/playbooks/{id}') && m === 'get') {
    const playbookId = String(pathParams.playbook_id || pathParams.id);
    const found = mockRetentionPlaybooks.find((pb) => pb.playbook_id === playbookId);
    result = found || mockRetentionPlaybooks[0];
  } else if (p === '/api/retention/campaigns/simulate-roi' && m === 'post') {
    result = simulateCampaignROI(
      (body || {}) as unknown as Parameters<typeof simulateCampaignROI>[0]
    );
  } else if (p === '/api/retention/campaigns/optimize-budget' && m === 'post') {
    result = optimizeRetentionBudget(
      (body || { total_budget: 50000 }) as unknown as Parameters<typeof optimizeRetentionBudget>[0]
    );
  } else if (
    (p === '/api/retention/recommendations/{customer_unique_id}' || p === '/api/retention/recommendations/{id}') &&
    m === 'get'
  ) {
    const customerId = String(pathParams.customer_unique_id || pathParams.id || mockCustomerRecommendation.customer_unique_id);
    result = {
      ...mockCustomerRecommendation,
      customer_unique_id: customerId,
    };
  } else if (p === '/api/marketing/overview' && m === 'get') {
    result = mockMarketingFunnel;
  } else if (p === '/api/marketing/channels' && m === 'get') {
    result = mockChannelAttribution;
  } else if (p === '/api/marketing/velocity' && m === 'get') {
    result = mockSalesVelocity;
  } else if (p === '/api/marketing/segments' && m === 'get') {
    result = mockSegmentPerformance;
  } else if (p === '/api/marketing/leads' && m === 'get') {
    result = mockMarketingLeads;
  } else if (p === '/api/products' && m === 'get') {
    result = mockProducts;
  } else if (p === '/api/products/categories' && m === 'get') {
    result = mockCategories;
  } else if ((p === '/api/products/{product_id}' || p === '/api/products/{id}') && m === 'get') {
    result = mockProducts.items[0];
  } else if (p === '/api/sellers' && m === 'get') {
    result = mockSellers;
  } else if ((p === '/api/sellers/{seller_id}' || p === '/api/sellers/{id}') && m === 'get') {
    result = mockSellers.items[0];
  } else {
    throw new Error(`[Mock Engine] No mock route mapped for ${m.toUpperCase()} ${p}`);
  }

  return result as ExtractSuccessResponse<paths[P][M]>;
}
