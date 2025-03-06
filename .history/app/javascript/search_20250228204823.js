document.addEventListener("DOMContentLoaded", function () {
  // 検索機能の処理
  document.querySelector('input[name="query"]').addEventListener('input', function() {
    const query = this.value.toLowerCase(); // 検索キーワードを小文字で扱う

    // filteredVideos から検索を行う
    if (window.filteredVideos && window.filteredVideos.length > 0) {
      window.filteredVideos.forEach(video => {
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
});
