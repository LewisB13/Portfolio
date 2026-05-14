function getTutorialSlug() {
  const params = new URLSearchParams(window.location.search);
  return params.get("tutorial");
}

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

function getYoutubeEmbedUrl(url) {
  if (!url) return "";

  if (url.includes("youtube.com/watch?v=")) {
    return url.replace("watch?v=", "embed/");
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${id}`;
  }

  return "";
}

async function loadSingleTutorial() {
  const slug = getTutorialSlug();
  const container = document.getElementById("tutorial-content");

  if (!slug) {
    container.innerHTML = "<p>No tutorial selected.</p>";
    return;
  }

  const url = `https://raw.githubusercontent.com/LewisB13/Portfolio/main/content/tutorials/${slug}.md`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Tutorial not found");
    }

    const text = await response.text();

    const parts = text.split("---");
    const frontmatter = parts[1] || "";
    const body = parts.slice(2).join("---").trim();

    const title = getFrontmatterValue(frontmatter, "title") || "Untitled";
    const date = getFrontmatterValue(frontmatter, "date");
    const category = getFrontmatterValue(frontmatter, "category");
    const difficulty = getFrontmatterValue(frontmatter, "difficulty");
    const youtube = getFrontmatterValue(frontmatter, "youtube");
    const thumbnail = getFrontmatterValue(frontmatter, "thumbnail");
    const description = getFrontmatterValue(frontmatter, "description");
    const tags = getFrontmatterList(frontmatter, "tags");

    const embedUrl = getYoutubeEmbedUrl(youtube);

    const tagsHtml = tags
      .map((tag) => `<span class="tag">#${tag}</span>`)
      .join("");

    container.innerHTML = `
      ${
        thumbnail
          ? `<img src="${thumbnail}" alt="${title}" class="tutorial-thumbnail">`
          : ""
      }

      <p class="video-category">${category || "Tutorial"}</p>

      <h1>${title}</h1>

      <p class="video-meta">
        ${difficulty || "Beginner"}
        ${date ? `• ${new Date(date).toLocaleDateString()}` : ""}
      </p>

      <p>${description || ""}</p>

      <div class="tags">
        ${tagsHtml}
      </div>

      ${
        embedUrl
          ? `
            <div class="video-wrapper">
              <iframe
                src="${embedUrl}"
                title="${title}"
                frameborder="0"
                allowfullscreen>
              </iframe>
            </div>
          `
          : ""
      }

      <div class="markdown-body">
        ${marked.parse(body)}
      </div>
    `;

    document.title = `${title} | Lewis Barrett`;
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Could not load this tutorial.</p>";
  }
}

loadSingleTutorial();