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
            this.closest(".video-item").dataset.favorite = "true";
          } else {
            console.log("お気に入りが解除されました");
            this.textContent = "♡ お気に入り";
            this.classList.remove("unfavorite-btn");
            this.classList.add("favorite-btn");
            this.closest(".video-item").dataset.favorite = "false";
          }
        })
        .catch(error => {
          console.error("エラーが発生しました:", error);
        });
      });
    });
  
    // お気に入りフィルターの機能追加
    const toggleFavoritesButton = document.getElementById("toggle-favorites");
    if (toggleFavoritesButton) {
      toggleFavoritesButton.addEventListener("click", function() {
        console.log("お気に入りフィルターがクリックされました");
        
        let showFavorites = this.classList.toggle("active"); // ボタンの状態を切り替え
        console.log("お気に入りのみ表示:", showFavorites);
  
        // 動画リストの各要素を取得
        let videos = document.querySelectorAll(".video-item"); // `.video-item` は各動画のラップ要素のクラスとする
  
        videos.forEach(video => {
          let isFavorite = video.dataset.favorite === "true"; // data属性でお気に入り情報を保持
          if (showFavorites && !isFavorite) {
            video.style.display = "none";
          } else {
            video.style.display = "";
          }
        });
  
        // ボタンのテキストを変更
        this.textContent = showFavorites ? "すべて表示" : "お気に入りのみ表示";
      });
    } else {
      console.log("お気に入りフィルターボタンが見つかりません");
    }
  });
  