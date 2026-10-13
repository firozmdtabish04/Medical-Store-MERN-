import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  PerspectiveCamera,
  ContactShadows,
  Environment,
} from "@react-three/drei";
import { Code2, Cpu, Database, ShieldCheck } from "lucide-react";

const FloatingCapsule = () => (
  <Float speed={2} rotationIntensity={0.7} floatIntensity={1.2}>
    <group rotation={[0, 0, -0.35]}>
      <mesh position={[0, 0.2, 0]}>
        <capsuleGeometry args={[0.3, 0.4, 16, 32]} />
        <meshStandardMaterial
          color="#10b981"
          roughness={0.2}
          metalness={0.35}
        />
      </mesh>

      <mesh position={[0, -0.2, 0]}>
        <capsuleGeometry args={[0.3, 0.4, 16, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
    </group>
  </Float>
);

const Loader = () => {
  const skills = [
    { icon: Code2, label: "React.js", color: "#0891b2" },
    { icon: Cpu, label: "Java & Spring Boot", color: "#16a34a" },
    { icon: Database, label: "MySQL & REST APIs", color: "#7c3aed" },
    { icon: ShieldCheck, label: "Spring Security", color: "#dc2626" },
  ];

  return (
    <main style={styles.page}>
      <section className="loader-layout" style={styles.layout}>
        {/* LEFT: DEVELOPER */}
        <div style={styles.profile}>
          <span style={styles.eyebrow}>MEDIFIND · ABOUT THE DEVELOPER</span>

          <h1 style={styles.name}>
            Tabish <span style={styles.green}>Firoz.</span>
          </h1>

          <p style={styles.role}>Full Stack Engineer</p>

          <p style={styles.description}>
            Building responsive web applications and secure backend services
            with React.js, Spring Boot, and MySQL. Passionate about clean UI,
            reusable components, and solving real-world problems through
            technology.
          </p>

          <div style={styles.skills}>
            {skills.map(({ icon: Icon, label, color }) => (
              <div key={label} style={styles.skill}>
                <Icon size={16} color={color} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <p style={styles.credit}>
            Designed, Developed & Deployed by <strong>Tabish Firoz</strong>
          </p>
        </div>

        {/* RIGHT: 3D MEDICINE */}
        <div className="loader-visual" style={styles.visual}>
          <div style={styles.glow} />

          <Canvas dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
            <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={42} />

            <ambientLight intensity={1.1} />
            <directionalLight position={[4, 5, 5]} intensity={2} />
            <pointLight position={[-3, 0, 2]} color="#10b981" intensity={2} />

            <Suspense fallback={null}>
              <FloatingCapsule />

              <ContactShadows
                position={[0, -1.2, 0]}
                opacity={0.25}
                scale={4}
                blur={2.5}
                far={2}
              />

              <Environment preset="city" />
            </Suspense>
          </Canvas>

          <span style={styles.visualLabel}>YOUR HEALTH, OUR PRIORITY</span>
        </div>
      </section>

      {/* MINIMAL LOADING INDICATOR */}
      <footer style={styles.footer}>
        <div style={styles.loadingText}>
          <span style={styles.dot} />
          Preparing your MediFind experience...
        </div>

        <div style={styles.track}>
          <div style={styles.progress} />
        </div>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        @keyframes loading {
          from { transform: translateX(-110%); }
          to { transform: translateX(300%); }
        }

        @keyframes pulse {
          50% { opacity: 0.4; }
        }

        @media (max-width: 760px) {
          .loader-layout {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            padding: 32px 0 12px !important;
          }

          .loader-visual {
            grid-row: 1;
            min-height: 240px !important;
            height: 240px !important;
          }
        }

        @media (max-width: 420px) {
          .loader-layout {
            padding: 20px 0 8px !important;
          }

          .loader-visual {
            min-height: 200px !important;
            height: 200px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>
    </main>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "24px 7%",
    overflow: "hidden",
    background:
      "radial-gradient(circle at 75% 45%, #ecfdf5 0%, #f8fafc 48%, #ffffff 100%)",
    color: "#0f172a",
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },

  layout: {
    width: "100%",
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    alignItems: "center",
    gap: "40px",
  },

  profile: {
    maxWidth: "510px",
    margin: "0 auto",
    width: "100%",
  },

  eyebrow: {
    fontSize: "0.68rem",
    letterSpacing: "1.8px",
    fontWeight: 700,
    color: "#059669",
  },

  name: {
    fontSize: "clamp(2.6rem, 5vw, 4rem)",
    fontWeight: 800,
    letterSpacing: "-2.5px",
    lineHeight: 1.1,
    margin: "18px 0 8px",
  },

  green: {
    color: "#10b981",
  },

  role: {
    color: "#475569",
    fontSize: "1.05rem",
    fontWeight: 600,
    margin: "0 0 18px",
  },

  description: {
    maxWidth: "450px",
    color: "#64748b",
    fontSize: "0.9rem",
    lineHeight: 1.85,
    margin: "0 0 24px",
  },

  skills: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },

  skill: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "12px 10px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    background: "rgba(255,255,255,0.8)",
    fontSize: "0.76rem",
    fontWeight: 600,
    color: "#475569",
  },

  credit: {
    fontSize: "0.72rem",
    color: "#94a3b8",
    marginTop: "28px",
    lineHeight: 1.8,
  },

  visual: {
    width: "100%",
    height: "440px",
    minWidth: 0,
    position: "relative",
  },

  glow: {
    position: "absolute",
    inset: "12%",
    borderRadius: "50%",
    background: "rgba(16,185,129,0.12)",
    filter: "blur(45px)",
    pointerEvents: "none",
  },

  visualLabel: {
    position: "absolute",
    bottom: "8%",
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: "0.65rem",
    letterSpacing: "2px",
    fontWeight: 700,
    color: "#64748b",
    pointerEvents: "none",
  },

  footer: {
    width: "100%",
    maxWidth: "1100px",
    margin: "30px auto 0",
  },

  loadingText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    fontSize: "0.74rem",
    color: "#64748b",
    marginBottom: "12px",
  },

  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#10b981",
    animation: "pulse 1.4s infinite",
  },

  track: {
    width: "100%",
    maxWidth: "260px",
    height: "3px",
    margin: "0 auto",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#d1fae5",
  },

  progress: {
    width: "35%",
    height: "100%",
    background: "#10b981",
    borderRadius: "10px",
    animation: "loading 1.8s ease-in-out infinite",
  },
};

export default Loader;
