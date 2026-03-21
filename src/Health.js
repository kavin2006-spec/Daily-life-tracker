import React, { useState } from "react";
import { calcRecipeNutrition } from "./Data";

const CATEGORIES = ["Breakfast", "Lunch", "Snacks"];
const emptyLog = () => ({ food: {}, workouts: {}, steps: "" });
// food log structure: { recipeId: gramsEaten }

export default function Health({
  healthLogs, updateHealthLog,
  workouts, setWorkouts,
  ingredients, setIngredients,
  recipes, setRecipes,
}) {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay,  setSelectedDay]  = useState(null);
  const [popupTab,     setPopupTab]     = useState("food"); // "food" | "workouts" | "results"

  // Workout editor state
  const [newWName,  setNewWName]  = useState("");
  const [newWCals,  setNewWCals]  = useState("");
  const [editingW,  setEditingW]  = useState(null);
  const [editWName, setEditWName] = useState("");
  const [editWCals, setEditWCals] = useState("");

  // Ingredient editor state
  const [newIName,    setNewIName]    = useState("");
  const [newICal,     setNewICal]     = useState("");
  const [newIProtein, setNewIProtein] = useState("");
  const [editingI,    setEditingI]    = useState(null);
  const [editIName,   setEditIName]   = useState("");
  const [editICal,    setEditICal]    = useState("");
  const [editIProtein,setEditIProtein]= useState("");

  // Recipe editor state
  const [newRName,  setNewRName]  = useState("");
  const [newRCat,   setNewRCat]   = useState("Breakfast");
  const [newRGrams, setNewRGrams] = useState("");
  const [newRIngs,  setNewRIngs]  = useState([]); // [{ingredientId, grams}]
  const [newRIngId, setNewRIngId] = useState("");
  const [newRIngG,  setNewRIngG]  = useState("");
  const [editingR,  setEditingR]  = useState(null);
  const [editRName, setEditRName] = useState("");
  const [editRCat,  setEditRCat]  = useState("Breakfast");
  const [editRGrams,setEditRGrams]= useState("");
  const [editRIngs, setEditRIngs] = useState([]);
  const [editRIngId,setEditRIngId]= useState("");
  const [editRIngG, setEditRIngG] = useState("");

  // Month nav
  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  }

  const monthName   = new Date(currentYear, currentMonth, 1).toLocaleString("default", { month: "long" });
  const firstDow    = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  // Log helpers
  function getLog(ymd) { return healthLogs[ymd] || emptyLog(); }

  function setFoodGrams(ymd, recipeId, grams) {
    updateHealthLog(ymd, (log) => {
      const food = { ...log.food };
      if (!grams || grams === "0") delete food[recipeId];
      else food[recipeId] = grams;
      return { ...log, food };
    });
  }

  function setWorkoutSets(ymd, workoutId, sets) {
    updateHealthLog(ymd, (log) => {
      const w = { ...log.workouts };
      if (sets === 0 || sets === "") delete w[workoutId];
      else w[workoutId] = sets;
      return { ...log, workouts: w };
    });
  }

  function setSteps(ymd, val) {
    updateHealthLog(ymd, (log) => ({ ...log, steps: val }));
  }

  // Nutrition calculations
  function calcDayNutrition(log) {
    let totalCal = 0;
    let totalProtein = 0;
    Object.entries(log.food).forEach(([recipeId, gramsEaten]) => {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) return;
      const { cal, protein } = calcRecipeNutrition(ingredients, recipe, Number(gramsEaten));
      totalCal     += cal;
      totalProtein += protein;
    });
    return { cal: Math.round(totalCal), protein: Math.round(totalProtein * 10) / 10 };
  }

  function calcBurned(log) {
    let total = Object.entries(log.workouts).reduce((sum, [id, sets]) => {
      const w = workouts.find((w) => w.id === id);
      return sum + (w ? w.calsPerSet * sets : 0);
    }, 0);
    total += (parseFloat(log.steps) || 0) * 0.0425;
    return Math.round(total);
  }

  // Workout CRUD
  function addWorkout() {
    if (!newWName.trim() || !newWCals) return;
    setWorkouts([...workouts, { id: "w_" + Date.now(), name: newWName.trim(), calsPerSet: Number(newWCals) }]);
    setNewWName(""); setNewWCals("");
  }
  function openEditW(w)  { setEditingW(w); setEditWName(w.name); setEditWCals(w.calsPerSet); }
  function saveEditW()   {
    setWorkouts(workouts.map((w) => w.id === editingW.id ? { ...w, name: editWName.trim(), calsPerSet: Number(editWCals) } : w));
    setEditingW(null);
  }
  function deleteWorkout(id) { setWorkouts(workouts.filter((w) => w.id !== id)); setEditingW(null); }

  // Ingredient CRUD
  function addIngredient() {
    if (!newIName.trim() || !newICal) return;
    setIngredients([...ingredients, {
      id: "ing_" + Date.now(),
      name: newIName.trim(),
      cal100: Number(newICal),
      protein100: Number(newIProtein) || 0,
    }]);
    setNewIName(""); setNewICal(""); setNewIProtein("");
  }
  function openEditI(ing) {
    setEditingI(ing); setEditIName(ing.name); setEditICal(ing.cal100); setEditIProtein(ing.protein100);
  }
  function saveEditI() {
    setIngredients(ingredients.map((i) => i.id === editingI.id
      ? { ...i, name: editIName.trim(), cal100: Number(editICal), protein100: Number(editIProtein) }
      : i
    ));
    setEditingI(null);
  }
  function deleteIngredient(id) {
    setIngredients(ingredients.filter((i) => i.id !== id));
    setEditingI(null);
  }

  // Recipe CRUD
  function addIngToNewRecipe() {
    if (!newRIngId || !newRIngG) return;
    setNewRIngs([...newRIngs, { ingredientId: newRIngId, grams: Number(newRIngG) }]);
    setNewRIngId(""); setNewRIngG("");
  }
  function removeIngFromNew(idx) { setNewRIngs(newRIngs.filter((_, i) => i !== idx)); }

  function addRecipe() {
    if (!newRName.trim() || !newRGrams || newRIngs.length === 0) return;
    setRecipes([...recipes, {
      id: "rec_" + Date.now(),
      name: newRName.trim(),
      category: newRCat,
      baseGrams: Number(newRGrams),
      ingredients: newRIngs,
    }]);
    setNewRName(""); setNewRGrams(""); setNewRIngs([]);
  }

  function openEditR(r) {
    setEditingR(r); setEditRName(r.name); setEditRCat(r.category);
    setEditRGrams(r.baseGrams); setEditRIngs([...r.ingredients]);
  }
  function addIngToEditRecipe() {
    if (!editRIngId || !editRIngG) return;
    setEditRIngs([...editRIngs, { ingredientId: editRIngId, grams: Number(editRIngG) }]);
    setEditRIngId(""); setEditRIngG("");
  }
  function removeIngFromEdit(idx) { setEditRIngs(editRIngs.filter((_, i) => i !== idx)); }
  function saveEditR() {
    setRecipes(recipes.map((r) => r.id === editingR.id
      ? { ...r, name: editRName.trim(), category: editRCat, baseGrams: Number(editRGrams), ingredients: editRIngs }
      : r
    ));
    setEditingR(null);
  }
  function deleteRecipe(id) { setRecipes(recipes.filter((r) => r.id !== id)); setEditingR(null); }

  // Popup data
  const popupLog = selectedDay ? getLog(selectedDay) : emptyLog();
  const { cal: intake, protein } = selectedDay ? calcDayNutrition(popupLog) : { cal: 0, protein: 0 };
  const burned   = selectedDay ? calcBurned(popupLog) : 0;
  const net      = intake - burned;
  const popupDate = selectedDay ? new Date(selectedDay + "T00:00:00") : null;

  // Protein status
  const proteinStatus = protein >= 100 && protein <= 130 ? "good" : protein < 100 ? "low" : "high";
  const proteinColor  = proteinStatus === "good" ? "#5db85d" : "#e07070";

  return (
    <div style={s.page}>

      {/* TOP BAR */}
      <div style={s.topBar}>
        <button style={s.navBtn} onClick={prevMonth}>← Prev</button>
        <span style={s.monthLabel}>{monthName} {currentYear} · Health</span>
        <button style={s.navBtn} onClick={nextMonth}>Next →</button>
      </div>

      {/* DOW HEADER */}
      <div style={s.dowRow}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} style={s.dowCell}>{d}</div>
        ))}
      </div>

      {/* CALENDAR GRID */}
      <div style={s.grid}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} style={s.emptyCell} />;
          const ymd      = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const log      = getLog(ymd);
          const hasLog   = Object.keys(log.food).length > 0 || Object.keys(log.workouts).length > 0 || log.steps;
          const todayDay = isToday(day);
          return (
            <div
              key={day}
              style={{ ...s.cell, ...(todayDay ? s.todayCell : {}), ...(hasLog ? s.loggedCell : {}) }}
              onClick={() => { setSelectedDay(ymd); setPopupTab("food"); }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.35)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
            >
              <span style={{ ...s.dayNum, ...(todayDay ? s.todayNum : {}) }}>{day}</span>
              {hasLog && <div style={s.logDot} />}
            </div>
          );
        })}
      </div>

      {/* LEGEND */}
      <div style={s.legend}>
        <div style={s.legendItem}><div style={{ ...s.legendSwatch, backgroundColor: "#1e2a3a", outline: "2px solid #378add", outlineOffset: "1px" }} /><span>Today</span></div>
        <div style={s.legendItem}><div style={{ ...s.legendSwatch, backgroundColor: "#1e2a1e" }} /><span>Health logged</span></div>
        <div style={s.legendItem}><div style={{ ...s.legendSwatch, borderRadius: "50%", backgroundColor: "#5db85d" }} /><span>Has data</span></div>
      </div>

      {/* EDITOR AREA */}
      <div style={s.editorArea}>

        {/* WORKOUTS */}
        <div style={s.editorBlock}>
          <div style={s.editorHeader}>💪 Workouts</div>
          <div style={s.editorAddRow}>
            <input style={s.editorInput} placeholder="Workout name" value={newWName} onChange={(e) => setNewWName(e.target.value)} />
            <input style={{ ...s.editorInput, flex: "0 0 90px" }} type="number" placeholder="cal/set" value={newWCals} onChange={(e) => setNewWCals(e.target.value)} />
            <button style={s.editorAddBtn} onClick={addWorkout}>+ Add</button>
          </div>
          <div style={s.itemList}>
            {workouts.map((w) => editingW?.id === w.id ? (
              <div key={w.id} style={s.editRow}>
                <input style={s.editorInput} value={editWName} onChange={(e) => setEditWName(e.target.value)} />
                <input style={{ ...s.editorInput, flex: "0 0 90px" }} type="number" value={editWCals} onChange={(e) => setEditWCals(e.target.value)} />
                <button style={s.saveBtn}   onClick={saveEditW}>Save</button>
                <button style={s.deleteBtn} onClick={() => deleteWorkout(w.id)}>Delete</button>
                <button style={s.cancelBtn} onClick={() => setEditingW(null)}>✕</button>
              </div>
            ) : (
              <div key={w.id} style={s.itemRow} onClick={() => openEditW(w)}
                onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
              >
                <span style={s.itemName}>{w.name}</span>
                <span style={s.itemCals}>{w.calsPerSet} cal/set</span>
                <span style={s.editHint}>✏️</span>
              </div>
            ))}
          </div>
        </div>

        {/* INGREDIENTS */}
        <div style={s.editorBlock}>
          <div style={s.editorHeader}>🥦 Ingredients</div>
          <div style={s.editorAddRow}>
            <input style={s.editorInput} placeholder="Ingredient name" value={newIName} onChange={(e) => setNewIName(e.target.value)} />
            <input style={{ ...s.editorInput, flex: "0 0 75px" }} type="number" placeholder="cal/100g" value={newICal} onChange={(e) => setNewICal(e.target.value)} />
            <input style={{ ...s.editorInput, flex: "0 0 75px" }} type="number" placeholder="prot/100g" value={newIProtein} onChange={(e) => setNewIProtein(e.target.value)} />
            <button style={s.editorAddBtn} onClick={addIngredient}>+ Add</button>
          </div>
          <div style={s.itemList}>
            {ingredients.map((ing) => editingI?.id === ing.id ? (
              <div key={ing.id} style={s.editRow}>
                <input style={s.editorInput} value={editIName} onChange={(e) => setEditIName(e.target.value)} />
                <input style={{ ...s.editorInput, flex: "0 0 75px" }} type="number" value={editICal} onChange={(e) => setEditICal(e.target.value)} />
                <input style={{ ...s.editorInput, flex: "0 0 75px" }} type="number" value={editIProtein} onChange={(e) => setEditIProtein(e.target.value)} />
                <button style={s.saveBtn}   onClick={saveEditI}>Save</button>
                <button style={s.deleteBtn} onClick={() => deleteIngredient(ing.id)}>Delete</button>
                <button style={s.cancelBtn} onClick={() => setEditingI(null)}>✕</button>
              </div>
            ) : (
              <div key={ing.id} style={s.itemRow} onClick={() => openEditI(ing)}
                onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.3)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
              >
                <span style={s.itemName}>{ing.name}</span>
                <span style={s.itemCals}>{ing.cal100} cal · {ing.protein100}g prot /100g</span>
                <span style={s.editHint}>✏️</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECIPES */}
        <div style={{ ...s.editorBlock, gridColumn: "1 / -1" }}>
          <div style={s.editorHeader}>🍽 Recipes</div>

          {/* New recipe form */}
          <div style={s.recipeFormBox}>
            <div style={s.editorAddRow}>
              <input style={s.editorInput} placeholder="Recipe name" value={newRName} onChange={(e) => setNewRName(e.target.value)} />
              <select style={s.editorSelect} value={newRCat} onChange={(e) => setNewRCat(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input style={{ ...s.editorInput, flex: "0 0 100px" }} type="number" placeholder="base grams" value={newRGrams} onChange={(e) => setNewRGrams(e.target.value)} />
            </div>

            {/* Add ingredient to new recipe */}
            <div style={s.editorAddRow}>
              <select style={{ ...s.editorSelect, flex: 1 }} value={newRIngId} onChange={(e) => setNewRIngId(e.target.value)}>
                <option value="">— pick ingredient —</option>
                {ingredients.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
              <input style={{ ...s.editorInput, flex: "0 0 80px" }} type="number" placeholder="grams" value={newRIngG} onChange={(e) => setNewRIngG(e.target.value)} />
              <button style={s.cancelBtn} onClick={addIngToNewRecipe}>+ Ingredient</button>
            </div>

            {/* Ingredient list for new recipe */}
            {newRIngs.length > 0 && (
              <div style={s.ingTagRow}>
                {newRIngs.map((ri, idx) => {
                  const ing = ingredients.find((i) => i.id === ri.ingredientId);
                  return (
                    <div key={idx} style={s.ingTag}>
                      <span>{ing?.name} {ri.grams}g</span>
                      <button style={s.ingTagRemove} onClick={() => removeIngFromNew(idx)}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}

            <button style={{ ...s.editorAddBtn, alignSelf: "flex-start" }} onClick={addRecipe}>+ Add Recipe</button>
          </div>

          {/* Recipe list grouped by category */}
          {CATEGORIES.map((cat) => {
            const catRecipes = recipes.filter((r) => r.category === cat);
            if (catRecipes.length === 0) return null;
            return (
              <div key={cat}>
                <div style={s.catDivider}>{cat}</div>
                {catRecipes.map((r) => editingR?.id === r.id ? (
                  <div key={r.id} style={{ ...s.editRow, flexDirection: "column", alignItems: "stretch", gap: 8, backgroundColor: "#242424", borderRadius: 8, padding: 10 }}>
                    <div style={s.editorAddRow}>
                      <input style={s.editorInput} value={editRName} onChange={(e) => setEditRName(e.target.value)} />
                      <select style={s.editorSelect} value={editRCat} onChange={(e) => setEditRCat(e.target.value)}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <input style={{ ...s.editorInput, flex: "0 0 100px" }} type="number" value={editRGrams} onChange={(e) => setEditRGrams(e.target.value)} />
                    </div>
                    <div style={s.editorAddRow}>
                      <select style={{ ...s.editorSelect, flex: 1 }} value={editRIngId} onChange={(e) => setEditRIngId(e.target.value)}>
                        <option value="">— add ingredient —</option>
                        {ingredients.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                      </select>
                      <input style={{ ...s.editorInput, flex: "0 0 80px" }} type="number" placeholder="grams" value={editRIngG} onChange={(e) => setEditRIngG(e.target.value)} />
                      <button style={s.cancelBtn} onClick={addIngToEditRecipe}>+ Add</button>
                    </div>
                    {editRIngs.length > 0 && (
                      <div style={s.ingTagRow}>
                        {editRIngs.map((ri, idx) => {
                          const ing = ingredients.find((i) => i.id === ri.ingredientId);
                          return (
                            <div key={idx} style={s.ingTag}>
                              <span>{ing?.name} {ri.grams}g</span>
                              <button style={s.ingTagRemove} onClick={() => removeIngFromEdit(idx)}>✕</button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={s.saveBtn}   onClick={saveEditR}>Save</button>
                      <button style={s.deleteBtn} onClick={() => deleteRecipe(r.id)}>Delete</button>
                      <button style={s.cancelBtn} onClick={() => setEditingR(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div key={r.id} style={s.itemRow} onClick={() => openEditR(r)}
                    onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.3)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
                  >
                    <span style={s.itemName}>{r.name}</span>
                    <span style={s.itemCals}>{r.baseGrams}g base · {r.ingredients.length} ingredients</span>
                    <span style={s.editHint}>✏️</span>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

      </div>

      {/* POPUP */}
      {selectedDay && (
        <div style={s.overlay} onClick={() => setSelectedDay(null)}>
          <div style={s.popup} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={s.popupHeader}>
              <div>
                <div style={s.popupWeekday}>{popupDate.toLocaleString("default", { weekday: "long" })}</div>
                <div style={s.popupDay}>{popupDate.getDate()}</div>
                <div style={s.popupMonth}>{popupDate.toLocaleString("default", { month: "short" })} {popupDate.getFullYear()}</div>
              </div>
              <button style={s.closeBtn} onClick={() => setSelectedDay(null)}>✕</button>
            </div>

            {/* Tabs */}
            <div style={s.tabRow}>
              {["food", "workouts", "results"].map((tab) => (
                <button
                  key={tab}
                  style={{ ...s.tab, ...(popupTab === tab ? s.tabActive : {}) }}
                  onClick={() => setPopupTab(tab)}
                >
                  {tab === "food" ? "🍽 Food" : tab === "workouts" ? "💪 Workouts" : "📊 Results"}
                </button>
              ))}
            </div>

            <div style={s.popupBody}>

              {/* ── FOOD TAB ── */}
              {popupTab === "food" && (
                <>
                  {CATEGORIES.map((cat) => {
                    const catRecipes = recipes.filter((r) => r.category === cat);
                    if (catRecipes.length === 0) return null;
                    return (
                      <div key={cat}>
                        <div style={s.catLabel}>{cat}</div>
                        {catRecipes.map((recipe) => {
                          const gramsVal = popupLog.food[recipe.id] || "";
                          const { cal, protein: p } = gramsVal
                            ? calcRecipeNutrition(ingredients, recipe, Number(gramsVal))
                            : { cal: 0, protein: 0 };
                          return (
                            <div key={recipe.id} style={s.foodRow}>
                              <div style={s.foodRowTop}>
                                <span style={s.foodName}>{recipe.name}</span>
                                <span style={s.foodBase}>base {recipe.baseGrams}g</span>
                              </div>
                              <div style={s.foodRowBottom}>
                                <div style={s.gramsInputWrap}>
                                  <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={gramsVal}
                                    onChange={(e) => setFoodGrams(selectedDay, recipe.id, e.target.value)}
                                    style={s.gramsInput}
                                  />
                                  <span style={s.gramsUnit}>g</span>
                                </div>
                                {gramsVal ? (
                                  <div style={s.foodMacros}>
                                    <span style={s.macroCal}>{cal} cal</span>
                                    <span style={s.macroProtein}>{p}g protein</span>
                                  </div>
                                ) : (
                                  <span style={s.foodHint}>enter grams to calculate</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              )}

              {/* ── WORKOUTS TAB ── */}
              {popupTab === "workouts" && (
                <>
                  {workouts.map((w) => (
                    <div key={w.id} style={s.workoutRow}>
                      <span style={s.checkLabel}>{w.name}</span>
                      <span style={s.checkCals}>{w.calsPerSet} cal/set</span>
                      <input
                        type="number" min="0" placeholder="sets"
                        value={popupLog.workouts[w.id] || ""}
                        onChange={(e) => setWorkoutSets(selectedDay, w.id, Number(e.target.value))}
                        style={s.setsInput}
                      />
                    </div>
                  ))}
                  <div style={{ ...s.catLabel, marginTop: 8 }}>Steps</div>
                  <div style={s.workoutRow}>
                    <span style={s.checkLabel}>No. of steps</span>
                    <span style={s.checkCals}>× 0.0425 cal</span>
                    <input
                      type="number" min="0" placeholder="steps"
                      value={popupLog.steps}
                      onChange={(e) => setSteps(selectedDay, e.target.value)}
                      style={s.setsInput}
                    />
                  </div>
                </>
              )}

              {/* ── RESULTS TAB ── */}
              {popupTab === "results" && (
                <>
                  {/* Calorie balance */}
                  <div style={s.resultCard}>
                    <div style={s.resultCardTitle}>Calorie balance</div>
                    <div style={s.resultRow}>
                      <span style={s.resultLabel}>Consumed</span>
                      <span style={s.resultVal}>{intake} cal</span>
                    </div>
                    <div style={s.resultRow}>
                      <span style={s.resultLabel}>Burned</span>
                      <span style={{ ...s.resultVal, color: "#5db85d" }}>{burned} cal</span>
                    </div>
                    <div style={s.resultDivider} />
                    <div style={s.resultRow}>
                      <span style={{ ...s.resultLabel, fontWeight: 700, color: "#222" }}>Net</span>
                      <span style={{ ...s.resultVal, fontWeight: 700, fontSize: 20, color: net > 0 ? "#e07070" : "#5db85d" }}>
                        {net > 0 ? "+" : ""}{net} cal
                      </span>
                    </div>
                  </div>

                  {/* Protein */}
                  <div style={s.resultCard}>
                    <div style={s.resultCardTitle}>Protein intake</div>
                    <div style={s.resultRow}>
                      <span style={s.resultLabel}>Total protein</span>
                      <span style={{ ...s.resultVal, fontWeight: 700, fontSize: 20, color: proteinColor }}>
                        {protein}g
                      </span>
                    </div>
                    <div style={s.proteinBar}>
                      <div style={{
                        ...s.proteinBarFill,
                        width: `${Math.min((protein / 150) * 100, 100)}%`,
                        backgroundColor: proteinColor,
                      }} />
                      <div style={s.proteinTargetLine} />
                    </div>
                    <div style={s.proteinRangeLabel}>
                      <span>0g</span>
                      <span style={{ color: "#5db85d" }}>target: 100–130g</span>
                      <span>150g+</span>
                    </div>
                    <div style={{ ...s.resultRow, marginTop: 6 }}>
                      <span style={{ ...s.resultLabel, color: proteinColor, fontWeight: 600 }}>
                        {proteinStatus === "good"
                          ? "✓ On target"
                          : proteinStatus === "low"
                          ? "↓ Below target"
                          : "↑ Above target"}
                      </span>
                    </div>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const s = {
  page:         { display: "flex", flexDirection: "column", height: "100%", fontFamily: "sans-serif", backgroundColor: "#141414", color: "#eee" },
  topBar:       { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", backgroundColor: "#1c1c1c", borderBottom: "1px solid #2a2a2a", flexShrink: 0 },
  navBtn:       { background: "none", border: "1px solid #3a3a3a", borderRadius: 8, padding: "4px 14px", cursor: "pointer", fontSize: 13, color: "#888" },
  monthLabel:   { fontSize: 17, fontWeight: 700, color: "#eee" },
  dowRow:       { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #2a2a2a", backgroundColor: "#1a1a1a", flexShrink: 0 },
  dowCell:      { textAlign: "center", fontSize: 11, fontWeight: 700, color: "#555", padding: "8px 0", letterSpacing: "0.05em" },
  grid:         { flexShrink: 0, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(6, 64px)", gap: 1, backgroundColor: "#2a2a2a" },
  emptyCell:    { backgroundColor: "#141414" },
  cell:         { backgroundColor: "#1a1a1a", padding: "6px 8px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4, transition: "filter 0.15s" },
  todayCell:    { backgroundColor: "#1e2a3a", outline: "2px solid #378add", outlineOffset: "-2px", zIndex: 1 },
  loggedCell:   { backgroundColor: "#1e2a1e" },
  dayNum:       { fontSize: 13, fontWeight: 500, color: "#888" },
  todayNum:     { color: "#378add", fontWeight: 700 },
  logDot:       { width: 6, height: 6, borderRadius: "50%", backgroundColor: "#5db85d" },
  legend:       { display: "flex", gap: 20, padding: "8px 24px", backgroundColor: "#1a1a1a", borderTop: "1px solid #2a2a2a", flexShrink: 0, flexWrap: "wrap" },
  legendItem:   { display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#666" },
  legendSwatch: { width: 13, height: 13, borderRadius: 3, flexShrink: 0 },

  editorArea:   { flex: 1, minHeight: 0, overflowY: "auto", padding: "16px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignContent: "start" },
  editorBlock:  { backgroundColor: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 12, padding: "14px", display: "flex", flexDirection: "column", gap: 10 },
  editorHeader: { fontSize: 13, fontWeight: 700, color: "#aaa", paddingBottom: 8, borderBottom: "1px solid #2a2a2a" },
  editorAddRow: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  editorInput:  { flex: 1, minWidth: 80, height: 34, backgroundColor: "#242424", border: "1px solid #333", borderRadius: 7, padding: "0 10px", fontSize: 12, color: "#ddd", outline: "none", boxSizing: "border-box" },
  editorSelect: { height: 34, backgroundColor: "#242424", border: "1px solid #333", borderRadius: 7, padding: "0 8px", fontSize: 12, color: "#ddd", outline: "none", cursor: "pointer" },
  editorAddBtn: { height: 34, padding: "0 14px", backgroundColor: "#1a4a7a", color: "#7ab3e0", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  itemList:     { display: "flex", flexDirection: "column", gap: 4 },
  itemRow:      { display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", backgroundColor: "#242424", borderRadius: 7, cursor: "pointer", transition: "filter 0.15s" },
  itemName:     { flex: 1, fontSize: 12, color: "#ccc" },
  itemCals:     { fontSize: 11, color: "#555", flexShrink: 0 },
  editHint:     { fontSize: 11, color: "#444", flexShrink: 0 },
  editRow:      { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", padding: "4px 0" },
  catDivider:   { fontSize: 10, fontWeight: 700, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase", margin: "10px 0 4px", borderBottom: "1px solid #2a2a2a", paddingBottom: 4 },
  saveBtn:      { height: 30, padding: "0 12px", backgroundColor: "#1a4a7a", color: "#7ab3e0", border: "none", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  deleteBtn:    { height: 30, padding: "0 12px", backgroundColor: "#2a1515", color: "#e07070", border: "1px solid #3a2020", borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  cancelBtn:    { height: 30, padding: "0 10px", backgroundColor: "#242424", color: "#888", border: "1px solid #333", borderRadius: 6, fontSize: 11, cursor: "pointer" },

  recipeFormBox:{ display: "flex", flexDirection: "column", gap: 8, backgroundColor: "#242424", borderRadius: 8, padding: 10 },
  ingTagRow:    { display: "flex", flexWrap: "wrap", gap: 6 },
  ingTag:       { display: "flex", alignItems: "center", gap: 4, backgroundColor: "#1a4a7a", borderRadius: 6, padding: "3px 8px", fontSize: 11, color: "#7ab3e0" },
  ingTagRemove: { background: "none", border: "none", color: "#7ab3e0", cursor: "pointer", fontSize: 12, padding: 0, lineHeight: 1 },

  overlay:      { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  popup:        { backgroundColor: "#fff", borderRadius: 16, width: 440, maxHeight: "88vh", overflowY: "auto", display: "flex", flexDirection: "column" },
  popupHeader:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px 24px 12px", borderBottom: "1px solid #eee", flexShrink: 0 },
  popupWeekday: { fontSize: 12, color: "#aaa" },
  popupDay:     { fontSize: 40, fontWeight: 700, color: "#222", lineHeight: 1.1 },
  popupMonth:   { fontSize: 12, color: "#aaa" },
  closeBtn:     { background: "none", border: "none", color: "#bbb", fontSize: 16, cursor: "pointer" },
  tabRow:       { display: "flex", borderBottom: "1px solid #eee", flexShrink: 0 },
  tab:          { flex: 1, padding: "10px 0", background: "none", border: "none", fontSize: 13, fontWeight: 500, color: "#aaa", cursor: "pointer" },
  tabActive:    { color: "#7c3aed", borderBottom: "2px solid #7c3aed" },
  popupBody:    { padding: "14px 20px 20px", display: "flex", flexDirection: "column", gap: 10 },

  catLabel:     { fontSize: 10, fontWeight: 700, color: "#aaa", letterSpacing: "0.06em", textTransform: "uppercase", margin: "6px 0 4px" },
  foodRow:      { backgroundColor: "#f5f5f5", borderRadius: 8, padding: "8px 12px", marginBottom: 4 },
  foodRowTop:   { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  foodName:     { fontSize: 13, fontWeight: 600, color: "#222" },
  foodBase:     { fontSize: 10, color: "#aaa" },
  foodRowBottom:{ display: "flex", alignItems: "center", gap: 10 },
  gramsInputWrap:{ display: "flex", alignItems: "center", gap: 4 },
  gramsInput:   { width: 64, height: 30, border: "1px solid #ddd", borderRadius: 6, textAlign: "center", fontSize: 13, color: "#222", outline: "none", backgroundColor: "#fff" },
  gramsUnit:    { fontSize: 12, color: "#aaa" },
  foodMacros:   { display: "flex", gap: 10 },
  macroCal:     { fontSize: 12, fontWeight: 600, color: "#e07070" },
  macroProtein: { fontSize: 12, fontWeight: 600, color: "#378add" },
  foodHint:     { fontSize: 11, color: "#ccc", fontStyle: "italic" },

  checkLabel:   { flex: 1, fontSize: 13, color: "#333" },
  checkCals:    { fontSize: 11, color: "#aaa" },
  workoutRow:   { display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 8, backgroundColor: "#f5f5f5" },
  setsInput:    { width: 60, height: 28, border: "1px solid #ddd", borderRadius: 6, textAlign: "center", fontSize: 12, color: "#222", outline: "none", backgroundColor: "#fff" },

  resultCard:      { backgroundColor: "#f5f5f5", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 },
  resultCardTitle: { fontSize: 12, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 },
  resultRow:       { display: "flex", justifyContent: "space-between", alignItems: "center" },
  resultLabel:     { fontSize: 13, color: "#666" },
  resultVal:       { fontSize: 15, fontWeight: 600, color: "#222" },
  resultDivider:   { height: 1, backgroundColor: "#e0e0e0", margin: "2px 0" },
  proteinBar:      { height: 8, backgroundColor: "#e0e0e0", borderRadius: 4, position: "relative", marginTop: 4 },
  proteinBarFill:  { height: "100%", borderRadius: 4, transition: "width 0.3s" },
  proteinTargetLine:{ position: "absolute", left: "66.6%", top: -3, bottom: -3, width: 2, backgroundColor: "#5db85d", borderRadius: 1 },
  proteinRangeLabel:{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#aaa", marginTop: 4 },
};