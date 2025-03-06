document.addEventListener("DOMContentLoaded", function () {
    const filterStart0 = document.getElementById("filter-start-0");
    const filterStartNonZero = document.getElementById("filter-start-nonzero");
    const videoList = document.getElementById("video-list");
  
    function filterVideos(condition) {
      document.querySelectorAll(".video-item").forEach((video) => {
        const startSeconds = parseInt(video.dataset.startSeconds, 10);
        if (condition(startSeconds)) {
          video.style.display = "";
        } else {
          video.style.display = "none";
        }
      });
    }
  
    filterStart0.addEventListener("click", function () {
      filterVideos((startSeconds) => startSeconds === 0);
    });
  
    filterStartNonZero.addEventListener("click", function () {
      filterVideos((startSeconds) => startSeconds !== 0);
    });
  });
  