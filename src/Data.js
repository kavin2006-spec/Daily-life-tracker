// ── Ingredients ───────────────────────────────────────────────────────────────
// cal and protein are per 100g
export const INGREDIENTS = [];

// ── Recipes ───────────────────────────────────────────────────────────────────
// Each ingredient entry: { ingredientId, grams }
// baseGrams = total grams of the recipe as written
// (calories and protein are calculated dynamically from ingredients)
export const RECIPES = []
// ── Workouts ──────────────────────────────────────────────────────────────────
export const WORKOUTS = [];

// ── Helper: calculate calories + protein for a recipe given actual grams eaten ──
// ingredients = the INGREDIENTS array
// recipe = one recipe object
// gramsEaten = how many grams the user actually ate (defaults to recipe.baseGrams)
export function calcRecipeNutrition(ingredients, recipe, gramsEaten) {
  const base = recipe.baseGrams;
  const ratio = gramsEaten / base;
  let cal = 0;
  let protein = 0;
  recipe.ingredients.forEach(({ ingredientId, grams }) => {
    const ing = ingredients.find((i) => i.id === ingredientId);
    if (!ing) return;
    const scaledGrams = grams * ratio;
    cal     += (ing.cal100     / 100) * scaledGrams;
    protein += (ing.protein100 / 100) * scaledGrams;
  });
  return { cal: Math.round(cal), protein: Math.round(protein * 10) / 10 };
}