document.getElementById('toggle-both').addEventListener('click', function() {
    const searchContainer = document.getElementById('search-container');
    const filterContainer = document.getElementById('filter-container');
    
    // 既存の 'hidden' クラスを切り替える
    searchContainer.classList.toggle('hidden');
    filterContainer.classList.toggle('hidden');
  
    // ボタンのテキストを変更
    if (searchContainer.classList.contains('hidden') && filterContainer.classList.contains('hidden')) {
      this.textContent = '▽';
    } else {
      this.textContent = '△';
    }
  });
  