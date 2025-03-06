document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");
    const searchInput = document.querySelector('input[name="query"]');  // 検索インプットの取得

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
        filterSearchResults();  // フィルター後に検索結果を再適用
    });

    filterStartNonZero.addEventListener("click", function () {
        filterVideos(startSeconds => startSeconds !== 0);
        filterSearchResults();  // フィルター後に検索結果を再適用
    });

    // 検索機能の処理
    function filterSearchResults() {
        const query = searchInput.value.toLowerCase(); // 検索キーワード
        document.querySelectorAll(".video").forEach(video => {
            const title = video.querySelector('.song-title')?.innerText.toLowerCase() || "";
            const artist = video.querySelector('.artist')?.innerText.toLowerCase() || "";
            if (title.includes(query) || artist.includes(query)) {
                video.style.display = "";  // 検索条件に合う場合は表示
            } else {
                video.style.display = "none";  // 検索条件に合わない場合は非表示
            }
        });
    }

    // 検索イベントリスナー
    searchInput.addEventListener("input", filterSearchResults);
});
