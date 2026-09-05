(() => {
  const sections = [...document.querySelectorAll('.guide-section')];
  const home = sections[0];
  const links = [...document.querySelectorAll('.toc a')].filter(link => {
    const url = new URL(link.href);
    return url.origin === location.origin && url.pathname === location.pathname;
  });
  const menu = document.querySelector('.toc');
  const menuButton = document.querySelector('.menu-toggle');
  // Localized text and the language-specific base URL belong to each HTML file.
  const siteTitle = document.title;
  const description = document.querySelector('meta[name="description"]');
  const homeDescription = description.content;
  const canonical = document.querySelector('link[rel="canonical"]');
  const baseURL = canonical.href;
  const closeMenu = () => {
    menu.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.textContent = menuButton.dataset.openLabel;
  };
  const findSection = id => {
    const target = document.getElementById(id);
    return sections.find(section => section === target || section.contains(target));
  };
  const showSection = (moveFocus = false) => {
    const url = new URL(location.href);
    let fragment = '';
    try { fragment = decodeURIComponent(url.hash.slice(1)); } catch { /* Ignore invalid fragments. */ }
    const legacySection = findSection(fragment);
    if (legacySection) {
      url.searchParams.set('page', legacySection.id);
      url.hash = '';
    }
    const active = findSection(url.searchParams.get('page')) || home;
    if (active === home) url.searchParams.delete('page');
    else url.searchParams.set('page', active.id);
    if (url.href !== location.href) history.replaceState(null, '', url);

    const heading = document.getElementById(active.getAttribute('aria-labelledby'));
    document.title = active === home ? siteTitle : `${heading.textContent.trim()} | ${siteTitle}`;
    description.content = active === home ? homeDescription : (active.querySelector('.section-desc')?.textContent.trim() || heading.textContent.trim());
    const pageURL = new URL(baseURL);
    if (active !== home) pageURL.searchParams.set('page', active.id);
    canonical.href = pageURL.href;
    document.querySelectorAll('[data-language-link]').forEach(link => {
      const translatedURL = new URL(link.href);
      if (active === home) translatedURL.searchParams.delete('page');
      else translatedURL.searchParams.set('page', active.id);
      link.href = translatedURL.href;
    });
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = description.content;
    document.querySelector('meta[property="og:url"]').content = pageURL.href;
    sections.forEach(section => { section.hidden = section !== active; });
    links.forEach(link => {
      const id = new URL(link.href).searchParams.get('page') || home.id;
      if (id === active.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    closeMenu();
    if (moveFocus) {
      heading.focus({ preventScroll: true });
      document.querySelector('main').scrollIntoView({ block: 'start' });
    }
  };
  menuButton.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.textContent = open ? menuButton.dataset.closeLabel : menuButton.dataset.openLabel;
  });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closeMenu(); menuButton.focus(); }
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self') || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.hash) return;
    event.preventDefault();
    if (url.href !== location.href) history.pushState(null, '', url);
    showSection(true);
  });
  window.addEventListener('popstate', () => showSection(true));
  window.addEventListener('hashchange', () => {
    if (location.hash !== '#main') showSection(true);
  });
  showSection();
  document.documentElement.classList.add('enhanced');
})();
