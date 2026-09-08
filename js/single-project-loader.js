function getProjectSlug() {
  return new URLSearchParams(window.location.search).get("project");
}

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

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);

    // Standard YouTube URL:
    // https://www.youtube.com/watch?v=VIDEO_ID
    if (
      parsedUrl.hostname === "www.youtube.com" ||
      parsedUrl.hostname === "youtube.com"
    ) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Handles /shorts/VIDEO_ID
      if (parsedUrl.pathname.startsWith("/shorts/")) {
        const videoId = parsedUrl.pathname.split("/shorts/")[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Handles already embedded URLs
      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }
    }

    // Short YouTube URL:
    // https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1);

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch (error) {
    console.error("Invalid YouTube URL:", error);
  }

  return "";
}

async function loadSingleProject() {
  const slug = getProjectSlug();
  const container = document.getElementById("project-content");

  if (!container) {
    console.error("Project content container not found.");
    return;
  }

  if (!slug) {
    container.innerHTML = "<p>No project selected.</p>";
    return;
  }

  const url =
    `https://raw.githubusercontent.com/LewisB13/Portfolio/main/content/projects/${slug}.md`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to load project: ${res.status}`);
    }

    const text = await res.text();

    const parts = text.split("---");
    const frontmatter = parts[1] || "";
    const body = parts.slice(2).join("---").trim();

    const title = getFrontmatterValue(frontmatter, "title");
    const date = getFrontmatterValue(frontmatter, "date");
    const github = getFrontmatterValue(frontmatter, "github");
    const demo = getFrontmatterValue(frontmatter, "demo");
    const youtube = getFrontmatterValue(frontmatter, "youtube");

    const youtubeEmbedUrl = getYouTubeEmbedUrl(youtube);

    if (title) {
      document.title = title;
    }

    container.innerHTML = `
      <a class="read-more" href="projects.html">← Back</a>

      <p class="blog-date">${formatDate(date)}</p>

      <h1>${title}</h1>

      ${
        github || demo
          ? `
            <div class="note-actions">
              ${
                github
                  ? `<a class="read-more"
                        href="${github}"
                        target="_blank"
                        rel="noopener noreferrer">
                        GitHub ↗
                     </a>`
                  : ""
              }

              ${
                demo
                  ? `<a class="read-more"
                        href="${demo}"
                        target="_blank"
                        rel="noopener noreferrer">
                        Live Demo ↗
                     </a>`
                  : ""
              }
            </div>
          `
          : ""
      }

      <div class="markdown-body">
        ${marked.parse(body)}
      </div>

      ${
        youtubeEmbedUrl
          ? `
            <section class="project-demo-card">
              <h2>Project Demo</h2>

              <div class="project-video">
                <iframe
                  src="${youtubeEmbedUrl}"
                  title="${title} Project Demo"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen>
                </iframe>
              </div>
            </section>
          `
          : ""
      }
    `;
  } catch (err) {
    console.error("Failed to load project:", err);
    container.innerHTML = "<p>Could not load project.</p>";
  }
}

loadSingleProject();