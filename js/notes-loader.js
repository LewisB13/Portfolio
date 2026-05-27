const NOTES_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/notes";

const notesList = document.getElementById("notes-list");
const categorySelect = document.getElementById("notes-category");
const searchInput = document.getElementById("notes-search");

let notes = [];
let activeCategory = "All";
let searchQuery = "";

function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter.match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]
      ?.trim() || ""
  );
}

function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function filterNotes() {
  return notes.filter(note => {
    const categoryMatch =
      activeCategory === "All" || note.category === activeCategory;

    const searchMatch =
      note.title.toLowerCase().includes(searchQuery) ||
      note.body.toLowerCase().includes(searchQuery);

    return categoryMatch && searchMatch;
  });
}

function renderNotes() {
  notesList.innerHTML = "";

  const filtered = filterNotes();

  if (!filtered.length) {
    notesList.innerHTML = "<p>No notes found.</p>";
    return;
  }

  filtered.forEach(note => {
    const card = document.createElement("article");
    card.className = "card";

    const preview = marked
      .parse(note.body || "")
      .replace(/<[^>]*>/g, "")
      .slice(0, 180);

    card.innerHTML = `
      <p>${note.category || "Other"}</p>

      <!-- TITLE OPENS FULL NOTE -->
      <h3 class="note-title">
        <a href="note.html?note=${note.slug}">
          ${note.title}
        </a>
      </h3>

      <p class="blog-date">${formatDate(note.date)}</p>

      <p class="note-preview">
        ${preview}${preview.length >= 180 ? "..." : ""}
      </p>

      <!-- READ MORE (USES YOUR EXISTING STYLE) -->
      <button class="read-more toggle">
        Read More
      </button>

      <div class="note-body" hidden>
        ${marked.parse(note.body)}
      </div>
    `;

    const btn = card.querySelector(".toggle");
    const body = card.querySelector(".note-body");
    const previewEl = card.querySelector(".note-preview");

    btn.addEventListener("click", () => {
      const open = body.hasAttribute("hidden");

      if (open) {
        body.removeAttribute("hidden");
        previewEl.style.display = "none";
        btn.textContent = "Close";
      } else {
        body.setAttribute("hidden", "");
        previewEl.style.display = "block";
        btn.textContent = "Read More";
      }
    });

    notesList.appendChild(card);
  });
}

async function loadNotes() {
  notesList.innerHTML = "<p>Loading notes...</p>";

  const res = await fetch(NOTES_API);
  const files = await res.json();

  const mdFiles = files.filter(f => f.name.endsWith(".md"));

  notes = await Promise.all(
    mdFiles.map(async file => {
      const r = await fetch(file.download_url);
      const text = await r.text();

      const parts = text.split("---");
      const frontmatter = parts[1] || "";
      const body = parts.slice(2).join("---").trim();

      return {
        slug: file.name.replace(".md", ""),
        title: getFrontmatterValue(frontmatter, "title"),
        date: getFrontmatterValue(frontmatter, "date"),
        category: getFrontmatterValue(frontmatter, "category"),
        body
      };
    })
  );

  renderNotes();
}

categorySelect?.addEventListener("change", e => {
  activeCategory = e.target.value;
  renderNotes();
});

searchInput?.addEventListener("input", e => {
  searchQuery = e.target.value.toLowerCase();
  renderNotes();
});

loadNotes();