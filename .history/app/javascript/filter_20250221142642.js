document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded イベントが発火しました");
  
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");
  
    // 動画のフィルタリング処理
    function filterVideos(condition) {
      document.querySelectorAll(".video").forEach(video => {
        const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
        const isFavorite = video.dataset.favorite === "true"; // data-favorite 属性を使ってお気に入りかどうかを判定
        console.log(`videoId: ${video.dataset.videoId}, startSeconds: ${startSeconds}, isFavorite: ${isFavorite}`);
  
        // フィルタ条件に基づいて表示・非表示を決定
        if (condition(startSeconds, isFavorite)) {
          video.style.display = "";
        } else {
          video.style.display = "none";
        }
      });
    }
  
    // お気に入りフィルター
    if (showFavoritesBtn && showAllBtn) {
      showFavoritesBtn.addEventListener("click", function () {
        console.log("お気に入りフィルター適用開始");
  
        // お気に入り動画のみ表示
        filterVideos((startSeconds, isFavorite) => isFavorite);
      });
  
      showAllBtn.addEventListener("click", function () {
        console.log("すべての動画を表示");
  
        // すべての動画を表示
        filterVideos(() => true);
      });
    } else {
      console.error("🚨 お気に入りフィルターボタンが見つかりません");
    }
  
    // 開始秒数フィルター
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
  
    filterStart0.addEventListener("click", function () {
      filterVideos((startSeconds) => startSeconds === 0);
    });
  
    filterStartNonZero.addEventListener("click", function () {
      filterVideos((startSeconds) => startSeconds !== 0);
    });
  });
  