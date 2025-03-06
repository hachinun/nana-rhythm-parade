document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");

    let favoriteVideos = JSON.parse(localStorage.getItem("favoriteVideos")) || {}; // お気に入り情報を取得

    // お気に入り情報をページに反映
    function applyFavorites() {
        document.querySelectorAll(".video").forEach(video => {
            const videoId = video.dataset.videoId; // 各動画のIDを取得
            if (favoriteVideos[videoId]) {
                video.dataset.favorite = "true"; // data-favorite を更新
            } else {
                video.dataset.favorite = "false";
            }
        });

        // ボタンの見た目を更新
        document.querySelectorAll(".favorite-button button").forEach(button => {
            const videoId = button.dataset.videoId;
            if (favoriteVideos[videoId]) {
                button.textContent = "❤️ お気に入り解除";
                button.classList.remove("favorite-btn");
                button.classList.add("unfavorite-btn");
            } else {
                button.textContent = "♡ お気に入り";
                button.classList.remove("unfavorite-btn");
                button.classList.add("favorite-btn");
            }
        });
    }

    // お気に入りボタンのクリックイベント
    function favoriteButtonClickHandler(event) {
        event.preventDefault();
        const button = event.target;
        const videoId = button.dataset.videoId;

        if (favoriteVideos[videoId]) {
            // 既にお気に入りなら削除
            delete favoriteVideos[videoId];
            button.textContent = "♡ お気に入り";
            button.classList.remove("unfavorite-btn");
            button.classList.add("favorite-btn");
            button.closest(".video").dataset.favorite = "false";
        } else {
            // お気に入りに追加
            favoriteVideos[videoId] = true;
            button.textContent = "❤️ お気に入り解除";
            button.classList.remove("favorite-btn");
            button.classList.add("unfavorite-btn");
            button.closest(".video").dataset.favorite = "true";
        }

        // `localStorage` に保存
        localStorage.setItem("favoriteVideos", JSON.stringify(favoriteVideos));
    }

    // フィルタリング処理
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
                video.style.display = video.dataset.favorite === "true" ? "" : "none";
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

    // ページ読み込み時にお気に入り状態を適用
    applyFavorites();

    // お気に入りボタンのセットアップ
    document.querySelectorAll(".favorite-button button").forEach(button => {
        button.addEventListener("click", favoriteButtonClickHandler);
    });
});
