const CHALLENGE_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/challenge";

const challengeList = document.getElementById("challenge-list");
const challengeSearch = document.getElementById("challenge-search");
const challengeStatus = document.getElementById("challenge-status");

const progressText = document.getElementById("challenge-progress-text");
const progressBar = document.getElementById("challenge-progress-bar");

let challengeProjects = [];
let searchQuery = "";
let activeStatus = "All";


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


function updateProgress() {
  const completed = challengeProjects.filter(
    project => project.status === "Completed"
  ).length;

  const percentage = Math.min((completed / 100) * 100, 100);

  progressText.textContent =
    `${completed} of 100 projects completed`;

  progressBar.style.width = `${percentage}%`;
}


function renderChallengeProjects() {
  challengeList.innerHTML = "";

  let filtered = [...challengeProjects];

  if (activeStatus !== "All") {
    filtered = filtered.filter(
      project => project.status === activeStatus
    );
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();

    filtered = filtered.filter(project =>
      (project.title || "").toLowerCase().includes(q) ||
      (project.description || "").toLowerCase().includes(q) ||
      (project.technology || "").toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => {
    return Number(a.projectNumber) - Number(b.projectNumber);
  });


  if (filtered.length === 0) {
    challengeList.innerHTML =
      "<p>No challenge projects found.</p>";

    return;
  }


  filtered.forEach(project => {
    const card = document.createElement("article");

    card.className = "card blog-card challenge-card";


    const preview =
      project.description ||
      marked
        .parse(project.body || "")
        .replace(/<[^>]*>/g, "")
        .slice(0, 180);


    card.innerHTML = `

      <div class="challenge-card-top">

        <span class="challenge-number">
          #${project.projectNumber}
        </span>

        <span class="challenge-status challenge-status-${project.status
          .toLowerCase()
          .replaceAll(" ", "-")}">
          ${project.status}
        </span>

      </div>


      <h3 class="note-title">

        <a href="challenge-project.html?project=${project.slug}">
          ${project.title}
        </a>

      </h3>


      ${
        project.technology
          ? `<p class="video-category">${project.technology}</p>`
          : ""
      }


      ${
        project.date
          ? `<p class="blog-date">${formatDate(project.date)}</p>`
          : ""
      }


      <p class="note-preview">
        ${preview}${preview.length >= 180 ? "..." : ""}
      </p>


      <a
        class="read-more"
        href="challenge-project.html?project=${project.slug}">
        View Project →
      </a>

    `;

    challengeList.appendChild(card);
  });
}


async function loadChallengeProjects() {
  challengeList.innerHTML =
    "<p>Loading challenge projects...</p>";

  try {

    const response = await fetch(CHALLENGE_API);

    if (!response.ok) {
      throw new Error(
        `GitHub request failed: ${response.status}`
      );
    }

    const files = await response.json();

    const markdownFiles =
      files.filter(file => file.name.endsWith(".md"));


    challengeProjects = await Promise.all(

      markdownFiles.map(async file => {

        const response = await fetch(file.download_url);

        const text = await response.text();

        const parts = text.split("---");

        const frontmatter = parts[1] || "";
        const body = parts.slice(2).join("---").trim();


        return {
          slug: file.name.replace(".md", ""),

          projectNumber:
            getFrontmatterValue(
              frontmatter,
              "project_number"
            ),

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
            ) || "Planned",

          technology:
            getFrontmatterValue(
              frontmatter,
              "technology"
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

          body
        };

      })
    );


    updateProgress();
    renderChallengeProjects();

  } catch (error) {

    console.error(
      "Failed to load challenge projects:",
      error
    );

    challengeList.innerHTML = `
      <p>
        No challenge projects have been added yet.
      </p>
    `;

    progressText.textContent =
      "0 of 100 projects completed";

  }
}


if (challengeSearch) {

  challengeSearch.addEventListener(
    "input",
    event => {

      searchQuery = event.target.value;

      renderChallengeProjects();

    }
  );

}


if (challengeStatus) {

  challengeStatus.addEventListener(
    "change",
    event => {

      activeStatus = event.target.value;

      renderChallengeProjects();

    }
  );

}


loadChallengeProjects();