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

type SceneObjectEntry = {
  ref: MutableRefObject<THREE.Group | null>;
  base: [number, number, number];
  radius: number;
  escape: [number, number];
};

type RibbonRegion = {
  path: SVGPathElement;
  width: number;
  points: ScreenPoint[];
};

type PositionPlan = {
  ref: MutableRefObject<THREE.Group | null>;
  base: THREE.Vector3;
  safe: THREE.Vector3;
  start: number;
  settle: number;
};

function distanceToPath(point: ScreenPoint, points: ScreenPoint[]) {
  let nearest = Number.POSITIVE_INFINITY;

  for (let index = 1; index < points.length; index += 1) {
    nearest = Math.min(nearest, closestPointOnSegment(point, points[index - 1], points[index]).distance);
  }

  return nearest;
}

function collisionInterval(point: ScreenPoint, requiredDistance: number, points: ScreenPoint[]) {
  let start = 1;
  let end = 0;
  const segmentCount = points.length - 1;

  for (let index = 1; index < points.length; index += 1) {
    if (closestPointOnSegment(point, points[index - 1], points[index]).distance <= requiredDistance) {
      start = Math.min(start, (index - 1) / segmentCount);
      end = Math.max(end, index / segmentCount);
    }
  }

  return end > 0 ? { start, end } : null;
}

function smoothstep(amount: number) {
  const clamped = Math.max(0, Math.min(1, amount));
  return clamped * clamped * (3 - 2 * clamped);
}

function findSafeScreenPosition(
  base: ScreenPoint,
  objectRadius: number,
  regions: RibbonRegion[],
  escape: [number, number],
  margin: number,
) {
  const preferredAngle = Math.atan2(escape[1], escape[0]);
  const angles = [0, 0.5, -0.5, 1, -1, 1.5, -1.5, Math.PI];
  const distances = [1, 1.25, 1.6, 2.1, 2.8, 3.6];

  for (const distance of distances) {
    for (const angleOffset of angles) {
      const angle = preferredAngle + angleOffset;
      const candidate = {
        x: base.x + Math.cos(angle) * objectRadius * distance,
        y: base.y + Math.sin(angle) * objectRadius * distance,
      };
      const clear = regions.every(({ points, width }) => {
        const ribbonHalfWidth = (width * Math.max(window.innerWidth / viewBox.width, window.innerHeight / viewBox.height)) / 2;
        return distanceToPath(candidate, points) > objectRadius + ribbonHalfWidth + margin;
      });

      if (clear) return candidate;
    }
  }

  return {
    x: base.x + Math.cos(preferredAngle) * objectRadius * 4.5,
    y: base.y + Math.sin(preferredAngle) * objectRadius * 4.5,
  };
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
  const plans = useRef<PositionPlan[]>([]);

  const objects = useMemo<SceneObjectEntry[]>(
    () => [
      { ref: leftSphere, base: isNarrow ? [-1.05, 1.25, -0.7] : [-3.45, 0.72, -0.72], radius: isNarrow ? 0.6 : 0.98, escape: [0, -1] },
      { ref: oval, base: isNarrow ? [-0.38, 0.42, 0.12] : [-1.62, 0.35, 0.08], radius: isNarrow ? 0.5 : 0.9, escape: [0, -1] },
      { ref: foregroundSphere, base: isNarrow ? [0.12, -0.78, 0.95] : [0.28, -0.72, 0.95], radius: isNarrow ? 0.62 : 0.88, escape: [0, 1] },
      { ref: block, base: isNarrow ? [0.82, 1.22, -0.16] : [2.48, 1.08, -0.14], radius: isNarrow ? 0.44 : 0.72, escape: [1, 0] },
      { ref: smallSphere, base: isNarrow ? [0.78, -1.15, 0.55] : [2.28, -1.16, 0.58], radius: isNarrow ? 0.28 : 0.42, escape: [1, 0] },
      { ref: ring, base: isNarrow ? [0.14, 1.62, -0.28] : [0.2, 1.62, -0.25], radius: isNarrow ? 0.3 : 0.38, escape: [0, -1] },
      { ref: accentOval, base: isNarrow ? [0.7, 0.34, 0.72] : [1.28, 0.42, 0.7], radius: isNarrow ? 0.3 : 0.42, escape: [1, 0] },
      { ref: disc, base: isNarrow ? [-0.74, -1.38, -0.18] : [-1.55, -1.45, -0.3], radius: isNarrow ? 0.24 : 0.42, escape: [0, 1] },
    ],
    [isNarrow, leftSphere, oval, foregroundSphere, block, smallSphere, ring, accentOval, disc],
  );

  useEffect(() => {
    let cancelled = false;
    const frame = requestAnimationFrame(() => {
      const paths = ribbonPaths.current
        .map((path, index) => ({ path, definition: ribbonDefinitions[index] }))
        .filter((entry): entry is { path: SVGPathElement; definition: (typeof ribbonDefinitions)[number] } => entry.path !== null);
      const regions: RibbonRegion[] = paths
        .map(({ path, definition }) => ({ path, width: definition.width, points: sampleRibbon(path, 1) }))
        .filter(({ points }) => points.length > 1);

      const nextPlans = objects.map(({ ref, base, radius, escape }) => {
        const baseWorld = new THREE.Vector3(...base);
        const baseScreen = worldToScreen(baseWorld, camera, size);
        const radiusScreenPoint = worldToScreen(baseWorld.clone().add(new THREE.Vector3(radius, 0, 0)), camera, size);
        const objectRadius = Math.hypot(radiusScreenPoint.x - baseScreen.x, radiusScreenPoint.y - baseScreen.y);
        const strokeScale = Math.max(size.width / viewBox.width, size.height / viewBox.height);
        const margin = 14;
        const intervals = regions
          .map(({ points, width }) => collisionInterval(baseScreen, objectRadius * 1.15 + (width * strokeScale) / 2 + margin, points))
          .filter((interval): interval is { start: number; end: number } => interval !== null);

        if (intervals.length === 0) {
          return { ref, base: baseWorld, safe: baseWorld.clone(), start: 1, settle: 1 };
        }

        const firstStart = Math.max(0, Math.min(...intervals.map((interval) => interval.start)) - 0.045);
        const safeScreen = findSafeScreenPosition(baseScreen, objectRadius, regions, escape, margin);
        const safe = baseWorld.clone().add(screenToWorldOffset(baseWorld, {
          x: safeScreen.x - baseScreen.x,
          y: safeScreen.y - baseScreen.y,
        }, camera, size));

        return {
          ref,
          base: baseWorld,
          safe,
          start: firstStart,
          settle: Math.min(1, firstStart + 0.12),
        };
      });

      if (!cancelled) plans.current = nextPlans;
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, [camera, isNarrow, objects, ribbonPaths, size]);

  useFrame(() => {
    const progress = scrollProgress.current;
    plans.current.forEach(({ ref, base, safe, start, settle }) => {
      if (!ref.current) return;
      const amount = start >= 1 ? 0 : smoothstep((progress - start) / Math.max(settle - start, 0.001));
      ref.current.position.lerpVectors(base, safe, amount);
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

      const trigger = ScrollTrigger.create({
        trigger: stage.current,
        start: "top top",
        end: () => `+=${Math.max(stage.current!.offsetHeight - window.innerHeight, 1)}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
          paths.forEach((path, index) => {
            gsap.set(path, { strokeDashoffset: lengths[index] * (1 - self.progress) });
          });
        },
      });

      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        trigger.update();
      });
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
