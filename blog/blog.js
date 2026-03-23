const blogView = document.getElementById("blog-view");
const blogSort = document.getElementById("blog-sort");

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function getSortedPosts() {
  const posts = [...blogPosts];

  if (blogSort.value === "oldest") {
    posts.sort((a, b) => new Date(a.date) - new Date(b.date));
  } else {
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  return posts;
}

function renderBlogList() {
  const posts = getSortedPosts();

  blogView.innerHTML = `
    <div class="blog-list">
      ${posts.map(post => `
        <article class="card blog-card">
          <p class="video-date">${formatDate(post.date)}</p>
          <h3>${post.title}</h3>
          <p>${post.excerpt}</p>
          <button class="read-more blog-button" data-id="${post.id}">
            Read more →
          </button>
        </article>
      `).join("")}
    </div>
  `;

  document.querySelectorAll(".blog-button").forEach(button => {
    button.addEventListener("click", () => {
      const postId = Number(button.dataset.id);
      renderSinglePost(postId);
    });
  });
}

function renderSinglePost(id) {
  const post = blogPosts.find(item => item.id === id);

  if (!post) {
    blogView.innerHTML = `
      <article class="post-page">
        <h1>Post not found</h1>
        <p>The blog post you are looking for does not exist.</p>
        <button class="read-more blog-button back-button" id="back-to-blog">
          ← Back to blog
        </button>
      </article>
    `;

    document.getElementById("back-to-blog").addEventListener("click", renderBlogList);
    return;
  }

  blogView.innerHTML = `
    <article class="post-page">
      <button class="read-more blog-button back-button" id="back-to-blog">
        ← Back to blog
      </button>
      <p class="video-date">${formatDate(post.date)}</p>
      <h1>${post.title}</h1>
      ${post.content.map(paragraph => `<p>${paragraph}</p>`).join("")}
    </article>
  `;

  document.getElementById("back-to-blog").addEventListener("click", renderBlogList);
}

blogSort.addEventListener("change", renderBlogList);

renderBlogList();