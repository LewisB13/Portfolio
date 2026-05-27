const NOTES_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/notes";

const notesList = document.getElementById("notes-list");
const categorySelect = document.getElementById("notes-category");
const searchInput = document.getElementById("notes-search");

let notes = [];
let activeCategory = "All";
let searchQuery = "";

// ================= FRONTMATTER HELPERS =================
function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter
      .match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]
      ?.trim() || ""
  );
}

// ================= DATE FORMAT =================
function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

// ================= RENDER NOTES =================
function renderNotes() {
  notesList.innerHTML = "";

  let filtered = [...notes];

  // CATEGORY FILTER
  if (activeCategory !== "All") {
    filtered = filtered.filter(
      (note) => (note.category || "Other").trim() === activeCategory
    );
  }

  // SEARCH FILTER
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();

    filtered = filtered.filter((note) => {
      return (
        (note.title || "").toLowerCase().includes(q) ||
        (note.body || "").toLowerCase().includes(q) ||
        (note.category || "").toLowerCase().includes(q)
      );
    });
  }

  // EMPTY STATE
  if (filtered.length === 0) {
    notesList.innerHTML = "<p>No notes found.</p>";
    return;
  }

  // RENDER CARDS
  filtered.forEach((note) => {
    const card = document.createElement("article");
    card.className = "card blog-card";

    const preview = marked
      .parse(note.body || "")
      .replace(/<[^>]*>/g, "")
      .slice(0, 180);

    card.innerHTML = `
      <p class="video-category">${note.category || "Other"}</p>

      <h3 class="note-title">${note.title}</h3>

      <p class="blog-date">
        ${formatDate(note.date)}
      </p>

      <p class="note-preview">
        ${preview}${preview.length >= 180 ? "..." : ""}
      </p>

      <button class="read-more blog-button">
        Read More ↓
      </button>

      <a class="read-more" href="notes.html?note=${note.slug}" target="_blank">
        Open in new tab ↗
      </a>

      <div class="note-body" hidden>
        ${marked.parse(note.body)}
      </div>
    `;

    // TOGGLE BODY
    const button = card.querySelector(".blog-button");
    const body = card.querySelector(".note-body");
    const previewEl = card.querySelector(".note-preview");

    button.addEventListener("click", () => {
      const isClosed = body.hasAttribute("hidden");

      if (isClosed) {
        body.removeAttribute("hidden");
        previewEl.style.display = "none";
        button.textContent = "Close ↑";
      } else {
        body.setAttribute("hidden", "");
        previewEl.style.display = "block";
        button.textContent = "Read More ↓";
      }
    });

    notesList.appendChild(card);
  });
}

// ================= LOAD NOTES =================
async function loadNotes() {
  notesList.innerHTML = "<p>Loading notes...</p>";

  try {
    const response = await fetch(NOTES_API);

    if (!response.ok) {
      throw new Error("Could not fetch notes folder");
    }

    const files = await response.json();

    const markdownFiles = files.filter((file) =>
      file.name.endsWith(".md")
    );

    notes = await Promise.all(
      markdownFiles.map(async (file) => {
        const res = await fetch(file.download_url);
        const text = await res.text();

        const parts = text.split("---");
        const frontmatter = parts[1] || "";
        const body = parts.slice(2).join("---").trim();

        return {
          slug: file.name.replace(".md", ""),
          title: getFrontmatterValue(frontmatter, "title") || "Untitled",
          date: getFrontmatterValue(frontmatter, "date"),
          category: getFrontmatterValue(frontmatter, "category"),
          body
        };
      })
    );

    renderNotes();
  } catch (error) {
    console.error(error);
    notesList.innerHTML = `<p>Could not load notes: ${error.message}</p>`;
  }
}

// ================= EVENTS =================

// category dropdown
if (categorySelect) {
  categorySelect.addEventListener("change", (e) => {
    activeCategory = e.target.value;
    renderNotes();
  });
}

// search input
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderNotes();
  });
}

// init
loadNotes();