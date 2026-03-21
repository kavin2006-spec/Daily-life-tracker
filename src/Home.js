import React, { useState } from "react";
import { calcRecipeNutrition } from "./Data";

function moviesOnDay(movies, ymd) {
  return movies.filter((m) => m.date === ymd);
}

function booksOnDay(books, ymd) {
  return books.filter((b) => b.startDate <= ymd && b.endDate >= ymd);
}

function movieDotColor(count) {
  if (count === 0) return null;
  if (count === 1) return "#378add";
  return "#3b9e4a";
}

function calcDayNutrition(ingredients, recipes, log) {
  let totalCal = 0, totalProtein = 0;
  Object.entries(log.food).forEach(([recipeId, gramsEaten]) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;
    const { cal, protein } = calcRecipeNutrition(ingredients, recipe, Number(gramsEaten));
    totalCal += cal; totalProtein += protein;
  });
  return { cal: Math.round(totalCal), protein: Math.round(totalProtein * 10) / 10 };
}

function calcBurned(workouts, log) {
  let total = Object.entries(log.workouts).reduce((sum, [id, sets]) => {
    const w = workouts.find((w) => w.id === id);
    return sum + (w ? w.calsPerSet * sets : 0);
  }, 0);
  total += (parseFloat(log.steps) || 0) * 0.0425;
  return Math.round(total);
}

export default function Home({ movies, books, healthLogs, updateHealthLog, workouts, ingredients, recipes }) {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay,  setSelectedDay]  = useState(null);
  const [popupTab,     setPopupTab]     = useState("entertainment");

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
    d === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear  === today.getFullYear();

  // Popup data — all calculated here so they're always up to date
  const popupYMD    = selectedDay;
  const popupMovies = popupYMD ? moviesOnDay(movies, popupYMD) : [];
  const popupBooks  = popupYMD ? booksOnDay(books, popupYMD)   : [];
  const popupLog    = popupYMD ? (healthLogs[popupYMD] || { food: {}, workouts: {}, steps: "" }) : null;
  const { cal: intake, protein } = popupLog
    ? calcDayNutrition(ingredients, recipes, popupLog)
    : { cal: 0, protein: 0 };
  const burned    = popupLog ? calcBurned(workouts, popupLog) : 0;
  const net       = intake - burned;
  const popupDate = selectedDay ? new Date(selectedDay + "T00:00:00") : null;

  // Build logged food list for display in health tab
  const loggedFood = popupLog
    ? Object.entries(popupLog.food).map(([recipeId, gramsEaten]) => {
        const recipe = recipes.find((r) => r.id === recipeId);
        if (!recipe) return null;
        const { cal, protein: p } = calcRecipeNutrition(ingredients, recipe, Number(gramsEaten));
        return { id: recipeId, name: recipe.name, grams: gramsEaten, cal, protein: p };
      }).filter(Boolean)
    : [];

  const proteinColor = protein >= 100 && protein <= 130 ? "#5db85d" : "#e07070";

  return (
    <div style={s.page}>

      {/* TOP BAR */}
      <div style={s.topBar}>
        <button style={s.navBtn} onClick={prevMonth}>← Prev</button>
        <span style={s.monthLabel}>{monthName} {currentYear}</span>
        <button style={s.navBtn} onClick={nextMonth}>Next →</button>
      </div>

      {/* DOW HEADER */}
      <div style={s.dowRow}>
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d} style={s.dowCell}>{d}</div>
        ))}
      </div>

      {/* GRID */}
      <div style={s.grid}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} style={s.emptyCell} />;
          const ymd       = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
          const dayMovies = moviesOnDay(movies, ymd);
          const dayBooks  = booksOnDay(books, ymd);
          const dotColor  = movieDotColor(dayMovies.length);
          const todayDay  = isToday(day);
          const hasHealth = healthLogs[ymd] && (
            Object.keys(healthLogs[ymd].food).length > 0 ||
            Object.keys(healthLogs[ymd].workouts).length > 0 ||
            healthLogs[ymd].steps
          );

          return (
            <div
              key={day}
              style={{ ...s.cell, ...(todayDay ? s.todayCell : {}) }}
              onClick={() => { setSelectedDay(ymd); setPopupTab("entertainment"); }}
              onMouseEnter={(e) => { e.currentTarget.style.filter = "brightness(1.35)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.filter = "brightness(1)"; }}
            >
              <span style={{ ...s.dayNum, ...(todayDay ? s.todayNum : {}) }}>{day}</span>

              {dotColor && (
                <div style={{ ...s.movieDot, backgroundColor: dotColor }}>
                  <span style={s.movieDotText}>{dayMovies.length}</span>
                </div>
              )}

              {hasHealth && <div style={s.healthDot} />}

              <div style={s.bookBars}>
                {dayBooks.slice(0, 2).map((b) => (
                  <div key={b.id} style={{ ...s.bookBar, backgroundColor: b.color }} />
                ))}
                {dayBooks.length > 2 && <div style={s.bookBarMore}>+{dayBooks.length - 2}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {/* LEGEND */}
      <div style={s.legend}>
        <div style={s.legendItem}>
          <div style={{ ...s.legendSwatch, backgroundColor: "#1e2a3a", outline: "2px solid #378add", outlineOffset: "1px" }} />
          <span>Today</span>
        </div>
        <div style={s.legendItem}>
          <div style={{ ...s.legendSwatch, borderRadius: "50%", backgroundColor: "#378add" }} />
          <span>1 movie</span>
        </div>
        <div style={s.legendItem}>
          <div style={{ ...s.legendSwatch, borderRadius: "50%", backgroundColor: "#3b9e4a" }} />
          <span>2+ movies</span>
        </div>
        <div style={s.legendItem}>
          <div style={{ ...s.legendSwatch, borderRadius: 2, backgroundColor: "#854f0b" }} />
          <span>Book in progress</span>
        </div>
        <div style={s.legendItem}>
          <div style={{ ...s.legendSwatch, borderRadius: "50%", backgroundColor: "#5db85d" }} />
          <span>Health logged</span>
        </div>
      </div>

      {/* POPUP */}
      {selectedDay && (
        <div style={s.overlay} onClick={() => setSelectedDay(null)}>
          <div style={s.popup} onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div style={s.popupHeader}>
              <span style={s.popupWeekday}>{popupDate.toLocaleString("default", { weekday: "long" })}</span>
              <span style={s.popupDay}>{popupDate.getDate()}</span>
              <span style={s.popupMonth}>{popupDate.toLocaleString("default", { month: "short" })}</span>
              <button style={s.closeBtn} onClick={() => setSelectedDay(null)}>✕</button>
            </div>

            {/* Tabs */}
            <div style={s.tabRow}>
              <button
                style={{ ...s.tab, ...(popupTab === "entertainment" ? s.tabActive : {}) }}
                onClick={() => setPopupTab("entertainment")}
              >
                🎬 Entertainment
              </button>
              <button
                style={{ ...s.tab, ...(popupTab === "health" ? s.tabActive : {}) }}
                onClick={() => setPopupTab("health")}
              >
                💪 Health
              </button>
            </div>

            <div style={s.popupBody}>

              {/* ── ENTERTAINMENT TAB ── */}
              {popupTab === "entertainment" && (
                <>
                  <div style={s.subTitle}>Movies</div>
                  {popupMovies.length === 0 ? (
                    <p style={s.noneText}>No movies logged</p>
                  ) : (
                    popupMovies.map((m) => (
                      <div key={m.id} style={s.popupRow}>
                        <span style={s.rowIcon}>🎞</span>
                        <span style={s.rowText}>{m.title}</span>
                      </div>
                    ))
                  )}
                  <div style={{ ...s.subTitle, marginTop: 12 }}>Books</div>
                  {popupBooks.length === 0 ? (
                    <p style={s.noneText}>No books in progress</p>
                  ) : (
                    popupBooks.map((b) => (
                      <div key={b.id} style={s.popupRow}>
                        <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: b.color, flexShrink: 0 }} />
                        <span style={s.rowText}>{b.title}</span>
                      </div>
                    ))
                  )}
                </>
              )}

              {/* ── HEALTH TAB ── */}
              {popupTab === "health" && (
                <>
                  {/* Summary cards */}
                  <div style={s.healthCards}>
                    <div style={s.healthCard}>
                      <span style={s.healthCardLabel}>Consumed</span>
                      <span style={s.healthCardVal}>{intake}</span>
                      <span style={s.healthCardUnit}>cal</span>
                    </div>
                    <div style={s.healthCard}>
                      <span style={s.healthCardLabel}>Burned</span>
                      <span style={{ ...s.healthCardVal, color: "#5db85d" }}>{burned}</span>
                      <span style={s.healthCardUnit}>cal</span>
                    </div>
                    <div style={s.healthCard}>
                      <span style={s.healthCardLabel}>Net</span>
                      <span style={{ ...s.healthCardVal, color: net > 0 ? "#e07070" : "#5db85d" }}>
                        {net > 0 ? "+" : ""}{net}
                      </span>
                      <span style={s.healthCardUnit}>cal</span>
                    </div>
                    <div style={s.healthCard}>
                      <span style={s.healthCardLabel}>Protein</span>
                      <span style={{ ...s.healthCardVal, color: proteinColor }}>{protein}</span>
                      <span style={s.healthCardUnit}>g</span>
                    </div>
                  </div>

                  {/* Food logged */}
                  <div style={s.subTitle}>Food logged</div>
                  {loggedFood.length === 0 ? (
                    <p style={s.noneText}>Nothing logged</p>
                  ) : (
                    loggedFood.map((item) => (
                      <div key={item.id} style={s.popupRow}>
                        <span style={s.rowIcon}>🍽</span>
                        <span style={s.rowText}>{item.name} · {item.grams}g</span>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                          <span style={s.rowCals}>{item.cal} cal</span>
                          <span style={{ ...s.rowCals, color: "#378add" }}>{item.protein}g prot</span>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Steps */}
                  {popupLog.steps && (
                    <>
                      <div style={{ ...s.subTitle, marginTop: 8 }}>Steps</div>
                      <div style={s.popupRow}>
                        <span style={s.rowIcon}>👟</span>
                        <span style={s.rowText}>{Number(popupLog.steps).toLocaleString()} steps</span>
                        <span style={s.rowCals}>{Math.round(popupLog.steps * 0.0425)} cal</span>
                      </div>
                    </>
                  )}
                </>
              )}

            </div>
            <p style={s.popupHint}>Click outside to close</p>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page:        { display: "flex", flexDirection: "column", height: "100%", fontFamily: "sans-serif", backgroundColor: "#141414", color: "#eee", userSelect: "none" },
  topBar:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", backgroundColor: "#1c1c1c", borderBottom: "1px solid #2a2a2a" },
  navBtn:      { background: "none", border: "1px solid #3a3a3a", borderRadius: 8, padding: "4px 14px", cursor: "pointer", fontSize: 13, color: "#888" },
  monthLabel:  { fontSize: 18, fontWeight: 700, color: "#eee" },
  dowRow:      { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid #2a2a2a", backgroundColor: "#1a1a1a" },
  dowCell:     { textAlign: "center", fontSize: 11, fontWeight: 700, color: "#555", padding: "8px 0", letterSpacing: "0.05em" },
  grid:        { flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr", gap: 1, backgroundColor: "#2a2a2a", overflow: "hidden" },
  emptyCell:   { backgroundColor: "#141414" },
  cell:        { backgroundColor: "#1a1a1a", padding: "6px 8px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 3, position: "relative", transition: "filter 0.15s" },
  todayCell:   { backgroundColor: "#1e2a3a", outline: "2px solid #378add", outlineOffset: "-2px", zIndex: 1 },
  dayNum:      { fontSize: 13, fontWeight: 500, color: "#888" },
  todayNum:    { color: "#378add", fontWeight: 700 },
  movieDot:    { position: "absolute", top: 6, right: 6, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  movieDotText:{ fontSize: 9, fontWeight: 700, color: "#fff" },
  healthDot:   { position: "absolute", top: 6, right: 28, width: 8, height: 8, borderRadius: "50%", backgroundColor: "#5db85d" },
  bookBars:    { marginTop: "auto", display: "flex", flexDirection: "column", gap: 2 },
  bookBar:     { height: 3, borderRadius: 2, width: "100%" },
  bookBarMore: { fontSize: 8, color: "#555" },
  legend:      { display: "flex", gap: 16, padding: "10px 24px", backgroundColor: "#1a1a1a", borderTop: "1px solid #2a2a2a", flexWrap: "wrap" },
  legendItem:  { display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#666" },
  legendSwatch:{ width: 13, height: 13, borderRadius: 3, flexShrink: 0 },

  overlay:     { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  popup:       { backgroundColor: "#fff", borderRadius: 16, width: 400, maxHeight: "82vh", overflowY: "auto", display: "flex", flexDirection: "column" },
  popupHeader: { display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 24px 12px", borderBottom: "1px solid #eee", position: "relative" },
  popupWeekday:{ fontSize: 12, color: "#aaa" },
  popupDay:    { fontSize: 48, fontWeight: 700, color: "#222", lineHeight: 1.1 },
  popupMonth:  { fontSize: 13, color: "#aaa" },
  closeBtn:    { position: "absolute", top: 16, right: 16, background: "none", border: "none", fontSize: 16, color: "#bbb", cursor: "pointer" },

  tabRow:      { display: "flex", borderBottom: "1px solid #eee" },
  tab:         { flex: 1, padding: "10px 0", background: "none", border: "none", fontSize: 13, fontWeight: 500, color: "#aaa", cursor: "pointer" },
  tabActive:   { color: "#7c3aed", borderBottom: "2px solid #7c3aed" },

  popupBody:   { padding: "16px 24px 8px", display: "flex", flexDirection: "column", gap: 6 },
  subTitle:    { fontSize: 11, fontWeight: 700, color: "#aaa", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 },
  noneText:    { fontSize: 12, color: "#ccc", fontStyle: "italic" },
  popupRow:    { display: "flex", alignItems: "center", gap: 8, backgroundColor: "#f5f5f5", borderRadius: 8, padding: "7px 10px" },
  rowIcon:     { fontSize: 14 },
  rowText:     { flex: 1, fontSize: 13, fontWeight: 500, color: "#333" },
  rowCals:     { fontSize: 11, color: "#aaa" },
  popupHint:   { fontSize: 11, color: "#ccc", textAlign: "center", padding: "8px 0 14px" },

  healthCards:     { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 },
  healthCard:      { backgroundColor: "#f5f5f5", borderRadius: 10, padding: "10px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  healthCardLabel: { fontSize: 9, color: "#aaa", fontWeight: 700, textTransform: "uppercase", textAlign: "center" },
  healthCardVal:   { fontSize: 18, fontWeight: 700, color: "#222" },
  healthCardUnit:  { fontSize: 10, color: "#aaa" },
};