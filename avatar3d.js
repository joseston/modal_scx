import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const COLORS = {
  female: '#ef77a8',
  femaleAccent: '#ffd3e4',
  male: '#5599ef',
  maleAccent: '#cfe4ff'
};

export function createAvatar3D({ canvas, container, initialGender = 'female' }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 100);
  camera.position.set(0, 0.05, 15);

  const hemisphere = new THREE.HemisphereLight(0xffffff, 0xb9d7da, 2.7);
  scene.add(hemisphere);

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
  keyLight.position.set(4.5, 7, 6);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xdff9ff, 1.5);
  fillLight.position.set(-5, 3, 2);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 1.1);
  rimLight.position.set(0, 4, -5);
  scene.add(rimLight);

  const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.72,
    metalness: 0.02
  });

  const pedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 1.52, 0.11, 64),
    floorMaterial
  );
  pedestal.position.y = -3.18;
  pedestal.receiveShadow = true;
  scene.add(pedestal);

  const floorRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.16, 0.012, 10, 96),
    new THREE.MeshBasicMaterial({ color: 0x91c9ce, transparent: true, opacity: 0.65 })
  );
  floorRing.rotation.x = Math.PI / 2;
  floorRing.position.y = -3.115;
  scene.add(floorRing);

  const avatar = new THREE.Group();
  avatar.position.y = -0.05;
  scene.add(avatar);

  let currentGender = initialGender;
  let targetRotation = 0.18;
  let dragging = false;
  let lastX = 0;
  let destroyed = false;
  let bodyMaterial = null;
  let accentMaterial = null;

  function makeMaterial(gender) {
    return new THREE.MeshPhysicalMaterial({
      color: COLORS[gender],
      roughness: 0.42,
      metalness: 0.02,
      clearcoat: 0.25,
      clearcoatRoughness: 0.4
    });
  }

  function makeAccentMaterial(gender) {
    return new THREE.MeshStandardMaterial({
      color: COLORS[`${gender}Accent`],
      roughness: 0.6,
      transparent: true,
      opacity: 0.6
    });
  }

  function addEllipsoid(parent, radius, scale, position, material = bodyMaterial) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 24), material);
    mesh.scale.set(scale.x, scale.y, scale.z);
    mesh.position.copy(position);
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addCylinderBetween(parent, start, end, radiusTop, radiusBottom, material = bodyMaterial) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const length = direction.length();
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, length, 24, 1, false);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  }

  function addJoint(parent, position, radius, scale = 1) {
    return addEllipsoid(
      parent,
      radius,
      { x: scale, y: scale, z: scale },
      position,
      bodyMaterial
    );
  }

  function disposeAvatar() {
    const geometries = new Set();
    const materials = new Set();

    avatar.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (Array.isArray(object.material)) object.material.forEach(mat => materials.add(mat));
      else if (object.material) materials.add(object.material);
    });

    while (avatar.children.length) avatar.remove(avatar.children[0]);
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
  }

  function buildHead(gender) {
    const head = addEllipsoid(
      avatar,
      0.43,
      { x: 0.78, y: 1.02, z: 0.82 },
      new THREE.Vector3(0, 2.46, 0)
    );

    const facePanel = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 20, 16),
      accentMaterial
    );
    facePanel.scale.set(1.45, 0.5, 0.28);
    facePanel.position.set(0, 2.43, 0.345);
    facePanel.castShadow = false;
    avatar.add(facePanel);

    const neck = new THREE.Mesh(
      new THREE.CylinderGeometry(gender === 'male' ? 0.17 : 0.145, gender === 'male' ? 0.19 : 0.16, 0.34, 24),
      bodyMaterial
    );
    neck.position.set(0, 1.92, 0);
    neck.castShadow = true;
    avatar.add(neck);

    return head;
  }

  function buildTorso(gender) {
    const female = gender === 'female';

    addEllipsoid(
      avatar,
      0.72,
      {
        x: female ? 0.88 : 1.03,
        y: female ? 0.72 : 0.76,
        z: female ? 0.58 : 0.62
      },
      new THREE.Vector3(0, 1.28, 0)
    );

    addEllipsoid(
      avatar,
      0.63,
      {
        x: female ? 0.70 : 0.86,
        y: 0.74,
        z: female ? 0.52 : 0.58
      },
      new THREE.Vector3(0, 0.54, 0)
    );

    addEllipsoid(
      avatar,
      0.62,
      {
        x: female ? 0.98 : 0.88,
        y: 0.55,
        z: female ? 0.62 : 0.58
      },
      new THREE.Vector3(0, -0.20, 0)
    );

    const waistRing = new THREE.Mesh(
      new THREE.TorusGeometry(female ? 0.44 : 0.52, 0.012, 10, 84),
      accentMaterial
    );
    waistRing.rotation.x = Math.PI / 2;
    waistRing.position.y = 0.43;
    avatar.add(waistRing);
  }

  function buildArm(side, gender) {
    const female = gender === 'female';
    const sign = side === 'left' ? -1 : 1;
    const shoulderX = sign * (female ? 0.72 : 0.84);
    const elbowX = sign * (female ? 0.83 : 0.96);
    const wristX = sign * (female ? 0.84 : 0.99);

    const shoulder = new THREE.Vector3(shoulderX, 1.33, 0);
    const elbow = new THREE.Vector3(elbowX, 0.40, 0.015);
    const wrist = new THREE.Vector3(wristX, -0.52, 0.035);

    addJoint(avatar, shoulder, female ? 0.18 : 0.21, 1.03);
    addCylinderBetween(avatar, shoulder, elbow, female ? 0.15 : 0.18, female ? 0.17 : 0.20);
    addJoint(avatar, elbow, female ? 0.15 : 0.17, 0.98);
    addCylinderBetween(avatar, elbow, wrist, female ? 0.12 : 0.14, female ? 0.145 : 0.165);

    addEllipsoid(
      avatar,
      0.18,
      { x: 0.62, y: 1.08, z: 0.46 },
      new THREE.Vector3(wristX, -0.78, 0.07)
    );
  }

  function buildLeg(side, gender) {
    const female = gender === 'female';
    const sign = side === 'left' ? -1 : 1;
    const hipX = sign * (female ? 0.36 : 0.33);
    const kneeX = sign * (female ? 0.34 : 0.36);
    const ankleX = sign * (female ? 0.32 : 0.35);

    const hip = new THREE.Vector3(hipX, -0.42, 0);
    const knee = new THREE.Vector3(kneeX, -1.55, 0.02);
    const ankle = new THREE.Vector3(ankleX, -2.57, 0.035);

    addJoint(avatar, hip, female ? 0.24 : 0.25, 1.02);
    addCylinderBetween(avatar, hip, knee, female ? 0.20 : 0.22, female ? 0.25 : 0.27);
    addJoint(avatar, knee, female ? 0.18 : 0.19, 0.98);
    addCylinderBetween(avatar, knee, ankle, female ? 0.13 : 0.15, female ? 0.18 : 0.20);

    const foot = addEllipsoid(
      avatar,
      0.25,
      { x: female ? 0.62 : 0.70, y: 0.42, z: 1.18 },
      new THREE.Vector3(ankleX, -2.95, 0.18)
    );
    foot.rotation.x = -0.06;
  }

  function buildPerson(gender) {
    disposeAvatar();
    currentGender = gender;
    bodyMaterial = makeMaterial(gender);
    accentMaterial = makeAccentMaterial(gender);

    buildHead(gender);
    buildTorso(gender);
    buildArm('left', gender);
    buildArm('right', gender);
    buildLeg('left', gender);
    buildLeg('right', gender);

    avatar.scale.setScalar(0.92);
    avatar.rotation.y = targetRotation;
  }

  function resize() {
    if (destroyed) return;
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  function onPointerDown(event) {
    dragging = true;
    lastX = event.clientX;
    canvas.setPointerCapture?.(event.pointerId);
  }

  function onPointerMove(event) {
    if (!dragging) return;
    targetRotation += (event.clientX - lastX) * 0.009;
    lastX = event.clientX;
  }

  function onPointerUp() {
    dragging = false;
  }

  function onWheel(event) {
    event.preventDefault();
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z + event.deltaY * 0.006,
      11.8,
      18
    );
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  const clock = new THREE.Clock();

  function animate() {
    if (destroyed) return;

    const elapsed = clock.getElapsedTime();
    if (!dragging) targetRotation += 0.00045;

    avatar.rotation.y += (targetRotation - avatar.rotation.y) * 0.075;
    avatar.position.y = -0.05 + Math.sin(elapsed * 1.2) * 0.012;
    floorRing.scale.setScalar(1 + Math.sin(elapsed * 1.7) * 0.012);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  buildPerson(initialGender);
  animate();

  return {
    setGender(gender) {
      if (gender !== 'female' && gender !== 'male') return;
      buildPerson(gender);
      targetRotation = 0.18;
    },
    getGender() {
      return currentGender;
    },
    resetView() {
      camera.position.z = 15;
      targetRotation = 0.18;
    },
    destroy() {
      destroyed = true;
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      disposeAvatar();
      renderer.dispose();
    }
  };
}
