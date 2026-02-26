import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import type { TemplateId } from "../lib/demoData";

function Massing({ templateId }: { templateId: TemplateId }) {
  const parts = useMemo(() => {
    if (templateId === "retail") {
      return [
        { pos: [0, 0.5, 0], size: [3.2, 1, 2] },
        { pos: [1.4, 0.25, -0.8], size: [0.8, 0.5, 0.6] },
        { pos: [-1.2, 0.15, 0.9], size: [0.9, 0.3, 0.5] },
      ] as const;
    }
    if (templateId === "office") {
      return [
        { pos: [0, 0.6, 0], size: [2.4, 1.2, 2.2] },
        { pos: [-0.6, 1.25, 0], size: [1.0, 0.7, 1.0] },
        { pos: [0.9, 0.3, 0.9], size: [0.6, 0.6, 0.6] },
      ] as const;
    }
    return [
      { pos: [0, 0.5, 0], size: [4.2, 1, 2.4] },
      { pos: [-1.6, 0.25, 1.2], size: [1.0, 0.5, 0.8] },
      { pos: [1.8, 0.2, -1.1], size: [0.9, 0.4, 0.6] },
    ] as const;
  }, [templateId]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {parts.map((p, i) => (
        <mesh key={i} castShadow receiveShadow position={p.pos as any}>
          <boxGeometry args={p.size as any} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeScene({ templateId }: { templateId: TemplateId }) {
  return (
    <div className="h-full w-full">
      <Canvas shadows camera={{ position: [5.5, 3.8, 5.5], fov: 45, near: 0.1, far: 100 }}>
        <ambientLight intensity={0.8} />
        <directionalLight
          intensity={1.0}
          position={[7, 9, 5]}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <Grid
          position={[0, 0.001, 0]}
          args={[20, 20]}
          cellSize={1}
          cellThickness={1}
          sectionSize={5}
          sectionThickness={1}
          fadeDistance={25}
          fadeStrength={1}
        />

        <Massing templateId={templateId} />

        <OrbitControls enablePan enableZoom enableRotate makeDefault />
        <GizmoHelper alignment="bottom-right" margin={[12, 12]}>
          <GizmoViewport axisColors={["#ef4444", "#22c55e", "#3b82f6"]} labelColor="#0f172a" />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}
