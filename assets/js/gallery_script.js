document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('page-header');
  const sentinels = Array.from(document.querySelectorAll('.sentinel'));
  if (!header || sentinels.length === 0) return;

  const originalHTML = header.innerHTML;
  const visibility = new Map(sentinels.map(s => [s, false]));
  let lastLeft = null;
  const lastPositions = new Map(sentinels.map(s => [s, s.getBoundingClientRect().top]));

  const updateHeader = () => {
    const anyVisible = Array.from(visibility.values()).some(v => v === true);
    const visibleSentinels = sentinels.filter(s => visibility.get(s));
    if (!anyVisible && lastLeft) {
      header.classList.add('scrolled');
      header.innerHTML = lastLeft.dataset.title || lastLeft.id || originalHTML;
      header.dataset.active = lastLeft.id || '';
    } else {
      header.innerHTML = originalHTML;
      header.classList.remove('scrolled');
    }
    if(lastLeft) updateActiveMenu(lastLeft.id);
    if(visibleSentinels.length > 0) {
      const visibleIds = visibleSentinels.map(s => s.id);
      updateActiveMenu(visibleIds);
    }
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const prevVisible = visibility.get(entry.target);
      const topNow = entry.boundingClientRect.top;
      const prevTop = lastPositions.get(entry.target);
      lastPositions.set(entry.target, topNow);

      visibility.set(entry.target, entry.isIntersecting);

      if (!entry.isIntersecting && prevVisible) {
        const direction = topNow < prevTop ? 'up' : 'down';

        if (direction === 'down') {
          const index = sentinels.indexOf(entry.target);
          for (let i = index - 1; i >= 0; i--) {
            if (visibility.get(sentinels[i])) continue;
            lastLeft = sentinels[i];
            break;
          }
          if (!lastLeft) lastLeft = entry.target;
        } else
          lastLeft = entry.target;
      }
      if (entry.isIntersecting)
        lastLeft = null;
    });

    updateHeader();
  }, { root: null, threshold: 0 });

  sentinels.forEach(s => obs.observe(s));
});

const updateActiveMenu = (ids) => {
  if (!Array.isArray(ids)) ids = [ids];

  document.querySelectorAll('.toc span').forEach(span => {
    const hrefId = span.parentElement.getAttribute('href').substring(1);
    span.classList.toggle('active', ids.includes(hrefId));
  });
};

const tocLinks = Array.from(document.querySelectorAll('.toc a'));
const tocData = tocLinks.map(a => ({
  text: a.querySelector('.toc-text').textContent.trim(),
  link: a.getAttribute('href')
}));

const fuse = new Fuse(tocData, { keys: ['text'], threshold: 0.4 });

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

searchInput.addEventListener('input', function() {
  const query = this.value.trim();
  searchResults.innerHTML = '';
  if (!query) return;
  const results = fuse.search(query).map(res => res.item);
  if(results.length > 0)
  results.forEach(result => {
    const li = document.createElement('li');
    li.textContent = result.text;
    li.addEventListener('click', () => {
      window.location.href = result.link;
      searchResults.innerHTML = '';
      searchInput.value = '';
      updateSearchResults();
    });
    searchResults.appendChild(li);
  });
  else {
    const li = document.createElement('li');
    li.textContent = 'Не знайдено';
    li.style.pointerEvents = 'none';
    li.style.opacity = '0.6';
    searchResults.appendChild(li);
  }

});
function updateSearchResults() {
  if (searchInput.value.trim() === '') {
    searchResults.style.display = 'none';
    searchResults.style.border = 'none';
  } else {
    searchResults.style.display = 'block';
    searchResults.style.border = '1px solid #ccc';
  }
}
searchInput.addEventListener('input', updateSearchResults);

const block = document.querySelector('.centered-block');
const other = document.querySelector('#page-header');

