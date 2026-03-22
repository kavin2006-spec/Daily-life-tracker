# Life Tracker

A personal productivity app I built to replace the combination of Excel sheets and separate apps I was using to track my daily habits. Everything lives in one place — health, fitness, reading and entertainment.

Built with React as my first real project after learning the basics.

<img width="1912" height="852" alt="image" src="https://github.com/user-attachments/assets/2d567517-257b-4360-a1df-e2fbc989fc36" />


**[Live Demo](https://daily-life-tracker-iota.vercel.app/)**

---

## What it does

### Home
Monthly calendar that gives a daily overview at a glance. Each day shows colour-coded indicators for movies watched, books currently being read and whether health data was logged. Clicking any day opens a summary popup with two tabs — one for entertainment, one for health — showing exactly what was logged that day including calories, protein, steps and what was watched or read.

### Movies
Movies are organised by week within each month. Each entry shows the poster image, title and date watched. The week rows scroll horizontally so there's no limit on how many you can log. Clicking any movie card opens an edit modal to update the title, date or poster image.

### Books
A timeline view rather than a calendar grid. Each book is displayed as a horizontal coloured bar spanning its start and end date across the days of the month. Books that run across multiple months show continuation arrows. Multiple books can overlap on the same timeline.

### Health
Daily logging through a calendar — click any day to open a logging popup split into three tabs:

- **Food** — recipes are built from individual ingredients. Each ingredient has calories and protein per 100g. When logging a meal you enter how many grams you actually ate and the calories and protein calculate automatically based on that.
- **Workouts** — select from a predefined list of exercises and enter sets completed. Calories burned are calculated per set based on preset values for each exercise.
- **Results** — shows calories consumed, calories burned, net balance and total protein for the day. Protein is shown against a 100–130g daily target range with a visual bar — green if on target, red if outside range.

Workouts, ingredients and recipes are managed through a slide-in panel accessible from the top bar, keeping the calendar full-screen and uncluttered.

### Stats
Monthly summary with six stat cards (calories consumed, calories burned, total steps, movies watched, books in progress, books finished) alongside detailed lists and a summary table. All figures update in real time as you log data. The page also includes Recharts-powered visualisations for a clearer picture of trends across the month.

---

## UI

The interface uses a custom dark theme drawn from a palette inspired by the landscapes of Elden Ring — deep near-black backgrounds, Erdtree gold as the primary accent, misty blue as a secondary, and sage green reserved for the Health page where it signals vitality and progress.

Every page shares the same design language: a `Bebas Neue` display font for headers and month names, `IBM Plex Mono` for all UI text and data, and a consistent set of micro-details — a CRT scanline overlay, film grain texture, and a gold-to-blue gradient rule running along every top bar — that give the app a cohesive analogue feel across all five pages.

Individual pages have their own personality within that system. The Movies page uses a baseball card layout with a colour stripe, catalogue number and a foil shimmer on hover. The Books timeline uses translucent coloured bars with continuation arrows. The Health calendar uses green cell highlights and dot indicators to show logged days at a glance. The Stats page uses Bebas Neue numerals in the stat cards to give the numbers visual weight.

All components and styles are written from scratch with no external UI libraries — layout is handled with CSS flexbox and grid, and animations use CSS transitions and keyframes only.

---

## Tech

- React (Create React App)
- Recharts for Stats page visualisations
- Figma to design the initial design of the UI
- UI design iterated with Claude (Anthropic) as a design collaborator
- No external UI libraries — all components and styles written from scratch
- Scoped CSS injected per page via `<style>` tags, with shared design tokens in `theme.css`
- localStorage for data persistence
- All shared state managed in `App.jsx` and passed down as props

---


## Running it locally

```bash
git clone https://github.com/kavin2006-spec/life-tracker.git
cd life-tracker
npm install
npm start
```

No environment variables or API keys needed. Opens at `http://localhost:3000`. Data is stored in your browser's localStorage so nothing is shared or synced.

---

## Why I built this

I was tracking calories and workouts in Excel, movies in a separate app and books in another. None of them talked to each other and the Excel sheet was getting unwieldy. I wanted one place to see everything and building it myself meant I could make it work exactly the way I wanted. With the rise of vibe-coding, I wanted to give it a shot too and soon it turned out to be more than a personal project. As vibe-coding gained popularity, I decided to give it a try as well, and it quickly became more than just a side project. The UI design and theming was developed collaboratively with Claude (Anthropic). I described the aesthetic direction I wanted — a 90s analogue feel with an Elden Ring-inspired colour palette — and iterated on the output until it matched what I had in mind. All the underlying app logic, data structures and React architecture are still my own work.

This was also my first real React project. The goal was to learn by building something I'd actually use rather than following a tutorial.

---

## What's next

- Cloud storage with Firebase (or Supabase) so data syncs across devices
