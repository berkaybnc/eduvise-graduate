---
name: Adaptive Intelligence
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#434654'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#737686'
  outline-variant: '#c3c5d7'
  surface-tint: '#1353d8'
  primary: '#003fb1'
  on-primary: '#ffffff'
  primary-container: '#1a56db'
  on-primary-container: '#d4dcff'
  inverse-primary: '#b5c4ff'
  secondary: '#006a61'
  on-secondary: '#ffffff'
  secondary-container: '#86f2e4'
  on-secondary-container: '#006f66'
  tertiary: '#3231c1'
  on-tertiary: '#ffffff'
  tertiary-container: '#4c4ed9'
  on-tertiary-container: '#dbdaff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b5c4ff'
  on-primary-fixed: '#00174d'
  on-primary-fixed-variant: '#003dab'
  secondary-fixed: '#89f5e7'
  secondary-fixed-dim: '#6bd8cb'
  on-secondary-fixed: '#00201d'
  on-secondary-fixed-variant: '#005049'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  sidebar-width: 260px
  max-content-width: 1200px
---

## Brand & Style

The brand personality for this design system is rooted in academic precision and technological sophistication. It targets learners and educators who value efficiency, clarity, and evidence-based progress. 

The aesthetic follows a **Modern/Minimalist** approach, specifically drawing inspiration from the "Linear/Notion" school of design—where utility is the primary driver of beauty. The UI is designed to be "invisible," allowing the educational content and AI-driven insights to remain the focal point. The emotional response is one of calm focus, trust, and structured growth. 

Key stylistic pillars include:
- **Utilitarian Density:** Information is packed efficiently without feeling cluttered, using generous whitespace and clear borders.
- **Subtle Precision:** High attention to detail in strokes, alignment, and micro-typography.
- **Monochromatic Base:** A heavy reliance on neutrals to ensure that the primary brand blue and accent teal feel intentional and high-signal when used.

## Colors

The palette is designed to be functional and cooling, minimizing cognitive load during long study sessions.

- **Primary Blue (#1A56DB):** Used for primary actions, progress indicators, and brand identification. It conveys authority and reliability.
- **Accent Teal (#0D9488):** Specifically reserved for "success" states, AI-driven suggestions, and adaptive milestones. It provides a refreshing contrast to the primary blue.
- **Background & Surfaces:** The system uses a tiered light-gray system. The global background is `#F9FAFB`, while interactive surfaces (cards, modals) are pure `#FFFFFF`.
- **Typography Colors:** Main text uses a dark slate (`#111827`) for maximum legibility, while secondary labels use a muted gray (`#677489`).

## Typography

This design system utilizes **Inter** for all interface elements to ensure maximum readability across varying screen densities. 

- **Weight Strategy:** Use `SemiBold (600)` for headings to create a clear hierarchy against `Regular (400)` body text. `Medium (500)` is reserved for functional labels and buttons to give them enough visual weight without appearing aggressive.
- **Letter Spacing:** Headlines utilize a slight negative tracking (`-0.01em` to `-0.02em`) to provide the "tight" professional look characteristic of high-end SaaS products. 
- **Scale:** The scale is conservative, avoiding overly large display type to maintain the data-focused, tool-like feel of the platform.

## Layout & Spacing

The layout philosophy is based on a **Fixed-Fluid Hybrid** model:
- **Sidebar:** A fixed-width navigation rail at `260px` provides a stable anchor for the application. It uses a slightly darker neutral background to distinguish it from the workspace.
- **Workspace:** A fluid main container with a maximum content width of `1200px` to prevent line lengths from becoming unreadable on ultra-wide monitors.
- **Grid:** A 12-column system is used for dashboard layouts, with `24px` gutters.

Spacing follows a strict 4px baseline. Components should primarily use `16px (md)` for internal padding to maintain a comfortable but dense information environment.

## Elevation & Depth

This design system avoids traditional heavy shadows in favor of **Tonal Layers and Low-Contrast Outlines**:

- **Borders over Shadows:** Depth is primarily communicated through `1px` solid borders using `#E5E7EB`. 
- **The "Elevated" State:** Only use shadows for components that physically float above the interface, such as dropdown menus or modals. These shadows should be extremely diffused: `0px 4px 12px rgba(0, 0, 0, 0.05)`.
- **Surface Nesting:** Use background color shifts to indicate hierarchy. For example, a card (`#FFFFFF`) sitting on the global background (`#F9FAFB`) provides enough contrast to indicate depth without needing a shadow.

## Shapes

The shape language is **Soft and Precise**. 

A corner radius of `0.25rem (4px)` for small elements (inputs, buttons) and `0.5rem (8px)` for larger containers (cards, modals) is standard. This subtle rounding maintains the professional "Notion-like" aesthetic—avoiding the playfulness of fully rounded corners while remaining more approachable than sharp 90-degree angles.

- **Knowledge Graph Nodes:** Use perfect circles to distinguish them from structural UI elements.
- **Quiz Elements:** Selection states use the same 6px-8px rounding to maintain consistency with cards.

## Components

### Sidebar Navigation
The sidebar should use a subtle hierarchy. Active states are indicated by a soft background fill (`#F3F4F6`) and a `2px` vertical primary-blue bar on the left edge. Icons should be stroke-based (2px weight) to match the Inter typeface.

### Data-Heavy Cards
Cards are white with a 1px border. Header areas within cards should have a subtle bottom border to separate titles from content. Use `label-sm` for metadata and "tags" within cards.

### Progress Bars
Progress tracks use a light gray base with the primary blue for the fill. For AI-recommended tracks, the teal accent is used. Bars should be `8px` height with fully rounded ends.

### Knowledge Graph Nodes
Nodes should be stylized as circles with 2px borders. Active nodes use the primary blue fill with white text; secondary or locked nodes use a gray stroke and light gray text. Connection lines should be `1px` dashed slate.

### Quiz Elements
Questions are presented in centered containers. Multiple-choice options are styled as "ghost buttons" (border only) that transition to a soft blue fill and solid blue border upon selection.

### Radar Charts
Used for skill gap analysis. Use a semi-transparent teal fill (`rgba(13, 148, 136, 0.2)`) with a solid teal stroke to highlight the "current state," contrasted against a light gray "target state" polygon.