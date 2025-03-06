document.addEventListener("DOMContentLoaded", function () {
  let filteredVideos = []; // フィルタリング後の動画リストを保存

  // 検索機能の処理
  document.querySelector('input[name="query"]').addEventListener('input', function() {
    const query = this.value.toLowerCase(); // 検索キーワードを小文字で扱う

    if (query === "") {
      // 文字を消した場合はフィルタリング後の全ての動画を表示
      filteredVideos.forEach(video => {
        video.style.display = "";
      });
    } else {
      // 検索キーワードに一致する動画のみ表示
      filteredVideos.forEach(video => {
        const title = video.querySelector('.song-title').innerText.toLowerCase(); // 曲名
        const artist = video.querySelector('.artist').innerText.toLowerCase(); // アーティスト名

        // 曲名またはアーティスト名に検索キーワードが含まれていれば表示
        if (title.includes(query) || artist.includes(query)) {
          video.style.display = ""; // 一致した場合は表示
        } else {
          video.style.display = "none"; // 一致しなければ非表示
        }
      });
    }
  });

  // 検索ボタンやEnterキーでのフォーム送信を防止
  document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // ページ遷移を防ぐ
  });

  // フィルタリングしていない場合、show-all を適用
  function applySearch(query) {
    if (filteredVideos.length === 0) {
      // フィルタリングしていない場合は show-all を適用
      filteredVideos.forEach(video => {
        video.style.display = ""; // 全て表示
      });
    }
    
    // 検索処理
    filteredVideos.forEach(video => {
      const title = video.querySelector('.song-title').innerText.toLowerCase(); // 曲名
      const artist = video.querySelector('.artist').innerText.toLowerCase(); // アーティスト名

      if (title.includes(query) || artist.includes(query)) {
        video.style.display = ""; // 一致した場合は表示
      } else {
        video.style.display = "none"; // 一致しなければ非表示
      }
    });
  }

  // 検索バーに入力した文字で検索
  document.querySelector('input[name="query"]').addEventListener('input', function() {
    const query = this.value.toLowerCase(); // 小文字で統一
    applySearch(query); // 検索実行
  });
});
