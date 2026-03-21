import React, { useState } from "react";

const COLORS = ["#1a4a7a", "#3b6d11", "#854f0b", "#993556", "#4a1b8a", "#0f6e56"];

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
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  }

  const totalDays = daysInMonth(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth, 1)
    .toLocaleString("default", { month: "long" });

  // Month boundaries as comparable strings
  const mStart = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-01`;
  const mEnd   = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(totalDays).padStart(2, "0")}`;

  // Books that overlap this month at all
  const monthBooks = books.filter((b) => b.startDate <= mEnd && b.endDate >= mStart);

  function getBarInfo(book) {
    // Clamp start/end to current month
    const clampedStart = book.startDate < mStart ? mStart : book.startDate;
    const clampedEnd   = book.endDate   > mEnd   ? mEnd   : book.endDate;

    const startDay = parseInt(clampedStart.split("-")[2]);
    const endDay   = parseInt(clampedEnd.split("-")[2]);

    const left  = ((startDay - 1) / totalDays) * 100;
    const width = Math.max(((endDay - startDay + 1) / totalDays) * 100, 1.5);

    // Arrows when book extends beyond this month
    const continuesLeft  = book.startDate < mStart;
    const continuesRight = book.endDate   > mEnd;

    return { left, width, continuesLeft, continuesRight };
  }

  function handleAdd() {
    if (!newTitle || !newStart || !newEnd) return;
    setBooks([...books, {
      id: Date.now(), title: newTitle,
      startDate: newStart, endDate: newEnd, color: newColor,
    }]);
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

  // Axis markers every 5 days
  const axisMarkers = [];
  for (let d = 1; d <= totalDays; d += 5) axisMarkers.push(d);
  if (axisMarkers[axisMarkers.length - 1] !== totalDays) axisMarkers.push(totalDays);

  return (
    <div style={s.page}>

      <div style={s.topBar}>
        <button style={s.navBtn} onClick={prevMonth}>← Prev</button>
        <span style={s.monthLabel}>{monthName} {currentYear} · Books</span>
        <button style={s.navBtn} onClick={nextMonth}>Next →</button>
      </div>

      <div style={s.scrollArea}>

        {/* Axis */}
        <div style={s.axisRow}>
          <div style={s.nameCol} />
          <div style={s.timelineCol}>
            {axisMarkers.map((d) => (
              <span key={d} style={{ ...s.axisLabel, left: `${((d - 1) / totalDays) * 100}%` }}>
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* Book rows */}
        {monthBooks.length === 0 ? (
          <p style={s.emptyText}>No books this month — add one below</p>
        ) : (
          monthBooks.map((book) => {
            const { left, width, continuesLeft, continuesRight } = getBarInfo(book);
            return (
              <div key={book.id} style={s.bookRow} onClick={() => openEdit(book)}>
                <div style={s.nameCol}>
                  <span style={s.bookName}>{book.title}</span>
                </div>
                <div style={s.timelineCol}>
                  {/* Grid lines */}
                  {axisMarkers.map((d) => (
                    <div key={d} style={{ ...s.gridLine, left: `${((d - 1) / totalDays) * 100}%` }} />
                  ))}
                  {/* Bar */}
                  <div style={{
                    ...s.bar,
                    left: `${left}%`,
                    width: `${width}%`,
                    backgroundColor: book.color,
                    borderRadius: continuesLeft && continuesRight ? 0
                      : continuesLeft ? "0 5px 5px 0"
                      : continuesRight ? "5px 0 0 5px"
                      : 5,
                  }}>
                    {continuesLeft  && <span style={s.arrowLeft}>←</span>}
                    <span style={s.barLabel}>{book.title}</span>
                    {continuesRight && <span style={s.arrowRight}>→</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ADD FORM */}
      <div style={s.addBar}>
        <p style={s.addLabel}>ADD BOOK</p>
        <div style={s.formRow}>
          <input style={s.input} placeholder="Book name" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <input style={{ ...s.input, width: 140 }} type="date" value={newStart} onChange={(e) => setNewStart(e.target.value)} />
          <input style={{ ...s.input, width: 140 }} type="date" value={newEnd}   onChange={(e) => setNewEnd(e.target.value)} />
          <div style={s.colorRow}>
            {COLORS.map((c) => (
              <div key={c} onClick={() => setNewColor(c)}
                style={{ ...s.colorDot, backgroundColor: c, outline: newColor === c ? "2px solid #fff" : "none" }} />
            ))}
          </div>
          <button style={s.addBtn} onClick={handleAdd}>Add</button>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingBook && (
        <div style={s.modalOverlay} onClick={() => setEditingBook(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={s.modalTitle}>Edit Book</h3>
            <input style={s.modalInput} placeholder="Book name" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            <label style={s.modalLabel}>Start date</label>
            <input style={s.modalInput} type="date" value={editStart} onChange={(e) => setEditStart(e.target.value)} />
            <label style={s.modalLabel}>End date</label>
            <input style={s.modalInput} type="date" value={editEnd} onChange={(e) => setEditEnd(e.target.value)} />
            <label style={s.modalLabel}>Color</label>
            <div style={s.colorRow}>
              {COLORS.map((c) => (
                <div key={c} onClick={() => setEditColor(c)}
                  style={{ ...s.colorDot, backgroundColor: c, outline: editColor === c ? "2px solid #fff" : "none" }} />
              ))}
            </div>
            <div style={s.modalBtns}>
              <button style={s.deleteBtn} onClick={handleDelete}>Delete</button>
              <button style={s.cancelBtn} onClick={() => setEditingBook(null)}>Cancel</button>
              <button style={s.saveBtn} onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s = {
  page:       { display: "flex", flexDirection: "column", height: "100%", fontFamily: "sans-serif", backgroundColor: "#141414", color: "#eee" },
  topBar:     { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", backgroundColor: "#1c1c1c", borderBottom: "1px solid #2a2a2a", flexShrink: 0 },
  navBtn:     { background: "none", border: "1px solid #3a3a3a", borderRadius: 8, padding: "4px 14px", cursor: "pointer", fontSize: 13, color: "#888" },
  monthLabel: { fontSize: 17, fontWeight: 600, color: "#eee" },
  scrollArea: { flex: 1, overflowY: "auto", padding: "20px" },
  axisRow:    { display: "flex", alignItems: "flex-end", marginBottom: 6 },
  nameCol:    { width: 130, flexShrink: 0 },
  timelineCol:{ flex: 1, position: "relative", height: 24 },
  axisLabel:  { position: "absolute", fontSize: 10, color: "#555", transform: "translateX(-50%)" },
  gridLine:   { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "#2a2a2a" },
  bookRow:    { display: "flex", alignItems: "center", marginBottom: 14, cursor: "pointer" },
  bookName:   { fontSize: 12, color: "#aaa", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", paddingRight: 8 },
  bar:        { position: "absolute", height: 26, display: "flex", alignItems: "center", overflow: "hidden" },
  barLabel:   { fontSize: 10, color: "rgba(255,255,255,0.85)", paddingLeft: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 },
  arrowLeft:  { fontSize: 10, color: "rgba(255,255,255,0.85)", paddingLeft: 4, flexShrink: 0 },
  arrowRight: { fontSize: 10, color: "rgba(255,255,255,0.85)", paddingRight: 4, flexShrink: 0 },
  emptyText:  { fontSize: 13, color: "#444", fontStyle: "italic" },
  addBar:     { backgroundColor: "#1c1c1c", borderTop: "1px solid #2a2a2a", padding: "12px 20px", flexShrink: 0 },
  addLabel:   { fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.06em", marginBottom: 8 },
  formRow:    { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  input:      { flex: 1, minWidth: 120, height: 36, border: "1px solid #333", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box", backgroundColor: "#242424", color: "#ddd" },
  colorRow:   { display: "flex", gap: 6, alignItems: "center" },
  colorDot:   { width: 20, height: 20, borderRadius: "50%", cursor: "pointer", outlineOffset: 2 },
  addBtn:     { height: 36, padding: "0 18px", backgroundColor: "#1a4a7a", color: "#7ab3e0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  modalOverlay:{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal:      { backgroundColor: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 14, padding: "24px 24px 20px", width: 320, display: "flex", flexDirection: "column", gap: 10 },
  modalTitle: { fontSize: 16, fontWeight: 700, margin: 0, color: "#eee" },
  modalLabel: { fontSize: 11, color: "#555", fontWeight: 700, letterSpacing: "0.05em" },
  modalInput: { width: "100%", height: 38, border: "1px solid #333", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box", backgroundColor: "#242424", color: "#ddd" },
  modalBtns:  { display: "flex", gap: 8, marginTop: 4 },
  deleteBtn:  { flex: 1, height: 36, backgroundColor: "#2a1515", color: "#e07070", border: "1px solid #3a2020", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  cancelBtn:  { flex: 1, height: 36, backgroundColor: "#242424", color: "#888", border: "1px solid #333", borderRadius: 8, fontSize: 13, cursor: "pointer" },
  saveBtn:    { flex: 1, height: 36, backgroundColor: "#1a4a7a", color: "#7ab3e0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
};