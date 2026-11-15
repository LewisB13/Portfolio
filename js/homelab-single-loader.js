
/* =========================================
   HOMELAB SINGLE PROJECT LOADER
   Sveltia CMS / GitHub Markdown
========================================= */

const homelabContent =
  document.getElementById("homelab-content");

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

/* =========================================
   FRONTMATTER PARSER
========================================= */

function getFrontmatterValue(frontmatter, key) {
  const lines = frontmatter.split(/\r?\n/);

  const index = lines.findIndex(line =>
    line.startsWith(key + ":")
  );

  if (index === -1) return "";

  const value = lines[index]
    .slice(key.length + 1)
    .trim();

  // Support YAML multiline block values
  if (value === "|" || value === ">" ||
      value === "|-" || value === ">-") {
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

function parseMarkdownFile(text) {
  const match = text.match(
    /^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/
  );

  return {
    frontmatter: match ? match[1] : "",
    body: match ? text.slice(match[0].length) : text
  };
}

/* =========================================
   FORMAT DATE
========================================= */

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

/* =========================================
   SAFE EXTERNAL LINKS
========================================= */

function createExternalLink(label, url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    const link = document.createElement("a");

    link.className = "read-more";
    link.href = parsed.href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = label;

    return link;
  } catch {
    return null;
  }
}

/* =========================================
   YOUTUBE EMBED
========================================= */

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
   MARKDOWN RENDERER
========================================= */

function renderMarkdown(element, markdown) {
  if (
    typeof marked !== "undefined" &&
    typeof DOMPurify !== "undefined"
  ) {
    element.innerHTML = DOMPurify.sanitize(
      marked.parse(markdown || "")
    );
  } else {
    element.textContent = markdown || "";
  }
}

/* =========================================
   LOAD SINGLE HOMELAB PROJECT
========================================= */

async function loadSingleHomelab() {
  if (!homelabContent) {
    console.error(
      "Missing #homelab-content element."
    );
    return;
  }

  /* VALIDATE SLUG

     Supports:
     - Letters and numbers
     - Hyphens and underscores
     - Unicode characters such as –
     - Spaces

     Rejects path separators and traversal.
  */

  if (
    !slug ||
    slug === "." ||
    slug === ".." ||
    slug.includes("/") ||
    slug.includes("\\") ||
    /[\u0000-\u001F\u007F]/.test(slug)
  ) {
    homelabContent.textContent =
      "Invalid homelab project URL.";
    return;
  }

  homelabContent.textContent =
    "Loading homelab project...";

  try {
    /* GITHUB MARKDOWN URL */

    const url =
      "https://raw.githubusercontent.com/lewisb13/Portfolio/main/content/homelab/" +
      encodeURIComponent(slug) +
      ".md";

    console.log("Loading Homelab:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Could not fetch project (${response.status})`
      );
    }

    const text = await response.text();

    const { frontmatter, body } =
      parseMarkdownFile(text);

    /* PROJECT DATA */

    const project = {
      title: getFrontmatterValue(
        frontmatter, "title"
      ),
      date: getFrontmatterValue(
        frontmatter, "date"
      ),
      category: getFrontmatterValue(
        frontmatter, "category"
      ),
      status: getFrontmatterValue(
        frontmatter, "status"
      ),
      description: getFrontmatterValue(
        frontmatter, "description"
      ),
      github: getFrontmatterValue(
        frontmatter, "github"
      ),
      demo: getFrontmatterValue(
        frontmatter, "demo"
      ),
      youtube: getFrontmatterValue(
        frontmatter, "youtube"
      ),
      visibility: getFrontmatterValue(
        frontmatter, "visibility"
      ),
      whatILearned: getFrontmatterValue(
        frontmatter, "what_i_learned"
      ),
      body
    };

    /* HIDE PRIVATE ENTRIES */

    if (
      project.visibility.toLowerCase() === "private"
    ) {
      homelabContent.textContent =
        "This homelab project is not publicly available.";
      return;
    }

    /* CLEAR LOADING MESSAGE */

    homelabContent.innerHTML = "";

    /* BACK LINK */

    const backLink = document.createElement("a");
    backLink.href = "homelab.html";
    backLink.textContent = "← Back to Homelab";

    homelabContent.appendChild(backLink);

    /* TITLE */

    const heading = document.createElement("h1");

    heading.textContent =
      project.title || "Untitled Homelab Project";

    homelabContent.appendChild(heading);

    /* DATE / CATEGORY / STATUS */

    const meta = document.createElement("p");
    meta.className = "video-meta";

    meta.textContent = [
      formatDate(project.date),
      project.category,
      project.status
    ]
      .filter(Boolean)
      .join(" • ");

    homelabContent.appendChild(meta);

    /* DESCRIPTION */

    if (project.description) {
      const description = document.createElement("p");

      description.textContent =
        project.description;

      homelabContent.appendChild(description);
    }

    /* GITHUB / LIVE DEMO LINKS */

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const githubLink = createExternalLink(
      "GitHub ↗",
      project.github
    );

    const demoLink = createExternalLink(
      "Live Demo ↗",
      project.demo
    );

    if (githubLink) {
      actions.appendChild(githubLink);
    }

    if (demoLink) {
      actions.appendChild(demoLink);
    }

    if (actions.children.length) {
      homelabContent.appendChild(actions);
    }

    /* MAIN MARKDOWN CONTENT */

    if (project.body.trim()) {
      const article = document.createElement("div");
      article.className = "markdown-body";

      renderMarkdown(article, project.body);

      homelabContent.appendChild(article);
    }

    /* WHAT I LEARNED */

    if (project.whatILearned.trim()) {
      const section = document.createElement("section");
      section.className = "markdown-body";

      const title = document.createElement("h2");
      title.textContent = "What I Learned";

      const content = document.createElement("div");

      renderMarkdown(
        content,
        project.whatILearned
      );

      section.append(title, content);

      homelabContent.appendChild(section);
    }

    /* YOUTUBE VIDEO */

    const embed = getYouTubeEmbed(project.youtube);

    if (embed) {
      const section = document.createElement("section");

      const title = document.createElement("h2");
      title.textContent = "Video Demo";

      const wrapper = document.createElement("div");
      wrapper.className = "video-wrapper";

      const iframe = document.createElement("iframe");

      iframe.src = embed;
      iframe.title =
        "Homelab video demonstration";

      iframe.loading = "lazy";
      iframe.allowFullscreen = true;

      iframe.setAttribute(
        "allow",
        "accelerometer; autoplay; clipboard-write; " +
        "encrypted-media; gyroscope; picture-in-picture"
      );

      wrapper.appendChild(iframe);
      section.append(title, wrapper);

      homelabContent.appendChild(section);
    }

    /* UPDATE BROWSER PAGE TITLE */

    document.title =
      `${project.title || "Homelab"} | Lewis Barrett Portfolio`;

  } catch (error) {
    console.error(
      "Homelab single loader error:",
      error
    );

    homelabContent.innerHTML = "";

    const message = document.createElement("p");
    message.textContent =
      "Could not load this homelab project. " +
      "Check that its Markdown file exists on GitHub.";

    const backLink = document.createElement("a");
    backLink.href = "homelab.html";
    backLink.textContent = "← Back to Homelab";

    homelabContent.append(message, backLink);
  }
}

/* =========================================
   INITIALISE
========================================= */

loadSingleHomelab();
