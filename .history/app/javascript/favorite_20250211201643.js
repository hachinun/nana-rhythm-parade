document.addEventListener("DOMContentLoaded", function() {
    // お気に入りボタンのクリックイベント
    document.querySelectorAll(".favorite-button button").forEach(button => {
      button.addEventListener("click", function(event) {
        event.preventDefault(); // ボタンのデフォルト動作（フォーム送信）をキャンセル
  
        let videoId = this.dataset.videoId;
        let url = `/favorites/toggle?video_id=${videoId}`;
        
        // 非同期リクエストを送信
        fetch(url, {
          method: 'POST',
          headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content }
        })
        .then(response => response.json())
        .then(data => {
          // 成功時にボタンのテキストとクラスを更新
          if (data.status === "added") {
            this.textContent = "❤️ お気に入り解除";
            this.classList.remove("favorite-btn");
            this.classList.add("unfavorite-btn");
          } else {
            this.textContent = "♡ お気に入り";
            this.classList.remove("unfavorite-btn");
            this.classList.add("favorite-btn");
          }
        })
        .catch(error => console.error("Error:", error));
      });
    });
  });
  