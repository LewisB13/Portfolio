async function loadPost() {
  const container = document.getElementById("post-content");
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("post");

  if (!slug) {
    container.innerHTML = "<p>Post not found.</p>";
    return;
  }

  const response = await fetch(`content/blog/${slug}.md`);

  if (!response.ok) {
    container.innerHTML = "<p>Post not found.</p>";
    return;
  }

  const text = await response.text();
  const parts = text.split("---");

  if (parts.length < 3) {
    container.innerHTML = "<p>Post could not be loaded.</p>";
    return;
  }

  const frontmatter = parts[1];
  const body = parts.slice(2).join("---").trim();

  const title =
    frontmatter.match(/title:\s*(.*)/)?.[1]?.replaceAll('"', "").trim() ||
    "Untitled";

  const date =
    frontmatter.match(/date:\s*(.*)/)?.[1]?.trim() || "";

  container.innerHTML = `
    <a href="blog.html" class="read-more">← Back to Blog</a>
    <p class="video-category">Blog</p>
    <h1>${title}</h1>
    <p class="video-meta">${date}</p>
    <div class="blog-body">
      ${marked.parse(body)}
    </div>
  `;
}

loadPost();