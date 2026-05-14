const BLOG_FOLDER_API =
  "https://api.github.com/repos/LewisB13/Portfolio/contents/content/blog";

function getFrontmatterValue(frontmatter, key) {
  return (
    frontmatter
      .match(new RegExp(`${key}:\\s*["']?(.*?)["']?$`, "m"))?.[1]
      ?.trim() || ""
  );
}

async function loadBlogPosts() {
  const container = document.getElementById("blog-posts");
  container.innerHTML = "<p>Loading posts...</p>";

  try {
    const fileResponse = await fetch(BLOG_FOLDER_API);
    const files = await fileResponse.json();

    const markdownFiles = files.filter((file) => file.name.endsWith(".md"));

    const posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const response = await fetch(file.download_url);
        const text = await response.text();

        const parts = text.split("---");
        const frontmatter = parts[1] || "";
        const body = parts.slice(2).join("---").trim();

        const slug = file.name.replace(".md", "");

        return {
          slug,
          title: getFrontmatterValue(frontmatter, "title") || "Untitled",
          date: getFrontmatterValue(frontmatter, "date"),
          body
        };
      })
    );

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    container.innerHTML = "";

    posts.forEach((post) => {
      const preview = marked
        .parse(post.body)
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180);

      const article = document.createElement("article");
      article.classList.add("card", "blog-card");

      article.innerHTML = `
        <p class="video-category">Blog</p>
        <h3>${post.title}</h3>
        <p class="video-meta">${post.date}</p>
        <p>${preview}...</p>
        <a class="read-more" href="post.html?post=${post.slug}">
          Read post →
        </a>
      `;

      container.appendChild(article);
    });
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p>Could not load posts.</p>";
  }
}

loadBlogPosts();