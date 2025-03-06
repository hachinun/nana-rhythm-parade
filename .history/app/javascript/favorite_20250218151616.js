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
  
 