# Mercury Web — Customer Intelligence & Retention Analytics Dashboard

**Mercury-Web** is the React & TypeScript executive dashboard for the Mercury platform. It turns transaction data into actionable retention workflows, interactive counterfactual churn simulations, and visual marketing funnel analytics.

## 🚀 Tech Stack

- **Framework**: React 18, TypeScript, Vite
- **Data Visualization**: Recharts, Lucide Icons
- **Design System**: Modern CSS with curated HSL tokens, dark glassmorphism, and responsive grid layouts
- **Type Contracts**: Synchronized with `Mercury-Backend` via `src/types/api.ts` (40 endpoints, 61 schemas)

## 📡 API Integration

The application connects to the **Mercury Backend API**:
- Local Development: `http://localhost:8000`
- Configured via: `.env` (`VITE_API_BASE_URL`)

## 🛠️ Quickstart

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```
