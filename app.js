(function () {
  "use strict";

  // ── Constants ──────────────────────────────────────────────
  const CATEGORIES = ["liquid", "fruit", "crunch", "oomph"];
  const CYCLE_INTERVAL_MS = 80;           // emoji swap speed while spinning
  const STAGGER_DELAY_MS = 400;           // delay between each reel landing
  const BASE_SPIN_DURATION_MS = 1200;     // how long the first reel spins
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── DOM refs ───────────────────────────────────────────────
  const spinBtn = document.getElementById("spin-btn");
  const recipeCard = document.getElementById("recipe-card");
  const reelWindows = {};
  const reelEmojis = {};

  CATEGORIES.forEach((cat) => {
    reelWindows[cat] = document.getElementById(`reel-${cat}`);
    reelEmojis[cat] = reelWindows[cat].querySelector(".reel__emoji");
  });

  // ── State ──────────────────────────────────────────────────
  let recipes = [];
  const emojiPools = { liquid: [], fruit: [], crunch: [], oomph: [] };
  let lastRecipeIndex = -1;
  let spinning = false;

  // ── Load recipes.json ──────────────────────────────────────
  async function loadRecipes() {
    try {
      const res = await fetch("recipes.json");
      if (!res.ok) {
        console.error("Failed to load recipes: HTTP", res.status);
        spinBtn.textContent = "⚠️ Recipe data unavailable";
        return;
      }
      const data = await res.json();
      recipes = data.recipes;
      buildEmojiPools();
      spinBtn.disabled = false;
    } catch (err) {
      console.error("Failed to load recipes:", err);
      spinBtn.textContent = "⚠️ Recipe data unavailable";
    }
  }

  /**
   * Build a unique set of emoji per category so the reels cycle through
   * all possible ingredient emoji across every recipe.
   */
  function buildEmojiPools() {
    CATEGORIES.forEach((cat) => {
      const seen = new Set();
      recipes.forEach((recipe) => {
        recipe[cat].forEach((ingredient) => {
          if (!seen.has(ingredient.emoji)) {
            seen.add(ingredient.emoji);
            emojiPools[cat].push(ingredient.emoji);
          }
        });
      });
    });
  }

  // ── Random recipe selection (no immediate repeat) ──────────
  function pickRecipeIndex() {
    if (recipes.length <= 1) return 0;
    let idx;
    do {
      idx = Math.floor(Math.random() * recipes.length);
    } while (idx === lastRecipeIndex);
    lastRecipeIndex = idx;
    return idx;
  }

  // ── Spin logic ─────────────────────────────────────────────
  function spin() {
    if (spinning || recipes.length === 0) return;
    spinning = true;
    spinBtn.disabled = true;

    // Hide previous recipe card
    recipeCard.classList.add("hidden");
    recipeCard.textContent = "";

    // Pick the winning recipe
    const recipe = recipes[pickRecipeIndex()];

    // Start all reels spinning simultaneously
    const intervals = {};
    const cycleMs = prefersReducedMotion ? 150 : CYCLE_INTERVAL_MS;
    const baseMs = prefersReducedMotion ? 300 : BASE_SPIN_DURATION_MS;
    const staggerMs = prefersReducedMotion ? 100 : STAGGER_DELAY_MS;

    CATEGORIES.forEach((cat) => {
      reelWindows[cat].classList.remove("landed");
      reelWindows[cat].classList.add("spinning");

      const pool = emojiPools[cat];
      let i = 0;
      intervals[cat] = setInterval(() => {
        i = (i + 1) % pool.length;
        reelEmojis[cat].textContent = pool[i];
      }, cycleMs);
    });

    // Staggered landing: Liquid → Fruit → Crunch → Oomph
    CATEGORIES.forEach((cat, catIdx) => {
      const landTime = baseMs + catIdx * staggerMs;

      setTimeout(() => {
        clearInterval(intervals[cat]);

        // Land on the hero emoji (first ingredient) of the selected recipe
        reelEmojis[cat].textContent = recipe[cat][0].emoji;

        reelWindows[cat].classList.remove("spinning");
        reelWindows[cat].classList.add("landed");

        // After last reel lands → reveal recipe card & re-enable button
        if (catIdx === CATEGORIES.length - 1) {
          setTimeout(() => {
            renderRecipeCard(recipe);
            spinning = false;
            spinBtn.disabled = false;
          }, 200);
        }
      }, landTime);
    });
  }

  // ── Render recipe card (US-2) ──────────────────────────────
  function renderRecipeCard(recipe) {
    const categoryLabels = {
      liquid: "Liquid",
      fruit: "Fruit",
      crunch: "Crunch",
      oomph: "Oomph",
    };

    recipeCard.textContent = "";

    const title = document.createElement("h2");
    title.className = "recipe-card__title";
    title.textContent = recipe.name;
    recipeCard.appendChild(title);

    const grid = document.createElement("div");
    grid.className = "recipe-card__categories";

    CATEGORIES.forEach((cat) => {
      const section = document.createElement("div");
      section.className = "recipe-card__category";

      const heading = document.createElement("h3");
      heading.className = "recipe-card__category-title";
      heading.textContent = categoryLabels[cat];
      section.appendChild(heading);

      const list = document.createElement("ul");
      list.className = "recipe-card__ingredient-list";

      recipe[cat].forEach((ing) => {
        const li = document.createElement("li");
        li.className = "recipe-card__ingredient";

        const emojiSpan = document.createElement("span");
        emojiSpan.className = "recipe-card__ingredient-emoji";
        emojiSpan.textContent = ing.emoji;

        li.appendChild(emojiSpan);
        li.appendChild(document.createTextNode(" " + ing.name));
        list.appendChild(li);
      });

      section.appendChild(list);
      grid.appendChild(section);
    });

    recipeCard.appendChild(grid);
    recipeCard.classList.remove("hidden");
  }

  // ── Init ───────────────────────────────────────────────────
  spinBtn.addEventListener("click", spin);
  loadRecipes();
})();

