import React, { useState, useEffect } from "react";
import './theme.css';
import Home         from "./Home";
import MoviesPage   from "./Movie";
import BooksPage    from "./Books";
import Stats        from "./Stats";
import Health       from "./Health";
import {
  INGREDIENTS as DEFAULT_INGREDIENTS,
  RECIPES     as DEFAULT_RECIPES,
  WORKOUTS    as DEFAULT_WORKOUTS,
} from "./Data";

function loadFromStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch { return fallback; }
}

const DEFAULT_MOVIES = [
  { id: 1, title: "Big Fish",       date: "2026-03-03", image: null },
  { id: 2, title: "Hail Mary",      date: "2026-03-03", image: null },
  { id: 3, title: "Mallrats",       date: "2026-03-11", image: null },
  { id: 4, title: "Mortal Kombat",  date: "2026-03-19", image: null },
];

const DEFAULT_BOOKS = [
  { id: 1, title: "Kitchen",      startDate: "2026-03-01", endDate: "2026-03-10", color: "#2a3d5a" },
  { id: 2, title: "The Odyssey",  startDate: "2026-03-08", endDate: "2026-03-22", color: "#2a4a28" },
  { id: 3, title: "White Nights", startDate: "2026-03-18", endDate: "2026-03-25", color: "#6b4e18" },
  { id: 4, title: "Rashomon",     startDate: "2026-03-20", endDate: "2026-03-31", color: "#3a2040" },
];

/* ── Nav items with icons ── */
const NAV_ITEMS = [
  { id: "home",   label: "Home",   icon: "◈" },
  { id: "movies", label: "Movies", icon: "▣" },
  { id: "books",  label: "Books",  icon: "≡" },
  { id: "health", label: "Health", icon: "✦" },
  { id: "stats",  label: "Stats",  icon: "◎" },
];

const NAV_CSS = `
  .app-root {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background: var(--bg);
  }

  /* ── Top nav ── */
  .app-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 22px;
    height: 52px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    position: relative;
    z-index: 100;
  }

  /* Gold + blue gradient underline — same as every page topbar */
  .app-nav::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%,
      var(--blue-dim) 15%,
      var(--gold) 50%,
      var(--blue-dim) 85%,
      transparent 100%
    );
  }

  .app-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 0.22em;
    color: var(--gold);
    line-height: 1;
    flex-shrink: 0;
  }

  .app-logo-sub {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.3em;
    color: var(--cream-mid);
    text-transform: uppercase;
    display: block;
    margin-top: -1px;
  }

  .app-nav-links {
    display: flex;
    gap: 2px;
    align-items: center;
  }

  .app-nav-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: 1px solid transparent;
    border-radius: 2px;
    padding: 5px 12px;
    font-family: 'IBM Plex Mono', monospace;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--cream-mid);
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
    white-space: nowrap;
  }

  .app-nav-btn:hover {
    color: var(--cream);
    border-color: var(--border);
    background: var(--surface2);
  }

  .app-nav-btn.active {
    color: var(--gold);
    border-color: var(--border);
    background: var(--surface2);
    position: relative;
  }

  /* Active indicator dot above the button */
  .app-nav-btn.active::before {
    content: '';
    position: absolute;
    top: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--gold);
  }

  .app-nav-icon {
    font-size: 11px;
    line-height: 1;
    opacity: 0.7;
  }

  /* Page content area */
  .app-content {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  /* ── Mobile: bottom tab bar ── */
  @media (max-width: 600px) {
    .app-nav {
      display: none;
    }
    .app-root {
      flex-direction: column-reverse;
    }
    .app-bottom-nav {
      display: flex !important;
    }
    .app-content {
      flex: 1;
      min-height: 0;
    }
  }

  .app-bottom-nav {
    display: none;
    align-items: center;
    justify-content: space-around;
    height: 56px;
    background: var(--surface);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
    position: relative;
    z-index: 100;
  }

  .app-bottom-nav::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg,
      transparent 0%, var(--blue-dim) 20%,
      var(--gold) 50%, var(--blue-dim) 80%, transparent 100%
    );
  }

  .app-tab-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px 14px;
    color: var(--cream-mid);
    font-family: 'IBM Plex Mono', monospace;
    transition: color 0.15s;
    flex: 1;
  }

  .app-tab-btn.active { color: var(--gold); }

  .app-tab-icon {
    font-size: 16px;
    line-height: 1;
  }

  .app-tab-label {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }
`;

export default function App() {
  const [page, setPage] = useState("home");

  const [movies,      setMovies]      = useState(() => loadFromStorage("lt_movies",      DEFAULT_MOVIES));
  const [books,       setBooks]       = useState(() => loadFromStorage("lt_books",       DEFAULT_BOOKS));
  const [healthLogs,  setHealthLogs]  = useState(() => loadFromStorage("lt_health",      {}));
  const [workouts,    setWorkouts]    = useState(() => loadFromStorage("lt_workouts",    DEFAULT_WORKOUTS));
  const [ingredients, setIngredients] = useState(() => loadFromStorage("lt_ingredients", DEFAULT_INGREDIENTS));
  const [recipes,     setRecipes]     = useState(() => loadFromStorage("lt_recipes",     DEFAULT_RECIPES));

  useEffect(() => { localStorage.setItem("lt_movies",      JSON.stringify(movies));      }, [movies]);
  useEffect(() => { localStorage.setItem("lt_books",       JSON.stringify(books));       }, [books]);
  useEffect(() => { localStorage.setItem("lt_health",      JSON.stringify(healthLogs));  }, [healthLogs]);
  useEffect(() => { localStorage.setItem("lt_workouts",    JSON.stringify(workouts));    }, [workouts]);
  useEffect(() => { localStorage.setItem("lt_ingredients", JSON.stringify(ingredients)); }, [ingredients]);
  useEffect(() => { localStorage.setItem("lt_recipes",     JSON.stringify(recipes));     }, [recipes]);

  function updateHealthLog(ymd, updater) {
    setHealthLogs((prev) => {
      const empty = { food: {}, workouts: {}, steps: "" };
      return { ...prev, [ymd]: updater(prev[ymd] || empty) };
    });
  }

  const pageContent = (
    <div className="app-content">
      {page === "home" && (
        <Home
          movies={movies} books={books}
          healthLogs={healthLogs} updateHealthLog={updateHealthLog}
          workouts={workouts} ingredients={ingredients} recipes={recipes}
        />
      )}
      {page === "stats" && (
        <Stats
          movies={movies} books={books}
          healthLogs={healthLogs} workouts={workouts}
          ingredients={ingredients} recipes={recipes}
        />
      )}
      {page === "movies" && (
        <MoviesPage movies={movies} setMovies={setMovies} />
      )}
      {page === "books" && (
        <BooksPage books={books} setBooks={setBooks} />
      )}
      {page === "health" && (
        <Health
          healthLogs={healthLogs} updateHealthLog={updateHealthLog}
          workouts={workouts} setWorkouts={setWorkouts}
          ingredients={ingredients} setIngredients={setIngredients}
          recipes={recipes} setRecipes={setRecipes}
        />
      )}
    </div>
  );

  return (
    <>
      <style>{NAV_CSS}</style>
      <div className="app-root">

        {/* ── Desktop top nav ── */}
        <nav className="app-nav">
          <div>
            <span className="app-logo">Life Tracker</span>
            <span className="app-logo-sub">personal log</span>
          </div>

          <div className="app-nav-links">
            {NAV_ITEMS.map(({ id, label, icon }) => (
              <button
                key={id}
                className={`app-nav-btn${page === id ? " active" : ""}`}
                onClick={() => setPage(id)}
              >
                <span className="app-nav-icon">{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* Right side — subtle build stamp */}
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 8,
            color: "var(--cream-lo)",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            v1.0 · 2026
          </span>
        </nav>

        {/* Page */}
        {pageContent}

        {/* ── Mobile bottom tab bar ── */}
        <nav className="app-bottom-nav">
          {NAV_ITEMS.map(({ id, label, icon }) => (
            <button
              key={id}
              className={`app-tab-btn${page === id ? " active" : ""}`}
              onClick={() => setPage(id)}
            >
              <span className="app-tab-icon">{icon}</span>
              <span className="app-tab-label">{label}</span>
            </button>
          ))}
        </nav>

      </div>
    </>
  );
}