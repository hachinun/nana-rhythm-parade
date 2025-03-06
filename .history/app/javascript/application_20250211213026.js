//= require favorite
document.addEventListener("DOMContentLoaded", function () {
  const videoItems = document.querySelectorAll('.video');
  let player = null;
  let currentVideoIndex = 0;
  let isVideoEnded = false; // 動画終了フラグ
  let isPlayerReady = false; // プレーヤーが準備完了しているかのフラグ

  // YT APIがロードされていない場合、ロードする
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

  // YouTube APIの準備ができたら呼ばれる関数
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

  // 最初の動画をロードして再生
  function loadFirstVideo() {
    const firstVideoItem = videoItems[currentVideoIndex];
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
      
      // 最初の動画を再生
      playVideo(videoId, startSeconds, endSeconds, title, artist);
    }
  }

  // 動画アイテムがクリックされた時の処理
  videoItems.forEach(function (item, index) {
    item.addEventListener('click', function (event) {
      // 親要素へのイベント伝播を停止
      event.stopPropagation();

      // お気に入りボタンがクリックされた場合は処理しない
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

  // 動画を再生する関数
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

  // プレーヤーの状態が変更された時の処理
  function onPlayerStateChange(event) {
    console.log("🎬 プレーヤーの状態が変更されました:", event.data);

    if (event.data === YT.PlayerState.ENDED) {
      console.log("⏭️ 動画終了、次の動画へ進みます。");

      // 動画終了後に次の動画を選ぶ
      if (isPlayerReady) {
        isPlayerReady = false;  // 再生後に一度フラグをリセット
        const nextItem = getNextVideo();
        if (nextItem) {
          currentVideoIndex++; // 次の動画のインデックスに進める
          console.log(`📺 次の動画が見つかりました: ${nextItem.getAttribute('data-video-id')}`);
          nextItem.click();  // 次の動画をクリックして再生
        } else {
          console.log("🚫 次の動画が見つかりません。");
        }
      }
    } else if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.PAUSED) {
      // 再生中や一時停止状態にすることで、動画が進んだフラグをリセット
      isPlayerReady = true;
    }
  }

  // 次の動画を取得する関数
  function getNextVideo() {
    const nextIndex = currentVideoIndex + 1;
    return nextIndex < videoItems.length ? videoItems[nextIndex] : null;
  }

  // YT APIをロード
  loadYouTubeAPI();

  // お気に入りボタンのクリック処理
  const favoriteButtons = document.querySelectorAll('.favorite-btn, .unfavorite-btn');
  
  favoriteButtons.forEach(button => {
    button.addEventListener('click', function(event) {
      const button = event.target;
      const videoId = button.getAttribute('data-video-id');
      const url = `/videos/${videoId}/favorites/toggle`;

      // お気に入りボタンを非同期で更新
      fetch(url, {
        method: 'POST',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('ネットワークエラーが発生しました');
        }
        return response.json();
      })
      .then(data => {
        // ステータスに基づいてボタンの状態を変更
        if (data.status === 'added') {
          button.textContent = '❤️ お気に入り解除';
          button.classList.remove('favorite-btn');
          button.classList.add('unfavorite-btn');
        } else {
          button.textContent = '♡ お気に入り';
          button.classList.remove('unfavorite-btn');
          button.classList.add('favorite-btn');
        }
      })
      .catch(error => console.error('Error:', error));
    });
  });
});
