import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import type { ModelParams } from "../types";
import { Card, Badge, Button } from "./ui";
import { Eye, Layers } from "lucide-react";

function Roof({ p }: { p: ModelParams }) {
  if (p.roof === "flat") {
    return (
      <mesh position={[0, p.heightM, 0]}>
        <boxGeometry args={[p.widthM, 0.4, p.depthM]} />
        <meshStandardMaterial color="#0b1220" metalness={0.2} roughness={0.8} />
      </mesh>
    );
  }
  // gable roof: two slanted planes
  const h = 2.0;
  return (
    <group position={[0, p.heightM, 0]}>
      <mesh rotation={[0, 0, Math.PI / 6]} position={[0, h * 0.3, 0]}>
        <boxGeometry args={[p.widthM * 0.56, 0.4, p.depthM]} />
        <meshStandardMaterial color="#0b1220" metalness={0.15} roughness={0.85} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 6]} position={[0, h * 0.3, 0]}>
        <boxGeometry args={[p.widthM * 0.56, 0.4, p.depthM]} />
        <meshStandardMaterial color="#0b1220" metalness={0.15} roughness={0.85} />
      </mesh>
    </group>
  );
}

function Building({ p, mode }: { p: ModelParams; mode: "shell" | "frame" | "floorplan" }) {
  const wallColor = mode === "shell" ? "#0ea5e9" : "#94a3b8";
  const wallOpacity = mode === "shell" ? 0.22 : 0.12;

  const floors = p.floors;
  const floorHeight = p.heightM / floors;

  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[p.widthM + 4, 0.5, p.depthM + 4]} />
        <meshStandardMaterial color="#0b1220" roughness={1} />
      </mesh>

      {/* slabs */}
      {Array.from({ length: floors }).map((_, i) => (
        <mesh key={i} position={[0, i * floorHeight, 0]}>
          <boxGeometry args={[p.widthM, 0.3, p.depthM]} />
          <meshStandardMaterial color="#0f172a" metalness={0.1} roughness={0.95} />
        </mesh>
      ))}

      {/* exterior walls */}
      <mesh position={[0, p.heightM / 2, 0]}>
        <boxGeometry args={[p.widthM, p.heightM, p.depthM]} />
        <meshStandardMaterial transparent opacity={wallOpacity} color={wallColor} metalness={0.1} roughness={0.7} />
      </mesh>

      {/* structural frame (simple columns) */}
      {mode !== "shell" && (
        <group>
          {[-1, 1].flatMap((sx) => [-1, 1].map((sz) => {
            const x = (p.widthM / 2 - 1) * sx;
            const z = (p.depthM / 2 - 1) * sz;
            return (
              <mesh key={`${sx}_${sz}`} position={[x, p.heightM / 2, z]}>
                <boxGeometry args={[0.4, p.heightM, 0.4]} />
                <meshStandardMaterial color="#94a3b8" metalness={0.35} roughness={0.45} />
              </mesh>
            );
          }))}
        </group>
      )}

      {/* canopy for retail */}
      {p.hasCanopy && (
        <group position={[0, 2.5, p.depthM / 2 + 1.5]}>
          <mesh>
            <boxGeometry args={[p.widthM * 0.55, 0.25, 3.0]} />
            <meshStandardMaterial color="#0ea5e9" metalness={0.1} roughness={0.6} />
          </mesh>
        </group>
      )}

      <Roof p={p} />

      {/* floorplan overlay */}
      {mode === "floorplan" && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.31, 0]}>
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
    if (mode === "shell") return "Shell";
    if (mode === "frame") return "Structure";
    return "Floorplan";
  }, [mode]);

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">3D Model (demo)</div>
          <div className="text-xs text-slate-400 mt-1">
            A generated BIM-style massing model to communicate scope quickly.
          </div>
        </div>
        <Badge tone="info"><Eye className="h-3.5 w-3.5" /> {label}</Badge>
      </div>

      <div className="mt-4 h-[340px] w-full overflow-hidden rounded-xl border border-slate-800/60 bg-slate-950">
        <Canvas>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 18, 12]} intensity={1.3} />
          <PerspectiveCamera makeDefault position={[35, 24, 35]} />
          <Grid
            args={[120, 120]}
            cellSize={4}
            sectionSize={20}
            fadeDistance={120}
            infiniteGrid
          />
          <Building p={params} mode={mode} />
          <OrbitControls enableDamping dampingFactor={0.08} />
        </Canvas>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant={mode === "shell" ? "primary" : "subtle"} onClick={() => setMode("shell")}>
          <Layers className="h-4 w-4" /> Shell
        </Button>
        <Button variant={mode === "frame" ? "primary" : "subtle"} onClick={() => setMode("frame")}>
          <Layers className="h-4 w-4" /> Structure
        </Button>
        <Button variant={mode === "floorplan" ? "primary" : "subtle"} onClick={() => setMode("floorplan")}>
          <Layers className="h-4 w-4" /> Floorplan
        </Button>

        <div className="ml-auto text-xs text-slate-400">
          Tip: drag to orbit • scroll to zoom
        </div>
      </div>
    </Card>
  );
}
