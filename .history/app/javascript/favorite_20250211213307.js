document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoadedイベントが発火しました");  // ページの読み込み完了確認
  
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
  
        event.preventDefault(); // ボタンのデフォルト動作（フォーム送信）をキャンセル
        let videoId = this.dataset.videoId;
        console.log("videoId:", videoId);
  
        let url = `/videos/${videoId}/favorites/toggle`;  // URLが正しいか確認
  
        // 非同期リクエストを送信
        fetch(url, {
          method: 'POST',
          headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content }
        })
        .then(response => {
          console.log("APIリクエストが完了しました:", response);
          return response.json();  // レスポンスをJSONとして取得
        })
        .then(data => {
          console.log("APIからのレスポンス:", data);
          
          // 成功時にボタンのテキストとクラスを更新
          if (data.status === "added") {
            console.log("お気に入りに追加されました");
            this.textContent = "❤️ お気に入り解除";
            this.classList.remove("favorite-btn");
            this.classList.add("unfavorite-btn");
          } else {
            console.log("お気に入りが解除されました");
            this.textContent = "♡ お気に入り";
            this.classList.remove("unfavorite-btn");
            this.classList.add("favorite-btn");
          }
        })
        .catch(error => {
          console.error("エラーが発生しました:", error);
        });
      });
    });
  });
  