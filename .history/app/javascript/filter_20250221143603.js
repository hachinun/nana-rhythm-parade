document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded イベントが発火しました");
  
    // 動画に対してお気に入りの状態を適用
    function applyFavoriteStateToVideos() {
      document.querySelectorAll(".video").forEach(video => {
        const videoId = video.dataset.videoId;
        const isFavorite = localStorage.getItem(videoId) === "true";
        // data-favorite属性を動画に設定
        video.dataset.favorite = isFavorite ? "true" : "false";
      });
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
  
    function initializeButtonState(button) {
      // localStorage からお気に入り状態を読み込む
      const videoId = button.dataset.videoId;
      const isFavorite = localStorage.getItem(videoId) === "true";
  
      if (isFavorite) {
        console.log(`❤️ videoId: ${videoId} はすでにお気に入り`);
        button.textContent = "❤️ お気に入り解除";
        button.classList.remove("favorite-btn");
        button.classList.add("unfavorite-btn");
        // data-favorite属性を設定
        const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
        if (videoElement) {
          videoElement.dataset.favorite = "true"; // 動画のデータ属性を更新
        }
      } else {
        console.log(`♡ videoId: ${videoId} はお気に入りではありません`);
        button.textContent = "♡ お気に入り";
        button.classList.remove("unfavorite-btn");
        button.classList.add("favorite-btn");
        // data-favorite属性を設定
        const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
        if (videoElement) {
          videoElement.dataset.favorite = "false"; // 動画のデータ属性を更新
        }
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
      
      // お気に入り状態をトグル
      const newFavoriteState = !isFavorite;
      
      // localStorage に状態を保存
      localStorage.setItem(videoId, newFavoriteState);
  
      // ボタンのテキストとクラスを更新
      if (newFavoriteState) {
        console.log(`❤️ videoId: ${videoId} をお気に入りに追加`);
        button.textContent = "❤️ お気に入り解除";
        button.classList.remove("favorite-btn");
        button.classList.add("unfavorite-btn");
        // data-favorite属性を設定
        const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
        if (videoElement) {
          videoElement.dataset.favorite = "true"; // 動画のデータ属性を更新
        }
      } else {
        console.log(`💔 videoId: ${videoId} をお気に入り解除`);
        button.textContent = "♡ お気に入り";
        button.classList.remove("unfavorite-btn");
        button.classList.add("favorite-btn");
        // data-favorite属性を設定
        const videoElement = document.querySelector(`[data-video-id="${videoId}"]`);
        if (videoElement) {
          videoElement.dataset.favorite = "false"; // 動画のデータ属性を更新
        }
      }
    }
  
    // フィルターの処理を追加
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");
  
    if (showFavoritesBtn && showAllBtn) {
      showFavoritesBtn.addEventListener("click", function () {
        console.log("お気に入りフィルターが適用されました");
        document.querySelectorAll(".video").forEach(video => {
          const isFavorite = video.dataset.favorite === "true"; // data-favorite を確認
          video.style.display = isFavorite ? "" : "none"; // お気に入りの動画だけ表示
        });
      });
  
      showAllBtn.addEventListener("click", function () {
        console.log("すべて表示のフィルターが適用されました");
        document.querySelectorAll(".video").forEach(video => {
          video.style.display = ""; // すべて表示
        });
      });
    } else {
      console.error("🚨 お気に入りフィルターボタンが見つかりません");
    }
  
    setupFavoriteButtons(); // 初回適用
  
    // 初回ページ読み込み時にお気に入り状態を適用
    applyFavoriteStateToVideos();
  });
  