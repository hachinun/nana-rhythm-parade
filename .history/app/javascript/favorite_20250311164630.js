function initializeButtonState(button) {
    let videoElement = button.closest(".video");
    if (!videoElement) {
        console.error("⚠️ ボタンの親要素 .video が見つかりません");
        return;
    }

    let videoId = videoElement.getAttribute("data-video-id"); // ✅ 親要素の videoId を取得
    let isFavorite = videoElement.getAttribute("data-favorite") === "true";

    console.log(`🎯 ボタン初期化: videoId=${videoId}, isFavorite=${isFavorite}`);

    if (isFavorite) {
        button.innerHTML = '<i class="fa-solid fa-heart"></i>';
        button.classList.remove("favorite-btn");
        button.classList.add("unfavorite-btn");
    } else {
        button.innerHTML = '<i class="fa-regular fa-heart"></i>';
        button.classList.remove("unfavorite-btn");
        button.classList.add("favorite-btn");
    }
}

function favoriteButtonClickHandler(event) {
    console.log("🎯 お気に入りボタンがクリックされました");

    event.preventDefault();

    let videoElement = this.closest(".video");
    if (!videoElement) {
        console.error("⚠️ 親要素 .video が見つかりません");
        return;
    }

    let videoId = videoElement.getAttribute("data-video-id"); // ✅ すべて .video の data-video-id に統一
    console.log(`📌 親要素 .video から取得した videoId: ${videoId}`);

    let url = `/videos/${videoId}/favorites/toggle`;

    fetch(url, {
        method: 'POST',
        headers: { 'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("📨 APIからのレスポンス:", data);

        if (data.status === "added") {
            console.log(`❤️ videoId: ${videoId} をお気に入りに追加`);
            this.innerHTML = '<i class="fa-solid fa-heart"></i>';
            this.classList.remove("favorite-btn");
            this.classList.add("unfavorite-btn");
            videoElement.setAttribute("data-favorite", "true");
        } else {
            console.log(`💔 videoId: ${videoId} をお気に入り解除`);
            this.innerHTML = '<i class="fa-regular fa-heart"></i>';
            this.classList.remove("unfavorite-btn");
            this.classList.add("favorite-btn");
            videoElement.setAttribute("data-favorite", "false");
        }
    })
    .catch(error => {
        console.error("🚨 エラーが発生しました:", error);
    });
}
