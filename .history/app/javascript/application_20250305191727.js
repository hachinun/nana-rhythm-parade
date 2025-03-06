//= require favorite
//= require filter
//= require search
//= require player_controls
document.addEventListener("DOMContentLoaded", function () {
  const videoItems = document.querySelectorAll('.video');
  let player = null;
  let isPlayerReady = false;

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
    iframeContainer.innerHTML = '<div id="yt-player"></div>';
    player = new YT.Player("yt-player", {
      height: '360',
      width: '640',
      events: {
        'onReady': function (event) {
          isPlayerReady = true;
        },
        'onStateChange': onPlayerStateChange
      }
    });
  };

  function loadFirstVideo() {
    const firstVideoItem = document.querySelector('.video');
    if (firstVideoItem) {
      const videoId = firstVideoItem.getAttribute('data-video-id');
      const startSeconds = parseInt(firstVideoItem.getAttribute('data-start-seconds') || 0, 10);
      const endSeconds = firstVideoItem.getAttribute('data-end-seconds') ? parseInt(firstVideoItem.getAttribute('data-end-seconds'), 10) : undefined;
      playVideo(videoId, startSeconds, endSeconds);
    }
  }

  // プレーヤーが準備できた後に動画を再生する
  function playVideo(videoId, startSeconds, endSeconds) {
    if (!player || typeof player.loadVideoById !== "function") {
      console.warn("YouTubeプレーヤーが準備できていません");
      return;
    }
    player.loadVideoById({ videoId: videoId, startSeconds: startSeconds, endSeconds: endSeconds });
  }

  function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ENDED) {
      // 動画が終了したときに次の動画を再生する処理
      const nextItem = getNextVideo();
      if (nextItem) {
        nextItem.click();
      }
    }
  }

  // 次の動画を取得
  function getNextVideo() {
    const currentIndex = Array.from(videoItems).indexOf(document.querySelector('.video.playing'));
    const nextItem = videoItems[currentIndex + 1];
    return nextItem || null;
  }

  // クリックで動画を再生
  videoItems.forEach(item => {
    item.addEventListener('click', function() {
      const videoId = item.getAttribute('data-video-id');
      const startSeconds = parseInt(item.getAttribute('data-start-seconds') || 0, 10);
      const endSeconds = item.getAttribute('data-end-seconds') ? parseInt(item.getAttribute('data-end-seconds'), 10) : undefined;
      
      if (isPlayerReady) {
        playVideo(videoId, startSeconds, endSeconds);
      } else {
        console.warn("プレーヤーが準備できていません");
      }
      
      // 現在再生中の動画を強調表示
      videoItems.forEach(item => item.classList.remove('playing'));
      item.classList.add('playing');
    });
  });

  // YouTube APIの読み込み
  loadYouTubeAPI();
});
