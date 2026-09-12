---
name: mercury-api-client
description: >-
  Runbook and patterns for consuming typed Mercury Backend REST APIs
  using src/types/api.ts, handling offline fallback data, and authentication.
---

# Mercury API Client & Contract Consumption Runbook

This skill outlines how Mercury-Web consumes the Mercury Backend API with 100% end-to-end type safety.

## 1. Type Source of Truth

- **File**: `src/types/api.ts` (generated from Mercury-Backend `openapi.json`).
- **Interfaces**:
  - `paths`: Defines all 40 REST endpoints, accepted query parameters, request bodies, and typed HTTP responses.
  - `components['schemas']`: Contains 61 domain model types (e.g. `PortfolioOverview`, `ChurnPredictionResult`, `RetentionPlaybook`, `MarketingFunnelOverview`, `PipelineHealthResponse`).

## 2. API Client Architecture

- Create a typed fetch wrapper `src/api/client.ts`:
  ```typescript
  import type { paths } from '../types/api';

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const API_KEY = import.meta.env.VITE_API_KEY || '';

  export async function apiFetch<P extends keyof paths, M extends keyof paths[P]>(
    path: P,
    method: M,
    options?: {
      params?: any;
      body?: any;
    }
  ) {
    const url = new URL(`${BASE_URL}${path}`);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (API_KEY) {
      headers['X-API-Key'] = API_KEY;
    }
    const response = await fetch(url.toString(), {
      method: method as string,
      headers,
      body: options?.body ? JSON.stringify(options.body) : undefined,
    });
    if (!response.ok) {
      throw new Error(`API error ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
  ```

## 3. Offline Resilience & Mock Fallbacks

- When the backend service is offline, components should gracefully display cached or realistic fallback fixtures from `src/api/mocks/` rather than blank crash screens.
- This enables frontend UI, UX, and chart development to proceed seamlessly even when `uvicorn` is stopped.
