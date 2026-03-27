(function () {
  "use strict";

  // ── Constants ──────────────────────────────────────────────
  const CATEGORIES = ["liquid", "fruit", "crunch", "oomph"];
  const CYCLE_INTERVAL_MS = 80;           // emoji swap speed while spinning
  const STAGGER_DELAY_MS = 400;           // delay between each reel landing
  const BASE_SPIN_DURATION_MS = 1200;     // how long the first reel spins

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
  let emojiPools = { liquid: [], fruit: [], crunch: [], oomph: [] };
  let lastRecipeIndex = -1;
  let spinning = false;

  // ── Load recipes.json ──────────────────────────────────────
  async function loadRecipes() {
    try {
      const res = await fetch("recipes.json");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      recipes = data.recipes;
      buildEmojiPools();
    } catch (err) {
      console.error("Failed to load recipes:", err);
      spinBtn.textContent = "⚠️ Recipe data unavailable";
      spinBtn.disabled = true;
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
    recipeCard.innerHTML = "";

    // Pick the winning recipe
    const chosenIndex = pickRecipeIndex();
    const recipe = recipes[chosenIndex];

    // Start all reels spinning simultaneously
    const intervals = {};
    CATEGORIES.forEach((cat) => {
      reelWindows[cat].classList.remove("landed");
      reelWindows[cat].classList.add("spinning");

      let pool = emojiPools[cat];
      let i = 0;
      intervals[cat] = setInterval(() => {
        i = (i + 1) % pool.length;
        reelEmojis[cat].textContent = pool[i];
      }, CYCLE_INTERVAL_MS);
    });

    // Staggered landing: Liquid → Fruit → Crunch → Oomph
    CATEGORIES.forEach((cat, catIdx) => {
      const landTime = BASE_SPIN_DURATION_MS + catIdx * STAGGER_DELAY_MS;

      setTimeout(() => {
        clearInterval(intervals[cat]);

        // Land on the hero emoji (first ingredient) of the selected recipe
        const heroEmoji = recipe[cat][0].emoji;
        reelEmojis[cat].textContent = heroEmoji;

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

  // ── Render recipe card (minimal for US-1, expanded in US-2) ─
  function renderRecipeCard(recipe) {
    recipeCard.innerHTML = `<h2 style="text-align:center;color:var(--accent);margin-bottom:0.25rem;">${recipe.name}</h2>`;
    recipeCard.classList.remove("hidden");
  }

  // ── Init ───────────────────────────────────────────────────
  spinBtn.addEventListener("click", spin);
  loadRecipes();
})();

