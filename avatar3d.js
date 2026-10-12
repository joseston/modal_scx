import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

const COLORS = {
  female: '#ee78a8',
  male: '#5599ef'
};

const VIEW = {
  cameraZ: 13.4,
  minZoom: 11.8,
  maxZoom: 16.5,
  avatarScale: 0.72,
  avatarY: -0.22
};

export function createAvatar3D({ canvas, container, initialGender = 'female' }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0.05, VIEW.cameraZ);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfe4e6, 2.2));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.0);
  keyLight.position.set(4, 6, 5);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xdff7ff, 1.4);
  fillLight.position.set(-4, 2, 3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.9);
  rimLight.position.set(0, 4, -4);
  scene.add(rimLight);

  const groundShadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.92, 64),
    new THREE.MeshBasicMaterial({
      color: 0x4c8f96,
      transparent: true,
      opacity: 0.09,
      depthWrite: false
    })
  );
  groundShadow.rotation.x = -Math.PI / 2;
  groundShadow.position.y = -2.23;
  scene.add(groundShadow);

  const floorRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.94, 0.012, 8, 80),
    new THREE.MeshBasicMaterial({
      color: 0x8bc8ce,
      transparent: true,
      opacity: 0.45
    })
  );
  floorRing.rotation.x = Math.PI / 2;
  floorRing.position.y = -2.20;
  scene.add(floorRing);

  const avatar = new THREE.Group();
  avatar.position.y = VIEW.avatarY;
  avatar.scale.setScalar(VIEW.avatarScale);
  scene.add(avatar);

  let currentGender = initialGender;
  let targetRotation = 0.14;
  let dragging = false;
  let lastX = 0;
  let destroyed = false;
  let bodyMaterial = null;

  function createBodyMaterial(gender) {
    return new THREE.MeshPhysicalMaterial({
      color: COLORS[gender],
      roughness: 0.5,
      metalness: 0.0,
      clearcoat: 0.12,
      clearcoatRoughness: 0.55
    });
  }

  function enableShadow(mesh) {
    mesh.castShadow = true;
    mesh.receiveShadow = false;
    return mesh;
  }

  function sphere(radius, scale, position) {
    const mesh = enableShadow(
      new THREE.Mesh(new THREE.SphereGeometry(radius, 36, 28), bodyMaterial)
    );
    mesh.scale.set(scale.x, scale.y, scale.z);
    mesh.position.copy(position);
    avatar.add(mesh);
    return mesh;
  }

  function capsule(radius, length, scale, position, rotationZ = 0) {
    const mesh = enableShadow(
      new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 8, 22), bodyMaterial)
    );
    mesh.scale.set(scale.x, scale.y, scale.z);
    mesh.position.copy(position);
    mesh.rotation.z = rotationZ;
    avatar.add(mesh);
    return mesh;
  }

  function cylinder(radiusTop, radiusBottom, height, position) {
    const mesh = enableShadow(
      new THREE.Mesh(
        new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 28),
        bodyMaterial
      )
    );
    mesh.position.copy(position);
    avatar.add(mesh);
    return mesh;
  }

  function disposeAvatar() {
    const geometries = new Set();
    const materials = new Set();

    avatar.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (Array.isArray(object.material)) {
        object.material.forEach(material => materials.add(material));
      } else if (object.material) {
        materials.add(object.material);
      }
    });

    while (avatar.children.length) avatar.remove(avatar.children[0]);
    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(material => material.dispose());
  }

  function buildHead(gender) {
    const male = gender === 'male';

    sphere(
      0.37,
      { x: male ? 0.92 : 0.88, y: 1.04, z: 0.90 },
      new THREE.Vector3(0, 2.00, 0)
    );

    cylinder(
      male ? 0.145 : 0.125,
      male ? 0.16 : 0.14,
      0.28,
      new THREE.Vector3(0, 1.55, 0)
    );
  }

  function buildCore(gender) {
    const female = gender === 'female';

    // One continuous, rounded torso keeps the avatar clean and icon-like.
    capsule(
      female ? 0.45 : 0.49,
      0.78,
      {
        x: female ? 0.98 : 1.12,
        y: 1.0,
        z: female ? 0.74 : 0.80
      },
      new THREE.Vector3(0, 0.76, 0)
    );

    // A small hip volume softens the transition into the legs without visible joints.
    sphere(
      0.45,
      {
        x: female ? 1.08 : 0.98,
        y: 0.58,
        z: 0.72
      },
      new THREE.Vector3(0, -0.14, 0)
    );
  }

  function buildArms(gender) {
    const female = gender === 'female';
    const shoulderX = female ? 0.61 : 0.70;
    const armRadius = female ? 0.115 : 0.13;
    const armLength = female ? 1.20 : 1.24;
    const armY = 0.62;
    const angle = female ? 0.035 : 0.045;

    capsule(
      armRadius,
      armLength,
      { x: 1, y: 1, z: 0.92 },
      new THREE.Vector3(-shoulderX, armY, 0),
      angle
    );

    capsule(
      armRadius,
      armLength,
      { x: 1, y: 1, z: 0.92 },
      new THREE.Vector3(shoulderX, armY, 0),
      -angle
    );
  }

  function buildLegs(gender) {
    const female = gender === 'female';
    const legX = female ? 0.23 : 0.25;
    const legRadius = female ? 0.145 : 0.16;
    const legLength = 1.26;

    capsule(
      legRadius,
      legLength,
      { x: 1, y: 1, z: 0.94 },
      new THREE.Vector3(-legX, -1.12, 0)
    );

    capsule(
      legRadius,
      legLength,
      { x: 1, y: 1, z: 0.94 },
      new THREE.Vector3(legX, -1.12, 0)
    );

    sphere(
      0.18,
      { x: female ? 0.82 : 0.92, y: 0.42, z: 1.35 },
      new THREE.Vector3(-legX, -2.04, 0.10)
    );

    sphere(
      0.18,
      { x: female ? 0.82 : 0.92, y: 0.42, z: 1.35 },
      new THREE.Vector3(legX, -2.04, 0.10)
    );
  }

  function buildPerson(gender) {
    disposeAvatar();
    currentGender = gender;
    bodyMaterial = createBodyMaterial(gender);

    buildHead(gender);
    buildCore(gender);
    buildArms(gender);
    buildLegs(gender);

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
    targetRotation += (event.clientX - lastX) * 0.008;
    lastX = event.clientX;
  }

  function onPointerUp() {
    dragging = false;
  }

  function onWheel(event) {
    event.preventDefault();
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z + event.deltaY * 0.005,
      VIEW.minZoom,
      VIEW.maxZoom
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

    if (!dragging) targetRotation += 0.00028;
    avatar.rotation.y += (targetRotation - avatar.rotation.y) * 0.07;
    avatar.position.y = VIEW.avatarY + Math.sin(elapsed * 1.15) * 0.008;
    floorRing.scale.setScalar(1 + Math.sin(elapsed * 1.4) * 0.008);

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  buildPerson(initialGender);
  animate();

  return {
    setGender(gender) {
      if (gender !== 'female' && gender !== 'male') return;
      buildPerson(gender);
      targetRotation = 0.14;
    },

    getGender() {
      return currentGender;
    },

    resetView() {
      camera.position.z = VIEW.cameraZ;
      targetRotation = 0.14;
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
