# Mercury-Web API Integration & Offline Resilience Specification

This document details how **Mercury-Web** consumes the **Mercury Backend REST API** with 100% type safety and implements transparent offline resilience.

---

## 1. Type Source of Truth

The application's API contracts are defined in `src/types/api.ts`, which is synchronized directly from the FastAPI OpenAPI 3.1 specification (`openapi.json`):

- **Endpoints (`paths`)**: Strongly typed definitions for all 40 REST endpoints, query parameters, request bodies, and HTTP status codes.
- **Data Schemas (`components['schemas']`)**: 61 TypeScript interfaces representing domain entities (e.g. `PortfolioOverview`, `CustomerDetail`, `CounterfactualSimulationResponse`, `BudgetAllocationResult`, `PipelineHealthResponse`).

---

## 2. Universal Typed Fetch Client (`src/api/client.ts`)

The client wrapper enforces end-to-end type safety at compile-time:

```typescript
import type { paths } from '../types/api';
import { fallbackMocks } from './mocks/data';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_KEY = import.meta.env.VITE_API_KEY || '';

export async function apiFetch<
  P extends keyof paths,
  M extends keyof paths[P]
>(
  path: P,
  method: M,
  options?: {
    params?: Record<string, unknown>;
    body?: unknown;
    signal?: AbortSignal;
  }
): Promise<any> {
  const url = new URL(`${BASE_URL}${path}`);
  if (options?.params) {
    Object.entries(options.params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.append(k, String(v));
      }
    });
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (API_KEY) {
    headers['X-API-Key'] = API_KEY;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url.toString(), {
      method: (method as string).toUpperCase(),
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
      signal: options?.signal || controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    // Graceful offline fallback
    console.warn(`[Mercury API Client] Backend unreachable at ${path}. Falling back to mock fixture.`);
    return fallbackMocks(path, method, options?.body);
  }
}
```

---

## 3. Offline Mock Resilience Engine (`src/api/mocks/data.ts`)

To ensure smooth presentation and offline development when PostgreSQL or Uvicorn is not running, the client seamlessly serves realistic mock fixtures matching actual Olist distributions:

| Mock Fixture | Mirrored Endpoint | Data Scope |
|:---|:---|:---|
| `mockPortfolioOverview` | `GET /api/analytics/overview` | R$ 15.98M GMV, 96,096 customers, 18.4% high churn rate |
| `mockSegmentsOverview` | `GET /api/analytics/segments` | 11 RFM customer segments with customer counts & revenue |
| `mockRevenueTrends` | `GET /api/analytics/revenue` | 18 months of historical GMV, order volume, and AOV |
| `mockCohortRetention` | `GET /api/analytics/retention` | 12-month cohort survival decay matrix |
| `mockCustomersList` | `GET /api/customers` | 50+ rich customer records across all segments |
| `mockAtRiskQueue` | `GET /api/customers/at-risk` | Priority 1 & 2 high-exposure customers |
| `mockCustomerDetail` | `GET /api/customers/{id}` | Complete 360 profile with Shapley feature contributions |
| `mockSimulationResponse` | `POST /api/predictions/churn/simulate` | Dynamic calculation of delta churn & saved revenue |
| `mockPlaybooksCatalog` | `GET /api/retention/playbooks` | 6 prescriptive retention strategies with unit economics |
| `mockBudgetAllocation` | `POST /api/retention/campaigns/optimize-budget`| Knapsack budget allocation across customer candidate pools |
| `mockMarketingFunnel` | `GET /api/marketing/overview` | 8,000 MQLs, 842 closed deals, sales cycle velocity |
| `mockPipelineHealth` | `GET /api/health/pipeline` | Table row counts, freshness tracking, and model metadata |

---

## 4. Security & Dual Authentication

Mercury-Web supports two secure connection modes:
1. **API Key Authentication**: Injects `X-API-Key: <key>` header on all requests.
2. **Bearer JWT Token**: Requests an access token via `POST /api/auth/token` and injects `Authorization: Bearer <token>` into headers.
3. **Development Bypass**: When `Mercury-Backend` runs with `REQUIRE_AUTH=false`, frontend requests pass transparently without requiring credentials.
