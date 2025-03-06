document.addEventListener("DOMContentLoaded", function() {
    // 動画のサムネイルをクリックしたとき
    const videoItems = document.querySelectorAll('.video-item');
  
    videoItems.forEach(item => {
      item.addEventListener('click', function() {
        const videoId = item.getAttribute('data-video-id');
        const songTitle = item.getAttribute('data-song-title');
        const artist = item.getAttribute('data-artist');
        const startSeconds = item.getAttribute('data-start-seconds');
        const endSeconds = item.getAttribute('data-end-seconds');
        
        console.log("Clicked video:", songTitle, artist, videoId, startSeconds, endSeconds);
  
        // 現在表示されている動画を更新
        const currentVideoElement = document.getElementById('current-video');
        currentVideoElement.innerHTML = `
          <h1>${songTitle} - ${artist}</h1>
          <iframe width="560" height="315" 
            src="https://www.youtube.com/embed/${videoId}?start=${startSeconds}&end=${endSeconds}" 
            frameborder="0" allowfullscreen>
          </iframe>
        `;
      });
    });
  });
  