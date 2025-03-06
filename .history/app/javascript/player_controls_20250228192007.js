// YouTube Player APIが読み込まれた後に呼ばれる関数
let player;
let isPlaying = false;
let isRepeating = false;
let isRandom = false;
let videos = []; // 動画のIDや情報を格納（例: 動画のリスト）
let currentIndex = 0; // 現在の動画のインデックス

// サーバーから動画リストを取得（data-videos属性からJSONをパース）
document.addEventListener('DOMContentLoaded', function() {
  const videoListElement = document.getElementById('video-list');
  if (videoListElement) {
    videos = JSON.parse(videoListElement.getAttribute('data-videos')); // 動画データをJSONからパース
  }
});

// YouTube Player APIが準備完了したら呼ばれる
function onYouTubeIframeAPIReady() {
  player = new YT.Player('current-video iframe', {
    videoId: videos[currentIndex].videoId, // 初期の動画IDを設定
    playerVars: {
      autoplay: 1,
      controls: 1,
      rel: 0,
      modestbranding: 1,
      start: 0, // 開始時間（必要に応じて変更）
      end: 0 // 終了時間（必要に応じて変更）
    },
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

// YouTubeプレーヤーの状態が変更されたときに呼ばれる
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
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
    isPlaying = false;
  } else {
    player.playVideo();
    isPlaying = true;
  }
});

// リピートボタンのクリックイベント
document.getElementById('repeat-btn').addEventListener('click', function() {
  isRepeating = !isRepeating;
  this.style.backgroundColor = isRepeating ? '#333' : '';
});

// ランダムボタンのクリックイベント
document.getElementById('shuffle-btn').addEventListener('click', function() {
  isRandom = !isRandom;
  this.style.backgroundColor = isRandom ? '#333' : '';
});

// ランダム再生の実装
function playRandomVideo() {
  let randomIndex = Math.floor(Math.random() * videos.length);
  let videoId = videos[randomIndex].videoId;
  player.loadVideoById(videoId);
  currentIndex = randomIndex;
}
