<template>
  <div 
    ref="containerRef"
    class="fixed top-0 left-0 w-full h-full -z-10"
    style="pointer-events: none;"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useTheme } from '@/composables/useTheme';

const containerRef = ref<HTMLDivElement | null>(null);
const { isDark } = useTheme();

let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let particlesMesh: THREE.Points | null = null;
let connectionLines: THREE.LineSegments | null = null;
let particlesGeometry: THREE.BufferGeometry | null = null;
let particlesPositions: Float32Array | null = null;
let controls: OrbitControls | null = null;
let animationId: number | null = null;
let handleResize: (() => void) | null = null;

const CONNECTION_DISTANCE = 1.5;
const PARTICLES_COUNT = 600;
const MAX_CONNECTIONS = 1500;

const THEME_COLORS = {
  dark: {
    background: 0x1f1f1f,
    particles: 0xa78bfa,
    connections: 0x9d8bf9,
    decorations: 0x1a1a2e
  },
  light: {
    background: 0xf0f0f0,
    particles: 0x4338ca,
    connections: 0x4f46e5,
    decorations: 0xe0e7ff
  }
} as const;

interface ParticleData {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

interface ExtendedMesh extends THREE.Mesh {
  rotationSpeed: {
    x: number;
    y: number;
    z: number;
  };
}

interface ExtendedPoints extends THREE.Points {
  particlesData: ParticleData[];
}

const initThree = () => {
  if (!containerRef.value) return;

  scene = new THREE.Scene();
  const currentColors = isDark.value ? THEME_COLORS.dark : THEME_COLORS.light;
  scene.background = new THREE.Color(currentColors.background);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  containerRef.value.appendChild(renderer.domElement);

  particlesGeometry = new THREE.BufferGeometry();
  particlesPositions = new Float32Array(PARTICLES_COUNT * 3);

  const particlesData: ParticleData[] = [];

  for (let i = 0; i < PARTICLES_COUNT; i++) {
    const i3 = i * 3;
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    const z = (Math.random() - 0.5) * 20;

    particlesPositions[i3] = x;
    particlesPositions[i3 + 1] = y;
    particlesPositions[i3 + 2] = z;

    particlesData.push({
      x, y, z,
      vx: (Math.random() - 0.5) * 0.01,
      vy: (Math.random() - 0.5) * 0.01,
      vz: (Math.random() - 0.5) * 0.01,
    });
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlesPositions, 3));

  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: currentColors.particles,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true,
  });

  particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  (particlesMesh as ExtendedPoints).particlesData = particlesData;
  scene.add(particlesMesh);

  const connectionGeometry = new THREE.BufferGeometry();
  const connectionPositions = new Float32Array(MAX_CONNECTIONS * 6);
  connectionGeometry.setAttribute('position', new THREE.BufferAttribute(connectionPositions, 3));

  const connectionMaterial = new THREE.LineBasicMaterial({
    color: currentColors.connections,
    transparent: true,
    opacity: 0.25,
    vertexColors: false,
  });

  connectionLines = new THREE.LineSegments(connectionGeometry, connectionMaterial);
  scene.add(connectionLines);

  const geometries = [
    new THREE.TorusGeometry(8, 0.5, 16, 100),
    new THREE.OctahedronGeometry(6, 0),
    new THREE.IcosahedronGeometry(5, 0),
  ];

  geometries.forEach((geometry) => {
    const material = new THREE.MeshBasicMaterial({
      color: currentColors.decorations,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });

    const mesh = new THREE.Mesh(geometry, material) as unknown as ExtendedMesh;
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    );
    mesh.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.002,
      y: (Math.random() - 0.5) * 0.002,
      z: (Math.random() - 0.5) * 0.002,
    };
    if (scene) scene.add(mesh);
  });

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.5;

  handleResize = () => {
    if (!camera || !renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  window.addEventListener('resize', handleResize);

  const updateConnections = () => {
    if (!connectionLines || !particlesPositions) return;

    const positions = connectionLines.geometry.attributes.position.array as Float32Array;
    let connectionCount = 0;

    const sqConnectionDistance = CONNECTION_DISTANCE * CONNECTION_DISTANCE;

    for (let i = 0; i < positions.length; i++) {
      positions[i] = 0;
    }

    for (let i = 0; i < PARTICLES_COUNT && connectionCount < MAX_CONNECTIONS; i++) {
      const i3 = i * 3;
      const x1 = particlesPositions[i3];
      const y1 = particlesPositions[i3 + 1];
      const z1 = particlesPositions[i3 + 2];

      for (let j = i + 1; j < PARTICLES_COUNT && connectionCount < MAX_CONNECTIONS; j++) {
        const j3 = j * 3;
        const x2 = particlesPositions[j3];
        const y2 = particlesPositions[j3 + 1];
        const z2 = particlesPositions[j3 + 2];

        const dx = x2 - x1;
        const dy = y2 - y1;
        const dz = z2 - z1;

        const sqDistance = dx * dx + dy * dy + dz * dz;

        if (sqDistance < sqConnectionDistance) {
          const lineIndex = connectionCount * 6;
          positions[lineIndex] = x1;
          positions[lineIndex + 1] = y1;
          positions[lineIndex + 2] = z1;
          positions[lineIndex + 3] = x2;
          positions[lineIndex + 4] = y2;
          positions[lineIndex + 5] = z2;
          connectionCount++;
        }
      }
    }

    connectionLines.geometry.setDrawRange(0, connectionCount * 2);
    connectionLines.geometry.attributes.position.needsUpdate = true;
  };

  const updateParticles = () => {
    if (!particlesMesh || !particlesPositions) return;

    const extendedPoints = particlesMesh as ExtendedPoints;
    if (!extendedPoints.particlesData) return;

    for (let i = 0; i < PARTICLES_COUNT; i++) {
      const i3 = i * 3;
      const particle = extendedPoints.particlesData[i];

      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.z += particle.vz;

      if (Math.abs(particle.x) > 10) particle.vx *= -1;
      if (Math.abs(particle.y) > 10) particle.vy *= -1;
      if (Math.abs(particle.z) > 10) particle.vz *= -1;

      particlesPositions[i3] = particle.x;
      particlesPositions[i3 + 1] = particle.y;
      particlesPositions[i3 + 2] = particle.z;
    }

    particlesGeometry!.attributes.position.needsUpdate = true;
  };

  const animate = () => {
    if (!scene || !camera || !renderer || !particlesMesh || !connectionLines || !controls) return;

    animationId = requestAnimationFrame(animate);

    updateParticles();
    updateConnections();

    scene.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        const extendedMesh = child as ExtendedMesh;
        if (extendedMesh.rotationSpeed) {
          extendedMesh.rotation.x += extendedMesh.rotationSpeed.x;
          extendedMesh.rotation.y += extendedMesh.rotationSpeed.y;
          extendedMesh.rotation.z += extendedMesh.rotationSpeed.z;
        }
      }
    });

    controls.update();
    renderer.render(scene, camera);
  };

  animate();
};

const cleanup = () => {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  if (handleResize) {
    window.removeEventListener('resize', handleResize);
    handleResize = null;
  }

  if (renderer && containerRef.value && renderer.domElement.parentNode) {
    containerRef.value.removeChild(renderer.domElement);
    renderer.dispose();
  }

  if (controls) {
    controls.dispose();
  }

  scene = null;
  camera = null;
  renderer = null;
  particlesMesh = null;
  connectionLines = null;
  particlesGeometry = null;
  particlesPositions = null;
  controls = null;
};

onMounted(() => {
  initThree();
});

onUnmounted(() => {
  cleanup();
});

const updateTheme = () => {
  if (!scene || !particlesMesh || !connectionLines) return;

  const currentColors = isDark.value ? THEME_COLORS.dark : THEME_COLORS.light;

  scene.background = new THREE.Color(currentColors.background);

  if (particlesMesh.material instanceof THREE.PointsMaterial) {
    particlesMesh.material.color.setHex(currentColors.particles);
  }

  if (connectionLines.material instanceof THREE.LineBasicMaterial) {
    connectionLines.material.color.setHex(currentColors.connections);
  }

  scene.children.forEach((child) => {
    if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
      child.material.color.setHex(currentColors.decorations);
    }
  });
};

watch(isDark, () => {
  if (scene && renderer && particlesMesh && connectionLines) {
    updateTheme();
  } else {
    initThree();
  }
}, { immediate: false });
</script>