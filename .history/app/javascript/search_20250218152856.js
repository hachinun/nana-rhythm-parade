document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const showFavoritesBtn = document.getElementById("show-favorites");
    const showAllBtn = document.getElementById("show-all");
    const searchInput = document.querySelector('input[name="query"]');
    
    let filteredVideos = []; // フィルタ後の動画リストを保持
    
    // 動画のフィルタリング処理
    function filterVideos(condition) {
        const videos = document.querySelectorAll(".video");
        videos.forEach(video => {
            const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
            if (condition(startSeconds)) {
                video.style.display = "";
                filteredVideos.push(video); // フィルタに合致する動画を保存
            } else {
                video.style.display = "none";
            }
        });
    }

    // 検索機能の処理
    searchInput.addEventListener('input', function () {
        const query = this.value.toLowerCase();
        
        if (query === "") {
            // 検索欄が空欄のときは、フィルタ後の動画リストを表示
            filteredVideos.forEach(video => {
                video.style.display = "";
            });
        } else {
            // 検索文字列が入力されたときは、その文字列に合う動画を表示
            document.querySelectorAll(".video").forEach(video => {
                const title = video.querySelector(".video-title").textContent.toLowerCase();
                video.style.display = title.includes(query) ? "" : "none";
            });
        }
    });
    
    // お気に入りフィルター
    showFavoritesBtn.addEventListener("click", function () {
        document.querySelectorAll(".video").forEach(video => {
            if (video.getAttribute("data-favorite") === "true") {
                video.style.display = "";
                filteredVideos.push(video); // お気に入り動画を保存
            } else {
                video.style.display = "none";
            }
        });
    });

    showAllBtn.addEventListener("click", function () {
        document.querySelectorAll(".video").forEach(video => {
            video.style.display = "";
        });
    });

    // 開始秒数フィルター
    filterStart0.addEventListener("click", function () {
        filterVideos(startSeconds => startSeconds === 0);
    });

    filterStartNonZero.addEventListener("click", function () {
        filterVideos(startSeconds => startSeconds !== 0);
    });
});
