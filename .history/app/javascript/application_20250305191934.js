//= require favorite
//= require filter
//= require search
//= require player_controls
document.addEventListener("DOMContentLoaded", function () {
  const videoItems = document.querySelectorAll('.video');
  let player = null;
  let currentVideoIndex = 0;
  let isVideoEnded = false;
  let isPlayerReady = false;
  let isRandomMode = false; // ランダム再生モードのフラグ
  let isRepeatMode = false; // リピートモードのフラグ
  
  function loadYouTubeAPI() {
    if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
      console.warn("⚠️ YT APIが見つかりません、スクリプトをロードしています...");
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      console.log("✅ YT APIがすでにロードされています。プレーヤーを初期化します。");
      if (!player) onYouTubeIframeAPIReady();
    }
  }

  window.onYouTubeIframeAPIReady = function () {
    if (player) {
      console.log("✅ YouTubeプレーヤーはすでに初期化されています。");
      return;
    }

    console.log("🎬 YouTubeプレーヤーを初期化中...");
    const iframeContainer = document.querySelector('#current-video');
    if (!iframeContainer) {
      console.error("❌ エラー: #current-video 要素が見つかりません");
      return;
    }

    iframeContainer.innerHTML = '<div id="yt-player"></div>';
    player = new YT.Player("yt-player", {
      height: '360',
      width: '640',
      events: {
        'onReady': function (event) {
          console.log("✅ YouTubeプレーヤーが準備完了！");
          isPlayerReady = true;
          loadFirstVideo();
          setupFavoriteButtons();
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
      const titleElement = firstVideoItem.querySelector('.song-title');
      const artistElement = firstVideoItem.querySelector('.artist');

      if (!titleElement || !artistElement) {
        console.error("❌ エラー: .song-title または .artist 要素が見つかりません");
        return;
      }

      const title = titleElement.innerText;
      const artist = artistElement.innerText;

      console.log(`🎵 再生中: ${title} by ${artist}`);
      console.log(`📺 動画の読み込み: ${videoId}`);
      
      playVideo(videoId, startSeconds, endSeconds, title, artist);
    }
  }

  function attachVideoClickListeners() {
    const videoItems = document.querySelectorAll('.video');

    videoItems.forEach(function (item, index) {
      item.addEventListener('click', function (event) {
        event.stopPropagation();

        if (event.target.closest('.favorite-button')) {
          return;
        }

        const videoId = item.getAttribute('data-video-id');
        const startSeconds = parseInt(item.getAttribute('data-start-seconds') || 0, 10);
        const endSeconds = item.getAttribute('data-end-seconds') ? parseInt(item.getAttribute('data-end-seconds'), 10) : undefined;
        const titleElement = item.querySelector('.song-title');
        const artistElement = item.querySelector('.artist');

        if (!titleElement || !artistElement) {
          console.error("❌ エラー: .song-title または .artist 要素が見つかりません");
          return;
        }

        const title = titleElement.innerText;
        const artist = artistElement.innerText;

        console.log(`🎵 再生中: ${title} by ${artist}`);
        console.log(`📺 動画の読み込み: ${videoId}`);

        if (!player || typeof player.loadVideoById !== "function") {
          console.warn("⚠️ YouTubeプレーヤーが準備できていません、再試行します...");
          setTimeout(() => playVideo(videoId, startSeconds, endSeconds, title, artist), 500);
          return;
        }

        playVideo(videoId, startSeconds, endSeconds, title, artist);
        currentVideoIndex = index;
      });
    });
  }

  function playVideo(videoId, startSeconds, endSeconds, title, artist) {
    if (!player || typeof player.loadVideoById !== "function") {
      console.error("❌ 無効なプレーヤーインスタンスまたはプレーヤーが正しく初期化されていません。");
      return;
    }

    console.log(`✅ 動画の読み込み: ${videoId}`);
    player.loadVideoById({
      videoId: videoId,
      startSeconds: startSeconds,
      endSeconds: endSeconds
    });
  }

  function onPlayerStateChange(event) {
    console.log("🎬 プレーヤーの状態が変更されました:", event.data);

    if (event.data === YT.PlayerState.ENDED) {
      console.log("⏭️ 動画終了、次の動画へ進みます。");

      if (isRepeatMode) {
        // リピートモードがオンの場合、現在の動画を最初から再生
        const currentItem = videoItems[currentVideoIndex];
        const videoId = currentItem.getAttribute('data-video-id');
        const startSeconds = parseInt(currentItem.getAttribute('data-start-seconds') || 0, 10);
        const endSeconds = currentItem.getAttribute('data-end-seconds') ? parseInt(currentItem.getAttribute('data-end-seconds'), 10) : undefined;
        playVideo(videoId, startSeconds, endSeconds, currentItem.querySelector('.song-title').innerText, currentItem.querySelector('.artist').innerText);
      } else {
        // 次の動画を再生
        if (isPlayerReady) {
          isPlayerReady = false;
          const nextItem = getNextVideo();
          if (nextItem) {
            currentVideoIndex++;
            console.log(`📺 次の動画が見つかりました: ${nextItem.getAttribute('data-video-id')}`);
            nextItem.click();
          } else {
            console.log("🚫 次の動画が見つかりません。");
          }
        }
      }
    } else if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.PAUSED) {
      isPlayerReady = true;
    }
  }

  function getNextVideo() {
    let nextItem = null;

    if (isRandomMode) {
      const randomIndex = Math.floor(Math.random() * videoItems.length);
      nextItem = videoItems[randomIndex];
    } else {
      const nextIndex = currentVideoIndex + 1;
      nextItem = nextIndex < videoItems.length ? videoItems[nextIndex] : null;
    }

    return nextItem;
  }

  function setupFavoriteButtons() {
    console.log("setupFavoriteButtons が実行されました");

    const buttons = document.querySelectorAll(".favorite-button button");

    if (buttons.length === 0) {
      console.warn("⚠️ お気に入りボタンが見つかりません");
    } else {
      console.log(`✅ ${buttons.length} 個のボタンが見つかりました`);
    }

    buttons.forEach(button => {
      if (!button.hasAttribute("data-listener")) {
        console.log(`🟢 ボタン(${button.dataset.videoId}) にイベントを設定`);
        button.addEventListener("click", favoriteButtonClickHandler);
        button.setAttribute("data-listener", "true");
      }
    });
  }

  // シャッフルボタン
  const shuffleButton = document.querySelector("#shuffle-btn");
  if (shuffleButton) {
    shuffleButton.addEventListener("click", function () {
      isRandomMode = !isRandomMode;
      console.log(`ランダム再生モード: ${isRandomMode ? "ON" : "OFF"}`);
    });
  }

  // リピートボタン
  const repeatButton = document.querySelector("#repeat-btn");
  if (repeatButton) {
    repeatButton.addEventListener("click", function () {
      isRepeatMode = !isRepeatMode;
      console.log(`リピートモード: ${isRepeatMode ? "ON" : "OFF"}`);
    });
  }

  // 再生/停止ボタン
  const playButton = document.querySelector("#play-btn");
  if (playButton) {
    playButton.addEventListener("click", function () {
      if (player) {
        if (player.getPlayerState() === YT.PlayerState.PAUSED || player.getPlayerState() === YT.PlayerState.ENDED) {
          console.log("▶️ 再生します...");
          player.playVideo();
        } else if (player.getPlayerState() === YT.PlayerState.PLAYING) {
          console.log("⏸️ 停止します...");
          player.pauseVideo();
        }
      }
    });
  }

  // 次の曲に進むボタン
const nextButton = document.querySelector("#next-btn");
if (nextButton) {
  nextButton.addEventListener("click", function () {
    const nextItem = getNextVideo();
    if (nextItem) {
      currentVideoIndex++;
      console.log(`⏭️ 次の動画へ: ${nextItem.getAttribute('data-video-id')}`);
      nextItem.click();
    } else {
      console.log("🚫 次の動画が見つかりません。");
    }
  });
}


  loadYouTubeAPI();
  attachVideoClickListeners();
});
