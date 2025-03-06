// app/javascript/videos.js
document.addEventListener("DOMContentLoaded", () => {
    const videos = document.querySelectorAll(".video");
  
    videos.forEach(video => {
      video.addEventListener("click", () => {
        const videoId = video.dataset.videoId;
        const songTitle = video.dataset.songTitle;
        const artist = video.dataset.artist;
        
        console.log(`Playing: ${songTitle} by ${artist}`);
        
        const iframe = document.querySelector("#current-video iframe");
        iframe.src = `https://www.youtube.com/embed/${videoId}`;
      });
    });
  });
  
