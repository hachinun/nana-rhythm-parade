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
              const isFavorite = localStorage.getItem(video.dataset.videoId) === "true";
              console.log(`Video ID: ${video.dataset.videoId}, Is Favorite: ${isFavorite}`); // デバッグ用ログ
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

  // テスト用の `localStorage` を設定して確認
  function testFavorites() {
      // テスト用データを `localStorage` に追加
      localStorage.setItem("video1", "true");  // video1はお気に入り
      localStorage.setItem("video2", "false"); // video2はお気に入りではない

      // 動画のデータをモックする
      document.body.innerHTML = `
          <div class="video" data-video-id="video1" data-start-seconds="0">
              <div class="song-title">Song 1</div>
              <div class="artist">Artist 1</div>
          </div>
          <div class="video" data-video-id="video2" data-start-seconds="5">
              <div class="song-title">Song 2</div>
              <div class="artist">Artist 2</div>
          </div>
      `;

      // フィルタリングのテスト
      console.log("フィルタリング前:");
      document.querySelectorAll(".video").forEach(video => console.log(video));

      // お気に入り動画をフィルタリング
      showFavoritesBtn.click();
      
      // 結果の確認
      setTimeout(() => {
          console.log("フィルタリング後:");
          document.querySelectorAll(".video").forEach(video => console.log(video));
      }, 500);
  }

  // テスト実行
  testFavorites();
});
