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

  // 再生ボタンのクリックイベント
  document.getElementById('play-btn').addEventListener('click', function() {
    console.log('再生ボタンがクリックされました');
    if (player) {  // playerが初期化されている場合のみ操作を行う
      if (isPlaying) {
        console.log('一時停止状態にします');
        player.pauseVideo();
        isPlaying = false;
        this.innerHTML = '▶️'; // 再生アイコンに戻す
      } else {
        console.log('再生状態にします');
        player.playVideo();
        isPlaying = true;
        this.innerHTML = '⏸️'; // 一時停止アイコンに変更
      }
    } else {
      console.log('プレーヤーが準備できていません');
    }
  });

  // リピートボタンのクリックイベント
  document.getElementById('repeat-btn').addEventListener('click', function() {
    isRepeating = !isRepeating;
    if (isRepeating) {
      this.style.backgroundColor = '#333'; // オンの状態
      console.log('リピートオン');
    } else {
      this.style.backgroundColor = ''; // オフの状態
      console.log('リピートオフ');
    }
  });

  // ランダムボタンのクリックイベント
  document.getElementById('shuffle-btn').addEventListener('click', function() {
    isRandom = !isRandom;
    if (isRandom) {
      this.style.backgroundColor = '#333'; // オンの状態
      console.log('ランダムオン');
    } else {
      this.style.backgroundColor = ''; // オフの状態
      console.log('ランダムオフ');
    }
  });
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
  console.log('YouTube Playerの状態が変わりました: ', event.data);
  if (event.data == YT.PlayerState.ENDED) {
    if (isRepeating) {
      player.playVideo();
    } else if (isRandom) {
      playRandomVideo();
    }
  }
}

// ランダム再生の実装
function playRandomVideo() {
  let randomIndex = Math.floor(Math.random() * videos.length);
  let videoId = videos[randomIndex].videoId;
  player.loadVideoById(videoId);
  currentIndex = randomIndex;
}
