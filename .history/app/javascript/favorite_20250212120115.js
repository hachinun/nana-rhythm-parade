document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoadedイベントが発火しました");
  
    function attachFavoriteButtonListeners() {
      const buttons = document.querySelectorAll(".favorite-button button");
  
      if (buttons.length === 0) {
        console.log("お気に入りボタンが見つかりません");
      } else {
        console.log(`${buttons.length}個のボタンが見つかりました`);
      }
  
      buttons.forEach(button => {
        button.removeEventListener("click", favoriteButtonClickHandler); // 重複防止
        button.addEventListener("click", favoriteButtonClickHandler);
      });
    }
  
    function setupFavoriteButtons() {
        document.querySelectorAll('.favorite-button').forEach(button => {
          button.addEventListener('click', function(event) {
            event.preventDefault();
            const videoId = this.dataset.videoId;
            const isFavorite = this.classList.contains('favorited');
      
            fetch(`/favorites/${videoId}`, {
              method: isFavorite ? 'DELETE' : 'POST',
              headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
              }
            })
            .then(response => response.json())
            .then(data => {
              if (data.success) {
                this.classList.toggle('favorited', !isFavorite);
                this.textContent = !isFavorite ? '★' : '☆';
              }
            });
          });
        });
      }
      
      // 初回ロード時に実行
      document.addEventListener("DOMContentLoaded", setupFavoriteButtons);
      
  
    // お気に入りフィルター機能
    const toggleFavoritesBtn = document.getElementById("toggle-favorites");
    let showOnlyFavorites = false;
  
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
        event.preventDefault(); // フォームのデフォルト送信を防ぐ
  
        const formData = new FormData(this);
        const query = formData.get('query'); // `name="query"` の値を取得
  
        console.log("検索クエリ:", query);
  
        fetch(`/videos?query=${encodeURIComponent(query)}`)
          .then(response => response.text())
          .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newVideoList = doc.querySelector('#video-list');
  
            if (newVideoList) {
              document.querySelector('#video-list').innerHTML = newVideoList.innerHTML;
              console.log("動画リストが更新されました");
              attachFavoriteButtonListeners(); // ここでボタンイベントを再適用
            } else {
              console.error("新しい動画リストが取得できませんでした");
            }
          })
          .catch(error => {
            console.error("検索エラー:", error);
          });
      });
    } else {
      console.error("検索フォームが見つかりません");
    }
  });
  