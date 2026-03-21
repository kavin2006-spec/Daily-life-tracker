import React, { useState } from "react";
import { calcRecipeNutrition } from "./Data";

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function toYMD(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function Stats({ movies, books, healthLogs, workouts, ingredients, recipes }) {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  }

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString("default", { month: "long" });
  const totalDays = daysInMonth(currentYear, currentMonth);
  const mStart    = toYMD(currentYear, currentMonth, 1);
  const mEnd      = toYMD(currentYear, currentMonth, totalDays);

  // ── Movie stats ──
  const monthMovies = movies.filter((m) => {
    const d = new Date(m.date);
    return d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear;
  });

  const moviesByDay = {};
  monthMovies.forEach((m) => {
    moviesByDay[m.date] = (moviesByDay[m.date] || 0) + 1;
  });
  const movieMarathonDays = Object.values(moviesByDay).filter((c) => c >= 2).length;

  // ── Book stats ──
  const monthBooks    = books.filter((b) => b.startDate <= mEnd && b.endDate >= mStart);
  const finishedBooks = books.filter((b) => {
    const end = new Date(b.endDate);
    return end.getUTCMonth() === currentMonth && end.getUTCFullYear() === currentYear;
  });

  // ── Health stats ──
  let totalConsumed = 0;
  let totalBurned   = 0;
  let totalSteps    = 0;
  let daysLogged    = 0;

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

  const statCards = [
    { icon: "🔥", label: "Calories consumed", value: totalConsumed.toLocaleString(), color: "#e07070", bg: "#2a1515" },
    { icon: "💪", label: "Calories burned",   value: totalBurned.toLocaleString(),   color: "#5db85d", bg: "#152a15" },
    { icon: "👟", label: "Total steps",       value: Math.round(totalSteps).toLocaleString(), color: "#7ab3e0", bg: "#1a2a3a" },
    { icon: "🎬", label: "Movies watched",    value: monthMovies.length,             color: "#378add", bg: "#1a2a3a" },
    { icon: "📖", label: "Books in progress", value: monthBooks.length,              color: "#3b6d11", bg: "#1a2a1a" },
    { icon: "✅", label: "Books finished",    value: finishedBooks.length,           color: "#854f0b", bg: "#2a1e10" },
  ];

  return (
    <div style={s.page}>

      <div style={s.topBar}>
        <button style={s.navBtn} onClick={prevMonth}>← Prev</button>
        <span style={s.monthLabel}>{monthName} {currentYear} · Stats</span>
        <button style={s.navBtn} onClick={nextMonth}>Next →</button>
      </div>

      <div style={s.scrollArea}>

        {/* STAT CARDS */}
        <div style={s.cardGrid}>
          {statCards.map((st) => (
            <div key={st.label} style={s.card}>
              <div style={{ ...s.iconCircle, backgroundColor: st.bg }}>
                <span style={s.iconEmoji}>{st.icon}</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ ...s.cardValue, color: st.color }}>{st.value}</span>
                <span style={s.cardLabel}>{st.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MOVIES LIST */}
        <div style={s.section}>
          <p style={s.sectionTitle}>🎬 Movies this month</p>
          {monthMovies.length === 0 ? (
            <p style={s.emptyText}>No movies logged this month</p>
          ) : (
            <div style={s.listCard}>
              {monthMovies.map((m, i) => (
                <div key={m.id} style={{ ...s.listRow, borderTop: i === 0 ? "none" : "1px solid #2a2a2a" }}>
                  <span style={s.listTitle}>{m.title}</span>
                  <span style={s.listSub}>
                    {new Date(m.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOOKS LIST */}
        <div style={s.section}>
          <p style={s.sectionTitle}>📖 Books this month</p>
          {monthBooks.length === 0 ? (
            <p style={s.emptyText}>No books logged this month</p>
          ) : (
            <div style={s.listCard}>
              {monthBooks.map((b, i) => {
                const finished = finishedBooks.find((f) => f.id === b.id);
                const badgeStyle = {
                  ...s.badge,
                  backgroundColor: finished ? "#1a2e1a" : "#2a2a2a",
                  color:           finished ? "#5db85d" : "#666",
                };
                return (
                  <div key={b.id} style={{ ...s.listRow, borderTop: i === 0 ? "none" : "1px solid #2a2a2a" }}>
                    <div style={s.listLeft}>
                      <div style={{ ...s.bookDot, backgroundColor: b.color }} />
                      <span style={s.listTitle}>{b.title}</span>
                    </div>
                    <span style={badgeStyle}>{finished ? "Finished" : "Reading"}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SUMMARY */}
        <div style={s.section}>
          <p style={s.sectionTitle}>📊 Summary</p>
          <div style={s.listCard}>
            {[
              { label: "Average steps / day",           value: avgSteps.toLocaleString() },
              { label: "Days health logged",             value: daysLogged },
              { label: "Net calories (consumed − burned)", value: (totalConsumed - totalBurned).toLocaleString() },
              { label: "Entertainment items",            value: monthMovies.length + monthBooks.length },
              { label: "Marathon days (2+ movies)",      value: movieMarathonDays },
            ].map((row, i) => (
              <div key={row.label} style={{ ...s.listRow, borderTop: i === 0 ? "none" : "1px solid #2a2a2a" }}>
                <span style={s.listSub}>{row.label}</span>
                <span style={s.listValue}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const s = {
  page:        { display: "flex", flexDirection: "column", height: "100%", fontFamily: "sans-serif", backgroundColor: "#141414", color: "#eee" },
  topBar:      { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", backgroundColor: "#1c1c1c", borderBottom: "1px solid #2a2a2a", flexShrink: 0 },
  navBtn:      { background: "none", border: "1px solid #3a3a3a", borderRadius: 8, padding: "4px 14px", cursor: "pointer", fontSize: 13, color: "#888" },
  monthLabel:  { fontSize: 17, fontWeight: 700, color: "#eee" },
  scrollArea:  { flex: 1, overflowY: "auto", padding: "24px" },
  cardGrid:    { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 14, marginBottom: 28 },
  card:        { backgroundColor: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 14, padding: "20px 16px 16px", display: "flex", flexDirection: "column", gap: 10, minWidth: 0 },
  iconCircle:  { width: 44, height: 44, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" },
  iconEmoji:   { fontSize: 20 },
  cardValue:   { fontSize: 28, fontWeight: 700, lineHeight: 1 },
  cardLabel:   { fontSize: 12, color: "#666" },
  section:     { marginBottom: 24 },
  sectionTitle:{ fontSize: 14, fontWeight: 700, color: "#aaa", marginBottom: 10 },
  emptyText:   { fontSize: 13, color: "#444", fontStyle: "italic" },
  listCard:    { backgroundColor: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 12, overflow: "hidden" },
  listRow:     { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px" },
  listLeft:    { display: "flex", alignItems: "center", gap: 8 },
  listTitle:   { fontSize: 13, color: "#ddd", fontWeight: 500 },
  listSub:     { fontSize: 12, color: "#666" },
  listValue:   { fontSize: 13, color: "#aaa", fontWeight: 600 },
  bookDot:     { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  badge:       { fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 6 },
};