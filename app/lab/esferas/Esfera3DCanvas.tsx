"use client";

import { useGSAP } from "@gsap/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import styles from "./esferas.module.css";

gsap.registerPlugin(ScrollTrigger);

const viewBox = { width: 1440, height: 900 };
const ribbonDefinitions = [
  {
    desktop: "M -180 150 C 130 40 220 470 450 330 C 680 190 710 670 930 480 C 1120 320 1240 760 1600 570",
    mobile: "M -180 130 C 510 30 750 420 510 570 C 300 700 900 700 1440 870",
    width: 76,
  },
  {
    desktop: "M 1580 120 C 1280 220 1320 520 1080 350 C 830 170 760 530 570 690 C 370 850 170 610 -180 790",
    mobile: "M 1440 80 C 720 220 1080 430 570 590 C 180 710 510 800 -270 900",
    width: 58,
  },
] as const;

type ScreenPoint = { x: number; y: number };

function worldToScreen(point: THREE.Vector3, camera: THREE.Camera, size: { width: number; height: number }) {
  const projected = point.clone().project(camera);
  return {
    x: (projected.x * 0.5 + 0.5) * size.width,
    y: (-projected.y * 0.5 + 0.5) * size.height,
  };
}

function screenToWorldOffset(
  base: THREE.Vector3,
  offset: ScreenPoint,
  camera: THREE.Camera,
  size: { width: number; height: number },
) {
  const projected = base.clone().project(camera);
  const shifted = new THREE.Vector3(
    projected.x + (offset.x / size.width) * 2,
    projected.y - (offset.y / size.height) * 2,
    projected.z,
  ).unproject(camera);

  return shifted.sub(base);
}

function closestPointOnSegment(point: ScreenPoint, start: ScreenPoint, end: ScreenPoint) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  const amount = lengthSquared === 0
    ? 0
    : Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  const closest = { x: start.x + dx * amount, y: start.y + dy * amount };
  const delta = { x: point.x - closest.x, y: point.y - closest.y };

  return { closest, distance: Math.hypot(delta.x, delta.y) };
}

function sampleRibbon(path: SVGPathElement, progress: number): ScreenPoint[] {
  const rect = path.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0 || progress <= 0) return [];

  const length = path.getTotalLength();
  const points: ScreenPoint[] = [];
  const sampleCount = Math.max(12, Math.ceil(progress * 72));
  const scaleX = rect.width / viewBox.width;
  const scaleY = rect.height / viewBox.height;

  for (let index = 0; index <= sampleCount; index += 1) {
    const point = path.getPointAtLength((length * progress * index) / sampleCount);
    points.push({
      x: rect.left + point.x * scaleX,
      y: rect.top + point.y * scaleY,
    });
  }

  return points;
}

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

type AccentGeometryProps = {
  isNarrow: boolean;
  ringRef: MutableRefObject<THREE.Group | null>;
  accentOvalRef: MutableRefObject<THREE.Group | null>;
  discRef: MutableRefObject<THREE.Group | null>;
};

function AccentGeometry({ isNarrow, ringRef, accentOvalRef, discRef }: AccentGeometryProps) {
  return (
    <>
      <group ref={ringRef}>
        <mesh rotation={[0.35, 0.15, -0.55]} castShadow>
          <torusGeometry args={[0.3, 0.065, 16, 48]} />
          <meshStandardMaterial color="#e7d8cf" roughness={0.82} metalness={0.01} />
        </mesh>
      </group>

      <group ref={accentOvalRef}>
        <RoundedOval
          position={[0, 0, 0]}
          scale={isNarrow ? [0.16, 0.34, 0.16] : [0.2, 0.42, 0.2]}
          rotation={[0.2, -0.35, 0.7]}
          color="#edc1ab"
          roughness={0.72}
        />
      </group>

      <group ref={discRef}>
        <mesh
          rotation={[0.12, -0.2, 0.08]}
          scale={isNarrow ? [0.5, 0.5, 0.18] : [0.8, 0.8, 0.18]}
          castShadow
        >
          <cylinderGeometry args={[0.42, 0.42, 0.35, 64]} />
          <meshStandardMaterial color="#d8d7d4" roughness={0.86} metalness={0.01} />
        </mesh>
      </group>
    </>
  );
}

type SceneObjectsProps = {
  scrollProgress: MutableRefObject<number>;
  ribbonPaths: MutableRefObject<(SVGPathElement | null)[]>;
};

function SceneObjects({ scrollProgress, ribbonPaths }: SceneObjectsProps) {
  const { camera, size, viewport } = useThree();
  const isNarrow = viewport.width < 4;
  const leftSphere = useRef<THREE.Group>(null);
  const oval = useRef<THREE.Group>(null);
  const foregroundSphere = useRef<THREE.Group>(null);
  const block = useRef<THREE.Group>(null);
  const smallSphere = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Group>(null);
  const accentOval = useRef<THREE.Group>(null);
  const disc = useRef<THREE.Group>(null);
  const sideMemory = useRef(new Map<THREE.Group, Map<SVGPathElement, number>>());

  useFrame(() => {
    const objects = [
      {
        ref: leftSphere,
        base: isNarrow ? [-1.05, 1.25, -0.7] : [-3.45, 0.72, -0.72],
        radius: isNarrow ? 0.6 : 0.98,
      },
      {
        ref: oval,
        base: isNarrow ? [-0.38, 0.42, 0.12] : [-1.62, 0.35, 0.08],
        radius: isNarrow ? 0.5 : 0.9,
      },
      {
        ref: foregroundSphere,
        base: isNarrow ? [0.12, -0.78, 0.95] : [0.28, -0.72, 0.95],
        radius: isNarrow ? 0.62 : 0.88,
      },
      {
        ref: block,
        base: isNarrow ? [0.82, 1.22, -0.16] : [2.48, 1.08, -0.14],
        radius: isNarrow ? 0.44 : 0.72,
      },
      {
        ref: smallSphere,
        base: isNarrow ? [0.78, -1.15, 0.55] : [2.28, -1.16, 0.58],
        radius: isNarrow ? 0.28 : 0.42,
      },
      {
        ref: ring,
        base: isNarrow ? [0.14, 1.62, -0.28] : [0.2, 1.62, -0.25],
        radius: isNarrow ? 0.3 : 0.38,
      },
      {
        ref: accentOval,
        base: isNarrow ? [0.7, 0.34, 0.72] : [1.28, 0.42, 0.7],
        radius: isNarrow ? 0.3 : 0.42,
      },
      {
        ref: disc,
        base: isNarrow ? [-0.74, -1.38, -0.18] : [-1.55, -1.45, -0.3],
        radius: isNarrow ? 0.24 : 0.42,
      },
    ] as const;

    const progress = scrollProgress.current;
    const paths = ribbonPaths.current
      .map((path, index) => ({ path, definition: ribbonDefinitions[index] }))
      .filter((entry): entry is { path: SVGPathElement; definition: (typeof ribbonDefinitions)[number] } => entry.path !== null);

    const sampledRibbons = paths
      .map(({ path, definition }) => ({
        path,
        width: definition.width,
        points: sampleRibbon(path, progress),
      }))
      .filter(({ points }) => points.length > 1);

    objects.forEach(({ ref, base, radius }) => {
      const group = ref.current;
      if (!group) return;

      const baseWorld = new THREE.Vector3(...base);
      const baseScreen = worldToScreen(baseWorld, camera, size);
      const screenOffset = { x: 0, y: 0 };

      sampledRibbons.forEach(({ path, width, points }) => {
        let nearest = { closest: points[0], distance: Number.POSITIVE_INFINITY };

        for (let index = 1; index < points.length; index += 1) {
          const candidate = closestPointOnSegment(
            { x: baseScreen.x + screenOffset.x, y: baseScreen.y + screenOffset.y },
            points[index - 1],
            points[index],
          );
          if (candidate.distance < nearest.distance) nearest = candidate;
        }

        const radiusScreenPoint = worldToScreen(
          baseWorld.clone().add(new THREE.Vector3(radius, 0, 0)),
          camera,
          size,
        );
        const objectRadius = Math.hypot(
          radiusScreenPoint.x - baseScreen.x,
          radiusScreenPoint.y - baseScreen.y,
        );
        const strokeScale = Math.max(size.width / viewBox.width, size.height / viewBox.height);
        const requiredDistance = objectRadius * 1.15 + (width * strokeScale) / 2 + 14;
        if (nearest.distance >= requiredDistance) return;

        let direction = {
          x: baseScreen.x + screenOffset.x - nearest.closest.x,
          y: baseScreen.y + screenOffset.y - nearest.closest.y,
        };
        let distance = Math.hypot(direction.x, direction.y);

        if (distance < 1) {
          const memory = sideMemory.current.get(group) ?? new Map<SVGPathElement, number>();
          const tangent = points[Math.min(1, points.length - 1)];
          const normal = { x: -(tangent.y - points[0].y), y: tangent.x - points[0].x };
          const normalLength = Math.hypot(normal.x, normal.y) || 1;
          const seed = Math.sin(base[0] * 12.9898 + base[1] * 78.233) >= 0 ? 1 : -1;
          const side = memory.get(path) ?? seed;
          memory.set(path, side);
          sideMemory.current.set(group, memory);
          direction = { x: (normal.x / normalLength) * side, y: (normal.y / normalLength) * side };
          distance = 1;
        }

        const clearance = requiredDistance - distance;
        screenOffset.x += (direction.x / distance) * clearance;
        screenOffset.y += (direction.y / distance) * clearance;
      });

      const worldOffset = screenToWorldOffset(baseWorld, screenOffset, camera, size);
      const target = baseWorld.add(worldOffset);
      group.position.x += (target.x - group.position.x) * 0.18;
      group.position.y += (target.y - group.position.y) * 0.18;
      group.position.z += (target.z - group.position.z) * 0.18;
    });
  });

  return (
    <>
      {isNarrow ? (
        <>
          <group ref={leftSphere}><Sphere position={[0, 0, 0]} scale={[0.56, 0.56, 0.56]} color="#f5e8dc" roughness={0.8} /></group>
          <group ref={oval}><RoundedOval position={[0, 0, 0]} scale={[0.53, 0.57, 0.57]} rotation={[0, 0, -0.3]} color="#e9e3df" roughness={0.74} /></group>
          <group ref={foregroundSphere}><Sphere position={[0, 0, 0]} scale={[0.59, 0.59, 0.59]} color="#f1eee8" roughness={0.7} /></group>
          <group ref={block}><RoundedBlock position={[0, 0, 0]} scale={[0.4, 0.37, 0.37]} rotation={[0.12, -0.18, 0.2]} /></group>
          <group ref={smallSphere}><Sphere position={[0, 0, 0]} scale={[0.25, 0.25, 0.25]} color="#eccab8" roughness={0.77} /></group>
        </>
      ) : (
        <>
          <group ref={leftSphere}><Sphere position={[0, 0, 0]} scale={[0.94, 0.94, 0.94]} color="#f5e8dc" roughness={0.8} /></group>
          <group ref={oval}><RoundedOval position={[0, 0, 0]} scale={[0.86, 0.8, 0.8]} rotation={[0, 0, -0.3]} color="#e9e3df" roughness={0.74} /></group>
          <group ref={foregroundSphere}><Sphere position={[0, 0, 0]} scale={[0.85, 0.85, 0.85]} color="#f1eee8" roughness={0.7} /></group>
          <group ref={block}><RoundedBlock position={[0, 0, 0]} scale={[0.64, 0.61, 0.56]} rotation={[0.12, -0.18, 0.2]} /></group>
          <group ref={smallSphere}><Sphere position={[0, 0, 0]} scale={[0.38, 0.38, 0.38]} color="#eccab8" roughness={0.77} /></group>
        </>
      )}
      <AccentGeometry isNarrow={isNarrow} ringRef={ring} accentOvalRef={accentOval} discRef={disc} />
    </>
  );
}

export default function Esfera3DCanvas() {
  const stage = useRef<HTMLDivElement>(null);
  const ribbonPaths = useRef<(SVGPathElement | null)[]>([]);
  const scrollProgress = useRef(0);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 700px)");
    const syncViewport = () => setIsNarrow(mediaQuery.matches);
    syncViewport();
    mediaQuery.addEventListener("change", syncViewport);
    return () => mediaQuery.removeEventListener("change", syncViewport);
  }, []);

  useGSAP(
    () => {
      if (!stage.current) return;

      const paths = ribbonPaths.current.filter((path): path is SVGPathElement => path !== null);
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
    <section ref={stage} className={styles.stage} aria-label="Estudo 01: esfera 3D com fitas">
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
          <SceneObjects scrollProgress={scrollProgress} ribbonPaths={ribbonPaths} />
        </Canvas>
      </div>

      <div className={styles.ribbonLayer} aria-hidden="true">
        <svg className={styles.ribbonSvg} viewBox="0 0 1440 900" preserveAspectRatio="none">
          {ribbonDefinitions.map((ribbon, index) => (
            <path
              key={`ribbon-${index}`}
              ref={(path) => {
                ribbonPaths.current[index] = path;
              }}
              className={index === 0 ? styles.ribbonPathPrimary : styles.ribbonPathSecondary}
              d={isNarrow ? ribbon.mobile : ribbon.desktop}
              fill="none"
            />
          ))}
        </svg>
      </div>

      <p className={styles.label}>Estudo 01</p>
    </section>
  );
}
