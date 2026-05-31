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
      projects.map((project) => project.category || "Uncategorised")
    )
  ];

  categoryGrid.innerHTML = "";

  categories.forEach((category) => {
    const count =
      category === "All Projects"
        ? projects.length
        : projects.filter(
            (project) => project.category === category
          ).length;

    const button = document.createElement("button");

    button.className = `category-card ${
      category === activeCategory ? "active" : ""
    }`;

    button.type = "button";

    button.innerHTML = `
      <span class="category-card-title">${category}</span>

      <span class="category-card-count">
        ${count} project${count === 1 ? "" : "s"}
      </span>
    `;

    button.addEventListener("click", () => {
      activeCategory = category;
      renderCategories();
      renderProjects();
    });

    categoryGrid.appendChild(button);
  });
}

function renderProjects() {
  const sortOrder = projectSort
    ? projectSort.value
    : "latest";

  selectedCategoryTitle.textContent = activeCategory;

  projectsList.innerHTML = "";

  let filtered =
    activeCategory === "All Projects"
      ? projects
      : projects.filter(
          (project) =>
            project.category === activeCategory
        );

  if (searchQuery.trim() !== "") {
    filtered = filtered.filter((project) => {
      const search = searchQuery.toLowerCase();

      return (
        project.title.toLowerCase().includes(search) ||
        project.description.toLowerCase().includes(search) ||
        project.tech.join(" ").toLowerCase().includes(search)
      );
    });
  }

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
      <p class="video-category">
        ${project.category || "Other"}
      </p>

      <h3 class="note-title">
        <a
          href="project.html?project=${project.slug}"
          target="_blank"
        >
          ${project.title}
        </a>
      </h3>

      <p class="blog-date">
        ${formatDate(project.date)}
      </p>

      <p class="video-meta">
        ${project.tech.join(" • ")}
      </p>

      <p class="note-preview">
        ${preview}${preview.length >= 180 ? "..." : ""}
      </p>

      <button class="read-more blog-button">
        Read More ↓
      </button>

      ${
        project.github
          ? `
          <a
            class="read-more"
            href="${project.github}"
            target="_blank"
          >
            GitHub ↗
          </a>
        `
          : ""
      }

      ${
        project.demo
          ? `
          <a
            class="read-more"
            href="${project.demo}"
            target="_blank"
          >
            Live Demo ↗
          </a>
        `
          : ""
      }

      <div class="note-body" hidden>
        ${marked.parse(project.body)}
      </div>
    `;

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

    projectsList.appendChild(card);
  });
}

async function loadProjects() {
  projectsList.innerHTML = "<p>Loading projects...</p>";

  categoryGrid.innerHTML = "<p>Loading categories...</p>";

  try {
    const response = await fetch(PROJECTS_API);

    if (!response.ok) {
      throw new Error("Could not fetch projects folder");
    }

    const files = await response.json();

    const markdownFiles = files.filter((file) =>
      file.name.endsWith(".md")
    );

    projects = await Promise.all(
      markdownFiles.map(async (file) => {
        const projectResponse = await fetch(
          file.download_url
        );

        const text = await projectResponse.text();

        const parts = text.split("---");

        const frontmatter = parts[1] || "";

        const body = parts.slice(2).join("---").trim();

        return {
          slug: file.name.replace(".md", ""),

          title:
            getFrontmatterValue(frontmatter, "title") ||
            "Untitled",

          date: getFrontmatterValue(frontmatter, "date"),

          category: getFrontmatterValue(
            frontmatter,
            "category"
          ),

          github: getFrontmatterValue(
            frontmatter,
            "github"
          ),

          demo: getFrontmatterValue(
            frontmatter,
            "demo"
          ),

          description: getFrontmatterValue(
            frontmatter,
            "description"
          ),

          tech: (
            getFrontmatterValue(frontmatter, "tech") || ""
          )
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),

          body
        };
      })
    );

    renderCategories();

    renderProjects();
  } catch (error) {
    console.error(error);

    categoryGrid.innerHTML = "";

    projectsList.innerHTML = `
      <p>Could not load projects: ${error.message}</p>
    `;
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