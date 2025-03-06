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
  
    // フィルターの処理を追加
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");
  
    if (showFavoritesBtn && showAllBtn) {
      showFavoritesBtn.addEventListener("click", function () {
        console.log("お気に入りフィルターが適用されました");
        // 動画のdata-favoriteを確認してフィルタリング
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
  
    // 初回ページ読み込み時にお気に入り状態を適用
    applyFavoriteStateToVideos();
  });
  