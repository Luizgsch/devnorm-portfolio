"use client";

import { useGSAP } from "@gsap/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./tecido-3d.module.css";

gsap.registerPlugin(ScrollTrigger);

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uAmbient;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vFold;

  float foldHeight(vec3 point) {
    float broad = sin(point.x * 2.1 + point.y * 0.78 + uTime * 0.18) * 0.22;
    float middle = sin(point.x * 4.8 - point.y * 1.55 - uTime * 0.1) * 0.065;
    float fine = cos(point.y * 5.4 + point.x * 0.55 + uTime * 0.08) * 0.028;
    float drape = smoothstep(-1.0, 1.5, point.x) * 0.08;
    return (broad + middle + fine + drape) * uAmbient;
  }

  void main() {
    vUv = uv;
    vec3 displaced = position;
    displaced.z += foldHeight(position);

    float epsilon = 0.025;
    float heightX = foldHeight(position + vec3(epsilon, 0.0, 0.0));
    float heightY = foldHeight(position + vec3(0.0, epsilon, 0.0));
    vec3 tangentX = vec3(epsilon, 0.0, heightX - displaced.z);
    vec3 tangentY = vec3(0.0, epsilon, heightY - displaced.z);
    vNormal = normalize(normalMatrix * normalize(cross(tangentX, tangentY)));
    vFold = displaced.z;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vFold;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 keyLight = normalize(vec3(-0.48, 0.78, 0.58));
    vec3 rimLight = normalize(vec3(0.78, 0.08, 0.42));
    float diffuse = max(dot(normal, keyLight), 0.0);
    float rim = pow(max(dot(normal, rimLight), 0.0), 2.2);
    float foldShadow = smoothstep(-0.22, 0.08, vFold);
    float softAmbient = 0.24 + sin(uTime * 0.12 + vUv.x * 2.0) * 0.025;

    vec3 deepCrimson = vec3(0.12, 0.004, 0.016);
    vec3 crimson = vec3(0.49, 0.012, 0.07);
    vec3 reflectedCrimson = vec3(0.82, 0.045, 0.13);
    vec3 color = mix(deepCrimson, crimson, softAmbient + diffuse * 0.72);
    color += reflectedCrimson * (rim * 0.24 + foldShadow * 0.08);
    gl_FragColor = vec4(color, 1.0);
  }
`;

function FabricMesh({ reducedMotion }: { reducedMotion: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const elapsed = useRef(0);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmbient: { value: 1 },
    }),
    [],
  );

  useFrame((_, delta) => {
    if (!material.current) return;
    elapsed.current += reducedMotion ? 0 : delta;
    material.current.uniforms.uTime.value = elapsed.current;
  });

  const fabricWidth = Math.min(viewport.width * 0.94, 10.8);
  const fabricHeight = fabricWidth * 0.56;

  return (
    <mesh scale={[fabricWidth / 2, fabricHeight / 1.2, 1]} rotation={[0.08, -0.12, -0.08]}>
      <planeGeometry args={[2, 1.2, 150, 90]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function Tecido3DCanvas() {
  const stage = useRef<HTMLDivElement>(null);
  const group = useRef<THREE.Group>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReducedMotion(mediaQuery.matches);
    syncPreference();
    mediaQuery.addEventListener("change", syncPreference);
    return () => mediaQuery.removeEventListener("change", syncPreference);
  }, []);

  useGSAP(
    () => {
      if (!stage.current || !group.current) return;

      gsap.set(group.current.position, { x: 0, y: 0, z: 0 });
      gsap.set(group.current.rotation, { x: 0.08, y: -0.12, z: -0.08 });

      const travel = gsap.timeline({ paused: true });
      travel
        .to(group.current.position, { x: 0.42, y: -0.22, z: 0.15, duration: 1, ease: "none" }, 0)
        .to(group.current.rotation, { x: -0.12, y: 0.26, z: 0.11, duration: 1, ease: "none" }, 0);

      ScrollTrigger.create({
        trigger: stage.current,
        animation: travel,
        start: "top top",
        end: () => `+=${Math.max(stage.current!.offsetHeight - window.innerHeight, 1)}`,
        scrub: reducedMotion ? true : 0.9,
        invalidateOnRefresh: true,
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());
    },
    { scope: stage, dependencies: [reducedMotion] },
  );

  return (
    <div ref={stage} className={styles.stage}>
      <div className={styles.canvasLayer} aria-hidden="true">
        <Canvas
          className={styles.canvas}
          camera={{ position: [0, 0, 7], fov: 32 }}
          dpr={[1, 1.35]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          fallback={<div className={styles.fallback} />}
        >
          <group ref={group}>
            <FabricMesh reducedMotion={reducedMotion} />
          </group>
        </Canvas>
      </div>

      <div className={styles.content}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>dev_norm / laboratório 03d</p>
          <h1>tecido</h1>
          <p className={styles.intro}>um volume carmesim entre o gesto e a gravidade.</p>
        </header>
        <section className={styles.section}>
          <span>01 / dobra ambiente</span>
          <p>o tecido respira mesmo quando o scroll descansa.</p>
        </section>
        <section className={styles.section}>
          <span>02 / trajetória</span>
          <p>posição e orientação avançam com a página e retornam ao subir.</p>
        </section>
        <section className={styles.section}>
          <span>03 / observação</span>
          <p>experimento aberto para captura e avaliação.</p>
        </section>
      </div>
    </div>
  );
}
