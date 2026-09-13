# UI/UX Pro Max Skill Setup & Usage Guide for Mercury-Web

This guide explains how the **UI/UX Pro Max Skill** ([nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)) is configured, structured, and utilized within **Mercury-Web** to deliver executive-grade design intelligence.

---

## 1. Overview & Capabilities

UI/UX Pro Max is an AI-powered design intelligence engine bundled directly into your Antigravity workspace. It provides searchable local design datasets and reasoning scripts covering:
- **79 UI Styles** (Dark Mode OLED, Glassmorphism, Data-Dense Dashboard, Soft UI, Minimalist, etc.)
- **192 Product Color Palettes & Reasoning Profiles**
- **74 Typography & Google Font Pairings**
- **119 UX Guidelines & Interaction Heuristics**
- **25 Data Visualization & Chart Types** with accessibility guidelines
- **17 Micro-Animation & GSAP Presets**
- **22 Frontend Stacks** (including deep React & Tailwind best practices)

---

## 2. Installation & Setup (Best Practice: Global Setup)

### 2.1 Global Machine Installation (Active)
To prevent committing 175+ third-party vendor files (~5 MB) into your Git repository, UI/UX Pro Max is installed globally on your machine:

```bash
# Installed globally for Antigravity:
npx -y ui-ux-pro-max-cli init --ai antigravity --global
```

- **Installed Directory**: `~/.agents/skills/`
- **Antigravity Customization Root Link**: Symlinked to `~/.gemini/config/skills/`
- **Result**: Antigravity automatically detects and activates UI/UX Pro Max in **Mercury-Web** and every other project you open on this Mac, while your repository stays lightweight and clean.

### 2.2 Repository Cleanliness & `.gitignore`
In the project `.gitignore`, vendor skill directories are ignored while your custom Mercury skills remain tracked:
```gitignore
# Third-party / Vendor AI skills (installed globally in ~/.agents/skills or ~/.gemini/config/skills)
.agents/skills/ui-ux-pro-max/
.agents/skills/design-system/
.agents/skills/design/
.agents/skills/ui-styling/
.agents/skills/brand/
.agents/skills/slides/
.agents/skills/banner-design/
```

Only project-specific skills remain committed in `.agents/skills/`:
- `mercury-api-client`: 40-endpoint typed API consumption patterns.
- `mercury-ui`: Project-specific dark glassmorphic design system tokens.

---

## 3. How to Use the Skill

### 3.1 Automatic Activation in Antigravity
Because the skill is registered in `.agents/skills/ui-ux-pro-max/SKILL.md`, **Antigravity automatically discovers and activates this skill** whenever you ask to:
- Design a new page or dashboard view.
- Build or refine React components (`Card`, `Modal`, `Slider`, `MetricCard`).
- Select colors, typography, or contrast-accessible palettes.
- Pick optimal chart types for metrics (e.g. churn predictions, cohort decay).
- Review and audit interfaces for accessibility and micro-interactions.

### 3.2 CLI Search & Generator Commands
The skill includes a zero-dependency Python 3 search engine (`.agents/skills/ui-ux-pro-max/scripts/search.py`) that runs locally without external network requests:

#### 1. Generate a Complete Design System Recommendation
```bash
# Generates a tailored data-dense executive dashboard design system
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "executive customer intelligence analytics dark mode" --design-system -p "Mercury Web" --density 9
```

#### 2. Search for Optimal Data Visualization Charts
```bash
# Identifies best chart types for churn retention and confidence intervals
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "churn prediction retention analytics" --domain chart
```

#### 3. Search for Color Palettes & Contrast Rules
```bash
# Queries color palettes for fintech and risk analytics
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "fintech risk analytics" --domain color
```

#### 4. Search for Stack-Specific Best Practices (React)
```bash
# Queries React performance, re-render avoidance, and state tips
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "dashboard performance" --stack react
```

#### 5. Search for UX Heuristics & Component Interaction
```bash
# Queries modal and drawer accessibility guidelines
python3 .agents/skills/ui-ux-pro-max/scripts/search.py "modal drawer accessibility" --domain ux
```

---

## 4. Synergy with Mercury-Web Design Guidelines

UI/UX Pro Max directly enforces the visual standards specified in `AGENTS.md` and `docs/design_system.md`:
- **Dark Glassmorphism**: Tailored to high-density executive analytics with deep canvas (`#0b0f19`) and frosted blur panels.
- **Lucide Icons**: Mandates SVG iconography over emojis.
- **Interactive Micro-Transitions**: 150–300ms smooth hover elevations, debounced counterfactual sliders, and visible focus rings.
- **Accessibility & Contrast**: 4.5:1 minimum text contrast, keyboard navigation, and `prefers-reduced-motion` compliance.

---

## 5. Maintenance & Updates

To update the skill to future upstream releases:
```bash
npx -y ui-ux-pro-max-cli update
```

To view installed versions:
```bash
npx -y ui-ux-pro-max-cli versions
```
