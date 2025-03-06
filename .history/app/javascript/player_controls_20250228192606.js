let player;
let isPlaying = false;
let isRepeating = false;
let isRandom = false;
let videos = [];
let currentIndex = 0;

// サーバーから動画リストを取得（data-videos属性からJSONをパース）
document.addEventListener('DOMContentLoaded', function() {
  const videoListElement = document.getElementById('video-list');
  if (videoListElement) {
    videos = JSON.parse(videoListElement.getAttribute('data-videos'));
  }
});

// YouTube Player APIが準備完了したら呼ばれる
function onYouTubeIframeAPIReady() {
  player = new YT.Player('current-video iframe', {
    videoId: videos[currentIndex].videoId,
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
}

// YouTubeプレーヤーの状態が変更されたときに呼ばれる
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    document.getElementById('play-btn').innerHTML = '⏸️'; // 一時停止アイコン
  } else if (event.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    document.getElementById('play-btn').innerHTML = '▶️'; // 再生アイコン
  } else if (event.data === YT.PlayerState.ENDED) {
    if (isRepeating) {
      player.playVideo();
    } else if (isRandom) {
      playRandomVideo();
    }
  }
}

// 再生ボタンのクリックイベント
document.getElementById('play-btn').addEventListener('click', function() {
  if (isPlaying) {
    player.pauseVideo();
  } else {
    player.playVideo();
  }
});

// リピートボタンのクリックイベント
document.getElementById('repeat-btn').addEventListener('click', function() {
  isRepeating = !isRepeating;
  if (isRepeating) {
    this.style.backgroundColor = '#333'; // オンの状態
  } else {
    this.style.backgroundColor = ''; // オフの状態
  }
});

// ランダムボタンのクリックイベント
document.getElementById('shuffle-btn').addEventListener('click', function() {
  isRandom = !isRandom;
  if (isRandom) {
    this.style.backgroundColor = '#333'; // オンの状態
  } else {
    this.style.backgroundColor = ''; // オフの状態
  }
});

// ランダム再生の実装
function playRandomVideo() {
  let randomIndex = Math.floor(Math.random() * videos.length);
  let videoId = videos[randomIndex].videoId;
  player.loadVideoById(videoId);
  currentIndex = randomIndex;
}
