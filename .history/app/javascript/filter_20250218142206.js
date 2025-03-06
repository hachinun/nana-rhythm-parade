document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const videoList = document.getElementById("video-list");

    // お気に入りフィルター機能
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");

    if (showFavoritesBtn && showAllBtn) {
    showFavoritesBtn.addEventListener("click", function () {
        console.log("🔀 お気に入りのみ表示");
        const videos = document.querySelectorAll(".video");
        videos.forEach(video => {
        const isFavorite = video.getAttribute("data-favorite") === "true";
        video.style.display = isFavorite ? "" : "none";
        });
    });

    showAllBtn.addEventListener("click", function () {
        console.log("🔄 すべての動画を表示");
        const videos = document.querySelectorAll(".video");
        videos.forEach(video => {
        video.style.display = "";
        });
    });
    } else {
    console.error("🚨 お気に入りフィルターボタンが見つかりません");
    }
    function filterVideos(condition) {
        document.querySelectorAll(".video").forEach((video) => { // 修正: .video-item → .video
            const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0; // NaN 対策
            if (condition(startSeconds)) {
                video.style.display = "";
            } else {
                video.style.display = "none";
            }
        });
    }

    filterStart0.addEventListener("click", function () {
        filterVideos((startSeconds) => startSeconds === 0);
        runTests(); // フィルタ適用後にテスト実行
    });

    filterStartNonZero.addEventListener("click", function () {
        filterVideos((startSeconds) => startSeconds !== 0);
        runTests(); // フィルタ適用後にテスト実行
    });

    // テスト関数
    function runTests() {
        console.log("=== フィルタリングテスト開始 ===");

        // すべての動画要素を取得
        const videos = document.querySelectorAll(".video");
        let passed = true;

        videos.forEach((video) => {
            const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0; // NaN 対策
            const isVisible = video.style.display !== "none";

            // デバッグ用ログ
            console.log("動画ID:", video.dataset.videoId);
            console.log("start_seconds:", startSeconds);

            if (filterStart0.classList.contains("active")) {
                if (startSeconds !== 0 && isVisible) {
                    console.error(`テスト失敗: start_seconds=${startSeconds} の動画が表示されている`);
                    passed = false;
                }
            } else if (filterStartNonZero.classList.contains("active")) {
                if (startSeconds === 0 && isVisible) {
                    console.error(`テスト失敗: start_seconds=0 の動画が表示されている`);
                    passed = false;
                }
            }
        });

        if (passed) {
            console.log("🎉 全てのテストに合格しました！");
        }
        console.log("===========================");
    }

    // ページ読み込み時に全動画のデータを確認
    document.querySelectorAll(".video").forEach((video) => {
        console.log("動画ID:", video.dataset.videoId);
        console.log("start_seconds:", video.dataset.startSeconds);
    });
});
