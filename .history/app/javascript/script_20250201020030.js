// script.js

document.addEventListener("DOMContentLoaded", function() {
    // 動画のクリックイベントを処理
    const videoItems = document.querySelectorAll('.video-item'); // .video-itemは動画のサムネイルのクラス名
  
    videoItems.forEach(function(item) {
      item.addEventListener('click', function() {
        // 動画の情報を取得
        const videoId = item.getAttribute('data-video-id');
        const startSeconds = item.getAttribute('data-start-seconds');
        const endSeconds = item.getAttribute('data-end-seconds');
        
        // 動画のURLを変更して、iframeを再ロード
        const iframe = document.querySelector('#current-video iframe');
        iframe.src = `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&end=${endSeconds}`;
        
        // 現在表示されている動画タイトルとアーティストを更新
        const title = item.querySelector('.song-title').innerText;
        const artist = item.querySelector('.artist').innerText;
        const videoTitle = document.querySelector('#current-video h1');
        videoTitle.innerHTML = `${title} - ${artist}`;
      });
    });
  });
  