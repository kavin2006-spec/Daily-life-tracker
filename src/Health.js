import React, { useState } from "react";
import { calcRecipeNutrition } from "./Data";

const CATEGORIES = ["Breakfast", "Lunch", "Snacks"];
const emptyLog = () => ({ food: {}, workouts: {}, steps: "" });

const PAGE_CSS = `
  .hl-page {
    display: flex; flex-direction: column; height: 100%;
    font-family: 'IBM Plex Mono', monospace;
    background: var(--bg); color: var(--cream);
    position: relative; overflow: hidden;
  }

  /* ── Top bar ── */
  .hl-topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 22px; height: 52px;
    background: var(--surface); border-bottom: 1px solid var(--border);
    flex-shrink: 0; position: relative; z-index: 10;
  }
  .hl-topbar::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg,
      transparent 0%, var(--green-dim) 15%,
      var(--gold) 50%, var(--green-dim) 85%, transparent 100%);
  }
  .hl-wordmark {
    font-family: 'Bebas Neue', sans-serif; font-size: 11px;
    letter-spacing: 0.3em; color: var(--gold); opacity: 0.65;
  }
  .hl-month-nav { display: flex; align-items: center; gap: 14px; }
  .hl-month-display { text-align: center; min-width: 180px; }
  .hl-month-name {
    font-family: 'Bebas Neue', sans-serif; font-size: 26px;
    letter-spacing: 0.12em; color: var(--cream); line-height: 1; display: block;
  }
  .hl-month-sub {
    font-size: 11px; letter-spacing: 0.2em;
    color: var(--green); display: block; margin-top: 1px;
  }
  .hl-nav-btn {
    width: 28px; height: 28px; background: none;
    border: 1px solid var(--border-green); border-radius: 2px;
    color: var(--green); font-size: 15px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }
  .hl-nav-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-lo); }

  /* Editor trigger button */
  .hl-editor-trigger {
    display: flex; align-items: center; gap: 6px;
    background: none;
    border: 1px solid var(--border-green);
    border-radius: 2px; padding: 5px 12px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; font-weight: 400;
    letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--green); cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
    white-space: nowrap;
  }
  .hl-editor-trigger:hover {
    color: var(--gold); border-color: var(--gold); background: var(--gold-lo);
  }
  .hl-editor-trigger.open {
    color: var(--gold); border-color: var(--gold); background: var(--gold-lo);
  }
  .hl-trigger-icon { font-size: 11px; }

  /* ── DOW row ── */
  .hl-dow-row {
    display: grid; grid-template-columns: repeat(7, 1fr);
    border-bottom: 1px solid var(--border);
    background: var(--surface); flex-shrink: 0;
  }
  .hl-dow-cell {
    text-align: center; font-size: 10px; font-weight: 700;
    color: var(--cream-mid); padding: 7px 0;
    letter-spacing: 0.12em; text-transform: uppercase;
  }

  /* ── Calendar grid — fills all remaining space ── */
  .hl-grid {
    flex: 1;
    display: grid; grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(6, 1fr);
    gap: 1px; background: rgba(212,168,75,0.06);
    overflow: hidden;
  }
  .hl-empty-cell { background: var(--bg); }
  .hl-cell {
    background: var(--surface2); padding: 8px 10px; cursor: pointer;
    display: flex; flex-direction: column; align-items: flex-start; gap: 4px;
    transition: filter 0.15s;
  }
  .hl-cell:hover { filter: brightness(1.3); }
  .hl-cell-today {
    background: var(--surface3);
    outline: 1px solid var(--green); outline-offset: -1px; z-index: 1;
  }
  .hl-cell-logged { background: #111a14; }
  .hl-day-num { font-size: 12px; color: var(--cream-mid); letter-spacing: 0.04em; }
  .hl-day-num-today { color: var(--green); font-weight: 700; }
  .hl-log-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--green);
  }

  /* ── Legend ── */
  .hl-legend {
    display: flex; gap: 18px; padding: 7px 22px;
    background: var(--surface); border-top: 1px solid var(--border);
    flex-shrink: 0; flex-wrap: wrap;
  }
  .hl-legend-item { display: flex; align-items: center; gap: 6px; font-size: 9px; color: var(--cream-mid); letter-spacing: 0.06em; }
  .hl-legend-swatch { width: 10px; height: 10px; border-radius: 1px; flex-shrink: 0; }

  /* ── Slide-in editor panel ── */
  .hl-panel-backdrop {
    position: absolute; inset: 0;
    background: rgba(8,8,12,0.5);
    z-index: 50;
    backdrop-filter: blur(2px);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.25s ease;
  }
  .hl-panel-backdrop.open {
    opacity: 1; pointer-events: all;
  }

  .hl-panel {
    position: absolute; top: 0; right: 0; bottom: 0;
    width: 400px;
    background: var(--surface);
    border-left: 1px solid var(--border-green);
    z-index: 60;
    display: flex; flex-direction: column;
    transform: translateX(100%);
    transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: -12px 0 40px rgba(0,0,0,0.5);
  }
  .hl-panel.open { transform: translateX(0); }

  /* Panel header */
  .hl-panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 18px; height: 52px;
    background: var(--surface2);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0; position: relative;
  }
  .hl-panel-header::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--green-dim), transparent);
  }
  .hl-panel-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px; letter-spacing: 0.15em; color: var(--cream);
  }
  .hl-panel-sub {
    font-size: 12px; color: var(--green);
    letter-spacing: 0.14em; text-transform: uppercase;
  }
  .hl-panel-close {
    background: none; border: 1px solid var(--border);
    border-radius: 2px; color: var(--cream-mid);
    font-size: 12px; cursor: pointer;
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.15s, color 0.15s;
  }
  .hl-panel-close:hover { border-color: var(--red); color: var(--red); }

  /* Panel tabs */
  .hl-panel-tabs {
    display: flex; border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }
  .hl-panel-tab {
    flex: 1; padding: 9px 0;
    background: none; border: none;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 10px; letter-spacing: 0.14em; text-transform: uppercase;
    color: var(--cream-mid); cursor: pointer;
    transition: color 0.15s;
    border-bottom: 2px solid transparent;
  }
  .hl-panel-tab:hover { color: var(--cream); }
  .hl-panel-tab.active { color: var(--green); border-bottom-color: var(--green); }

  /* Panel scroll body */
  .hl-panel-body {
    flex: 1; overflow-y: auto; padding: 16px 18px 20px;
    display: flex; flex-direction: column; gap: 14px;
    scrollbar-width: thin; scrollbar-color: var(--green-dim) transparent;
  }

  /* Section inside panel */
  .hl-section-label {
    font-size: 12px; font-weight: 700; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--green);
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 8px;
  }
  .hl-section-label::after {
    content: ''; flex: 1; height: 1px;
    background: linear-gradient(90deg, var(--border-green), transparent);
  }

  /* Shared input/button styles inside panel */
  .hl-editor-add-row { display: flex; gap: 7px; flex-wrap: wrap; align-items: center; }
  .hl-editor-input {
    flex: 1; min-width: 70px; height: 30px;
    background: var(--surface2); border: 1px solid var(--border-green);
    border-radius: 2px; padding: 0 8px;
    font-family: 'IBM Plex Mono', monospace; font-size: 10px;
    color: var(--cream); outline: none; box-sizing: border-box;
    transition: border-color 0.15s;
  }
  .hl-editor-input:focus { border-color: var(--green); }
  .hl-editor-input::placeholder { color: var(--cream-lo); }
  .hl-editor-select {
    height: 30px; background: var(--surface2);
    border: 1px solid var(--border-green); border-radius: 2px;
    padding: 0 8px; font-family: 'IBM Plex Mono', monospace;
    font-size: 10px; color: var(--cream); outline: none; cursor: pointer;
  }
  .hl-editor-add-btn {
    height: 30px; padding: 0 12px;
    background: var(--green-dim); color: var(--green);
    border: 1px solid var(--green-dim); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 700;
    letter-spacing: 0.12em; text-transform: uppercase;
    cursor: pointer; white-space: nowrap;
    transition: background 0.15s, color 0.15s;
  }
  .hl-editor-add-btn:hover { background: var(--green); color: var(--bg); }

  .hl-item-list { display: flex; flex-direction: column; gap: 4px; }
  .hl-item-row {
    display: flex; align-items: center; gap: 8px;
    padding: 6px 10px; background: var(--surface2);
    border-radius: 2px; cursor: pointer; transition: filter 0.15s;
  }
  .hl-item-row:hover { filter: brightness(1.25); }
  .hl-item-name { flex: 1; font-size: 13px; color: var(--cream); letter-spacing: 0.03em; }
  .hl-item-meta { font-size: 11px; color: var(--cream-mid); flex-shrink: 0; }
  .hl-edit-hint { font-size: 11px; color: var(--cream-lo); flex-shrink: 0; }

  .hl-edit-row {
    display: flex; align-items: center; gap: 6px;
    flex-wrap: wrap; padding: 6px 0;
  }
  .hl-save-btn {
    height: 28px; padding: 0 10px;
    background: var(--green-dim); color: var(--green);
    border: 1px solid var(--green-dim); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .hl-save-btn:hover { background: var(--green); color: var(--bg); }
  .hl-del-btn {
    height: 28px; padding: 0 10px;
    background: var(--red-lo); color: var(--red);
    border: 1px solid var(--red-mid); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 700;
    letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
  }
  .hl-del-btn:hover { background: var(--red-mid); }
  .hl-cancel-btn {
    height: 28px; padding: 0 10px;
    background: transparent; color: var(--cream-mid);
    border: 1px solid var(--border); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 10px;
    letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer;
  }
  .hl-cancel-btn:hover { border-color: var(--cream-mid); color: var(--cream); }

  .hl-cat-divider {
    font-size: 10px; font-weight: 700; letter-spacing: 0.14em;
    text-transform: uppercase; color: var(--gold);
    margin: 10px 0 4px; padding-bottom: 4px;
    border-bottom: 1px solid rgba(212,168,75,0.1);
  }
  .hl-recipe-form-box {
    display: flex; flex-direction: column; gap: 8px;
    background: var(--surface2); border-radius: 2px; padding: 10px;
    border: 1px solid var(--border);
  }
  .hl-ing-tag-row { display: flex; flex-wrap: wrap; gap: 5px; }
  .hl-ing-tag {
    display: flex; align-items: center; gap: 4px;
    background: var(--green-dim); border-radius: 2px;
    padding: 2px 7px; font-size: 11px; color: var(--green);
  }
  .hl-ing-tag-remove {
    background: none; border: none; color: var(--green);
    cursor: pointer; font-size: 11px; padding: 0; line-height: 1;
  }

  /* ── Day popup ── */
  @keyframes hl-popup-in {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to   { opacity: 1; transform: none; }
  }
  .hl-overlay {
    position: fixed; inset: 0; background: rgba(8,8,12,0.88);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; backdrop-filter: blur(4px);
  }
  .hl-popup {
    background: var(--surface); border: 1px solid var(--border-green);
    border-radius: 3px; width: 440px; max-height: 88vh;
    overflow-y: auto; display: flex; flex-direction: column;
    animation: hl-popup-in 0.18s ease;
    box-shadow: 0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(122,171,110,0.1);
    scrollbar-width: thin; scrollbar-color: var(--green-dim) transparent;
  }
  .hl-popup-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 16px 18px 12px;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0; background: var(--surface2); position: relative;
  }
  .hl-popup-header::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--green-dim), transparent);
  }
  .hl-popup-weekday { font-size: 10px; color: var(--cream-mid); letter-spacing: 0.14em; text-transform: uppercase; }
  .hl-popup-day {
    font-family: 'Bebas Neue', sans-serif; font-size: 44px;
    letter-spacing: 0.05em; color: var(--cream); line-height: 1;
  }
  .hl-popup-month { font-size: 11px; color: var(--green); letter-spacing: 0.14em; }
  .hl-close-btn {
    background: none; border: 1px solid var(--border); border-radius: 2px;
    color: var(--cream-mid); font-size: 13px; cursor: pointer;
    width: 26px; height: 26px;
    display: flex; align-items: center; justify-content: center;
    transition: border-color 0.15s, color 0.15s;
  }
  .hl-close-btn:hover { border-color: var(--red); color: var(--red); }
  .hl-tab-row {
    display: flex; border-bottom: 1px solid var(--border); flex-shrink: 0;
  }
  .hl-tab {
    flex: 1; padding: 9px 0;
    background: none; border: none;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--cream-mid); cursor: pointer; transition: color 0.15s;
    border-bottom: 2px solid transparent;
  }
  .hl-tab:hover { color: var(--cream); }
  .hl-tab-active { color: var(--green); border-bottom-color: var(--green); }
  .hl-popup-body { padding: 14px 18px 18px; display: flex; flex-direction: column; gap: 8px; }
  .hl-cat-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--gold); margin: 6px 0 4px;
  }
  .hl-food-row {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 2px; padding: 8px 12px; margin-bottom: 4px;
  }
  .hl-food-row-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .hl-food-name { font-size: 11px; color: var(--cream); letter-spacing: 0.03em; }
  .hl-food-base { font-size: 11px; color: var(--cream-mid); }
  .hl-food-row-bottom { display: flex; align-items: center; gap: 10px; }
  .hl-grams-wrap { display: flex; align-items: center; gap: 4px; }
  .hl-grams-input {
    width: 60px; height: 28px;
    background: var(--surface3); border: 1px solid var(--border-green);
    border-radius: 2px; text-align: center;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--cream);
    outline: none; transition: border-color 0.15s;
  }
  .hl-grams-input:focus { border-color: var(--green); }
  .hl-grams-unit { font-size: 10px; color: var(--cream-mid); }
  .hl-food-macros { display: flex; gap: 10px; }
  .hl-macro-cal { font-size: 10px; font-weight: 700; color: var(--red); }
  .hl-macro-protein { font-size: 10px; font-weight: 700; color: var(--blue); }
  .hl-food-hint { font-size: 11px; color: var(--cream-lo); font-style: italic; }
  .hl-workout-row {
    display: flex; align-items: center; gap: 8px; padding: 6px 10px;
    border-radius: 2px; background: var(--surface2);
    border: 1px solid var(--border); margin-bottom: 4px;
  }
  .hl-check-label { flex: 1; font-size: 11px; color: var(--cream); }
  .hl-check-cals { font-size: 11px; color: var(--cream-mid); }
  .hl-sets-input {
    width: 56px; height: 28px;
    background: var(--surface3); border: 1px solid var(--border-green);
    border-radius: 2px; text-align: center;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--cream);
    outline: none; transition: border-color 0.15s;
  }
  .hl-sets-input:focus { border-color: var(--green); }
  .hl-result-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 2px; padding: 14px 16px;
    display: flex; flex-direction: column; gap: 8px;
  }
  .hl-result-card-title {
    font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--green); margin-bottom: 4px;
  }
  .hl-result-row { display: flex; justify-content: space-between; align-items: center; }
  .hl-result-label { font-size: 11px; color: var(--cream-mid); }
  .hl-result-val { font-size: 13px; font-weight: 700; color: var(--cream); }
  .hl-result-divider { height: 1px; background: rgba(212,168,75,0.1); margin: 2px 0; }
  .hl-protein-bar {
    height: 6px; background: var(--surface3); border-radius: 3px;
    position: relative; margin-top: 4px;
  }
  .hl-protein-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
  .hl-protein-target { position: absolute; left: 66.6%; top: -3px; bottom: -3px; width: 1px; background: var(--green); }
  .hl-protein-range {
    display: flex; justify-content: space-between;
    font-size: 10px; color: var(--cream-mid); margin-top: 4px; letter-spacing: 0.06em;
  }

  @media (max-width: 600px) {
    .hl-topbar { padding: 0 14px; }
    .hl-wordmark { display: none; }
    .hl-month-name { font-size: 20px; }
    .hl-panel { width: 100%; border-left: none; }
    .hl-popup { width: calc(100vw - 24px); }
  }
`;

export default function HealthPage({
  healthLogs, updateHealthLog,
  workouts, setWorkouts,
  ingredients, setIngredients,
  recipes, setRecipes,
}) {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay,  setSelectedDay]  = useState(null);
  const [popupTab,     setPopupTab]     = useState("food");

  // Panel state
  const [panelOpen,  setPanelOpen]  = useState(false);
  const [panelTab,   setPanelTab]   = useState("workouts"); // workouts | ingredients | recipes

  // Workout state
  const [newWName,  setNewWName]  = useState("");
  const [newWCals,  setNewWCals]  = useState("");
  const [editingW,  setEditingW]  = useState(null);
  const [editWName, setEditWName] = useState("");
  const [editWCals, setEditWCals] = useState("");

  // Ingredient state
  const [newIName,     setNewIName]     = useState("");
  const [newICal,      setNewICal]      = useState("");
  const [newIProtein,  setNewIProtein]  = useState("");
  const [editingI,     setEditingI]     = useState(null);
  const [editIName,    setEditIName]    = useState("");
  const [editICal,     setEditICal]     = useState("");
  const [editIProtein, setEditIProtein] = useState("");

  // Recipe state
  const [newRName,  setNewRName]  = useState("");
  const [newRCat,   setNewRCat]   = useState("Breakfast");
  const [newRGrams, setNewRGrams] = useState("");
  const [newRIngs,  setNewRIngs]  = useState([]);
  const [newRIngId, setNewRIngId] = useState("");
  const [newRIngG,  setNewRIngG]  = useState("");
  const [editingR,  setEditingR]  = useState(null);
  const [editRName, setEditRName] = useState("");
  const [editRCat,  setEditRCat]  = useState("Breakfast");
  const [editRGrams,setEditRGrams]= useState("");
  const [editRIngs, setEditRIngs] = useState([]);
  const [editRIngId,setEditRIngId]= useState("");
  const [editRIngG, setEditRIngG] = useState("");

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  const monthName   = new Date(currentYear, currentMonth, 1).toLocaleString("default", { month: "long" });
  const firstDow    = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (d) =>
    d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

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

  function calcDayNutrition(log) {
    let cal = 0, protein = 0;
    Object.entries(log.food).forEach(([recipeId, gramsEaten]) => {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) return;
      const n = calcRecipeNutrition(ingredients, recipe, Number(gramsEaten));
      cal += n.cal; protein += n.protein;
    });
    return { cal: Math.round(cal), protein: Math.round(protein * 10) / 10 };
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
    setWorkouts(workouts.map((w) => w.id === editingW.id
      ? { ...w, name: editWName.trim(), calsPerSet: Number(editWCals) } : w));
    setEditingW(null);
  }
  function deleteWorkout(id) { setWorkouts(workouts.filter((w) => w.id !== id)); setEditingW(null); }

  // Ingredient CRUD
  function addIngredient() {
    if (!newIName.trim() || !newICal) return;
    setIngredients([...ingredients, {
      id: "ing_" + Date.now(), name: newIName.trim(),
      cal100: Number(newICal), protein100: Number(newIProtein) || 0,
    }]);
    setNewIName(""); setNewICal(""); setNewIProtein("");
  }
  function openEditI(ing) {
    setEditingI(ing); setEditIName(ing.name); setEditICal(ing.cal100); setEditIProtein(ing.protein100);
  }
  function saveEditI() {
    setIngredients(ingredients.map((i) => i.id === editingI.id
      ? { ...i, name: editIName.trim(), cal100: Number(editICal), protein100: Number(editIProtein) } : i));
    setEditingI(null);
  }
  function deleteIngredient(id) { setIngredients(ingredients.filter((i) => i.id !== id)); setEditingI(null); }

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
      id: "rec_" + Date.now(), name: newRName.trim(),
      category: newRCat, baseGrams: Number(newRGrams), ingredients: newRIngs,
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
      : r));
    setEditingR(null);
  }
  function deleteRecipe(id) { setRecipes(recipes.filter((r) => r.id !== id)); setEditingR(null); }

  const popupLog = selectedDay ? getLog(selectedDay) : emptyLog();
  const { cal: intake, protein } = selectedDay ? calcDayNutrition(popupLog) : { cal: 0, protein: 0 };
  const burned    = selectedDay ? calcBurned(popupLog) : 0;
  const net       = intake - burned;
  const popupDate = selectedDay ? new Date(selectedDay + "T00:00:00") : null;
  const proteinStatus = protein >= 100 && protein <= 130 ? "good" : protein < 100 ? "low" : "high";
  const proteinColor  = proteinStatus === "good" ? "var(--green)" : "var(--red)";

  /* ── Panel content ── */
  const panelContent = (
    <div className="hl-panel-body">

      {/* Workouts tab */}
      {panelTab === "workouts" && (
        <>
          <div>
            <div className="hl-section-label">Add workout</div>
            <div className="hl-editor-add-row">
              <input className="hl-editor-input" placeholder="Workout name"
                value={newWName} onChange={(e) => setNewWName(e.target.value)} />
              <input className="hl-editor-input" type="number" placeholder="cal/set"
                style={{ flex: "0 0 80px" }} value={newWCals} onChange={(e) => setNewWCals(e.target.value)} />
              <button className="hl-editor-add-btn" onClick={addWorkout}>+ add</button>
            </div>
          </div>
          <div>
            <div className="hl-section-label">Your workouts</div>
            <div className="hl-item-list">
              {workouts.length === 0 && (
                <p style={{ fontSize: 10, color: "var(--cream-lo)", fontStyle: "italic" }}>no workouts yet</p>
              )}
              {workouts.map((w) => editingW?.id === w.id ? (
                <div key={w.id} className="hl-edit-row">
                  <input className="hl-editor-input" value={editWName} onChange={(e) => setEditWName(e.target.value)} />
                  <input className="hl-editor-input" type="number" style={{ flex: "0 0 75px" }}
                    value={editWCals} onChange={(e) => setEditWCals(e.target.value)} />
                  <button className="hl-save-btn"   onClick={saveEditW}>save</button>
                  <button className="hl-del-btn"    onClick={() => deleteWorkout(w.id)}>del</button>
                  <button className="hl-cancel-btn" onClick={() => setEditingW(null)}>✕</button>
                </div>
              ) : (
                <div key={w.id} className="hl-item-row" onClick={() => openEditW(w)}>
                  <span className="hl-item-name">{w.name}</span>
                  <span className="hl-item-meta">{w.calsPerSet} cal/set</span>
                  <span className="hl-edit-hint">✏</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Ingredients tab */}
      {panelTab === "ingredients" && (
        <>
          <div>
            <div className="hl-section-label">Add ingredient</div>
            <div className="hl-editor-add-row">
              <input className="hl-editor-input" placeholder="Name"
                value={newIName} onChange={(e) => setNewIName(e.target.value)} />
              <input className="hl-editor-input" type="number" placeholder="cal/100g"
                style={{ flex: "0 0 80px" }} value={newICal} onChange={(e) => setNewICal(e.target.value)} />
              <input className="hl-editor-input" type="number" placeholder="prot/100g"
                style={{ flex: "0 0 80px" }} value={newIProtein} onChange={(e) => setNewIProtein(e.target.value)} />
              <button className="hl-editor-add-btn" onClick={addIngredient}>+ add</button>
            </div>
          </div>
          <div>
            <div className="hl-section-label">Your ingredients</div>
            <div className="hl-item-list">
              {ingredients.length === 0 && (
                <p style={{ fontSize: 10, color: "var(--cream-lo)", fontStyle: "italic" }}>no ingredients yet</p>
              )}
              {ingredients.map((ing) => editingI?.id === ing.id ? (
                <div key={ing.id} className="hl-edit-row">
                  <input className="hl-editor-input" value={editIName} onChange={(e) => setEditIName(e.target.value)} />
                  <input className="hl-editor-input" type="number" style={{ flex: "0 0 70px" }}
                    value={editICal} onChange={(e) => setEditICal(e.target.value)} />
                  <input className="hl-editor-input" type="number" style={{ flex: "0 0 70px" }}
                    value={editIProtein} onChange={(e) => setEditIProtein(e.target.value)} />
                  <button className="hl-save-btn"   onClick={saveEditI}>save</button>
                  <button className="hl-del-btn"    onClick={() => deleteIngredient(ing.id)}>del</button>
                  <button className="hl-cancel-btn" onClick={() => setEditingI(null)}>✕</button>
                </div>
              ) : (
                <div key={ing.id} className="hl-item-row" onClick={() => openEditI(ing)}>
                  <span className="hl-item-name">{ing.name}</span>
                  <span className="hl-item-meta">{ing.cal100} cal · {ing.protein100}g prot</span>
                  <span className="hl-edit-hint">✏</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Recipes tab */}
      {panelTab === "recipes" && (
        <>
          <div>
            <div className="hl-section-label">New recipe</div>
            <div className="hl-recipe-form-box">
              <div className="hl-editor-add-row">
                <input className="hl-editor-input" placeholder="Recipe name"
                  value={newRName} onChange={(e) => setNewRName(e.target.value)} />
                <select className="hl-editor-select" value={newRCat} onChange={(e) => setNewRCat(e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input className="hl-editor-input" type="number" placeholder="base g"
                  style={{ flex: "0 0 72px" }} value={newRGrams} onChange={(e) => setNewRGrams(e.target.value)} />
              </div>
              <div className="hl-editor-add-row">
                <select className="hl-editor-select" style={{ flex: 1 }}
                  value={newRIngId} onChange={(e) => setNewRIngId(e.target.value)}>
                  <option value="">— ingredient —</option>
                  {ingredients.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
                <input className="hl-editor-input" type="number" placeholder="g"
                  style={{ flex: "0 0 60px" }} value={newRIngG} onChange={(e) => setNewRIngG(e.target.value)} />
                <button className="hl-cancel-btn" onClick={addIngToNewRecipe}>+ add</button>
              </div>
              {newRIngs.length > 0 && (
                <div className="hl-ing-tag-row">
                  {newRIngs.map((ri, idx) => {
                    const ing = ingredients.find((i) => i.id === ri.ingredientId);
                    return (
                      <div key={idx} className="hl-ing-tag">
                        <span>{ing?.name} {ri.grams}g</span>
                        <button className="hl-ing-tag-remove" onClick={() => removeIngFromNew(idx)}>✕</button>
                      </div>
                    );
                  })}
                </div>
              )}
              <button className="hl-editor-add-btn" style={{ alignSelf: "flex-start" }} onClick={addRecipe}>
                + save recipe
              </button>
            </div>
          </div>

          <div>
            <div className="hl-section-label">Your recipes</div>
            {CATEGORIES.map((cat) => {
              const catRecipes = recipes.filter((r) => r.category === cat);
              if (catRecipes.length === 0) return null;
              return (
                <div key={cat}>
                  <div className="hl-cat-divider">{cat}</div>
                  {catRecipes.map((r) => editingR?.id === r.id ? (
                    <div key={r.id} style={{ background: "var(--surface2)", borderRadius: 2, padding: 10, marginBottom: 6, display: "flex", flexDirection: "column", gap: 8, border: "1px solid var(--border)" }}>
                      <div className="hl-editor-add-row">
                        <input className="hl-editor-input" value={editRName} onChange={(e) => setEditRName(e.target.value)} />
                        <select className="hl-editor-select" value={editRCat} onChange={(e) => setEditRCat(e.target.value)}>
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input className="hl-editor-input" type="number" style={{ flex: "0 0 72px" }}
                          value={editRGrams} onChange={(e) => setEditRGrams(e.target.value)} />
                      </div>
                      <div className="hl-editor-add-row">
                        <select className="hl-editor-select" style={{ flex: 1 }}
                          value={editRIngId} onChange={(e) => setEditRIngId(e.target.value)}>
                          <option value="">— add ingredient —</option>
                          {ingredients.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                        </select>
                        <input className="hl-editor-input" type="number" placeholder="g"
                          style={{ flex: "0 0 60px" }} value={editRIngG} onChange={(e) => setEditRIngG(e.target.value)} />
                        <button className="hl-cancel-btn" onClick={addIngToEditRecipe}>+ add</button>
                      </div>
                      {editRIngs.length > 0 && (
                        <div className="hl-ing-tag-row">
                          {editRIngs.map((ri, idx) => {
                            const ing = ingredients.find((i) => i.id === ri.ingredientId);
                            return (
                              <div key={idx} className="hl-ing-tag">
                                <span>{ing?.name} {ri.grams}g</span>
                                <button className="hl-ing-tag-remove" onClick={() => removeIngFromEdit(idx)}>✕</button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 7 }}>
                        <button className="hl-save-btn"   onClick={saveEditR}>save</button>
                        <button className="hl-del-btn"    onClick={() => deleteRecipe(r.id)}>delete</button>
                        <button className="hl-cancel-btn" onClick={() => setEditingR(null)}>cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div key={r.id} className="hl-item-row" onClick={() => openEditR(r)}>
                      <span className="hl-item-name">{r.name}</span>
                      <span className="hl-item-meta">{r.baseGrams}g · {r.ingredients.length} ing</span>
                      <span className="hl-edit-hint">✏</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div className="hl-page">

        {/* Top bar */}
        <div className="hl-topbar">
          <span className="hl-wordmark">Life Tracker</span>
          <div className="hl-month-nav">
            <button className="hl-nav-btn" onClick={prevMonth}>‹</button>
            <div className="hl-month-display">
              <span className="hl-month-name">{monthName}</span>
              <span className="hl-month-sub">{currentYear} · health</span>
            </div>
            <button className="hl-nav-btn" onClick={nextMonth}>›</button>
          </div>
          {/* Editor trigger */}
          <button
            className={`hl-editor-trigger${panelOpen ? " open" : ""}`}
            onClick={() => setPanelOpen((o) => !o)}
          >
            <span className="hl-trigger-icon">⊞</span>
            manage data
          </button>
        </div>

        {/* DOW */}
        <div className="hl-dow-row">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="hl-dow-cell">{d}</div>
          ))}
        </div>

        {/* Calendar grid — now fills the full remaining height */}
        <div className="hl-grid">
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} className="hl-empty-cell" />;
            const ymd    = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
            const log    = getLog(ymd);
            const hasLog = Object.keys(log.food).length > 0 || Object.keys(log.workouts).length > 0 || log.steps;
            const isT    = isToday(day);
            return (
              <div key={day}
                className={`hl-cell${isT ? " hl-cell-today" : ""}${hasLog ? " hl-cell-logged" : ""}`}
                onClick={() => { setSelectedDay(ymd); setPopupTab("food"); }}
              >
                <span className={`hl-day-num${isT ? " hl-day-num-today" : ""}`}>{day}</span>
                {hasLog && <div className="hl-log-dot" />}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="hl-legend">
          <div className="hl-legend-item">
            <div className="hl-legend-swatch" style={{ background: "var(--surface3)", outline: "1px solid var(--green)", outlineOffset: "1px" }} />
            <span>today</span>
          </div>
          <div className="hl-legend-item">
            <div className="hl-legend-swatch" style={{ background: "#111a14" }} />
            <span>logged</span>
          </div>
          <div className="hl-legend-item">
            <div className="hl-legend-swatch" style={{ borderRadius: "50%", background: "var(--green)" }} />
            <span>has data</span>
          </div>
        </div>

        {/* ── Slide-in editor panel ── */}
        <div
          className={`hl-panel-backdrop${panelOpen ? " open" : ""}`}
          onClick={() => setPanelOpen(false)}
        />
        <div className={`hl-panel${panelOpen ? " open" : ""}`}>
          <div className="hl-panel-header">
            <div>
              <span className="hl-panel-title">Manage Data</span>
              <span className="hl-panel-sub" style={{ display: "block", marginTop: 1 }}>workouts · ingredients · recipes</span>
            </div>
            <button className="hl-panel-close" onClick={() => setPanelOpen(false)}>✕</button>
          </div>
          <div className="hl-panel-tabs">
            {["workouts","ingredients","recipes"].map((t) => (
              <button key={t}
                className={`hl-panel-tab${panelTab === t ? " active" : ""}`}
                onClick={() => setPanelTab(t)}>
                {t}
              </button>
            ))}
          </div>
          {panelContent}
        </div>

        {/* ── Day popup ── */}
        {selectedDay && (
          <div className="hl-overlay" onClick={() => setSelectedDay(null)}>
            <div className="hl-popup" onClick={(e) => e.stopPropagation()}>
              <div className="hl-popup-header">
                <div>
                  <div className="hl-popup-weekday">{popupDate.toLocaleString("default", { weekday: "long" })}</div>
                  <div className="hl-popup-day">{popupDate.getDate()}</div>
                  <div className="hl-popup-month">{popupDate.toLocaleString("default", { month: "short" })} {popupDate.getFullYear()}</div>
                </div>
                <button className="hl-close-btn" onClick={() => setSelectedDay(null)}>✕</button>
              </div>
              <div className="hl-tab-row">
                {["food","workouts","results"].map((tab) => (
                  <button key={tab}
                    className={`hl-tab${popupTab === tab ? " hl-tab-active" : ""}`}
                    onClick={() => setPopupTab(tab)}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="hl-popup-body">

                {popupTab === "food" && CATEGORIES.map((cat) => {
                  const catRecipes = recipes.filter((r) => r.category === cat);
                  if (catRecipes.length === 0) return null;
                  return (
                    <div key={cat}>
                      <div className="hl-cat-label">{cat}</div>
                      {catRecipes.map((recipe) => {
                        const gramsVal = popupLog.food[recipe.id] || "";
                        const { cal, protein: p } = gramsVal
                          ? calcRecipeNutrition(ingredients, recipe, Number(gramsVal))
                          : { cal: 0, protein: 0 };
                        return (
                          <div key={recipe.id} className="hl-food-row">
                            <div className="hl-food-row-top">
                              <span className="hl-food-name">{recipe.name}</span>
                              <span className="hl-food-base">base {recipe.baseGrams}g</span>
                            </div>
                            <div className="hl-food-row-bottom">
                              <div className="hl-grams-wrap">
                                <input type="number" min="0" placeholder="0"
                                  value={gramsVal}
                                  onChange={(e) => setFoodGrams(selectedDay, recipe.id, e.target.value)}
                                  className="hl-grams-input" />
                                <span className="hl-grams-unit">g</span>
                              </div>
                              {gramsVal
                                ? <div className="hl-food-macros">
                                    <span className="hl-macro-cal">{cal} cal</span>
                                    <span className="hl-macro-protein">{p}g prot</span>
                                  </div>
                                : <span className="hl-food-hint">enter grams</span>
                              }
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {popupTab === "workouts" && (
                  <>
                    {workouts.map((w) => (
                      <div key={w.id} className="hl-workout-row">
                        <span className="hl-check-label">{w.name}</span>
                        <span className="hl-check-cals">{w.calsPerSet} cal/set</span>
                        <input type="number" min="0" placeholder="sets"
                          value={popupLog.workouts[w.id] || ""}
                          onChange={(e) => setWorkoutSets(selectedDay, w.id, Number(e.target.value))}
                          className="hl-sets-input" />
                      </div>
                    ))}
                    <div className="hl-cat-label" style={{ marginTop: 6 }}>Steps</div>
                    <div className="hl-workout-row">
                      <span className="hl-check-label">Steps today</span>
                      <span className="hl-check-cals">× 0.0425 cal</span>
                      <input type="number" min="0" placeholder="steps"
                        value={popupLog.steps}
                        onChange={(e) => setSteps(selectedDay, e.target.value)}
                        className="hl-sets-input" />
                    </div>
                  </>
                )}

                {popupTab === "results" && (
                  <>
                    <div className="hl-result-card">
                      <div className="hl-result-card-title">Calorie balance</div>
                      <div className="hl-result-row">
                        <span className="hl-result-label">Consumed</span>
                        <span className="hl-result-val">{intake} cal</span>
                      </div>
                      <div className="hl-result-row">
                        <span className="hl-result-label">Burned</span>
                        <span className="hl-result-val" style={{ color: "var(--green)" }}>{burned} cal</span>
                      </div>
                      <div className="hl-result-divider" />
                      <div className="hl-result-row">
                        <span className="hl-result-label" style={{ color: "var(--cream)", fontWeight: 700 }}>Net</span>
                        <span className="hl-result-val" style={{ fontSize: 18, color: net > 0 ? "var(--red)" : "var(--green)" }}>
                          {net > 0 ? "+" : ""}{net} cal
                        </span>
                      </div>
                    </div>
                    <div className="hl-result-card">
                      <div className="hl-result-card-title">Protein intake</div>
                      <div className="hl-result-row">
                        <span className="hl-result-label">Total protein</span>
                        <span className="hl-result-val" style={{ fontSize: 18, color: proteinColor }}>{protein}g</span>
                      </div>
                      <div className="hl-protein-bar">
                        <div className="hl-protein-bar-fill"
                          style={{ width: `${Math.min((protein / 150) * 100, 100)}%`, backgroundColor: proteinColor }} />
                        <div className="hl-protein-target" />
                      </div>
                      <div className="hl-protein-range">
                        <span>0g</span>
                        <span style={{ color: "var(--green)" }}>target 100–130g</span>
                        <span>150g+</span>
                      </div>
                      <div className="hl-result-row" style={{ marginTop: 4 }}>
                        <span style={{ fontSize: 10, color: proteinColor, letterSpacing: "0.08em" }}>
                          {proteinStatus === "good" ? "✓ on target" : proteinStatus === "low" ? "↓ below target" : "↑ above target"}
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
    </>
  );
}
