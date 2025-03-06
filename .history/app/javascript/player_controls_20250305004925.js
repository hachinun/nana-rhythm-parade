function onPlayerStateChange(event) {
  let isPlayerReady = false; // プレーヤーが準備完了しているかのフラグ
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
