document.addEventListener("DOMContentLoaded", function () {
  let filteredVideos = []; // フィルタリング後の動画リストを保存

  // フィルタリング処理（例：お気に入り、歌ってみた、カラオケ）
  function filterVideos(condition) {
      filteredVideos = []; // フィルタリング後のリストを初期化
      document.querySelectorAll(".video").forEach(video => {
          const startSeconds = parseInt(video.dataset.startSeconds, 10) || 0;
          if (condition(startSeconds, video)) {
              video.style.display = ""; // 表示
              filteredVideos.push(video); // 表示された動画を保存
          } else {
              video.style.display = "none"; // 非表示
          }
      });
  }

  // 検索機能の処理
  document.querySelector('input[name="query"]').addEventListener('input', function() {
      const query = this.value.toLowerCase(); // 検索キーワードを小文字で扱う

      if (query === "") {
          // 文字を消した場合はフィルタリング後の全ての動画を表示
          filteredVideos.forEach(video => {
              video.style.display = "";
          });
      } else {
          // 検索キーワードに一致する動画のみ表示
          filteredVideos.forEach(video => {
              const title = video.querySelector('.song-title').innerText.toLowerCase(); // 曲名
              const artist = video.querySelector('.artist').innerText.toLowerCase(); // アーティスト名

              // 曲名またはアーティスト名に検索キーワードが含まれていれば表示
              if (title.includes(query) || artist.includes(query)) {
                  video.style.display = ""; // 一致した場合は表示
              } else {
                  video.style.display = "none"; // 一致しなければ非表示
              }
          });
      }
  });

  // 検索ボタンやEnterキーでのフォーム送信を防止
  document.querySelector('form').addEventListener('submit', function(event) {
      event.preventDefault(); // ページ遷移を防ぐ
  });

  // お気に入りボタンやその他のフィルタリングボタンにイベントを追加
  const filterStart0 = document.getElementById("filter-start-0");
  const filterStartNonZero = document.getElementById("filter-start-nonzero");
  const showFavoritesBtn = document.getElementById("show-favorites");
  const showAllBtn = document.getElementById("show-all");

  // 開始秒数フィルター
  filterStart0.addEventListener("click", function () {
      filterVideos((startSeconds) => startSeconds === 0);
  });

  filterStartNonZero.addEventListener("click", function () {
      filterVideos((startSeconds) => startSeconds !== 0);
  });

  // お気に入りフィルター
  if (showFavoritesBtn && showAllBtn) {
      showFavoritesBtn.addEventListener("click", function () {
          filterVideos((startSeconds, video) => {
              const videoId = video.dataset.videoId;
              const isFavorite = localStorage.getItem(videoId) === "true";
              console.log(`動画ID: ${videoId}, お気に入り状態: ${isFavorite}`); // デバッグ用ログ
              return isFavorite; // お気に入りの動画のみ表示
          });
      });

      showAllBtn.addEventListener("click", function () {
          filterVideos(() => true); // 全ての動画を表示
      });
  } else {
      console.error("🚨 お気に入りフィルターボタンが見つかりません");
  }

  // フィルタリングしていない場合、show-all を適用
  function applySearch(query) {
      if (filteredVideos.length === 0) {
          // フィルタリングしていない場合は show-all を適用
          filterVideos(() => true);
      }

      // 検索処理
      filteredVideos.forEach(video => {
          const title = video.querySelector('.song-title').innerText.toLowerCase(); // 曲名
          const artist = video.querySelector('.artist').innerText.toLowerCase(); // アーティスト名

          if (title.includes(query) || artist.includes(query)) {
              video.style.display = ""; // 一致した場合は表示
          } else {
              video.style.display = "none"; // 一致しなければ非表示
          }
      });
  }

  // 検索バーに入力した文字で検索
  document.querySelector('input[name="query"]').addEventListener('input', function() {
      const query = this.value.toLowerCase(); // 小文字で統一
      applySearch(query); // 検索実行
  });
});
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOMContentLoaded イベントが発火しました");

  // お気に入りボタンのセットアップ
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
              initializeButtonState(button); // ボタンの初期状態を設定
          } else {
              console.log(`🔴 ボタン(${button.dataset.videoId}) はすでにイベントが設定されています`);
          }
      });
  }

  function initializeButtonState(button) {
      // localStorage からお気に入り状態を読み込む
      const videoId = button.dataset.videoId;
      const isFavorite = localStorage.getItem(videoId) === "true";

      console.log(`初期化状態: videoId: ${videoId}, お気に入り状態: ${isFavorite}`);

      if (isFavorite) {
          console.log(`❤️ videoId: ${videoId} はすでにお気に入り`);
          button.textContent = "❤️ お気に入り解除";
          button.classList.remove("favorite-btn");
          button.classList.add("unfavorite-btn");
      } else {
          console.log(`♡ videoId: ${videoId} はお気に入りではありません`);
          button.textContent = "♡ お気に入り";
          button.classList.remove("unfavorite-btn");
          button.classList.add("favorite-btn");
      }
  }

  function favoriteButtonClickHandler(event) {
      console.log("🎯 お気に入りボタンがクリックされました");

      event.preventDefault();
      const button = this;
      const videoId = button.dataset.videoId;
      console.log(`📌 videoId: ${videoId}`);

      // 現在の状態を取得
      const isFavorite = localStorage.getItem(videoId) === "true";
      console.log(`現在の状態: videoId: ${videoId}, お気に入り状態: ${isFavorite}`);

      // お気に入り状態をトグル
      const newFavoriteState = !isFavorite;
      console.log(`新しい状態: videoId: ${videoId}, 新しいお気に入り状態: ${newFavoriteState}`);

      // localStorage に状態を保存
      localStorage.setItem(videoId, newFavoriteState);

      // ボタンのテキストとクラスを更新
      if (newFavoriteState) {
          console.log(`❤️ videoId: ${videoId} をお気に入りに追加`);
          button.textContent = "❤️ お気に入り解除";
          button.classList.remove("favorite-btn");
          button.classList.add("unfavorite-btn");
      } else {
          console.log(`💔 videoId: ${videoId} をお気に入り解除`);
          button.textContent = "♡ お気に入り";
          button.classList.remove("unfavorite-btn");
          button.classList.add("favorite-btn");
      }
  }

  setupFavoriteButtons(); // 初回適用
});
