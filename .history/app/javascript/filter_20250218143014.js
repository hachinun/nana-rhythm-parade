document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");
    const searchInput = document.querySelector('input[name="query"]');

    function applyFilters() {
        const query = searchInput.value.toLowerCase();
        const videos = document.querySelectorAll(".video");

        videos.forEach(video => {
            const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
            const isFavorite = video.getAttribute("data-favorite") === "true";
            const title = video.querySelector(".song-title")?.innerText.toLowerCase() || "";
            const artist = video.querySelector(".artist")?.innerText.toLowerCase() || "";

            let isVisible = true;

            // 開始秒数フィルタ
            if (filterStart0.classList.contains("active")) {
                isVisible = startSeconds === 0;
            } else if (filterStartNonZero.classList.contains("active")) {
                isVisible = startSeconds !== 0;
            }

            // お気に入りフィルタ
            if (showFavoritesBtn.classList.contains("active")) {
                isVisible = isVisible && isFavorite;
            }

            // 検索フィルタ（現在表示されているもののみ対象）
            if (query) {
                isVisible = isVisible && (title.includes(query) || artist.includes(query));
            }

            video.style.display = isVisible ? "" : "none";
        });
    }

    // 各フィルタボタンにイベントを設定
    function setupFilterButton(button, condition) {
        button.addEventListener("click", function () {
            // 他のフィルタをリセットし、現在のフィルタを適用
            document.querySelectorAll(".filter-button").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            applyFilters();
        });
    }

    if (filterStart0 && filterStartNonZero) {
        setupFilterButton(filterStart0, startSeconds => startSeconds === 0);
        setupFilterButton(filterStartNonZero, startSeconds => startSeconds !== 0);
    }

    if (showFavoritesBtn && showAllBtn) {
        setupFilterButton(showFavoritesBtn, video => video.getAttribute("data-favorite") === "true");
        showAllBtn.addEventListener("click", function () {
            document.querySelectorAll(".filter-button").forEach(btn => btn.classList.remove("active"));
            applyFilters();
        });
    }

    // 検索フィルタの設定
    searchInput.addEventListener("input", applyFilters);
});
