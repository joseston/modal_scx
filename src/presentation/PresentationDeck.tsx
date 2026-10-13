import { useState } from 'react';
import { Slide01Interactive } from './slides/Slide01Interactive';
import { Slide02Ecosystem } from './slides/Slide02Ecosystem';
import { Slide03 } from './slides/Slide03';
import './presentation.css';
import './slides/interactive-slides.css';

const slides = [
  { Component: Slide01Interactive, label: 'Paciente 360°', number: '01' },
  { Component: Slide02Ecosystem, label: 'Aplicaciones', number: '02' },
  { Component: Slide03, label: 'Diapositiva 3', number: '03' }
];

export function PresentationDeck() {
  const [activeSlide, setActiveSlide] = useState(0);
  const ActiveSlide = slides[activeSlide].Component;

  function previousSlide() {
    setActiveSlide(current => Math.max(0, current - 1));
  }

  function nextSlide() {
    setActiveSlide(current => Math.min(slides.length - 1, current + 1));
  }

  return (
    <section className="ppt-workspace" aria-label="Editor de presentación">
      <header className="ppt-toolbar">
        <div>
          <span className="ppt-toolbar-eyebrow">PRESENTACIÓN</span>
          <h1>Slides CIATOB</h1>
        </div>
        <div className="ppt-toolbar-count">
          {activeSlide + 1} / {slides.length}
        </div>
      </header>

      <nav className="ppt-slide-strip" aria-label="Seleccionar diapositiva">
        {slides.map((slide, index) => (
          <button
            key={slide.number}
            type="button"
            className={`ppt-slide-tab${activeSlide === index ? ' active' : ''}`}
            onClick={() => setActiveSlide(index)}
            aria-current={activeSlide === index ? 'page' : undefined}
          >
            <span className="ppt-slide-tab-number">{slide.number}</span>
            <span className="ppt-slide-tab-preview" aria-hidden="true">
              <span className="ppt-slide-tab-accent" />
              <span className="ppt-slide-tab-line wide" />
              <span className="ppt-slide-tab-line" />
            </span>
            <span className="ppt-slide-tab-label">{slide.label}</span>
          </button>
        ))}
      </nav>

      <main className="ppt-stage-shell">
        <div className="ppt-stage">
          <ActiveSlide />
        </div>

        <div className="ppt-navigation" aria-label="Navegación de diapositivas">
          <button type="button" onClick={previousSlide} disabled={activeSlide === 0}>
            ← Anterior
          </button>
          <div className="ppt-dots" aria-hidden="true">
            {slides.map((_, index) => (
              <span key={index} className={activeSlide === index ? 'active' : ''} />
            ))}
          </div>
          <button type="button" onClick={nextSlide} disabled={activeSlide === slides.length - 1}>
            Siguiente →
          </button>
        </div>
      </main>
    </section>
  );
}
