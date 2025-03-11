document.getElementById('toggle-both').addEventListener('click', function() {
    const searchContainer = document.getElementById('search-container');
    const filterContainer = document.getElementById('filter-container');
    
    const isHidden = !searchContainer.classList.contains('show');

    if (isHidden) {
      searchContainer.classList.add('show');
      filterContainer.classList.add('show');
      this.textContent = '▲ 検索 & フィルタを閉じる';
    } else {
      searchContainer.classList.remove('show');
      filterContainer.classList.remove('show');
      this.textContent = '▼ 検索 & フィルタ';
    }
  });