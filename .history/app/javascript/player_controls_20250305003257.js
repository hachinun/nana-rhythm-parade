document.addEventListener("DOMContentLoaded", function () {
  const shuffleBtn = document.getElementById("shuffle-btn");
  let isShuffleMode = false;  // ランダム再生モードの管理
  let currentVideoIndex = 0;  // 現在再生中の動画のインデックス

  // フィルタリングされた動画リストを管理する
  window.filteredVideos = [];

  // YouTube プレイヤーのセットアップ
  let player;

  // ランダム再生モードの切り替え
  shuffleBtn.addEventListener("click", function () {
      isShuffleMode = !isShuffleMode;
      console.log(isShuffleMode ? "ランダム再生モード" : "順番通り再生モード");
      playNextVideo(); // モード切り替え後に次の動画を再生
  });

  // 動画の再生が終了したら次の動画を再生
  function playNextVideo() {
      if (window.filteredVideos.length === 0) return;

      if (isShuffleMode) {
          currentVideoIndex = Math.floor(Math.random() * window.filteredVideos.length);
      } else {
          currentVideoIndex = (currentVideoIndex + 1) % window.filteredVideos.length;
      }

      const nextVideo = window.filteredVideos[currentVideoIndex];
      const videoId = nextVideo.getAttribute("data-video-id");

      // YouTubeプレイヤーで次の動画をロード
      if (player) {
          player.loadVideoById(videoId);
          console.log(`次の動画を再生: ${videoId}`);
      }
  }

  // YouTube Player APIが準備完了したら呼ばれる
  window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('current-video iframe', {
      videoId: window.filteredVideos[currentVideoIndex].getAttribute("data-video-id"),
      playerVars: {
        autoplay: 1,
        controls: 1,
        rel: 0,
        modestbranding: 1,
        start: 0,
        end: 0
      },
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  };

  // プレイヤーの状態変更時に次の動画を再生
  window.onPlayerStateChange = function(event) {
    if (event.data == YT.PlayerState.ENDED) {
      playNextVideo();  // 動画が終了したら次の動画を再生
    }
  };

  // 動画をクリックするとその動画を再生
  document.querySelectorAll(".video").forEach(videoElement => {
      videoElement.addEventListener("click", function () {
          currentVideoIndex = Array.from(document.querySelectorAll(".video")).indexOf(videoElement);
          playNextVideo(); // 次の動画を再生
      });
  });
});
