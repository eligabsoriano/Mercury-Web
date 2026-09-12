# Project Identity

Mercury-Web is the executive customer intelligence, churn prediction, and retention analytics web dashboard for the Mercury platform. It consumes the Mercury Backend REST API (40 endpoints) using strongly typed TypeScript contracts generated from OpenAPI 3.1.

# Instruction Priority Hierarchy

When instructions conflict, resolve them using this strict hierarchy:
1. **User Task Prompt**: Explicit instructions and constraints in the immediate user prompt.
2. **Active Project AGENTS.md**: Repository-level guardrails, design principles, autonomy policies, and definitions of done.
3. **Project Documentation**: Design docs in `docs/` or API contracts in `src/types/api.ts`.
4. **Retrieved External Data**: Web search results, external references, or default model priors.

# Autonomy & Decision Boundaries

## Autonomous (Proceed Without Asking)
- Creating and modifying UI components, pages, design system tokens, CSS, and state management.
- Setting up and updating dependencies via `npm install`.
- Running local validation commands (`npm run build`, `npm run lint`, `npm test`, `npm run dev`).
- Adding mock data fixtures or fallback data for offline development.

## Require Explicit User Approval
- Modifying or breaking established client API request/response contracts in `src/types/api.ts`.
- Deleting core application pages or completely replacing established UI frameworks.
- Triggering production cloud deployments (Vercel, Netlify, Cloudflare Pages).

# Scope and Current Baseline

- **Framework & Build**: React 18+, TypeScript, Vite.
- **Styling & Design System**: Modern CSS with curated HSL color tokens, dark glassmorphism, responsive grid layouts, and Google Fonts (Outfit & Inter).
- **Icons & Visuals**: `lucide-react`.
- **Data Visualization**: Rich interactive charts (`recharts` or `chart.js`) for cohort heatmaps, RFM scorecards, and revenue trends.
- **API Client**: Strongly typed Fetch client consuming `src/types/api.ts` connected to `VITE_API_BASE_URL` (default `http://localhost:8000`).

# Design Guidelines & Visual Standards

1. **Rich Aesthetics & WOW Factor**:
   - Deep slate/navy dark theme with subtle neon accents (emerald for revenue/retention, violet/indigo for predictions, crimson for churn risk).
   - Glassmorphic panels with subtle borders (`rgba(255, 255, 255, 0.08)`) and backdrop blur.
   - Smooth hover states, micro-transitions, and active tab indicators.
2. **Executive Density & Hierarchy**:
   - Clear KPI cards with sparklines, percentage deltas, and natural-language takeaways.
   - Interactive sliders for real-time counterfactual churn simulation.
   - Visual knapsack budget allocation bars and ROI calculators.
3. **No Placeholders**:
   - Use real API data when backend is live, and realistic fallback mock data when developing offline so the UI is always fully interactive.

# Definition of Done (DoD)

A task or feature is considered complete only when:
1. **Compilation & Type Safety**: TypeScript compiles cleanly with zero errors (`npm run build` or `npx tsc --noEmit`).
2. **Linting**: Code passes `npm run lint` with zero warnings or errors.
3. **Responsiveness**: Layout adapts cleanly across desktop (1440px+) and tablet/mobile viewports.
4. **Contract Fidelity**: All API communications adhere strictly to `src/types/api.ts`.
