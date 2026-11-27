function loadMegaMenuDeferredImages(root) {
  if (!root) return;
  root.querySelectorAll('img[data-mega-menu-deferred]:not([data-mega-menu-loaded])').forEach((img) => {
    const src = img.getAttribute('data-src');
    if (!src) return;
    // Promote real CDN URLs only once the menu/tab is visible — keeps width/height
    // reserved (CSS + attrs) so we never reintroduce the PR #31 0×0 lazy bug.
    const srcset = img.getAttribute('data-srcset');
    const sizes = img.getAttribute('data-sizes');
    if (srcset) img.setAttribute('srcset', srcset);
    if (sizes) img.setAttribute('sizes', sizes);
    img.setAttribute('src', src);
    img.setAttribute('loading', 'eager');
    img.setAttribute('data-mega-menu-loaded', '');
  });
}

window.loadMegaMenuDeferredImages = loadMegaMenuDeferredImages;

class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    const summary = this.mainDetailsToggle ? this.mainDetailsToggle.querySelector('summary') : null;
    this.content = summary ? summary.nextElementSibling : null;

    if (this.mainDetailsToggle) {
      this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
      this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
    }
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.mainDetailsToggle || !this.content) return;
    if (!this.animations && typeof this.content.getAnimations === 'function') {
      this.animations = this.content.getAnimations();
    }
    if (!this.animations) return;

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    if (!this.mainDetailsToggle) return;
    this.mainDetailsToggle.removeAttribute('open');
    const summary = this.mainDetailsToggle.querySelector('summary');
    if (summary) summary.setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
  }

  onToggle() {
    if (!this.mainDetailsToggle) return;
    if (this.mainDetailsToggle.open) {
      loadMegaMenuDeferredImages(this.mainDetailsToggle);
    }

    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);
