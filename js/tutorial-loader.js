const TUTORIALS_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/tutorials";

const tutorialsList = document.getElementById("tutorials-list");
const categorySelect = document.getElementById("tutorial-category");
const tutorialSort = document.getElementById("tutorial-sort");
const searchInput = document.getElementById("tutorial-search");

let tutorials = [];
let activeCategory = "All Tutorials";
let searchQuery = "";

/* ================= FRONTMATTER ================= */
function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter.match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]?.trim() || ""
  );
}

/* ================= DATE ================= */
function formatDate(dateString) {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/* ================= YOUTUBE ================= */
function getYouTubeEmbed(url) {
  if (!url) return "";

  if (url.includes("youtube.com/watch?v=")) {
    const id = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return "";
}

/* ================= BUILD CATEGORIES ================= */
function buildCategories() {
  const categories = [
    "All Tutorials",
    ...new Set(tutorials.map(t => t.category || "Uncategorised"))
  ];

  categorySelect.innerHTML = "";

  categories.forEach(category => {
    const count =
      category === "All Tutorials"
        ? tutorials.length
        : tutorials.filter(t => (t.category || "Uncategorised") === category).length;

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
function getFilteredTutorials() {
  let filtered = tutorials;

  // category filter
  if (activeCategory !== "All Tutorials") {
    filtered = filtered.filter(
      t => (t.category || "Uncategorised") === activeCategory
    );
  }

  // search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      (
        (t.title || "") +
        " " +
        (t.description || "") +
        " " +
        (t.category || "")
      ).toLowerCase().includes(q)
    );
  }

  // sort
  const sortOrder = tutorialSort?.value || "latest";

  filtered.sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);

    return sortOrder === "oldest" ? dateA - dateB : dateB - dateA;
  });

  return filtered;
}

/* ================= RENDER ================= */
function renderTutorials() {
  tutorialsList.innerHTML = "";

  const filtered = getFilteredTutorials();

  if (!filtered.length) {
    tutorialsList.innerHTML = "<p>No tutorials found.</p>";
    return;
  }

  filtered.forEach(t => {
    const card = document.createElement("article");
    card.className = "card";

    const embed = getYouTubeEmbed(t.youtube);

    card.innerHTML = `
      ${
        embed
          ? `
        <div class="video-wrapper">
          <iframe src="${embed}" allowfullscreen></iframe>
        </div>`
          : ""
      }

      <h3>${t.title || "Untitled"}</h3>

      <p class="video-meta">
        ${formatDate(t.date)} ${t.difficulty ? "• " + t.difficulty : ""}
      </p>

      <p>${t.description || ""}</p>

      <button class="btn btn-outline btn-sm">Read More</button>

      <div class="markdown-body" hidden>
        ${marked.parse(t.body || "")}
      </div>
    `;

    const btn = card.querySelector("button");
    const body = card.querySelector(".markdown-body");

    btn.addEventListener("click", () => {
      const open = body.hasAttribute("hidden");

      if (open) {
        body.removeAttribute("hidden");
        btn.textContent = "Close ↑";
      } else {
        body.setAttribute("hidden", "");
        btn.textContent = "Read More";
      }
    });

    tutorialsList.appendChild(card);
  });
}

/* ================= LOAD DATA ================= */
async function loadTutorials() {
  tutorialsList.innerHTML = "<p>Loading tutorials...</p>";

  const res = await fetch(TUTORIALS_API);
  const files = await res.json();

  const mdFiles = files.filter(f => f.name.endsWith(".md"));

  tutorials = await Promise.all(
    mdFiles.map(async file => {
      const r = await fetch(file.download_url);
      const text = await r.text();

      const parts = text.split("---");
      const fm = parts[1] || "";
      const body = parts.slice(2).join("---");

      return {
        title: getFrontmatterValue(fm, "title"),
        date: getFrontmatterValue(fm, "date"),
        category: getFrontmatterValue(fm, "category"),
        difficulty: getFrontmatterValue(fm, "difficulty"),
        youtube: getFrontmatterValue(fm, "youtube"),
        description: getFrontmatterValue(fm, "description"),
        body
      };
    })
  );

  buildCategories();
  renderTutorials();
}

/* ================= EVENTS ================= */
categorySelect?.addEventListener("change", e => {
  activeCategory = e.target.value;
  renderTutorials();
});

tutorialSort?.addEventListener("change", renderTutorials);

searchInput?.addEventListener("input", e => {
  searchQuery = e.target.value;
  renderTutorials();
});

/* ================= INIT ================= */
loadTutorials();