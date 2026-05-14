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

async function loadTutorials() {
  const container = document.getElementById("tutorials-list");

  try {
    const response = await fetch(TUTORIALS_API);
    const files = await response.json();

    const markdownFiles = files.filter((file) => file.name.endsWith(".md"));

    const tutorials = await Promise.all(
      markdownFiles.map(async (file) => {
        const tutorialResponse = await fetch(file.download_url);
        const text = await tutorialResponse.text();

        const parts = text.split("---");
        const frontmatter = parts[1] || "";
        const body = parts.slice(2).join("---").trim();

        return {
          slug: file.name.replace(".md", ""),
          title: getFrontmatterValue(frontmatter, "title") || "Untitled",
          date: getFrontmatterValue(frontmatter, "date"),
          category: getFrontmatterValue(frontmatter, "category"),
          difficulty: getFrontmatterValue(frontmatter, "difficulty"),
          youtube: getFrontmatterValue(frontmatter, "youtube"),
          thumbnail: getFrontmatterValue(frontmatter, "thumbnail"),
          description: getFrontmatterValue(frontmatter, "description"),
          tags: getFrontmatterList(frontmatter, "tags"),
          body
        };
      })
    );

    tutorials.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = "";

    tutorials.forEach((tutorial) => {
      const card = document.createElement("article");
      card.classList.add("card", "tutorial-card");

      const tagsHtml = tutorial.tags
        .map((tag) => `<span class="tag">#${tag}</span>`)
        .join("");

      card.innerHTML = `
        ${
          tutorial.thumbnail
            ? `<img src="${tutorial.thumbnail}" alt="${tutorial.title}" class="tutorial-thumbnail">`
            : ""
        }

        <p class="video-category">${tutorial.category || "Tutorial"}</p>

        <h3>${tutorial.title}</h3>

        <p class="video-meta">
          ${tutorial.difficulty || "Beginner"} 
          ${tutorial.date ? `• ${new Date(tutorial.date).toLocaleDateString()}` : ""}
        </p>

        <p>${tutorial.description || "No description added yet."}</p>

        <div class="tags">
          ${tagsHtml}
        </div>

        ${
          tutorial.youtube
            ? `<a href="${tutorial.youtube}" target="_blank" rel="noopener">Watch Video →</a><br>`
            : ""
        }

        <a class="read-more" href="tutorial.html?tutorial=${tutorial.slug}">
          Read Tutorial →
        </a>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Could not load tutorials.</p>";
  }
}

loadTutorials();