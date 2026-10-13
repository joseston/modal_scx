import { PatientInfoCard } from './PatientInfoCard';

interface BillingCardProps {
  expanded: boolean;
  onToggle: () => void;
}

export function BillingCard({ expanded, onToggle }: BillingCardProps) {
  return (
    <button
      type="button"
      className={`patient-info-card billing billing-card${expanded ? ' expanded' : ''}`}
      onClick={onToggle}
      aria-expanded={expanded}
      aria-label="Desglosar datos de facturación"
    >
      <div className="patient-info-card-header">
        <span className="patient-info-icon" aria-hidden="true">S/</span>
        <div>
          <span>Administrativo</span>
          <h3>Datos de facturación</h3>
        </div>
        <span className="billing-chevron" aria-hidden="true">{expanded ? '−' : '+'}</span>
      </div>

      {!expanded ? (
        <div className="patient-info-table billing-summary">
          <div className="patient-info-row"><span>Consultas</span><strong>S/ 1,860</strong></div>
          <div className="patient-info-row"><span>Medicamentos</span><strong>S/ 4,920</strong></div>
          <div className="patient-info-row"><span>Estado</span><strong>Al día</strong></div>
          <div className="billing-open-hint">Click para desglosar</div>
        </div>
      ) : (
        <div className="billing-breakdown" onClick={event => event.stopPropagation()}>
          <section className="billing-breakdown-panel consultations">
            <div className="billing-breakdown-heading">
              <span className="billing-breakdown-icon">C</span>
              <div>
                <small>FACTURACIÓN</small>
                <strong>Consultas</strong>
              </div>
            </div>
            <div className="billing-metric"><span>Acumulado</span><b>S/ 1,860</b></div>
            <div className="billing-metric"><span>Última</span><b>10/10/2026</b></div>
          </section>

          <section className="billing-breakdown-panel medicines">
            <div className="billing-breakdown-heading">
              <span className="billing-breakdown-icon">Rx</span>
              <div>
                <small>FACTURACIÓN</small>
                <strong>Medicamentos</strong>
              </div>
            </div>
            <div className="billing-metric"><span>Acumulado</span><b>S/ 4,920</b></div>
            <div className="billing-metric"><span>Última</span><b>12/10/2026</b></div>
          </section>

          <button className="billing-collapse" type="button" onClick={onToggle}>Contraer</button>
        </div>
      )}
    </button>
  );
}
