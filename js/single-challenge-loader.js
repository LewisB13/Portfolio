function getChallengeSlug() {
  return new URLSearchParams(
    window.location.search
  ).get("project");
}


function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter
      .match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]
      ?.trim() || ""
  );
}


function formatDate(dateString) {

  if (!dateString) {
    return "";
  }

  return new Date(dateString).toLocaleDateString(
    "en-IE",
    {
      day: "numeric",
      month: "long",
      year: "numeric"
    }
  );

}


function getYouTubeEmbedUrl(url) {

  if (!url) {
    return "";
  }

  try {

    const parsedUrl = new URL(url);


    if (
      parsedUrl.hostname === "youtube.com" ||
      parsedUrl.hostname === "www.youtube.com"
    ) {

      const videoId =
        parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }


      if (
        parsedUrl.pathname.startsWith("/shorts/")
      ) {

        const videoId =
          parsedUrl.pathname
            .split("/shorts/")[1]
            .split("/")[0];

        return `https://www.youtube.com/embed/${videoId}`;
      }


      if (
        parsedUrl.pathname.startsWith("/embed/")
      ) {
        return url;
      }

    }


    if (parsedUrl.hostname === "youtu.be") {

      const videoId =
        parsedUrl.pathname
          .slice(1)
          .split("/")[0];

      return `https://www.youtube.com/embed/${videoId}`;

    }

  } catch (error) {

    console.error(
      "Invalid YouTube URL:",
      error
    );

  }


  return "";

}


async function loadSingleChallengeProject() {

  const slug = getChallengeSlug();

  const container =
    document.getElementById(
      "challenge-project-content"
    );


  if (!container) {
    return;
  }


  if (!slug) {

    container.innerHTML = `
      <p>No challenge project selected.</p>
    `;

    return;

  }


  const url =
    `https://raw.githubusercontent.com/LewisB13/Portfolio/main/content/challenge/${slug}.md`;


  try {

    const response = await fetch(url);


    if (!response.ok) {

      throw new Error(
        `Failed to load project: ${response.status}`
      );

    }


    const text = await response.text();

    const parts = text.split("---");

    const frontmatter =
      parts[1] || "";

    const body =
      parts.slice(2).join("---").trim();


    const title =
      getFrontmatterValue(
        frontmatter,
        "title"
      );

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
      getYouTubeEmbedUrl(youtube);


    document.title =
      `${title} | 100 Project Challenge`;


    container.innerHTML = `

      <a
        class="read-more"
        href="100-project-challenge.html">
        ← Back to Challenge
      </a>


      <p class="blog-date">

        Project #${projectNumber}

        ${date ? ` • ${formatDate(date)}` : ""}

      </p>


      <h1>
        ${title}
      </h1>


      <div class="challenge-project-meta">

        ${
          status
            ? `<span class="challenge-status">
                 ${status}
               </span>`
            : ""
        }

        ${
          technology
            ? `<span class="video-category">
                 ${technology}
               </span>`
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
                      rel="noopener noreferrer">
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
                      rel="noopener noreferrer">
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

        ${marked.parse(body)}

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
                  allowfullscreen>
                </iframe>

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
        href="100-project-challenge.html">
        ← Back to Challenge
      </a>

      <p>
        Could not load this project.
      </p>

    `;

  }

}


loadSingleChallengeProject();