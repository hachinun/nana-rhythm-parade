document.getElementById('toggle-both').addEventListener('click', function() {
    var container = document.getElementById('search-filter-container');
    if (container.style.display === 'none' || container.style.display === '') {
      container.style.display = 'flex';
    } else {
      container.style.display = 'none';
    }
  });