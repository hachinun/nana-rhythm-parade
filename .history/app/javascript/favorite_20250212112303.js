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
        button.removeEventListener("click", favoriteButtonClickHandler); // 重複防止のため削除
        button.addEventListener("click", favoriteButtonClickHandler);
      });
    }
  
    function favoriteButtonClickHandler(event) {
      console.log("お気に入りボタンがクリックされました");
  
      event.preventDefault(); // ボタンのデフォルト動作をキャンセル
      let videoId = this.dataset.videoId;
      console.log("videoId:", videoId);
  
      let url = `/videos/${videoId}/favorites/toggle`; // URLが正しいか確認
  
      fetch(url, {
        method: 'POST',
        headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content }
      })
      .then(response => response.json())
      .then(data => {
        console.log("APIからのレスポンス:", data);
  
        // 成功時にボタンのテキストとクラスを更新
        if (data.status === "added") {
          console.log("お気に入りに追加されました");
          this.textContent = "❤️ お気に入り解除";
          this.classList.remove("favorite-btn");
          this.classList.add("unfavorite-btn");
  
          // data-favorite属性を更新
          this.closest(".video").setAttribute("data-favorite", "true");
        } else {
          console.log("お気に入りが解除されました");
          this.textContent = "♡ お気に入り";
          this.classList.remove("unfavorite-btn");
          this.classList.add("favorite-btn");
  
          // data-favorite属性を更新
          this.closest(".video").setAttribute("data-favorite", "false");
        }
      })
      .catch(error => {
        console.error("エラーが発生しました:", error);
      });
    }
  
    attachFavoriteButtonListeners(); // 初回適用
  
    // お気に入りフィルター機能
    const toggleFavoritesBtn = document.getElementById("toggle-favorites");
    let showOnlyFavorites = false;
  
    toggleFavoritesBtn.addEventListener("click", function () {
      showOnlyFavorites = !showOnlyFavorites;
  
      const videos = document.querySelectorAll(".video");
      videos.forEach(video => {
        const isFavorite = video.getAttribute("data-favorite") === "true";
        if (showOnlyFavorites && !isFavorite) {
          video.style.visibility = "hidden";
          video.style.height = "0";
          video.style.margin = "0";
          video.style.padding = "0";
          video.style.overflow = "hidden";
        } else {
          video.style.visibility = "visible";
          video.style.height = ""; // 元の高さを復元
          video.style.margin = "";
          video.style.padding = "";
          video.style.overflow = "";
        }
      });
  
      // ボタンのテキストを変更
      this.textContent = showOnlyFavorites ? "すべて表示" : "お気に入りのみ表示";
    });
  
    // 検索機能と連携してクリックイベントを再適用
    document.querySelector('input[name="query"]').addEventListener('input', function() {
      const query = this.value;
      fetch(`/videos?query=${query}`)
        .then(response => response.text())
        .then(html => {
          const videoListContainer = document.querySelector('#video-list');
  
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const newVideoList = doc.querySelector('#video-list').innerHTML;
  
          videoListContainer.innerHTML = newVideoList;
  
          attachFavoriteButtonListeners(); // 検索後のリストにも適用
        });
    });
  });
  