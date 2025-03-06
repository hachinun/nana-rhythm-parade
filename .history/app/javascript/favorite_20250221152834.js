document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded イベントが発火しました");

  // お気に入りボタンのセットアップ
  function setupFavoriteButtons() {
      console.log("setupFavoriteButtons が実行されました");

      const buttons = document.querySelectorAll(".favorite-button button");

      if (buttons.length === 0) {
          console.warn("⚠️ お気に入りボタンが見つかりません");
      } else {
          console.log(`✅ ${buttons.length} 個のボタンが見つかりました`);
      }

      buttons.forEach(button => {
          if (!button.hasAttribute("data-listener")) {
              console.log(`🟢 ボタン(${button.dataset.videoId}) にイベントを設定`);
              button.addEventListener("click", favoriteButtonClickHandler);
              button.setAttribute("data-listener", "true");
              initializeButtonState(button); // ボタンの初期状態を設定
          } else {
              console.log(`🔴 ボタン(${button.dataset.videoId}) はすでにイベントが設定されています`);
          }
      });
  }

  function initializeButtonState(button) {
      // localStorage からお気に入り状態を読み込む
      const videoId = button.dataset.videoId;
      const isFavorite = localStorage.getItem(videoId) === "true";

      console.log(`初期化状態: videoId: ${videoId}, お気に入り状態: ${isFavorite}`);

      if (isFavorite) {
          console.log(`❤️ videoId: ${videoId} はすでにお気に入り`);
          button.textContent = "❤️ お気に入り解除";
          button.classList.remove("favorite-btn");
          button.classList.add("unfavorite-btn");
      } else {
          console.log(`♡ videoId: ${videoId} はお気に入りではありません`);
          button.textContent = "♡ お気に入り";
          button.classList.remove("unfavorite-btn");
          button.classList.add("favorite-btn");
      }
  }

  function favoriteButtonClickHandler(event) {
      console.log("🎯 お気に入りボタンがクリックされました");

      event.preventDefault();
      const button = this;
      const videoId = button.dataset.videoId;
      console.log(`📌 videoId: ${videoId}`);

      // 現在の状態を取得
      const isFavorite = localStorage.getItem(videoId) === "true";
      console.log(`現在の状態: videoId: ${videoId}, お気に入り状態: ${isFavorite}`);

      // お気に入り状態をトグル
      const newFavoriteState = !isFavorite;
      console.log(`新しい状態: videoId: ${videoId}, 新しいお気に入り状態: ${newFavoriteState}`);

      // localStorage に状態を保存
      localStorage.setItem(videoId, newFavoriteState);

      // ボタンのテキストとクラスを更新
      if (newFavoriteState) {
          console.log(`❤️ videoId: ${videoId} をお気に入りに追加`);
          button.textContent = "❤️ お気に入り解除";
          button.classList.remove("favorite-btn");
          button.classList.add("unfavorite-btn");
      } else {
          console.log(`💔 videoId: ${videoId} をお気に入り解除`);
          button.textContent = "♡ お気に入り";
          button.classList.remove("unfavorite-btn");
          button.classList.add("favorite-btn");
      }
  }

  setupFavoriteButtons(); // 初回適用
});
