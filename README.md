# Life Tracker

A personal life tracking app built with React. Combines health, fitness, entertainment and reading into one unified dashboard — replacing the need for multiple spreadsheets and apps.

## Live Demo
[Coming soon]

## Features

### 🏠 Home (Calendar)
- Monthly calendar overview
- Visual indicators for movies watched, books in progress and health logged
- Click any day for a full summary popup showing entertainment and health data

### 🎬 Movies
- Log movies by week with poster images
- Horizontal scroll per week — supports logging many movies
- Edit or delete any entry

### 📚 Books
- Timeline view across the month
- Each book shown as a colored bar from start to end date
- Handles books that span multiple months

### 💪 Health
- Calendar-based daily logging
- **Ingredient-based nutrition tracking** — recipes built from ingredients with calories and protein per 100g
- Workout logging with sets — calories auto-calculated per set
- Step tracking — calories calculated at 0.0425 cal/step
- Daily popup split into Food / Workouts / Results tabs
- Protein target indicator (100–130g range shown in green)
- Full ingredient and recipe editor built into the UI

### 📊 Stats
- Monthly summary of calories consumed and burned
- Total steps, average steps per day
- Movies watched and books read that month
- Net calorie balance

## Tech Stack
- **React** (Create React App)
- **JavaScript** — no TypeScript
- **CSS-in-JS** — all styles written as inline React style objects
- **localStorage** — persistent data storage, no backend required
- **No external UI libraries** — built from scratch

## Project Structure
```
src/
├── App.js          # Root component, shared state, localStorage persistence
├── Home.js         # Calendar overview + day summary popup
├── Movie.js        # Movies page
├── Books.js        # Books timeline page
├── Health.js       # Health tracking + ingredient/recipe editor
├── Stats.js        # Monthly statistics
└── data.js         # Default ingredients, recipes and workouts database
```

## To run Locally
```bash
git clone https://github.com/username/life-tracker.git
cd life-tracker
npm install
npm start
```

## Background
Built as a personal project to replace an Excel-based fitness and calorie tracker. The goal was to learn React by solving a real problem — tracking daily health, entertainment and reading habits in one place.

## Roadmap
- [ ] Cloud storage (Firebase / Supabase) for cross-device sync
- [ ] Mobile responsive layout
- [ ] Data visualisation charts (Recharts)
- [ ] CSV data export
- [ ] PWA support for mobile installation







