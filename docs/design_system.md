# Mercury-Web Design System: Liquid Glass & Quantum Refractive Visual Specification

This document defines the bespoke, innovative visual architecture, optical physics formulas, design tokens, typography, and component styling conventions for **Mercury-Web**.

Mercury-Web rejects generic, templated web dashboard conventions (flat cards, gray backgrounds, generic UI kits). Instead, it implements a custom **Apple VisionOS / macOS-inspired Liquid Glass material architecture** tailored specifically to real-time predictive churn simulation and executive customer intelligence.

---

## 1. Visual Innovation Philosophy: Liquid Glass & Living Aurora

Mercury-Web is built for senior leadership and growth teams who need immediate, high-contrast visibility into financial exposure and customer churn dynamics:
- **Optical Refraction over Static Flatness**: Rather than dull gray 10px blurred panels, surfaces simulate real physical glass with a high Gaussian blur (`28px`), a 210% saturation boost (preventing desaturated mud), and a subtle specular rim reflection.
- **Living Bioluminescent Substrate**: Deep underneath the glass panes floats an organic 4-node animated aurora mesh (`aurora-orb-1` through `aurora-orb-4`) emitting gentle, non-distracting bioluminescent pulses in cosmic violet, emerald, and indigo.
- **Semiconductor Risk Crystals**: Rather than standard rounded pills, customer risk classifications are rendered as crystalline facets with pulsing sub-surface light cores.
- **Plasma Energy Controls**: Simulation sliders utilize an illuminated plasma tube track with a multi-layered radiant crystalline thumb, giving interactive counterfactuals a tangible, responsive feel.

---

## 2. Optical Physics & Liquid Glass Formulas

### 2.1 The Liquid Glass Optical Formula
Typical CSS glassmorphism looks flat and cloudy because it only applies basic opacity and low blur. Mercury-Web’s Liquid Glass relies on a three-stage optical stack:

```css
/* Core Liquid Glass Panel */
.liquid-glass {
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.72) 0%,
    rgba(10, 15, 30, 0.82) 100%
  );
  backdrop-filter: blur(28px) saturate(210%) brightness(108%);
  -webkit-backdrop-filter: blur(28px) saturate(210%) brightness(108%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-top-color: rgba(255, 255, 255, 0.22); /* Specular chamfer catch */
  box-shadow: 
    0 16px 40px -8px rgba(0, 0, 0, 0.65),
    inset 0 1px 1px 0 rgba(255, 255, 255, 0.20), /* Top specular rim reflection */
    inset 0 -1px 1px 0 rgba(0, 0, 0, 0.35);      /* Bottom refraction shadow */
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}
```

### 2.2 Specular Chamfer Light Catch
Natural physical glass lenses catch ambient light primarily at their top edges. We apply a specular gradient line (`::before` pseudo-element):
```css
.liquid-glass::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.35) 50%,
    transparent
  );
  pointer-events: none;
}
```

### 2.3 Chromatic Glow Tiers
Panels take on subtle refractive tinting based on analytical context:
- `.liquid-glass-violet`: Counterfactual simulation panels with indigo/violet specular halos.
- `.liquid-glass-emerald`: GMV expansion, Champions, and high-save retention cards.
- `.liquid-glass-crimson`: High churn risk, revenue-at-risk exposure, and critical accounts.
- `.liquid-glass-cyan`: B2B funnel and pipeline health indicators.

---

## 3. Living Ambient Aurora Substrate

Deep beneath the glass surfaces resides a fixed ambient canvas:
```css
.aurora-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  background: radial-gradient(circle at 50% 0%, #0c1222 0%, #060913 100%);
}
```
Four organic light orbs rotate and breathe slowly (30s–45s cycles) with a `110px` Gaussian blur:
- **Orb 1 (Violet)**: Centered top-left (`hsl(263, 70%, 28%)`).
- **Orb 2 (Emerald)**: Anchored bottom-right (`hsl(158, 64%, 20%)`).
- **Orb 3 (Indigo)**: Mid-field atmospheric drift (`hsl(222, 60%, 26%)`).
- **Orb 4 (Cyan)**: Faint top-right accent (`hsl(199, 80%, 20%)`).

---

## 4. Core HSL Design Tokens (`src/index.css`)

### 4.1 Canvas & Surfaces
| Token Name | HSL Value | Hex / RGBA | Description |
|:---|:---|:---|:---|
| `--bg-canvas` | `hsl(222, 47%, 6%)` | `#080c16` | Cosmic void background canvas |
| `--bg-panel` | `hsla(222, 40%, 12%, 0.72)` | `rgba(18, 25, 43, 0.72)` | Liquid glass base surface |
| `--bg-panel-hover` | `hsla(222, 40%, 16%, 0.85)` | `rgba(25, 35, 59, 0.85)` | Hover state for interactive panels |
| `--border-glass` | `rgba(255, 255, 255, 0.12)` | - | Neutral glass panel perimeter |
| `--border-specular`| `rgba(255, 255, 255, 0.22)` | - | Top-edge chamfer light catch |

### 4.2 Analytical Accent Palette
| Accent Role | Token Name | HSL Value | Hex | Meaning & Usage |
|:---|:---|:---|:---|:---|
| **Revenue & Low Risk** | `--accent-emerald` | `hsl(158, 64%, 52%)` | `#34d399` | GMV growth, high save rates, healthy accounts |
| **Churn Risk & Exposure** | `--accent-crimson` | `hsl(354, 70%, 54%)` | `#f43f5e` | High churn risk ($P \ge 0.70$), revenue-at-risk exposure |
| **Predictions & AI** | `--accent-violet` | `hsl(263, 70%, 58%)` | `#8b5cf6` | ML models, counterfactual what-if simulations |
| **Warnings & Sensitivity** | `--accent-amber` | `hsl(38, 92%, 50%)` | `#fbbf24` | Medium churn risk, delivery transit delays |
| **Marketplace Funnel** | `--accent-cyan` | `hsl(199, 89%, 48%)` | `#38bdf8` | MQL acquisition, origin channels, B2B conversion |

### 4.3 Neutral Text Hierarchy
| Token Name | HSL Value | Usage |
|:---|:---|:---|
| `--text-primary` | `hsl(210, 40%, 98%)` | Headings, large KPI values, active states |
| `--text-secondary` | `hsl(215, 20%, 72%)` | Section descriptions, table body text |
| `--text-muted` | `hsl(215, 16%, 50%)` | Column headers, timestamps, helper labels |

---

## 5. Typography & Font Pairing

```text
Display & Metrics : Outfit (Google Fonts) - High-Tech, Crisp, Confident
Analytical & Body : Inter (Google Fonts) - High-Density Mathematical Legibility
```

- **Headings & KPI Values**: `font-family: 'Outfit', sans-serif;`
  - High dynamic range styling: `text-shadow: 0 2px 12px rgba(255,255,255,0.12);`
  - Metric weights: `600` (SemiBold), `700` (Bold), `800` (ExtraBold).
- **Body & Tabular Data**: `font-family: 'Inter', sans-serif;`
  - High density analytical data, data tables, and telemetry streams.
  - Weights: `400` (Regular), `500` (Medium), `600` (SemiBold).

---

## 6. Innovative Component Primitives

1. **`GlassCard`**:
   - Liquid glass container with 28px blur, specular top chamfer, and refractive glow variants (`default`, `violet`, `emerald`, `crimson`, `cyan`).
2. **`MetricCard`**:
   - Executive KPI card with dynamic internal halo lighting, prominent Outfit metric figures, interactive floating delta badges, and contextual natural-language takeaways.
3. **`RiskTierBadge`**:
   - Rendered as an illuminated semiconductor crystal (`crystal-gem`) with a pulsing micro-core dot, ditching generic pill tags.
4. **`SegmentBadge`**:
   - 11 RFM segment crystalline badges with distinct refraction tints (Champions = Emerald, Can't Lose Them = Crimson, Loyal = Violet, etc.).
5. **`ControlledSlider`**:
   - Plasma energy tube track with gradient fills, real-time value tooltip, and radiant crystal knob with multi-layered neon drop-shadows.
6. **`Button`**:
   - Frosted liquid glass interactive tactile button with specular border highlight, glass gleam on hover, and active optical compression.

