const videoGrid = document.getElementById("video-grid");
const videoSort = document.getElementById("video-sort");

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function renderVideos(order = "latest") {
  if (!videoGrid || !Array.isArray(videos)) return;

  videoGrid.innerHTML = "";

  const sortedVideos = [...videos].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (order === "oldest") {
      return dateA - dateB;
    }

    return dateB - dateA;
  });

  sortedVideos.forEach((video) => {
    const card = document.createElement("article");
    card.className = "card";

    card.innerHTML = `
      <div class="video-wrapper">
        <iframe
          src="${video.embedUrl}"
          title="${video.title}"
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
      </div>
      <h2>${video.title}</h2>
      <p class="video-date">${formatDate(video.date)}</p>
      <p>${video.description}</p>
    `;

    videoGrid.appendChild(card);
  });
}

if (videoSort) {
  videoSort.addEventListener("change", function () {
    renderVideos(this.value);
  });
}

renderVideos("latest");