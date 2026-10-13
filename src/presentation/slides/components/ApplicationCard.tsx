interface ApplicationCardProps {
  className: string;
  index: string;
  title: string;
  subtitle: string;
  icon: string;
  status: string;
  highlights: string[];
  featured?: boolean;
}

export function ApplicationCard({
  className,
  index,
  title,
  subtitle,
  icon,
  status,
  highlights,
  featured = false
}: ApplicationCardProps) {
  return (
    <article className={`app-ecosystem-card ${className}${featured ? ' featured' : ''}`}>
      <div className="app-ecosystem-index">{index}</div>
      <div className="app-ecosystem-icon" aria-hidden="true">{icon}</div>
      <div className="app-ecosystem-copy">
        <span className="app-ecosystem-status">{status}</span>
        <h3>{title}</h3>
        <p>{subtitle}</p>
        <div className="app-ecosystem-highlights">
          {highlights.map(item => <span key={item}>{item}</span>)}
        </div>
      </div>
      {featured && <span className="app-new-badge">NUEVA</span>}
      <div className="app-card-glow" aria-hidden="true" />
    </article>
  );
}
