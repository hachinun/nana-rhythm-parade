document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");

    // .video クラスを持つ要素を取得
    const videos = document.querySelectorAll(".video");
    console.log("✅ 取得した .video 要素一覧:", videos);

    // 動画のフィルタリング処理
    function filterVideos(condition) {
        const videos = document.querySelectorAll(".video");

        if (!videos.length) {
            console.warn("⚠️ .video 要素が見つかりません");
            return;
        }

        videos.forEach((video, index) => {
            console.log(`🎥 ${index + 1} 番目の video 要素:`, video);
            console.log(`👉 video の型:`, typeof video);

            if (!(video instanceof HTMLElement)) {
                console.error(`❌ ${index + 1} 番目の video が HTMLElement ではありません:`, video);
                return; // ここで処理をスキップ
            }

            const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
            video.style.display = condition(startSeconds) ? "" : "none";
        });
    }

    // お気に入りフィルター
    if (showFavoritesBtn && showAllBtn) {
        showFavoritesBtn.addEventListener("click", function () {
            console.log("⭐ お気に入りボタンが押されました");

            document.querySelectorAll(".video").forEach((video, index) => {
                console.log(`🎥 ${index + 1} 番目の video:`, video);

                if (!(video instanceof HTMLElement)) {
                    console.error(`❌ ${index + 1} 番目の video が HTMLElement ではありません:`, video);
                    return;
                }

                const isFavorite = video.getAttribute("data-favorite") === "true";
                console.log(`📌 data-favorite の値: ${video.getAttribute("data-favorite")}, isFavorite: ${isFavorite}`);
                video.style.display = isFavorite ? "" : "none";
            });
        });

        showAllBtn.addEventListener("click", function () {
            console.log("🔄 すべての動画を表示");

            document.querySelectorAll(".video").forEach((video, index) => {
                if (!(video instanceof HTMLElement)) {
                    console.error(`❌ ${index + 1} 番目の video が HTMLElement ではありません:`, video);
                    return;
                }
                video.style.display = "";
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
