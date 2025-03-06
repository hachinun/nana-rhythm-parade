document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded イベントが発火しました");

  let showOnlyFavorites = false; // お気に入りフィルターの状態

  function setupFavoriteButtons() {
    console.log("setupFavoriteButtons が実行されました");

    const sessionId = document.getElementById("video-container").dataset.sessionId; // セッション ID 取得
    console.log(`🔑 セッションID: ${sessionId}`);

    const buttons = document.querySelectorAll(".favorite-button button");

    if (buttons.length === 0) {
      console.warn("⚠️ お気に入りボタンが見つかりません");
    } else {
      console.log(`✅ ${buttons.length} 個のボタンが見つかりました`);
    }

    buttons.forEach(button => {
      if (!button.hasAttribute("data-listener")) {
        console.log(`🟢 ボタン(${button.dataset.videoId}) にイベントを設定`);
        button.addEventListener("click", function (event) {
          event.preventDefault();
          toggleFavorite(button, sessionId);
        });
        button.setAttribute("data-listener", "true");
        initializeButtonState(button);
      } else {
        console.log(`🔴 ボタン(${button.dataset.videoId}) はすでにイベントが設定されています`);
      }
    });
  }

  function toggleFavorite(button, sessionId) {
    let videoId = button.dataset.videoId;
    console.log(`📌 videoId: ${videoId}`);

    let url = `/videos/${videoId}/favorites/toggle`;
    
    fetch(url, {
      method: 'POST',
      headers: { 
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ session_id: sessionId })
    })
    .then(response => response.json())
    .then(data => {
      console.log("📨 APIからのレスポンス:", data);
      let videoElement = button.closest(".video");

      if (data.status === "added") {
        console.log(`❤️ videoId: ${videoId} をお気に入りに追加`);
        button.textContent = "❤️ お気に入り解除";
        button.classList.remove("favorite-btn");
        button.classList.add("unfavorite-btn");
        videoElement.setAttribute("data-favorite", "true");
      } else {
        console.log(`💔 videoId: ${videoId} をお気に入り解除`);
        button.textContent = "♡ お気に入り";
        button.classList.remove("unfavorite-btn");
        button.classList.add("favorite-btn");
        videoElement.setAttribute("data-favorite", "false");
      }
    })
    .catch(error => {
      console.error("🚨 エラーが発生しました:", error);
    });
  }

  function initializeButtonState(button) {
    let videoElement = button.closest(".video");
    let isFavorite = videoElement.getAttribute("data-favorite") === "true";

    if (isFavorite) {
      button.textContent = "❤️ お気に入り解除";
      button.classList.remove("favorite-btn");
      button.classList.add("unfavorite-btn");
    } else {
      button.textContent = "♡ お気に入り";
      button.classList.remove("unfavorite-btn");
      button.classList.add("favorite-btn");
    }
  }

  setupFavoriteButtons();
});
