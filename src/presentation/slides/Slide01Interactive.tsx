import { useState } from 'react';
import { BillingCard } from './components/BillingCard';
import { MedicalCard } from './components/MedicalCard';
import { PatientInfoCard } from './components/PatientInfoCard';
import './slide01-readability.css';

export function Slide01Interactive() {
  const [billingExpanded, setBillingExpanded] = useState(false);

  return (
    <section className="ppt-slide ppt-slide--01 patient-data-slide patient-data-slide-v2" aria-label="Diapositiva 1">
      <header className="patient-map-heading">
        <div>
          <span className="ppt-kicker">CIATOB · VISIÓN 360° DEL PACIENTE</span>
          <h2>Un paciente, toda la información conectada</h2>
        </div>
        <span className="patient-map-badge">Ficha integral</span>
      </header>

      <div className="patient-map patient-map-v2">
        <div className="smart-connector connector-demo" aria-hidden="true" />
        <div className="smart-connector connector-billing" aria-hidden="true" />
        <div className="smart-connector connector-medical" aria-hidden="true" />
        <div className="smart-connector connector-files" aria-hidden="true" />

        <PatientInfoCard
          className="demographics card-sequence-1"
          eyebrow="Perfil"
          title="Datos demográficos"
          icon="◎"
          rows={[
            ['Edad', 'Ejemplo'],
            ['Sexo', 'Ejemplo'],
            ['Distrito', 'Ejemplo'],
            ['Nacimiento', 'dd/mm/aaaa']
          ]}
        />

        <BillingCard expanded={billingExpanded} onToggle={() => setBillingExpanded(value => !value)} />
        <MedicalCard />

        <PatientInfoCard
          className="files card-sequence-4"
          eyebrow="Documentación"
          title="Datos de archivos"
          icon="▤"
          rows={[
            ['Historia clínica', 'PDF'],
            ['Laboratorios', 'Archivos'],
            ['Imágenes', 'Archivos'],
            ['Última carga', 'dd/mm/aaaa']
          ]}
        />

        <article className="patient-core-card">
          <div className="patient-avatar-placeholder" aria-hidden="true">PD</div>
          <span className="patient-core-label">PACIENTE</span>
          <h3>Paciente de ejemplo</h3>
          <p>DNI 00000000</p>
          <div className="patient-core-status"><span /> Perfil activo</div>
        </article>
      </div>

      <div className="ppt-slide-footer">CIATOB · INFORMACIÓN CENTRALIZADA</div>
    </section>
  );
}
