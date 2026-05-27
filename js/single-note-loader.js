function getNoteSlug() {
  return new URLSearchParams(window.location.search).get("note");
}

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
    const res = await fetch(url);
    const text = await res.text();

    const parts = text.split("---");
    const frontmatter = parts[1] || "";
    const body = parts.slice(2).join("---").trim();

    const title = getFrontmatterValue(frontmatter, "title");
    const date = getFrontmatterValue(frontmatter, "date");

    container.innerHTML = `
      <a href="notes.html">← Back</a>

      <p>${formatDate(date)}</p>

      <h1>${title}</h1>

      <div class="markdown-body">
        ${marked.parse(body)}
      </div>
    `;

    document.title = title;
  } catch (e) {
    container.innerHTML = "<p>Could not load note.</p>";
  }
}

loadSingleNote();