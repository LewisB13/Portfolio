const NOTES_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/notes";

const notesList = document.getElementById("notes-list");

let notes = [];

function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter
      .match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]
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

function renderNotes() {
  notesList.innerHTML = "";

  if (notes.length === 0) {
    notesList.innerHTML = "<p>No notes found.</p>";
    return;
  }

  notes.forEach((note) => {
    const card = document.createElement("article");
    card.className = "card blog-card";

    const preview = marked
      .parse(note.body || "")
      .replace(/<[^>]*>/g, "")
      .slice(0, 180);

    card.innerHTML = `
      <h3>${note.title}</h3>

      <p class="blog-date">
        ${formatDate(note.date)}
      </p>

      <p>${preview}${preview.length >= 180 ? "..." : ""}</p>

      <a class="read-more" href="notes.html?note=${note.slug}">
        Read More →
      </a>
    `;

    notesList.appendChild(card);
  });
}

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

loadNotes();