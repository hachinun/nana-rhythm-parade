// フィルタと検索フォームを同時に表示/非表示
document.getElementById('toggle-both').addEventListener('click', function() {
    const searchContainer = document.getElementById('search-container');
    const filterContainer = document.getElementById('filter-container');
    
    if (searchContainer.style.display === 'none' && filterContainer.style.display === 'none') {
      searchContainer.style.display = 'block';
      filterContainer.style.display = 'block';
      this.textContent = '△'; // クリック時に矢印を「△」に変更
    }
  