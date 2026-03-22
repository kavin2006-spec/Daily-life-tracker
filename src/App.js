import React, { useState, useEffect } from "react";
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
  { id: 1, title: "Big fish",  date: "2026-03-03", image: null },
  { id: 2, title: "Hail mary",  date: "2026-03-03", image: null },
  { id: 3, title: "Mallrats",  date: "2026-03-11", image: null },
  { id: 4, title: "Mortal kombat",  date: "2026-03-19", image: null },
];

const DEFAULT_BOOKS = [
  { id: 1, title: "Kitchen",          startDate: "2026-03-01", endDate: "2026-03-10", color: "#1a4a7a" },
  { id: 2, title: "The odyssey",       startDate: "2026-03-08", endDate: "2026-03-22", color: "#3b6d11" },
  { id: 3, title: "White nights",   startDate: "2026-03-18", endDate: "2026-03-25", color: "#854f0b" },
  { id: 4, title: "Roshomon", startDate: "2026-03-20", endDate: "2026-03-31", color: "#993556" },
];

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

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", backgroundColor: "#141414" }}>

      <nav style={navStyle}>
        <span style={logoStyle}>Life Tracker</span>
        <div style={linksStyle}>
          {[
            { id: "home",   label: "Home"   },
            { id: "stats",  label: "Stats"  },
            { id: "movies", label: "Movies" },
            { id: "books",  label: "Books"  },
            { id: "health", label: "Health" },
          ].map(({ id, label }) => (
            <button
              key={id}
              style={{ ...linkBtn, ...(page === id ? activeLinkBtn : {}) }}
              onClick={() => setPage(id)}
              onMouseEnter={(e) => { if (page !== id) e.currentTarget.style.color = "#aaa"; }}
              onMouseLeave={(e) => { if (page !== id) e.currentTarget.style.color = "#666"; }}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        {page === "home" && (
          <Home
            movies={movies}
            books={books}
            healthLogs={healthLogs}
            updateHealthLog={updateHealthLog}
            workouts={workouts}
            ingredients={ingredients}
            recipes={recipes}
          />
        )}
        {page === "stats" && (
          <Stats
            movies={movies}
            books={books}
            healthLogs={healthLogs}
            workouts={workouts}
            ingredients={ingredients}
            recipes={recipes}
          />
        )}
        {page === "movies" && (
          <MoviesPage
            movies={movies}
            setMovies={setMovies}
          />
        )}
        {page === "books" && (
          <BooksPage
            books={books}
            setBooks={setBooks}
          />
        )}
        {page === "health" && (
          <Health
            healthLogs={healthLogs}
            updateHealthLog={updateHealthLog}
            workouts={workouts}
            setWorkouts={setWorkouts}
            ingredients={ingredients}
            setIngredients={setIngredients}
            recipes={recipes}
            setRecipes={setRecipes}
          />
        )}
      </div>

    </div>
  );
}

const navStyle      = { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 52, backgroundColor: "#1c1c1c", borderBottom: "1px solid #2a2a2a", flexShrink: 0 };
const logoStyle     = { fontSize: 15, fontWeight: 700, color: "#7ab3e0", fontFamily: "sans-serif" };
const linksStyle    = { display: "flex", gap: 4 };
const linkBtn       = { background: "none", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "#666", cursor: "pointer", fontFamily: "sans-serif", transition: "color 0.15s, background 0.15s" };
const activeLinkBtn = { backgroundColor: "#1e2a3a", color: "#7ab3e0" };