import type { ChangeEvent } from 'react';
import type { Gender, PatientFormData } from '../types/patient';

interface PatientFormProps {
  value: PatientFormData;
  onChange: (next: PatientFormData) => void;
}

function calculateAge(date: string) {
  if (!date) return null;
  const birth = new Date(`${date}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

export function PatientForm({ value, onChange }: PatientFormProps) {
  const age = calculateAge(value.birthDate);

  function updateField(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value: nextValue } = event.target;
    onChange({ ...value, [name]: nextValue });
  }

  return (
    <div className="patient-form-grid">
      <div className="field">
        <label htmlFor="documentType">Tipo de documento</label>
        <select id="documentType" name="documentType" value={value.documentType} onChange={updateField}>
          <option value="DNI">DNI</option>
          <option value="CE">CE</option>
          <option value="Pasaporte">Pasaporte</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="documentNumber">Número de documento</label>
        <input id="documentNumber" name="documentNumber" value={value.documentNumber} onChange={updateField} />
      </div>

      <div className="field">
        <label htmlFor="names">Nombres</label>
        <input id="names" name="names" value={value.names} onChange={updateField} />
      </div>

      <div className="field">
        <label htmlFor="lastNames">Apellidos</label>
        <input id="lastNames" name="lastNames" value={value.lastNames} onChange={updateField} />
      </div>

      <div className="field">
        <label htmlFor="birthDate">
          Fecha de nacimiento {age !== null && <span className="age-pill">({age} años)</span>}
        </label>
        <input id="birthDate" name="birthDate" type="date" value={value.birthDate} onChange={updateField} />
      </div>

      <div className="field">
        <label htmlFor="sex">Sexo</label>
        <select
          id="sex"
          name="sex"
          value={value.sex}
          onChange={event => onChange({ ...value, sex: event.target.value as Gender })}
        >
          <option value="female">Femenino</option>
          <option value="male">Masculino</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="phone">Celular</label>
        <input id="phone" name="phone" value={value.phone} onChange={updateField} />
      </div>

      <div className="field">
        <label htmlFor="email">Correo</label>
        <input id="email" name="email" type="email" value={value.email} onChange={updateField} placeholder="paciente@correo.com" />
      </div>

      <div className="field span-2">
        <label htmlFor="occupation">Ocupación</label>
        <input
          id="occupation"
          name="occupation"
          value={value.occupation}
          onChange={updateField}
          placeholder="Ej. Administradora, docente, independiente"
        />
      </div>

      <div className="field">
        <label htmlFor="city">Ciudad</label>
        <input id="city" name="city" value={value.city} onChange={updateField} />
      </div>

      <div className="field">
        <label htmlFor="district">Distrito</label>
        <input id="district" name="district" value={value.district} onChange={updateField} placeholder="Ej. Surco" />
      </div>

      <div className="field span-2">
        <label htmlFor="address">Dirección</label>
        <input id="address" name="address" value={value.address} onChange={updateField} placeholder="Av., calle, número" />
      </div>
    </div>
  );
}
