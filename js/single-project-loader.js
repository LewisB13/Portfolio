function getProjectSlug() {
  return new URLSearchParams(window.location.search).get("project");
}

function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter.match(
      new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m")
    )?.[1]?.trim() || ""
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

async function loadSingleProject() {
  const slug = getProjectSlug();
  const container = document.getElementById("project-content");

  if (!slug) {
    container.innerHTML = "<p>No project selected.</p>";
    return;
  }

  const url =
    `https://raw.githubusercontent.com/LewisB13/Portfolio/main/content/projects/${slug}.md`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    const parts = text.split("---");
    const frontmatter = parts[1] || "";
    const body = parts.slice(2).join("---").trim();

    const title = getFrontmatterValue(frontmatter, "title");
    const date = getFrontmatterValue(frontmatter, "date");
    const category = getFrontmatterValue(frontmatter, "category");
    const github = getFrontmatterValue(frontmatter, "github");
    const demo = getFrontmatterValue(frontmatter, "demo");

    document.title = title;

    container.innerHTML = `
      <a class="read-more" href="projects.html">← Back to Projects</a>

      <p class="video-category">${category || ""}</p>

      <h1>${title}</h1>

      <p class="blog-date">${formatDate(date)}</p>

      <div class="note-actions">
        ${github ? `<a class="read-more" href="${github}" target="_blank">GitHub ↗</a>` : ""}
        ${demo ? `<a class="read-more" href="${demo}" target="_blank">Live Demo ↗</a>` : ""}
      </div>

      <div class="markdown-body">
        ${marked.parse(body || "")}
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Could not load project.</p>";
  }
}

loadSingleProject();