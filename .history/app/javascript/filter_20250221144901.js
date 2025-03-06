document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded イベントが発火しました");
  
    // 動画のフィルタリング処理
    function filterVideos(condition) {
      document.querySelectorAll(".video").forEach(video => {
        const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
        console.log(`動画ID: ${video.dataset.videoId}, お気に入り状態: ${video.dataset.favorite}`); // 追加
        video.style.display = condition(video) ? "" : "none";
      });
    }
  
    // お気に入りフィルター
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");
  
    if (showFavoritesBtn && showAllBtn) {
      showFavoritesBtn.addEventListener("click", function () {
        console.log("お気に入りフィルターが適用されました");
        filterVideos(function (video) {
          const isFavorite = video.dataset.favorite === "true"; // 文字列比較
          console.log(`videoId: ${video.dataset.videoId}, お気に入り状態: ${isFavorite}`);
          return isFavorite; // ここで条件を確認
        });
      });
  
      showAllBtn.addEventListener("click", function () {
        console.log("すべて表示のフィルターが適用されました");
        filterVideos(function () {
          return true; // すべて表示
        });
      });
    } else {
      console.error("🚨 お気に入りフィルターボタンが見つかりません");
    }
  
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
  
      // 動画の状態も更新
      updateVideoState(videoId, newFavoriteState);
    }
  
    // localStorageの状態を元に動画の表示を更新
    function updateVideoState(videoId, isFavorite) {
      document.querySelectorAll(".video").forEach(video => {
        if (video.dataset.videoId === videoId) {
          video.dataset.favorite = isFavorite ? "true" : "false"; // data-favorite を更新
        }
      });
    }
  
    // 初回ページ読み込み時に動画の状態を設定
    function applyFavoriteStateToVideos() {
      document.querySelectorAll(".video").forEach(video => {
        const videoId = video.dataset.videoId;
        const isFavorite = localStorage.getItem(videoId) === "true";
        video.dataset.favorite = isFavorite ? "true" : "false"; // data-favorite を設定
      });
    }
  
    applyFavoriteStateToVideos(); // 初期設定
    setupFavoriteButtons(); // 初回適用
  });
  