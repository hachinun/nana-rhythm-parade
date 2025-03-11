//= require favorite
//= require filter
//= require search
//= require openclose

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
          setupEventListeners();
        },
        'onStateChange': onPlayerStateChange
      }
    });
  };

  function loadFirstVideo() {
    const firstVideoItem = document.querySelector('.video');
    if (firstVideoItem) playVideoFromItem(firstVideoItem);
  }

  function attachVideoClickListeners() {
    videoItems.forEach((item, index) => {
      item.dataset.index = index;
      item.removeEventListener('click', videoClickHandler);
      item.addEventListener('click', videoClickHandler);
    });
  }

  function videoClickHandler(event) {
    if (event.target.closest('.favorite-button')) return;
    currentVideoIndex = parseInt(this.dataset.index, 10);
    playVideoFromItem(this);
  }

  function playVideoFromItem(item) {
    const videoId = item.getAttribute('data-video-id');
    const startSeconds = parseInt(item.getAttribute('data-start-seconds') || 0, 10);
    const endSeconds = item.getAttribute('data-end-seconds') ? parseInt(item.getAttribute('data-end-seconds'), 10) : undefined;
    playVideo(videoId, startSeconds, endSeconds);
  }

  function playVideo(videoId, startSeconds, endSeconds) {
    if (!player || typeof player.loadVideoById !== "function") return;
    player.loadVideoById({ videoId, startSeconds, endSeconds });
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      if (isRepeatMode) {
        playVideoFromItem(videoItems[currentVideoIndex]);
      } else {
        const nextItem = getNextVideo();
        if (nextItem) {
          currentVideoIndex++;
          nextItem.click();
        }
      }
    }
  }

  function getNextVideo() {
    // If repeat mode is on, return the current video again
    if (isRepeatMode) {
      return videoItems[currentVideoIndex] || null;
    }
  
    // If filteredVideos is empty, handle it based on random mode
    if (!window.filteredVideos || window.filteredVideos.length === 0) {
      if (isRandomMode) {
        // Random mode, pick a random video from videoItems
        return videoItems[Math.floor(Math.random() * videoItems.length)] || null;
      } else {
        // No filteredVideos, return next from videoItems
        const nextIndex = currentVideoIndex + 1;
        return videoItems[nextIndex] || null;
      }
    } else {
      // filteredVideos is not empty
      if (isRandomMode) {
        // Random mode, pick a random video from filteredVideos
        return window.filteredVideos[Math.floor(Math.random() * window.filteredVideos.length)] || null;
      } else {
        // Return next from filteredVideos
        const nextIndex = window.filteredVideos.indexOf(videoItems[currentVideoIndex]) + 1;
        return window.filteredVideos[nextIndex] || null;
      }
    }
  }  

  function setupEventListeners() {
    attachVideoClickListeners();

// Shuffleボタンのクリックイベント
const shuffleButton = document.querySelector("#shuffle-btn");
if (shuffleButton && !shuffleButton.dataset.listener) {
  shuffleButton.addEventListener("click", function () {
    isRandomMode = !isRandomMode;
    toggleButtonState(shuffleButton, isRandomMode);
  });
  shuffleButton.dataset.listener = "true";
}

// Repeatボタンのクリックイベント
const repeatButton = document.querySelector("#repeat-btn");
if (repeatButton && !repeatButton.dataset.listener) {
  repeatButton.addEventListener("click", function () {
    isRepeatMode = !isRepeatMode;
    toggleButtonState(repeatButton, isRepeatMode);
  });
  repeatButton.dataset.listener = "true";
}

// Playボタンのクリックイベント
const playButton = document.querySelector("#play-btn");
if (playButton && !playButton.dataset.listener) {
  playButton.addEventListener("click", function () {
    if (player) {
      const state = player.getPlayerState();
      if (state === YT.PlayerState.PAUSED || state === YT.PlayerState.ENDED) {
        player.playVideo();
        toggleButtonState(playButton, true); // 再生状態をオンにする
        playButton.innerHTML = '<i class="fa-solid fa-pause"></i>'; // 再生中アイコンに変更
      } else if (state === YT.PlayerState.PLAYING) {
        player.pauseVideo();
        toggleButtonState(playButton, false); // 一時停止状態をオフにする
        playButton.innerHTML = '<i class="fa-solid fa-play"></i>'; // 停止中アイコンに変更
      }
    }
  });
  playButton.dataset.listener = "true";
}

// Nextボタンのクリックイベント
const nextButton = document.querySelector("#next-btn");
if (nextButton && !nextButton.dataset.listener) {
  nextButton.addEventListener("click", function () {
    const nextItem = getNextVideo();
    if (nextItem) {
      currentVideoIndex++;
      nextItem.click();
    }
  });
  nextButton.dataset.listener = "true";
}

// ボタンの状態を切り替えるヘルパー関数
function toggleButtonState(button, isActive) {
  if (isActive) {
    button.classList.add("active");
    button.classList.remove("inactive");
  } else {
    button.classList.add("inactive");
    button.classList.remove("active");
  }
}  
  }

  loadYouTubeAPI();
});
