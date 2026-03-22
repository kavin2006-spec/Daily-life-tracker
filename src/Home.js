import React, { useState } from "react";
import { calcRecipeNutrition } from "./Data";

const PAGE_CSS = `
  .hm-page {
    display: flex; flex-direction: column; height: 100%;
    font-family: 'IBM Plex Mono', monospace;
    background: var(--bg); color: var(--cream);
    user-select: none;
  }

  /* Top bar */
  .hm-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 22px; height: 52px;
    background: var(--surface); border-bottom: 1px solid var(--border);
    flex-shrink: 0; position: relative;
  }
  .hm-topbar::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg,
      transparent 0%, var(--blue-dim) 15%,
      var(--gold) 50%, var(--blue-dim) 85%, transparent 100%);
  }
  .hm-wordmark {
    font-family: 'Bebas Neue', sans-serif; font-size: 11px;
    letter-spacing: 0.3em; color: var(--gold); opacity: 0.65;
  }
  .hm-month-nav { display: flex; align-items: center; gap: 14px; }
  .hm-month-display { text-align: center; min-width: 180px; }
  .hm-month-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 26px;
    letter-spacing: 0.12em; color: var(--cream); line-height: 1; display: block;
  }
  .hm-month-sub { font-size: 11px; letter-spacing: 0.2em; color: var(--gold); display: block; margin-top: 1px; }
  .hm-nav-btn {
    width: 28px; height: 28px; background: none;
    border: 1px solid var(--border-blue); border-radius: 2px;
    color: var(--blue); font-size: 15px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }
  .hm-nav-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-lo); }

  /* DOW */
  .hm-dow-row {
    display: grid; grid-template-columns: repeat(7, 1fr);
    border-bottom: 1px solid var(--border);
    background: var(--surface); flex-shrink: 0;
  }
  .hm-dow-cell {
    text-align: center; font-size: 11px; font-weight: 700;
    color: var(--cream-mid); padding: 7px 0;
    letter-spacing: 0.12em; text-transform: uppercase;
  }

  /* Grid */
  .hm-grid {
    flex: 1; display: grid; grid-template-columns: repeat(7, 1fr);
    grid-auto-rows: 1fr; gap: 1px;
    background: rgba(212,168,75,0.06); overflow: hidden;
  }
  .hm-empty-cell { background: var(--bg); }
  .hm-cell {
    background: var(--surface2); padding: 6px 8px; cursor: pointer;
    display: flex; flex-direction: column; gap: 3px;
    position: relative; transition: filter 0.15s;
  }
  .hm-cell:hover { filter: brightness(1.3); }
  .hm-cell-today {
    background: var(--surface3);
    outline: 1px solid var(--gold); outline-offset: -1px; z-index: 1;
  }
  .hm-day-num { font-size: 11px; color: var(--cream-mid); letter-spacing: 0.04em; }
  .hm-day-num-today { color: var(--gold); font-weight: 700; }

  /* Indicators */
  .hm-movie-dot {
    position: absolute; top: 5px; right: 5px;
    width: 16px; height: 16px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .hm-movie-dot-text { font-size: 11px; font-weight: 700; color: var(--bg); }
  .hm-health-dot {
    position: absolute; top: 5px; right: 24px;
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--green);
  }
  .hm-book-bars { margin-top: auto; display: flex; flex-direction: column; gap: 2px; }
  .hm-book-bar  { height: 2px; border-radius: 1px; width: 100%; }
  .hm-book-more { font-size: 11px; color: var(--cream-lo); letter-spacing: 0.06em; }

  /* Legend */
  .hm-legend {
    display: flex; gap: 16px; padding: 8px 22px;
    background: var(--surface); border-top: 1px solid var(--border);
    flex-wrap: wrap; flex-shrink: 0;
  }
  .hm-legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--cream-mid); letter-spacing: 0.06em; }
  .hm-legend-swatch { width: 11px; height: 11px; border-radius: 1px; flex-shrink: 0; }

  /* Popup */
  @keyframes hm-popup-in {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to   { opacity: 1; transform: none; }
  }
  .hm-overlay {
    position: fixed; inset: 0; background: rgba(8,8,12,0.88);
    display: flex; align-items: center; justify-content: center;
    z-index: 500; backdrop-filter: blur(4px);
  }
  .hm-popup {
    background: var(--surface); border: 1px solid var(--border-blue);
    border-radius: 3px; width: 400px; max-height: 82vh;
    overflow-y: auto; display: flex; flex-direction: column;
    animation: hm-popup-in 0.18s ease;
    box-shadow: 0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(212,168,75,0.08);
    scrollbar-width: thin; scrollbar-color: var(--gold-dim) transparent;
  }
  .hm-popup-header {
    display: flex; flex-direction: column; align-items: center;
    padding: 18px 20px 12px; border-bottom: 1px solid var(--border);
    position: relative; background: var(--surface2); flex-shrink: 0;
  }
  .hm-popup-header::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--blue-dim), var(--gold-dim), transparent);
  }
  .hm-popup-weekday { font-size: 11px; color: var(--cream-mid); letter-spacing: 0.14em; text-transform: uppercase; }
  .hm-popup-day {
    font-family: 'Bebas Neue', sans-serif; font-size: 52px;
    letter-spacing: 0.05em; color: var(--cream); line-height: 1;
  }
  .hm-popup-month { font-size: 11px; color: var(--gold); letter-spacing: 0.14em; }
  .hm-close-btn {
    position: absolute; top: 14px; right: 14px;
    background: none; border: 1px solid var(--border); border-radius: 2px;
    color: var(--cream-mid); font-size: 12px; cursor: pointer;
    width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;
    transition: border-color 0.15s, color 0.15s;
  }
  .hm-close-btn:hover { border-color: var(--red); color: var(--red); }

  .hm-tab-row { display: flex; border-bottom: 1px solid var(--border); flex-shrink: 0; }
  .hm-tab {
    flex: 1; padding: 9px 0; background: none; border: none;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--cream-mid); cursor: pointer; transition: color 0.15s;
  }
  .hm-tab:hover { color: var(--cream); }
  .hm-tab-active { color: var(--gold); border-bottom: 2px solid var(--gold); }

  .hm-popup-body { padding: 14px 18px 16px; display: flex; flex-direction: column; gap: 8px; }
  .hm-sub-title {
    font-size: 12px; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--blue); margin-bottom: 4px;
  }
  .hm-none-text { font-size: 11px; color: var(--cream-lo); font-style: italic; }
  .hm-popup-row {
    display: flex; align-items: center; gap: 8px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 2px; padding: 7px 10px;
  }
  .hm-row-icon { font-size: 13px; }
  .hm-row-text { flex: 1; font-size: 11px; color: var(--cream); letter-spacing: 0.03em; }
  .hm-row-meta { font-size: 11px; color: var(--cream-mid); display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }

  /* Health summary cards in popup */
  .hm-health-cards {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 10px;
  }
  .hm-health-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 2px; padding: 8px 6px;
    display: flex; flex-direction: column; align-items: center; gap: 2px;
  }
  .hm-health-card-label { font-size: 10px; color: var(--cream-mid); letter-spacing: 0.1em; text-transform: uppercase; text-align: center; }
  .hm-health-card-val   { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: var(--cream); line-height: 1; }
  .hm-health-card-unit  { font-size: 11px; color: var(--cream-mid); }

  .hm-popup-hint { font-size: 11px; color: var(--cream-lo); text-align: center; padding: 8px 0 12px; letter-spacing: 0.08em; }

  @media (max-width: 480px) {
    .hm-topbar { padding: 0 14px; }
    .hm-legend { padding: 7px 14px; }
    .hm-popup  { width: calc(100vw - 24px); }
    .hm-wordmark { display: none; }
    .hm-month-name { font-size: 22px; }
    .hm-health-cards { grid-template-columns: repeat(2, 1fr); }
  }
`;

function moviesOnDay(movies, ymd)  { return movies.filter((m) => m.date === ymd); }
function booksOnDay(books, ymd)    { return books.filter((b) => b.startDate <= ymd && b.endDate >= ymd); }
function movieDotColor(count)      { if (!count) return null; return count === 1 ? "var(--blue)" : "var(--green)"; }

function calcDayNutrition(ingredients, recipes, log) {
  let cal = 0, protein = 0;
  Object.entries(log.food).forEach(([recipeId, gramsEaten]) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;
    const n = calcRecipeNutrition(ingredients, recipe, Number(gramsEaten));
    cal += n.cal; protein += n.protein;
  });
  return { cal: Math.round(cal), protein: Math.round(protein * 10) / 10 };
}
function calcBurned(workouts, log) {
  let total = Object.entries(log.workouts).reduce((sum, [id, sets]) => {
    const w = workouts.find((w) => w.id === id);
    return sum + (w ? w.calsPerSet * sets : 0);
  }, 0);
  total += (parseFloat(log.steps) || 0) * 0.0425;
  return Math.round(total);
}

const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

export default function HomePage({ movies, books, healthLogs, updateHealthLog, workouts, ingredients, recipes }) {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay,  setSelectedDay]  = useState(null);
  const [popupTab,     setPopupTab]     = useState("entertainment");

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  const firstDow    = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

  const popupMovies = selectedDay ? moviesOnDay(movies, selectedDay) : [];
  const popupBooks  = selectedDay ? booksOnDay(books, selectedDay)   : [];
  const popupLog    = selectedDay ? (healthLogs[selectedDay] || { food: {}, workouts: {}, steps: "" }) : null;
  const { cal: intake, protein } = popupLog
    ? calcDayNutrition(ingredients, recipes, popupLog) : { cal: 0, protein: 0 };
  const burned    = popupLog ? calcBurned(workouts, popupLog) : 0;
  const net       = intake - burned;
  const popupDate = selectedDay ? new Date(selectedDay + "T00:00:00") : null;
  const proteinColor = protein >= 100 && protein <= 130 ? "var(--green)" : "var(--red)";

  const loggedFood = popupLog
    ? Object.entries(popupLog.food).map(([recipeId, gramsEaten]) => {
        const recipe = recipes.find((r) => r.id === recipeId);
        if (!recipe) return null;
        const { cal, protein: p } = calcRecipeNutrition(ingredients, recipe, Number(gramsEaten));
        return { id: recipeId, name: recipe.name, grams: gramsEaten, cal, protein: p };
      }).filter(Boolean)
    : [];

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div className="hm-page">

        {/* Top bar */}
        <div className="hm-topbar">
          <span className="hm-wordmark">Life Tracker</span>
          <div className="hm-month-nav">
            <button className="hm-nav-btn" onClick={prevMonth}>‹</button>
            <div className="hm-month-display">
              <span className="hm-month-name">{MONTHS[currentMonth]}</span>
              <span className="hm-month-sub">{currentYear}</span>
            </div>
            <button className="hm-nav-btn" onClick={nextMonth}>›</button>
          </div>
          <span style={{ width: 80 }} />
        </div>

        {/* DOW */}
        <div className="hm-dow-row">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="hm-dow-cell">{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div className="hm-grid">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} className="hm-empty-cell" />;
            const ymd       = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
            const dayMovies = moviesOnDay(movies, ymd);
            const dayBooks  = booksOnDay(books, ymd);
            const dotColor  = movieDotColor(dayMovies.length);
            const isT       = isToday(day);
            const hasHealth = healthLogs[ymd] && (
              Object.keys(healthLogs[ymd].food).length > 0 ||
              Object.keys(healthLogs[ymd].workouts).length > 0 ||
              healthLogs[ymd].steps
            );
            return (
              <div key={day}
                className={`hm-cell${isT ? " hm-cell-today" : ""}`}
                onClick={() => { setSelectedDay(ymd); setPopupTab("entertainment"); }}
              >
                <span className={`hm-day-num${isT ? " hm-day-num-today" : ""}`}>{day}</span>
                {dotColor && (
                  <div className="hm-movie-dot" style={{ background: dotColor }}>
                    <span className="hm-movie-dot-text">{dayMovies.length}</span>
                  </div>
                )}
                {hasHealth && <div className="hm-health-dot" />}
                <div className="hm-book-bars">
                  {dayBooks.slice(0, 2).map((b) => (
                    <div key={b.id} className="hm-book-bar" style={{ backgroundColor: b.color }} />
                  ))}
                  {dayBooks.length > 2 && (
                    <div className="hm-book-more">+{dayBooks.length - 2}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="hm-legend">
          <div className="hm-legend-item">
            <div className="hm-legend-swatch" style={{ background: "var(--surface3)", outline: "1px solid var(--gold)", outlineOffset: "1px" }} />
            <span>today</span>
          </div>
          <div className="hm-legend-item">
            <div className="hm-legend-swatch" style={{ borderRadius: "50%", background: "var(--blue)" }} />
            <span>1 movie</span>
          </div>
          <div className="hm-legend-item">
            <div className="hm-legend-swatch" style={{ borderRadius: "50%", background: "var(--green)" }} />
            <span>2+ movies</span>
          </div>
          <div className="hm-legend-item">
            <div className="hm-legend-swatch" style={{ borderRadius: 1, background: "var(--gold-dim)" }} />
            <span>book in progress</span>
          </div>
          <div className="hm-legend-item">
            <div className="hm-legend-swatch" style={{ borderRadius: "50%", background: "var(--green)" }} />
            <span>health logged</span>
          </div>
        </div>

        {/* Popup */}
        {selectedDay && (
          <div className="hm-overlay" onClick={() => setSelectedDay(null)}>
            <div className="hm-popup" onClick={(e) => e.stopPropagation()}>

              <div className="hm-popup-header">
                <div className="hm-popup-weekday">
                  {popupDate.toLocaleString("default", { weekday: "long" })}
                </div>
                <div className="hm-popup-day">{popupDate.getDate()}</div>
                <div className="hm-popup-month">
                  {popupDate.toLocaleString("default", { month: "short" })} {popupDate.getFullYear()}
                </div>
                <button className="hm-close-btn" onClick={() => setSelectedDay(null)}>✕</button>
              </div>

              <div className="hm-tab-row">
                <button
                  className={`hm-tab${popupTab === "entertainment" ? " hm-tab-active" : ""}`}
                  onClick={() => setPopupTab("entertainment")}>entertainment</button>
                <button
                  className={`hm-tab${popupTab === "health" ? " hm-tab-active" : ""}`}
                  onClick={() => setPopupTab("health")}>health</button>
              </div>

              <div className="hm-popup-body">

                {popupTab === "entertainment" && (
                  <>
                    <div className="hm-sub-title">Movies</div>
                    {popupMovies.length === 0
                      ? <p className="hm-none-text">no movies logged</p>
                      : popupMovies.map((m) => (
                          <div key={m.id} className="hm-popup-row">
                            <span className="hm-row-icon">🎞</span>
                            <span className="hm-row-text">{m.title}</span>
                          </div>
                        ))
                    }
                    <div className="hm-sub-title" style={{ marginTop: 10 }}>Books</div>
                    {popupBooks.length === 0
                      ? <p className="hm-none-text">no books in progress</p>
                      : popupBooks.map((b) => (
                          <div key={b.id} className="hm-popup-row">
                            <div style={{ width: 8, height: 8, borderRadius: 1, background: b.color, flexShrink: 0 }} />
                            <span className="hm-row-text">{b.title}</span>
                          </div>
                        ))
                    }
                  </>
                )}

                {popupTab === "health" && (
                  <>
                    <div className="hm-health-cards">
                      {[
                        { label: "Consumed", val: intake, unit: "cal", color: "var(--red)" },
                        { label: "Burned",   val: burned, unit: "cal", color: "var(--green)" },
                        { label: "Net",      val: `${net > 0 ? "+" : ""}${net}`, unit: "cal", color: net > 0 ? "var(--red)" : "var(--green)" },
                        { label: "Protein",  val: protein, unit: "g",  color: proteinColor },
                      ].map((c) => (
                        <div key={c.label} className="hm-health-card">
                          <span className="hm-health-card-label">{c.label}</span>
                          <span className="hm-health-card-val" style={{ color: c.color }}>{c.val}</span>
                          <span className="hm-health-card-unit">{c.unit}</span>
                        </div>
                      ))}
                    </div>

                    <div className="hm-sub-title">Food logged</div>
                    {loggedFood.length === 0
                      ? <p className="hm-none-text">nothing logged</p>
                      : loggedFood.map((item) => (
                          <div key={item.id} className="hm-popup-row">
                            <span className="hm-row-icon">🍽</span>
                            <span className="hm-row-text">{item.name} · {item.grams}g</span>
                            <div className="hm-row-meta">
                              <span style={{ color: "var(--red)" }}>{item.cal} cal</span>
                              <span style={{ color: "var(--blue)" }}>{item.protein}g prot</span>
                            </div>
                          </div>
                        ))
                    }
                    {popupLog.steps && (
                      <>
                        <div className="hm-sub-title" style={{ marginTop: 6 }}>Steps</div>
                        <div className="hm-popup-row">
                          <span className="hm-row-icon">👟</span>
                          <span className="hm-row-text">{Number(popupLog.steps).toLocaleString()} steps</span>
                          <span style={{ fontSize: 9, color: "var(--cream-mid)" }}>
                            {Math.round(popupLog.steps * 0.0425)} cal
                          </span>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              <p className="hm-popup-hint">click outside to close</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
