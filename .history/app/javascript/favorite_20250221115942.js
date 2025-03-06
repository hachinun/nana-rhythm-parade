document.addEventListener("DOMContentLoaded", function () {
  const filterStart0 = document.getElementById("filter-start-0");
  const filterStartNonZero = document.getElementById("filter-start-nonzero");
  const showFavoritesBtn = document.getElementById("show-favorites");
  const showAllBtn = document.getElementById("show-all");

  // 動画のフィルタリング処理
  function filterVideos(condition) {
      const videos = document.querySelectorAll(".video");
      if (!videos.length) {
          console.warn("⚠️ .video 要素が見つかりません");
          return;
      }
      
      videos.forEach(video => {
          if (video instanceof HTMLElement) {
              const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
              video.style.display = condition(startSeconds) ? "" : "none";
          } else {
              console.error("❌ video 要素が HTMLElement ではありません:", video);
          }
      });
  }

  // お気に入りフィルター
  if (showFavoritesBtn && showAllBtn) {
      showFavoritesBtn.addEventListener("click", function () {
          document.querySelectorAll(".video").forEach(video => {
              if (video instanceof HTMLElement) {
                  video.style.display = video.dataset.favorite === "true" ? "" : "none";
              } else {
                  console.error("❌ video が HTML 要素ではありません:", video);
              }
          });
      });

      showAllBtn.addEventListener("click", function () {
          document.querySelectorAll(".video").forEach(video => {
              if (video instanceof HTMLElement) {
                  video.style.display = "";
              } else {
                  console.error("❌ video が HTML 要素ではありません:", video);
              }
          });
      });
  } else {
      console.error("🚨 お気に入りフィルターボタンが見つかりません");
  }

  // 開始秒数フィルター
  filterStart0.addEventListener("click", function () {
      filterVideos(startSeconds => startSeconds === 0);
  });

  filterStartNonZero.addEventListener("click", function () {
      filterVideos(startSeconds => startSeconds !== 0);
  });
});
