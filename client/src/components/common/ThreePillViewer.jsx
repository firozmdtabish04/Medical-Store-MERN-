import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Sparkles, X, RotateCcw } from "lucide-react";

export default function ThreePillViewer() {
  const [open, setOpen] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const container = canvasRef.current;
    if (!container) return;

    let animId;
    const width = 280;
    const height = 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // LIGHTS
    const amb = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(amb);

    const dir1 = new THREE.DirectionalLight(0x22c55e, 2);
    dir1.position.set(5, 5, 5);
    scene.add(dir1);

    const dir2 = new THREE.DirectionalLight(0x38bdf8, 1.5);
    dir2.position.set(-5, -5, -3);
    scene.add(dir2);

    // 3D TWO-TONE MEDICINE CAPSULE
    const group = new THREE.Group();
    scene.add(group);

    // Green half
    const greenMat = new THREE.MeshPhysicalMaterial({
      color: 0x16a34a,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });

    // White half
    const whiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.05,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
    });

    // Cylinder body
    const bodyGeom = new THREE.CylinderGeometry(0.85, 0.85, 1.6, 32);
    const bodyMesh = new THREE.Mesh(bodyGeom, greenMat);
    bodyMesh.position.y = 0.4;
    group.add(bodyMesh);

    // Bottom cylinder half
    const bottomGeom = new THREE.CylinderGeometry(0.85, 0.85, 0.8, 32);
    const bottomMesh = new THREE.Mesh(bottomGeom, whiteMat);
    bottomMesh.position.y = -0.4;
    group.add(bottomMesh);

    // Top dome
    const topDome = new THREE.SphereGeometry(
      0.85,
      32,
      16,
      0,
      Math.PI * 2,
      0,
      Math.PI / 2,
    );
    const topMesh = new THREE.Mesh(topDome, greenMat);
    topMesh.position.y = 1.2;
    group.add(topMesh);

    // Bottom dome
    const botDome = new THREE.SphereGeometry(
      0.85,
      32,
      16,
      0,
      Math.PI * 2,
      Math.PI / 2,
      Math.PI / 2,
    );
    const botMesh = new THREE.Mesh(botDome, whiteMat);
    botMesh.position.y = -0.8;
    group.add(botMesh);

    group.rotation.z = 0.5;

    // DRAG TO ROTATE
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      group.rotation.y += deltaX * 0.015;
      group.rotation.x += deltaY * 0.015;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // ANIMATE
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isDragging) {
        group.rotation.y += 0.012;
      }
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      bodyGeom.dispose();
      bottomGeom.dispose();
      topDome.dispose();
      botDome.dispose();
      greenMat.dispose();
      whiteMat.dispose();
      renderer.dispose();
    };
  }, [open]);

  return (
    <>
      {/* Floating 3D Toggle Pill Button */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-green-200 bg-white/95 px-4 py-2.5 text-xs font-bold text-gray-800 shadow-xl backdrop-blur transition hover:border-green-400 hover:scale-105 active:scale-95"
        title="Interactive 3D Medicine Capsule"
      >
        <Sparkles size={16} className="text-green-600 animate-spin" />
        <span>3D Pill Lab</span>
      </button>

      {/* 3D Modal Window */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-80 rounded-3xl border border-gray-100 bg-white/95 p-5 shadow-2xl backdrop-blur animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">
                Three.js 3D Capsule
              </h3>
              <p className="text-[10px] font-medium text-gray-400">
                Click & drag to rotate in real time
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              <X size={18} />
            </button>
          </div>

          <div
            ref={canvasRef}
            className="my-3 flex h-60 w-full cursor-grab items-center justify-center active:cursor-grabbing rounded-2xl bg-gradient-to-b from-green-50/50 to-emerald-50/30"
          />

          <div className="flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1 text-green-700 font-semibold">
              <RotateCcw size={13} /> Interactive WebGL
            </span>
            <span className="rounded-md bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">
              Three.js Active
            </span>
          </div>
        </div>
      )}
    </>
  );
}
