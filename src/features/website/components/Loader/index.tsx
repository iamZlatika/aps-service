export const WebsiteLoader = () => (
  <div className="ws-loader" role="status" aria-label="Завантаження">
    <span className="ws-loader-aps" aria-hidden="true">
      APS
    </span>
    <svg viewBox="0 0 108 108" className="ws-loader-ring" aria-hidden="true">
      <defs>
        <linearGradient id="ws-loader-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--ws-ember-bright)" />
          <stop offset="100%" stopColor="var(--ws-ember-deep)" />
        </linearGradient>
      </defs>
      <circle className="ws-loader-track" cx="54" cy="54" r="50" />
      <circle
        className="ws-loader-arc"
        cx="54"
        cy="54"
        r="50"
        transform="rotate(-90 54 54)"
      />
    </svg>
  </div>
);
