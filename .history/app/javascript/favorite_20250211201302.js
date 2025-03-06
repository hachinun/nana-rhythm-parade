document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll(".favorite-button button").forEach(button => {
      button.addEventListener("click", function() {
        let videoId = this.dataset.videoId;
        let isFavorite = this.classList.contains("unfavorite-btn");
  
        fetch("/favorites/toggle", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ video_id: videoId })
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === "added") {
            this.textContent = "❤️ お気に入り解除";
            this.classList.remove("favorite-btn");
            this.classList.add("unfavorite-btn");
          } else {
            this.textContent = "♡ お気に入り";
            this.classList.remove("unfavorite-btn");
            this.classList.add("favorite-btn");
          }
        });
      });
    });
  });
  