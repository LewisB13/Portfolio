const PROJECTS_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/projects";

const projectsList = document.getElementById("projects-list");
const categorySelect = document.getElementById("project-category");

let projects = [];
let activeCategory = "All";

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

function renderProjects() {
  projectsList.innerHTML = "";

  let filtered = projects;

  if (activeCategory !== "All") {
    filtered = projects.filter((project) => {
      return (project.category || "Other").trim() === activeCategory;
    });
  }

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

      <a class="read-more" href="${project.github || "#"}" target="_blank">
        GitHub ↗
      </a>

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

  const response = await fetch(PROJECTS_API);
  const files = await response.json();

  const markdownFiles = files.filter((file) =>
    file.name.endsWith(".md")
  );

  projects = await Promise.all(
    markdownFiles.map(async (file) => {
      const res = await fetch(file.download_url);
      const text = await res.text();

      const parts = text.split("---");
      const frontmatter = parts[1] || "";
      const body = parts.slice(2).join("---").trim();

      return {
        slug: file.name.replace(".md", ""),
        title: getFrontmatterValue(frontmatter, "title"),
        date: getFrontmatterValue(frontmatter, "date"),
        category: getFrontmatterValue(frontmatter, "category"),
        github: getFrontmatterValue(frontmatter, "github"),
        body
      };
    })
  );

  renderProjects();
}

if (categorySelect) {
  categorySelect.addEventListener("change", (e) => {
    activeCategory = e.target.value;
    renderProjects();
  });
}

loadProjects();