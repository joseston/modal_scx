import { PatientModal } from './components/PatientModal';

export default function App() {
  return (
    <main className="demo-shell">
      <aside className="demo-sidebar" aria-hidden="true">
        <div className="demo-brand">CIATOB</div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className={`demo-nav-item${index === 0 ? ' active' : ''}`} />
        ))}
      </aside>

      <section className="demo-content" aria-hidden="true">
        <div className="demo-card">
          <div className="demo-title" />
          <div className="demo-subtitle" />
        </div>
        <div className="demo-tabs">
          <div />
          <div />
          <div />
        </div>
        <div className="demo-table" />
      </section>

      <PatientModal />
    </main>
  );
}
