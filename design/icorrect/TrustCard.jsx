// TrustCard — the 2×2 trust card (rating + Apple parts + microsoldering +
// warranty), extracted so heroes can mount it directly above the quote on
// mobile. Styled by icorrect/shell.css (.trust-band-inner / .trust-item).

function TCItem({ icon, title, sub }) {
  return (
    <li className="trust-item">
      <div className="trust-icon">{icon}</div>
      <div className="trust-label">
        <strong>{title}</strong>
        <span>{sub}</span>
      </div>
    </li>
  );
}

function TrustCard({ reviewCount = 719, rating = 4.9 }) {
  return (
    <ul className="trust-band-inner" role="list">
      <li className="trust-item trust-item-rating">
        <div className="trust-rating-num">{rating}</div>
        <div className="trust-rating-meta">
          <div className="stars">
            {[0,1,2,3,4].map(i => (
              <svg key={i} width="14" height="14" viewBox="0 0 14 14">
                <path d="M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z" style={{fill:"var(--ic-star, #333)"}}/>
              </svg>
            ))}
          </div>
          <span>{reviewCount} Google reviews</span>
        </div>
      </li>
      <TCItem
        icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><rect x="2.5" y="3.5" width="17" height="11" rx="1.5"/><path d="M8 18.5h6M11 14.5v4"/></svg>}
        title="Apple parts"
        sub="Calibrated in-house"
      />
      <TCItem
        icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="6" y="6" width="10" height="10" rx="1.5"/><path d="M8.5 4.5V2M11 4.5V2M13.5 4.5V2M8.5 20V17.5M11 20V17.5M13.5 20V17.5M4.5 8.5H2M4.5 11H2M4.5 13.5H2M20 8.5H17.5M20 11H17.5M20 13.5H17.5"/></svg>}
        title="Microsoldering"
        sub="Board-level repairs"
      />
      <TCItem
        icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"><path d="M11 2.5l7 2.5v6c0 4.2-3 7.5-7 9-4-1.5-7-4.8-7-9v-6l7-2.5z"/><path d="M8 11l2.2 2.2L14.5 9"/></svg>}
        title="2-yr warranty"
        sub="Double the standard"
      />
    </ul>
  );
}

Object.assign(window, { TrustCard });
