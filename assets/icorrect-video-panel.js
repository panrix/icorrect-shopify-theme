(function () {
  if (window.__icVideoPanelInit) return;
  window.__icVideoPanelInit = true;

  function activateVideo(el) {
    var id = el.getAttribute('data-ic-yt');
    if (!id) return;
    var title = el.getAttribute('data-ic-yt-title') || 'iCorrect repair video';
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
    iframe.title = title;
    iframe.tabIndex = 0;
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
    );
    iframe.setAttribute('allowfullscreen', '');
    el.removeAttribute('role');
    el.removeAttribute('tabindex');
    el.removeAttribute('data-ic-yt');
    el.innerHTML = '';
    el.appendChild(iframe);
    try {
      iframe.focus();
    } catch (err) {
      // Ignore focus errors in non-interactive environments
    }
  }

  document.addEventListener('click', function (e) {
    var target = e.target && e.target.closest ? e.target.closest('[data-ic-yt]') : null;
    if (target) activateVideo(target);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var target = e.target && e.target.closest ? e.target.closest('[data-ic-yt]') : null;
    if (target) {
      e.preventDefault();
      activateVideo(target);
    }
  });
})();
