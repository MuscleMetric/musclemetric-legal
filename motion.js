(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('motion-ready');

  if (reduceMotion) return;

  const staggerGroups = [
    ['.problem-grid', '.reveal', 70],
    ['.feature-grid', '.reveal', 70],
    ['.coach-grid', '.reveal', 65],
    ['.analytics-side', '.analytics-card', 65],
    ['.principles', ':scope > div', 55],
    ['.seo-grid', '.seo-card', 70],
    ['.seo-links', '.seo-link-card', 65],
    ['.method-list', 'article', 50]
  ];

  staggerGroups.forEach(([groupSelector, itemSelector, step]) => {
    document.querySelectorAll(groupSelector).forEach(group => {
      let items;
      try {
        items = group.querySelectorAll(itemSelector);
      } catch {
        items = [];
      }
      items.forEach((item, index) => {
        const delay = Math.min(index * Number(step), 320);
        item.style.setProperty('--reveal-delay', `${delay}ms`);
      });
    });
  });

  // SEO landing pages do not use the homepage's reveal classes, so give their
  // main content the same quiet staggered entrance without changing semantics.
  document.querySelectorAll('.seo-hero-grid').forEach(hero => {
    [...hero.children].forEach((item, index) => {
      item.classList.add('reveal');
      item.style.setProperty('--reveal-delay', `${index * 90}ms`);
    });
  });

  document.querySelectorAll('.seo-section .seo-copy').forEach(copy => {
    [...copy.children].forEach((item, index) => {
      if (item.classList.contains('seo-grid') || item.classList.contains('seo-links')) return;
      item.classList.add('reveal');
      item.style.setProperty('--reveal-delay', `${Math.min(index * 65, 195)}ms`);
    });
  });

  // app.js owns the primary reveal observer on the homepage. This observer
  // covers elements added above and acts as a safe fallback on the SEO pages.
  const pending = document.querySelectorAll('.reveal:not(.is-visible)');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.11,
      rootMargin: '0px 0px -4% 0px'
    });
    pending.forEach(item => observer.observe(item));
  } else {
    pending.forEach(item => item.classList.add('is-visible'));
  }
})();
