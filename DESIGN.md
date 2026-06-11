---
name: Puearillの主页
description: A personal universe rendered in deep indigo cosmos — firefly sparks of warm gold light carve identity out of the dark.
colors:
  cosmos: oklch(0.22 0.08 278)
  cosmos-deep: oklch(0.16 0.05 280)
  surface: oklch(0.28 0.05 278)
  surface-high: oklch(0.34 0.04 276)
  starlight: oklch(0.93 0.003 280)
  stardust: oklch(0.73 0.006 278)
  nebula: oklch(0.55 0.012 280)
  void: oklch(0.30 0.03 280)
  void-subtle: oklch(0.25 0.02 280)
  firefly: oklch(0.78 0.17 90)
  firefly-glow: oklch(0.85 0.15 88)
  firefly-pale: oklch(0.28 0.06 88)
  cosmos-flare: oklch(0.55 0.20 320)
typography:
  display:
    fontFamily: "'Zen Kaku Gothic New', sans-serif"
    fontSize: "clamp(2.6rem, 7vw, 4.2rem)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Zen Kaku Gothic New', sans-serif"
    fontSize: "1.6rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "normal"
  title:
    fontFamily: "'Zen Kaku Gothic New', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "normal"
  body:
    fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0.01em"
  label:
    fontFamily: "'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "48px"
  xxl: "72px"
components:
  button-primary:
    backgroundColor: "{colors.firefly}"
    textColor: "{colors.cosmos-deep}"
    rounded: "{rounded.full}"
    padding: "10px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.firefly-glow}"
    textColor: "{colors.cosmos-deep}"
    rounded: "{rounded.full}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.stardust}"
    rounded: "{rounded.full}"
    padding: "8px 18px"
  button-ghost-hover:
    backgroundColor: "{colors.firefly-pale}"
    textColor: "{colors.firefly}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.nebula}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  nav-link-active:
    backgroundColor: "{colors.firefly}"
    textColor: "{colors.cosmos-deep}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.starlight}"
    rounded: "{rounded.lg}"
    padding: "24px"
  chip:
    backgroundColor: "{colors.firefly-pale}"
    textColor: "{colors.firefly}"
    rounded: "{rounded.full}"
    padding: "3px 12px"
---

# Design System: Puearillの主页

## 1. Overview

**Creative North Star: "Deep Cosmos, Firefly Sparks"**

A personal universe rendered as deep indigo space. The page feels dimensional — like looking into a night sky where points of warm gold light mark what matters. Surfaces are layers of cosmic depth, each card a slightly lighter stratum floating above the void. Firefly accents (warm gold, ≤10% of any surface) are the only warmth in the system; they draw the eye exactly where it needs to go.

This is a personal homepage that builds atmosphere through depth and light rather than decoration. The aesthetic draws from anime opening-sequence cinematography (deep space backgrounds, lens flares, particles of light), cyber interface design (precise geometry, deliberate typography), and the quiet wonder of fireflies in darkness.

What this system explicitly rejects: corporate SaaS restraint (white backgrounds, single accent, feature grids), social-media profile disposability (Linktree templates, no depth), generic developer portfolios (terminal aesthetics, monospace-default), minimalist/brutalist personal sites (deliberately un-designed), and flat/material design blogs (no dimensionality, no atmosphere).

**Key Characteristics:**
- Dark-first with a cool-tinted light mode — the cosmos metaphor inverts but the depth remains
- Deep indigo background as the foundational space; surfaces lift as lighter strata
- Firefly gold accent at ≤10% — warm sparks against the cool cosmos
- Geometric Japanese sans display (Zen Kaku Gothic New) — precise, architectural, space-station signage
- Glow-forward depth: firefly halos, not drop shadows, carry elevation
- Choreographed motion: staggered reveals, parallax depth, floating particles
- Opaque-by-default surfaces: cards are solid, not translucent

## 2. Colors

A committed palette built around deep indigo cosmos with firefly gold sparks. One dominant hue (indigo, 278-280°) carries 50-60% of every surface; the firefly accent (gold, 85-95°) occupies ≤10% and marks interactive elements. A secondary violet flare (320°) bridges gradients and adds nebula-like depth at the edges.

### Primary
- **Firefly** (oklch(0.78 0.17 90)): The voice of interactivity. Buttons, active nav links, links, progress bars, focus rings, stat numbers. The warmest point on the page — use it where you want someone to act. Carries the primary glow halo.
- **Cosmos Flare** (oklch(0.55 0.20 320)): The voice of transition. Gradient midpoints, decorative overlays, the secondary glow. A violet nebula that bridges the indigo ground and the firefly accent.

### Neutral (Dark Mode — the primary mode)
- **Cosmos** (oklch(0.22 0.08 278)): Page background. Deep indigo — the color of space between stars. The foundational dark.
- **Cosmos Deep** (oklch(0.16 0.05 280)): Deeper void. Hero drench backgrounds, footer, lightbox overlay. The deepest layer.
- **Surface** (oklch(0.28 0.05 278)): Card and elevated container background. Slightly lifted from Cosmos so surfaces separate.
- **Surface High** (oklch(0.34 0.04 276)): Higher elevation. Hover state for cards, modal backgrounds.
- **Starlight** (oklch(0.93 0.003 280)): Primary text. Near-white with a cool indigo tint.
- **Stardust** (oklch(0.73 0.006 278)): Secondary text, placeholders, metadata.
- **Nebula** (oklch(0.55 0.012 280)): Tertiary text, muted labels, disabled states.
- **Void** (oklch(0.30 0.03 280)): Borders, dividers, progress bar tracks.
- **Void Subtle** (oklch(0.25 0.02 280)): Subtle borders, inset separators.
- **Firefly Pale** (oklch(0.28 0.06 88)): Firefly-tinted background for chips, hover states, accent surfaces.

### Neutral (Light Mode)
- **Cosmos** (oklch(0.96 0.008 272)): Page background. Cool near-white with violet tint — not cream, not warm.
- **Cosmos Deep** (oklch(0.88 0.04 275)): Hero and footer backgrounds. Visible indigo presence.
- **Surface** (oklch(0.99 0.002 270)): Card and container background.
- **Surface High** (oklch(1 0 0)): Pure white elevated surfaces.
- **Starlight** (oklch(0.15 0.018 280)): Primary text. Deep indigo ink on light.
- **Stardust** (oklch(0.35 0.025 280)): Secondary text.
- **Nebula** (oklch(0.50 0.018 280)): Tertiary, muted.
- **Void** (oklch(0.82 0.02 275)): Borders, dividers.
- **Void Subtle** (oklch(0.88 0.012 275)): Subtle borders.
- **Firefly** (oklch(0.60 0.19 85)): Primary accent. Adjusted for light backgrounds — deeper gold.
- **Firefly Pale** (oklch(0.92 0.06 85)): Accent-tinted backgrounds.
- **Cosmos Flare** (oklch(0.45 0.22 320)): Secondary accent. Adjusted for light backgrounds.

### Named Rules

**The Committed Cosmos Rule.** Deep indigo carries 50-60% of every surface in dark mode. It is the space; surfaces are strata within it, not independent objects. A surface that loses the indigo undertone reads as disconnected from the cosmos.

**The Firefly at ≤10% Rule.** The firefly gold accent occupies no more than 10% of any given screen. Its rarity is the point — each firefly glow marks something worth attention. A page with firefly splashed everywhere has no focal points.

**The Cool Ground Rule.** The background tint must stay cool — toward indigo (270-280°) in both dark and light modes. No cream, sand, beige, or warm undertones. Warmth comes exclusively from the firefly accent; a warm-tinted background fights the cosmos metaphor and reads as generic AI output.

**The Three-Voice Rule.** All three color voices (cosmos indigo, firefly gold, cosmos-flare violet) must appear on every page. The ratio is roughly 55% indigo / 35% gold / 10% violet — indigo grounds, gold marks action, violet bridges gradients.

**The No-Glass-Default Rule.** Surfaces are opaque by default. Glass (backdrop-filter blur + transparency) is reserved for the navigation header and music player — deliberate, contextual, not a surface treatment.

**The Glow Inheritance Rule.** Every accent color has a corresponding glow. Firefly glows belong to firefly elements; violet glows to violet elements. Never mix — a violet glow on a gold button reads as a CSS bug.

## 3. Typography

**Display Font:** Zen Kaku Gothic New (sans-serif fallback)
**Body Font:** Noto Sans SC (with PingFang SC, Microsoft YaHei, sans-serif fallback)

**Character:** A geometric Japanese sans with precise, architectural letterforms paired with a clean, highly readable Chinese sans body. The display font feels deliberate and futuristic — signage on a space station, not a calligraphy scroll. The body font is the workhorse that handles Chinese text at all sizes without fatigue. One deliberate pairing on a single contrast axis (geometric display + humanist body), not two similar faces competing.

### Hierarchy
- **Display** (800, clamp(2.6rem, 7vw, 4.2rem), 1.05, -0.02em): Hero name, article detail titles. The single largest element on any page. Appears once per viewport. Solid Starlight color with a firefly text-shadow glow on dark backgrounds.
- **Headline** (700, 1.6rem, 1.25): Section headers (项目, 文章, 照片墙, 音乐, 说说, 关于). Set in the display font for continuity. Paired with emoji icons as section markers.
- **Title** (600, 1.25rem, 1.35): Card titles, carousel item headings, player song title. Set in the display font.
- **Body** (400, 1rem, 1.65, 0.01em, max 72ch): Prose, descriptions, article content, comments. The workhorse. Extra line-height and letter-spacing compensate for light-on-dark reading (dark-first design). Stardust for secondary; Starlight for primary content.
- **Label** (500, 0.8rem, 1.4, 0.02em): Stat labels, timestamps, metadata, tag text, button text. Slightly tracked for clarity at small sizes.

### Named Rules

**The Scale Jump Rule.** Adjacent hierarchy steps must differ by ≥1.25× in font size. The Display→Headline jump is the most dramatic (1.6× at clamp midpoint); Headline→Title is 1.45×; Title→Body is 1.1× (minimum). No flat scales.

**The No-Gradient-Text Rule.** Gradient text (`background-clip: text` combined with a gradient background) is prohibited everywhere. No exceptions. Use a single solid Starlight color for all text. Emphasis comes from weight, size, and firefly text-shadow glow — not from gradient fills.

**The Geometric Restraint Rule.** Zen Kaku Gothic New is used for Display, Headline, and Title levels only. Body copy stays in Noto Sans SC. The geometric display face in body copy reads as cold and mechanical; the humanist body face in headlines reads as uncommitted.

## 4. Elevation

Glow-forward, flat at rest. Surfaces are opaque and co-planar by default — cards, sections, and the page background sit on the same plane. Depth is signaled by colored glow halos that intensify on interaction, not by drop shadows.

The system uses one structural shadow (the fixed nav header) and firefly glow halos for everything else. The nav shadow is functional (it separates the fixed element from scrolling content); the glows are expressive (they mark what matters and reward interaction). The dark-first palette makes glow the natural depth language — light blooms against the void in a way shadows never could.

**The antigravity rule:** elements lift toward the viewer on hover via `translateY(-2px)` to `translateY(-6px)`, paired with an intensified firefly glow. The lift is small (never more than 6px) and the glow does the heavy lifting. An element that lifts without glowing feels broken; an element that glows without lifting is decorative.

### Shadow Vocabulary
- **nav-ambient** (`0 4px 32px rgba(0, 0, 0, 0.35)`): The only structural shadow. Used exclusively on the fixed header in dark mode. Light mode adds an inset highlight.
- **card-hover-glow** (`0 0 20px oklch(0.78 0.17 90 / 0.25), 0 0 60px oklch(0.78 0.17 90 / 0.10)`): Applied to cards on hover alongside the lift transform. The tight glow is the primary cue; the spread glow is the atmosphere.
- **firefly-focus** (`0 0 0 3px oklch(0.78 0.17 90 / 0.35)`): Focus ring for interactive elements.

### Named Rules

**The Flat-At-Rest Rule.** Surfaces carry no shadow in their default state. The nav header is the sole exception — and only because it's fixed-position. If a card has a drop shadow at rest, the shadow is wrong. Use firefly glow on interaction, not shadow at rest.

**The Glow-Not-Shadow Rule.** Every hover/focus lift must be accompanied by a firefly-colored glow. The glow color matches the nearest accent element — firefly for primary actions and cards, cosmos-flare for decorative transitions.

**The Light-Mode Shadow Rule.** Light mode surfaces may carry a subtle shadow at rest (`0 1px 4px oklch(0.15 0.015 280 / 0.08)`) because glow doesn't read against a light background. The shadow is ambient and minimal — never dark or heavy.

## 5. Components

### Buttons

Tactile and responsive. Buttons feel powered-on: they glow on hover, lift slightly, and transition fast (150-200ms). Never dormant gray.

- **Shape:** Fully rounded pills (`border-radius: 9999px`). The pill shape is consistent across all button variants — the site's interactive signature.
- **Primary:** Firefly gold background, Cosmos Deep text, 10px 24px padding. On hover: background shifts to Firefly Glow (brighter), lifts 2px, gains a firefly glow halo. The brightness-shift makes the button feel like it's illuminating.
- **Ghost:** Transparent background, Stardust text, 1px Void border. On hover: background fills with Firefly Pale (10% tint), text shifts to Firefly, border becomes Firefly. Used for secondary actions, back buttons.
- **Icon:** 36-42px circles with transparent background. On hover: background fills with Firefly, icon color shifts to Cosmos Deep, scale 1.1. Theme toggle, player controls, hamburger.
- **Submit (comment):** Firefly background with Cosmos Flare gradient accent on the right edge, Cosmos Deep text, 10px 18px padding. On hover: lifts 2px, gains firefly glow. The gradient signals "send."
- **Back:** Ghost variant with left arrow. Stardust text, 1px Void border. On hover: border shifts to Firefly, text shifts to Firefly.

### Navigation

Fixed header at 56px height, glass surface (backdrop-filter blur), pill-shaped links.

- **Default:** Nebula text on transparent background. Subtle, receding.
- **Hover:** Text shifts to Cosmos Deep, background fills with Firefly. Lift 1px.
- **Active:** Same as hover but persistent — the current section always glows.
- **Mobile:** Full overlay with glass background. Links are larger (1.2rem, 12px 24px padding) for touch targets. Same active/hover treatment.

### Cards

Opaque Surface containers with 16px radius and 24px internal padding. No shadow at rest in dark mode; subtle ambient shadow in light mode.

- **Hover:** Lifts 6px, gains a firefly glow border (2px, 30% opacity) and a diffuse firefly halo (`0 0 60px` at 15% opacity). The card also scales 1.01 — a micro-expansion that makes it feel responsive.
- **Home blocks:** Variant with a 3px gradient top-edge accent (firefly → cosmos-flare). The accent bar is full-width, not a side stripe — it reads as a header, not a decorative border.
- **Carousel cards:** 260px square cards inside horizontal scrolling tracks. Image-top layout with title + description below. Compact padding (16px).
- **Hover (light mode):** Lift 6px, border shifts to Firefly, shadow intensifies.

### Chips / Tags

Small pill labels for project tags and content metadata.

- **Shape:** Fully rounded (9999px), 3px 12px padding, 0.75rem font size.
- **Style:** Firefly Pale background (12% opacity on dark, 6% on light), Firefly text, 1px Firefly border at 30% opacity. Subtle firefly glow at rest (`0 0 8px` at 15%).
- **Hover:** Background intensifies to 20% Firefly Pale. No transform — chips are decorative, not interactive.

### Inputs / Search

Borderless inputs inside glass-wrapper containers. The wrapper provides the visual boundary; the input itself is invisible chrome.

- **Wrapper:** Surface background, 1px Void border, full radius (9999px), 6-16px horizontal padding.
- **Input:** Transparent background, no border, 0.95rem body font, Nebula placeholder text. Focus: the wrapper's border intensifies to Firefly, and a subtle firefly focus ring appears (`0 0 0 3px` at 35%).
- **Search icon:** Positioned inside the wrapper, Nebula opacity. Decorative, not interactive.

### Player

The music player is the signature component — a self-contained interactive surface for audio playback with integrated lyrics.

- **Layout:** Two-column grid (1fr 300px). Main player + lyrics on the left; playlist sidebar on the right.
- **Cover art:** 150px rounded rectangle with a firefly→cosmos-flare gradient fallback. On hover: scale 1.08, intensified glow.
- **Progress bar:** 5px height, full radius, Void track with firefly→cosmos-flare→firefly gradient fill. Firefly glow on the fill.
- **Controls:** 42px icon circles. Play button is larger (54px) with firefly fill. On hover: background shifts to Firefly Glow.
- **Lyrics:** Scrollable container with 240px max-height, 3px firefly left edge accent (this is a functional reading-position marker, not a decorative side stripe). Active line: Firefly, 600 weight, 1rem. Inactive: Nebula, 0.9rem. Smooth 0.5s line transition.
- **Volume:** Range input with firefly accent-color, 100px width.
- **Home player (compact):** 220px wide on the hero gradient. Translucent glass surface over the drenched hero. 92px circular cover art. Simplified controls.

### Comments

Conversation items with GitHub avatars, threaded under music and about sections.

- **Comment item:** 14px padding, Surface background (one of the few non-glass surfaces in the comments area — structural social content).
- **Avatar:** 36px circle, border-radius 50%.
- **Author tag:** Firefly pill (firefly bg, cosmos-deep text), 0.7rem, 1px 6px padding. Marks the site owner's comments.
- **Input:** Textarea with Surface background, 1px Void border, 10px radius. Focus: border shifts to Firefly, subtle firefly glow.

### Hero

The hero is drenched in cosmos-deep gradient, not a neutral container. It's the deepest point on the page — the void from which everything else lifts.

- **Background:** A 160° gradient from Cosmos Deep through Cosmos to a Cosmos Flare hint at the edges. The gradient creates a dimensional bowl — the center is slightly lighter, drawing the eye inward.
- **Avatar:** 130px circle with semi-transparent white border. On hover: border intensifies, scale 1.04.
- **Title:** Zen Kaku Gothic New Display, white, with a firefly text-shadow glow. A thin white rule (64px, 4px) separates title from subtitle.
- **Subtitle:** Semi-transparent white, max 480px, text-wrap: balance.
- **Home player:** Glass surface overlay on the hero gradient. Backdrop-filter blur. Translucent white border.

### Section Headers

Section titles with emoji icons and a left-edge gradient accent bar.

- **Structure:** Display font, 1.6rem, Starlight/ink color. 20px left padding.
- **Accent bar:** 4px wide, 28px tall, left-edge gradient (firefly → cosmos-flare). Positioned absolutely at left: 0. This is a section marker, not a decorative side stripe — it anchors the heading label.

### Photo Grid

Masonry layout for the photo gallery — not a uniform card grid.

- **Layout:** CSS columns (3 columns, 20px gap). Items are break-inside: avoid.
- **Item:** Surface background, 10px radius, overflow hidden. On hover: scale 1.03.
- **Caption:** 0.8rem Nebula text, 8px 12px padding, Surface background.
- **Lightbox:** Full-screen Cosmos Deep overlay (94% opacity) with backdrop-filter blur. Image max 90vw × 85vh with rounded corners. Close button at top-right.

### Moments Feed

Vertical chronological feed — distinct from the card grid layout used by projects and articles.

- **Item:** Surface background, 16px radius, 20px padding. Timeline-style layout with a left-edge firefly dot marker.
- **Metadata:** Label style, Nebula color, timestamps.

## 6. Do's and Don'ts

### Do:
- **Do** lead with Firefly for interactive elements — it's the action color. Buttons, links, focus rings, progress indicators.
- **Do** use all three color voices (cosmos indigo, firefly gold, cosmos-flare violet) on every page. The ratio is roughly 55% / 35% / 10%.
- **Do** pair every hover lift with a firefly-colored glow. Lift without glow feels broken; glow without lift is decorative.
- **Do** keep surfaces opaque by default. Glass is for the nav header and music player only.
- **Do** use the geometric display font (Zen Kaku Gothic New) for Display, Headline, and Title levels only — no body copy in the display face.
- **Do** maintain ≥4.5:1 contrast for all body text against its background.
- **Do** respect `prefers-reduced-motion` — replace lift+glow transforms with instant opacity crossfades, and collapse choreographed sequences into instant reveals.
- **Do** vary section layouts. Projects and articles use card grids; photos use masonry; music uses a split layout; moments use a vertical feed; about uses a narrative layout.
- **Do** let the hero be the deepest point on the page — a cosmos-deep gradient bowl that everything else lifts away from.
- **Do** tint the background cool toward indigo (270-280°) in both dark and light modes. The cosmos is cool; warmth is firefly-only.

### Don't:
- **Don't** use gradient text anywhere — no exceptions. Use solid Starlight with firefly text-shadow glow for emphasis.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on cards or list items. Use full-border treatments, background tints, top-edge accent bars, or leading markers.
- **Don't** make every surface glass. If the page reads as "everything is blurry," the effect is dead. Glass is a spice, not a sauce.
- **Don't** tint the background warm. No cream, sand, beige, parchment, or wheat tones. The ground stays cool (toward indigo) so the firefly accent belongs.
- **Don't** ship without motion alternatives. Every animation needs a `@media (prefers-reduced-motion: reduce)` fallback.
- **Don't** use hero-metric templates (big number + small label + gradient accent) as the primary hero structure.
- **Don't** let cards be the default answer for every content type. One card grid repeated across six sections is a template, not a design.
- **Don't** default to monospace for "technical" cred. This site isn't a terminal. The body font is Noto Sans SC.
- **Don't** resemble a corporate SaaS landing page — no white backgrounds with single-accent CTA buttons, no feature grids, no "streamline your workflow" energy.
- **Don't** feel like a social media profile replacement — this isn't Linktree. Content has depth, sections have distinct layouts, and the design has a point of view.
- **Don't** strip away all visual design for minimalism's sake — this is an atmospheric, dimensional space, not a brutalist text document.
- **Don't** flatten the depth — no flat design, no material-design card stacks without atmosphere. The cosmos has dimensionality.
- **Don't** use terminal/CLI aesthetics — green-on-black, monospace-only, command-line nostalgia. This is a personal universe, not a shell prompt.
