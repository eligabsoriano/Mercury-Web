---
name: mercury-ui
description: >-
  Design system, component conventions, dark glassmorphic styling tokens,
  and data visualization guidelines for Mercury-Web React dashboard.
---

# Mercury UI Design System & Component Guidelines

This skill defines the visual language, styling patterns, and component conventions for the Mercury-Web dashboard.

## 1. Visual Aesthetics & Design System Tokens

Mercury-Web uses a sleek, executive-level dark mode with glassmorphism and high-contrast analytical accents:

- **Backgrounds**:
  - Deep canvas: `hsl(222, 47%, 7%)` (`#0b0f19`)
  - Elevated card / panel: `hsla(222, 40%, 12%, 0.7)` with `backdrop-filter: blur(12px)`
  - Surface border: `1px solid hsla(217, 33%, 25%, 0.4)`
- **Typography**:
  - Primary font: `Inter, sans-serif` for high-density tables, metrics, and body text.
  - Display / Header font: `Outfit, sans-serif` for KPI values, card titles, and section headers.
- **Color Accents**:
  - Revenue & Low Risk: Emerald `hsl(158, 64%, 52%)` (`#34d399`)
  - Churn Warning & High Risk: Crimson/Coral `hsl(354, 70%, 54%)` (`#f43f5e`)
  - Predictions & AI / Simulator: Violet/Indigo `hsl(263, 70%, 58%)` (`#8b5cf6`)
  - Neutral / Inactive: Slate `hsl(215, 20%, 65%)` (`#94a3b8`)

## 2. Component Structure

- `src/components/common/`: Reusable primitives (`Card`, `Badge`, `Button`, `Input`, `Modal`, `Slider`, `MetricCard`).
- `src/components/layout/`: Navigation sidebar, header, breadcrumbs, and responsive shell.
- `src/components/charts/`: Recharts wrappers (`CohortRetentionHeatmap`, `RevenueTrendChart`, `RfmScatterPlot`, `FunnelBarChart`).
- `src/views/`: Primary page views (`Overview`, `Customer360`, `ChurnSimulator`, `RetentionPlanner`, `MarketingFunnel`).

## 3. Interactive What-If Simulator Patterns

- Use controlled range sliders for input features (e.g., delivery delay delta, review score adjustment).
- Debounce API calls (300ms) to `POST /api/predictions/churn/simulate` when user moves sliders.
- Visually highlight delta badges ($\Delta P(\text{Churn})$, $\Delta \text{Revenue at Risk}$) with smooth CSS transitions.
