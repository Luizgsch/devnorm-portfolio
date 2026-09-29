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

function AccentGeometry({ isNarrow }: { isNarrow: boolean }) {
  return (
    <>
      <mesh
        position={isNarrow ? [0.14, 1.62, -0.28] : [0.2, 1.62, -0.25]}
        rotation={[0.35, 0.15, -0.55]}
        castShadow
      >
        <torusGeometry args={[0.3, 0.065, 16, 48]} />
        <meshStandardMaterial color="#e7d8cf" roughness={0.82} metalness={0.01} />
      </mesh>

      <mesh
        position={isNarrow ? [0.7, 0.34, 0.72] : [1.28, 0.42, 0.7]}
        rotation={[0.2, -0.35, 0.7]}
        scale={isNarrow ? [0.16, 0.34, 0.16] : [0.2, 0.42, 0.2]}
        castShadow
      >
        <sphereGeometry args={[1, 48, 48]} />
        <meshStandardMaterial color="#edc1ab" roughness={0.72} metalness={0.02} />
      </mesh>

      <mesh
        position={isNarrow ? [-0.74, -1.38, -0.18] : [-1.55, -1.45, -0.3]}
        rotation={[0.12, -0.2, 0.08]}
        scale={isNarrow ? [0.5, 0.5, 0.18] : [0.8, 0.8, 0.18]}
        castShadow
      >
        <cylinderGeometry args={[0.42, 0.42, 0.35, 64]} />
        <meshStandardMaterial color="#d8d7d4" roughness={0.86} metalness={0.01} />
      </mesh>
    </>
  );
}

function SceneObjects() {
  const { viewport } = useThree();
  const isNarrow = viewport.width < 4;

  return (
    <>
      {isNarrow ? (
        <>
          <Sphere position={[-1.05, 1.25, -0.7]} scale={[0.56, 0.56, 0.56]} color="#f5e8dc" roughness={0.8} />
          <Sphere
            position={[-0.38, 0.42, 0.12]}
            scale={[0.53, 0.34, 0.34]}
            rotation={[0, 0, -0.3]}
            color="#e9e3df"
            roughness={0.74}
          />
          <Sphere position={[0.12, -0.78, 0.95]} scale={[0.59, 0.59, 0.59]} color="#f1eee8" roughness={0.7} />
          <RoundedBlock position={[0.82, 1.22, -0.16]} scale={[0.4, 0.37, 0.37]} rotation={[0.12, -0.18, 0.2]} />
          <Sphere position={[0.78, -1.15, 0.55]} scale={[0.25, 0.25, 0.25]} color="#eccab8" roughness={0.77} />
        </>
      ) : (
        <>
          <Sphere position={[-3.45, 0.72, -0.72]} scale={[0.94, 0.94, 0.94]} color="#f5e8dc" roughness={0.8} />
          <Sphere
            position={[-1.62, 0.35, 0.08]}
            scale={[0.86, 0.48, 0.48]}
            rotation={[0, 0, -0.3]}
            color="#e9e3df"
            roughness={0.74}
          />
          <Sphere position={[0.28, -0.72, 0.95]} scale={[0.85, 0.85, 0.85]} color="#f1eee8" roughness={0.7} />
          <RoundedBlock position={[2.48, 1.08, -0.14]} scale={[0.64, 0.61, 0.56]} rotation={[0.12, -0.18, 0.2]} />
          <Sphere position={[2.28, -1.16, 0.58]} scale={[0.38, 0.38, 0.38]} color="#eccab8" roughness={0.77} />
        </>
      )}
      <AccentGeometry isNarrow={isNarrow} />
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
