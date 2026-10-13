import { ApplicationCard } from './components/ApplicationCard';
import { DemographicsGate } from './components/DemographicsGate';
import './slide02-gate.css';

export function Slide02Ecosystem() {
  return (
    <section className="ppt-slide ppt-slide--02 app-ecosystem-slide" aria-label="Diapositiva 2">
      <header className="app-ecosystem-heading">
        <div>
          <span className="ppt-kicker">CIATOB · ECOSISTEMA OPERATIVO</span>
          <h2>Tres aplicaciones, con una validación obligatoria antes de la HCE</h2>
        </div>
        <span className="app-ecosystem-badge">Flujo con requisito</span>
      </header>

      <div className="app-ecosystem-grid app-ecosystem-grid-gated">
        <ApplicationCard
          className="consultas"
          index="01"
          icon="C"
          status="OPERATIVA"
          title="Ingreso Consultas"
          subtitle="Registro de atenciones e ingresos por consulta."
          highlights={['Consultas', 'Anticipos', 'Ingresos']}
        />

        <ApplicationCard
          className="farmacos"
          index="02"
          icon="Rx"
          status="OPERATIVA"
          title="Ingreso Fármacos"
          subtitle="Control comercial de medicamentos y movimientos de farmacia."
          highlights={['Ventas', 'Stock', 'Lotes']}
        />

        <DemographicsGate />

        <ApplicationCard
          className="historia"
          index="03"
          icon="HC"
          status="NUEVO MÓDULO"
          title="Historia Clínica Electrónica"
          subtitle="Se habilita únicamente cuando el paciente ya cuenta con sus datos demográficos mínimos."
          highlights={['Ficha 360°', 'Laboratorio', 'Archivos']}
          featured
        />
      </div>

      <div className="hce-prerequisite-note">
        <strong>Regla:</strong> sin datos demográficos completos, no se habilita la Historia Clínica Electrónica.
      </div>

      <div className="ecosystem-flow" aria-hidden="true">
        <span className="ecosystem-flow-node node-1" />
        <span className="ecosystem-flow-line" />
        <span className="ecosystem-flow-node node-2" />
        <span className="ecosystem-flow-line" />
        <span className="ecosystem-flow-node node-3" />
        <span className="ecosystem-flow-line" />
        <span className="ecosystem-flow-node node-4" />
      </div>

      <div className="ppt-slide-footer">CIATOB · APLICACIONES DE OPERACIÓN</div>
    </section>
  );
}
