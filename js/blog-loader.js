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

      const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+?)["']?(?=\sdate:|\stags:|$)/);
      const dateMatch = frontmatter.match(/date:\s*([^\s]+.*?)?(?=\stags:|$)/);

      const title = titleMatch ? titleMatch[1].trim() : "Untitled";
      const date = dateMatch ? dateMatch[1].trim() : "";

      const article = document.createElement("article");
      article.classList.add("video-card");

      article.innerHTML = `
        <div class="video-card-content">
          <p class="video-category">Blog</p>
          <h3>${title}</h3>
          <p class="video-meta">${date}</p>
          <div class="blog-body">
            ${marked.parse(body)}
          </div>
        </div>
      `;

      container.appendChild(article);

    } catch (error) {
      console.error(`Error loading ${slug}:`, error);
    }
  }
}

loadBlogPosts();