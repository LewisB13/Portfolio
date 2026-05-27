const BLOG_FOLDER_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/blog";

const blogSort = document.getElementById("blog-sort");
const container = document.getElementById("blog-posts");

let posts = [];

function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter
      .match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]
      ?.replace(/^["']|["']$/g, "")
      .trim() || ""
  );
}

function getPostTimestamp(dateString) {
  if (!dateString) return 0;

  const cleanDate = dateString
    .replace(/^["']|["']$/g, "")
    .trim();

  const timestamp = Date.parse(cleanDate);

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function formatDate(dateString) {
  if (!dateString) return "";

  const timestamp = getPostTimestamp(dateString);

  if (!timestamp) return dateString;

  return new Date(timestamp).toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function renderPosts() {
  const sortOrder = blogSort ? blogSort.value : "latest";

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = getPostTimestamp(a.date);
    const dateB = getPostTimestamp(b.date);

    return sortOrder === "oldest"
      ? dateA - dateB
      : dateB - dateA;
  });

  container.innerHTML = "";

  if (sortedPosts.length === 0) {
    container.innerHTML = "<p>No blog posts found.</p>";
    return;
  }

  sortedPosts.forEach((post) => {
    const preview = marked
      .parse(post.body || "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 180);

    const article = document.createElement("article");
    article.className = "card blog-card";

    article.innerHTML = `
      <p class="video-category">Blog</p>

      <h3>${post.title}</h3>

      <p class="blog-date">${formatDate(post.date)}</p>

      <p>${preview}${preview.length >= 180 ? "..." : ""}</p>

      <a class="read-more" href="post.html?post=${post.slug}">
        Read post →
      </a>
    `;

    container.appendChild(article);
  });
}

async function loadBlogPosts() {
  container.innerHTML = "<p>Loading posts...</p>";

  try {
    const fileResponse = await fetch(BLOG_FOLDER_API);

    if (!fileResponse.ok) {
      throw new Error("Could not fetch blog folder");
    }

    const files = await fileResponse.json();
    const markdownFiles = files.filter((file) => file.name.endsWith(".md"));

    posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const response = await fetch(file.download_url);
        const text = await response.text();

        const parts = text.split("---");
        const frontmatter = parts[1] || "";
        const body = parts.slice(2).join("---").trim();

        return {
          slug: file.name.replace(".md", ""),
          title: getFrontmatterValue(frontmatter, "title") || "Untitled",
          date: getFrontmatterValue(frontmatter, "date"),
          body
        };
      })
    );

    renderPosts();
  } catch (error) {
    console.error(error);
    container.innerHTML = `<p>Could not load posts: ${error.message}</p>`;
  }
}

if (blogSort) {
  blogSort.addEventListener("change", renderPosts);
}

loadBlogPosts();