document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoadedイベントが発火しました");
  
    // お気に入りボタンのクリックイベント
    const buttons = document.querySelectorAll(".favorite-button button");
    if (buttons.length === 0) {
      console.log("お気に入りボタンが見つかりません");
    } else {
      console.log(`${buttons.length}個のボタンが見つかりました`);
    }
  
    buttons.forEach(button => {
      button.addEventListener("click", function(event) {
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
      });
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
          video.style.display = "none";
        } else {
          video.style.display = "block";
        }
      });
  
      // ボタンのテキストを変更
      this.textContent = showOnlyFavorites ? "すべて表示" : "お気に入りのみ表示";
    });
  });
  