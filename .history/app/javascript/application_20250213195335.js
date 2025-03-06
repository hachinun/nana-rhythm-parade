//= require favorite
document.addEventListener("DOMContentLoaded", function () {
  const videoItems = document.querySelectorAll('.video');
  let player = null;
  let currentVideoIndex = 0;
  let isVideoEnded = false;
  let isPlayerReady = false;

  // お気に入り状態を保持するオブジェクト
  const favoriteStates = {};

  // YouTube APIの読み込み
  function loadYouTubeAPI() {
    if (typeof YT === "undefined" || typeof YT.Player === "undefined") {
      console.warn("⚠️ YT APIが見つかりません、スクリプトをロードしています...");
      let tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    } else {
      console.log("✅ YT APIがすでにロードされています。プレーヤーを初期化します。");
      onYouTubeIframeAPIReady();
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
        },
        'onStateChange': onPlayerStateChange
      }
    });
  };

  // 最初の動画を読み込む
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

  // 動画クリックイベントを設定
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

  // 動画を再生
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

  // プレーヤーの状態変更イベント
  function onPlayerStateChange(event) {
    console.log("🎬 プレーヤーの状態が変更されました:", event.data);

    if (event.data === YT.PlayerState.ENDED) {
      console.log("⏭️ 動画終了、次の動画へ進みます。");

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
    } else if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.PAUSED) {
      isPlayerReady = true;
    }
  }

  // 次の動画を取得
  function getNextVideo() {
    const videoItems = document.querySelectorAll('.video');
    const nextIndex = currentVideoIndex + 1;
    return nextIndex < videoItems.length ? videoItems[nextIndex] : null;
  }

  // お気に入りの状態を保存する
  function saveFavoriteState() {
    document.querySelectorAll('.favorite-button').forEach(function(button) {
      const videoId = button.closest('.video').getAttribute('data-video-id');
      favoriteStates[videoId] = button.classList.contains('is-favorite');
    });
  }

  // 検索後にお気に入り状態を適用する
  function restoreFavoriteState() {
    document.querySelectorAll('.favorite-button').forEach(function(button) {
      const videoId = button.closest('.video').getAttribute('data-video-id');
      if (favoriteStates[videoId]) {
        button.classList.add('is-favorite');
      } else {
        button.classList.remove('is-favorite');
      }
    });
  }

  // 検索機能
  document.querySelector('input[name="query"]').addEventListener('input', function() {
    const query = this.value;

    saveFavoriteState(); // 検索前に現在の状態を保存

    fetch(`/videos?query=${query}`)
      .then(response => response.text())
      .then(html => {
        const videoListContainer = document.querySelector('#video-list');
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newVideoList = doc.querySelector('#video-list').innerHTML;

        videoListContainer.innerHTML = newVideoList;

        attachVideoClickListeners(); // 新しいリストにクリックイベントを適用
        restoreFavoriteState(); // お気に入り状態を復元
      });
  });

  attachVideoClickListeners();
  loadYouTubeAPI();
});
