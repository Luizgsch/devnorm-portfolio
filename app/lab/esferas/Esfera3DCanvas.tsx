"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { useMemo } from "react";
import styles from "./esferas.module.css";

type SphereProps = {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  roughness: number;
  rotation?: [number, number, number];
};

function Sphere({ position, scale, color, roughness, rotation = [0, 0, 0] }: SphereProps) {
  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow>
      <sphereGeometry args={[1, 96, 96]} />
      <meshStandardMaterial color={color} roughness={roughness} metalness={0.02} />
    </mesh>
  );
}

function RoundedBlock({
  position,
  scale,
  rotation,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
}) {
  const geometry = useMemo(() => new RoundedBoxGeometry(2, 2, 2, 8, 0.28), []);

  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow geometry={geometry}>
      <meshStandardMaterial color="#f0c0a8" roughness={0.7} metalness={0.02} />
    </mesh>
  );
}

function SceneObjects() {
  const { viewport } = useThree();
  const isNarrow = viewport.width < 4;

  return (
    <>
      {isNarrow ? (
        <>
          <Sphere position={[-1.05, 1.25, -0.7]} scale={[1.02, 1.02, 1.02]} color="#f5e8dc" roughness={0.8} />
          <Sphere
            position={[-0.38, 0.42, 0.12]}
            scale={[0.96, 0.62, 0.62]}
            rotation={[0, 0, -0.3]}
            color="#e9e3df"
            roughness={0.74}
          />
          <Sphere position={[0.12, -0.78, 0.95]} scale={[1.08, 1.08, 1.08]} color="#f1eee8" roughness={0.7} />
          <RoundedBlock position={[0.82, 1.22, -0.16]} scale={[0.72, 0.68, 0.68]} rotation={[0.12, -0.18, 0.2]} />
          <Sphere position={[0.78, -1.15, 0.55]} scale={[0.46, 0.46, 0.46]} color="#eccab8" roughness={0.77} />
        </>
      ) : (
        <>
          <Sphere position={[-3.45, 0.72, -0.72]} scale={[1.72, 1.72, 1.72]} color="#f5e8dc" roughness={0.8} />
          <Sphere
            position={[-1.62, 0.35, 0.08]}
            scale={[1.58, 0.88, 0.88]}
            rotation={[0, 0, -0.3]}
            color="#e9e3df"
            roughness={0.74}
          />
          <Sphere position={[0.28, -0.72, 0.95]} scale={[1.55, 1.55, 1.55]} color="#f1eee8" roughness={0.7} />
          <RoundedBlock position={[2.48, 1.08, -0.14]} scale={[1.16, 1.1, 1.02]} rotation={[0.12, -0.18, 0.2]} />
          <Sphere position={[2.28, -1.16, 0.58]} scale={[0.7, 0.7, 0.7]} color="#eccab8" roughness={0.77} />
        </>
      )}
    </>
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
          <SceneObjects />
        </Canvas>
      </div>

      <p className={styles.label}>Estudo 01</p>
    </section>
  );
}
