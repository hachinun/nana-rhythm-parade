function initializeButtonState(button) {
  // 最初の状態を適切に設定
  const videoElement = button.closest(".video");
  
  if (videoElement) {
    let isFavorite = videoElement.getAttribute("data-favorite") === "true";
  
    if (isFavorite) {
      console.log(`❤️ videoId: ${button.dataset.videoId} はすでにお気に入り`);
      button.textContent = "❤️ お気に入り解除";
      button.classList.remove("favorite-btn");
      button.classList.add("unfavorite-btn");
    } else {
      console.log(`♡ videoId: ${button.dataset.videoId} はお気に入りではありません`);
      button.textContent = "♡ お気に入り";
      button.classList.remove("unfavorite-btn");
      button.classList.add("favorite-btn");
    }
  } else {
    console.error("⚠️ .video 要素が見つかりません");
  }
}
