import React, { useState } from "react";


/* ─────────────────────────────────────────────
   PAGE STYLES
───────────────────────────────────────────── */
const PAGE_CSS = `
  .mv-page {
    display: flex; flex-direction: column;
    height: 100%;
    background: var(--bg);
    color: var(--cream);
    font-family: 'IBM Plex Mono', monospace;
    position: relative;
    overflow: hidden;
  }

  /* Top bar */
  .mv-topbar {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 22px; height: 52px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0; position: relative;
  }
  .mv-topbar::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg,
      transparent 0%, var(--blue-dim) 15%,
      var(--gold) 50%, var(--blue-dim) 85%, transparent 100%);
  }
  .mv-wordmark {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 11px; letter-spacing: 0.3em;
    color: var(--gold); opacity: 0.65;
  }
  .mv-month-nav { display: flex; align-items: center; gap: 14px; }
  .mv-month-display { text-align: center; min-width: 160px; }
  .mv-month-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px; letter-spacing: 0.12em;
    color: var(--cream); line-height: 1; display: block;
  }
  .mv-month-sub {
    font-size: 9px; letter-spacing: 0.2em;
    color: var(--gold); display: block; margin-top: 1px;
  }
  .mv-nav-btn {
    width: 28px; height: 28px;
    background: none; border: 1px solid var(--border-blue);
    border-radius: 2px; color: var(--blue); font-size: 15px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }
  .mv-nav-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-lo); }
  .mv-total-badge {
    font-size: 9px; color: var(--cream-lo);
    letter-spacing: 0.12em; border: 1px solid var(--cream-lo);
    padding: 2px 7px; border-radius: 2px;
  }

  /* Scroll */
  .mv-scroll {
    flex: 1; overflow-y: auto;
    padding: 18px 22px;
    display: flex; flex-direction: column; gap: 22px;
    scrollbar-width: thin;
    scrollbar-color: var(--gold-dim) transparent;
  }

  /* Week */
  .mv-week-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .mv-week-stamp {
    font-size: 8px; font-weight: 700;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--bg); background: var(--blue-dim);
    padding: 2px 7px 1px; border-radius: 1px;
  }
  .mv-week-range { font-size: 9px; color: var(--cream-mid); letter-spacing: 0.1em; }
  .mv-week-rule { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }
  .mv-week-count { font-size: 9px; color: var(--cream-lo); letter-spacing: 0.1em; }
  .mv-shelf {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 3px; padding: 14px; overflow-x: auto;
    scrollbar-width: thin; scrollbar-color: var(--gold-dim) transparent;
    box-shadow: inset 0 1px 0 rgba(122,156,196,0.06);
    transition: border-color 0.2s;
  }
  .mv-shelf:hover { border-color: var(--border-blue); }
  .mv-cards-row { display: flex; gap: 14px; width: max-content; min-width: 100%; }
  .mv-empty { font-size: 10px; color: var(--cream-lo); font-style: italic; padding: 10px 4px; letter-spacing: 0.05em; }

  /* Card */
  .mv-card { width: 96px; flex-shrink: 0; cursor: pointer; position: relative; transition: transform 0.18s ease; }
  .mv-card:hover { transform: translateY(-6px) rotate(-0.5deg); }
  .mv-card:hover .mv-card-inner {
    border-color: var(--gold);
    box-shadow: 0 12px 32px rgba(0,0,0,0.65), 0 0 0 1px var(--gold), 0 0 24px rgba(212,168,75,0.14);
  }
  .mv-card:hover .mv-foil { opacity: 1; }
  .mv-card:hover .mv-card-number { color: var(--gold); }
  .mv-card:hover .mv-edit-hint { opacity: 1; }
  .mv-card-inner {
    border: 1px solid rgba(122,156,196,0.2); border-radius: 3px;
    overflow: hidden; background: var(--surface2);
    transition: border-color 0.18s, box-shadow 0.18s; position: relative;
  }
  .mv-foil {
    position: absolute; inset: 0;
    background: linear-gradient(135deg,
      transparent 25%, rgba(122,156,196,0.06) 45%,
      rgba(212,168,75,0.06) 55%, transparent 75%);
    opacity: 0; transition: opacity 0.18s;
    pointer-events: none; z-index: 2; border-radius: 3px;
  }
  .mv-card-stripe {
    height: 4px;
    background: linear-gradient(90deg, var(--blue-dim), var(--blue), var(--gold));
  }
  .mv-card-img {
    width: 100%; height: 126px; object-fit: cover; display: block;
    filter: sepia(10%) contrast(1.04) saturate(0.85) hue-rotate(200deg);
    transition: filter 0.18s;
  }
  .mv-card:hover .mv-card-img { filter: sepia(5%) contrast(1.06) saturate(0.95) hue-rotate(200deg); }
  .mv-placeholder {
    width: 100%; height: 126px; background: var(--surface3);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center; gap: 6px;
    position: relative; overflow: hidden;
  }
  .mv-placeholder::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(122,156,196,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(122,156,196,0.04) 1px, transparent 1px);
    background-size: 12px 12px;
  }
  .mv-reel {
    width: 26px; height: 26px;
    border: 1.5px solid var(--blue-dim); border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    position: relative; z-index: 1;
  }
  .mv-reel::before {
    content: ''; width: 7px; height: 7px;
    border: 1.5px solid var(--blue-dim); border-radius: 50%;
  }
  .mv-placeholder-text { font-size: 7px; letter-spacing: 0.15em; color: var(--blue-dim); text-transform: uppercase; position: relative; z-index: 1; }
  .mv-card-body { padding: 7px 8px 6px; background: var(--surface2); border-top: 1px solid rgba(122,156,196,0.1); }
  .mv-card-title { font-size: 9px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--cream); line-height: 1.3; margin: 0; }
  .mv-card-date { font-size: 8px; color: var(--gold); letter-spacing: 0.1em; margin-top: 2px; }
  .mv-card-number { font-size: 7px; color: var(--cream-lo); letter-spacing: 0.08em; margin-top: 3px; transition: color 0.18s; }
  .mv-edit-hint {
    position: absolute; top: 8px; right: 6px;
    background: rgba(12,13,16,0.88); border: 1px solid var(--border-hi);
    border-radius: 2px; font-size: 7px; color: var(--gold);
    letter-spacing: 0.1em; padding: 2px 5px; text-transform: uppercase;
    opacity: 0; transition: opacity 0.15s; z-index: 3;
  }

  /* Add bar */
  .mv-addbar {
    background: var(--surface);
    border-top: 2px solid transparent;
    border-image: linear-gradient(90deg, transparent, var(--blue-dim), var(--gold-dim), transparent) 1;
    padding: 13px 22px 15px; flex-shrink: 0;
  }
  .mv-addbar-header { display: flex; align-items: center; gap: 10px; margin-bottom: 11px; }
  .mv-addbar-label { font-size: 8px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); }
  .mv-addbar-rule { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }
  .mv-form-row { display: flex; gap: 12px; align-items: flex-start; }
  .mv-upload-box {
    width: 62px; height: 80px;
    border: 1px dashed var(--border-blue); border-radius: 3px;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
    cursor: pointer; flex-shrink: 0; overflow: hidden;
    background: var(--surface2); transition: border-color 0.15s, background 0.15s; position: relative;
  }
  .mv-upload-box::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(122,156,196,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(122,156,196,0.03) 1px, transparent 1px);
    background-size: 10px 10px;
  }
  .mv-upload-box:hover { border-color: var(--gold); background: var(--gold-lo); }
  .mv-upload-icon { font-size: 13px; color: var(--blue-dim); z-index: 1; }
  .mv-upload-txt { font-size: 7px; color: var(--blue-dim); letter-spacing: 0.1em; text-transform: uppercase; z-index: 1; }
  .mv-upload-preview { width: 100%; height: 100%; object-fit: cover; }
  .mv-inputs-col { flex: 1; display: flex; flex-direction: column; gap: 7px; }
  .mv-input {
    width: 100%; height: 32px; background: var(--surface2);
    border: 1px solid var(--border-blue); border-radius: 2px;
    padding: 0 10px; font-family: 'IBM Plex Mono', monospace;
    font-size: 11px; color: var(--cream); outline: none;
    letter-spacing: 0.03em; box-sizing: border-box;
    transition: border-color 0.15s, background 0.15s;
  }
  .mv-input:focus { border-color: var(--gold); background: var(--surface3); }
  .mv-input::placeholder { color: var(--cream-lo); }
  input[type="date"].mv-input::-webkit-calendar-picker-indicator {
    filter: invert(0.5) sepia(1) hue-rotate(180deg) saturate(1.5); cursor: pointer;
  }
  .mv-row2 { display: flex; gap: 7px; }
  .mv-add-btn {
    height: 32px; padding: 0 14px;
    background: var(--blue-dim); color: var(--blue);
    border: 1px solid var(--blue-dim); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer; white-space: nowrap;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .mv-add-btn:hover { background: var(--gold); border-color: var(--gold); color: var(--bg); }
  .mv-add-btn:active { transform: scale(0.97); }

  /* Modal */
  @keyframes mv-modal-in {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to   { opacity: 1; transform: none; }
  }
  .mv-overlay {
    position: fixed; inset: 0; background: rgba(8,8,12,0.9);
    display: flex; align-items: center; justify-content: center;
    z-index: 500; backdrop-filter: blur(4px);
  }
  .mv-modal {
    background: var(--surface); border: 1px solid rgba(122,156,196,0.3);
    border-radius: 3px; width: 290px; overflow: hidden;
    animation: mv-modal-in 0.18s ease;
    box-shadow: 0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(212,168,75,0.08);
  }
  .mv-modal-header {
    background: var(--surface2); border-bottom: 1px solid var(--border);
    padding: 12px 16px 10px; display: flex; align-items: baseline; gap: 10px; position: relative;
  }
  .mv-modal-header::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--blue-dim), var(--gold-dim), transparent);
  }
  .mv-modal-title { font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.15em; color: var(--cream); line-height: 1; margin: 0; }
  .mv-modal-sub { font-size: 8px; color: var(--blue); letter-spacing: 0.15em; text-transform: uppercase; }
  .mv-modal-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
  .mv-modal-upload {
    width: 100%; height: 140px; border: 1px dashed var(--border-blue);
    border-radius: 3px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; overflow: hidden; background: var(--surface2);
    transition: border-color 0.15s; position: relative;
  }
  .mv-modal-upload::before {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(122,156,196,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(122,156,196,0.03) 1px, transparent 1px);
    background-size: 14px 14px;
  }
  .mv-modal-upload:hover { border-color: var(--gold); }
  .mv-modal-preview { width: 100%; height: 100%; object-fit: cover; }
  .mv-modal-upload-txt { font-size: 9px; color: var(--blue-dim); letter-spacing: 0.12em; text-transform: uppercase; z-index: 1; }
  .mv-modal-input {
    width: 100%; height: 34px; background: var(--surface2);
    border: 1px solid var(--border-blue); border-radius: 2px; padding: 0 10px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--cream);
    outline: none; letter-spacing: 0.03em; box-sizing: border-box; transition: border-color 0.15s;
  }
  .mv-modal-input:focus { border-color: var(--gold); }
  .mv-modal-actions { display: flex; gap: 7px; padding: 0 16px 14px; }
  .mv-btn-del {
    flex: 1; height: 32px; background: rgba(180,60,60,0.12); color: #c47070;
    border: 1px solid rgba(180,60,60,0.25); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .mv-btn-del:hover { background: rgba(180,60,60,0.22); color: #e09090; }
  .mv-btn-cancel {
    flex: 1; height: 32px; background: transparent; color: var(--cream-mid);
    border: 1px solid var(--border); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 9px;
    letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .mv-btn-cancel:hover { border-color: var(--blue); color: var(--blue); }
  .mv-btn-save {
    flex: 1; height: 32px; background: var(--gold-dim); color: var(--gold);
    border: 1px solid var(--gold-dim); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 9px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .mv-btn-save:hover { background: var(--gold); color: var(--bg); }

  /* Mobile */
  @media (max-width: 480px) {
    .mv-topbar { padding: 0 14px; }
    .mv-scroll  { padding: 14px; }
    .mv-addbar  { padding: 11px 14px 13px; }
    .mv-card    { width: 82px; }
    .mv-card-img, .mv-placeholder { height: 108px; }
    .mv-modal   { width: calc(100vw - 32px); }
    .mv-month-name { font-size: 22px; }
    .mv-wordmark, .mv-total-badge { display: none; }
  }
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function groupByWeek(movies) {
  const weeks = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  movies.forEach((m) => {
    const day = new Date(m.date).getUTCDate();
    weeks[Math.ceil(day / 7)].push(m);
  });
  Object.values(weeks).forEach((w) =>
    w.sort((a, b) => new Date(a.date) - new Date(b.date))
  );
  return weeks;
}

function readFile(file, cb) {
  const reader = new FileReader();
  reader.onload = () => cb(reader.result);
  reader.readAsDataURL(file);
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────────── */
function MovieCard({ movie, index, onClick }) {
  const dateStr = new Date(movie.date).toLocaleDateString("en-GB", {
    day: "2-digit", month: "short", timeZone: "UTC",
  });
  const num  = String(index + 1).padStart(3, "0");
  const year = new Date(movie.date).getUTCFullYear();

  return (
    <div className="mv-card" onClick={onClick}>
      <div className="mv-card-inner">
        <div className="mv-card-stripe" />
        {movie.image ? (
          <img src={movie.image} alt={movie.title} className="mv-card-img" />
        ) : (
          <div className="mv-placeholder">
            <div className="mv-reel" />
            <span className="mv-placeholder-text">no poster</span>
          </div>
        )}
        <div className="mv-foil" />
        <div className="mv-card-body">
          <p className="mv-card-title">{movie.title}</p>
          <p className="mv-card-date">{dateStr}</p>
          <p className="mv-card-number">#{num} · {year}</p>
        </div>
      </div>
      <div className="mv-edit-hint">edit</div>
    </div>
  );
}

function EditModal({ movie, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(movie.title);
  const [date,  setDate]  = useState(movie.date);
  const [image, setImage] = useState(movie.image);

  return (
    <div className="mv-overlay" onClick={onClose}>
      <div className="mv-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mv-modal-header">
          <h3 className="mv-modal-title">Edit Entry</h3>
          <span className="mv-modal-sub">film log</span>
        </div>
        <div className="mv-modal-body">
          <label className="mv-modal-upload">
            {image
              ? <img src={image} alt="preview" className="mv-modal-preview" />
              : <span className="mv-modal-upload-txt">+ change poster</span>
            }
            <input
              type="file" accept="image/*" style={{ display: "none" }}
              onChange={(e) => { if (e.target.files[0]) readFile(e.target.files[0], setImage); }}
            />
          </label>
          <input
            className="mv-modal-input" placeholder="Film title"
            value={title} onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="mv-modal-input" type="date"
            value={date} onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className="mv-modal-actions">
          <button className="mv-btn-del"    onClick={onDelete}>delete</button>
          <button className="mv-btn-cancel" onClick={onClose}>cancel</button>
          <button
            className="mv-btn-save"
            onClick={() => onSave({ ...movie, title, date, image })}
          >
            save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function MoviesPage({ movies, setMovies }) {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [newTitle,     setNewTitle]     = useState("");
  const [newDate,      setNewDate]      = useState("");
  const [newImage,     setNewImage]     = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  }

  const monthMovies = movies.filter((m) => {
    const d = new Date(m.date);
    return d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear;
  });
  const weeks = groupByWeek(monthMovies);

  function handleAdd() {
    if (!newTitle || !newDate) return;
    setMovies([...movies, { id: Date.now(), title: newTitle, date: newDate, image: newImage }]);
    setNewTitle(""); setNewDate(""); setNewImage(null);
  }

  function handleSave(updated) {
    setMovies(movies.map((m) => (m.id === updated.id ? updated : m)));
    setEditingMovie(null);
  }

  function handleDelete() {
    setMovies(movies.filter((m) => m.id !== editingMovie.id));
    setEditingMovie(null);
  }

  let cardIndex = 0;

  return (
    <>
      <style>{PAGE_CSS}</style>

      <div className="mv-page">
        {/* Top bar */}
        <div className="mv-topbar">
          <span className="mv-wordmark">Life Tracker</span>
          <div className="mv-month-nav">
            <button className="mv-nav-btn" onClick={prevMonth}>‹</button>
            <div className="mv-month-display">
              <span className="mv-month-name">{MONTHS[currentMonth]}</span>
              <span className="mv-month-sub">
                {currentYear} · {monthMovies.length} film{monthMovies.length !== 1 ? "s" : ""}
              </span>
            </div>
            <button className="mv-nav-btn" onClick={nextMonth}>›</button>
          </div>
          <span className="mv-total-badge">{movies.length} total</span>
        </div>

        {/* Weeks */}
        <div className="mv-scroll">
          {[1, 2, 3, 4, 5].map((wn) => {
            const wMovies = weeks[wn];
            const start   = (wn - 1) * 7 + 1;
            const end     = Math.min(wn * 7, 31);
            return (
              <div key={wn}>
                <div className="mv-week-header">
                  <span className="mv-week-stamp">Wk {wn}</span>
                  <span className="mv-week-range">{SHORT[currentMonth]} {start}–{end}</span>
                  <span className="mv-week-rule" />
                  <span className="mv-week-count">
                    {wMovies.length} film{wMovies.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="mv-shelf">
                  <div className="mv-cards-row">
                    {wMovies.length === 0 ? (
                      <span className="mv-empty">— no films logged —</span>
                    ) : (
                      wMovies.map((movie) => (
                        <MovieCard
                          key={movie.id}
                          movie={movie}
                          index={cardIndex++}
                          onClick={() => setEditingMovie(movie)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add bar */}
        <div className="mv-addbar">
          <div className="mv-addbar-header">
            <span className="mv-addbar-label">Log a film</span>
            <span className="mv-addbar-rule" />
          </div>
          <div className="mv-form-row">
            <label className="mv-upload-box">
              {newImage
                ? <img src={newImage} alt="preview" className="mv-upload-preview" />
                : <><span className="mv-upload-icon">▣</span><span className="mv-upload-txt">poster</span></>
              }
              <input
                type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => { if (e.target.files[0]) readFile(e.target.files[0], setNewImage); }}
              />
            </label>
            <div className="mv-inputs-col">
              <input
                className="mv-input" placeholder="Film title"
                value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
              <div className="mv-row2">
                <input
                  className="mv-input" type="date" value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button className="mv-add-btn" onClick={handleAdd}>log</button>
              </div>
            </div>
          </div>
        </div>

        {/* Edit modal */}
        {editingMovie && (
          <EditModal
            movie={editingMovie}
            onClose={() => setEditingMovie(null)}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  );
}
