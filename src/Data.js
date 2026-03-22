// ── Ingredients ───────────────────────────────────────────────────────────────
// cal and protein are per 100g
export const INGREDIENTS = [
  { id: "ing_chicken",     name: "Chicken breast",    cal100: 110, protein100: 23  },
  { id: "ing_rice",        name: "Rice (cooked)",      cal100: 130, protein100: 2.7 },
  { id: "ing_egg",         name: "Egg",                cal100: 155, protein100: 13  },
  { id: "ing_oats",        name: "Oats",               cal100: 389, protein100: 17  },
  { id: "ing_milk",        name: "Milk",               cal100: 42,  protein100: 3.4 },
  { id: "ing_bread",       name: "Whole wheat bread",  cal100: 247, protein100: 13  },
  { id: "ing_tuna",        name: "Tuna (canned water)", cal100: 116, protein100: 26 },
  { id: "ing_salmon",      name: "Salmon",             cal100: 208, protein100: 20  },
  { id: "ing_broccoli",    name: "Broccoli",           cal100: 34,  protein100: 2.8 },
  { id: "ing_spinach",     name: "Spinach",            cal100: 23,  protein100: 2.9 },
  { id: "ing_potato",      name: "Potato",             cal100: 77,  protein100: 2   },
  { id: "ing_banana",      name: "Banana",             cal100: 89,  protein100: 1.1 },
  { id: "ing_apple",       name: "Apple",              cal100: 52,  protein100: 0.3 },
  { id: "ing_peanutbutter",name: "Peanut butter",      cal100: 588, protein100: 25  },
  { id: "ing_greek_yogurt",name: "Greek yogurt",       cal100: 59,  protein100: 10  },
  { id: "ing_olive_oil",   name: "Olive oil",          cal100: 884, protein100: 0   },
  { id: "ing_pasta",       name: "Pasta (cooked)",     cal100: 158, protein100: 5.8 },
  { id: "ing_beef",        name: "Ground beef (lean)", cal100: 215, protein100: 26  },
  { id: "ing_lentils",     name: "Lentils (cooked)",   cal100: 116, protein100: 9   },
  { id: "ing_almonds",     name: "Almonds",            cal100: 579, protein100: 21  },
];

// ── Recipes ───────────────────────────────────────────────────────────────────
export const RECIPES = [
  {
    id: "rec_oatmeal",
    name: "Oatmeal with banana",
    category: "Breakfast",
    baseGrams: 300,
    ingredients: [
      { ingredientId: "ing_oats",   grams: 80  },
      { ingredientId: "ing_milk",   grams: 200 },
      { ingredientId: "ing_banana", grams: 100 },
    ],
  },
  {
    id: "rec_eggs_toast",
    name: "Scrambled eggs on toast",
    category: "Breakfast",
    baseGrams: 250,
    ingredients: [
      { ingredientId: "ing_egg",   grams: 180 },
      { ingredientId: "ing_bread", grams: 70  },
    ],
  },
  {
    id: "rec_greek_yogurt",
    name: "Greek yogurt with almonds",
    category: "Breakfast",
    baseGrams: 200,
    ingredients: [
      { ingredientId: "ing_greek_yogurt", grams: 170 },
      { ingredientId: "ing_almonds",      grams: 30  },
    ],
  },
  {
    id: "rec_chicken_rice",
    name: "Chicken and rice",
    category: "Lunch",
    baseGrams: 450,
    ingredients: [
      { ingredientId: "ing_chicken", grams: 200 },
      { ingredientId: "ing_rice",    grams: 200 },
      { ingredientId: "ing_broccoli",grams: 100 },
    ],
  },
  {
    id: "rec_tuna_salad",
    name: "Tuna salad wrap",
    category: "Lunch",
    baseGrams: 300,
    ingredients: [
      { ingredientId: "ing_tuna",    grams: 150 },
      { ingredientId: "ing_bread",   grams: 70  },
      { ingredientId: "ing_spinach", grams: 50  },
    ],
  },
  {
    id: "rec_pasta_beef",
    name: "Pasta with ground beef",
    category: "Lunch",
    baseGrams: 500,
    ingredients: [
      { ingredientId: "ing_pasta",     grams: 200 },
      { ingredientId: "ing_beef",      grams: 150 },
      { ingredientId: "ing_spinach",   grams: 80  },
      { ingredientId: "ing_olive_oil", grams: 10  },
    ],
  },
  {
    id: "rec_salmon_potato",
    name: "Salmon with potato",
    category: "Lunch",
    baseGrams: 450,
    ingredients: [
      { ingredientId: "ing_salmon",  grams: 200 },
      { ingredientId: "ing_potato",  grams: 200 },
      { ingredientId: "ing_spinach", grams: 80  },
    ],
  },
  {
    id: "rec_banana",
    name: "Banana",
    category: "Snacks",
    baseGrams: 120,
    ingredients: [
      { ingredientId: "ing_banana", grams: 120 },
    ],
  },
  {
    id: "rec_apple",
    name: "Apple",
    category: "Snacks",
    baseGrams: 180,
    ingredients: [
      { ingredientId: "ing_apple", grams: 180 },
    ],
  },
  {
    id: "rec_peanut_butter",
    name: "Peanut butter on toast",
    category: "Snacks",
    baseGrams: 100,
    ingredients: [
      { ingredientId: "ing_peanutbutter", grams: 30 },
      { ingredientId: "ing_bread",        grams: 70 },
    ],
  },
  {
    id: "rec_greek_yogurt_snack",
    name: "Greek yogurt",
    category: "Snacks",
    baseGrams: 150,
    ingredients: [
      { ingredientId: "ing_greek_yogurt", grams: 150 },
    ],
  },
  {
    id: "rec_lentil_soup",
    name: "Lentil soup",
    category: "Lunch",
    baseGrams: 400,
    ingredients: [
      { ingredientId: "ing_lentils",  grams: 200 },
      { ingredientId: "ing_spinach",  grams: 80  },
      { ingredientId: "ing_olive_oil",grams: 10  },
    ],
  },
];

// ── Workouts ──────────────────────────────────────────────────────────────────
export const WORKOUTS = [
  { id: "w_warmup",      name: "Warm-up (5 min)",         calsPerSet: 20  },
  { id: "w_pushups",     name: "Push-ups ×10",            calsPerSet: 8   },
  { id: "w_squats",      name: "Squats ×15",              calsPerSet: 10  },
  { id: "w_lunges",      name: "Lunges ×12 (each leg)",   calsPerSet: 9   },
  { id: "w_plank",       name: "Plank (30 sec)",          calsPerSet: 5   },
  { id: "w_situps",      name: "Sit-ups ×15",             calsPerSet: 7   },
  { id: "w_burpees",     name: "Burpees ×10",             calsPerSet: 15  },
  { id: "w_jumpingjacks",name: "Jumping jacks ×30",       calsPerSet: 10  },
  { id: "w_pullups",     name: "Pull-ups ×5",             calsPerSet: 8   },
  { id: "w_deadlift",    name: "Deadlift ×8",             calsPerSet: 12  },
  { id: "w_cycling",     name: "Cycling (10 min)",        calsPerSet: 80  },
  { id: "w_running",     name: "Running (10 min)",        calsPerSet: 90  },
];

// ── Helper: calculate calories + protein for a recipe given actual grams eaten ─
export function calcRecipeNutrition(ingredients, recipe, gramsEaten) {
  const ratio = gramsEaten / recipe.baseGrams;
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