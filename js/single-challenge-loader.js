/* ===============================
   GET PROJECT SLUG
================================ */

function getChallengeSlug() {
  return new URLSearchParams(
    window.location.search
  ).get("project");
}


/* ===============================
   FRONTMATTER
================================ */

function getFrontmatterValue(
  frontmatter,
  key
) {
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


/* ===============================
   DATE
================================ */

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  return new Date(
    dateString
  ).toLocaleDateString(
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

function getYouTubeEmbedUrl(url) {
  if (!url) {
    return "";
  }


  try {
    const parsedUrl =
      new URL(url);


    /*
      Normal YouTube URL
    */
    if (
      parsedUrl.hostname ===
        "youtube.com" ||

      parsedUrl.hostname ===
        "www.youtube.com"
    ) {

      const videoId =
        parsedUrl.searchParams.get("v");


      if (videoId) {
        return (
          "https://www.youtube.com/embed/" +
          videoId
        );
      }


      /*
        YouTube Shorts
      */
      if (
        parsedUrl.pathname.startsWith(
          "/shorts/"
        )
      ) {

        const shortId =
          parsedUrl.pathname
            .split("/shorts/")[1]
            .split("/")[0];


        return (
          "https://www.youtube.com/embed/" +
          shortId
        );
      }


      /*
        Already embedded
      */
      if (
        parsedUrl.pathname.startsWith(
          "/embed/"
        )
      ) {
        return url;
      }
    }


    /*
      youtu.be URL
    */
    if (
      parsedUrl.hostname ===
      "youtu.be"
    ) {

      const videoId =
        parsedUrl.pathname
          .slice(1)
          .split("/")[0];


      return (
        "https://www.youtube.com/embed/" +
        videoId
      );
    }

  } catch (error) {

    console.error(
      "Invalid YouTube URL:",
      error
    );
  }


  return "";
}


/* ===============================
   LOAD SINGLE PROJECT
================================ */

async function loadSingleChallengeProject() {

  const slug =
    getChallengeSlug();


  const container =
    document.getElementById(
      "challenge-project-content"
    );


  if (!container) {
    return;
  }


  /*
    No project supplied
  */
  if (!slug) {

    container.innerHTML = `

      <a
        class="read-more"
        href="challenge-projects.html"
      >
        ← Back to Challenges
      </a>

      <p>
        No challenge project selected.
      </p>

    `;

    return;
  }


  const url =
    `https://raw.githubusercontent.com/LewisB13/Portfolio/main/content/challenge/${encodeURIComponent(slug)}.md`;


  try {

    const response =
      await fetch(url);


    if (!response.ok) {
      throw new Error(
        `Failed to load project: ${response.status}`
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


    /* ===============================
       PROJECT DATA
    ================================ */

    const title =
      getFrontmatterValue(
        frontmatter,
        "title"
      ) || "Untitled Project";


    const projectNumber =
      getFrontmatterValue(
        frontmatter,
        "project_number"
      );


    const date =
      getFrontmatterValue(
        frontmatter,
        "date"
      );


    const status =
      getFrontmatterValue(
        frontmatter,
        "status"
      );


    const difficulty =
      getFrontmatterValue(
        frontmatter,
        "difficulty"
      );


    const technology =
      getFrontmatterValue(
        frontmatter,
        "technology"
      );


    const github =
      getFrontmatterValue(
        frontmatter,
        "github"
      );


    const demo =
      getFrontmatterValue(
        frontmatter,
        "demo"
      );


    const youtube =
      getFrontmatterValue(
        frontmatter,
        "youtube"
      );


    const whatILearned =
      getFrontmatterValue(
        frontmatter,
        "what_i_learned"
      );


    const youtubeEmbed =
      getYouTubeEmbedUrl(
        youtube
      );


    document.title =
      `${title} | 100 Project Challenge`;


    /* ===============================
       PAGE
    ================================ */

    container.innerHTML = `

      <a
        class="read-more"
        href="challenge-projects.html"
      >
        ← Back to Challenges
      </a>


      <p class="blog-date">

        ${
          projectNumber
            ? `Project #${projectNumber}`
            : "Challenge Project"
        }

        ${
          date
            ? ` • ${formatDate(date)}`
            : ""
        }

      </p>


      <h1>
        ${title}
      </h1>


      <div class="challenge-project-meta">

        ${
          status
            ? `
              <span class="challenge-status">
                ${status}
              </span>
            `
            : ""
        }


        ${
          difficulty
            ? `
              <span class="video-category">
                ${difficulty}
              </span>
            `
            : ""
        }


        ${
          technology
            ? `
              <span class="video-category">
                ${technology}
              </span>
            `
            : ""
        }

      </div>


      ${
        github || demo
          ? `

            <div class="note-actions">

              ${
                github
                  ? `
                    <a
                      class="read-more"
                      href="${github}"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub ↗
                    </a>
                  `
                  : ""
              }


              ${
                demo
                  ? `
                    <a
                      class="read-more"
                      href="${demo}"
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


      <div class="markdown-body">

        ${
          body
            ? marked.parse(body)
            : "<p>No project write-up has been added yet.</p>"
        }

      </div>


      ${
        whatILearned
          ? `

            <section class="project-learning-card">

              <h2>
                What I Learned
              </h2>

              <div class="markdown-body">

                ${marked.parse(whatILearned)}

              </div>

            </section>

          `
          : ""
      }


      ${
        youtubeEmbed
          ? `

            <section class="project-demo-card">

              <h2>
                Project Demo
              </h2>


              <div class="project-video">

                <iframe
                  src="${youtubeEmbed}"
                  title="${title} Project Demo"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                ></iframe>

              </div>

            </section>

          `
          : ""
      }

    `;


  } catch (error) {

    console.error(
      "Failed to load challenge project:",
      error
    );


    container.innerHTML = `

      <a
        class="read-more"
        href="challenge-projects.html"
      >
        ← Back to Challenges
      </a>

      <p>
        Could not load this project.
      </p>

    `;
  }
}


/* ===============================
   START
================================ */

loadSingleChallengeProject();