
const PROJECTS_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/projects";

const projectsList = document.getElementById("projects-list");
const categorySelect = document.getElementById("project-category");
const projectSort = document.getElementById("project-sort");
const searchInput = document.getElementById("project-search");
const selectedCategoryTitle = document.getElementById("selected-category-title");

let projects = [];
let activeCategory = "All Projects";
let searchQuery = "";

/* ================= FRONTMATTER ================= */
function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter.match(
      new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m")
    )?.[1]?.trim() || ""
  );
}

/* ================= DATE ================= */
function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/* ================= YOUTUBE ================= */
function getYouTubeEmbed(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    let id = "";

    if (
      parsed.hostname === "youtube.com" ||
      parsed.hostname === "www.youtube.com" ||
      parsed.hostname === "m.youtube.com"
    ) {
      if (parsed.pathname === "/watch") {
        id = parsed.searchParams.get("v") || "";
      } else if (parsed.pathname.startsWith("/shorts/")) {
        id = parsed.pathname.split("/")[2];
      } else if (parsed.pathname.startsWith("/embed/")) {
        id = parsed.pathname.split("/")[2];
      }
    } else if (
      parsed.hostname === "youtu.be" ||
      parsed.hostname === "www.youtu.be"
    ) {
      id = parsed.pathname.split("/")[1];
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return "";

    return `https://www.youtube.com/embed/${id}`;
  } catch {
    return "";
  }
}

/* ================= CATEGORIES ================= */
function buildCategories() {
  if (!categorySelect) return;

  const categories = [
    "All Projects",
    ...new Set(
      projects.map(p => p.category || "Uncategorised")
    )
  ];

  categorySelect.innerHTML = "";

  categories.forEach(category => {
    const count =
      category === "All Projects"
        ? projects.length
        : projects.filter(
            p => (p.category || "Uncategorised") === category
          ).length;

    const option = document.createElement("option");
    option.value = category;
    option.textContent = `${category} (${count})`;

    if (category === activeCategory) {
      option.selected = true;
    }

    categorySelect.appendChild(option);
  });
}

/* ================= FILTER + SORT ================= */
function getFilteredProjects() {
  let filtered = [...projects];

  // CATEGORY
  if (activeCategory !== "All Projects") {
    filtered = filtered.filter(
      p => (p.category || "Uncategorised") === activeCategory
    );
  }

  // SEARCH
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();

    filtered = filtered.filter(p =>
      (
        (p.title || "") + " " +
        (p.description || "") + " " +
        (p.category || "")
      ).toLowerCase().includes(q)
    );
  }

  // SORT
  const sortOrder = projectSort?.value || "latest";

  filtered.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime() || 0;
    const dateB = new Date(b.date || 0).getTime() || 0;

    return sortOrder === "oldest"
      ? dateA - dateB
      : dateB - dateA;
  });

  return filtered;
}

/* ================= RENDER ================= */
function renderProjects() {
  projectsList.innerHTML = "";

  if (selectedCategoryTitle) {
    selectedCategoryTitle.textContent =
      activeCategory === "All Projects"
        ? "Latest Projects"
        : activeCategory;
  }

  const filtered = getFilteredProjects();

  if (!filtered.length) {
    projectsList.innerHTML = "<p>No projects found.</p>";
    return;
  }

  filtered.forEach(p => {
    const card = document.createElement("article");
    card.className = "card";

    const embed = getYouTubeEmbed(p.youtube);

    // BUILD VIDEO EMBED
    if (embed) {
      const wrapper = document.createElement("div");
      wrapper.className = "video-wrapper";

      const iframe = document.createElement("iframe");
      iframe.src = embed;
      iframe.title = `Video demo: ${p.title || "Project"}`;
      iframe.loading = "lazy";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;

      wrapper.appendChild(iframe);
      card.appendChild(wrapper);
    }

    // PROJECT CATEGORY
    const category = document.createElement("p");
    category.className = "video-category";
    category.textContent = p.category || "Uncategorised";
    card.appendChild(category);

    // PROJECT TITLE
    const heading = document.createElement("h3");
    const titleLink = document.createElement("a");

    titleLink.href =
      `project.html?project=${encodeURIComponent(p.slug)}`;
    titleLink.textContent = p.title || "Untitled Project";

    heading.appendChild(titleLink);
    card.appendChild(heading);

    // DATE
    const meta = document.createElement("p");
    meta.className = "video-meta";
    meta.textContent = formatDate(p.date);
    card.appendChild(meta);

    // DESCRIPTION
    const description = document.createElement("p");
    description.textContent = p.description || "";
    card.appendChild(description);

    // READ MORE
    const btn = document.createElement("button");
    btn.className = "btn btn-outline btn-sm";
    btn.type = "button";
    btn.textContent = "Read More";
    card.appendChild(btn);

    const body = document.createElement("div");
    body.className = "markdown-body";
    body.hidden = true;
    body.innerHTML = marked.parse(p.body || "");
    card.appendChild(body);

    btn.addEventListener("click", () => {
      const open = body.hidden;

      body.hidden = !open;
      btn.textContent = open ? "Close ↑" : "Read More";
    });

    // EXTERNAL LINKS
    const links = document.createElement("div");
    links.className = "project-links";

    function addLink(url, label) {
      if (!url) return;

      try {
        const parsed = new URL(url);
        if (!["https:", "http:"].includes(parsed.protocol)) return;

        const link = document.createElement("a");
        link.className = "read-more";
        link.href = parsed.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = label;

        links.appendChild(link);
      } catch {
        // Ignore invalid URLs
      }
    }

    addLink(p.github, "GitHub ↗");
    addLink(p.demo, "Live Demo ↗");

    if (links.children.length) {
      card.appendChild(links);
    }

    projectsList.appendChild(card);
  });
}

/* ================= LOAD DATA ================= */
async function loadProjects() {
  projectsList.innerHTML = "<p>Loading projects...</p>";

  try {
    const res = await fetch(PROJECTS_API);
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const files = await res.json();

    if (!Array.isArray(files)) {
      throw new Error("Invalid projects response");
    }

    const mdFiles = files.filter(
      f => f.name.endsWith(".md")
    );

    projects = await Promise.all(
      mdFiles.map(async file => {
        const r = await fetch(file.download_url);
        if (!r.ok) {
          throw new Error(`Failed to load ${file.name}`);
        }

        const text = await r.text();

        const parts = text.split("---");
        const fm = parts[1] || "";
        const body = parts.slice(2).join("---").trim();

        return {
          slug: file.name.replace(/\.md$/, ""),
          title: getFrontmatterValue(fm, "title"),
          date: getFrontmatterValue(fm, "date"),
          category: getFrontmatterValue(fm, "category"),
          description: getFrontmatterValue(fm, "description"),
          youtube: getFrontmatterValue(fm, "youtube"),
          github: getFrontmatterValue(fm, "github"),
          demo: getFrontmatterValue(fm, "demo"),
          body
        };
      })
    );

    buildCategories();
    renderProjects();

  } catch (err) {
    console.error("Failed to load projects:", err);
    projectsList.innerHTML =
      "<p>Failed to load projects. Please try again later.</p>";
  }
}

/* ================= EVENTS ================= */
categorySelect?.addEventListener("change", e => {
  activeCategory = e.target.value;
  renderProjects();
});

projectSort?.addEventListener("change", renderProjects);

searchInput?.addEventListener("input", e => {
  searchQuery = e.target.value;
  renderProjects();
});

/* ================= INIT ================= */
loadProjects();
