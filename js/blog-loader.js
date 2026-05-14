async function loadBlogPosts() {
    const container = document.getElementById("blog-posts");

    const posts = ["first-post"];

    for (const slug of posts) {
        const response = await fetch(`content/blog/${slug}.md`);
        const text = await response.text();

        const match = text.match(/---([\s\S]*?)---([\s\S]*)/);
        if (!match) continue;

        const frontmatter = match[1];
        const body = match[2];

        const title = frontmatter.match(/title:\s*"(.*)"/)?.[1] || "Untitled";
        const date = frontmatter.match(/date:\s*(.*)/)?.[1] || "";

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
    }
}

loadBlogPosts();