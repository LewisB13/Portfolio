async function loadBlogPosts() {
  const container = document.getElementById("blog-posts");

  const posts = [
    "first-post",
    "building-my-portfolio-website"
  ];

  container.innerHTML = "";

  for (const slug of posts) {
    try {
      const response = await fetch(`content/blog/${slug}.md`);

      if (!response.ok) {
        console.error(`Could not load: ${slug}.md`);
        continue;
      }

      const text = await response.text();
      const parts = text.split("---");

      if (parts.length < 3) {
        console.error(`Bad frontmatter in: ${slug}.md`);
        continue;
      }

      const frontmatter = parts[1];
      const body = parts.slice(2).join("---").trim();

      const title =
        frontmatter.match(/title:\s*(.*)/)?.[1]?.replaceAll('"', "").trim() ||
        "Untitled";

      const date =
        frontmatter.match(/date:\s*(.*)/)?.[1]?.trim() || "";

      const preview = marked
        .parse(body)
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 180);

      const article = document.createElement("article");
      article.classList.add("card", "blog-card");

      article.innerHTML = `
        <p class="video-category">Blog</p>
        <h3>${title}</h3>
        <p class="video-meta">${date}</p>
        <p>${preview}...</p>
        <a class="read-more" href="post.html?post=${slug}">Read post →</a>
      `;

      container.appendChild(article);
    } catch (error) {
      console.error(`Error loading ${slug}:`, error);
    }
  }
}

loadBlogPosts();