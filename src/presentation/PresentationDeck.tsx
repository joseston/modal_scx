import { useState } from 'react';
import { Slide01 } from './slides/Slide01';
import { Slide02 } from './slides/Slide02';
import { Slide03 } from './slides/Slide03';
import './presentation.css';

const slides = [Slide01, Slide02, Slide03];

export function PresentationDeck() {
  const [activeSlide, setActiveSlide] = useState(0);
  const ActiveSlide = slides[activeSlide];

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

      <div className="ppt-layout">
        <aside className="ppt-thumbnails" aria-label="Lista de diapositivas">
          {slides.map((Slide, index) => (
            <button
              key={index}
              type="button"
              className={`ppt-thumbnail${activeSlide === index ? ' active' : ''}`}
              onClick={() => setActiveSlide(index)}
              aria-label={`Abrir diapositiva ${index + 1}`}
            >
              <div className="ppt-thumbnail-canvas">
                <Slide />
              </div>
              <span>{index + 1}</span>
            </button>
          ))}
        </aside>

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
      </div>
    </section>
  );
}
