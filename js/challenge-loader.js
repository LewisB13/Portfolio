const CHALLENGE_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/challenge";

const challengeList =
  document.getElementById("challenge-list");

const difficultySelect =
  document.getElementById("challenge-difficulty");

const challengeSort =
  document.getElementById("challenge-sort");

const searchInput =
  document.getElementById("challenge-search");

const resultCount =
  document.getElementById("challenge-result-count");


let challenges = [];

let activeDifficulty =
  "All Challenges";

let searchQuery =
  "";


const difficulties = [
  "All Challenges",
  "Prerequisite",
  "Ultimate Beginner",
  "Easy",
  "Intermediate",
  "Advanced",
  "Difficult"
];


const difficultyIcons = {
  Prerequisite: "⚪",
  "Ultimate Beginner": "🌱",
  Easy: "🟢",
  Intermediate: "🟡",
  Advanced: "🟠",
  Difficult: "🔴"
};


/* ================= FRONTMATTER ================= */

function getFrontmatterValue(frontmatter, key) {

  return (
    frontmatter
      .match(
        new RegExp(
          `${key}:\\s*["']?(.*?)["']?$`,
          "m"
        )
      )?.[1]
      ?.trim() || ""
  );

}


/* ================= HELPERS ================= */

function formatDate(dateString) {

  if (!dateString) {
    return "";
  }

  const date =
    new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString(
    "en-IE",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

}


function getDifficultyIcon(difficulty) {

  return (
    difficultyIcons[difficulty] ||
    "⚪"
  );

}


function getYouTubeEmbed(url) {

  if (!url) {
    return "";
  }


  if (
    url.includes(
      "youtube.com/watch?v="
    )
  ) {

    const id =
      url
        .split("v=")[1]
        .split("&")[0];

    return (
      `https://www.youtube.com/embed/${id}`
    );

  }


  if (
    url.includes("youtu.be/")
  ) {

    const id =
      url
        .split("youtu.be/")[1]
        .split("?")[0];

    return (
      `https://www.youtube.com/embed/${id}`
    );

  }


  if (
    url.includes(
      "youtube.com/shorts/"
    )
  ) {

    const id =
      url
        .split("/shorts/")[1]
        .split("?")[0];

    return (
      `https://www.youtube.com/embed/${id}`
    );

  }


  if (
    url.includes(
      "youtube.com/embed/"
    )
  ) {
    return url;
  }


  return "";

}


/* ================= DIFFICULTIES ================= */

function buildDifficulties() {

  if (!difficultySelect) {
    return;
  }

  difficultySelect.innerHTML =
    "";


  difficulties.forEach(
    (difficulty) => {

      const count =
        difficulty ===
        "All Challenges"
          ? challenges.length
          : challenges.filter(
              (challenge) =>
                challenge.difficulty ===
                difficulty
            ).length;


      const option =
        document.createElement(
          "option"
        );

      option.value =
        difficulty;


      option.textContent =
        difficulty ===
        "All Challenges"
          ? `${difficulty} (${count})`
          : `${getDifficultyIcon(
              difficulty
            )} ${difficulty} (${count})`;


      option.selected =
        difficulty ===
        activeDifficulty;


      difficultySelect.appendChild(
        option
      );

    }
  );

}


/* ================= FILTERING ================= */

function getFilteredChallenges() {

  let filtered =
    [...challenges];


  if (
    activeDifficulty !==
    "All Challenges"
  ) {

    filtered =
      filtered.filter(
        (challenge) =>
          challenge.difficulty ===
          activeDifficulty
      );

  }


  if (
    searchQuery.trim()
  ) {

    const query =
      searchQuery
        .trim()
        .toLowerCase();


    filtered =
      filtered.filter(
        (challenge) =>

          [
            challenge.title,
            challenge.description,
            challenge.technology,
            challenge.difficulty,
            challenge.status,
            challenge.time
          ]

            .join(" ")

            .toLowerCase()

            .includes(query)
      );

  }


  const sortOrder =
    challengeSort?.value ||
    "latest";


  filtered.sort(
    (a, b) => {

      const dateA =
        new Date(a.date || 0);

      const dateB =
        new Date(b.date || 0);


      return (
        sortOrder === "oldest"
          ? dateA - dateB
          : dateB - dateA
      );

    }
  );


  return filtered;

}


/* ================= MEDIA ================= */

function createMedia(challenge) {

  const embed =
    getYouTubeEmbed(
      challenge.youtube
    );


  if (embed) {

    return `
      <div class="challenge-card-media">

        <div class="video-wrapper">

          <iframe
            src="${embed}"
            title="${challenge.title || "Challenge video"}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write;
                   encrypted-media; gyroscope;
                   picture-in-picture; web-share"
            allowfullscreen>
          </iframe>

        </div>

      </div>
    `;

  }


  if (
    challenge.thumbnail
  ) {

    return `
      <div class="challenge-card-media">

        <div class="challenge-media">

          <img
            src="${challenge.thumbnail}"
            alt="${challenge.title || "Challenge"}"
            class="challenge-thumbnail"
            loading="lazy"
          >

        </div>

      </div>
    `;

  }


  return `
    <div class="challenge-card-placeholder">

      <span class="challenge-placeholder-icon">
        &lt;/&gt;
      </span>

      <span>
        Challenge
      </span>

    </div>
  `;

}


/* ================= CARD ================= */

function createChallengeCard(
  challenge
) {

  const detailURL =
    `challenge.html?challenge=${
      encodeURIComponent(
        challenge.slug
      )
    }`;


  const card =
    document.createElement(
      "article"
    );


  card.className =
    "card challenge-card";


  card.innerHTML = `

    ${createMedia(challenge)}


    <div class="challenge-card-content">


      <div class="challenge-badges">

        <span
          class="challenge-badge challenge-difficulty-badge"
        >
          ${getDifficultyIcon(
            challenge.difficulty
          )}

          ${
            challenge.difficulty ||
            "Unrated"
          }
        </span>


        ${
          challenge.status
            ? `
              <span
                class="challenge-badge challenge-status-badge"
              >
                ${challenge.status}
              </span>
            `
            : ""
        }

      </div>


      <h3 class="challenge-card-title">

        <a href="${detailURL}">
          ${
            challenge.title ||
            "Untitled Challenge"
          }
        </a>

      </h3>


      <div class="challenge-card-meta">

        ${
          challenge.technology
            ? `
              <span>
                💻 ${challenge.technology}
              </span>
            `
            : ""
        }


        ${
          challenge.time
            ? `
              <span>
                ⏱ ${challenge.time}
              </span>
            `
            : ""
        }


        ${
          challenge.date
            ? `
              <span>
                📅 ${formatDate(
                  challenge.date
                )}
              </span>
            `
            : ""
        }

      </div>


      ${
        challenge.description
          ? `
            <p class="challenge-card-description">
              ${challenge.description}
            </p>
          `
          : ""
      }


      <div class="challenge-card-actions">

        <a
          class="btn btn-primary"
          href="${detailURL}"
        >
          View Challenge →
        </a>


        ${
          challenge.github
            ? `
              <a
                class="btn btn-outline"
                href="${challenge.github}"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub ↗
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
                rel="noopener noreferrer"
              >
                Live Demo ↗
              </a>
            `
            : ""
        }

      </div>

    </div>
  `;


  return card;

}


/* ================= RENDER ================= */

function renderChallenges() {

  if (!challengeList) {
    return;
  }


  const filtered =
    getFilteredChallenges();


  challengeList.innerHTML =
    "";


  if (resultCount) {

    resultCount.textContent =
      `${filtered.length} challenge${
        filtered.length === 1
          ? ""
          : "s"
      }`;

  }


  if (
    !filtered.length
  ) {

    challengeList.innerHTML = `

      <div class="challenge-empty">

        <h3>
          No challenges found
        </h3>

        <p>
          Try changing the difficulty
          or search term.
        </p>

      </div>
    `;

    return;

  }


  filtered.forEach(
    (challenge) => {

      challengeList.appendChild(
        createChallengeCard(
          challenge
        )
      );

    }
  );

}


/* ================= LOAD FILE ================= */

async function loadChallengeFile(
  file
) {

  const response =
    await fetch(
      file.download_url
    );


  if (!response.ok) {

    throw new Error(
      `Could not load ${file.name}`
    );

  }


  const text =
    await response.text();


  const parts =
    text.split("---");


  const frontmatter =
    parts[1] || "";


  const body =
    parts
      .slice(2)
      .join("---")
      .trim();


  const value =
    (key) =>
      getFrontmatterValue(
        frontmatter,
        key
      );


  return {

    slug:
      file.name.replace(
        /\.md$/i,
        ""
      ),

    title:
      value("title"),

    date:
      value("date"),

    status:
      value("status"),

    difficulty:
      value("difficulty"),

    time:
      value("time"),

    technology:
      value("technology"),

    thumbnail:
      value("thumbnail"),

    youtube:
      value("youtube"),

    github:
      value("github"),

    demo:
      value("demo"),

    description:
      value("description"),

    visibility:
      value("visibility") ||
      "public",

    body

  };

}


/* ================= LOAD ================= */

async function loadChallenges() {

  if (!challengeList) {
    return;
  }


  challengeList.innerHTML =
    "<p>Loading challenges...</p>";


  try {

    const response =
      await fetch(
        CHALLENGE_API
      );


    if (!response.ok) {

      throw new Error(
        `GitHub API error: ${response.status}`
      );

    }


    const files =
      await response.json();


    const markdownFiles =
      files.filter(
        (file) =>
          file.type ===
            "file" &&
          file.name
            .toLowerCase()
            .endsWith(".md")
      );


    challenges =
      await Promise.all(
        markdownFiles.map(
          loadChallengeFile
        )
      );


    challenges =
      challenges.filter(
        (challenge) =>
          challenge.visibility
            .toLowerCase() !==
          "private"
      );


    buildDifficulties();

    renderChallenges();


  } catch (error) {

    console.error(
      "Failed to load challenges:",
      error
    );


    challengeList.innerHTML = `

      <div class="challenge-empty">

        <h3>
          Could not load challenges
        </h3>

        <p>
          Please try again later.
        </p>

      </div>
    `;

  }

}


/* ================= EVENTS ================= */

difficultySelect?.addEventListener(
  "change",
  (event) => {

    activeDifficulty =
      event.target.value;

    renderChallenges();

  }
);


challengeSort?.addEventListener(
  "change",
  renderChallenges
);


searchInput?.addEventListener(
  "input",
  (event) => {

    searchQuery =
      event.target.value;

    renderChallenges();

  }
);


/* ================= START ================= */

loadChallenges();