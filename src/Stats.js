import React, { useState } from "react";
import { calcRecipeNutrition } from "./Data";
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ReferenceLine, ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import { buildCalorieData, buildStepsData, buildProteinData } from "./Statsgraph";

const PAGE_CSS = `
  .st-page {
    display: flex; flex-direction: column; height: 100%;
    font-family: 'IBM Plex Mono', monospace;
    background: var(--bg); color: var(--cream);
  }

  .st-topbar {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 22px; height: 52px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0; position: relative;
  }
  .st-topbar::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg,
      transparent 0%, var(--blue-dim) 15%,
      var(--gold) 50%, var(--blue-dim) 85%, transparent 100%);
  }
  .st-wordmark {
    font-family: 'Bebas Neue', sans-serif; font-size: 11px;
    letter-spacing: 0.3em; color: var(--gold); opacity: 0.65;
  }
  .st-month-nav { display: flex; align-items: center; gap: 14px; }
  .st-month-display { text-align: center; min-width: 180px; }
  .st-month-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 26px;
    letter-spacing: 0.12em; color: var(--cream); line-height: 1; display: block;
  }
  .st-month-sub { font-size: 9px; letter-spacing: 0.2em; color: var(--gold); display: block; margin-top: 1px; }
  .st-nav-btn {
    width: 28px; height: 28px; background: none;
    border: 1px solid var(--border-blue); border-radius: 2px;
    color: var(--blue); font-size: 15px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }
  .st-nav-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-lo); }

  .st-scroll {
    flex: 1; overflow-y: auto; padding: 22px;
    scrollbar-width: thin; scrollbar-color: var(--gold-dim) transparent;
    display: flex; flex-direction: column; gap: 26px;
  }

  .st-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
  }
  .st-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 3px; padding: 16px 14px 14px;
    display: flex; flex-direction: column; gap: 10px;
    position: relative; overflow: hidden;
    transition: border-color 0.15s;
  }
  .st-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
  }
  .st-card:hover { border-color: var(--border-blue); }
  .st-card-icon {
    width: 32px; height: 32px; border-radius: 2px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; flex-shrink: 0;
  }
  .st-card-value {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px; letter-spacing: 0.05em; line-height: 1;
  }
  .st-card-label {
    font-size: 8px; color: var(--cream-mid);
    letter-spacing: 0.12em; text-transform: uppercase;
  }

  .st-section-label {
    font-size: 8px; font-weight: 700; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--gold);
    display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
  }
  .st-section-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--border), transparent);
  }

  .st-list-card {
    background: var(--surface);
    border: 1px solid var(--border); border-radius: 3px; overflow: hidden;
  }
  .st-list-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; border-top: 1px solid rgba(212,168,75,0.07);
    transition: background 0.12s;
  }
  .st-list-row:first-child { border-top: none; }
  .st-list-row:hover { background: var(--surface2); }
  .st-list-left { display: flex; align-items: center; gap: 8px; }
  .st-list-title { font-size: 11px; color: var(--cream); letter-spacing: 0.03em; }
  .st-list-sub { font-size: 10px; color: var(--cream-mid); letter-spacing: 0.05em; }
  .st-list-value { font-size: 11px; color: var(--cream-mid); font-weight: 700; letter-spacing: 0.06em; }
  .st-book-dot { width: 8px; height: 8px; border-radius: 1px; flex-shrink: 0; }
  .st-badge {
    font-size: 8px; font-weight: 700; letter-spacing: 0.12em;
    text-transform: uppercase; padding: 2px 7px; border-radius: 2px;
  }
  .st-badge-reading { background: var(--surface3); color: var(--cream-mid); }
  .st-badge-done    { background: var(--green-dim); color: var(--green); }
  .st-empty { font-size: 11px; color: var(--cream-lo); font-style: italic; padding: 14px; }

  .chart-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 18px 16px 14px;
  }
  .chart-card h2 {
    font-size: 8px; font-weight: 700; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--gold);
    margin: 0 0 14px;
  }

  /* Smart summaries */
  .st-smart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .st-smart-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 14px;
    display: flex; flex-direction: column; gap: 8px;
    position: relative; overflow: hidden;
  }
  .st-smart-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
  }
  .st-smart-card.best::before  { background: var(--green); opacity: 0.7; }
  .st-smart-card.worst::before { background: var(--red);   opacity: 0.7; }
  .st-smart-card.wow::before   { background: var(--gold);  opacity: 0.7; }
  .st-smart-header {
    display: flex; align-items: center; justify-content: space-between;
  }
  .st-smart-tag {
    font-size: 7px; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; padding: 2px 7px; border-radius: 2px;
  }
  .st-smart-tag.best  { background: var(--green-lo); color: var(--green); }
  .st-smart-tag.worst { background: var(--red-lo);   color: var(--red);   }
  .st-smart-tag.wow   { background: var(--gold-lo);  color: var(--gold);  }
  .st-smart-date {
    font-family: 'Bebas Neue', sans-serif; font-size: 22px;
    letter-spacing: 0.08em; line-height: 1;
  }
  .st-smart-date.best  { color: var(--green); }
  .st-smart-date.worst { color: var(--red);   }
  .st-smart-reasons {
    display: flex; flex-direction: column; gap: 4px;
    border-top: 1px solid rgba(212,168,75,0.08);
    padding-top: 8px; margin-top: 2px;
  }
  .st-smart-reason {
    font-size: 10px; color: var(--cream-mid); letter-spacing: 0.03em;
    display: flex; align-items: center; gap: 6px;
  }
  .st-smart-reason span { color: var(--cream); font-weight: 700; }

  /* Week-over-week */
  .st-wow-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 3px; padding: 14px;
    position: relative; overflow: hidden;
  }
  .st-wow-card::before {
    content: ''; position: absolute;
    top: 0; left: 0; right: 0; height: 2px;
    background: var(--gold); opacity: 0.7;
  }
  .st-wow-rows { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
  .st-wow-row {
    display: flex; align-items: center; gap: 10px;
  }
  .st-wow-metric {
    font-size: 9px; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--cream-mid); width: 110px; flex-shrink: 0;
  }
  .st-wow-bar-wrap {
    flex: 1; display: flex; flex-direction: column; gap: 3px;
  }
  .st-wow-bars { display: flex; gap: 4px; align-items: center; }
  .st-wow-bar-bg {
    flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden;
  }
  .st-wow-bar-fill { height: 100%; border-radius: 2px; transition: width 0.4s ease; }
  .st-wow-vals {
    display: flex; justify-content: space-between;
    font-size: 9px; color: var(--cream-lo); letter-spacing: 0.04em;
  }
  .st-wow-delta {
    font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
    min-width: 52px; text-align: right; flex-shrink: 0;
  }
  .st-wow-delta.up   { color: var(--green); }
  .st-wow-delta.down { color: var(--red);   }
  .st-wow-delta.flat { color: var(--cream-lo); }
  .st-wow-weeks {
    display: flex; gap: 14px; margin-bottom: 10px;
  }
  .st-wow-week-label {
    display: flex; align-items: center; gap: 5px;
    font-size: 9px; color: var(--cream-mid); letter-spacing: 0.06em;
  }
  .st-wow-swatch { width: 8px; height: 8px; border-radius: 1px; }

  @media (max-width: 480px) {
    .st-topbar { padding: 0 14px; }
    .st-scroll  { padding: 14px; }
    .st-wordmark { display: none; }
    .st-month-name { font-size: 22px; }
    .st-smart-grid { grid-template-columns: 1fr; }
  }
`;

function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function toYMD(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const MONTHS = ["January","February","March","April","May","June",
  "July","August","September","October","November","December"];

export default function StatsPage({ movies, books, healthLogs, workouts, ingredients, recipes }) {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  const totalDays = daysInMonth(currentYear, currentMonth);
  const mStart    = toYMD(currentYear, currentMonth, 1);
  const mEnd      = toYMD(currentYear, currentMonth, totalDays);

  // ── Movies ──────────────────────────────────────────────
  const monthMovies = movies.filter((m) => {
    const d = new Date(m.date);
    return d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear;
  });
  const moviesByDay = {};
  monthMovies.forEach((m) => { moviesByDay[m.date] = (moviesByDay[m.date] || 0) + 1; });
  const movieMarathonDays = Object.values(moviesByDay).filter((c) => c >= 2).length;

  // ── Books ───────────────────────────────────────────────
  const monthBooks    = books.filter((b) => b.startDate <= mEnd && b.endDate >= mStart);
  const finishedBooks = books.filter((b) => {
    const end = new Date(b.endDate);
    return end.getUTCMonth() === currentMonth && end.getUTCFullYear() === currentYear;
  });

  // ── Health totals ────────────────────────────────────────
  let totalConsumed = 0, totalBurned = 0, totalSteps = 0, daysLogged = 0;
  Object.entries(healthLogs).forEach(([ymd, log]) => {
    if (ymd < mStart || ymd > mEnd) return;
    daysLogged++;
    Object.entries(log.food).forEach(([recipeId, gramsEaten]) => {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) return;
      const { cal } = calcRecipeNutrition(ingredients, recipe, Number(gramsEaten));
      totalConsumed += cal;
    });
    Object.entries(log.workouts).forEach(([id, sets]) => {
      const w = workouts.find((w) => w.id === id);
      if (w) totalBurned += w.calsPerSet * sets;
    });
    totalSteps  += parseFloat(log.steps) || 0;
    totalBurned += (parseFloat(log.steps) || 0) * 0.0425;
  });
  totalBurned = Math.round(totalBurned);
  const avgSteps = daysLogged > 0 ? Math.round(totalSteps / daysLogged) : 0;

  // ── Chart data (filtered to current month) ───────────────
  const monthLogs = Object.fromEntries(
    Object.entries(healthLogs).filter(([ymd]) => ymd >= mStart && ymd <= mEnd)
  );
  const calorieData = buildCalorieData(monthLogs, ingredients, recipes, workouts);
  const stepsData   = buildStepsData(monthLogs);
  const proteinData = buildProteinData(monthLogs, ingredients, recipes);

  // ── Smart summaries ──────────────────────────────────────

  // Score each logged day: deficit (0–2) + steps (0–2) + protein in range (0–2) = max 6
  function scoreDays(logs) {
    return Object.entries(logs)
      .filter(([ymd]) => ymd >= mStart && ymd <= mEnd)
      .map(([ymd, log]) => {
        const entry = calorieData.find((d) => d.date === ymd.slice(5));
        const stepEntry = stepsData.find((d) => d.date === ymd.slice(5));
        const protEntry = proteinData.find((d) => d.date === ymd.slice(5));

        const consumed = entry?.consumed ?? 0;
        const burned   = entry?.burned   ?? 0;
        const steps    = stepEntry?.steps  ?? 0;
        const protein  = protEntry?.protein ?? 0;

        const deficit = consumed - burned;
        // deficit score: negative deficit (deficit) = 2, small surplus = 1, large surplus = 0
        const defScore = deficit < 0 ? 2 : deficit < 300 ? 1 : 0;
        // steps score
        const stepScore = steps >= 10000 ? 2 : steps >= 7000 ? 1 : 0;
        // protein score
        const protScore = protein >= 100 && protein <= 130 ? 2 : (protein >= 80 && protein < 100) || (protein > 130 && protein <= 150) ? 1 : 0;

        return {
          date: ymd,
          score: defScore + stepScore + protScore,
          consumed, burned, deficit, steps, protein,
          defScore, stepScore, protScore,
        };
      })
      .filter((d) => d.consumed > 0); // skip days with no food logged
  }

  const scoredDays = scoreDays(healthLogs);
  const bestDay  = scoredDays.length ? scoredDays.reduce((a, b) => a.score >= b.score ? a : b) : null;
  const worstDay = scoredDays.length ? scoredDays.reduce((a, b) => a.score <= b.score ? a : b) : null;

  // Week-over-week: split month into 7-day buckets, compare last two complete-ish weeks
  function weekAvg(days) {
    if (!days.length) return { consumed: 0, burned: 0, steps: 0, protein: 0 };
    const sum = days.reduce((acc, d) => ({
      consumed: acc.consumed + d.consumed,
      burned:   acc.burned   + d.burned,
      steps:    acc.steps    + d.steps,
      protein:  acc.protein  + d.protein,
    }), { consumed: 0, burned: 0, steps: 0, protein: 0 });
    return {
      consumed: Math.round(sum.consumed / days.length),
      burned:   Math.round(sum.burned   / days.length),
      steps:    Math.round(sum.steps    / days.length),
      protein:  Math.round(sum.protein  / days.length),
    };
  }

  const allDayData = calorieData.map((c) => {
    const s = stepsData.find((d) => d.date === c.date);
    const p = proteinData.find((d) => d.date === c.date);
    return { date: c.date, consumed: c.consumed, burned: c.burned,
             steps: s?.steps ?? 0, protein: p?.protein ?? 0 };
  });

  const today2      = new Date();
  const todayDay    = currentYear === today2.getFullYear() && currentMonth === today2.getMonth()
    ? today2.getDate() : totalDays;
  const thisWeekEnd = todayDay;
  const thisWeekStart = Math.max(1, thisWeekEnd - 6);
  const prevWeekEnd   = thisWeekStart - 1;
  const prevWeekStart = Math.max(1, prevWeekEnd - 6);

  const inRange = (d, s, e) => {
    const day = parseInt(d.split("-")[1], 10);
    return day >= s && day <= e;
  };
  const thisWeekDays = allDayData.filter((d) => inRange(d.date, thisWeekStart, thisWeekEnd));
  const prevWeekDays = allDayData.filter((d) => inRange(d.date, prevWeekStart, prevWeekEnd));
  const thisWeek = weekAvg(thisWeekDays);
  const prevWeek = weekAvg(prevWeekDays);

  function wowDelta(curr, prev, higherIsBetter = true) {
    if (!prev) return { pct: 0, dir: "flat" };
    const pct = prev === 0 ? 0 : Math.round(((curr - prev) / prev) * 100);
    const dir = pct === 0 ? "flat" : (higherIsBetter ? (pct > 0 ? "up" : "down") : (pct < 0 ? "up" : "down"));
    return { pct: Math.abs(pct), dir };
  }

  const wowMetrics = [
    { label: "Avg calories",  curr: thisWeek.consumed, prev: prevWeek.consumed, higherIsBetter: false, unit: "kcal" },
    { label: "Avg burned",    curr: thisWeek.burned,   prev: prevWeek.burned,   higherIsBetter: true,  unit: "kcal" },
    { label: "Avg steps",     curr: thisWeek.steps,    prev: prevWeek.steps,    higherIsBetter: true,  unit: ""     },
    { label: "Avg protein",   curr: thisWeek.protein,  prev: prevWeek.protein,  higherIsBetter: true,  unit: "g"    },
  ];

  function fmtDate(ymd) {
    const [, m, d] = ymd.split("-");
    return `${parseInt(d, 10)} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][parseInt(m,10)-1]}`;
  }

  function reasonText(day) {
    const lines = [];
    if (day.defScore === 2) lines.push({ icon: "🔥", text: "calorie deficit", val: `${Math.abs(day.deficit)} kcal` });
    else if (day.defScore === 0) lines.push({ icon: "📈", text: "large surplus", val: `+${day.deficit} kcal` });
    if (day.stepScore === 2) lines.push({ icon: "👟", text: "steps goal hit", val: day.steps.toLocaleString() });
    else if (day.stepScore === 0) lines.push({ icon: "🦥", text: "low steps", val: day.steps.toLocaleString() });
    if (day.protScore === 2) lines.push({ icon: "💪", text: "protein on target", val: `${day.protein}g` });
    else if (day.protScore === 0) lines.push({ icon: "⚠️", text: "protein off range", val: `${day.protein}g` });
    return lines.slice(0, 3);
  }




  // ── Stat cards & summary ─────────────────────────────────
  const statCards = [
    { label: "Calories consumed", value: totalConsumed.toLocaleString(), color: "var(--red)",   bg: "var(--red-lo)",   stripe: "var(--red)",   icon: "🔥" },
    { label: "Calories burned",   value: totalBurned.toLocaleString(),   color: "var(--green)", bg: "var(--green-lo)", stripe: "var(--green)", icon: "💪" },
    { label: "Total steps",       value: Math.round(totalSteps).toLocaleString(), color: "var(--blue)", bg: "var(--blue-lo)", stripe: "var(--blue)", icon: "👟" },
    { label: "Movies watched",    value: monthMovies.length,             color: "var(--gold)",  bg: "var(--gold-lo)",  stripe: "var(--gold)",  icon: "🎬" },
    { label: "Books in progress", value: monthBooks.length,              color: "var(--blue)",  bg: "var(--blue-lo)",  stripe: "var(--blue)",  icon: "📖" },
    { label: "Books finished",    value: finishedBooks.length,           color: "var(--gold)",  bg: "var(--gold-lo)",  stripe: "var(--gold)",  icon: "✅" },
  ];

  const summaryRows = [
    { label: "Average steps / day",              value: avgSteps.toLocaleString() },
    { label: "Days health logged",               value: daysLogged },
    { label: "Net calories (consumed − burned)", value: (totalConsumed - totalBurned).toLocaleString() },
    { label: "Entertainment items",              value: monthMovies.length + monthBooks.length },
    { label: "Marathon days (2+ movies)",        value: movieMarathonDays },
  ];

  // Recharts tick style to match the app theme
  const tickStyle = { fontSize: 10, fill: "var(--cream-mid)", fontFamily: "IBM Plex Mono" };
  const gridColor = "rgba(212,168,75,0.08)";

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div className="st-page">

        {/* ── Top bar ── */}
        <div className="st-topbar">
          <span className="st-wordmark">Life Tracker</span>
          <div className="st-month-nav">
            <button className="st-nav-btn" onClick={prevMonth}>‹</button>
            <div className="st-month-display">
              <span className="st-month-name">{MONTHS[currentMonth]}</span>
              <span className="st-month-sub">{currentYear} · overview</span>
            </div>
            <button className="st-nav-btn" onClick={nextMonth}>›</button>
          </div>
          <span style={{ width: 80 }} />
        </div>

        <div className="st-scroll">

          {/* ── Stat cards ── */}
          <div className="st-card-grid">
            {statCards.map((st) => (
              <div key={st.label} className="st-card" style={{ "--stripe": st.stripe }}>
                <style>{`.st-card[style*="${st.stripe}"]::before { background: ${st.stripe}; opacity: 0.5; }`}</style>
                <div className="st-card-icon" style={{ background: st.bg }}>{st.icon}</div>
                <span className="st-card-value" style={{ color: st.color }}>{st.value}</span>
                <span className="st-card-label">{st.label}</span>
              </div>
            ))}
          </div>

          {/* ── Smart summaries ── */}
          {scoredDays.length > 0 && (
            <div>
              <p className="st-section-label">Insights</p>
              <div className="st-smart-grid">

                {/* Best day */}
                {bestDay && (
                  <div className="st-smart-card best">
                    <div className="st-smart-header">
                      <span className="st-smart-tag best">best day</span>
                      <span style={{ fontSize: 9, color: "var(--cream-lo)", letterSpacing: "0.08em" }}>score {bestDay.score}/6</span>
                    </div>
                    <span className="st-smart-date best">{fmtDate(bestDay.date)}</span>
                    <div className="st-smart-reasons">
                      {reasonText(bestDay).map((r) => (
                        <div key={r.text} className="st-smart-reason">
                          <span style={{ fontSize: 12 }}>{r.icon}</span>
                          {r.text} — <span>{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Worst day */}
                {worstDay && worstDay.date !== bestDay?.date && (
                  <div className="st-smart-card worst">
                    <div className="st-smart-header">
                      <span className="st-smart-tag worst">worst day</span>
                      <span style={{ fontSize: 9, color: "var(--cream-lo)", letterSpacing: "0.08em" }}>score {worstDay.score}/6</span>
                    </div>
                    <span className="st-smart-date worst">{fmtDate(worstDay.date)}</span>
                    <div className="st-smart-reasons">
                      {reasonText(worstDay).map((r) => (
                        <div key={r.text} className="st-smart-reason">
                          <span style={{ fontSize: 12 }}>{r.icon}</span>
                          {r.text} — <span>{r.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Week-over-week ── */}
          {prevWeekDays.length > 0 && (
            <div>
              <p className="st-section-label">Week over week</p>
              <div className="st-wow-card">
                <div className="st-wow-weeks">
                  <span className="st-wow-week-label">
                    <span className="st-wow-swatch" style={{ background: "var(--gold)" }} />
                    this week (avg/day)
                  </span>
                  <span className="st-wow-week-label">
                    <span className="st-wow-swatch" style={{ background: "rgba(255,255,255,0.18)" }} />
                    prev week
                  </span>
                </div>
                <div className="st-wow-rows">
                  {wowMetrics.map((m) => {
                    const { pct, dir } = wowDelta(m.curr, m.prev, m.higherIsBetter);
                    const maxVal = Math.max(m.curr, m.prev, 1);
                    const currW  = Math.round((m.curr / maxVal) * 100);
                    const prevW  = Math.round((m.prev / maxVal) * 100);
                    const deltaLabel = dir === "flat" ? "no change"
                      : `${dir === "up" ? "▲" : "▼"} ${pct}%`;
                    return (
                      <div key={m.label} className="st-wow-row">
                        <span className="st-wow-metric">{m.label}</span>
                        <div className="st-wow-bar-wrap">
                          <div className="st-wow-bars">
                            <div className="st-wow-bar-bg">
                              <div className="st-wow-bar-fill"
                                style={{ width: `${currW}%`, background: "var(--gold)" }} />
                            </div>
                          </div>
                          <div className="st-wow-bars">
                            <div className="st-wow-bar-bg">
                              <div className="st-wow-bar-fill"
                                style={{ width: `${prevW}%`, background: "rgba(255,255,255,0.18)" }} />
                            </div>
                          </div>
                          <div className="st-wow-vals">
                            <span>{m.curr.toLocaleString()}{m.unit}</span>
                            <span>{m.prev.toLocaleString()}{m.unit}</span>
                          </div>
                        </div>
                        <span className={`st-wow-delta ${dir}`}>{deltaLabel}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}


          <div className="chart-card">
            <h2>Calories — consumed vs burned</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={calorieData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={tickStyle} />
                <YAxis tick={tickStyle} />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, fontFamily: "IBM Plex Mono", fontSize: 11 }}
                  labelStyle={{ color: "var(--gold)" }}
                  itemStyle={{ color: "var(--cream)" }}
                />
                <Legend wrapperStyle={{ fontSize: 10, fontFamily: "IBM Plex Mono", color: "var(--cream-mid)" }} />
                <Line type="monotone" dataKey="consumed" stroke="#f97316" strokeWidth={2} dot={false} name="Consumed" />
                <Line type="monotone" dataKey="burned"   stroke="#3b82f6" strokeWidth={2} dot={false} name="Burned" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* ── Chart 2: Daily steps ── */}
          <div className="chart-card">
            <h2>Daily steps</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stepsData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={tickStyle} />
                <YAxis tick={tickStyle} />
                <Tooltip
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, fontFamily: "IBM Plex Mono", fontSize: 11 }}
                  labelStyle={{ color: "var(--gold)" }}
                  itemStyle={{ color: "var(--cream)" }}
                />
                <ReferenceLine y={10000} stroke="#22c55e" strokeDasharray="4 2"
                  label={{ value: "10k goal", position: "insideTopRight", fontSize: 9, fill: "#22c55e", fontFamily: "IBM Plex Mono" }} />
                <Bar dataKey="steps" fill="#6366f1" radius={[3, 3, 0, 0]} name="Steps" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Chart 3: Protein intake ── */}
          <div className="chart-card">
            <h2>Protein intake (g)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={proteinData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis dataKey="date" tick={tickStyle} />
                <YAxis domain={[0, 160]} tick={tickStyle} />
                <Tooltip
                  formatter={(v) => [`${v}g`, "Protein"]}
                  contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, fontFamily: "IBM Plex Mono", fontSize: 11 }}
                  labelStyle={{ color: "var(--gold)" }}
                  itemStyle={{ color: "var(--cream)" }}
                />
                <ReferenceArea y1={100} y2={130} fill="#facc15" fillOpacity={0.06} />
                <ReferenceLine y={100} stroke="#facc15" strokeDasharray="4 2"
                  label={{ value: "100g min", position: "insideBottomRight", fontSize: 9, fill: "#facc15", fontFamily: "IBM Plex Mono" }} />
                <ReferenceLine y={130} stroke="#f97316" strokeDasharray="4 2"
                  label={{ value: "130g max", position: "insideTopRight", fontSize: 9, fill: "#f97316", fontFamily: "IBM Plex Mono" }} />
                <Bar dataKey="protein" fill="#a855f7" radius={[3, 3, 0, 0]} name="Protein (g)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* ── Movies ── */}
          <div>
            <p className="st-section-label">Films this month</p>
            {monthMovies.length === 0
              ? <p className="st-empty">no movies logged this month</p>
              : <div className="st-list-card">
                  {monthMovies.map((m) => (
                    <div key={m.id} className="st-list-row">
                      <span className="st-list-title">{m.title}</span>
                      <span className="st-list-sub">
                        {new Date(m.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  ))}
                </div>
            }
          </div>

          {/* ── Books ── */}
          <div>
            <p className="st-section-label">Books this month</p>
            {monthBooks.length === 0
              ? <p className="st-empty">no books logged this month</p>
              : <div className="st-list-card">
                  {monthBooks.map((b) => {
                    const finished = finishedBooks.find((f) => f.id === b.id);
                    return (
                      <div key={b.id} className="st-list-row">
                        <div className="st-list-left">
                          <div className="st-book-dot" style={{ backgroundColor: b.color }} />
                          <span className="st-list-title">{b.title}</span>
                        </div>
                        <span className={`st-badge ${finished ? "st-badge-done" : "st-badge-reading"}`}>
                          {finished ? "finished" : "reading"}
                        </span>
                      </div>
                    );
                  })}
                </div>
            }
          </div>

          {/* ── Summary ── */}
          <div>
            <p className="st-section-label">Summary</p>
            <div className="st-list-card">
              {summaryRows.map((row) => (
                <div key={row.label} className="st-list-row">
                  <span className="st-list-sub">{row.label}</span>
                  <span className="st-list-value">{row.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
