export function DemographicsGate() {
  return (
    <article className="demographics-gate" aria-label="Datos demográficos, requisito previo para historia clínica electrónica">
      <div className="demographics-gate-lock" aria-hidden="true">
        <span className="lock-shackle" />
        <span className="lock-body">✓</span>
      </div>

      <span className="demographics-gate-status">REQUISITO OBLIGATORIO</span>
      <h3>Datos demográficos</h3>
      <p>Sin identificación básica del paciente, la Historia Clínica Electrónica permanece bloqueada.</p>

      <div className="demographics-gate-fields" aria-label="Campos mínimos requeridos">
        <span>DNI</span>
        <span>Nombres</span>
        <span>Apellidos</span>
        <span>Fecha de nacimiento</span>
      </div>

      <div className="demographics-gate-footer">
        <span className="demographics-gate-dot" />
        Habilita acceso a HCE
      </div>
    </article>
  );
}
