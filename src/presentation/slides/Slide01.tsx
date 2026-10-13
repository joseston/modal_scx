const sections = [
  {
    className: 'demographics',
    eyebrow: 'Perfil',
    title: 'Datos demográficos',
    icon: '◎',
    rows: [
      ['Edad', '27 años'],
      ['Sexo', 'Masculino'],
      ['Distrito', 'Surco'],
      ['Nacimiento', '16/02/1999']
    ]
  },
  {
    className: 'billing',
    eyebrow: 'Administrativo',
    title: 'Datos de facturación',
    icon: 'S/',
    rows: [
      ['Documento', 'Boleta'],
      ['Estado', 'Al día'],
      ['Último pago', '12/10/2026'],
      ['Comprobante', 'B001-1842']
    ]
  },
  {
    className: 'medical',
    eyebrow: 'Clínico',
    title: 'Datos médicos',
    icon: '+',
    rows: [
      ['Historia', 'HC-008421'],
      ['Última consulta', '10/10/2026'],
      ['Especialidad', 'Endocrinología'],
      ['Tratamiento', 'Mounjaro']
    ]
  },
  {
    className: 'files',
    eyebrow: 'Documentación',
    title: 'Datos de archivos',
    icon: '▤',
    rows: [
      ['Historia clínica', 'PDF'],
      ['Laboratorios', '6 archivos'],
      ['Imágenes', '3 archivos'],
      ['Última carga', '09/10/2026']
    ]
  }
];

export function Slide01() {
  return (
    <section className="ppt-slide ppt-slide--01 patient-data-slide" aria-label="Diapositiva 1">
      <header className="patient-map-heading">
        <div>
          <span className="ppt-kicker">CIATOB · VISIÓN 360° DEL PACIENTE</span>
          <h2>Un paciente, toda la información conectada</h2>
        </div>
        <span className="patient-map-badge">Ficha integral</span>
      </header>

      <div className="patient-map" aria-label="Mapa de información del paciente">
        <svg className="patient-map-connectors" viewBox="0 0 1000 560" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <marker id="arrow-demo" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#35a7a0" />
            </marker>
            <marker id="arrow-billing" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#f1a43b" />
            </marker>
            <marker id="arrow-medical" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6f7de8" />
            </marker>
            <marker id="arrow-files" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#e56c8b" />
            </marker>
          </defs>

          <path className="map-flow flow-1" d="M 470 250 C 390 190, 330 165, 255 145" markerEnd="url(#arrow-demo)" />
          <path className="map-flow flow-2" d="M 530 250 C 610 190, 670 165, 745 145" markerEnd="url(#arrow-billing)" />
          <path className="map-flow flow-3" d="M 470 310 C 390 365, 330 395, 255 415" markerEnd="url(#arrow-medical)" />
          <path className="map-flow flow-4" d="M 530 310 C 610 365, 670 395, 745 415" markerEnd="url(#arrow-files)" />
        </svg>

        {sections.map((section, index) => (
          <article key={section.title} className={`patient-info-card ${section.className} card-sequence-${index + 1}`}>
            <div className="patient-info-card-header">
              <span className="patient-info-icon" aria-hidden="true">{section.icon}</span>
              <div>
                <span>{section.eyebrow}</span>
                <h3>{section.title}</h3>
              </div>
            </div>
            <div className="patient-info-table">
              {section.rows.map(([label, value]) => (
                <div className="patient-info-row" key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </article>
        ))}

        <article className="patient-core-card">
          <div className="patient-avatar-placeholder" aria-hidden="true">CD</div>
          <span className="patient-core-label">PACIENTE</span>
          <h3>Carlos Adrián Daza Lozada</h3>
          <p>DNI 70234518</p>
          <div className="patient-core-status"><span /> Perfil activo</div>
        </article>
      </div>

      <div className="ppt-slide-footer">CIATOB · INFORMACIÓN CENTRALIZADA</div>
    </section>
  );
}
