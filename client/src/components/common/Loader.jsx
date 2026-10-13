import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Float,
  PerspectiveCamera,
  ContactShadows,
  Environment,
} from "@react-three/drei";
import {
  Code2,
  Cpu,
  Globe,
  Layers,
  ShieldCheck,
  Zap,
  HeartPulse,
  Database,
  GitBranch,
  Terminal,
} from "lucide-react";

// ---------------- 3D MEDICINE CAPSULE ----------------

const FloatingCapsule = () => {
  return (
    <group scale={1.2}>
      <Float speed={2} rotationIntensity={0.65} floatIntensity={1.2}>
        <mesh position={[0, 0.22, 0]}>
          <capsuleGeometry args={[0.3, 0.4, 32, 32]} />
          <meshStandardMaterial
            color="#10b981"
            roughness={0.18}
            metalness={0.45}
          />
        </mesh>

        <mesh position={[0, -0.22, 0]} rotation={[Math.PI, 0, 0]}>
          <capsuleGeometry args={[0.3, 0.4, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.2}
            metalness={0.12}
          />
        </mesh>

        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.301, 0.301, 0.025, 48]} />
          <meshStandardMaterial color="#d1fae5" roughness={0.3} />
        </mesh>
      </Float>
    </group>
  );
};

// ---------------- SKILL BADGE ----------------

const SkillBadge = ({ icon: Icon, label, color }) => (
  <div style={styles.skillBadge}>
    <span
      style={{
        ...styles.skillIcon,
        backgroundColor: `${color}18`,
      }}
    >
      <Icon size={16} color={color} />
    </span>
    <span style={styles.skillLabel}>{label}</span>
  </div>
);

// ---------------- LOADER ----------------

const Loader = () => {
  return (
    <main style={styles.pageContainer}>
      <div style={styles.backgroundOrb} />
      <div style={styles.backgroundOrbTwo} />

      {/* MAIN TWO-COLUMN LAYOUT */}
      <section className="medifind-main-layout" style={styles.mainLayout}>
        {/* LEFT: DEVELOPER PROFILE */}
        <div className="medifind-left-panel" style={styles.leftPanel}>
          <div style={styles.eyebrow}>
            <span style={styles.eyebrowDot} />
            BUILT WITH PURPOSE
          </div>

          <h2 className="medifind-hero-title" style={styles.heroTitle}>
            Meet the developer
            <br />
            behind <span style={styles.greenText}>MediFind.</span>
          </h2>

          <p style={styles.introText}>
            Building technology that makes healthcare more accessible,
            efficient, and convenient for everyone.
          </p>

          {/* DEVELOPER CARD */}
          <div className="medifind-dev-card" style={styles.devCard}>
            <div style={styles.cardHeader}>
              <div style={styles.profileArea}>
                <div style={styles.avatar}>TF</div>

                <div>
                  <h3 style={styles.devName}>Tabish Firoz</h3>
                  <p style={styles.devTitle}>Full Stack Engineer</p>
                  <p style={styles.devStack}>React.js · Spring Boot</p>
                </div>
              </div>

              <div style={styles.statusBadge}>
                <span style={styles.statusDot} />
                Developer
              </div>
            </div>

            <div style={styles.divider} />

            <p style={styles.description}>
              Full Stack Engineer with 6+ months of hands-on experience building
              enterprise applications using React.js, Spring Boot, and MySQL.
              Experienced in reusable UI components, REST API integration,
              secure backend development, responsive design, and dashboard
              performance optimization.
            </p>

            <div style={styles.skillsHeading}>TECHNICAL SKILLS</div>

            <div style={styles.skillsGrid}>
              <SkillBadge icon={Code2} label="React.js" color="#0891b2" />
              <SkillBadge
                icon={Cpu}
                label="Java & Spring Boot"
                color="#16a34a"
              />
              <SkillBadge icon={Globe} label="REST APIs" color="#2563eb" />
              <SkillBadge
                icon={Database}
                label="MySQL & JDBC"
                color="#7c3aed"
              />
              <SkillBadge
                icon={ShieldCheck}
                label="Spring Security"
                color="#dc2626"
              />
              <SkillBadge icon={Layers} label="Tailwind CSS" color="#0891b2" />
              <SkillBadge
                icon={GitBranch}
                label="Git & Postman"
                color="#ea580c"
              />
              <SkillBadge
                icon={Terminal}
                label="Linux & Docker"
                color="#475569"
              />
            </div>

            <div style={styles.cardFooter}>
              <span style={styles.footerLine} />
              <span>Designed, Developed &amp; Deployed by</span>
              <strong>Tabish Firoz</strong>
            </div>
          </div>
        </div>

        {/* RIGHT: 3D MEDICINE CAPSULE */}
        <div className="medifind-right-panel" style={styles.rightPanel}>
          <div style={styles.sceneGlow} />

          <div style={styles.sceneLabel}>
            <span style={styles.sceneLabelIcon}>
              <HeartPulse size={18} />
            </span>
            <div>
              <p style={styles.sceneLabelTitle}>Healthcare, reimagined.</p>
              <p style={styles.sceneLabelSubtitle}>Technology meets wellness</p>
            </div>
          </div>

          <div style={styles.canvasContainer}>
            <Canvas dpr={[1, 2]} gl={{ antialias: true, alpha: true }}>
              <PerspectiveCamera makeDefault position={[0, 0, 4.2]} fov={40} />

              <ambientLight intensity={1.1} />

              <spotLight
                position={[5, 7, 6]}
                angle={0.35}
                penumbra={1}
                intensity={2.5}
              />

              <pointLight
                position={[-4, -2, 3]}
                color="#10b981"
                intensity={2}
              />

              <pointLight
                position={[4, 0, -3]}
                color="#a7f3d0"
                intensity={1.5}
              />

              <Suspense fallback={null}>
                <FloatingCapsule />

                <ContactShadows
                  position={[0, -1.35, 0]}
                  opacity={0.3}
                  scale={5}
                  blur={2.8}
                  far={2}
                />

                <Environment preset="city" />
              </Suspense>
            </Canvas>
          </div>

          {/* FLOATING INFO CARD */}
          <div style={styles.floatingCardTop}>
            <span style={styles.floatingIconGreen}>
              <ShieldCheck size={18} />
            </span>
            <div>
              <p style={styles.floatingTitle}>Security-focused</p>
              <p style={styles.floatingSubtitle}>
                Secure application development
              </p>
            </div>
          </div>

          <div style={styles.floatingCardBottom}>
            <span style={styles.floatingIconBlue}>
              <Zap size={18} />
            </span>
            <div>
              <p style={styles.floatingTitle}>Simple. Smart. Fast.</p>
              <p style={styles.floatingSubtitle}>
                A better healthcare experience
              </p>
            </div>
          </div>

          <div style={styles.sceneCaption}>
            <span style={styles.captionDot} />
            YOUR HEALTH, OUR PRIORITY
          </div>
        </div>
      </section>

      {/* BOTTOM LOADING INDICATOR */}
      <footer className="medifind-bottom-footer" style={styles.bottomFooter}>
        <div style={styles.loadingText}>
          <span style={styles.loadingDot} />
          Preparing your MediFind experience...
        </div>

        <div style={styles.progressTrack}>
          <div style={styles.progressBar} />
        </div>

        <p style={styles.copyright}>
          © {new Date().getFullYear()} MediFind
          <span style={styles.copyrightSeparator}>•</span>
          Designed &amp; developed by Tabish Firoz
        </p>
      </footer>

      {/* RESPONSIVE STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
        }

        @keyframes loaderProgress {
          0% { transform: translateX(-110%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(220%); }
        }

        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 900px) {
          .medifind-main-layout {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }

          .medifind-left-panel {
            max-width: 620px !important;
          }

          .medifind-right-panel {
            min-height: 380px !important;
          }
        }

        @media (max-width: 520px) {
          .medifind-header-caption,
          .medifind-secure-badge {
            display: none !important;
          }

          .medifind-main-layout {
            padding: 24px 0 !important;
          }

          .medifind-hero-title {
            font-size: 2rem !important;
          }

          .medifind-dev-card {
            padding: 16px !important;
          }

          .medifind-right-panel {
            min-height: 310px !important;
          }

          .medifind-bottom-footer {
            padding-bottom: 12px !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </main>
  );
};

// ---------------- STYLES ----------------

const styles = {
  pageContainer: {
    minHeight: "100vh",
    width: "100%",
    position: "relative",
    isolation: "isolate",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    background:
      "linear-gradient(135deg, #f8fffc 0%, #f8fafc 48%, #effcf6 100%)",
    fontFamily:
      "'Plus Jakarta Sans', Inter, system-ui, -apple-system, sans-serif",
    color: "#0f172a",
    padding: "0 5%",
  },

  backgroundOrb: {
    position: "absolute",
    width: "420px",
    height: "420px",
    borderRadius: "50%",
    background: "rgba(16,185,129,0.07)",
    filter: "blur(70px)",
    top: "10%",
    right: "-150px",
    zIndex: -1,
    pointerEvents: "none",
  },

  backgroundOrbTwo: {
    position: "absolute",
    width: "300px",
    height: "300px",
    borderRadius: "50%",
    background: "rgba(45,212,191,0.08)",
    filter: "blur(65px)",
    bottom: "0",
    left: "-100px",
    zIndex: -1,
    pointerEvents: "none",
  },

  header: {
    width: "100%",
    maxWidth: "1440px",
    margin: "0 auto",
    minHeight: "86px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid rgba(148,163,184,0.17)",
    flexShrink: 0,
  },

  logoIcon: {
    width: "44px",
    height: "44px",
    flexShrink: 0,
    borderRadius: "14px",
    background: "linear-gradient(135deg, #10b981, #047857)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 20px rgba(16,185,129,0.22)",
  },

  headerBrand: {
    fontSize: "1.5rem",
    fontWeight: 800,
    letterSpacing: "-0.8px",
    margin: 0,
  },

  headerCaption: {
    margin: "3px 0 0",
    fontSize: "0.58rem",
    letterSpacing: "1.6px",
    fontWeight: 700,
    color: "#94a3b8",
  },

  greenText: {
    color: "#059669",
  },

  secureBadge: {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#047857",
    backgroundColor: "rgba(236,253,245,0.85)",
    border: "1px solid #d1fae5",
    padding: "9px 13px",
    borderRadius: "100px",
    fontSize: "0.72rem",
    fontWeight: 700,
  },

  mainLayout: {
    flex: 1,
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1.05fr 0.95fr",
    alignItems: "center",
    gap: "clamp(25px, 5vw, 75px)",
    padding: "30px 0",
  },

  leftPanel: {
    width: "100%",
    maxWidth: "590px",
    margin: "0 auto",
    animation: "fadeIn 0.7s ease-out both",
  },

  eyebrow: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.68rem",
    letterSpacing: "2px",
    color: "#059669",
    fontWeight: 800,
    marginBottom: "18px",
  },

  eyebrowDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
  },

  heroTitle: {
    fontSize: "clamp(2rem, 3.3vw, 3.25rem)",
    lineHeight: 1.16,
    letterSpacing: "-1.8px",
    fontWeight: 800,
    margin: "0 0 14px",
    color: "#0f172a",
  },

  introText: {
    color: "#64748b",
    fontSize: "0.91rem",
    lineHeight: 1.8,
    maxWidth: "490px",
    margin: "0 0 25px",
  },

  devCard: {
    backgroundColor: "rgba(255,255,255,0.84)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border: "1px solid rgba(226,232,240,0.9)",
    borderRadius: "25px",
    padding: "23px",
    width: "100%",
    boxShadow: "0 18px 55px rgba(15,118,110,0.075)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  profileArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  avatar: {
    width: "52px",
    height: "52px",
    flexShrink: 0,
    background: "linear-gradient(145deg, #0f172a, #334155)",
    color: "#ffffff",
    borderRadius: "17px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 800,
    fontSize: "1.05rem",
    boxShadow: "0 7px 18px rgba(15,23,42,0.15)",
  },

  devName: {
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 4px",
  },

  devTitle: {
    fontSize: "0.76rem",
    color: "#64748b",
    margin: "0 0 3px",
  },

  devStack: {
    fontSize: "0.68rem",
    color: "#059669",
    fontWeight: 700,
    margin: 0,
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    fontSize: "0.65rem",
    fontWeight: 800,
    color: "#047857",
    background: "#ecfdf5",
    border: "1px solid #d1fae5",
    padding: "7px 10px",
    borderRadius: "100px",
  },

  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    animation: "pulseDot 1.8s infinite",
  },

  divider: {
    height: "1px",
    backgroundColor: "#f1f5f9",
    margin: "19px 0",
  },

  description: {
    fontSize: "0.81rem",
    color: "#475569",
    lineHeight: 1.85,
    margin: "0 0 20px",
    borderLeft: "3px solid #10b981",
    paddingLeft: "13px",
  },

  skillsHeading: {
    fontSize: "0.62rem",
    color: "#94a3b8",
    letterSpacing: "1.4px",
    fontWeight: 800,
    marginBottom: "11px",
  },

  skillsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "9px",
  },

  skillBadge: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "10px 9px",
    borderRadius: "13px",
    border: "1px solid #f1f5f9",
    backgroundColor: "rgba(248,250,252,0.8)",
  },

  skillIcon: {
    width: "30px",
    height: "30px",
    flexShrink: 0,
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  skillLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    color: "#475569",
    lineHeight: 1.4,
  },

  achievementGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "8px",
    marginTop: "18px",
  },

  achievement: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "11px 9px",
    borderRadius: "13px",
    background: "#f0fdf4",
    border: "1px solid #dcfce7",
  },

  achievementNumber: {
    fontSize: "1.2rem",
    fontWeight: 800,
    color: "#059669",
  },

  achievement: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    padding: "11px 9px",
    borderRadius: "13px",
    background: "#f0fdf4",
    border: "1px solid #dcfce7",
    fontSize: "0.61rem",
    color: "#64748b",
    lineHeight: 1.45,
  },

  cardFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "5px",
    fontSize: "0.66rem",
    color: "#94a3b8",
    borderTop: "1px solid #f1f5f9",
    paddingTop: "17px",
    marginTop: "20px",
    textAlign: "center",
  },

  footerLine: {
    width: "20px",
    height: "2px",
    backgroundColor: "#10b981",
    borderRadius: "5px",
    marginRight: "4px",
  },

  rightPanel: {
    position: "relative",
    width: "100%",
    minHeight: "530px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  sceneGlow: {
    position: "absolute",
    width: "80%",
    aspectRatio: "1",
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(16,185,129,0.17) 0%, rgba(167,243,208,0.09) 45%, transparent 72%)",
    pointerEvents: "none",
  },

  sceneLabel: {
    position: "absolute",
    top: "8%",
    left: "0",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    gap: "11px",
    background: "rgba(255,255,255,0.8)",
    border: "1px solid rgba(255,255,255,0.95)",
    padding: "12px 16px",
    borderRadius: "17px",
    boxShadow: "0 10px 35px rgba(15,23,42,0.05)",
    backdropFilter: "blur(12px)",
  },

  sceneLabelIcon: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#059669",
    backgroundColor: "#d1fae5",
    borderRadius: "12px",
  },

  sceneLabelTitle: {
    fontSize: "0.78rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 3px",
  },

  sceneLabelSubtitle: {
    fontSize: "0.65rem",
    color: "#94a3b8",
    margin: 0,
  },

  canvasContainer: {
    width: "100%",
    height: "450px",
    position: "relative",
    zIndex: 1,
  },

  floatingCardTop: {
    position: "absolute",
    top: "25%",
    right: "0",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 15px",
    borderRadius: "17px",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(226,232,240,0.85)",
    boxShadow: "0 12px 30px rgba(15,23,42,0.07)",
    animation: "gentleFloat 4s ease-in-out infinite",
  },

  floatingCardBottom: {
    position: "absolute",
    bottom: "18%",
    left: "0",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 15px",
    borderRadius: "17px",
    background: "rgba(255,255,255,0.9)",
    border: "1px solid rgba(226,232,240,0.85)",
    boxShadow: "0 12px 30px rgba(15,23,42,0.07)",
    animation: "gentleFloat 4.5s ease-in-out infinite",
  },

  floatingIconGreen: {
    width: "37px",
    height: "37px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    color: "#059669",
    background: "#d1fae5",
  },

  floatingIconBlue: {
    width: "37px",
    height: "37px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    color: "#2563eb",
    background: "#dbeafe",
  },

  floatingTitle: {
    fontSize: "0.72rem",
    fontWeight: 800,
    color: "#0f172a",
    margin: "0 0 4px",
  },

  floatingSubtitle: {
    fontSize: "0.62rem",
    color: "#94a3b8",
    margin: 0,
  },

  sceneCaption: {
    position: "absolute",
    bottom: "5%",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.65rem",
    letterSpacing: "2px",
    fontWeight: 800,
    color: "#64748b",
  },

  captionDot: {
    width: "7px",
    height: "7px",
    backgroundColor: "#10b981",
    borderRadius: "50%",
  },

  bottomFooter: {
    width: "100%",
    maxWidth: "1240px",
    margin: "0 auto",
    padding: "12px 0 18px",
    borderTop: "1px solid rgba(148,163,184,0.17)",
    flexShrink: 0,
  },

  loadingText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    color: "#64748b",
    fontSize: "0.72rem",
    marginBottom: "11px",
  },

  loadingDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    backgroundColor: "#10b981",
    animation: "pulseDot 1.5s infinite",
  },

  progressTrack: {
    width: "100%",
    height: "3px",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: "#dbeee7",
  },

  progressBar: {
    width: "35%",
    height: "100%",
    borderRadius: "10px",
    background: "linear-gradient(90deg, #10b981, #5eead4)",
    animation: "loaderProgress 2s ease-in-out infinite",
  },

  copyright: {
    fontSize: "0.65rem",
    textAlign: "center",
    color: "#94a3b8",
    margin: "12px 0 0",
  },

  copyrightSeparator: {
    margin: "0 9px",
    color: "#cbd5e1",
  },
};

export default Loader;
