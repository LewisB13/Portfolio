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


/* ================= HELPERS ================= */

function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter
      .match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]
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


function getDifficultyIcon(difficulty) {
  return difficultyIcons[difficulty] || "⚪";
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

  if (url.includes("youtube.com/shorts/")) {
    const id = url.split("/shorts/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url.includes("youtube.com/embed/")
    ? url
    : "";
}


/* ================= PARSE ================= */

function parseChallenge(text, slug) {
  const parts = text.split("---");

  const frontmatter = parts[1] || "";
  const body = parts.slice(2).join("---").trim();

  const value = (key) =>
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


/* ================= MEDIA ================= */

function renderMedia(challenge) {
  const embed =
    getYouTubeEmbed(challenge.youtube);

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
            src="${embed}"
            title="${challenge.title}"
            allow="accelerometer; autoplay; clipboard-write;
                   encrypted-media; gyroscope;
                   picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>

      </section>
    `;
  }

  if (challenge.thumbnail) {
    return `
      <section class="challenge-detail-video">
        <div class="challenge-detail-media">
          <img
            src="${challenge.thumbnail}"
            alt="${challenge.title}"
          >
        </div>
      </section>
    `;
  }

  return "";
}


/* ================= META ITEM ================= */

function metaItem(label, value) {
  if (!value) return "";

  return `
    <div class="challenge-meta-item">
      <span class="challenge-meta-label">
        ${label}
      </span>

      <strong>${value}</strong>
    </div>
  `;
}


/* ================= RENDER ================= */

function renderChallenge(challenge) {
  const difficulty =
    challenge.difficulty
      ? `${getDifficultyIcon(challenge.difficulty)}
         ${challenge.difficulty}`
      : "";

  challengeContent.innerHTML = `

    <header class="challenge-detail-hero">

      <div class="challenge-detail-badges">

        ${
          challenge.difficulty
            ? `
              <span class="challenge-badge challenge-difficulty-badge">
                ${difficulty}
              </span>
            `
            : ""
        }

        ${
          challenge.status
            ? `
              <span class="challenge-badge challenge-status-badge">
                ${challenge.status}
              </span>
            `
            : ""
        }

      </div>


      <h1>
        ${challenge.title || "Untitled Challenge"}
      </h1>


      ${
        challenge.description
          ? `
            <p class="challenge-detail-description">
              ${challenge.description}
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
          challenge.github
            ? `
              <a
                class="btn btn-primary"
                href="${challenge.github}"
                target="_blank"
                rel="noopener noreferrer">
                View GitHub ↗
              </a>
            `
            : ""
        }

        ${
          challenge.demo
            ? `
              <a
                class="btn btn-outline"
                href="${challenge.demo}"
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

        ${
          challenge.body
            ? marked.parse(challenge.body)
            : "<p>No write-up has been added yet.</p>"
        }

      </div>

    </section>


    <footer class="challenge-detail-footer">

      <a
        href="challenge-projects.html"
        class="btn btn-outline">
        ← All Challenges
      </a>

      ${
        challenge.github
          ? `
            <a
              href="${challenge.github}"
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
    `${challenge.title} | Lewis Barrett Portfolio`;
}


/* ================= ERROR ================= */

function showError(message = "This challenge could not be loaded.") {
  challengeContent.innerHTML = `

    <div class="challenge-detail-error">

      <h1>Challenge not found</h1>

      <p>${message}</p>

      <a
        href="challenge-projects.html"
        class="btn btn-primary">
        Back to Challenges
      </a>

    </div>
  `;
}


/* ================= LOAD ================= */

async function loadChallenge() {
  if (!challengeContent) return;

  const params =
    new URLSearchParams(window.location.search);

  const slug =
    params.get("challenge");

  if (!slug) {
    showError("No challenge was specified.");
    return;
  }

  if (!/^[a-zA-Z0-9._-]+$/.test(slug)) {
    showError("The challenge URL is invalid.");
    return;
  }

  try {
    const apiResponse =
      await fetch(
        `${CHALLENGE_API}/${encodeURIComponent(slug)}.md`
      );

    if (!apiResponse.ok) {
      throw new Error("Challenge not found.");
    }

    const file =
      await apiResponse.json();

    const fileResponse =
      await fetch(file.download_url);

    if (!fileResponse.ok) {
      throw new Error("Could not download challenge.");
    }

    const text =
      await fileResponse.text();

    const challenge =
      parseChallenge(text, slug);

    if (
      challenge.visibility.toLowerCase() ===
      "private"
    ) {
      throw new Error("Challenge is private.");
    }

    renderChallenge(challenge);

  } catch (error) {
    console.error(error);
    showError();
  }
}


/* ================= START ================= */

loadChallenge();