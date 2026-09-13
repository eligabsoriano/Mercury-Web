# Mercury Web — Executive Customer Intelligence & Retention Dashboard

**Mercury-Web** is the executive customer intelligence, predictive churn simulation, and retention analytics web dashboard for the **Mercury** platform. It interfaces with the [Mercury Backend REST API](https://github.com/eligabsoriano/Mercury-Backend) (40 live endpoints, 61 domain schemas) to transform large-scale e-commerce transaction logs into actionable customer retention workflows, interactive counterfactual simulations, and Knapsack-optimized capital allocation plans.

---

## 🎯 Executive Value Proposition

Modern e-commerce platforms suffer from silent customer churn: over 97% of buyers churn after their initial purchase, and generic discount blast campaigns drain marketing budgets with poor return on investment. 

Mercury-Web provides executive leaders (C-level, VP of Growth, Customer Success) with:
- **Macro Portfolio Intelligence**: Real-time visibility into total gross merchandise value (GMV), active customer retention, and aggregate revenue-at-risk.
- **Micro-Targeted Intervention**: Automated RFM quintile segmentation classifying customers across 11 canonical cohorts to isolate high-value at-risk accounts.
- **Interactive ML Churn Simulation**: Real-time counterfactual "what-if" modeling to project how resolving delivery delays or providing targeted discounts impacts churn probability and protected revenue.
- **Prescriptive Retention Economics**: An algorithmic Knapsack capital deployment optimizer that maximizes net revenue recovery under fixed retention marketing budgets.
- **Two-Sided Marketplace Visibility**: Funnel conversion analytics and sales velocity tracking for seller acquisition and merchant performance.

---

## 🌟 Core Executive Workspaces

| Workspace | Description & Analytical Focus |
|:---|:---|
| **Executive Overview** | Macro portfolio KPIs, revenue trends, RFM segment matrix, and 12-month cohort retention decay heatmaps. |
| **Customer Intelligence & 360° Profile** | Paginated customer directory, priority at-risk intervention queue, 1-click CSV export, and individual customer 360 scorecards with Shapley risk drivers. |
| **ML Churn Counterfactual Simulator** | Interactive slider engine simulating the impact of delivery delays, review ratings, and discount incentives on customer churn probabilities. |
| **Prescriptive Retention Planner** | 6 prescriptive intervention playbooks, campaign financial ROI calculator, and Knapsack budget optimizer. |
| **Marketplace Marketing Funnel** | Two-sided seller acquisition funnel (MQL $\rightarrow$ Closed Deals $\rightarrow$ Active Sellers), origin channel attribution, and sales velocity. |
| **Catalog Intelligence** | Product category revenue scorecards and marketplace seller on-time delivery performance rankings. |

---

## 🧰 Technology Stack

| Layer | Technology |
|:---|:---|
| **Frontend Framework** | React 18, TypeScript 5, Vite 5 |
| **Styling & Design System** | Modern Vanilla CSS (Curated HSL tokens, Dark Glassmorphism, Responsive Grid) |
| **Typography** | Google Fonts (`Outfit` for executive KPI metrics; `Inter` for analytical data density) |
| **Data Visualization** | `recharts` (Area/bar time-series, cohort survival heatmaps, conversion funnels) |
| **Icons & Visuals** | `lucide-react` |
| **Type Contracts** | Auto-generated TypeScript definitions from OpenAPI 3.1 (`src/types/api.ts`) |
| **Resilience & Testing** | Transparent offline mock engine mirroring Brazilian E-Commerce (Olist) data |

---

## 📚 Detailed Documentation

Comprehensive technical specifications, architecture blueprints, design tokens, and roadmap plans are separated into dedicated guides:

- 🗺️ **[docs/roadmap.md](docs/roadmap.md)** — 8-phase engineering roadmap, phase tracker, 40-endpoint mapping matrix, and Definition of Done (DoD).
- 🏛️ **[docs/architecture.md](docs/architecture.md)** — System data flow, component tree, client directory structure, and customer identity resolution.
- 🎨 **[docs/design_system.md](docs/design_system.md)** — Visual design language, dark glassmorphism parameters, HSL tokens, and UI primitives.
- 📡 **[docs/api_integration.md](docs/api_integration.md)** — Typed API client architecture, dual authentication (API Key & Bearer JWT), and offline resilience mocks.
- 🪄 **[docs/ui_ux_pro_max_guide.md](docs/ui_ux_pro_max_guide.md)** — UI/UX Pro Max design intelligence setup, search CLI commands, and design system reasoning.

---

## 🚀 Quickstart

### Prerequisites
- Node.js `v18.0.0+` (tested with v26.x)
- npm `v9.0.0+`

### Development Setup
```bash
# Clone the repository
git clone https://github.com/eligabsoriano/Mercury-Web.git
cd Mercury-Web

# Install dependencies
npm install

# Start Vite development server (proxies API requests to http://localhost:8000)
npm run dev

# Run static type checks (zero TypeScript errors)
npx tsc --noEmit

# Compile production bundle
npm run build
```

---

## 👤 Author & Credits

**Eli Gabriel T. Soriano** — BS Information Technology (System Development)  
*Specialization: Data Analytics, Machine Learning & Frontend Engineering.*
