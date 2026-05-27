const TUTORIALS_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/tutorials";

const tutorialsList = document.getElementById("tutorials-list");
const categoryGrid = document.getElementById("tutorial-category-grid");
const tutorialSort = document.getElementById("tutorial-sort");
const searchInput = document.getElementById("tutorial-search");
const selectedCategoryTitle = document.getElementById("selected-category-title");

let tutorials = [];
let activeCategory = "All Tutorials";
let searchQuery = "";

function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter.match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]?.trim() || ""
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

function renderCategories() {
  const categories = [
    "All Tutorials",
    ...new Set(tutorials.map(t => t.category || "Uncategorised"))
  ];

  categoryGrid.innerHTML = "";

  categories.forEach(category => {
    const count =
      category === "All Tutorials"
        ? tutorials.length
        : tutorials.filter(t => t.category === category).length;

    const btn = document.createElement("button");
    btn.className = `category-card ${category === activeCategory ? "active" : ""}`;

    btn.innerHTML = `
      <span class="category-card-title">${category}</span>
      <span class="category-card-count">${count} Tutorials</span>
    `;

    btn.onclick = () => {
      activeCategory = category;
      renderCategories();
      renderTutorials();
    };

    categoryGrid.appendChild(btn);
  });
}

function renderTutorials() {
  tutorialsList.innerHTML = "";

  let filtered = tutorials;

  // CATEGORY FILTER
  if (activeCategory !== "All Tutorials") {
    filtered = filtered.filter(t => t.category === activeCategory);
  }

  // SEARCH FILTER
  if (searchQuery.trim()) {
    filtered = filtered.filter(t =>
      (t.title + " " + (t.description || "") + " " + (t.category || ""))
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }

  // SORT
  const sortOrder = tutorialSort?.value || "latest";

  filtered.sort((a, b) => {
    return sortOrder === "oldest"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  if (!filtered.length) {
    tutorialsList.innerHTML = "<p>No tutorials found.</p>";
    return;
  }

  filtered.forEach(t => {
    const card = document.createElement("article");
    card.className = "card";

    const embed = getYouTubeEmbed(t.youtube);

    card.innerHTML = `
      ${embed ? `
        <div class="video-wrapper">
          <iframe src="${embed}" allowfullscreen></iframe>
        </div>` : ""
      }

      <h3>${t.title}</h3>

      <p class="video-meta">
        ${formatDate(t.date)} ${t.difficulty ? "• " + t.difficulty : ""}
      </p>

      <p>${t.description || ""}</p>

      <button class="btn btn-outline btn-sm">Read More</button>

      <div class="markdown-body" hidden>
        ${marked.parse(t.body)}
      </div>
    `;

    const btn = card.querySelector("button");
    const body = card.querySelector(".markdown-body");

    btn.onclick = () => {
      const open = body.hasAttribute("hidden");

      if (open) {
        body.removeAttribute("hidden");
        btn.textContent = "Close ↑";
      } else {
        body.setAttribute("hidden", "");
        btn.textContent = "Read More";
      }
    };

    tutorialsList.appendChild(card);
  });
}

async function loadTutorials() {
  tutorialsList.innerHTML = "<p>Loading tutorials...</p>";

  const res = await fetch(TUTORIALS_API);
  const files = await res.json();

  tutorials = await Promise.all(
    files
      .filter(f => f.name.endsWith(".md"))
      .map(async file => {
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

  renderCategories();
  renderTutorials();
}

// EVENTS
tutorialSort?.addEventListener("change", renderTutorials);

searchInput?.addEventListener("input", e => {
  searchQuery = e.target.value;
  renderTutorials();
});

loadTutorials();