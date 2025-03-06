document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoadedイベントが発火しました");
  
    // 動画リストの親要素を監視して、お気に入りボタンのクリックを検出
    document.addEventListener("click", function(event) {
      if (event.target.matches(".favorite-btn, .unfavorite-btn")) {
        console.log("お気に入りボタンがクリックされました");
  
        event.preventDefault();
        let button = event.target;
        let videoId = button.dataset.videoId;
        console.log("videoId:", videoId);
  
        let url = `/videos/${videoId}/favorites/toggle`;
  
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
            button.textContent = "❤️ お気に入り解除";
            button.classList.remove("favorite-btn");
            button.classList.add("unfavorite-btn");
  
            // data-favorite属性を更新
            button.closest(".video").setAttribute("data-favorite", "true");
          } else {
            console.log("お気に入りが解除されました");
            button.textContent = "♡ お気に入り";
            button.classList.remove("unfavorite-btn");
            button.classList.add("favorite-btn");
  
            // data-favorite属性を更新
            button.closest(".video").setAttribute("data-favorite", "false");
          }
        })
        .catch(error => {
          console.error("エラーが発生しました:", error);
        });
      }
    });
  
    // お気に入りフィルター機能
    const toggleFavoritesBtn = document.getElementById("toggle-favorites");
    let showOnlyFavorites = false;
  
    toggleFavoritesBtn.addEventListener("click", function() {
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
  });
  