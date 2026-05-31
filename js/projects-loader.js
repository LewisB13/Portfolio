const PROJECTS_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/projects";

const projectsList = document.getElementById("projects-list");
const categoryGrid = document.getElementById("project-category-grid");
const projectSort = document.getElementById("project-sort");
const projectSearch = document.getElementById("project-search");
const selectedCategoryTitle = document.getElementById("selected-category-title");

let projects = [];
let activeCategory = "All Projects";
let searchQuery = "";

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

function renderCategories() {
  const categories = [
    "All Projects",
    ...new Set(
      projects.map((p) => p.category || "Uncategorised")
    )
  ];

  categoryGrid.innerHTML = "";

  categories.forEach((category) => {
    const count =
      category === "All Projects"
        ? projects.length
        : projects.filter((p) => p.category === category).length;

    const btn = document.createElement("button");
    btn.className = `category-card ${
      category === activeCategory ? "active" : ""
    }`;

    btn.type = "button";

    btn.innerHTML = `
      <span class="category-card-title">${category}</span>
      <span class="category-card-count">${count} project${count === 1 ? "" : "s"}</span>
    `;

    btn.addEventListener("click", () => {
      activeCategory = category;
      renderCategories();
      renderProjects();
    });

    categoryGrid.appendChild(btn);
  });
}

function renderProjects() {
  const sortOrder = projectSort ? projectSort.value : "latest";

  selectedCategoryTitle.textContent = activeCategory;

  projectsList.innerHTML = "";

  let filtered =
    activeCategory === "All Projects"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  // SEARCH
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();

    filtered = filtered.filter((p) => {
      return (
        (p.title || "").toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
      );
    });
  }

  // SORT
  filtered.sort((a, b) => {
    return sortOrder === "oldest"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  if (filtered.length === 0) {
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

      <button class="read-more blog-button">
        Read More ↓
      </button>

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

      <div class="note-body" hidden>
        ${marked.parse(project.body)}
      </div>
    `;

    const btn = card.querySelector(".blog-button");
    const body = card.querySelector(".note-body");
    const previewEl = card.querySelector(".note-preview");

    btn.addEventListener("click", () => {
      const closed = body.hasAttribute("hidden");

      if (closed) {
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
  categoryGrid.innerHTML = "<p>Loading categories...</p>";

  try {
    const res = await fetch(PROJECTS_API);
    const files = await res.json();

    const markdownFiles = files.filter((f) =>
      f.name.endsWith(".md")
    );

    projects = await Promise.all(
      markdownFiles.map(async (file) => {
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
          github: getFrontmatterValue(frontmatter, "github"),
          demo: getFrontmatterValue(frontmatter, "demo"),
          description: getFrontmatterValue(frontmatter, "description"),
          body
        };
      })
    );

    renderCategories();
    renderProjects();
  } catch (err) {
    console.error(err);
    categoryGrid.innerHTML = "";
    projectsList.innerHTML = "<p>Failed to load projects.</p>";
  }
}

if (projectSort) {
  projectSort.addEventListener("change", renderProjects);
}

if (projectSearch) {
  projectSearch.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProjects();
  });
}

loadProjects();