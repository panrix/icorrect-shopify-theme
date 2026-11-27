class DetailsModal extends HTMLElement {
  constructor() {
    super();
    this.detailsContainer = this.querySelector('details');
    this.summaryToggle = this.querySelector('summary');
    const closeButton =
      (this.detailsContainer && this.detailsContainer.querySelector('button[type="button"]')) ||
      this.querySelector('button[type="button"]');

    if (this.detailsContainer) {
      this.detailsContainer.addEventListener(
        'keyup',
        (event) => event.code && event.code.toUpperCase() === 'ESCAPE' && this.close()
      );
    }
    if (this.summaryToggle) {
      this.summaryToggle.addEventListener('click', this.onSummaryClick.bind(this));
      this.summaryToggle.setAttribute('role', 'button');
    }
    if (closeButton) {
      closeButton.addEventListener('click', this.close.bind(this));
    }
  }

  isOpen() {
    return !!(this.detailsContainer && this.detailsContainer.hasAttribute('open'));
  }

  onSummaryClick(event) {
    event.preventDefault();
    const details = (event.target && event.target.closest ? event.target.closest('details') : null) || this.detailsContainer;
    if (!details) return;
    details.hasAttribute('open') ? this.close() : this.open(event);
  }

  onBodyClick(event) {
    if (!event || !event.target || !this.contains(event.target) || (event.target.classList && event.target.classList.contains('modal-overlay'))) {
      this.close(false);
    }
  }

  open(event) {
    const details = (event && event.target && event.target.closest ? event.target.closest('details') : null) || this.detailsContainer;
    if (!details) return;
    this.onBodyClickEvent = this.onBodyClickEvent || this.onBodyClick.bind(this);
    details.setAttribute('open', true);
    document.body.addEventListener('click', this.onBodyClickEvent);
    document.body.classList.add('overflow-hidden');

    if (typeof trapFocus === 'function') {
      trapFocus(
        details.querySelector('[tabindex="-1"]'),
        details.querySelector('input:not([type="hidden"])')
      );
    }
  }

  close(focusToggle = true) {
    if (typeof removeTrapFocus === 'function') {
      removeTrapFocus(focusToggle ? this.summaryToggle : null);
    }
    if (this.detailsContainer) this.detailsContainer.removeAttribute('open');
    if (this.onBodyClickEvent) document.body.removeEventListener('click', this.onBodyClickEvent);
    document.body.classList.remove('overflow-hidden');
  }
}

customElements.define('details-modal', DetailsModal);
