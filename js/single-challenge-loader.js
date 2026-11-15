
/* =========================================
   SINGLE CHALLENGE LOADER
   Sveltia CMS / GitHub Markdown
========================================= */

const CHALLENGE_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/challenge";

const challengeContent =
  document.getElementById("challenge-content");

const difficultyIcons = {
  Prerequisite: "⚪",
  "Ultimate Beginner": "🌱",
  Easy: "🟢",
  Intermediate: "🟡",
  Advanced: "🟠",
  Difficult: "🔴"
};

/* =========================================
   HELPERS
========================================= */

function escapeHTML(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]
  );
}

function safeURL(value) {
  if (!value) return "";

  try {
    const url = new URL(value, window.location.href);

    if (!["http:", "https:"].includes(url.protocol)) {
      return "";
    }

    return escapeHTML(url.href);
  } catch {
    return "";
  }
}

function getFrontmatterValue(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);

  const index = lines.findIndex(line =>
    line.startsWith(key + ":")
  );

  if (index === -1) return "";

  const value = lines[index]
    .slice(key.length + 1)
    .trim();

  // Handle YAML multiline text.
  if (/^[|>][-+]?(\d+)?$/.test(value)) {
    const content = [];

    for (let i = index + 1; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim() && !/^\s/.test(line)) {
        break;
      }

      content.push(line.replace(/^ {2}/, ""));
    }

    return content.join("\n").trim();
  }

  return value.replace(/^["']|["']$/g, "");
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function getDifficultyIcon(difficulty) {
  return difficultyIcons[difficulty] || "⚪";
}

function getYouTubeEmbed(url) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    let id = "";

    if (
      parsed.hostname === "youtu.be" ||
      parsed.hostname === "www.youtu.be"
    ) {
      id = parsed.pathname.split("/")[1];
    } else if (
      [
        "youtube.com",
        "www.youtube.com",
        "m.youtube.com"
      ].includes(parsed.hostname)
    ) {
      id = parsed.searchParams.get("v") || "";

      if (
        !id &&
        /^\/(embed|shorts|live)\//.test(parsed.pathname)
      ) {
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
   PARSE CHALLENGE
========================================= */

function parseChallenge(text, slug) {
  const match = text.match(
    /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/
  );

  const frontmatter = match ? match[1] : "";
  const body = match
    ? text.slice(match[0].length).trim()
    : text.trim();

  const value = key =>
    getFrontmatterValue(frontmatter, key);

  return {
    slug,
    title: value("title"),
    date: value("date"),
    status: value("status"),
    difficulty: value("difficulty"),
    time: value("time"),
    technology: value("technology"),
    thumbnail: value("thumbnail"),
    youtube: value("youtube"),
    github: value("github"),
    demo: value("demo"),
    description: value("description"),
    visibility: value("visibility") || "public",
    body
  };
}

/* =========================================
   MEDIA
========================================= */

function renderMedia(challenge) {
  const embed = getYouTubeEmbed(challenge.youtube);

  if (embed) {
    return `
      <section class="challenge-detail-video">

        <div class="challenge-detail-section-heading">
          <span class="challenge-section-label">
            DEMONSTRATION
          </span>

          <h2>Watch the Challenge</h2>
        </div>

        <div class="video-wrapper">
          <iframe
            src="${escapeHTML(embed)}"
            title="${escapeHTML(challenge.title)}"
            loading="lazy"
            allow="accelerometer; autoplay;
                   clipboard-write; encrypted-media;
                   gyroscope; picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>

      </section>
    `;
  }

  const thumbnail = safeURL(challenge.thumbnail);

  if (thumbnail) {
    return `
      <section class="challenge-detail-video">
        <div class="challenge-detail-media">
          <img
            src="${thumbnail}"
            alt="${escapeHTML(challenge.title)}"
            loading="lazy">
        </div>
      </section>
    `;
  }

  return "";
}

/* =========================================
   META ITEM
========================================= */

function metaItem(label, value) {
  if (!value) return "";

  return `
    <div class="challenge-meta-item">
      <span class="challenge-meta-label">
        ${escapeHTML(label)}
      </span>

      <strong>${escapeHTML(value)}</strong>
    </div>
  `;
}

/* =========================================
   RENDER CHALLENGE
========================================= */

function renderChallenge(challenge) {
  const difficulty = challenge.difficulty
    ? `${getDifficultyIcon(challenge.difficulty)} ${challenge.difficulty}`
    : "";

  const githubURL = safeURL(challenge.github);
  const demoURL = safeURL(challenge.demo);

  let markdownHTML = "";

  if (challenge.body) {
    if (
      typeof marked !== "undefined" &&
      typeof DOMPurify !== "undefined"
    ) {
      markdownHTML = DOMPurify.sanitize(
        marked.parse(challenge.body)
      );
    } else {
      markdownHTML =
        `<pre>${escapeHTML(challenge.body)}</pre>`;
    }
  } else {
    markdownHTML =
      "<p>No write-up has been added yet.</p>";
  }

  challengeContent.innerHTML = `

    <header class="challenge-detail-hero">

      <div class="challenge-detail-badges">

        ${
          challenge.difficulty
            ? `
              <span class="challenge-badge challenge-difficulty-badge">
                ${escapeHTML(difficulty)}
              </span>
            `
            : ""
        }

        ${
          challenge.status
            ? `
              <span class="challenge-badge challenge-status-badge">
                ${escapeHTML(challenge.status)}
              </span>
            `
            : ""
        }

      </div>

      <h1>
        ${escapeHTML(challenge.title || "Untitled Challenge")}
      </h1>

      ${
        challenge.description
          ? `
            <p class="challenge-detail-description">
              ${escapeHTML(challenge.description)}
            </p>
          `
          : ""
      }

      <div class="challenge-detail-meta">

        ${metaItem(
          "Technology",
          challenge.technology
        )}

        ${metaItem(
          "Estimated Time",
          challenge.time
        )}

        ${metaItem(
          "Published",
          formatDate(challenge.date)
        )}

        ${metaItem(
          "Difficulty",
          difficulty
        )}

      </div>

      <div class="challenge-detail-actions">

        ${
          githubURL
            ? `
              <a
                class="btn btn-primary"
                href="${githubURL}"
                target="_blank"
                rel="noopener noreferrer">
                View GitHub ↗
              </a>
            `
            : ""
        }

        ${
          demoURL
            ? `
              <a
                class="btn btn-outline"
                href="${demoURL}"
                target="_blank"
                rel="noopener noreferrer">
                Live Demo ↗
              </a>
            `
            : ""
        }

      </div>

    </header>

    ${renderMedia(challenge)}

    <section class="challenge-detail-writeup">

      <div class="challenge-detail-section-heading">

        <span class="challenge-section-label">
          CHALLENGE WRITE-UP
        </span>

        <h2>The Challenge</h2>

      </div>

      <div class="markdown-body challenge-markdown">
        ${markdownHTML}
      </div>

    </section>

    <footer class="challenge-detail-footer">

      <a
        href="challenge-projects.html"
        class="btn btn-outline">
        ← All Challenges
      </a>

      ${
        githubURL
          ? `
            <a
              href="${githubURL}"
              class="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer">
              View Source Code ↗
            </a>
          `
          : ""
      }

    </footer>
  `;

  document.title =
    `${challenge.title || "Challenge"} | Lewis Barrett Portfolio`;
}

/* =========================================
   ERROR DISPLAY
========================================= */

function showError(
  message = "This challenge could not be loaded."
) {
  if (!challengeContent) return;

  challengeContent.innerHTML = `
    <div class="challenge-detail-error">

      <h1>Challenge not found</h1>

      <p>${escapeHTML(message)}</p>

      <a
        href="challenge-projects.html"
        class="btn btn-primary">
        Back to Challenges
      </a>

    </div>
  `;
}

/* =========================================
   LOAD CHALLENGE
========================================= */

async function loadChallenge() {
  if (!challengeContent) return;

  const params =
    new URLSearchParams(window.location.search);

  const slug = params.get("challenge");

  if (!slug) {
    showError("No challenge was specified.");
    return;
  }

  /* FIXED SLUG VALIDATION

     Accepts:
     - Emoji
     - En and em dashes
     - Full stops
     - Spaces
     - Standard letters and numbers

     Rejects:
     - Path separators
     - Control characters
     - Directory traversal
  */

  if (
    slug === "." ||
    slug === ".." ||
    slug.includes("/") ||
    slug.includes("\\") ||
    /[\u0000-\u001F\u007F]/.test(slug)
  ) {
    showError("The challenge URL is invalid.");
    return;
  }

  try {
    /* ENCODE THE COMPLETE FILENAME */

    const filename = `${slug}.md`;

    const url =
      `${CHALLENGE_API}/${encodeURIComponent(filename)}`;

    console.log("Loading challenge:", url);

    const apiResponse = await fetch(url);

    if (!apiResponse.ok) {
      throw new Error(
        `GitHub API returned ${apiResponse.status}`
      );
    }

    const file = await apiResponse.json();

    if (!file.download_url) {
      throw new Error(
        "GitHub did not return a download URL."
      );
    }

    const fileResponse = await fetch(
      file.download_url
    );

    if (!fileResponse.ok) {
      throw new Error(
        `Markdown download failed: ${fileResponse.status}`
      );
    }

    const text = await fileResponse.text();

    const challenge = parseChallenge(text, slug);

    if (
      challenge.visibility.toLowerCase() === "private"
    ) {
      showError(
        "This challenge is not publicly available."
      );
      return;
    }

    renderChallenge(challenge);

  } catch (error) {
    console.error(
      "Single challenge loader error:",
      error
    );

    showError(
      "The challenge could not be loaded. " +
      "Check that its Markdown file exists on GitHub."
    );
  }
}

/* =========================================
   INITIALISE
========================================= */

loadChallenge();
