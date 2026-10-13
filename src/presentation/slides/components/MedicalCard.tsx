export function MedicalCard() {
  return (
    <article className="patient-info-card medical medical-card">
      <div className="patient-info-card-header">
        <span className="patient-info-icon" aria-hidden="true">+</span>
        <div>
          <span>Clínico</span>
          <h3>Datos médicos</h3>
        </div>
      </div>

      <div className="medical-modules">
        <section className="medical-module laboratory">
          <div className="medical-module-topline">
            <span className="medical-module-icon" aria-hidden="true">◫</span>
            <strong>Laboratorio</strong>
          </div>
          <div className="medical-module-detail">
            <span>Último resultado</span>
            <b>08/10/2026</b>
          </div>
          <small>6 análisis registrados</small>
        </section>

        <section className="medical-module protocol">
          <div className="medical-module-topline">
            <span className="medical-module-icon" aria-hidden="true">99</span>
            <strong>Datos Protocolo 99</strong>
          </div>
          <div className="medical-module-detail">
            <span>Última actualización</span>
            <b>10/10/2026</b>
          </div>
          <small>Seguimiento clínico activo</small>
        </section>
      </div>
    </article>
  );
}
