const PROJECTS_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/projects";

const projectsList = document.getElementById("projects-list");
const categorySelect = document.getElementById("project-category");
const searchInput = document.getElementById("project-search");

let projects = [];
let activeCategory = "All";
let searchQuery = "";

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

function filterProjects() {
  const q = searchQuery.toLowerCase();

  return projects.filter((project) => {
    const categoryMatch =
      activeCategory === "All" || project.category === activeCategory;

    const searchMatch =
      (project.title || "").toLowerCase().includes(q) ||
      (project.body || "").toLowerCase().includes(q);

    return categoryMatch && searchMatch;
  });
}

function renderProjects() {
  projectsList.innerHTML = "";

  const filtered = filterProjects();

  if (!filtered.length) {
    projectsList.innerHTML = "<p>No projects found.</p>";
    return;
  }

  filtered.forEach((project) => {
    const card = document.createElement("article");
    card.className = "card blog-card";

    const preview = marked
      .parse(project.body || "")
      .replace(/<[^>]*>/g, "")
      .slice(0, 180);

    card.innerHTML = `
      <p class="video-category">${project.category || "Other"}</p>

      <h3 class="note-title">
        <a href="project.html?project=${project.slug}">
          ${project.title}
        </a>
      </h3>

      <p class="blog-date">
        ${formatDate(project.date)}
      </p>

      <p class="note-preview">
        ${preview}${preview.length >= 180 ? "..." : ""}
      </p>

      <button class="read-more toggle">
        Read More ↓
      </button>

      <div class="note-body" hidden>
        ${marked.parse(project.body || "")}
      </div>

      ${
        project.github
          ? `<a class="read-more" href="${project.github}" target="_blank">GitHub ↗</a>`
          : ""
      }

      ${
        project.demo
          ? `<a class="read-more" href="${project.demo}" target="_blank">Live Demo ↗</a>`
          : ""
      }
    `;

    const btn = card.querySelector(".toggle");
    const body = card.querySelector(".note-body");
    const previewEl = card.querySelector(".note-preview");

    btn.addEventListener("click", () => {
      const open = body.hasAttribute("hidden");

      if (open) {
        body.removeAttribute("hidden");
        previewEl.style.display = "none";
        btn.textContent = "Close ↑";
      } else {
        body.setAttribute("hidden", "");
        previewEl.style.display = "block";
        btn.textContent = "Read More ↓";
      }
    });

    projectsList.appendChild(card);
  });
}

async function loadProjects() {
  projectsList.innerHTML = "<p>Loading projects...</p>";

  const res = await fetch(PROJECTS_API);
  const files = await res.json();

  const mdFiles = files.filter((f) => f.name.endsWith(".md"));

  projects = await Promise.all(
    mdFiles.map(async (file) => {
      const r = await fetch(file.download_url);
      const text = await r.text();

      const parts = text.split("---");
      const frontmatter = parts[1] || "";
      const body = parts.slice(2).join("---").trim();

      return {
        slug: file.name.replace(".md", ""),
        title: getFrontmatterValue(frontmatter, "title") || "Untitled",
        date: getFrontmatterValue(frontmatter, "date"),
        category: getFrontmatterValue(frontmatter, "category"),
        github: getFrontmatterValue(frontmatter, "github"),
        demo: getFrontmatterValue(frontmatter, "demo"),
        body
      };
    })
  );

  renderProjects();
}

categorySelect?.addEventListener("change", (e) => {
  activeCategory = e.target.value;
  renderProjects();
});

searchInput?.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  renderProjects();
});

loadProjects();