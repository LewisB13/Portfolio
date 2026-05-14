const TUTORIALS_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/tutorials";

function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter
      .match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]
      ?.trim() || ""
  );
}

function getFrontmatterList(frontmatter, key) {
  const regex = new RegExp(`${key}:\\s*\\n([\\s\\S]*?)(\\n\\w|$)`, "m");
  const match = frontmatter.match(regex);

  if (!match) return [];

  return match[1]
    .split("\n")
    .map((item) => item.replace("-", "").trim())
    .filter(Boolean);
}

function getYouTubeEmbed(url) {
  if (!url) return "";

  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return "";
}

async function loadTutorials() {
  const container = document.getElementById("tutorials-list");
  container.innerHTML = "<p>Loading tutorials...</p>";

  try {
    const fileResponse = await fetch(TUTORIALS_API);
    const files = await fileResponse.json();

    const markdownFiles = files.filter((file) => file.name.endsWith(".md"));

    const tutorials = await Promise.all(
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
          tags: getFrontmatterList(frontmatter, "tags"),
          body
        };
      })
    );

    tutorials.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = "";

    tutorials.forEach((tutorial) => {
      const article = document.createElement("article");
      article.classList.add("card", "blog-card");

      const embedUrl = getYouTubeEmbed(tutorial.youtube);

      article.innerHTML = `
        <p class="video-category">${tutorial.category || "Tutorial"}</p>

        <h3>${tutorial.title}</h3>

        <p class="video-meta">
          ${tutorial.difficulty || "Beginner"}
          ${tutorial.date ? `• ${new Date(tutorial.date).toLocaleDateString()}` : ""}
        </p>

        <p>${tutorial.description || "Click to read this tutorial."}</p>

        <button class="read-more tutorial-toggle">
          Read tutorial ↓
        </button>

        <div class="tutorial-expanded" style="display: none;">
          ${
            embedUrl
              ? `
                <div class="video-wrapper">
                  <iframe
                    src="${embedUrl}"
                    title="${tutorial.title}"
                    frameborder="0"
                    allowfullscreen>
                  </iframe>
                </div>
              `
              : ""
          }

          <div class="markdown-body">
            ${marked.parse(tutorial.body)}
          </div>
        </div>
      `;

      const button = article.querySelector(".tutorial-toggle");
      const expanded = article.querySelector(".tutorial-expanded");

      button.addEventListener("click", () => {
        const isOpen = expanded.style.display === "block";

        expanded.style.display = isOpen ? "none" : "block";
        button.textContent = isOpen
          ? "Read tutorial ↓"
          : "Close tutorial ↑";
      });

      container.appendChild(article);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Could not load tutorials.</p>";
  }
}

loadTutorials();