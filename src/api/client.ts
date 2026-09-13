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
const FORCE_MOCK =
  (env.VITE_FORCE_MOCK as string) === 'true' ||
  env.MODE === 'test' ||
  (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test');

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
  const timeoutMs =
    options?.timeoutMs || (import.meta.env?.MODE === 'test' ? 100 : 4000);
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
      const httpError = new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      (httpError as unknown as { status: number }).status = response.status;
      throw httpError;
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
  } catch (err: unknown) {
    clearTimeout(timeoutTimer);

    const httpStatus = (err as { status?: number })?.status;
    const isClientHttpError = typeof httpStatus === 'number' && httpStatus >= 400 && httpStatus < 500;

    // If server responded with a client-level status (e.g. 404 Not Found),
    // the backend API is alive and reachable. Do not mark global status offline.
    if (isClientHttpError) {
      const latency = Math.round(performance.now() - startTime);
      updateConnectionState({
        status: 'connected',
        latencyMs: latency,
        isMock: false,
      });
    } else {
      // True network dropout, abort/timeout, or 5xx internal server error
      updateConnectionState({
        status: 'offline',
        latencyMs: null,
        isMock: !options?.skipMockFallback,
      });
    }

    // If caller forbade fallback, propagate error
    if (options?.skipMockFallback) {
      throw err;
    }

    // Otherwise gracefully degrade to typed mock fallback
    return resolveMockFallback(path, method, options);
  }
}

// -------------------------------------------------------------------------
// Route Mock Dispatcher & Dynamic Query Evaluator
// -------------------------------------------------------------------------

function filterAndPaginateMockCustomers(
  items: typeof mockCustomersList,
  params: Record<string, unknown>
) {
  let filtered = [...items];

  // Search filter
  const search = typeof params.search === 'string' ? params.search.trim().toLowerCase() : '';
  if (search) {
    filtered = filtered.filter(
      (c) =>
        c.customer_unique_id.toLowerCase().includes(search) ||
        (c.city && c.city.toLowerCase().includes(search)) ||
        (c.state && c.state.toLowerCase().includes(search))
    );
  }

  // Segment filter
  const segment = typeof params.segment === 'string' ? params.segment : '';
  if (segment && segment !== 'all') {
    filtered = filtered.filter((c) => c.segment?.toLowerCase() === segment.toLowerCase());
  }

  // Risk Tier filter
  const riskTier = typeof params.risk_tier === 'string' ? params.risk_tier : '';
  if (riskTier && riskTier !== 'all') {
    const normRisk = riskTier.toLowerCase().replace(' risk', '').trim();
    filtered = filtered.filter((c) => c.risk_tier?.toLowerCase().includes(normRisk));
  }

  // State filter
  const state = typeof params.state === 'string' ? params.state : '';
  if (state && state !== 'all') {
    filtered = filtered.filter((c) => c.state?.toLowerCase() === state.toLowerCase());
  }

  // Retention priority filter
  const priority = typeof params.retention_priority === 'string' ? params.retention_priority : '';
  if (priority && priority !== 'all') {
    filtered = filtered.filter((c) =>
      c.retention_priority?.toLowerCase().includes(priority.toLowerCase())
    );
  }

  // Sorting
  const sortBy = typeof params.sort_by === 'string' ? params.sort_by : 'lifetime_spend';
  const sortDir =
    typeof params.sort_direction === 'string' ? params.sort_direction.toLowerCase() : 'desc';
  filtered.sort((a, b) => {
    let valA = a[sortBy as keyof typeof a] ?? 0;
    let valB = b[sortBy as keyof typeof b] ?? 0;
    if (typeof valA === 'string') valA = (valA as string).toLowerCase();
    if (typeof valB === 'string') valB = (valB as string).toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const page = Math.max(1, Number(params.page) || 1);
  const pageSize = Math.max(1, Number(params.page_size) || 10);
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  return {
    items: paginated,
    pagination: {
      page,
      page_size: pageSize,
      total_items: totalItems,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_prev: page > 1,
    },
  };
}

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
    const params = (options?.params || {}) as Record<string, unknown>;
    result = filterAndPaginateMockCustomers(mockCustomersList, params);
  } else if (p === '/api/customers/at-risk' && m === 'get') {
    const params = (options?.params || {}) as Record<string, unknown>;
    const atRiskItems = mockCustomersList.filter((c) => c.risk_tier === 'High' || (c.churn_probability ?? 0) >= 0.7);
    result = filterAndPaginateMockCustomers(atRiskItems, params);
  } else if (p === '/api/customers/segments' && m === 'get') {
    result = mockSegmentsOverview;
  } else if (p === '/api/customers/export' && m === 'get') {
    const params = (options?.params || {}) as Record<string, unknown>;
    const exportData = filterAndPaginateMockCustomers(mockCustomersList, { ...params, page: 1, page_size: 1000 });
    const headers = 'customer_unique_id,city,state,lifetime_orders,lifetime_spend,churn_probability,risk_tier,segment,retention_priority,revenue_at_risk\n';
    const rows = exportData.items
      .map(
        (c) =>
          `${c.customer_unique_id},${c.city ?? ''},${c.state ?? ''},${c.lifetime_orders},${c.lifetime_spend},${c.churn_probability ?? 0},${c.risk_tier},${c.segment},${c.retention_priority},${c.revenue_at_risk}`
      )
      .join('\n');
    result = headers + rows;
  } else if ((p === '/api/customers/{customer_unique_id}' || p === '/api/customers/{id}') && m === 'get') {
    const customerId = String(pathParams.customer_unique_id || pathParams.id || mockCustomerDetail.customer_unique_id);
    const foundCust = mockCustomersList.find((c) => c.customer_unique_id === customerId);
    if (foundCust) {
      result = {
        ...mockCustomerDetail,
        customer_unique_id: foundCust.customer_unique_id,
        city: foundCust.city,
        state: foundCust.state,
        lifetime_orders: foundCust.lifetime_orders,
        lifetime_spend: foundCust.lifetime_spend,
        avg_order_value: foundCust.avg_order_value,
        lifetime_product_spend: Number((foundCust.lifetime_spend * 0.85).toFixed(2)),
        lifetime_freight_spend: Number((foundCust.lifetime_spend * 0.15).toFixed(2)),
        is_repeat_buyer: foundCust.is_repeat_buyer,
        first_purchased_at: foundCust.first_purchased_at,
        latest_purchased_at: foundCust.latest_purchased_at,
        recency_days: foundCust.recency_days,
        customer_lifespan_days: foundCust.customer_lifespan_days,
        rfm: {
          customer_unique_id: foundCust.customer_unique_id,
          r_score: foundCust.recency_days && foundCust.recency_days < 60 ? 5 : foundCust.recency_days && foundCust.recency_days < 180 ? 3 : 1,
          f_score: Math.min(5, foundCust.lifetime_orders),
          m_score: foundCust.lifetime_spend > 1500 ? 5 : foundCust.lifetime_spend > 500 ? 3 : 1,
          rfm_score: 4.2,
          rfm_label: `${foundCust.recency_days && foundCust.recency_days < 60 ? 5 : 2}${Math.min(5, foundCust.lifetime_orders)}${foundCust.lifetime_spend > 1000 ? 5 : 3}`,
          segment: foundCust.segment ?? 'Champions',
          recency_days: foundCust.recency_days ?? 30,
          frequency: foundCust.lifetime_orders,
          monetary: foundCust.lifetime_spend,
          computed_at: new Date().toISOString(),
        },
        churn: {
          customer_unique_id: foundCust.customer_unique_id,
          churn_probability: foundCust.churn_probability ?? 0.75,
          is_churned: (foundCust.churn_probability ?? 0) >= 0.7 ? 1 : 0,
          monetary_value: foundCust.lifetime_spend,
          risk_tier: foundCust.risk_tier,
          retention_priority: foundCust.retention_priority,
          revenue_at_risk: foundCust.revenue_at_risk,
          predicted_at: new Date().toISOString(),
        },
      };
    } else {
      result = {
        ...mockCustomerDetail,
        customer_unique_id: customerId,
      };
    }
  } else if ((p === '/api/customers/{customer_unique_id}/rfm' || p === '/api/customers/{id}/rfm') && m === 'get') {
    const customerId = String(pathParams.customer_unique_id || pathParams.id || mockCustomerDetail.customer_unique_id);
    const foundCust = mockCustomersList.find((c) => c.customer_unique_id === customerId);
    result = {
      customer_unique_id: customerId,
      r_score: foundCust?.recency_days && foundCust.recency_days < 60 ? 5 : 2,
      f_score: Math.min(5, foundCust?.lifetime_orders || 1),
      m_score: (foundCust?.lifetime_spend || 100) > 1000 ? 5 : 3,
      rfm_score: 4.0,
      rfm_label: '433',
      segment: foundCust?.segment || 'At Risk',
      recency_days: foundCust?.recency_days || 45,
      frequency: foundCust?.lifetime_orders || 1,
      monetary: foundCust?.lifetime_spend || 150.0,
    };
  } else if ((p === '/api/customers/{customer_unique_id}/churn' || p === '/api/customers/{id}/churn') && m === 'get') {
    const customerId = String(pathParams.customer_unique_id || pathParams.id || mockCustomerDetail.customer_unique_id);
    const foundCust = mockCustomersList.find((c) => c.customer_unique_id === customerId);
    result = simulateChurn({
      customer_lifespan_days: foundCust?.customer_lifespan_days ?? 120,
      lifetime_orders: foundCust?.lifetime_orders ?? 1,
      lifetime_spend: foundCust?.lifetime_spend ?? 250,
      avg_review_score: 4.2,
      avg_delivery_delay_days: foundCust?.risk_tier === 'High' ? 4.5 : -2.0,
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
    const foundCust = mockCustomersList.find((c) => c.customer_unique_id === customerId);
    const chosenPlaybook =
      foundCust && foundCust.lifetime_spend > 1500
        ? mockRetentionPlaybooks[0] // vip_concierge
        : foundCust && foundCust.risk_tier === 'High'
        ? mockRetentionPlaybooks[1] // logistics_friction_recovery
        : foundCust && foundCust.risk_tier === 'Medium'
        ? mockRetentionPlaybooks[3] // automated_reengagement
        : mockRetentionPlaybooks[4]; // loyalty_nurture

    result = {
      customer_unique_id: customerId,
      risk_tier: foundCust?.risk_tier ?? 'High',
      churn_probability: foundCust?.churn_probability ?? 0.785,
      revenue_at_risk: foundCust?.revenue_at_risk ?? 1250.0,
      primary_friction:
        foundCust?.risk_tier === 'High'
          ? 'Prolonged Recency Inactivity & Carrier Delivery Delay'
          : 'Frequency Decay & Re-engagement Window Expiration',
      recommended_playbook: chosenPlaybook,
      projected_net_gain: Number(((foundCust?.revenue_at_risk ?? 1000) * (chosenPlaybook.estimated_save_rate_min ?? 0.25) - chosenPlaybook.default_cost_per_customer).toFixed(2)),
      expected_gross_recovery: Number(((foundCust?.revenue_at_risk ?? 1000) * (chosenPlaybook.estimated_save_rate_max ?? 0.40)).toFixed(2)),
      suggested_message: `Prezado cliente (${customerId.slice(0, 8)}), notamos que seu último pedido pode ter tido atritos de entrega. Preparamos uma condição exclusiva para seu retorno.`,
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
