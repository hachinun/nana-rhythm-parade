document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");

    // localStorageからお気に入り情報を取得（なければ空のオブジェクト）
    let favoriteVideos = JSON.parse(localStorage.getItem("favoriteVideos")) || {};
    console.log("初期のお気に入り情報:", favoriteVideos); // ログで確認

    // お気に入り情報をページに反映
    function applyFavorites() {
        document.querySelectorAll(".video").forEach(video => {
            const videoId = video.dataset.videoId;
            console.log(`動画ID: ${videoId} のお気に入り状態: ${favoriteVideos[videoId]}`); // ログで確認

            // localStorageの情報に基づき、data-favorite属性を設定
            if (favoriteVideos[videoId]) {
                video.dataset.favorite = "true"; // "true"（文字列）を設定
            } else {
                video.dataset.favorite = "false"; // "false"（文字列）を設定
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

        console.log(`クリックされたボタンのvideoId: ${videoId}`); // ログで確認

        // お気に入りの状態をトグル
        if (favoriteVideos[videoId]) {
            // 既にお気に入りなら削除
            delete favoriteVideos[videoId];
            button.textContent = "♡ お気に入り";
            button.classList.remove("unfavorite-btn");
            button.classList.add("favorite-btn");
            button.closest(".video").dataset.favorite = "false"; // "false" という文字列をセット
        } else {
            // お気に入りに追加
            favoriteVideos[videoId] = true;
            button.textContent = "❤️ お気に入り解除";
            button.classList.remove("favorite-btn");
            button.classList.add("unfavorite-btn");
            button.closest(".video").dataset.favorite = "true"; // "true" という文字列をセット
        }

        // `localStorage` に保存
        localStorage.setItem("favoriteVideos", JSON.stringify(favoriteVideos));
        console.log("お気に入り情報をlocalStorageに保存:", favoriteVideos); // ログで確認
    }

    // フィルタリング処理
    function filterVideos(condition) {
        document.querySelectorAll(".video").forEach(video => {
            const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
            console.log(`動画ID: ${video.dataset.videoId} の開始秒数: ${startSeconds}`); // ログで確認
            video.style.display = condition(startSeconds) ? "" : "none";
        });
    }

    // お気に入りフィルター
    if (showFavoritesBtn && showAllBtn) {
        showFavoritesBtn.addEventListener("click", function () {
            console.log("お気に入りフィルター適用開始"); // ログで確認
            document.querySelectorAll(".video").forEach(video => {
                console.log(`Video ID: ${video.dataset.videoId}, data-favorite: ${video.dataset.favorite}`); // ログで確認
                if (video.dataset.favorite === "true") {
                    video.style.display = "";
                } else {
                    video.style.display = "none";
                }
            });
        });

        showAllBtn.addEventListener("click", function () {
            console.log("すべての動画を表示"); // ログで確認
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
