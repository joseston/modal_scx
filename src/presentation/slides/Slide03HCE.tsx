import { HceAvatar3D } from './components/HceAvatar3D';
import './slide03-hce.css';

const consultations = [
  { date: '13 OCT', specialty: 'Endocrinología', doctor: 'Dra. Laura Mendoza', state: 'En curso' },
  { date: '29 SEP', specialty: 'Nutrición', doctor: 'Lic. Andrea Torres', state: 'Cerrada' },
  { date: '15 SEP', specialty: 'Medicina general', doctor: 'Dr. Javier Ruiz', state: 'Cerrada' }
];

export function Slide03HCE() {
  return (
    <section className="ppt-slide ppt-slide--03 hce-slide" aria-label="Diapositiva 3">
      <header className="hce-slide-heading">
        <div>
          <span className="ppt-kicker">CIATOB · SIGUIENTE ETAPA</span>
          <h2>De los datos del paciente a su Historia Clínica Electrónica</h2>
        </div>
        <span className="hce-heading-badge">HCE integrada</span>
      </header>

      <div className="hce-workspace">
        <aside className="hce-patient-column">
          <div className="hce-patient-step">
            <span>01</span>
            <div>
              <small>BASE COMPLETA</small>
              <strong>Paciente identificado</strong>
            </div>
          </div>

          <HceAvatar3D />

          <div className="hce-patient-facts">
            <div><span>Grupo sanguíneo</span><strong>O+</strong></div>
            <div><span>Alergias</span><strong>Penicilina</strong></div>
            <div><span>Riesgo</span><strong className="risk-low">Bajo</strong></div>
          </div>
        </aside>

        <main className="hce-dashboard">
          <div className="hce-dashboard-topbar">
            <div>
              <span className="hce-dashboard-kicker">HISTORIA CLÍNICA ELECTRÓNICA</span>
              <h3>HC-008421 · Carlos Mendoza R.</h3>
            </div>
            <div className="hce-dashboard-actions">
              <span>13/10/2026 · 16:10</span>
              <button type="button">+ Nueva consulta</button>
            </div>
          </div>

          <div className="hce-dashboard-grid">
            <section className="hce-panel hce-current-consultation">
              <div className="hce-panel-heading">
                <div>
                  <span className="hce-panel-icon teal">C</span>
                  <div><small>CONSULTA ACTUAL</small><strong>Endocrinología</strong></div>
                </div>
                <span className="hce-state live">EN CURSO</span>
              </div>
              <div className="hce-consultation-body">
                <div><span>Médico tratante</span><strong>Dra. Laura Mendoza</strong></div>
                <div><span>Motivo</span><strong>Control de peso y metabolismo</strong></div>
                <div><span>PA</span><strong>118/76 mmHg</strong></div>
                <div><span>Peso</span><strong>94.2 kg</strong></div>
              </div>
            </section>

            <section className="hce-panel hce-background-panel">
              <div className="hce-panel-heading">
                <div>
                  <span className="hce-panel-icon purple">A</span>
                  <div><small>RESUMEN CLÍNICO</small><strong>Antecedentes</strong></div>
                </div>
              </div>
              <div className="hce-chip-list">
                <span>Resistencia a la insulina</span>
                <span>Obesidad grado I</span>
                <span>HTA: no</span>
                <span>DM2: no</span>
              </div>
            </section>

            <section className="hce-panel hce-history-panel">
              <div className="hce-panel-heading">
                <div>
                  <span className="hce-panel-icon blue">↺</span>
                  <div><small>TRAZABILIDAD</small><strong>Historial de consultas</strong></div>
                </div>
                <span className="hce-count">12 consultas</span>
              </div>
              <div className="hce-consultation-timeline">
                {consultations.map(item => (
                  <div className="hce-timeline-row" key={`${item.date}-${item.specialty}`}>
                    <span className="hce-timeline-date">{item.date}</span>
                    <i />
                    <div><strong>{item.specialty}</strong><span>{item.doctor}</span></div>
                    <b className={item.state === 'En curso' ? 'open' : ''}>{item.state}</b>
                  </div>
                ))}
              </div>
            </section>

            <section className="hce-panel hce-modules-panel">
              <div className="hce-panel-heading">
                <div>
                  <span className="hce-panel-icon orange">+</span>
                  <div><small>MÓDULOS CLÍNICOS</small><strong>Información conectada</strong></div>
                </div>
              </div>
              <div className="hce-module-grid">
                <div><span>DX</span><strong>Diagnósticos</strong><small>4 activos</small></div>
                <div><span>Rx</span><strong>Tratamiento</strong><small>Mounjaro 5 mg</small></div>
                <div><span>LAB</span><strong>Laboratorio</strong><small>6 resultados</small></div>
                <div><span>99</span><strong>Protocolo 99</strong><small>Seguimiento activo</small></div>
                <div><span>DOC</span><strong>Archivos</strong><small>9 documentos</small></div>
                <div><span>⚑</span><strong>Alertas</strong><small>1 alergia</small></div>
              </div>
            </section>
          </div>
        </main>
      </div>

      <div className="hce-flow-caption">
        <span>Datos demográficos completos</span>
        <i>→</i>
        <strong>Historia Clínica Electrónica habilitada</strong>
        <i>→</i>
        <span>Seguimiento longitudinal del paciente</span>
      </div>

      <div className="ppt-slide-footer">CIATOB · HISTORIA CLÍNICA ELECTRÓNICA</div>
    </section>
  );
}
