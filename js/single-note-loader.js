function getNoteSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("note");
}

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

async function loadSingleNote() {
  const slug = getNoteSlug();
  const container = document.getElementById("note-content");

  if (!slug) {
    container.innerHTML = "<p>No note selected.</p>";
    return;
  }

  const url =
    `https://raw.githubusercontent.com/LewisB13/Portfolio/main/content/notes/${slug}.md`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Note not found");
    }

    const text = await response.text();

    const parts = text.split("---");
    const frontmatter = parts[1] || "";
    const body = parts.slice(2).join("---").trim();

    const title = getFrontmatterValue(frontmatter, "title") || "Untitled";
    const date = getFrontmatterValue(frontmatter, "date");

    container.innerHTML = `
      <a href="notes.html" class="read-more">← Back</a>

      <p class="blog-date">${formatDate(date)}</p>

      <h1>${title}</h1>

      <div class="markdown-body">
        ${marked.parse(body)}
      </div>
    `;
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Could not load note.</p>";
  }
}

loadSingleNote();