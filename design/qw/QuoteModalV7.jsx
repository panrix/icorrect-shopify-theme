// ═══════════════════════════════════════════════════════════════════════════
//  Quote Modal v7 — lifts the v6 quote step into a focused overlay above the
//  site. Entry steps (model → issue → postcode) stay inline in the hero; the
//  PRICE REVEAL comes forward as its own "window" on a dimmed page.
//
//  Portals to <body> so it escapes the hero card. Closing returns the wizard
//  to the postcode step (one click to reopen). Esc / scrim / × all close.
// ═══════════════════════════════════════════════════════════════════════════

function QuoteModalV7({ onClose, children }) {
  const close = React.useCallback(() => { if (onClose) onClose(); }, [onClose]);

  React.useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  return ReactDOM.createPortal(
    <div className="qm7-overlay" role="dialog" aria-modal="true" aria-label="Your repair quote">
      <div className="qm7-scrim" onClick={close} />
      <div className="qm7-panel" role="document">
        <button type="button" className="qm7-close" aria-label="Close quote" onClick={close}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <div className="qm7-scroll">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

Object.assign(window, { QuoteModalV7 });
