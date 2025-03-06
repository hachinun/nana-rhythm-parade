document.addEventListener("DOMContentLoaded", function () {
    let currentVideoIndex = 0;
    let isRandomMode = false;  // ランダム再生モードのフラグ
  
    function getNextVideo() {
      let nextItem = null;
  
      if (isRandomMode) {
        // ランダムモード
        const randomIndex = Math.floor(Math.random() * window.filteredVideos.length);
        nextItem = window.filteredVideos[randomIndex];
      } else {
        // 通常モード
        const nextIndex = currentVideoIndex + 1;
        nextItem = nextIndex < window.filteredVideos.length ? window.filteredVideos[nextIndex] : null;
      }
  
      return nextItem;
    }
  
    function playVideo(videoItem) {
      const videoId = videoItem.getAttribute('data-video-id');
      const startSeconds = parseInt(videoItem.getAttribute('data-start-seconds') || 0, 10);
      const endSeconds = videoItem.getAttribute('data-end-seconds') ? parseInt(videoItem.getAttribute('data-end-seconds'), 10) : undefined;
      const titleElement = videoItem.querySelector('.song-title');
      const artistElement = videoItem.querySelector('.artist');
  
      if (!titleElement || !artistElement) {
        console.error("❌ エラー: .song-title または .artist 要素が見つかりません");
        return;
      }
  
      const title = titleElement.innerText;
      const artist = artistElement.innerText;
  
      console.log(`🎵 再生中: ${title} by ${artist}`);
      console.log(`📺 動画の読み込み: ${videoId}`);
      
      if (!player || typeof player.loadVideoById !== "function") {
        console.warn("⚠️ プレーヤーが準備できていません");
        return;
      }
  
      player.loadVideoById({
        videoId: videoId,
        startSeconds: startSeconds,
        endSeconds: endSeconds
      });
    }
  
    // ランダム再生ボタン
    const shuffleButton = document.querySelector("#shuffle-btn");
    if (shuffleButton) {
      shuffleButton.addEventListener("click", function () {
        isRandomMode = !isRandomMode;
        console.log(`ランダム再生モード: ${isRandomMode ? "ON" : "OFF"}`);
        const nextItem = getNextVideo();
        if (nextItem) {
          currentVideoIndex++;
          playVideo(nextItem);
        }
      });
    }
  
    // 次の曲再生ボタン
    const nextButton = document.querySelector("#next-btn");
    if (nextButton) {
      nextButton.addEventListener("click", function () {
        const nextItem = getNextVideo();
        if (nextItem) {
          currentVideoIndex++;
          playVideo(nextItem);
        }
      });
    }
  
    // 初回の動画再生
    function loadFirstVideo() {
      const firstVideoItem = window.filteredVideos[0];  // フィルタリングされた最初の動画
      if (firstVideoItem) {
        playVideo(firstVideoItem);
      } else {
        console.log("🚫 フィルタリングされた動画がありません");
      }
    }
  
    // 初期ロード時に最初の動画を再生
    if (window.filteredVideos.length > 0) {
      loadFirstVideo();
    }
  });
  