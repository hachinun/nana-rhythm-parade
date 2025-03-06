document.addEventListener("DOMContentLoaded", function() {
    const videoItems = document.querySelectorAll(".video-item"); // サムネイルの動画リストを選択
    const currentVideoContainer = document.getElementById("current-video"); // 現在の動画表示部分
  
    videoItems.forEach(function(item) {
      item.addEventListener("click", function() {
        const videoId = item.getAttribute("data-video-id");
        const songTitle = item.getAttribute("data-song-title");
        const artist = item.getAttribute("data-artist");
        const startSeconds = item.getAttribute("data-start-seconds");
        const endSeconds = item.getAttribute("data-end-seconds");
  
        // 現在の動画情報を更新
        currentVideoContainer.innerHTML = `
          <h1>${songTitle} - ${artist}</h1>
          <iframe width="560" height="315" 
            src="https://www.youtube.com/embed/${videoId}?start=${startSeconds}&end=${endSeconds}" 
            frameborder="0" allowfullscreen>
          </iframe>
        `;
      });
    });
  });
  