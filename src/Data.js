// ── Ingredients ───────────────────────────────────────────────────────────────
// cal and protein are per 100g
export const INGREDIENTS = [
  { id: "ing_milk",       name: "Milk",              cal100: 47,  protein100: 3.4  },
  { id: "ing_egg",        name: "Egg",               cal100: 131, protein100: 11   },
  { id: "ing_bacon",      name: "Bacon",             cal100: 208, protein100: 14   },
  { id: "ing_bread",      name: "Bread",             cal100: 231, protein100: 8    },
  { id: "ing_onion",      name: "Onion",             cal100: 35,  protein100: 1    },
  { id: "ing_chicken",    name: "Chicken",           cal100: 114, protein100: 21   },
  { id: "ing_fish_oil",   name: "Fish (oil)",        cal100: 235, protein100: 20   },
  { id: "ing_fish_water", name: "Fish (water)",      cal100: 113, protein100: 22   },
  { id: "ing_rice",       name: "Rice (cooked)",     cal100: 120, protein100: 2.7  },
  { id: "ing_flatbeans",  name: "Flat beans",        cal100: 22,  protein100: 1.8  },
  { id: "ing_carrots",    name: "Carrots",           cal100: 33,  protein100: 0.8  },
  { id: "ing_mushrooms",  name: "Mushrooms",         cal100: 29,  protein100: 2.5  },
  { id: "ing_cereal",     name: "Cereal",            cal100: 380, protein100: 7    },
  { id: "ing_brownie",    name: "Brownie",           cal100: 451, protein100: 4    },
  { id: "ing_chips",      name: "Chips",             cal100: 507, protein100: 5    },
  { id: "ing_oatbar",     name: "Oat cereal bar",    cal100: 465, protein100: 8    },
  { id: "ing_chocooats",  name: "Choco oats",        cal100: 412, protein100: 10   },
  { id: "ing_banana",     name: "Banana",            cal100: 89,  protein100: 1.1  },
  { id: "ing_moong",      name: "Moong dhal",        cal100: 347, protein100: 24   },
  { id: "ing_chia",       name: "Chia pudding",      cal100: 180, protein100: 6    },
];

// ── Recipes ───────────────────────────────────────────────────────────────────
// Each ingredient entry: { ingredientId, grams }
// baseGrams = total grams of the recipe as written
// (calories and protein are calculated dynamically from ingredients)
export const RECIPES = [
  {
    id: "rec_toast_full",
    name: "Toast + Bacon + Eggs (full)",
    category: "Breakfast",
    baseGrams: 250,
    ingredients: [
      { ingredientId: "ing_bread",  grams: 105 },
      { ingredientId: "ing_bacon",  grams: 52  },
      { ingredientId: "ing_egg",    grams: 116 },
    ],
  },
  {
    id: "rec_toast_small",
    name: "Toast + Bacon + Eggs (small)",
    category: "Breakfast",
    baseGrams: 200,
    ingredients: [
      { ingredientId: "ing_bread",  grams: 70  },
      { ingredientId: "ing_bacon",  grams: 39  },
      { ingredientId: "ing_egg",    grams: 116 },
    ],
  },
  {
    id: "rec_cereal",
    name: "Cereal",
    category: "Breakfast",
    baseGrams: 60,
    ingredients: [
      { ingredientId: "ing_cereal", grams: 60 },
    ],
  },
  {
    id: "rec_chkfry400",
    name: "Chicken fry (400g)",
    category: "Lunch",
    baseGrams: 550,
    ingredients: [
      { ingredientId: "ing_chicken", grams: 400 },
      { ingredientId: "ing_onion",   grams: 100 },
      { ingredientId: "ing_egg",     grams: 58  },
    ],
  },
  {
    id: "rec_chkfry300",
    name: "Chicken fry (300g)",
    category: "Lunch",
    baseGrams: 450,
    ingredients: [
      { ingredientId: "ing_chicken", grams: 300 },
      { ingredientId: "ing_onion",   grams: 100 },
      { ingredientId: "ing_egg",     grams: 58  },
    ],
  },
  {
    id: "rec_chkgravy",
    name: "Chicken gravy + eggs",
    category: "Lunch",
    baseGrams: 600,
    ingredients: [
      { ingredientId: "ing_chicken", grams: 400 },
      { ingredientId: "ing_onion",   grams: 100 },
      { ingredientId: "ing_egg",     grams: 174 },
      { ingredientId: "ing_rice",    grams: 200 },
    ],
  },
  {
    id: "rec_fishoil",
    name: "Fish dish (oil)",
    category: "Lunch",
    baseGrams: 700,
    ingredients: [
      { ingredientId: "ing_fish_oil",  grams: 145 },
      { ingredientId: "ing_onion",     grams: 100 },
      { ingredientId: "ing_carrots",   grams: 100 },
      { ingredientId: "ing_flatbeans", grams: 100 },
      { ingredientId: "ing_egg",       grams: 116 },
      { ingredientId: "ing_rice",      grams: 200 },
    ],
  },
  {
    id: "rec_fishwater",
    name: "Fish dish (water)",
    category: "Lunch",
    baseGrams: 700,
    ingredients: [
      { ingredientId: "ing_fish_water", grams: 145 },
      { ingredientId: "ing_onion",      grams: 100 },
      { ingredientId: "ing_carrots",    grams: 100 },
      { ingredientId: "ing_flatbeans",  grams: 100 },
      { ingredientId: "ing_egg",        grams: 116 },
      { ingredientId: "ing_rice",       grams: 200 },
    ],
  },
  {
    id: "rec_lays",
    name: "Lays paprika",
    category: "Snacks",
    baseGrams: 30,
    ingredients: [{ ingredientId: "ing_chips", grams: 30 }],
  },
  {
    id: "rec_banana1",
    name: "Banana",
    category: "Snacks",
    baseGrams: 118,
    ingredients: [{ ingredientId: "ing_banana", grams: 118 }],
  },
  {
    id: "rec_brownie",
    name: "Brownie",
    category: "Snacks",
    baseGrams: 30,
    ingredients: [{ ingredientId: "ing_brownie", grams: 30 }],
  },
  {
    id: "rec_crunchy",
    name: "Crunchy oats & honey",
    category: "Snacks",
    baseGrams: 42,
    ingredients: [{ ingredientId: "ing_oatbar", grams: 42 }],
  },
  {
    id: "rec_chia",
    name: "Chia pudding (framboos)",
    category: "Snacks",
    baseGrams: 120,
    ingredients: [{ ingredientId: "ing_chia", grams: 120 }],
  },
  {
    id: "rec_moong",
    name: "Moong dhal (1 portion)",
    category: "Snacks",
    baseGrams: 138,
    ingredients: [{ ingredientId: "ing_moong", grams: 138 }],
  },
  {
    id: "rec_chocooats",
    name: "Choco oats",
    category: "Snacks",
    baseGrams: 75,
    ingredients: [{ ingredientId: "ing_chocooats", grams: 75 }],
  },
];

// ── Workouts ──────────────────────────────────────────────────────────────────
export const WORKOUTS = [
  { id: "warmup",       name: "Warm-up (3 min)",               calsPerSet: 5  },
  { id: "march",        name: "March in place (100 lifts)",     calsPerSet: 8  },
  { id: "plankdips",    name: "Side plank dips ×12",            calsPerSet: 10 },
  { id: "planktwists",  name: "Side plank twists ×12",          calsPerSet: 10 },
  { id: "vups",         name: "V-ups / In-and-Outs ×12",        calsPerSet: 8  },
  { id: "sidelying",    name: "Side leg raises ×12 (lying)",    calsPerSet: 6  },
  { id: "sidestanding", name: "Side leg raises ×12 (standing)", calsPerSet: 6  },
  { id: "plank",        name: "Normal plank (15 sec)",          calsPerSet: 2  },
  { id: "sidehold",     name: "Side hold (15 sec)",             calsPerSet: 3  },
  { id: "wallpullups",  name: "Wall pull-ups ×12",              calsPerSet: 8  },
  { id: "pushups",      name: "Push-ups ×10",                   calsPerSet: 10 },
];

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