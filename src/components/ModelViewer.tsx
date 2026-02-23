import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid, Environment, ContactShadows } from "@react-three/drei";
import type { ModelParams } from "../types";
import { Card, Badge, Button } from "./ui";
import { Eye, Layers, Sparkles } from "lucide-react";

function Roof({ p }: { p: ModelParams }) {
  if (p.roof === "flat") {
    return (
      <mesh position={[0, p.heightM + 0.05, 0]} receiveShadow>
        <boxGeometry args={[p.widthM, 0.35, p.depthM]} />
        <meshStandardMaterial color="#111827" metalness={0.12} roughness={0.9} />
      </mesh>
    );
  }

  // gable roof: simple two planes
  const h = 2.0;
  return (
    <group position={[0, p.heightM, 0]}>
      <mesh rotation={[0, 0, Math.PI / 6]} position={[0, h * 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[p.widthM * 0.56, 0.35, p.depthM]} />
        <meshStandardMaterial color="#111827" metalness={0.1} roughness={0.95} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 6]} position={[0, h * 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[p.widthM * 0.56, 0.35, p.depthM]} />
        <meshStandardMaterial color="#111827" metalness={0.1} roughness={0.95} />
      </mesh>
    </group>
  );
}

function ParkingLot({ width }: { width: number }) {
  // Simple asphalt + stripes (cheap but reads as "real")
  const lotW = width + 26;
  const lotD = 38;
  const stripes = Array.from({ length: 10 }, (_, i) => i);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 10]} receiveShadow>
        <planeGeometry args={[lotW, lotD]} />
        <meshStandardMaterial color="#0b1220" roughness={0.95} metalness={0.05} />
      </mesh>

      {stripes.map((i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-lotW / 2 + 4 + i * 3.0, 0.01, 14]}
          receiveShadow
        >
          <planeGeometry args={[0.08, 16]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.6} />
        </mesh>
      ))}

      {/* sidewalk */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, pzFromBuildingFront(0)]} receiveShadow>
        <planeGeometry args={[lotW, 5]} />
        <meshStandardMaterial color="#111827" roughness={0.9} />
      </mesh>
    </group>
  );
}

function pzFromBuildingFront(z: number) {
  return -12 + z;
}

function Building({ p, mode }: { p: ModelParams; mode: "shell" | "frame" | "floorplan" }) {
  const floors = p.floors;
  const floorHeight = p.heightM / floors;

  // enterprise-ish materials (not neon)
  const shellColor = "#d1d5db";
  const frameColor = "#94a3b8";
  const wallOpacity = mode === "shell" ? 0.92 : 0.18;
  const wallColor = mode === "shell" ? shellColor : frameColor;

  const frontZ = p.depthM / 2;

  return (
    <group>
      {/* site */}
      <ParkingLot width={p.widthM} />

      {/* slabs */}
      {Array.from({ length: floors }).map((_, i) => (
        <mesh key={i} position={[0, i * floorHeight + 0.12, 0]} receiveShadow>
          <boxGeometry args={[p.widthM, 0.25, p.depthM]} />
          <meshStandardMaterial color="#0f172a" metalness={0.08} roughness={0.95} />
        </mesh>
      ))}

      {/* exterior walls */}
      <mesh position={[0, p.heightM / 2 + 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[p.widthM, p.heightM, p.depthM]} />
        <meshStandardMaterial transparent opacity={wallOpacity} color={wallColor} metalness={0.08} roughness={0.85} />
      </mesh>

      {/* storefront glass */}
      <mesh position={[0, 3.0, frontZ + 0.08]} castShadow>
        <boxGeometry args={[p.widthM * 0.62, 4.2, 0.12]} />
        {/* Physical material reads as glass under Environment */}
        {/* @ts-ignore */}
        <meshPhysicalMaterial
          color="#93c5fd"
          transmission={0.85}
          roughness={0.06}
          thickness={0.6}
          ior={1.35}
        />
      </mesh>

      {/* entry canopy for retail */}
      {p.hasCanopy && (
        <group position={[0, 3.8, frontZ + 1.6]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[p.widthM * 0.62, 0.18, 3.4]} />
            <meshStandardMaterial color="#111827" roughness={0.8} />
          </mesh>

          {[-1, 1].map((sx) => (
            <mesh key={sx} position={[sx * (p.widthM * 0.28), -1.2, 1.3]} castShadow>
              <boxGeometry args={[0.14, 2.4, 0.14]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.25} roughness={0.55} />
            </mesh>
          ))}
        </group>
      )}

      {/* signage */}
      <mesh position={[0, 6.6, frontZ + 0.16]} castShadow>
        <boxGeometry args={[p.widthM * 0.38, 0.9, 0.1]} />
        <meshStandardMaterial color="#0b1220" roughness={0.6} />
      </mesh>

      {/* structural frame (simple columns) */}
      {mode !== "shell" && (
        <group>
          {[-1, 1].flatMap((sx) =>
            [-1, 1].map((sz) => {
              const x = (p.widthM / 2 - 1) * sx;
              const z = (p.depthM / 2 - 1) * sz;
              return (
                <mesh key={`${sx}_${sz}`} position={[x, p.heightM / 2 + 0.12, z]} castShadow>
                  <boxGeometry args={[0.38, p.heightM, 0.38]} />
                  <meshStandardMaterial color="#94a3b8" metalness={0.35} roughness={0.45} />
                </mesh>
              );
            })
          )}
        </group>
      )}

      {/* rooftop units */}
      <mesh position={[-p.widthM * 0.18, p.heightM + 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 1.0, 2.0]} />
        <meshStandardMaterial color="#64748b" metalness={0.2} roughness={0.6} />
      </mesh>
      <mesh position={[p.widthM * 0.18, p.heightM + 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.1, 1.0, 2.0]} />
        <meshStandardMaterial color="#64748b" metalness={0.2} roughness={0.6} />
      </mesh>

      <Roof p={p} />

      {/* floorplan overlay */}
      {mode === "floorplan" && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.45, 0]} receiveShadow>
          <planeGeometry args={[p.widthM, p.depthM]} />
          <meshStandardMaterial color="#22c55e" transparent opacity={0.18} />
        </mesh>
      )}
    </group>
  );
}

export default function ModelViewer({ params }: { params: ModelParams }) {
  const [mode, setMode] = useState<"shell" | "frame" | "floorplan">("shell");

  const label = useMemo(() => {
    if (mode === "shell") return "Rendered";
    if (mode === "frame") return "Structure";
    return "Floorplan";
  }, [mode]);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">3D Model Preview</div>
          <div className="text-xs text-slate-400 mt-1">
            Render-style concept model to communicate scope and surface conflicts early.
          </div>
        </div>
        <Badge tone="info"><Eye className="h-3.5 w-3.5" /> {label}</Badge>
      </div>

      <div className="mt-4 h-[360px] w-full overflow-hidden rounded-xl border border-slate-800/60 bg-slate-950">
        <Canvas shadows>
          <color attach="background" args={["#070b14"]} />
          <ambientLight intensity={0.35} />
          <directionalLight
            position={[14, 18, 10]}
            intensity={1.25}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <PerspectiveCamera makeDefault position={[34, 18, 34]} />

          <Environment preset="city" />

          <Grid
            args={[140, 140]}
            cellSize={4}
            sectionSize={20}
            fadeDistance={140}
            infiniteGrid
          />

          <Building p={params} mode={mode} />

          <ContactShadows position={[0, 0.02, 0]} opacity={0.45} scale={120} blur={2.6} />
          <OrbitControls enableDamping dampingFactor={0.08} />
        </Canvas>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant={mode === "shell" ? "primary" : "subtle"} onClick={() => setMode("shell")}>
          <Sparkles className="h-4 w-4" /> Rendered
        </Button>
        <Button variant={mode === "frame" ? "primary" : "subtle"} onClick={() => setMode("frame")}>
          <Layers className="h-4 w-4" /> Structure
        </Button>
        <Button variant={mode === "floorplan" ? "primary" : "subtle"} onClick={() => setMode("floorplan")}>
          <Layers className="h-4 w-4" /> Floorplan
        </Button>

        <div className="ml-auto text-xs text-slate-400">
          Drag to orbit • scroll to zoom
        </div>
      </div>
    </Card>
  );
}
