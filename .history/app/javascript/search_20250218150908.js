document.querySelector('#search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // フォームのデフォルト送信動作を無効化
  
    const query = document.querySelector('input[name="query"]').value.toLowerCase(); // 検索キーワードを取得
  
    // 現在表示されている動画リストの中で検索
    const visibleVideos = document.querySelectorAll('.video:not([style*="display: none"])'); // フィルタ後の表示されている動画のみを対象に検索
  
    visibleVideos.forEach(video => {
      const title = video.querySelector('.song-title').innerText.toLowerCase(); // 曲名
      const artist = video.querySelector('.artist').innerText.toLowerCase(); // アーティスト名
  
      // 検索キーワードが曲名またはアーティスト名に含まれているか
      if (title.includes(query) || artist.includes(query)) {
        video.style.display = ""; // 一致した場合は表示
      } else {
        video.style.display = "none"; // 一致しなかった場合は非表示
      }
    });
  });
  