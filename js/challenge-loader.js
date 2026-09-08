/* ===============================
   CHALLENGE CONFIG
================================ */

const CHALLENGE_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/challenge";


/* ===============================
   ELEMENTS
================================ */

const challengeList =
  document.getElementById("challenge-list");

const difficultySelect =
  document.getElementById("challenge-difficulty");

const challengeSort =
  document.getElementById("challenge-sort");

const searchInput =
  document.getElementById("challenge-search");


/* ===============================
   STATE
================================ */

let challenges = [];

let activeDifficulty =
  "All Challenges";

let searchQuery = "";


/* ===============================
   FRONTMATTER
================================ */

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


/* ===============================
   DATE
================================ */

function formatDate(dateString) {

  if (!dateString) {
    return "";
  }

  return new Date(dateString)
    .toLocaleDateString(
      "en-IE",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );

}


/* ===============================
   YOUTUBE
================================ */

function getYouTubeEmbed(url) {

  if (!url) {
    return "";
  }


  /* Normal YouTube URL */

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


  /* Short YouTube URL */

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


  /* YouTube Shorts */

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


  /* Already an embed URL */

  if (
    url.includes(
      "youtube.com/embed/"
    )
  ) {

    return url;

  }


  return "";

}


/* ===============================
   DIFFICULTY FILTER
================================ */

function buildDifficulties() {

  if (!difficultySelect) {
    return;
  }


  const difficulties = [
    "All Challenges",
    "Ultimate Beginner",
    "Easy",
    "Intermediate",
    "Advanced",
    "Difficult"
  ];


  difficultySelect.innerHTML = "";


  difficulties.forEach(
    difficulty => {

      const count =
        difficulty ===
        "All Challenges"

          ? challenges.length

          : challenges.filter(
              challenge =>
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
        `${difficulty} (${count})`;


      if (
        difficulty ===
        activeDifficulty
      ) {

        option.selected = true;

      }


      difficultySelect.appendChild(
        option
      );

    }
  );

}


/* ===============================
   FILTER + SEARCH + SORT
================================ */

function getFilteredChallenges() {

  let filtered =
    [...challenges];


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

  if (
    searchQuery.trim()
  ) {

    const query =
      searchQuery
        .toLowerCase()
        .trim();


    filtered =
      filtered.filter(
        challenge => {

          const searchableText = `

            ${challenge.title || ""}

            ${challenge.description || ""}

            ${challenge.technology || ""}

            ${challenge.difficulty || ""}

            ${challenge.status || ""}

          `.toLowerCase();


          return searchableText
            .includes(query);

        }
      );

  }


  /* Sort */

  const sortOrder =
    challengeSort?.value ||
    "latest";


  filtered.sort(
    (a, b) => {

      const dateA =
        new Date(
          a.date || 0
        );

      const dateB =
        new Date(
          b.date || 0
        );


      if (
        sortOrder ===
        "oldest"
      ) {

        return dateA - dateB;

      }


      return dateB - dateA;

    }
  );


  return filtered;

}


/* ===============================
   CHALLENGE MEDIA

   PRIORITY:
   1. YouTube
   2. Thumbnail
   3. Nothing
================================ */

function getChallengeMedia(challenge) {

  /* ===============================
     PRIORITY 1 — YOUTUBE
  ================================ */

  const embed =
    getYouTubeEmbed(
      challenge.youtube
    );


  if (embed) {

    return `

      <div class="video-wrapper">

        <iframe
          src="${embed}"
          title="${challenge.title || "Challenge"} video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>

      </div>

    `;

  }


  /* ===============================
     PRIORITY 2 — THUMBNAIL
  ================================ */

  if (
    challenge.thumbnail
  ) {

    return `

      <div class="challenge-media">

        <img
          src="${challenge.thumbnail}"
          alt="${challenge.title || "Challenge"}"
          class="challenge-thumbnail"
          loading="lazy"
        />

      </div>

    `;

  }


  /* No media */

  return "";

}


/* ===============================
   RENDER CHALLENGES
================================ */

function renderChallenges() {

  if (!challengeList) {
    return;
  }


  challengeList.innerHTML = "";


  const filtered =
    getFilteredChallenges();


  /* Nothing found */

  if (
    filtered.length === 0
  ) {

    challengeList.innerHTML = `
      <p>
        No challenges found.
      </p>
    `;

    return;

  }


  /* ===============================
     BUILD CARDS
  ================================ */

  filtered.forEach(
    challenge => {

      const card =
        document.createElement(
          "article"
        );


      card.className =
        "card challenge-card";


      const media =
        getChallengeMedia(
          challenge
        );


      card.innerHTML = `

        ${media}


        <h3>
          ${challenge.title || "Untitled Challenge"}
        </h3>


        <p class="video-meta">

          ${
            challenge.date
              ? formatDate(
                  challenge.date
                )
              : ""
          }


          ${
            challenge.difficulty
              ? `
                •
                ${challenge.difficulty}
              `
              : ""
          }


          ${
            challenge.status
              ? `
                •
                ${challenge.status}
              `
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


        ${
          challenge.description
            ? `

              <p>
                ${challenge.description}
              </p>

            `
            : ""
        }


        <button
          class="btn btn-outline challenge-read-more"
          type="button"
        >
          Read More
        </button>


        <div
          class="markdown-body challenge-body"
          hidden
        >

          ${
            challenge.body
              ? marked.parse(
                  challenge.body
                )
              : `
                <p>
                  No write-up has been
                  added yet.
                </p>
              `
          }


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


      /* ===============================
         READ MORE BUTTON
      ================================ */

      const button =
        card.querySelector(
          ".challenge-read-more"
        );


      const body =
        card.querySelector(
          ".challenge-body"
        );


      button.addEventListener(
        "click",
        () => {

          const isClosed =
            body.hasAttribute(
              "hidden"
            );


          if (isClosed) {

            body.removeAttribute(
              "hidden"
            );

            button.textContent =
              "Close ↑";

          }

          else {

            body.setAttribute(
              "hidden",
              ""
            );

            button.textContent =
              "Read More";

          }

        }
      );


      challengeList.appendChild(
        card
      );

    }
  );

}


/* ===============================
   LOAD CHALLENGES
================================ */

async function loadChallenges() {

  if (!challengeList) {

    console.error(
      "Challenge list element not found."
    );

    return;

  }


  challengeList.innerHTML = `
    <p>
      Loading challenges...
    </p>
  `;


  try {

    /* ===============================
       GET FILE LIST
    ================================ */

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


    /* ===============================
       MARKDOWN FILES ONLY
    ================================ */

    const markdownFiles =
      files.filter(
        file =>
          file.type === "file" &&
          file.name
            .toLowerCase()
            .endsWith(".md")
      );


    /* ===============================
       LOAD EACH MARKDOWN FILE
    ================================ */

    challenges =
      await Promise.all(

        markdownFiles.map(
          async file => {

            const fileResponse =
              await fetch(
                file.download_url
              );


            if (
              !fileResponse.ok
            ) {

              throw new Error(
                `Could not load ${file.name}`
              );

            }


            const text =
              await fileResponse.text();


            /* ===============================
               SPLIT FRONTMATTER
            ================================ */

            const parts =
              text.split("---");


            const frontmatter =
              parts[1] || "";


            const body =
              parts
                .slice(2)
                .join("---")
                .trim();


            /* ===============================
               CHALLENGE DATA
            ================================ */

            return {

              title:
                getFrontmatterValue(
                  frontmatter,
                  "title"
                ),


              date:
                getFrontmatterValue(
                  frontmatter,
                  "date"
                ),


              status:
                getFrontmatterValue(
                  frontmatter,
                  "status"
                ),


              difficulty:
                getFrontmatterValue(
                  frontmatter,
                  "difficulty"
                ),


              technology:
                getFrontmatterValue(
                  frontmatter,
                  "technology"
                ),


              thumbnail:
                getFrontmatterValue(
                  frontmatter,
                  "thumbnail"
                ),


              github:
                getFrontmatterValue(
                  frontmatter,
                  "github"
                ),


              demo:
                getFrontmatterValue(
                  frontmatter,
                  "demo"
                ),


              youtube:
                getFrontmatterValue(
                  frontmatter,
                  "youtube"
                ),


              description:
                getFrontmatterValue(
                  frontmatter,
                  "description"
                ),


              whatILearned:
                getFrontmatterValue(
                  frontmatter,
                  "what_i_learned"
                ),


              visibility:
                getFrontmatterValue(
                  frontmatter,
                  "visibility"
                ) ||
                "public",


              body

            };

          }
        )

      );


    /* ===============================
       REMOVE PRIVATE CHALLENGES
    ================================ */

    challenges =
      challenges.filter(
        challenge =>

          challenge.visibility
            .toLowerCase() !==
          "private"

      );


    /* ===============================
       BUILD PAGE
    ================================ */

    buildDifficulties();

    renderChallenges();

  }


  catch (error) {

    console.error(
      "Failed to load challenges:",
      error
    );


    challengeList.innerHTML = `

      <p>
        Could not load challenges.
      </p>

    `;

  }

}


/* ===============================
   DIFFICULTY EVENT
================================ */

difficultySelect
  ?.addEventListener(
    "change",
    event => {

      activeDifficulty =
        event.target.value;


      renderChallenges();

    }
  );


/* ===============================
   SORT EVENT
================================ */

challengeSort
  ?.addEventListener(
    "change",
    () => {

      renderChallenges();

    }
  );


/* ===============================
   SEARCH EVENT
================================ */

searchInput
  ?.addEventListener(
    "input",
    event => {

      searchQuery =
        event.target.value;


      renderChallenges();

    }
  );


/* ===============================
   START
================================ */

loadChallenges();