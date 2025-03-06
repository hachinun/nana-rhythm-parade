//= require favorite
//= require filter
//= require search
//= require player_controls
document.addEventListener("DOMContentLoaded", function () {
  const videoItems = document.querySelectorAll('.video');
  let filteredVideos = Array.from(videoItems); // フィルタ適用後の動画リスト
  let player = null;
  let currentVideoIndex = 0;
  let isPlayerReady = false;
  let isRandomMode = false;
  let isRepeatMode = false;

  function loadYouTubeAPI() {
    if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      if (!player) onYouTubeIframeAPIReady();
    }
  }

  window.onYouTubeIframeAPIReady = function () {
    if (player) return;

    const iframeContainer = document.querySelector('#current-video');
    if (!iframeContainer) return;

    iframeContainer.innerHTML = '<div id="yt-player"></div>';
    player = new YT.Player("yt-player", {
      height: '360',
      width: '640',
      events: {
        'onReady': function () {
          isPlayerReady = true;
          loadFirstVideo();
          setupFavoriteButtons();
        },
        'onStateChange': onPlayerStateChange
      }
    });
  };

  function loadFirstVideo() {
    if (filteredVideos.length > 0) {
      playVideoFromElement(filteredVideos[0]);
      currentVideoIndex = 0;
    }
  }

  function playVideoFromElement(videoElement) {
    const videoId = videoElement.getAttribute('data-video-id');
    const startSeconds = parseInt(videoElement.getAttribute('data-start-seconds') || 0, 10);
    const endSeconds = videoElement.getAttribute('data-end-seconds') ? parseInt(videoElement.getAttribute('data-end-seconds'), 10) : undefined;
    const title = videoElement.querySelector('.song-title').innerText;
    const artist = videoElement.querySelector('.artist').innerText;

    playVideo(videoId, startSeconds, endSeconds, title, artist);
  }

  function playVideo(videoId, startSeconds, endSeconds, title, artist) {
    if (!player || typeof player.loadVideoById !== "function") return;

    player.loadVideoById({
      videoId: videoId,
      startSeconds: startSeconds,
      endSeconds: endSeconds
    });
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      if (isRepeatMode) {
        playVideoFromElement(filteredVideos[currentVideoIndex]);
      } else {
        playNextVideo();
      }
    }
  }

  function playNextVideo() {
    const nextItem = getNextVideo();
    if (nextItem) {
      currentVideoIndex = filteredVideos.indexOf(nextItem);
      playVideoFromElement(nextItem);
    }
  }

  function getNextVideo() {
    if (filteredVideos.length === 0) return null;
    if (isRandomMode) {
      return filteredVideos[Math.floor(Math.random() * filteredVideos.length)];
    }
    return filteredVideos[currentVideoIndex + 1] || null;
  }

  function updateFilteredVideos(newList) {
    filteredVideos = newList;
    currentVideoIndex = 0;
    if (filteredVideos.length > 0) {
      playVideoFromElement(filteredVideos[0]);
    }
  }

  document.querySelector("#shuffle-btn")?.addEventListener("click", function () {
    isRandomMode = !isRandomMode;
  });

  document.querySelector("#repeat-btn")?.addEventListener("click", function () {
    isRepeatMode = !isRepeatMode;
  });

  document.querySelector("#play-btn")?.addEventListener("click", function () {
    if (player) {
      if (player.getPlayerState() === YT.PlayerState.PAUSED || player.getPlayerState() === YT.PlayerState.ENDED) {
        player.playVideo();
      } else if (player.getPlayerState() === YT.PlayerState.PLAYING) {
        player.pauseVideo();
      }
    }
  });

  document.querySelector("#next-btn")?.addEventListener("click", function () {
    playNextVideo();
  });

  loadYouTubeAPI();
});
