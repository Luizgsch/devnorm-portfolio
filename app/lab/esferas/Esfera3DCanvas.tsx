"use client";

import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./esferas.module.css";

function Sphere() {
  const { viewport } = useThree();
  const isNarrow = viewport.width < 4;
  const x = isNarrow ? 0.16 : Math.min(viewport.width * 0.32, 2.2);

  return (
    <mesh position={[x, -0.16, 0]} castShadow>
      <sphereGeometry args={[1.52, 96, 96]} />
      <meshStandardMaterial
        color="#f4eee6"
        roughness={0.76}
        metalness={0.02}
        side={THREE.FrontSide}
      />
    </mesh>
  );
}

export default function Esfera3DCanvas() {
  return (
    <section className={styles.stage} aria-label="Estudo 01: esfera 3D">
      <div className={styles.canvasLayer} aria-hidden="true">
        <Canvas
          className={styles.canvas}
          camera={{ position: [0, 0, 6], fov: 36 }}
          dpr={[1, 1.5]}
          frameloop="demand"
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          shadows
          fallback={<div className={styles.fallback} />}
        >
          <color attach="background" args={["#f2dfd1"]} />
          <hemisphereLight args={["#fff8f0", "#9a9b9d", 2.1]} />
          <ambientLight intensity={0.22} />
          <directionalLight
            castShadow
            color="#ffb18f"
            intensity={3.4}
            position={[-3.8, 4.8, 4.5]}
            shadow-mapSize={[1024, 1024]}
          />
          <directionalLight color="#b9bdc5" intensity={0.72} position={[4.5, 0.8, 2.5]} />
          <Sphere />
        </Canvas>
      </div>

      <p className={styles.label}>Estudo 01</p>
    </section>
  );
}
