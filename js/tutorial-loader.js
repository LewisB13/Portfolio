const TUTORIALS_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/tutorials";

const tutorialsList = document.getElementById("tutorials-list");
const categoryGrid = document.getElementById("tutorial-category-grid");
const tutorialSort = document.getElementById("tutorial-sort");
const selectedCategoryTitle = document.getElementById("selected-category-title");

let tutorials = [];
let activeCategory = "All Tutorials";

function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter
      .match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]
      ?.trim() || ""
  );
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
    "All Tutorials",
    ...new Set(tutorials.map((tutorial) => tutorial.category || "Uncategorised"))
  ];

  categoryGrid.innerHTML = "";

  categories.forEach((category) => {
    const count =
      category === "All Tutorials"
        ? tutorials.length
        : tutorials.filter((tutorial) => tutorial.category === category).length;

    const button = document.createElement("button");
    button.className = `category-card ${category === activeCategory ? "active" : ""}`;
    button.type = "button";

    button.innerHTML = `
      <span class="category-card-title">${category}</span>
      <span class="category-card-count">${count} tutorial${count === 1 ? "" : "s"}</span>
    `;

    button.addEventListener("click", () => {
      activeCategory = category;
      renderCategories();
      renderTutorials();
    });

    categoryGrid.appendChild(button);
  });
}

function renderTutorials() {
  const sortOrder = tutorialSort ? tutorialSort.value : "latest";

  selectedCategoryTitle.textContent = activeCategory;
  tutorialsList.innerHTML = "";

  let filtered =
    activeCategory === "All Tutorials"
      ? tutorials
      : tutorials.filter((tutorial) => tutorial.category === activeCategory);

  filtered.sort((a, b) => {
    return sortOrder === "oldest"
      ? new Date(a.date) - new Date(b.date)
      : new Date(b.date) - new Date(a.date);
  });

  if (filtered.length === 0) {
    tutorialsList.innerHTML = "<p>No tutorials found.</p>";
    return;
  }

  filtered.forEach((tutorial) => {
    const card = document.createElement("article");
    card.className = "card blog-card";

    const embedUrl = getYouTubeEmbed(tutorial.youtube);

    card.innerHTML = `
      ${
        embedUrl
          ? `
            <div class="video-wrapper">
              <iframe
                src="${embedUrl}"
                title="${tutorial.title}"
                allowfullscreen>
              </iframe>
            </div>
          `
          : ""
      }

      <h3>${tutorial.title}</h3>

      <p class="blog-date">
        ${formatDate(tutorial.date)}
        ${tutorial.difficulty ? ` • ${tutorial.difficulty}` : ""}
      </p>

      <p>${tutorial.description || "Click below to read this tutorial."}</p>

      <button class="blog-button read-more" type="button">
        Read tutorial ↓
      </button>

      <div class="blog-body" hidden>
        ${marked.parse(tutorial.body)}
      </div>
    `;

    const button = card.querySelector(".blog-button");
    const body = card.querySelector(".blog-body");

    button.addEventListener("click", () => {
      const isClosed = body.hasAttribute("hidden");

      if (isClosed) {
        body.removeAttribute("hidden");
        button.textContent = "Close tutorial ↑";
      } else {
        body.setAttribute("hidden", "");
        button.textContent = "Read tutorial ↓";
      }
    });

    tutorialsList.appendChild(card);
  });
}

async function loadTutorials() {
  tutorialsList.innerHTML = "<p>Loading tutorials...</p>";
  categoryGrid.innerHTML = "<p>Loading categories...</p>";

  try {
    const response = await fetch(TUTORIALS_API);

    if (!response.ok) {
      throw new Error("Could not fetch tutorials folder");
    }

    const files = await response.json();

    const markdownFiles = files.filter((file) => file.name.endsWith(".md"));

    tutorials = await Promise.all(
      markdownFiles.map(async (file) => {
        const tutorialResponse = await fetch(file.download_url);
        const text = await tutorialResponse.text();

        const parts = text.split("---");
        const frontmatter = parts[1] || "";
        const body = parts.slice(2).join("---").trim();

        return {
          title: getFrontmatterValue(frontmatter, "title") || "Untitled",
          date: getFrontmatterValue(frontmatter, "date"),
          category: getFrontmatterValue(frontmatter, "category"),
          difficulty: getFrontmatterValue(frontmatter, "difficulty"),
          youtube: getFrontmatterValue(frontmatter, "youtube"),
          description: getFrontmatterValue(frontmatter, "description"),
          body
        };
      })
    );

    renderCategories();
    renderTutorials();
  } catch (error) {
    console.error(error);
    categoryGrid.innerHTML = "";
    tutorialsList.innerHTML = `<p>Could not load tutorials: ${error.message}</p>`;
  }
}

if (tutorialSort) {
  tutorialSort.addEventListener("change", renderTutorials);
}

loadTutorials();