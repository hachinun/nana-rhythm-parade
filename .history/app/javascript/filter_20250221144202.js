document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded イベントが発火しました");
  
    // 動画のフィルタリング処理
    function filterVideos(condition) {
      document.querySelectorAll(".video").forEach(video => {
        const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
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
          return video.dataset.favorite === "true"; // data-favorite を文字列 "true" と比較
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
  
    // 初回ページ読み込み時に動画の状態を設定
    function applyFavoriteStateToVideos() {
      document.querySelectorAll(".video").forEach(video => {
        const videoId = video.dataset.videoId;
        const isFavorite = localStorage.getItem(videoId) === "true";
        video.dataset.favorite = isFavorite ? "true" : "false"; // data-favorite を設定
      });
    }
  
    applyFavoriteStateToVideos(); // 初期設定
  
  });
  