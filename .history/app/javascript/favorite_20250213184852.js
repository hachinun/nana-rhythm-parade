document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoadedイベントが発火しました");
  
    let showOnlyFavorites = false; // お気に入りフィルターの状態
    const favoriteKey = "favoriteVideos"; // localStorage 用のキー
  
    function loadFavorites() {
      return JSON.parse(localStorage.getItem(favoriteKey) || "{}");
    }
  
    function saveFavorites(favorites) {
      localStorage.setItem(favoriteKey, JSON.stringify(favorites));
    }
  
    function setupFavoriteButtons() {
      const buttons = document.querySelectorAll(".favorite-button button");
  
      buttons.forEach(button => {
        if (!button.hasAttribute("data-listener")) {
          button.addEventListener("click", favoriteButtonClickHandler);
          button.setAttribute("data-listener", "true");
        }
      });
  
      // localStorage からお気に入り状態を復元
      updateFavoriteButtons();
    }
  
    function favoriteButtonClickHandler(event) {
      event.preventDefault();
      let videoId = this.dataset.videoId;
      let url = `/videos/${videoId}/favorites/toggle`;
      let favorites = loadFavorites();
  
      fetch(url, {
        method: 'POST',
        headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content }
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === "added") {
          this.textContent = "❤️ お気に入り解除";
          this.classList.remove("favorite-btn");
          this.classList.add("unfavorite-btn");
          this.closest(".video").setAttribute("data-favorite", "true");
          favorites[videoId] = true; // localStorage に保存
        } else {
          this.textContent = "♡ お気に入り";
          this.classList.remove("unfavorite-btn");
          this.classList.add("favorite-btn");
          this.closest(".video").setAttribute("data-favorite", "false");
          delete favorites[videoId]; // localStorage から削除
        }
        saveFavorites(favorites);
      })
      .catch(error => {
        console.error("エラーが発生しました:", error);
      });
    }
  
    function updateFavoriteButtons() {
      const favorites = loadFavorites();
      document.querySelectorAll(".favorite-button button").forEach(button => {
        let videoId = button.dataset.videoId;
        if (favorites[videoId]) {
          button.textContent = "❤️ お気に入り解除";
          button.classList.add("unfavorite-btn");
          button.classList.remove("favorite-btn");
          button.closest(".video").setAttribute("data-favorite", "true");
        } else {
          button.textContent = "♡ お気に入り";
          button.classList.add("favorite-btn");
          button.classList.remove("unfavorite-btn");
          button.closest(".video").setAttribute("data-favorite", "false");
        }
      });
    }
  
    setupFavoriteButtons(); // 初回適用
  
    // お気に入りフィルター
    const toggleFavoritesBtn = document.getElementById("toggle-favorites");
  
    if (toggleFavoritesBtn) {
      toggleFavoritesBtn.addEventListener("click", function () {
        showOnlyFavorites = !showOnlyFavorites;
  
        const videos = document.querySelectorAll(".video");
        videos.forEach(video => {
          const isFavorite = video.getAttribute("data-favorite") === "true";
          video.style.display = (showOnlyFavorites && !isFavorite) ? "none" : "";
        });
  
        this.textContent = showOnlyFavorites ? "すべて表示" : "お気に入りのみ表示";
      });
    } else {
      console.error("お気に入りフィルターボタンが見つかりません");
    }
  
    // 検索機能に対応する
    const searchForm = document.querySelector('#search-form');
  
    if (searchForm) {
      searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
  
        const formData = new FormData(this);
        const query = formData.get('query').toLowerCase();
        console.log("検索クエリ:", query);
  
        const videos = document.querySelectorAll(".video");
        const filteredVideos = Array.from(videos).filter(video => {
          const isFavorite = video.getAttribute("data-favorite") === "true";
          return (!showOnlyFavorites || isFavorite);
        });
  
        const searchResults = filteredVideos.filter(video => {
          const videoTitle = video.querySelector('.video-title').textContent.toLowerCase();
          return videoTitle.includes(query);
        });
  
        const videoList = document.querySelector('#video-list');
        videoList.innerHTML = '';
        searchResults.forEach(video => {
          videoList.appendChild(video);
        });
  
        console.log("検索結果が更新されました");
  
        // 検索結果の動画にお気に入りボタンを適用
        setupFavoriteButtons();
      });
    } else {
      console.error("検索フォームが見つかりません");
    }
  });
  