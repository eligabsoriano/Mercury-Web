# Mercury-Web Design System & Visual Specification

This document defines the visual language, design tokens, typography, glassmorphism parameters, and component styling conventions for **Mercury-Web**.

---

## 1. Design Philosophy: Executive Dark Glassmorphism

Mercury-Web is built for senior leadership and growth teams who need immediate, high-contrast visibility into financial exposure and customer churn dynamics:
- **Depth & Translucency**: Layered frosted glass panels floating above an ultra-dark navy canvas.
- **Accented Hierarchy**: Clean neutral bases with sharp, purposeful neon accents to convey risk and financial magnitude.
- **Micro-Interactions**: Subtle border glow transitions, smooth number counters, debounced slider adjustments, and active tab indicators.

---

## 2. Core HSL Design Tokens (`src/index.css`)

### 2.1 Canvas & Surfaces
| Token Name | HSL Value | Hex Equivalent | Description |
|:---|:---|:---|:---|
| `--bg-canvas` | `hsl(222, 47%, 7%)` | `#0b0f19` | Deep space background canvas |
| `--bg-panel` | `hsla(222, 40%, 12%, 0.75)` | `rgba(18, 25, 43, 0.75)` | Elevated glassmorphic card panel |
| `--bg-panel-hover` | `hsla(222, 40%, 16%, 0.85)` | `rgba(25, 35, 59, 0.85)` | Hover state for interactive cards |
| `--border-subtle` | `hsla(217, 33%, 25%, 0.45)` | `rgba(43, 56, 84, 0.45)` | Card border with subtle specular reflection |
| `--border-accent` | `hsla(263, 70%, 58%, 0.60)` | `rgba(139, 92, 246, 0.60)` | Active focus / simulation glow border |

### 2.2 Analytical Accent Palette
| Accent Role | Token Name | HSL Value | Hex | Meaning & Usage |
|:---|:---|:---|:---|:---|
| **Revenue & Low Risk** | `--accent-emerald` | `hsl(158, 64%, 52%)` | `#34d399` | GMV growth, high save rates, healthy accounts |
| **Churn Risk & Exposure** | `--accent-crimson` | `hsl(354, 70%, 54%)` | `#f43f5e` | High churn risk ($P \ge 0.70$), revenue-at-risk exposure |
| **Predictions & AI** | `--accent-violet` | `hsl(263, 70%, 58%)` | `#8b5cf6` | ML models, counterfactual what-if simulations |
| **Warnings & Sensitivity** | `--accent-amber` | `hsl(38, 92%, 50%)` | `#fbbf24` | Medium churn risk, delivery transit delays |
| **Marketplace Funnel** | `--accent-cyan` | `hsl(199, 89%, 48%)` | `#38bdf8` | MQL acquisition, origin channels, B2B conversion |

### 2.3 Neutral Text Hierarchy
| Token Name | HSL Value | Usage |
|:---|:---|:---|
| `--text-primary` | `hsl(210, 40%, 98%)` | Primary headings, prominent KPI numbers |
| `--text-secondary` | `hsl(215, 20%, 70%)` | Section descriptions, table body text |
| `--text-muted` | `hsl(215, 16%, 48%)` | Column headers, timestamps, helper labels |

---

## 3. Typography & Font Pairing

```text
Display / Numbers : Outfit (Google Fonts) - Bold, Modern, High-Legibility
Body / Data Tables: Inter (Google Fonts) - High-Density Analytical Sans-Serif
```

- **Headings & KPI Values**: `font-family: 'Outfit', sans-serif;`
  - Used for large metrics (`R$ 15.9M`, `18.4%`), card headers, and navigation titles.
  - Weights: `500` (Medium), `600` (SemiBold), `700` (Bold), `800` (ExtraBold).
- **Body & Tabular Data**: `font-family: 'Inter', sans-serif;`
  - Used for high-density customer tables, telemetry logs, and descriptions.
  - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold).

---

## 4. Glassmorphism Styling Formula

```css
.glass-panel {
  background: hsla(222, 40%, 12%, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid hsla(217, 33%, 25%, 0.45);
  border-radius: 12px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-panel:hover {
  border-color: hsla(217, 33%, 38%, 0.6);
  transform: translateY(-1px);
  box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.45);
}
```

---

## 5. Reusable Component Primitives

1. **`GlassCard`**: Fundamental container with backdrop blur, customizable title, subtitle, and action buttons.
2. **`MetricCard`**: Executive KPI card displaying large Outfit value, sparkline delta badge (`+12.4%`), and natural-language takeaway summary.
3. **`RiskTierBadge`**: Color-coded pill (`High Risk`, `Medium Risk`, `Low Risk`) with glow dot indicator.
4. **`SegmentBadge`**: Distinct badge styles for the 11 RFM segments (e.g. emerald for *Champions*, crimson for *Can't Lose Them*).
5. **`ControlledSlider`**: Smooth range slider for counterfactual simulations with real-time value tooltip and before/after delta indicator.
