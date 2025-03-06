document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");
    const allButtons = [filterStart0, filterStartNonZero, showFavoritesBtn];

    // フィルタリングされた動画リストを格納する変数
    let filteredVideos = [];

    // 動画のフィルタリング処理
    function filterVideos(condition) {
        const videos = document.querySelectorAll(".video");
        if (!videos.length) {
            console.warn("⚠️ .video 要素が見つかりません");
            return;
        }

        filteredVideos = [];  // フィルタリングされたリストをリセット

        videos.forEach(video => {
            if (!(video instanceof HTMLElement)) {
                console.error("❌ video 要素が HTMLElement ではありません:", video);
                return;
            }

            const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
            const isFavorite = video.dataset.favorite === "true";

            if (condition(startSeconds, isFavorite)) {
                video.style.display = "";  // 表示
                filteredVideos.push(video);  // フィルタリングされた動画を格納
            } else {
                video.style.display = "none";  // 非表示
            }
        });
    }

    // ボタンのON/OFFを管理（他のフィルターを解除）
    function activateFilter(button, condition) {
        allButtons.forEach(btn => btn.classList.remove("active")); // 他のフィルターを解除
        button.classList.add("active"); // 選択したボタンのみON
        filterVideos(condition);
        console.log("フィルタリングされた動画:", filteredVideos); // フィルタリング後の動画リストを表示
    }

    // フィルター処理
    filterStart0.addEventListener("click", function () {
        activateFilter(filterStart0, (startSeconds) => startSeconds === 0);
    });

    filterStartNonZero.addEventListener("click", function () {
        activateFilter(filterStartNonZero, (startSeconds) => startSeconds !== 0);
    });

    showFavoritesBtn.addEventListener("click", function () {
        activateFilter(showFavoritesBtn, (_, isFavorite) => isFavorite);
    });

    // すべて表示（フィルター解除）
    showAllBtn.addEventListener("click", function () {
        allButtons.forEach(btn => btn.classList.remove("active")); // すべてのフィルターを解除
        filterVideos(() => true); // すべて表示
        console.log("フィルタリングされた動画:", filteredVideos); // すべて表示後の動画リスト
    });
});
