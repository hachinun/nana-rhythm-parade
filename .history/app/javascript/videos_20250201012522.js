// app/assets/javascripts/videos.js

document.addEventListener('DOMContentLoaded', function () {
    const videoItems = document.querySelectorAll('.video-item');  // 動画の一覧アイテム
    const iframe = document.getElementById('current-video-iframe');  // 再生する動画を表示する iframe
    const videoTitle = document.querySelector('#current-video h1');  // 動画タイトルを表示する要素
  
    // 各動画アイテムにクリックイベントを設定
    videoItems.forEach(item => {
      item.addEventListener('click', function () {
        // クリックしたアイテムから動画のデータを取得
        const videoId = item.getAttribute('data-video-id');
        const songTitle = item.getAttribute('data-song-title');
        const artist = item.getAttribute('data-artist');
        const startSeconds = item.getAttribute('data-start-seconds');
        const endSeconds = item.getAttribute('data-end-seconds');
  
        // iframe の src を変更して動画を切り替え
        iframe.src = `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&end=${endSeconds}`;
        
        // 動画タイトルとアーティストを更新
        videoTitle.innerHTML = `${songTitle} - ${artist}`;
      });
    });
  });
  