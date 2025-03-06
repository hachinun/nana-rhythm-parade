document.addEventListener("DOMContentLoaded", function () {
  const videoItems = document.querySelectorAll('.video');
  let player = null;
  let currentVideoIndex = 0;
  let isVideoEnded = false;
  let isPlayerReady = false;

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

  function getNextVideo() {
    const videoItems = document.querySelectorAll('.video');
    const nextIndex = currentVideoIndex + 1;
    return nextIndex < videoItems.length ? videoItems[nextIndex] : null;
  }

  function setupFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite-button');

    favoriteButtons.forEach(button => {
      const videoId = button.closest('.video').getAttribute('data-video-id');
      if (localStorage.getItem(videoId) === 'true') {
        button.classList.add('favorite');
      } else {
        button.classList.remove('favorite');
      }

      button.addEventListener('click', function(event) {
        event.stopPropagation();
        const isFavorite = button.classList.contains('favorite');
        localStorage.setItem(videoId, !isFavorite);
        button.classList.toggle('favorite', !isFavorite);
      });
    });
  }

  function restoreFavorites() {
    console.log("🎮 お気に入り状態を復元中...");
    const videoItems = document.querySelectorAll('.video');
    videoItems.forEach(item => {
      const videoId = item.getAttribute('data-video-id');
      const favoriteButton = item.querySelector('.favorite-button');
      if (favoriteButton) {
        if (localStorage.getItem(videoId) === 'true') {
          favoriteButton.classList.add('favorite');
        } else {
          favoriteButton.classList.remove('favorite');
        }
      }
    });
  }

  function testFavoriteState() {
    const videoItems = document.querySelectorAll('.video');
    videoItems.forEach(item => {
      const videoId = item.getAttribute('data-video-id');
      const favoriteState = localStorage.getItem(videoId);
      console.log(`Video ID: ${videoId}, Favorite: ${favoriteState}`);
    });
  }

  loadYouTubeAPI();

  document.querySelector('input[name="query"]').addEventListener('input', function() {
    const query = this.value;

    fetch(`/videos?query=${query}`)
      .then(response => response.text())
      .then(html => {
        const videoListContainer = document.querySelector('#video-list');
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const newVideoList = doc.querySelector('#video-list').innerHTML;
        videoListContainer.innerHTML = newVideoList;

        attachVideoClickListeners();
        setupFavoriteButtons();
        restoreFavorites();
        testFavoriteState();  // デバッグのためにお気に入りの状態を確認
      });
  });

  attachVideoClickListeners();
  restoreFavorites();
  testFavoriteState();  // 初期のテスト実行
});
