import React, { useState } from "react";

function groupByWeek(movies) {
const weeks = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  movies.forEach((movie) => {
    const day = new Date(movie.date).getUTCDate();
    const week = Math.ceil(day / 7);
    weeks[week].push(movie);
  });
  // Sort each week's movies by date ascending
  Object.values(weeks).forEach((week) => {
    week.sort((a, b) => new Date(a.date) - new Date(b.date));
  });
  return weeks;
}

export default function MoviesPage({ movies, setMovies }) {
  const today = new Date();
  const [currentYear,  setCurrentYear]  = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  // Form state
  const [newTitle,    setNewTitle]    = useState("");
  const [newDate,     setNewDate]     = useState("");
  const [newImage,    setNewImage]    = useState(null);
  const [previewImage,setPreviewImage]= useState(null);

  // Edit modal state
  const [editingMovie, setEditingMovie] = useState(null);
  const [editTitle,    setEditTitle]    = useState("");
  const [editDate,     setEditDate]     = useState("");
  const [editImage,    setEditImage]    = useState(null);
  const [editPreview,  setEditPreview]  = useState(null);

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  }

  const monthMovies = movies.filter((m) => {
    const d = new Date(m.date);
    return d.getUTCMonth() === currentMonth && d.getUTCFullYear() === currentYear;
  });

  const weeks = groupByWeek(monthMovies);

  // --- ADD ---
  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setNewImage(reader.result);
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleAdd() {
    if (!newTitle || !newDate) return;
    setMovies([...movies, { id: Date.now(), title: newTitle, date: newDate, image: newImage }]);
    setNewTitle("");
    setNewDate("");
    setNewImage(null);
    setPreviewImage(null);
  }

  // --- EDIT ---
  function openEdit(movie) {
    setEditingMovie(movie);
    setEditTitle(movie.title);
    setEditDate(movie.date);
    setEditImage(movie.image);
    setEditPreview(movie.image);
  }

  function handleEditImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditImage(reader.result);
      setEditPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function handleSaveEdit() {
    setMovies(movies.map((m) =>
      m.id === editingMovie.id
        ? { ...m, title: editTitle, date: editDate, image: editImage }
        : m
    ));
    setEditingMovie(null);
  }

  function handleDelete() {
    setMovies(movies.filter((m) => m.id !== editingMovie.id));
    setEditingMovie(null);
  }

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString("default", { month: "long" });

  return (
    <div style={styles.page}>

      {/* TOP BAR */}
      <div style={styles.topBar}>
        <button style={styles.navBtn} onClick={prevMonth}>← Prev</button>
        <span style={styles.monthLabel}>{monthName} {currentYear}</span>
        <button style={styles.navBtn} onClick={nextMonth}>Next →</button>
      </div>

      {/* WEEK SECTIONS */}
      <div style={styles.scrollArea}>
        {[1, 2, 3, 4, 5].map((weekNum) => {
          const weekMovies = weeks[weekNum];
          const startDay = (weekNum - 1) * 7 + 1;
          const endDay = Math.min(weekNum * 7, 31);
          return (
            <div key={weekNum} style={styles.weekBlock}>
              <p style={styles.weekLabel}>
                Week {weekNum} · {monthName.slice(0, 3)} {startDay}–{endDay}
              </p>
              {/* ✅ QOL #3 — horizontal scroll container */}
              <div style={styles.weekCard}>
                <div style={styles.cardsRow}>
                  {weekMovies.length === 0 ? (
                    <p style={styles.emptyText}>No movies this week</p>
                  ) : (
                    weekMovies.map((movie) => (
                      // ✅ QOL #1 — clicking opens edit modal
                      <div 
                        key={movie.id}
                        style={styles.card}
                        onClick={() => openEdit(movie)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateY(-3px)";
                          e.currentTarget.style.borderColor = "#4a4a4a";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.borderColor = "#2e2e2e";
                        }}

                      >
                        {movie.image ? (
                          <img src={movie.image} alt={movie.title} style={styles.cardImg} />
                        ) : (
                          <div style={styles.cardImgPlaceholder}>🎬</div>
                        )}
                        <div style={styles.cardInfo}>
                          <p style={styles.cardTitle}>{movie.title}</p>
                          <p style={styles.cardDate}>
                            {new Date(movie.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                        <div style={styles.editHint}>✏️ edit</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM ADD FORM */}
      <div style={styles.addBar}>
        <p style={styles.addLabel}>ADD MOVIE</p>
        <div style={styles.formRow}>
          {/* ✅ QOL #2 — image preview in add form */}
          <label style={styles.uploadBox}>
            {previewImage ? (
              <img src={previewImage} alt="preview" style={styles.previewImg} />
            ) : (
              <span style={styles.uploadPlaceholder}>+ Image</span>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: "none" }} />
          </label>
          <div style={styles.inputsGroup}>
            <input
              style={styles.input}
              placeholder="Movie name"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div style={styles.bottomRow}>
              <input
                style={{ ...styles.input,  flex: "1", minHeight: 0 }}
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <button style={styles.addBtn} onClick={handleAdd}>Add</button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingMovie && (
        <div style={styles.modalOverlay} onClick={() => setEditingMovie(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>Edit Movie</h3>

            {/* Image preview in edit modal */}
            <label style={styles.editUploadBox}>
              {editPreview ? (
                <img src={editPreview} alt="preview" style={styles.editPreviewImg} />
              ) : (
                <span style={styles.uploadPlaceholder}>+ Change Image</span>
              )}
              <input type="file" accept="image/*" onChange={handleEditImageUpload} style={{ display: "none" }} />
            </label>

            <input
              style={styles.modalInput}
              placeholder="Movie name"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <input
              style={styles.modalInput}
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
            />

            <div style={styles.modalBtns}>
              <button style={styles.deleteBtn} onClick={handleDelete}>Delete</button>
              <button style={styles.cancelBtn} onClick={() => setEditingMovie(null)}>Cancel</button>
              <button style={styles.saveBtn} onClick={handleSaveEdit}>Save</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const styles = {
  page: { display: "flex", flexDirection: "column", height: "100%", fontFamily: "sans-serif", backgroundColor: "#141414", color: "#eee" },
  topBar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", backgroundColor: "#1c1c1c", borderBottom: "1px solid #2a2a2a" },
  navBtn: { background: "none", border: "1px solid #3a3a3a", borderRadius: 8, padding: "4px 14px", cursor: "pointer", fontSize: 13, color: "#888" },
  monthLabel: { fontSize: 17, fontWeight: 600, color: "#eee" },
  scrollArea: { flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 20 },
  weekBlock: {},
  weekLabel: { fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 },
  weekCard: { backgroundColor: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 12, padding: "12px 14px", overflowX: "auto" },
  cardsRow: { display: "flex", gap: 10, width: "max-content", minWidth: "100%" },
  emptyText: { fontSize: 12, color: "#444", fontStyle: "italic", padding: "10px 0" },
  card: { width: 100, backgroundColor: "#242424", border: "1px solid #2e2e2e", borderRadius: 8, overflow: "hidden", cursor: "pointer", position: "relative", flexShrink: 0, transition: "transform 0.15s, border-color 0.15s" },
  cardImg: { width: "100%", height: 130, objectFit: "cover" },
  cardImgPlaceholder: { width: "100%", height: 130, backgroundColor: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 },
  cardInfo: { padding: "6px 8px" },
  cardTitle: { fontSize: 11, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", margin: 0, color: "#ddd" },
  cardDate: { fontSize: 10, color: "#555", margin: "2px 0 0" },
  editHint: { fontSize: 9, color: "#444", textAlign: "center", padding: "3px 0 5px" },
  addBar: { backgroundColor: "#1c1c1c", borderTop: "1px solid #2a2a2a", padding: "12px 20px", flexShrink: 0},
  addLabel: { fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.06em", marginBottom: 8 },
  formRow: { display: "flex", gap: 12, alignItems: "flex-start" },
  uploadBox: { width: 70, height: 90, border: "1px dashed #333", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, overflow: "hidden", backgroundColor: "#1e1e1e" },
  previewImg: { width: "100%", height: "100%", objectFit: "cover" },
  uploadPlaceholder: { fontSize: 11, color: "#555", textAlign: "center", padding: 4 },
  inputsGroup: { flex: 1, display: "flex", flexDirection: "column", gap: 8 },
  input: { width: "100%", height: 36, border: "1px solid #333", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box", backgroundColor: "#242424", color: "#ddd" },
  bottomRow: { display: "flex", gap: 8 },
  addBtn: { height: 36, padding: "0 18px", backgroundColor: "#1a4a7a", color: "#7ab3e0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },
  modalOverlay: { position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 },
  modal: { backgroundColor: "#1c1c1c", border: "1px solid #2a2a2a", borderRadius: 14, padding: "24px 24px 20px", width: 300, display: "flex", flexDirection: "column", gap: 12 },
  modalTitle: { fontSize: 16, fontWeight: 700, margin: 0, color: "#eee" },
  editUploadBox: { width: "100%", height: 160, border: "1px dashed #333", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", backgroundColor: "#242424" },
  editPreviewImg: { width: "100%", height: "100%", objectFit: "cover" },
  modalInput: { width: "100%", height: 38, border: "1px solid #333", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box", backgroundColor: "#242424", color: "#ddd" },
  modalBtns: { display: "flex", gap: 8, marginTop: 4 },
  deleteBtn: { flex: 1, height: 36, backgroundColor: "#2a1515", color: "#e07070", border: "1px solid #3a2020", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
  cancelBtn: { flex: 1, height: 36, backgroundColor: "#242424", color: "#888", border: "1px solid #333", borderRadius: 8, fontSize: 13, cursor: "pointer" },
  saveBtn: { flex: 1, height: 36, backgroundColor: "#1a4a7a", color: "#7ab3e0", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" },
};