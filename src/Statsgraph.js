// Statsgraph.js
// log.food     → { recipeId: gramsEaten, ... }
// log.workouts → { workoutId: sets, ... }
// log.steps    → number

export function buildCalorieData(healthLogs, ingredients, recipes, workouts) {
  return Object.entries(healthLogs)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, log]) => {
      // calories consumed — sum across food entries
      let consumed = 0;
      Object.entries(log.food ?? {}).forEach(([recipeId, gramsEaten]) => {
        const recipe = (recipes ?? []).find((r) => r.id === recipeId);
        if (!recipe) return;
        // pull kcal per 100g from the recipe's ingredients
        let kcalPer100 = 0;
        (recipe.ingredients ?? []).forEach((ri) => {
          const ing = (ingredients ?? []).find((i) => i.id === ri.id);
          if (ing) kcalPer100 += (ing.kcal ?? 0) * (ri.amount / 100);
        });
        consumed += (kcalPer100 / 100) * Number(gramsEaten);
      });

      // calories burned — workout sets * calsPerSet + steps
      let burned = 0;
      Object.entries(log.workouts ?? {}).forEach(([workoutId, sets]) => {
        const w = (workouts ?? []).find((w) => w.id === workoutId);
        if (w) burned += w.calsPerSet * sets;
      });
      burned += (parseFloat(log.steps) || 0) * 0.0425;

      return {
        date: date.slice(5),
        consumed: Math.round(consumed),
        burned:   Math.round(burned),
      };
    });
}

export function buildStepsData(healthLogs) {
  return Object.entries(healthLogs)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, log]) => ({
      date:  date.slice(5),
      steps: parseFloat(log.steps) || 0,
    }));
}

export function buildProteinData(healthLogs, ingredients, recipes) {
  return Object.entries(healthLogs)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, log]) => {
      let protein = 0;
      Object.entries(log.food ?? {}).forEach(([recipeId, gramsEaten]) => {
        const recipe = (recipes ?? []).find((r) => r.id === recipeId);
        if (!recipe) return;
        let proteinPer100 = 0;
        (recipe.ingredients ?? []).forEach((ri) => {
          const ing = (ingredients ?? []).find((i) => i.id === ri.id);
          if (ing) proteinPer100 += (ing.protein ?? 0) * (ri.amount / 100);
        });
        protein += (proteinPer100 / 100) * Number(gramsEaten);
      });
      return {
        date:    date.slice(5),
        protein: Math.round(protein),
      };
    });
}
