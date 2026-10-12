import { useState, type FormEvent } from 'react';
import { PatientAvatar } from './PatientAvatar';
import { PatientForm } from './PatientForm';
import type { Gender, PatientFormData } from '../types/patient';

const INITIAL_PATIENT: PatientFormData = {
  historyNumber: '',
  documentType: 'DNI',
  documentNumber: '04436497',
  names: 'GENOVEVA DE LOURDES',
  lastNames: 'FLORES YABAR DE VALDEZ',
  birthDate: '1965-05-21',
  sex: 'female',
  phone: '971922125',
  email: '',
  occupation: '',
  city: 'Lima',
  district: '',
  address: ''
};

export function PatientModal() {
  const [open, setOpen] = useState(true);
  const [patient, setPatient] = useState<PatientFormData>(INITIAL_PATIENT);
  const [toast, setToast] = useState('');

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  }

  function updateGender(gender: Gender) {
    setPatient(current => ({ ...current, sex: gender }));
  }

  function suggestHistoryNumber() {
    const generated = `HC-2026-${String(Math.floor(10000 + Math.random() * 89999))}`;
    setPatient(current => ({ ...current, historyNumber: generated }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.table(patient);
    showToast('Historia clínica guardada correctamente.');
  }

  if (!open) {
    return (
      <button className="reopen-modal" type="button" onClick={() => setOpen(true)}>
        Abrir historia clínica
      </button>
    );
  }

  return (
    <div className="modal-scrim" role="presentation">
      <section className="patient-modal" role="dialog" aria-modal="true" aria-labelledby="patient-modal-title">
        <PatientAvatar gender={patient.sex} onGenderChange={updateGender} />

        <form className="patient-modal-form" onSubmit={submit}>
          <header className="patient-modal-header">
            <div className="modal-title-block">
              <h1 id="patient-modal-title">Aperturar historia clínica</h1>
              <p>Registra los datos principales del paciente.</p>
            </div>

            <div className="history-header-field">
              <label htmlFor="historyNumber">Número de historia clínica</label>
              <div className="history-input-row">
                <input
                  id="historyNumber"
                  value={patient.historyNumber}
                  onChange={event => setPatient(current => ({ ...current, historyNumber: event.target.value }))}
                  placeholder="N.º de historia"
                />
                <button type="button" className="suggest-history" onClick={suggestHistoryNumber}>
                  Sugerir
                </button>
              </div>
              <small>Conserva el número físico si ya existe.</small>
            </div>

            <button className="modal-close" type="button" aria-label="Cerrar" onClick={() => setOpen(false)}>
              ×
            </button>
          </header>

          <div className="patient-modal-body">
            <PatientForm value={patient} onChange={setPatient} />
          </div>

          <footer className="patient-modal-footer">
            <button className="button secondary" type="button" onClick={() => setOpen(false)}>
              Cancelar
            </button>
            <button className="button primary" type="submit">
              Guardar historia clínica
            </button>
          </footer>
        </form>
      </section>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
