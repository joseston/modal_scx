import { createAvatar3D } from './avatar3d.js';

const canvas = document.getElementById('scene');
const viewerPanel = document.querySelector('.viewer-panel');
const sexSelect = document.getElementById('sexSelect');
const genderButtons = [...document.querySelectorAll('.gender-btn')];
const statusChip = document.getElementById('statusChip');
const historyInput = document.getElementById('historyNumber');
const toast = document.getElementById('toast');
const form = document.getElementById('patientForm');

const avatar = createAvatar3D({
  canvas,
  container: viewerPanel,
  initialGender: sexSelect.value
});

function setGender(gender) {
  avatar.setGender(gender);
  sexSelect.value = gender;

  genderButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.gender === gender);
  });

  statusChip.className = `status-chip ${gender}`;
  statusChip.textContent = gender === 'female'
    ? 'Femenino · vista 3D'
    : 'Masculino · vista 3D';
}

genderButtons.forEach(button => {
  button.addEventListener('click', () => setGender(button.dataset.gender));
});

sexSelect.addEventListener('change', event => {
  setGender(event.target.value);
});

document.getElementById('suggestBtn').addEventListener('click', () => {
  historyInput.value = `HC-2026-${String(Math.floor(10000 + Math.random() * 89999))}`;
  historyInput.focus();
});

function updateAge() {
  const input = document.getElementById('birthDate');
  const label = document.getElementById('ageLabel');

  if (!input.value) {
    label.textContent = '';
    return;
  }

  const birth = new Date(`${input.value}T00:00:00`);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDelta = now.getMonth() - birth.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && now.getDate() < birth.getDate())) {
    age--;
  }

  label.textContent = `(${age} años)`;
}

document.getElementById('birthDate').addEventListener('change', updateAge);
updateAge();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2600);
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const formData = Object.fromEntries(new FormData(form).entries());
  console.table(formData);

  showToast(
    `Historia clínica guardada · ${avatar.getGender() === 'female' ? 'Paciente femenino' : 'Paciente masculino'}`
  );
});

function mockClose() {
  showToast('Demo: el modal se cerraría y volverías al listado de pacientes.');
}

document.getElementById('closeBtn').addEventListener('click', mockClose);
document.getElementById('cancelBtn').addEventListener('click', mockClose);

setGender(sexSelect.value);
