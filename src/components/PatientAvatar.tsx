import { useEffect, useRef } from 'react';
import type { Gender } from '../types/patient';
import { createQuaterniusAvatar, type AvatarController } from './avatar/quaterniusAvatar';

interface PatientAvatarProps {
  gender: Gender;
  onGenderChange: (gender: Gender) => void;
}

export function PatientAvatar({ gender, onGenderChange }: PatientAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AvatarController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = stageRef.current;
    if (!canvas || !container) return;

    const controller = createQuaterniusAvatar({
      canvas,
      container,
      initialGender: gender
    });

    controllerRef.current = controller;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    controllerRef.current?.setGender(gender);
  }, [gender]);

  return (
    <aside className="patient-avatar-panel">
      <div className="avatar-panel-copy">
        <span className="avatar-eyebrow">Paciente</span>
        <p>Selecciona el sexo del paciente y gira el modelo para revisar la vista.</p>
      </div>

      <div className="avatar-stage" ref={stageRef}>
        <span className={`avatar-status ${gender}`}>
          {gender === 'female' ? 'Femenino' : 'Masculino'} · vista 3D
        </span>
        <canvas ref={canvasRef} aria-label="Modelo corporal 3D interactivo" />
        <span className="avatar-hint">Arrastra para girar · rueda para acercar</span>
      </div>

      <div className="gender-switch" role="group" aria-label="Seleccionar sexo">
        <button
          type="button"
          className={gender === 'female' ? 'active female' : ''}
          onClick={() => onGenderChange('female')}
        >
          ♀ Mujer
        </button>
        <button
          type="button"
          className={gender === 'male' ? 'active male' : ''}
          onClick={() => onGenderChange('male')}
        >
          ♂ Hombre
        </button>
      </div>
    </aside>
  );
}
