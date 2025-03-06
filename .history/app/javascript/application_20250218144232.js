//= require favorite
//= require filter
document.addEventListener("DOMContentLoaded", function () {
  const videoItems = document.querySelectorAll('.video');
  let player = null;
  let currentVideoIndex = 0;
  let isVideoEnded = false; // 動画終了フラグ
  let isPlayerReady = false; // プレーヤーが準備完了しているかのフラグ

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

  loadYouTubeAPI();

  // 検索機能の処理
  document.querySelector('input[name="query"]').addEventListener('input', function() {
    const query = this.value.toLowerCase(); // 大文字小文字を区別しない検索にする

    // 現在表示されている動画リストの中で検索
    document.querySelectorAll('.video').forEach(video => {
      const title = video.querySelector('.song-title').innerText.toLowerCase(); // 曲名
      const artist = video.querySelector('.artist').innerText.toLowerCase(); // アーティスト名

      // 検索キーワードが曲名またはアーティスト名に含まれているか
      if (title.includes(query) || artist.includes(query)) {
        video.style.display = ""; // 一致した場合は表示
      } else {
        video.style.display = "none"; // 一致しなかった場合は非表示
      }
    });
  });

  attachVideoClickListeners();

  // グローバルに setupFavoriteButtons を定義
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



});
