document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded イベントが発火しました");

  function setupFavoriteButtons() {
    console.log("setupFavoriteButtons が実行されました");

    const buttons = document.querySelectorAll(".favorite-button button");

    if (buttons.length === 0) {
      console.warn("⚠️ お気に入りボタンが見つかりません");
    } else {
      console.log(`✅ ${buttons.length} 個のボタンが見つかりました`);
    }

    buttons.forEach(button => {
      let videoElement = button.closest(".video");
      let videoId = videoElement.getAttribute("data-video-id"); // 外部動画のIDを取得
      let databaseVideoId = videoElement.getAttribute("data-database-video-id"); // DB側のID
      let isFavorite = videoElement.getAttribute("data-favorite");

      console.log(`🔍 リロード時: videoId=${videoId}, data-favorite=${isFavorite}`);

      if (!button.hasAttribute("data-listener")) {
        console.log(`🟢 ボタン(${databaseVideoId}) にイベントを設定`); // DBのIDを使用
        button.addEventListener("click", favoriteButtonClickHandler);
        button.setAttribute("data-listener", "true");
      } else {
        console.log(`🔴 ボタン(${databaseVideoId}) はすでにイベントが設定されています`); // DBのIDを使用
      }

      initializeButtonState(button, databaseVideoId); // ⭐️ ボタンの状態をリロード時に反映
    });
  }

  function initializeButtonState(button, databaseVideoId) {
    let videoElement = button.closest(".video");
    let isFavorite = videoElement.getAttribute("data-favorite") === "true";

    console.log(`🎯 ボタン初期化: videoId=${databaseVideoId}, isFavorite=${isFavorite}`);

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

  function favoriteButtonClickHandler(event) {
    console.log("🎯 お気に入りボタンがクリックされました");

    event.preventDefault();
    let databaseVideoId = this.dataset.videoId; // DB側のIDを使用
    console.log(`📌 databaseVideoId: ${databaseVideoId}`);

    let url = `/videos/${databaseVideoId}/favorites/toggle`;

    fetch(url, {
      method: 'POST',
      headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content }
    })
    .then(response => response.json())
    .then(data => {
      console.log("📨 APIからのレスポンス:", data);

      let videoElement = this.closest(".video");
      if (data.status === "added") {
        console.log(`❤️ databaseVideoId: ${databaseVideoId} をお気に入りに追加`);
        this.textContent = "❤️ お気に入り解除";
        this.classList.remove("favorite-btn");
        this.classList.add("unfavorite-btn");
        videoElement.setAttribute("data-favorite", "true");
      } else {
        console.log(`💔 databaseVideoId: ${databaseVideoId} をお気に入り解除`);
        this.textContent = "♡ お気に入り";
        this.classList.remove("unfavorite-btn");
        this.classList.add("favorite-btn");
        videoElement.setAttribute("data-favorite", "false");
      }
    })
    .catch(error => {
      console.error("🚨 エラーが発生しました:", error);
    });
  }

  setupFavoriteButtons(); // 初回適用
});
