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

  // ボタンの初期状態をlocalStorageに基づいて設定
  function initializeButtonState(button) {
    const videoId = button.dataset.videoId;
    const isFavorite = localStorage.getItem(videoId) === "true"; // localStorageから状態を取得

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

  // お気に入りボタンがクリックされたときの処理
  function favoriteButtonClickHandler(event) {
    console.log("🎯 お気に入りボタンがクリックされました");

    event.preventDefault();
    const button = this;
    const videoId = button.dataset.videoId;
    console.log(`📌 videoId: ${videoId}`);

    // 現在の状態を取得
    const isFavorite = localStorage.getItem(videoId) === "true";

    // お気に入り状態をトグル
    const newFavoriteState = !isFavorite;

    // localStorageに状態を保存（文字列として保存）
    localStorage.setItem(videoId, newFavoriteState.toString());

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

  // localStorageの状態を元に動画の表示を更新
  function applyFavoriteStateToVideos() {
    document.querySelectorAll(".video").forEach(video => {
      const videoId = video.dataset.videoId;
      const isFavorite = localStorage.getItem(videoId) === "true"; // localStorageから状態を取得
      video.dataset.favorite = isFavorite ? "true" : "false"; // data-favorite属性を更新

      const button = video.querySelector(".favorite-button button");
      if (button) {
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
    });
  }

  setupFavoriteButtons(); // 初回適用
  applyFavoriteStateToVideos(); // ページ読み込み時にお気に入り状態を適用
});
