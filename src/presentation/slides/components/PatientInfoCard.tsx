import type { ReactNode } from 'react';

export type PatientInfoRow = [label: string, value: string];

interface PatientInfoCardProps {
  className: string;
  eyebrow: string;
  title: string;
  icon: string;
  rows?: PatientInfoRow[];
  children?: ReactNode;
}

export function PatientInfoCard({
  className,
  eyebrow,
  title,
  icon,
  rows = [],
  children
}: PatientInfoCardProps) {
  return (
    <article className={`patient-info-card ${className}`}>
      <div className="patient-info-card-header">
        <span className="patient-info-icon" aria-hidden="true">{icon}</span>
        <div>
          <span>{eyebrow}</span>
          <h3>{title}</h3>
        </div>
      </div>

      {children ?? (
        <div className="patient-info-table">
          {rows.map(([label, value]) => (
            <div className="patient-info-row" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
