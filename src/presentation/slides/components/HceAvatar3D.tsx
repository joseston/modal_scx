import { useEffect, useRef } from 'react';
import { createQuaterniusAvatar, type AvatarController } from '../../../components/avatar/quaterniusAvatar';

export function HceAvatar3D() {
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
      initialGender: 'male'
    });

    controllerRef.current = controller;

    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  return (
    <div className="hce-avatar-stage" ref={stageRef}>
      <div className="hce-avatar-glow" aria-hidden="true" />
      <canvas ref={canvasRef} aria-label="Modelo corporal 3D del paciente" />
      <div className="hce-avatar-caption">
        <span className="hce-avatar-status"><i /> PACIENTE IDENTIFICADO</span>
        <strong>Carlos Mendoza R.</strong>
        <small>HC-008421 · Masculino · 42 años</small>
      </div>
      <span className="hce-avatar-hint">Arrastra para girar</span>
    </div>
  );
}
