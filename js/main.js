document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("header-placeholder");
  
  if (!placeholder) {
    console.error("Error: Could not find #header-placeholder in your HTML.");
    return;
  }

  fetch("header.html")
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return response.text();
    })
    .then((data) => {
      placeholder.innerHTML = data;
    })
    .catch((err) => {
      alert("Header failed to load! Check Console (F12). Error: " + err.message);
      console.error("Detailed error:", err);
    });
});