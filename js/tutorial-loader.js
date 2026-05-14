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
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
  }

  return "";
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  return date.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getCategories() {
  const categories = tutorials.map((tutorial) => tutorial.category || "Uncategorised");
  return ["All Tutorials", ...new Set(categories)];
}

function renderCategories() {
  const categories = getCategories();

  categoryGrid.innerHTML = "";

  categories.forEach((category) => {
    const count =
      category === "All Tutorials"
        ? tutorials.length
        : tutorials.filter((tutorial) => tutorial.category === category).length;

    const card = document.createElement("button");
    card.type = "button";
    card.className = `category-card${category === activeCategory ? " active" : ""}`;

    card.innerHTML = `
      <span class="category-card-title">${category}</span>
      <span class="category-card-count">${count} tutorial${count === 1 ? "" : "s"}</span>
    `;

    card.addEventListener("click", () => {
      activeCategory = category;
      renderCategories();
      renderTutorials(tutorialSort.value);
    });

    categoryGrid.appendChild(card);
  });
}

function renderTutorials(order = "latest") {
  selectedCategoryTitle.textContent = activeCategory;

  tutorialsList.innerHTML = "";

  let filteredTutorials =
    activeCategory === "All Tutorials"
      ? tutorials
      : tutorials.filter((tutorial) => tutorial.category === activeCategory);

  filteredTutorials = [...filteredTutorials].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    return order === "oldest" ? dateA - dateB : dateB - dateA;
  });

  if (filteredTutorials.length === 0) {
    tutorialsList.innerHTML = "<p>No tutorials found.</p>";
    return;
  }

  filteredTutorials.forEach((tutorial) => {
    const embedUrl = getYouTubeEmbed(tutorial.youtube);

    const card = document.createElement("article");
    card.className = "card blog-card";

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
      const isHidden = body.hasAttribute("hidden");

      if (isHidden) {
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
    const fileResponse = await fetch(TUTORIALS_API);
    const files = await fileResponse.json();

    const markdownFiles = files.filter((file) => file.name.endsWith(".md"));

    tutorials = await Promise.all(
      markdownFiles.map(async (file) => {
        const response = await fetch(file.download_url);
        const text = await response.text();

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
    renderTutorials("latest");
  } catch (error) {
    console.error(error);
    categoryGrid.innerHTML = "";
    tutorialsList.innerHTML = "<p>Could not load tutorials.</p>";
  }
}

if (tutorialSort) {
  tutorialSort.addEventListener("change", function () {
    renderTutorials(this.value);
  });
}

loadTutorials();