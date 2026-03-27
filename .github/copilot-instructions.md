# Oatify — Product Requirements Document

**Version:** 1.0
**Date:** March 27, 2026

---

## 1. Executive Summary

**Problem Statement:** Choosing what to make for overnight oats every morning is a small but repetitive decision that leads to either decision fatigue or falling back on the same recipe. There's no fun, frictionless way to discover and rotate through curated overnight oat recipes.

**Proposed Solution:** Oatify — a single-page static website styled as a slot machine that randomly selects from 10 curated overnight oat recipes. Four emoji reels (Liquid, Fruit, Crunch, Oomph) spin and land on a cohesive recipe, revealing a full ingredient card below.

**Success Criteria:**
- Site loads and is fully interactive in under 2 seconds on a 4G mobile connection.
- All 10 recipes are reachable via the random selection mechanism (uniform distribution).
- Site is fully responsive and usable on screens from 320px (mobile) to 1440px+ (desktop).
- Lighthouse Accessibility score ≥ 90.
- Zero external runtime dependencies (no frameworks, no CDNs, no API calls).

---

## 2. User Experience & Functionality

### User Personas

| Persona | Description |
|---|---|
| **The Overnight Oats Enthusiast** | Someone who meal-preps overnight oats regularly and wants variety without having to browse recipe blogs. Likely accessing the site on their phone in the kitchen. |

### User Stories & Acceptance Criteria

**US-1: Spin the slot machine**
> As a user, I want to press a button to spin the slot machine so that I get a random overnight oats recipe.

- [x] A clearly visible "Spin" button triggers the animation.
- [x] All four reels (Liquid, Fruit, Crunch, Oomph) begin spinning simultaneously.
- [x] Each reel rapidly cycles through emoji from its category's ingredient pool across all recipes.
- [x] Reels land in a staggered sequence (Liquid → Fruit → Crunch → Oomph), each stopping ~0.3–0.5s after the previous.
- [x] The selected recipe is chosen randomly from the 10 available recipes.
- [x] Each reel lands on the hero emoji (first ingredient) for its category from the selected recipe.
- [x] The spin button is disabled during the animation to prevent double-triggers.

**US-2: View the full recipe**
> As a user, I want to see the full recipe after the slots land so that I know all the ingredients I need.

- [x] A recipe card reveals below the slot machine after all reels have landed.
- [x] The recipe card displays the recipe name as a title.
- [x] Ingredients are listed grouped by category (Liquid, Fruit, Crunch, Oomph) with ingredient names.
- [x] No quantities are shown on the recipe card.

**US-3: Understand the base recipe**
> As a user, I want to see a base recipe so that I know the foundational ratio of oats to liquid.

- [ ] A static prep blurb is permanently visible on the page (does not depend on spinning).
- [ ] The blurb states the base recipe: 1:1 ratio of rolled oats to whatever liquid the slot machine selects.
- [ ] The blurb includes sweetener suggestions (honey, date paste, regular sugar, etc.).

**US-4: Be aware of dietary considerations**
> As a user, I want to see a disclaimer so that I'm reminded to account for my own dietary restrictions and allergies.

- [ ] A footer is visible at the bottom of the page.
- [ ] The footer contains a disclaimer stating that recipes are suggestions and users should consider their own dietary restrictions and allergies.

**US-5: Re-spin for a new recipe**
> As a user, I want to spin again after seeing a recipe so that I can get a different suggestion.

- [ ] After the recipe card is revealed, the spin button is re-enabled.
- [ ] Pressing spin again clears the previous recipe card and starts a new spin cycle.
- [ ] Consecutive spins should not return the same recipe (avoid immediate repeats).

### Non-Goals (v1)

- ❌ No user accounts, authentication, or personalization.
- ❌ No backend server or API.
- ❌ No offline/PWA support.
- ❌ No user-editable recipes or localStorage persistence.
- ❌ No independent slot mode (mix-and-match) — deferred to future scope.
- ❌ No quantity/measurement display on recipe cards.
- ❌ No sharing functionality (social, link, etc.).

---

## 3. Technical Specifications

### Architecture Overview

```
┌─────────────────────────────────────┐
│           GitHub Pages              │
│                                     │
│  index.html                         │
│  ├── style.css                      │
│  ├── app.js                         │
│  └── recipes.json                   │
│                                     │
│  Flow:                              │
│  1. Page loads → fetch recipes.json │
│  2. User clicks Spin               │
│  3. JS picks random recipe          │
│  4. JS animates emoji cycling       │
│  5. Reels land (staggered)          │
│  6. Recipe card renders below       │
└─────────────────────────────────────┘
```

**Components:**

| File | Responsibility |
|---|---|
| `index.html` | Page structure: slot machine frame, reel containers, button, prep blurb, footer |
| `style.css` | Warm/breakfast-y theme, slot machine frame styling, reel animation, responsive layout (horizontal → 2×2 grid), recipe card styling |
| `app.js` | Load recipe data, random selection logic (with no-immediate-repeat guard), emoji cycling animation via `setInterval`, staggered landing via `setTimeout`, recipe card DOM rendering |
| `recipes.json` | Array of 10 recipe objects following the agreed schema |

### Recipe Data Schema

```json
{
  "recipes": [
    {
      "name": "string — Recipe display name",
      "liquid": [
        { "name": "string — Ingredient name", "emoji": "string — Single emoji" }
      ],
      "fruit": [
        { "name": "string", "emoji": "string" }
      ],
      "crunch": [
        { "name": "string", "emoji": "string" }
      ],
      "oomph": [
        { "name": "string", "emoji": "string" }
      ]
    }
  ]
}
```

- Each category is an array of 1+ ingredient objects.
- The first ingredient in each category array is the "hero" displayed in the reel.

### Visual Design Specifications

| Element | Spec |
|---|---|
| **Color palette** | Background: oatmeal beige (#F5F0E8 or similar). Accents: honey gold (#D4A84B). Text: warm brown (#5C4033). Reel borders: honey gold. |
| **Slot machine frame** | Rounded container, subtle shadow, warm-toned border. "Oatify" banner at the top of the frame. |
| **Reels** | 4 reel windows side-by-side on desktop (≥768px). 2×2 grid on mobile (<768px). Each reel has a category label above it. |
| **Spin button** | Large, prominent, honey gold background, warm brown text. Disabled state visually distinct (muted/greyed). |
| **Recipe card** | Appears below the machine with a subtle expand/fade-in animation. Recipe name as heading, ingredients listed under category subheadings. |
| **Typography** | Modern sans-serif (system font stack). Playful but legible. |
| **Footer** | Small text, muted color, dietary disclaimer. |

### Integration Points

- **None.** Fully static, zero external dependencies. No APIs, no databases, no authentication.
- Hosted on **GitHub Pages** directly from the repository.

### Security & Privacy

- No user data is collected, stored, or transmitted.
- No cookies, no analytics, no third-party scripts.
- All content is static and served over HTTPS via GitHub Pages.

---

## 4. Risks & Roadmap

### Phased Rollout

| Phase | Scope | Milestone |
|---|---|---|
| **v1.0 — MVP** | 10 curated recipes, linked slot machine, emoji reels, recipe card, prep blurb, disclaimer footer. Full responsive layout. Deployed on GitHub Pages. | Launch |
| **v1.1 — Independent Slot Mode** | Add a toggle to switch between "Curated" (linked) and "Freestyle" (independent) modes. In Freestyle, each reel picks a random ingredient from its category independently across all recipes. | Post-launch |

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Emoji rendering inconsistency across OS/browsers | Medium | Low | Test on macOS Safari, iOS Safari, Chrome, Firefox. Emoji are widely supported; visual differences are cosmetic only. |
| `setInterval` animation jank on low-end mobile devices | Low | Medium | Keep cycling interval reasonable (~80-100ms). Use `requestAnimationFrame` as a fallback if needed. |
| `recipes.json` fetch failure (e.g., CORS, path issues on GitHub Pages) | Low | High (site is non-functional) | Test deployment on GitHub Pages. Alternatively, inline recipe data in `app.js` to eliminate the fetch entirely. |
| Random selection feels "not random" with only 10 recipes (repeats feel frequent) | Medium | Low | Implement no-immediate-repeat logic. With 10 recipes this is sufficient — users won't spin more than a few times per session. |

