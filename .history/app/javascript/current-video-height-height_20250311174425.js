function updateVideoListHeight() {
    const currentVideo = document.getElementById('current-video');
    const videoList = document.getElementById('video-list');

    if (currentVideo) {
        const currentVideoHeight = currentVideo.clientHeight;
        videoList.style.setProperty('--current-video-height', `${currentVideoHeight}px`);
    }
}

// 動画のサイズが変更されたときに高さを更新
window.addEventListener('resize', updateVideoListHeight);
window.addEventListener('load', updateVideoListHeight);
window.addEventListener('DOMContentLoaded', updateVideoListHeight);
