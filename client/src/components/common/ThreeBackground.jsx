import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId;
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 25;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x22c55e, 1.2); // MediFind green
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8); // Cyan blue
    dirLight2.position.set(-15, -10, -10);
    scene.add(dirLight2);

    // 3D FLOATING CAPSULES / PILLS
    const pillsGroup = new THREE.Group();
    scene.add(pillsGroup);

    const pillGeom = new THREE.CapsuleGeometry(0.8, 1.8, 8, 16);

    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0x16a34a, // Green
        roughness: 0.25,
        metalness: 0.1,
        transparent: true,
        opacity: 0.65,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8, // Light Blue
        roughness: 0.3,
        metalness: 0.15,
        transparent: true,
        opacity: 0.6,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xffffff, // White
        roughness: 0.2,
        metalness: 0.05,
        transparent: true,
        opacity: 0.7,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x10b981, // Emerald
        roughness: 0.25,
        metalness: 0.1,
        transparent: true,
        opacity: 0.65,
      }),
    ];

    const pills = [];
    const pillCount = 14;

    for (let i = 0; i < pillCount; i++) {
      const mat = materials[i % materials.length];
      const mesh = new THREE.Mesh(pillGeom, mat);

      // Random distribution
      mesh.position.x = (Math.random() - 0.5) * 40;
      mesh.position.y = (Math.random() - 0.5) * 26;
      mesh.position.z = (Math.random() - 0.5) * 20 - 5;

      mesh.rotation.x = Math.random() * Math.PI;
      mesh.rotation.y = Math.random() * Math.PI;
      mesh.rotation.z = Math.random() * Math.PI;

      const scale = 0.55 + Math.random() * 0.55;
      mesh.scale.set(scale, scale, scale);

      pillsGroup.add(mesh);

      pills.push({
        mesh,
        rotSpeedX: (Math.random() - 0.5) * 0.012,
        rotSpeedY: (Math.random() - 0.5) * 0.015,
        rotSpeedZ: (Math.random() - 0.5) * 0.008,
        floatSpeed: 0.001 + Math.random() * 0.002,
        floatOffset: Math.random() * Math.PI * 2,
        baseY: mesh.position.y,
      });
    }

    // 3D MOLECULAR / DNA PARTICLES
    const particleCount = 120;
    const particleGeom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 35;
      positions[i + 2] = (Math.random() - 0.5) * 30 - 8;
    }

    particleGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0x22c55e,
      size: 0.22,
      transparent: true,
      opacity: 0.45,
    });

    const particles = new THREE.Points(particleGeom, particleMat);
    scene.add(particles);

    // MOUSE PARALLAX
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    // RESIZE HANDLER
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    // ANIMATION LOOP
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      targetX += (mouseX * 1.5 - targetX) * 0.03;
      targetY += (mouseY * 1.5 - targetY) * 0.03;

      pillsGroup.rotation.y = targetX * 0.15;
      pillsGroup.rotation.x = -targetY * 0.15;

      // Animate pills
      pills.forEach((p) => {
        p.mesh.rotation.x += p.rotSpeedX;
        p.mesh.rotation.y += p.rotSpeedY;
        p.mesh.rotation.z += p.rotSpeedZ;
        p.mesh.position.y =
          p.baseY + Math.sin(elapsedTime * 1.2 + p.floatOffset) * 0.6;
      });

      // Animate particles
      particles.rotation.y = elapsedTime * 0.02 + targetX * 0.1;
      particles.rotation.x = elapsedTime * 0.01 - targetY * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      pillGeom.dispose();
      materials.forEach((m) => m.dispose());
      particleGeom.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-35"
      aria-hidden="true"
    />
  );
}
