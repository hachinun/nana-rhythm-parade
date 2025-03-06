// YouTube Player APIが読み込まれた後に呼ばれる関数
let player;
let isPlaying = false;
let isRepeating = false;
let isRandom = false;
let videos = []; // 動画のIDや情報を格納（例: 動画のリスト）
let currentIndex = 0; // 現在の動画のインデックス

// YouTube Player APIが準備完了したら呼ばれる
function onYouTubeIframeAPIReady() {
  // YouTubeプレーヤーを設定
  player = new YT.Player('current-video iframe', {
    videoId: '<%= @current_video.video_id %>', // 初期の動画IDを設定
    playerVars: {
      autoplay: 1, // 初期動画は自動で再生
      controls: 1, // コントロールを表示
      rel: 0, // 関連動画を表示しない
      modestbranding: 1, // YouTubeのブランドロゴを最小化
      start: <%= @current_video.start_seconds %>, // 初期の開始時間
      end: <%= @current_video.end_seconds %> // 初期の終了時間
    },
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

// YouTubeプレーヤーの状態が変更されたときに呼ばれる
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.ENDED) {
    // 動画が終了したとき、リピート設定がオンなら再生
    if (isRepeating) {
      player.playVideo();
    } else if (isRandom) {
      // ランダム再生モードなら次のランダムな動画を選んで再生
      playRandomVideo();
    }
  }
}

// 再生ボタンのクリックイベント
document.getElementById('play-btn').addEventListener('click', function() {
  if (isPlaying) {
    player.pauseVideo(); // 再生中なら一時停止
    isPlaying = false;
  } else {
    player.playVideo(); // 一時停止中なら再生
    isPlaying = true;
  }
});

// リピートボタンのクリックイベント
document.getElementById('repeat-btn').addEventListener('click', function() {
  isRepeating = !isRepeating; // リピートのON/OFFを切り替え
  if (isRepeating) {
    this.style.backgroundColor = '#333'; // リピート中のスタイル
  } else {
    this.style.backgroundColor = ''; // リピート終了のスタイル
  }
});

// ランダムボタンのクリックイベント
document.getElementById('shuffle-btn').addEventListener('click', function() {
  isRandom = !isRandom; // ランダムのON/OFFを切り替え
  if (isRandom) {
    this.style.backgroundColor = '#333'; // ランダム中のスタイル
  } else {
    this.style.backgroundColor = ''; // ランダム終了のスタイル
  }
});

// ランダム再生の実装
function playRandomVideo() {
  let randomIndex = Math.floor(Math.random() * videos.length); // 動画リストからランダムに選ぶ
  let videoId = videos[randomIndex].videoId; // ランダムに選んだ動画IDを取得
  player.loadVideoById(videoId); // ランダムな動画を再生
  currentIndex = randomIndex; // 現在のインデックスを更新
}

// 動画のリスト（仮に動画IDとタイトルを格納した配列）
videos = [
  { videoId: 'videoId1', title: 'Song 1' },
  { videoId: 'videoId2', title: 'Song 2' },
  { videoId: 'videoId3', title: 'Song 3' }
];
