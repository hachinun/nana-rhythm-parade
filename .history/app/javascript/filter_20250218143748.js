document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");
    const searchInput = document.getElementById("search-input"); // 検索入力フィールド
    
    // 動画のフィルタリング処理
    function filterVideos(condition) {
        document.querySelectorAll(".video").forEach(video => {
            const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
            video.style.display = condition(startSeconds) ? "" : "none";
        });
    }

    // 検索機能
    function searchVideos(query) {
        const queryLower = query.toLowerCase();
        document.querySelectorAll(".video").forEach(video => {
            const title = video.querySelector(".song-title")?.innerText || "";
            const artist = video.querySelector(".artist")?.innerText || "";
            const isMatch = title.toLowerCase().includes(queryLower) || artist.toLowerCase().includes(queryLower);
            video.style.display = isMatch ? "" : "none";
        });
    }

    // お気に入りフィルター
    if (showFavoritesBtn && showAllBtn) {
        showFavoritesBtn.addEventListener("click", function () {
            document.querySelectorAll(".video").forEach(video => {
                const isFavorite = video.getAttribute("data-favorite") === "true";
                video.style.display = isFavorite ? "" : "none";
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

    // 検索入力イベントの設定
    searchInput.addEventListener("input", function () {
        const query = this.value;
        searchVideos(query);
    });
});
