import * as THREE from 'https://esm.sh/three@0.169.0';
import { GLTFLoader } from 'https://esm.sh/three@0.169.0/examples/jsm/loaders/GLTFLoader.js';

const MODEL_URLS = {
  female: './assets/quaternius/female.glb',
  male: './assets/quaternius/male.glb'
};

const COLORS = {
  female: '#ef78a8',
  male: '#5599ef'
};

const TARGET_HEIGHT = 3.45;
const FRUSTUM_HEIGHT = 5.35;
const MIN_ZOOM = 0.82;
const MAX_ZOOM = 1.35;

export function createAvatar3D({ canvas, container, initialGender = 'female' }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.02;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 30);
  camera.position.set(0, 0.12, 7);
  camera.lookAt(0, 0.05, 0);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd9e8ea, 2.15));

  const key = new THREE.DirectionalLight(0xffffff, 3.0);
  key.position.set(3.8, 5.6, 5.2);
  scene.add(key);

  const fill = new THREE.DirectionalLight(0xdff6ff, 1.35);
  fill.position.set(-4.2, 2.5, 3.2);
  scene.add(fill);

  const rim = new THREE.DirectionalLight(0xffffff, 0.75);
  rim.position.set(0, 3.5, -4.5);
  scene.add(rim);

  const stage = new THREE.Group();
  stage.position.y = 0.03;
  scene.add(stage);

  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.78, 64),
    new THREE.MeshBasicMaterial({
      color: 0x2f6f76,
      transparent: true,
      opacity: 0.085,
      depthWrite: false
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.scale.set(1.25, 0.58, 1);
  shadow.position.y = -1.79;
  scene.add(shadow);

  const floorRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.82, 0.009, 8, 84),
    new THREE.MeshBasicMaterial({
      color: 0x8fcbd0,
      transparent: true,
      opacity: 0.32
    })
  );
  floorRing.rotation.x = Math.PI / 2;
  floorRing.position.y = -1.785;
  scene.add(floorRing);

  const loader = new GLTFLoader();

  let currentGender = initialGender;
  let activeModel = null;
  let loadVersion = 0;
  let dragging = false;
  let lastX = 0;
  let targetRotation = 0;
  let destroyed = false;

  function makeAvatarMaterial(gender) {
    return new THREE.MeshPhysicalMaterial({
      color: COLORS[gender],
      roughness: 0.58,
      metalness: 0.0,
      clearcoat: 0.08,
      clearcoatRoughness: 0.72
    });
  }

  function disposeMaterial(material) {
    if (!material) return;
    for (const key of Object.keys(material)) {
      const value = material[key];
      if (value?.isTexture) value.dispose();
    }
    material.dispose?.();
  }

  function disposeObject(root) {
    if (!root) return;
    const geometries = new Set();
    const materials = new Set();

    root.traverse(object => {
      if (object.geometry) geometries.add(object.geometry);
      if (Array.isArray(object.material)) {
        object.material.forEach(material => materials.add(material));
      } else if (object.material) {
        materials.add(object.material);
      }
    });

    geometries.forEach(geometry => geometry.dispose());
    materials.forEach(disposeMaterial);
  }

  function replaceMaterials(root, gender) {
    const oldMaterials = new Set();
    const material = makeAvatarMaterial(gender);

    root.traverse(object => {
      if (!object.isMesh && !object.isSkinnedMesh) return;

      if (Array.isArray(object.material)) {
        object.material.forEach(item => oldMaterials.add(item));
      } else if (object.material) {
        oldMaterials.add(object.material);
      }

      object.material = material;
      object.castShadow = true;
      object.receiveShadow = false;
    });

    oldMaterials.forEach(disposeMaterial);
  }

  function normalizeModel(model) {
    model.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    if (!Number.isFinite(size.y) || size.y <= 0) return;

    model.position.set(-center.x, -center.y, -center.z);

    const wrapper = new THREE.Group();
    wrapper.add(model);
    wrapper.scale.setScalar(TARGET_HEIGHT / size.y);
    wrapper.rotation.y = targetRotation;
    wrapper.position.y = 0.02;

    return wrapper;
  }

  function loadGender(gender) {
    const version = ++loadVersion;
    const url = MODEL_URLS[gender];

    loader.load(
      url,
      gltf => {
        if (destroyed || version !== loadVersion) {
          disposeObject(gltf.scene);
          return;
        }

        replaceMaterials(gltf.scene, gender);
        const wrapper = normalizeModel(gltf.scene);

        if (!wrapper) {
          disposeObject(gltf.scene);
          return;
        }

        const previous = activeModel;
        activeModel = wrapper;
        stage.add(wrapper);

        if (previous) {
          stage.remove(previous);
          disposeObject(previous);
        }

        renderer.renderLists.dispose();
      },
      undefined,
      error => {
        console.error(`No se pudo cargar el avatar ${gender}:`, error);
      }
    );
  }

  function resize() {
    if (destroyed) return;

    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    const aspect = width / height;
    const halfHeight = FRUSTUM_HEIGHT / 2;
    const halfWidth = halfHeight * aspect;

    camera.left = -halfWidth;
    camera.right = halfWidth;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height, false);
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
    camera.zoom = THREE.MathUtils.clamp(
      camera.zoom - event.deltaY * 0.00065,
      MIN_ZOOM,
      MAX_ZOOM
    );
    camera.updateProjectionMatrix();
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  function animate() {
    if (destroyed) return;

    if (activeModel) {
      activeModel.rotation.y += (targetRotation - activeModel.rotation.y) * 0.09;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  loadGender(initialGender);
  animate();

  return {
    setGender(gender) {
      if (gender !== 'female' && gender !== 'male') return;
      if (gender === currentGender && activeModel) return;

      currentGender = gender;
      targetRotation = 0;
      loadGender(gender);
    },

    getGender() {
      return currentGender;
    },

    resetView() {
      targetRotation = 0;
      camera.zoom = 1;
      camera.updateProjectionMatrix();
    },

    destroy() {
      destroyed = true;
      loadVersion++;
      resizeObserver.disconnect();

      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);

      if (activeModel) {
        stage.remove(activeModel);
        disposeObject(activeModel);
        activeModel = null;
      }

      shadow.geometry.dispose();
      shadow.material.dispose();
      floorRing.geometry.dispose();
      floorRing.material.dispose();
      renderer.dispose();
    }
  };
}
