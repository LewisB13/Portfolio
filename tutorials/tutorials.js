const videoGrid = document.getElementById("video-grid");
const categoryGrid = document.getElementById("category-grid");
const videoSort = document.getElementById("video-sort");
const selectedCategoryTitle = document.getElementById("selected-category-title");

let activeCategory = "Python Tutorials";

function getEmbedUrl(url) {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.slice(1);
      return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    }

    if (parsed.searchParams.get("v")) {
      const id = parsed.searchParams.get("v");
      return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    }

    if (parsed.pathname.includes("/embed/")) {
      return url;
    }
  } catch (error) {
    console.error("Invalid YouTube URL:", url, error);
  }

  return "";
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(dateString) {
  const date = parseDate(dateString);

  return date.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getCategories() {
  return [...new Set(videos.map((video) => video.category))];
}

function renderCategories() {
  const categories = getCategories();
  categoryGrid.innerHTML = "";

  categories.forEach((category) => {
    const count = videos.filter((video) => video.category === category).length;

    const card = document.createElement("button");
    card.className = `category-card${category === activeCategory ? " active" : ""}`;
    card.type = "button";

    card.innerHTML = `
      <span class="category-card-title">${category}</span>
      <span class="category-card-count">${count} videos</span>
    `;

    card.addEventListener("click", () => {
      activeCategory = category;
      renderCategories();
      renderVideos(videoSort.value);
    });

    categoryGrid.appendChild(card);
  });
}

function renderVideos(order = "latest") {
  if (!videoGrid) return;

  selectedCategoryTitle.textContent = activeCategory;
  videoGrid.innerHTML = "";

  const filteredVideos = videos.filter((video) => video.category === activeCategory);

  const sortedVideos = [...filteredVideos].sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);

    return order === "oldest" ? dateA - dateB : dateB - dateA;
  });

  sortedVideos.forEach((video) => {
    const embedUrl = getEmbedUrl(video.url);

    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="video-wrapper">
        <iframe
          src="${embedUrl}"
          title="${video.title}"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>
      <h3>${video.title}</h3>
      <p class="video-date">${formatDate(video.date)}</p>
      <p>${video.description}</p>
    `;

    videoGrid.appendChild(card);
  });
}

if (videoSort) {
  videoSort.addEventListener("change", function () {
    renderVideos(this.value);
  });
}

renderCategories();
renderVideos("latest");