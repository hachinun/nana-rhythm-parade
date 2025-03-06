//= require favorite
//= require filter
//= require search
//= require player_controls
document.addEventListener("DOMContentLoaded", function () {
  const videoItems = document.querySelectorAll('.video');
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
    } else if (!player) {
      onYouTubeIframeAPIReady();
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
          setupButtons();
        },
        'onStateChange': onPlayerStateChange
      }
    });
  };

  function loadFirstVideo() {
    const firstVideoItem = document.querySelector('.video');
    if (firstVideoItem) {
      playVideoFromElement(firstVideoItem);
    }
  }

  function playVideoFromElement(item) {
    const videoId = item.getAttribute('data-video-id');
    const startSeconds = parseInt(item.getAttribute('data-start-seconds') || 0, 10);
    const endSeconds = item.getAttribute('data-end-seconds') ? parseInt(item.getAttribute('data-end-seconds'), 10) : undefined;
    const title = item.querySelector('.song-title')?.innerText || "Unknown";
    const artist = item.querySelector('.artist')?.innerText || "Unknown";

    playVideo(videoId, startSeconds, endSeconds, title, artist);
    currentVideoIndex = [...videoItems].indexOf(item);
  }

  function playVideo(videoId, startSeconds, endSeconds, title, artist) {
    if (!player) return;
    player.loadVideoById({ videoId, startSeconds, endSeconds });
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      if (isRepeatMode) {
        playVideoFromElement(videoItems[currentVideoIndex]);
      } else {
        const nextItem = getNextVideo();
        if (nextItem) {
          playVideoFromElement(nextItem);
        }
      }
    }
  }

  function getNextVideo() {
    if (isRandomMode) {
      return videoItems[Math.floor(Math.random() * videoItems.length)];
    }
    return videoItems[currentVideoIndex + 1] || null;
  }

  function setupButtons() {
    const buttons = [
      { selector: "#shuffle-btn", action: () => { isRandomMode = !isRandomMode; } },
      { selector: "#repeat-btn", action: () => { isRepeatMode = !isRepeatMode; } },
      { selector: "#play-btn", action: togglePlayPause },
      { selector: "#next-btn", action: playNextVideo }
    ];

    buttons.forEach(({ selector, action }) => {
      const button = document.querySelector(selector);
      if (button && !button.hasAttribute("data-listener")) {
        button.addEventListener("click", action);
        button.setAttribute("data-listener", "true");
      }
    });
  }

  function togglePlayPause() {
    if (!player) return;
    const state = player.getPlayerState();
    if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
      player.playVideo();
    } else if (state === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    }
  }

  function playNextVideo() {
    const nextItem = getNextVideo();
    if (nextItem) {
      playVideoFromElement(nextItem);
    }
  }

  loadYouTubeAPI();
});
