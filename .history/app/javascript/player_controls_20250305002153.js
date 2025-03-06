document.addEventListener("DOMContentLoaded", function () {
  const shuffleBtn = document.getElementById("shuffle-btn");
  let isShuffleMode = false;  // ランダム再生モードの管理
  let currentVideoIndex = 0;  // 現在再生中の動画のインデックス

  // フィルタリングされた動画リストを管理する
  window.filteredVideos = [];

  // 動画の再生が終了したら次の動画を再生
  function playNextVideo() {
      if (window.filteredVideos.length === 0) return;

      if (isShuffleMode) {
          currentVideoIndex = Math.floor(Math.random() * window.filteredVideos.length);
      } else {
          currentVideoIndex = (currentVideoIndex + 1) % window.filteredVideos.length;
      }

      const nextVideo = window.filteredVideos[currentVideoIndex];
      const videoElement = nextVideo.querySelector("video"); // 動画要素を取得
      
      if (videoElement) {
          videoElement.play();
      }
  }

  // ランダム再生モードの切り替え
  shuffleBtn.addEventListener("click", function () {
      isShuffleMode = !isShuffleMode;
      console.log(isShuffleMode ? "ランダム再生モード" : "順番通り再生モード");
      playNextVideo(); // モード切り替え後に動画を再生
  });

  // 動画の終了イベントに次の動画を再生する処理を追加
  document.addEventListener("ended", function (event) {
      if (event.target.tagName.toLowerCase() === "video") {
          playNextVideo();
      }
  });

  // 動画を再生ボタンを押すとその動画を再生
  document.querySelectorAll(".video").forEach(videoElement => {
      videoElement.addEventListener("click", function () {
          playNextVideo(); // 次の動画を再生
      });
  });
});
