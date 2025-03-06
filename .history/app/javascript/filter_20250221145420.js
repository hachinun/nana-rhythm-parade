document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");

    // `document.querySelectorAll(".video")` が正しく取得できているか確認
    console.log("✅ .video 要素一覧:", document.querySelectorAll(".video"));

    // 動画のフィルタリング処理
    function filterVideos(condition) {
        const videos = document.querySelectorAll(".video");
        
        if (!videos.length) {
            console.warn("⚠️ .video 要素が見つかりません");
            return;
        }

        videos.forEach(video => {
            console.log("🎥 video要素:", video, "型:", typeof video);
            
            if (video instanceof HTMLElement) {
                const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
                video.style.display = condition(startSeconds) ? "" : "none";
            } else {
                console.error("❌ video が HTMLElement ではありません:", video);
            }
        });
    }

    // お気に入りフィルター
    if (showFavoritesBtn && showAllBtn) {
        showFavoritesBtn.addEventListener("click", function () {
            console.log("⭐ お気に入りボタンが押されました");

            document.querySelectorAll(".video").forEach(video => {
                console.log("🎥 お気に入りチェック対象:", video);

                if (video instanceof HTMLElement) {
                    const isFavorite = video.getAttribute("data-favorite") === "true";
                    console.log(`📌 data-favorite の値: ${video.getAttribute("data-favorite")}, isFavorite: ${isFavorite}`);
                    video.style.display = isFavorite ? "" : "none";
                } else {
                    console.error("❌ video が HTML 要素ではありません:", video);
                }
            });
        });

        showAllBtn.addEventListener("click", function () {
            console.log("🔄 すべての動画を表示");

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
        console.log("⏳ 開始秒数 0 フィルターが適用されました");
        filterVideos(startSeconds => startSeconds === 0);
    });

    filterStartNonZero.addEventListener("click", function () {
        console.log("⏳ 開始秒数 0 以外のフィルターが適用されました");
        filterVideos(startSeconds => startSeconds !== 0);
    });
});
