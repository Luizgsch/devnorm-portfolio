"use client";

import { useGSAP } from "@gsap/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type * as THREE from "three";
import { useMemo, useRef } from "react";
import styles from "./esferas.module.css";

gsap.registerPlugin(ScrollTrigger);

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

function RoundedOval({
  position,
  scale,
  rotation,
  color,
  roughness,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  color: string;
  roughness: number;
}) {
  const geometry = useMemo(() => new RoundedBoxGeometry(2, 1, 1, 8, 0.45), []);

  return (
    <mesh position={position} scale={scale} rotation={rotation} castShadow geometry={geometry}>
      <meshStandardMaterial color={color} roughness={roughness} metalness={0.02} />
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

      <RoundedOval
        position={isNarrow ? [0.7, 0.34, 0.72] : [1.28, 0.42, 0.7]}
        scale={isNarrow ? [0.16, 0.34, 0.16] : [0.2, 0.42, 0.2]}
        rotation={[0.2, -0.35, 0.7]}
        color="#edc1ab"
        roughness={0.72}
      />

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

type SceneObjectsProps = {
  scrollProgress: React.MutableRefObject<number>;
};

function SceneObjects({ scrollProgress }: SceneObjectsProps) {
  const { viewport } = useThree();
  const isNarrow = viewport.width < 4;
  const leftSphere = useRef<THREE.Group>(null);
  const oval = useRef<THREE.Group>(null);
  const foregroundSphere = useRef<THREE.Group>(null);
  const block = useRef<THREE.Group>(null);
  const smallSphere = useRef<THREE.Group>(null);

  useFrame(() => {
    const objects = [
      {
        ref: leftSphere,
        base: isNarrow ? [-1.05, 1.25, -0.7] : [-3.45, 0.72, -0.72],
        offset: isNarrow ? [-0.16, 0.08, 0.02] : [-0.34, 0.12, 0.04],
        focus: 0.2,
      },
      {
        ref: oval,
        base: isNarrow ? [-0.38, 0.42, 0.12] : [-1.62, 0.35, 0.08],
        offset: isNarrow ? [-0.08, 0.18, 0.04] : [-0.18, 0.3, 0.06],
        focus: 0.37,
      },
      {
        ref: foregroundSphere,
        base: isNarrow ? [0.12, -0.78, 0.95] : [0.28, -0.72, 0.95],
        offset: isNarrow ? [0.04, -0.2, 0.1] : [0.08, -0.34, 0.14],
        focus: 0.56,
      },
      {
        ref: block,
        base: isNarrow ? [0.82, 1.22, -0.16] : [2.48, 1.08, -0.14],
        offset: isNarrow ? [0.15, 0.06, 0.04] : [0.28, 0.12, 0.08],
        focus: 0.72,
      },
      {
        ref: smallSphere,
        base: isNarrow ? [0.78, -1.15, 0.55] : [2.28, -1.16, 0.58],
        offset: isNarrow ? [0.14, -0.08, 0.06] : [0.25, -0.12, 0.1],
        focus: 0.84,
      },
    ] as const;

    const progress = scrollProgress.current;

    objects.forEach(({ ref, base, offset, focus }) => {
      if (!ref.current) return;

      const proximity = Math.max(0, 1 - Math.abs(progress - focus) / 0.15);
      const factor = proximity * (isNarrow ? 0.76 : 1);
      const targetX = base[0] + offset[0] * factor;
      const targetY = base[1] + offset[1] * factor;
      const targetZ = base[2] + offset[2] * factor;

      ref.current.position.x += (targetX - ref.current.position.x) * 0.13;
      ref.current.position.y += (targetY - ref.current.position.y) * 0.13;
      ref.current.position.z += (targetZ - ref.current.position.z) * 0.13;
    });
  });

  return (
    <>
      {isNarrow ? (
        <>
          <group ref={leftSphere}>
            <Sphere position={[0, 0, 0]} scale={[0.56, 0.56, 0.56]} color="#f5e8dc" roughness={0.8} />
          </group>
          <group ref={oval}>
            <RoundedOval position={[0, 0, 0]} scale={[0.53, 0.57, 0.57]} rotation={[0, 0, -0.3]} color="#e9e3df" roughness={0.74} />
          </group>
          <group ref={foregroundSphere}>
            <Sphere position={[0, 0, 0]} scale={[0.59, 0.59, 0.59]} color="#f1eee8" roughness={0.7} />
          </group>
          <group ref={block}>
            <RoundedBlock position={[0, 0, 0]} scale={[0.4, 0.37, 0.37]} rotation={[0.12, -0.18, 0.2]} />
          </group>
          <group ref={smallSphere}>
            <Sphere position={[0, 0, 0]} scale={[0.25, 0.25, 0.25]} color="#eccab8" roughness={0.77} />
          </group>
        </>
      ) : (
        <>
          <group ref={leftSphere}>
            <Sphere position={[0, 0, 0]} scale={[0.94, 0.94, 0.94]} color="#f5e8dc" roughness={0.8} />
          </group>
          <group ref={oval}>
            <RoundedOval position={[0, 0, 0]} scale={[0.86, 0.8, 0.8]} rotation={[0, 0, -0.3]} color="#e9e3df" roughness={0.74} />
          </group>
          <group ref={foregroundSphere}>
            <Sphere position={[0, 0, 0]} scale={[0.85, 0.85, 0.85]} color="#f1eee8" roughness={0.7} />
          </group>
          <group ref={block}>
            <RoundedBlock position={[0, 0, 0]} scale={[0.64, 0.61, 0.56]} rotation={[0.12, -0.18, 0.2]} />
          </group>
          <group ref={smallSphere}>
            <Sphere position={[0, 0, 0]} scale={[0.38, 0.38, 0.38]} color="#eccab8" roughness={0.77} />
          </group>
        </>
      )}
      <AccentGeometry isNarrow={isNarrow} />
    </>
  );
}

export default function Esfera3DCanvas() {
  const stage = useRef<HTMLDivElement>(null);
  const desktopPath = useRef<SVGPathElement>(null);
  const mobilePath = useRef<SVGPathElement>(null);
  const scrollProgress = useRef(0);

  useGSAP(
    () => {
      if (!stage.current) return;

      const paths = [desktopPath.current, mobilePath.current].filter(
        (path): path is SVGPathElement => path !== null,
      );
      const lengths = paths.map((path) => path.getTotalLength());

      paths.forEach((path, index) => {
        gsap.set(path, {
          strokeDasharray: lengths[index],
          strokeDashoffset: lengths[index],
        });
      });

      ScrollTrigger.create({
        trigger: stage.current,
        start: "top top",
        end: () => `+=${Math.max(stage.current!.offsetHeight - window.innerHeight, 1)}`,
        scrub: 0.8,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          paths.forEach((path, index) => {
            gsap.set(path, { strokeDashoffset: lengths[index] * (1 - self.progress) });
          });
        },
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: stage },
  );

  return (
    <section ref={stage} className={styles.stage} aria-label="Estudo 01: esfera 3D com fita" >
      <div className={styles.canvasLayer} aria-hidden="true">
        <Canvas
          className={styles.canvas}
          camera={{ position: [0, 0, 6], fov: 36 }}
          dpr={[1, 1.5]}
          frameloop="always"
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
          <SceneObjects scrollProgress={scrollProgress} />
        </Canvas>
      </div>

      <div className={styles.ribbonLayer} aria-hidden="true">
        <svg className={styles.ribbonSvg} viewBox="0 0 1440 900" preserveAspectRatio="none">
          <path
            ref={desktopPath}
            className={styles.ribbonPathDesktop}
            d="M -120 190 C 100 70 230 470 430 330 C 630 190 670 650 880 470 C 1080 300 1150 770 1570 570"
            fill="none"
          />
          <path
            ref={mobilePath}
            className={styles.ribbonPathMobile}
            d="M -90 170 C 170 80 280 390 210 560 C 150 710 330 680 470 840"
            fill="none"
          />
        </svg>
      </div>

      <p className={styles.label}>Estudo 01</p>
    </section>
  );
}
