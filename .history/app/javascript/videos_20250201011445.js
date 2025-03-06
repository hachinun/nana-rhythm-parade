// app/assets/javascripts/videos.js
document.addEventListener('DOMContentLoaded', function () {
    const videoItems = document.querySelectorAll('.video-item');
    const iframe = document.getElementById('current-video-iframe');
    const videoTitle = document.querySelector('#current-video h1');
  
    videoItems.forEach(item => {
      item.addEventListener('click', function () {
        const videoId = item.getAttribute('data-video-id');
        const songTitle = item.getAttribute('data-song-title');
        const artist = item.getAttribute('data-artist');
        const startSeconds = item.getAttribute('data-start-seconds');
        const endSeconds = item.getAttribute('data-end-seconds');
  
        iframe.src = `https://www.youtube.com/embed/${videoId}?start=${startSeconds}&end=${endSeconds}`;
        videoTitle.innerHTML = `${songTitle} - ${artist}`;
      });
    });
  });
  