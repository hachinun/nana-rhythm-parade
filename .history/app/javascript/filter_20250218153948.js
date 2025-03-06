document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");
    
    // 動画のフィルタリング処理
    function filterVideos(condition) {
        document.querySelectorAll(".video").forEach(video => {
            const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
            video.style.display = condition(startSeconds) ? "" : "none";
        });
    }
    
    // お気に入りフィルター
    if (showFavoritesBtn && showAllBtn) {
        showFavoritesBtn.addEventListener("click", function () {
            document.querySelectorAll(".video").forEach(video => {
                video.style.display = video.getAttribute("data-favorite") === "true" ? "" : "none";
            });
        });

        showAllBtn.addEventListener("click", function () {
            document.querySelectorAll(".video").forEach(video => {
                video.style.display = "";
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
