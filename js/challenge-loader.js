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

let challenges = [];
let activeDifficulty = "All Challenges";
let searchQuery = "";


/* ================= FRONTMATTER ================= */

function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter
      .match(
        new RegExp(
          `${key}:\\s*["']?(.*?)["']?$`,
          "m"
        )
      )?.[1]?.trim() || ""
  );
}


/* ================= DATE ================= */

function formatDate(dateString) {
  if (!dateString) return "";

  return new Date(dateString)
    .toLocaleDateString("en-IE", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
}


/* ================= YOUTUBE ================= */

function getYouTubeEmbed(url) {
  if (!url) return "";

  if (url.includes("youtube.com/watch?v=")) {
    const id =
      url.split("v=")[1].split("&")[0];

    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be/")) {
    const id =
      url.split("youtu.be/")[1].split("?")[0];

    return `https://www.youtube.com/embed/${id}`;
  }

  return "";
}


/* ================= BUILD DIFFICULTIES ================= */

function buildDifficulties() {
  const difficulties = [
    "All Challenges",
    "Ultimate Beginner",
    "Easy",
    "Intermediate",
    "Advanced",
    "Difficult"
  ];

  difficultySelect.innerHTML = "";

  difficulties.forEach(difficulty => {
    const count =
      difficulty === "All Challenges"
        ? challenges.length
        : challenges.filter(
            challenge =>
              challenge.difficulty === difficulty
          ).length;

    const option =
      document.createElement("option");

    option.value = difficulty;
    option.textContent =
      `${difficulty} (${count})`;

    if (
      difficulty === activeDifficulty
    ) {
      option.selected = true;
    }

    difficultySelect.appendChild(option);
  });
}


/* ================= FILTER + SORT ================= */

function getFilteredChallenges() {
  let filtered = [...challenges];

  /* Difficulty */

  if (
    activeDifficulty !==
    "All Challenges"
  ) {
    filtered =
      filtered.filter(
        challenge =>
          challenge.difficulty ===
          activeDifficulty
      );
  }

  /* Search */

  if (searchQuery.trim()) {
    const q =
      searchQuery.toLowerCase();

    filtered =
      filtered.filter(
        challenge =>
          (
            (challenge.title || "") +
            " " +
            (challenge.description || "") +
            " " +
            (challenge.technology || "") +
            " " +
            (challenge.difficulty || "") +
            " " +
            (challenge.status || "")
          )
            .toLowerCase()
            .includes(q)
      );
  }

  /* Sort */

  const sortOrder =
    challengeSort?.value ||
    "latest";

  filtered.sort((a, b) => {
    const dateA =
      new Date(a.date || 0);

    const dateB =
      new Date(b.date || 0);

    return sortOrder === "oldest"
      ? dateA - dateB
      : dateB - dateA;
  });

  return filtered;
}


/* ================= RENDER ================= */

function renderChallenges() {
  challengeList.innerHTML = "";

  const filtered =
    getFilteredChallenges();

  if (!filtered.length) {
    challengeList.innerHTML =
      "<p>No challenges found.</p>";

    return;
  }

  filtered.forEach(challenge => {
    const card =
      document.createElement("article");

    card.className = "card";

    const embed =
      getYouTubeEmbed(
        challenge.youtube
      );

    card.innerHTML = `

      ${
        embed
          ? `
            <div class="video-wrapper">

              <iframe
                src="${embed}"
                allowfullscreen
              ></iframe>

            </div>
          `
          : ""
      }


      <h3>
        ${challenge.title || "Untitled"}
      </h3>


      <p class="video-meta">

        ${formatDate(challenge.date)}

        ${
          challenge.difficulty
            ? ` • ${challenge.difficulty}`
            : ""
        }

        ${
          challenge.status
            ? ` • ${challenge.status}`
            : ""
        }

      </p>


      ${
        challenge.technology
          ? `
            <p class="video-category">
              ${challenge.technology}
            </p>
          `
          : ""
      }


      <p>
        ${challenge.description || ""}
      </p>


      <button
        class="btn btn-outline btn-sm"
      >
        Read More
      </button>


      <div
        class="markdown-body"
        hidden
      >

        ${marked.parse(
          challenge.body || ""
        )}


        ${
          challenge.whatILearned
            ? `
              <h2>
                What I Learned
              </h2>

              ${marked.parse(
                challenge.whatILearned
              )}
            `
            : ""
        }


        ${
          challenge.github ||
          challenge.demo
            ? `
              <div class="note-actions">

                ${
                  challenge.github
                    ? `
                      <a
                        class="read-more"
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
                        class="read-more"
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
            `
            : ""
        }

      </div>

    `;


    const btn =
      card.querySelector("button");

    const body =
      card.querySelector(
        ".markdown-body"
      );


    btn.addEventListener(
      "click",
      () => {

        const open =
          body.hasAttribute(
            "hidden"
          );


        if (open) {
          body.removeAttribute(
            "hidden"
          );

          btn.textContent =
            "Close ↑";
        }

        else {
          body.setAttribute(
            "hidden",
            ""
          );

          btn.textContent =
            "Read More";
        }

      }
    );


    challengeList.appendChild(
      card
    );
  });
}


/* ================= LOAD DATA ================= */

async function loadChallenges() {
  challengeList.innerHTML =
    "<p>Loading challenges...</p>";

  try {
    const res =
      await fetch(CHALLENGE_API);

    if (!res.ok) {
      throw new Error(
        `GitHub API error: ${res.status}`
      );
    }

    const files =
      await res.json();

    const mdFiles =
      files.filter(
        file =>
          file.type === "file" &&
          file.name
            .toLowerCase()
            .endsWith(".md")
      );


    challenges =
      await Promise.all(

        mdFiles.map(
          async file => {

            const r =
              await fetch(
                file.download_url
              );

            const text =
              await r.text();

            const parts =
              text.split("---");

            const fm =
              parts[1] || "";

            const body =
              parts
                .slice(2)
                .join("---")
                .trim();


            return {
              title:
                getFrontmatterValue(
                  fm,
                  "title"
                ),

              date:
                getFrontmatterValue(
                  fm,
                  "date"
                ),

              status:
                getFrontmatterValue(
                  fm,
                  "status"
                ),

              difficulty:
                getFrontmatterValue(
                  fm,
                  "difficulty"
                ),

              technology:
                getFrontmatterValue(
                  fm,
                  "technology"
                ),

              github:
                getFrontmatterValue(
                  fm,
                  "github"
                ),

              demo:
                getFrontmatterValue(
                  fm,
                  "demo"
                ),

              youtube:
                getFrontmatterValue(
                  fm,
                  "youtube"
                ),

              description:
                getFrontmatterValue(
                  fm,
                  "description"
                ),

              whatILearned:
                getFrontmatterValue(
                  fm,
                  "what_i_learned"
                ),

              visibility:
                getFrontmatterValue(
                  fm,
                  "visibility"
                ) || "public",

              body
            };

          }
        )

      );


    challenges =
      challenges.filter(
        challenge =>
          challenge.visibility
            .toLowerCase() !==
          "private"
      );


    buildDifficulties();
    renderChallenges();

  }

  catch (error) {
    console.error(
      "Failed to load challenges:",
      error
    );

    challengeList.innerHTML =
      "<p>Could not load challenges.</p>";
  }
}


/* ================= EVENTS ================= */

difficultySelect
  ?.addEventListener(
    "change",
    event => {

      activeDifficulty =
        event.target.value;

      renderChallenges();

    }
  );


challengeSort
  ?.addEventListener(
    "change",
    renderChallenges
  );


searchInput
  ?.addEventListener(
    "input",
    event => {

      searchQuery =
        event.target.value;

      renderChallenges();

    }
  );


/* ================= INIT ================= */

loadChallenges();