
/* =========================================
   HOMELAB LOADER
   Sveltia CMS / GitHub Markdown
========================================= */

const HOMELAB_API =
  "https://api.github.com/repos/lewisb13/Portfolio/contents/content/homelab";

const homelabList =
  document.getElementById("homelab-list");

const categorySelect =
  document.getElementById("homelab-category");

const homelabSort =
  document.getElementById("homelab-sort");

const searchInput =
  document.getElementById("homelab-search");

const selectedCategoryTitle =
  document.getElementById("selected-category-title");

let homelab = [];
let activeCategory = "All Homelab";
let searchQuery = "";

/* =========================================
   FRONTMATTER
========================================= */

function getFrontmatterValue(frontmatter, key) {
  const line = frontmatter.split(/\r?\n/).find(
    line => line.trimStart().startsWith(key + ":")
  );

  return line
    ? line.slice(line.indexOf(":") + 1)
        .trim()
        .replace(/^["']|["']$/g, "")
    : "";
}

function parseMarkdownFile(text) {
  const match = text.match(
    /^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?/
  );

  return {
    frontmatter: match ? match[1] : "",
    body: match ? text.slice(match[0].length) : text
  };
}

/* =========================================
   DATE
========================================= */

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

/* =========================================
   YOUTUBE
========================================= */

function getYouTubeEmbed(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    let id = "";

    if (parsed.hostname === "youtu.be") {
      id = parsed.pathname.split("/")[1];
    } else if (
      ["youtube.com", "www.youtube.com", "m.youtube.com"]
        .includes(parsed.hostname)
    ) {
      id = parsed.searchParams.get("v") || "";

      if (!id && /^\/(embed|shorts)\//.test(parsed.pathname)) {
        id = parsed.pathname.split("/")[2];
      }
    }

    return /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? `https://www.youtube.com/embed/${id}`
      : "";
  } catch {
    return "";
  }
}

/* =========================================
   SAFE LINKS
========================================= */

function createExternalLink(label, url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (!["https:", "http:"].includes(parsed.protocol)) {
      return null;
    }

    const link = document.createElement("a");
    link.className = "read-more";
    link.href = parsed.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;

    return link;
  } catch {
    return null;
  }
}

/* =========================================
   CATEGORIES
========================================= */

function buildCategories() {
  const categories = [
    "All Homelab",
    ...new Set(
      homelab.map(
        h => h.category || "Uncategorised"
      )
    )
  ];

  categorySelect.innerHTML = "";

  categories.forEach(category => {
    const count =
      category === "All Homelab"
        ? homelab.length
        : homelab.filter(
            h =>
              (h.category || "Uncategorised") === category
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

/* =========================================
   FILTER AND SORT
========================================= */

function getFilteredHomelab() {
  let filtered = [...homelab];

  if (activeCategory !== "All Homelab") {
    filtered = filtered.filter(
      h =>
        (h.category || "Uncategorised") === activeCategory
    );
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();

    filtered = filtered.filter(h =>
      [
        h.title,
        h.description,
        h.category,
        h.status
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }

  filtered.sort((a, b) => {
    const dateA =
      new Date(a.date || 0).getTime() || 0;

    const dateB =
      new Date(b.date || 0).getTime() || 0;

    return homelabSort.value === "oldest"
      ? dateA - dateB
      : dateB - dateA;
  });

  return filtered;
}

/* =========================================
   RENDER HOMELAB CARDS
========================================= */

function renderHomelab() {
  homelabList.innerHTML = "";

  if (selectedCategoryTitle) {
    selectedCategoryTitle.textContent =
      activeCategory === "All Homelab"
        ? "Latest Homelab Projects"
        : activeCategory;
  }

  const filtered = getFilteredHomelab();

  if (!filtered.length) {
    homelabList.textContent =
      "No homelab projects found.";
    return;
  }

  filtered.forEach(h => {
    const card = document.createElement("article");
    card.className = "card";

    /* VIDEO OR THUMBNAIL */

    const embed = getYouTubeEmbed(h.youtube);

    if (embed) {
      const wrapper = document.createElement("div");
      wrapper.className = "video-wrapper";

      const iframe = document.createElement("iframe");
      iframe.src = embed;
      iframe.title = h.title || "Homelab video";
      iframe.loading = "lazy";
      iframe.allowFullscreen = true;

      wrapper.appendChild(iframe);
      card.appendChild(wrapper);
    } else if (h.thumbnail) {
      const image = document.createElement("img");
      image.src = h.thumbnail;
      image.alt = h.title || "Homelab thumbnail";
      image.loading = "lazy";
      image.className = "project-thumbnail";

      card.appendChild(image);
    }

    /* CLICKABLE TITLE */

    const heading = document.createElement("h3");

    const titleLink = document.createElement("a");
    titleLink.href =
      "homelab-single.html?slug=" +
      encodeURIComponent(h.slug);

    titleLink.textContent =
      h.title || "Untitled Homelab Project";

    heading.appendChild(titleLink);

    /* METADATA */

    const meta = document.createElement("p");
    meta.className = "video-meta";
    meta.textContent = [
      formatDate(h.date),
      h.category,
      h.status
    ]
      .filter(Boolean)
      .join(" • ");

    /* DESCRIPTION */

    const description = document.createElement("p");
    description.textContent = h.description || "";

    /* ACTION LINKS */

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const githubLink =
      createExternalLink("GitHub ↗", h.github);

    const demoLink =
      createExternalLink("Live Demo ↗", h.demo);

    if (githubLink) actions.appendChild(githubLink);
    if (demoLink) actions.appendChild(demoLink);

    /* READ MORE */

    const button = document.createElement("button");
    button.className = "read-more";
    button.type = "button";
    button.textContent = "Read More ↓";

    const body = document.createElement("div");
    body.className = "markdown-body";
    body.hidden = true;

    const markdownHTML = marked.parse(h.body || "");

    if (typeof DOMPurify !== "undefined") {
      body.innerHTML = DOMPurify.sanitize(markdownHTML);
    } else {
      body.textContent = h.body || "";
    }

    button.addEventListener("click", () => {
      body.hidden = !body.hidden;

      button.textContent = body.hidden
        ? "Read More ↓"
        : "Show Less ↑";
    });

    /* ASSEMBLE CARD */

    card.append(
      heading,
      meta,
      description
    );

    if (actions.children.length) {
      card.appendChild(actions);
    }

    card.append(button, body);
    homelabList.appendChild(card);
  });
}

/* =========================================
   LOAD CONTENT FROM GITHUB
========================================= */

async function loadHomelab() {
  homelabList.textContent =
    "Loading homelab projects...";

  try {
    const response = await fetch(HOMELAB_API);

    if (!response.ok) {
      throw new Error(
        `GitHub API error: ${response.status}`
      );
    }

    const files = await response.json();

    if (!Array.isArray(files)) {
      throw new Error(
        "Homelab content folder not found"
      );
    }

    const markdownFiles = files.filter(
      file =>
        file.name.toLowerCase().endsWith(".md")
    );

    homelab = await Promise.all(
      markdownFiles.map(async file => {
        const response = await fetch(
          file.download_url
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load ${file.name}`
          );
        }

        const text = await response.text();

        const {
          frontmatter,
          body
        } = parseMarkdownFile(text);

        return {
          slug: file.name.replace(/\.md$/i, ""),
          title: getFrontmatterValue(frontmatter, "title"),
          date: getFrontmatterValue(frontmatter, "date"),
          category: getFrontmatterValue(frontmatter, "category"),
          status: getFrontmatterValue(frontmatter, "status"),
          github: getFrontmatterValue(frontmatter, "github"),
          demo: getFrontmatterValue(frontmatter, "demo"),
          youtube: getFrontmatterValue(frontmatter, "youtube"),
          thumbnail: getFrontmatterValue(frontmatter, "thumbnail"),
          description: getFrontmatterValue(frontmatter, "description"),
          visibility: getFrontmatterValue(frontmatter, "visibility"),
          body
        };
      })
    );

    /* HIDE PRIVATE ENTRIES */

    homelab = homelab.filter(
      h => h.visibility !== "private"
    );

    buildCategories();
    renderHomelab();

  } catch (error) {
    console.error(
      "Homelab loader error:",
      error
    );

    homelabList.textContent =
      "Unable to load homelab projects.";
  }
}

/* =========================================
   EVENT LISTENERS
========================================= */

categorySelect.addEventListener(
  "change",
  event => {
    activeCategory = event.target.value;
    renderHomelab();
  }
);

homelabSort.addEventListener(
  "change",
  renderHomelab
);

searchInput.addEventListener(
  "input",
  event => {
    searchQuery = event.target.value;
    renderHomelab();
  }
);

/* =========================================
   INITIALISE
========================================= */

loadHomelab();
