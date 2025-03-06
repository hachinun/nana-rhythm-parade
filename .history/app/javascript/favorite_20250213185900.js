document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded イベントが発火しました");

    let showOnlyFavorites = false; // お気に入りフィルターの状態

    // お気に入りボタンのセットアップ
    function setupFavoriteButtons() {
      console.log("setupFavoriteButtons が実行されました");

      const buttons = document.querySelectorAll(".favorite-button button");

      if (buttons.length === 0) {
        console.warn("⚠️ お気に入りボタンが見つかりません");
      } else {
        console.log(`✅ ${buttons.length} 個のボタンが見つかりました`);
      }

      buttons.forEach(button => {
        if (!button.hasAttribute("data-listener")) {
          console.log(`🟢 ボタン(${button.dataset.videoId}) にイベントを設定`);
          button.addEventListener("click", favoriteButtonClickHandler);
          button.setAttribute("data-listener", "true");
        }
      });
    }

    function favoriteButtonClickHandler(event) {
      console.log("🎯 お気に入りボタンがクリックされました");

      event.preventDefault();
      let videoId = this.dataset.videoId;
      console.log(`📌 videoId: ${videoId}`);

      let url = `/videos/${videoId}/favorites/toggle`;

      fetch(url, {
        method: 'POST',
        headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content }
      })
      .then(response => response.json())
      .then(data => {
        console.log("📨 APIからのレスポンス:", data);

        if (data.status === "added") {
          console.log(`❤️ videoId: ${videoId} をお気に入りに追加`);
          this.textContent = "❤️ お気に入り解除";
          this.classList.remove("favorite-btn");
          this.classList.add("unfavorite-btn");
          this.closest(".video").setAttribute("data-favorite", "true");
        } else {
          console.log(`💔 videoId: ${videoId} をお気に入り解除`);
          this.textContent = "♡ お気に入り";
          this.classList.remove("unfavorite-btn");
          this.classList.add("favorite-btn");
          this.closest(".video").setAttribute("data-favorite", "false");
        }
      })
      .catch(error => {
        console.error("🚨 エラーが発生しました:", error);
      });
    }

    setupFavoriteButtons(); // 初回適用

    // お気に入りフィルター機能
    const toggleFavoritesBtn = document.getElementById("toggle-favorites");

    if (toggleFavoritesBtn) {
      toggleFavoritesBtn.addEventListener("click", function () {
        showOnlyFavorites = !showOnlyFavorites;
        console.log(`🔀 お気に入りフィルター: ${showOnlyFavorites ? "有効" : "無効"}`);

        const videos = document.querySelectorAll(".video");
        videos.forEach(video => {
          const isFavorite = video.getAttribute("data-favorite") === "true";
          video.style.display = (showOnlyFavorites && !isFavorite) ? "none" : "";
        });

        this.textContent = showOnlyFavorites ? "すべて表示" : "お気に入りのみ表示";
      });
    } else {
      console.error("🚨 お気に入りフィルターボタンが見つかりません");
    }

    // 検索機能に対応する
    const searchForm = document.querySelector('#search-form');

    if (searchForm) {
      searchForm.addEventListener('submit', function(event) {
        event.preventDefault(); // フォームのデフォルト送信を防ぐ

        const formData = new FormData(this);
        const query = formData.get('query') || ""; // `name="query"` の値を取得
        console.log(`🔍 検索クエリ: "${query}"`);

        // お気に入りフィルタが有効な場合、その範囲内で検索
        const videos = document.querySelectorAll(".video");
        console.log(`📌 検索対象の動画数: ${videos.length}`);

        const filteredVideos = Array.from(videos).filter(video => {
          if (showOnlyFavorites) {
            return video.getAttribute("data-favorite") === "true";
          }
          return true; // お気に入りフィルターが無効の場合はすべて表示
        });

        console.log(`🔎 フィルタ後の動画数: ${filteredVideos.length}`);

        // フィルタリングされた動画のみに対して検索を行う
        const searchResults = filteredVideos.filter(video => {
          const videoTitle = video.querySelector('.video-title').textContent.toLowerCase();
          return videoTitle.includes(query.toLowerCase());
        });

        console.log(`✅ 検索結果の動画数: ${searchResults.length}`);

        // 検索結果を表示
        const videoList = document.querySelector('#video-list');
        videoList.innerHTML = ''; // 初期化
        searchResults.forEach(video => {
          videoList.appendChild(video); // 検索結果を追加
        });

        console.log("🔄 検索結果が更新されました");

        // 🔴【追加】検索後にお気に入りボタンを再設定
        setupFavoriteButtons();
      });
    } else {
      console.error("🚨 検索フォームが見つかりません");
    }
});
