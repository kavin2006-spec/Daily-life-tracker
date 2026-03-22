import React, { useState } from "react";

/* ── Colour swatches use the theme palette ── */
const COLORS = [
  "#2a3d5a", /* blue-dim   */
  "#2a4a28", /* green-dim  */
  "#6b4e18", /* gold-dim   */
  "#3a2040", /* purple-dim */
  "#3a2020", /* red-dim    */
  "#1e3040", /* teal-dim   */
];

const PAGE_CSS = `
  .bk-page {
    display: flex; flex-direction: column; height: 100%;
    font-family: 'IBM Plex Mono', monospace;
    background: var(--bg); color: var(--cream);
    position: relative;
  }

  /* Top bar */
  .bk-topbar {
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 22px; height: 52px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0; position: relative;
  }
  .bk-topbar::after {
    content: ''; position: absolute;
    bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg,
      transparent 0%, var(--blue-dim) 15%,
      var(--gold) 50%, var(--blue-dim) 85%, transparent 100%);
  }
  .bk-month-nav { display: flex; align-items: center; gap: 14px; }
  .bk-month-display { text-align: center; min-width: 180px; }
  .bk-month-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px; letter-spacing: 0.12em;
    color: var(--cream); line-height: 1; display: block;
  }
  .bk-month-sub {
    font-size: 10px; letter-spacing: 0.2em;
    color: var(--gold); display: block; margin-top: 1px;
  }
  .bk-nav-btn {
    width: 28px; height: 28px; background: none;
    border: 1px solid var(--border-blue); border-radius: 2px;
    color: var(--blue); font-size: 15px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-family: 'IBM Plex Mono', monospace;
    transition: border-color 0.15s, color 0.15s, background 0.15s;
  }
  .bk-nav-btn:hover { border-color: var(--gold); color: var(--gold); background: var(--gold-lo); }
  .bk-wordmark {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 11px; letter-spacing: 0.3em;
    color: var(--gold); opacity: 0.65;
  }

  /* Scroll */
  .bk-scroll {
    flex: 1; overflow-y: auto; padding: 20px 22px;
    scrollbar-width: thin; scrollbar-color: var(--gold-dim) transparent;
  }

  /* Axis */
  .bk-axis-row { display: flex; align-items: flex-end; margin-bottom: 6px; }
  .bk-name-col { width: 130px; flex-shrink: 0; }
  .bk-timeline-col { flex: 1; position: relative; height: 22px; }
  .bk-axis-label {
    position: absolute; font-size: 10px; color: var(--cream-mid);
    transform: translateX(-50%); letter-spacing: 0.05em;
    font-family: 'IBM Plex Mono', monospace;
  }
  .bk-grid-line {
    position: absolute; top: 0; bottom: 0;
    width: 1px; background: rgba(212,168,75,0.07);
  }

  /* Book row */
  .bk-book-row {
    display: flex; align-items: center;
    margin-bottom: 12px; cursor: pointer;
    transition: opacity 0.15s;
  }
  .bk-book-row:hover { opacity: 0.85; }
  .bk-book-name {
    font-size: 11px; color: var(--cream-mid);
    white-space: nowrap; overflow: hidden;
    text-overflow: ellipsis; padding-right: 10px;
    letter-spacing: 0.04em;
  }
  .bk-bar {
    position: absolute; height: 24px;
    display: flex; align-items: center; overflow: hidden;
    opacity: 0.85; transition: opacity 0.15s;
  }
  .bk-bar-label {
    font-size: 11px; color: rgba(216,208,188,0.9);
    padding-left: 7px; white-space: nowrap;
    overflow: hidden; text-overflow: ellipsis; flex: 1;
    font-family: 'IBM Plex Mono', monospace; letter-spacing: 0.04em;
  }
  .bk-arrow { font-size: 10px; color: rgba(216,208,188,0.8); padding: 0 4px; flex-shrink: 0; }
  .bk-empty {
    font-size: 11px; color: var(--cream-lo);
    font-style: italic; padding: 20px 0; letter-spacing: 0.05em;
  }

  /* Add bar */
  .bk-addbar {
    background: var(--surface);
    border-top: 2px solid transparent;
    border-image: linear-gradient(90deg, transparent, var(--blue-dim), var(--gold-dim), transparent) 1;
    padding: 13px 22px 15px; flex-shrink: 0;
  }
  .bk-addbar-header { display: flex; align-items: center; gap: 10px; margin-bottom: 11px; }
  .bk-addbar-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.25em;
    text-transform: uppercase; color: var(--gold);
  }
  .bk-addbar-rule { flex: 1; height: 1px; background: linear-gradient(90deg, var(--border), transparent); }
  .bk-form-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .bk-input {
    flex: 1; min-width: 100px; height: 32px;
    background: var(--surface2); border: 1px solid var(--border-blue);
    border-radius: 2px; padding: 0 10px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    color: var(--cream); outline: none; box-sizing: border-box;
    transition: border-color 0.15s, background 0.15s;
  }
  .bk-input:focus { border-color: var(--gold); background: var(--surface3); }
  .bk-input::placeholder { color: var(--cream-lo); }
  input[type="date"].bk-input::-webkit-calendar-picker-indicator {
    filter: invert(0.5) sepia(1) hue-rotate(180deg) saturate(1.5); cursor: pointer;
  }
  .bk-color-row { display: flex; gap: 6px; align-items: center; }
  .bk-color-dot {
    width: 18px; height: 18px; border-radius: 2px; cursor: pointer;
    border: 1px solid rgba(212,168,75,0.2);
    transition: transform 0.12s, border-color 0.12s;
  }
  .bk-color-dot:hover { transform: scale(1.15); }
  .bk-color-dot.selected { border-color: var(--gold); outline: 2px solid var(--gold); outline-offset: 1px; }
  .bk-add-btn {
    height: 32px; padding: 0 14px;
    background: var(--blue-dim); color: var(--blue);
    border: 1px solid var(--blue-dim); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 10px; font-weight: 700;
    letter-spacing: 0.18em; text-transform: uppercase; cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }
  .bk-add-btn:hover { background: var(--gold); border-color: var(--gold); color: var(--bg); }
  .bk-add-btn:active { transform: scale(0.97); }

  /* Modal */
  @keyframes bk-modal-in {
    from { opacity: 0; transform: translateY(10px) scale(0.98); }
    to   { opacity: 1; transform: none; }
  }
  .bk-overlay {
    position: fixed; inset: 0; background: rgba(8,8,12,0.9);
    display: flex; align-items: center; justify-content: center;
    z-index: 500; backdrop-filter: blur(4px);
  }
  .bk-modal {
    background: var(--surface); border: 1px solid rgba(122,156,196,0.3);
    border-radius: 3px; width: 310px; overflow: hidden;
    animation: bk-modal-in 0.18s ease;
    box-shadow: 0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px rgba(212,168,75,0.08);
  }
  .bk-modal-header {
    background: var(--surface2); border-bottom: 1px solid var(--border);
    padding: 12px 16px 10px; display: flex; align-items: baseline;
    gap: 10px; position: relative;
  }
  .bk-modal-header::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--blue-dim), var(--gold-dim), transparent);
  }
  .bk-modal-title {
    font-family: 'Bebas Neue', sans-serif; font-size: 18px;
    letter-spacing: 0.15em; color: var(--cream); line-height: 1; margin: 0;
  }
  .bk-modal-sub { font-size: 10px; color: var(--blue); letter-spacing: 0.15em; text-transform: uppercase; }
  .bk-modal-body { padding: 14px 16px; display: flex; flex-direction: column; gap: 10px; }
  .bk-modal-label { font-size: 10px; color: var(--cream-mid); letter-spacing: 0.14em; text-transform: uppercase; }
  .bk-modal-input {
    width: 100%; height: 34px; background: var(--surface2);
    border: 1px solid var(--border-blue); border-radius: 2px; padding: 0 10px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--cream);
    outline: none; letter-spacing: 0.03em; box-sizing: border-box;
    transition: border-color 0.15s;
  }
  .bk-modal-input:focus { border-color: var(--gold); }
  .bk-modal-actions { display: flex; gap: 7px; padding: 0 16px 14px; }
  .bk-btn-del {
    flex: 1; height: 32px; background: var(--red-lo); color: var(--red);
    border: 1px solid var(--red-mid); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .bk-btn-del:hover { background: rgba(180,60,60,0.22); color: #e09090; }
  .bk-btn-cancel {
    flex: 1; height: 32px; background: transparent; color: var(--cream-mid);
    border: 1px solid var(--border); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px;
    letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
  }
  .bk-btn-cancel:hover { border-color: var(--blue); color: var(--blue); }
  .bk-btn-save {
    flex: 1; height: 32px; background: var(--gold-dim); color: var(--gold);
    border: 1px solid var(--gold-dim); border-radius: 2px;
    font-family: 'IBM Plex Mono', monospace; font-size: 11px; font-weight: 700;
    letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .bk-btn-save:hover { background: var(--gold); color: var(--bg); }

  @media (max-width: 480px) {
    .bk-topbar { padding: 0 14px; }
    .bk-scroll  { padding: 14px; }
    .bk-addbar  { padding: 11px 14px 13px; }
    .bk-name-col { width: 90px; }
    .bk-wordmark { display: none; }
  }
`;

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export default function BooksPage({ books, setBooks }) {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [newTitle,  setNewTitle]  = useState("");
  const [newStart,  setNewStart]  = useState("");
  const [newEnd,    setNewEnd]    = useState("");
  const [newColor,  setNewColor]  = useState(COLORS[0]);
  const [editingBook, setEditingBook] = useState(null);
  const [editTitle,   setEditTitle]   = useState("");
  const [editStart,   setEditStart]   = useState("");
  const [editEnd,     setEditEnd]     = useState("");
  const [editColor,   setEditColor]   = useState(COLORS[0]);

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  const totalDays = daysInMonth(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth, 1)
    .toLocaleString("default", { month: "long" });

  const mStart = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
  const mEnd   = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;

  const monthBooks = books.filter((b) => b.startDate <= mEnd && b.endDate >= mStart);

  function getBarInfo(book) {
    const clampedStart = book.startDate < mStart ? mStart : book.startDate;
    const clampedEnd   = book.endDate   > mEnd   ? mEnd   : book.endDate;
    const startDay = parseInt(clampedStart.split("-")[2]);
    const endDay   = parseInt(clampedEnd.split("-")[2]);
    const left  = ((startDay - 1) / totalDays) * 100;
    const width = Math.max(((endDay - startDay + 1) / totalDays) * 100, 1.5);
    return {
      left, width,
      continuesLeft:  book.startDate < mStart,
      continuesRight: book.endDate   > mEnd,
    };
  }

  function handleAdd() {
    if (!newTitle || !newStart || !newEnd) return;
    setBooks([...books, { id: Date.now(), title: newTitle, startDate: newStart, endDate: newEnd, color: newColor }]);
    setNewTitle(""); setNewStart(""); setNewEnd(""); setNewColor(COLORS[0]);
  }

  function openEdit(book) {
    setEditingBook(book); setEditTitle(book.title);
    setEditStart(book.startDate); setEditEnd(book.endDate); setEditColor(book.color);
  }

  function handleSaveEdit() {
    setBooks(books.map((b) =>
      b.id === editingBook.id
        ? { ...b, title: editTitle, startDate: editStart, endDate: editEnd, color: editColor }
        : b
    ));
    setEditingBook(null);
  }

  function handleDelete() {
    setBooks(books.filter((b) => b.id !== editingBook.id));
    setEditingBook(null);
  }

  const axisMarkers = [];
  for (let d = 1; d <= totalDays; d += 5) axisMarkers.push(d);
  if (axisMarkers[axisMarkers.length - 1] !== totalDays) axisMarkers.push(totalDays);

  return (
    <>
      <style>{PAGE_CSS}</style>
      <div className="bk-page">

        {/* Top bar */}
        <div className="bk-topbar">
          <span className="bk-wordmark">Life Tracker</span>
          <div className="bk-month-nav">
            <button className="bk-nav-btn" onClick={prevMonth}>‹</button>
            <div className="bk-month-display">
              <span className="bk-month-name">{monthName}</span>
              <span className="bk-month-sub">
                {currentYear} · {monthBooks.length} book{monthBooks.length !== 1 ? "s" : ""}
              </span>
            </div>
            <button className="bk-nav-btn" onClick={nextMonth}>›</button>
          </div>
          <span style={{ width: 80 }} />
        </div>

        {/* Timeline */}
        <div className="bk-scroll">
          {/* Axis */}
          <div className="bk-axis-row">
            <div className="bk-name-col" />
            <div className="bk-timeline-col">
              {axisMarkers.map((d) => (
                <span key={d} className="bk-axis-label"
                  style={{ left: `${((d - 1) / totalDays) * 100}%` }}>
                  {d}
                </span>
              ))}
            </div>
          </div>

          {monthBooks.length === 0 ? (
            <p className="bk-empty">— no books this month —</p>
          ) : (
            monthBooks.map((book) => {
              const { left, width, continuesLeft, continuesRight } = getBarInfo(book);
              const radius = continuesLeft && continuesRight ? 0
                : continuesLeft  ? "0 3px 3px 0"
                : continuesRight ? "3px 0 0 3px"
                : 3;
              return (
                <div key={book.id} className="bk-book-row" onClick={() => openEdit(book)}>
                  <div className="bk-name-col">
                    <span className="bk-book-name">{book.title}</span>
                  </div>
                  <div className="bk-timeline-col">
                    {axisMarkers.map((d) => (
                      <div key={d} className="bk-grid-line"
                        style={{ left: `${((d - 1) / totalDays) * 100}%` }} />
                    ))}
                    <div className="bk-bar" style={{
                      left: `${left}%`, width: `${width}%`,
                      backgroundColor: book.color, borderRadius: radius,
                    }}>
                      {continuesLeft  && <span className="bk-arrow">←</span>}
                      <span className="bk-bar-label">{book.title}</span>
                      {continuesRight && <span className="bk-arrow">→</span>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add bar */}
        <div className="bk-addbar">
          <div className="bk-addbar-header">
            <span className="bk-addbar-label">Log a book</span>
            <span className="bk-addbar-rule" />
          </div>
          <div className="bk-form-row">
            <input className="bk-input" placeholder="Book title" value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)} />
            <input className="bk-input" type="date" value={newStart} style={{ width: 130, flex: "none" }}
              onChange={(e) => setNewStart(e.target.value)} />
            <input className="bk-input" type="date" value={newEnd} style={{ width: 130, flex: "none" }}
              onChange={(e) => setNewEnd(e.target.value)} />
            <div className="bk-color-row">
              {COLORS.map((c) => (
                <div key={c} className={`bk-color-dot${newColor === c ? " selected" : ""}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setNewColor(c)} />
              ))}
            </div>
            <button className="bk-add-btn" onClick={handleAdd}>log</button>
          </div>
        </div>

        {/* Edit modal */}
        {editingBook && (
          <div className="bk-overlay" onClick={() => setEditingBook(null)}>
            <div className="bk-modal" onClick={(e) => e.stopPropagation()}>
              <div className="bk-modal-header">
                <h3 className="bk-modal-title">Edit Entry</h3>
                <span className="bk-modal-sub">book log</span>
              </div>
              <div className="bk-modal-body">
                <input className="bk-modal-input" placeholder="Book title"
                  value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <span className="bk-modal-label">Start date</span>
                <input className="bk-modal-input" type="date"
                  value={editStart} onChange={(e) => setEditStart(e.target.value)} />
                <span className="bk-modal-label">End date</span>
                <input className="bk-modal-input" type="date"
                  value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
                <span className="bk-modal-label">Colour</span>
                <div className="bk-color-row">
                  {COLORS.map((c) => (
                    <div key={c} className={`bk-color-dot${editColor === c ? " selected" : ""}`}
                      style={{ backgroundColor: c, width: 22, height: 22 }}
                      onClick={() => setEditColor(c)} />
                  ))}
                </div>
              </div>
              <div className="bk-modal-actions">
                <button className="bk-btn-del"    onClick={handleDelete}>delete</button>
                <button className="bk-btn-cancel" onClick={() => setEditingBook(null)}>cancel</button>
                <button className="bk-btn-save"   onClick={handleSaveEdit}>save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
