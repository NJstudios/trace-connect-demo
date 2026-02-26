
import { AlertTriangle, Boxes, CalendarClock, Download, ExternalLink, FileText, ShieldCheck } from "lucide-react";
import { Badge, Button, Card, Divider, StatTile } from "./ui";
import type { DemoProject } from "../lib/demoData";
import { formatShortDate, formatUSD } from "../lib/utils";
import ThreeScene from "./ThreeScene";
import type { TemplateId } from "../lib/demoData";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  RoundedBox,
  Html,
} from "@react-three/drei";

function RetailStore() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Sidewalk */}
      <mesh position={[0, 0.06, 6]} receiveShadow>
        <boxGeometry args={[14, 0.12, 5]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>

      {/* Asphalt strip */}
      <mesh position={[0, 0.02, 16]} receiveShadow>
        <boxGeometry args={[40, 0.04, 30]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>

      {/* Main building volume */}
      <RoundedBox
        args={[14, 6, 10]}
        radius={0.18}
        smoothness={6}
        position={[0, 3, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#0f172a" roughness={0.65} metalness={0.05} />
      </RoundedBox>

      {/* Facade panel (lighter front) */}
      <mesh position={[0, 3, 5.05]} receiveShadow>
        <boxGeometry args={[14, 6, 0.2]} />
        <meshStandardMaterial color="#111827" roughness={0.7} />
      </mesh>

      {/* Awning */}
      <mesh position={[0, 4.25, 5.7]} castShadow>
        <boxGeometry args={[10.5, 0.25, 1.8]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} />
      </mesh>
      <mesh position={[0, 3.65, 6.55]} castShadow>
        <boxGeometry args={[10.5, 1.0, 0.2]} />
        <meshStandardMaterial color="#0b1220" roughness={0.8} />
      </mesh>

      {/* Glass wall */}
      <mesh position={[0, 2.4, 5.18]} castShadow>
        <boxGeometry args={[11.2, 3.2, 0.06]} />
        <meshStandardMaterial
          color="#93c5fd"
          transparent
          opacity={0.22}
          roughness={0.05}
          metalness={0.15}
        />
      </mesh>

      {/* Door frame */}
      <mesh position={[0.2, 1.55, 5.22]} castShadow>
        <boxGeometry args={[1.7, 2.6, 0.12]} />
        <meshStandardMaterial color="#0b1220" roughness={0.8} />
      </mesh>
      {/* Door glass */}
      <mesh position={[0.2, 1.55, 5.28]} castShadow>
        <boxGeometry args={[1.3, 2.2, 0.03]} />
        <meshStandardMaterial color="#93c5fd" transparent opacity={0.18} roughness={0.05} />
      </mesh>

      {/* Window mullions */}
      {[-4.5, -2.2, 2.2, 4.5].map((x) => (
        <mesh key={x} position={[x, 2.4, 5.23]} castShadow>
          <boxGeometry args={[0.15, 3.2, 0.12]} />
          <meshStandardMaterial color="#0b1220" roughness={0.9} />
        </mesh>
      ))}

      {/* Interior floor (visible through glass) */}
      <mesh position={[0, 0.11, 2.2]} receiveShadow>
        <boxGeometry args={[12.5, 0.2, 7.5]} />
        <meshStandardMaterial color="#e5e7eb" roughness={0.9} />
      </mesh>

      {/* Interior shelves silhouettes */}
      {[-4.2, -1.5, 1.2, 4.0].map((x, i) => (
        <mesh key={i} position={[x, 1.0, 2.0]} castShadow>
          <boxGeometry args={[1.2, 2.0, 2.4]} />
          <meshStandardMaterial color="#111827" roughness={0.9} />
        </mesh>
      ))}

      {/* Sign box */}
      <mesh position={[0, 5.25, 5.35]} castShadow>
        <boxGeometry args={[7.5, 1.0, 0.25]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.7} />
      </mesh>
      <mesh position={[0, 5.25, 5.55]}>
        <Html center transform distanceFactor={10}>
          <div
            style={{
              fontFamily: "ui-sans-serif, system-ui",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#0f172a",
              fontSize: 18,
              padding: "4px 10px",
              borderRadius: 10,
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            TRACE CONNECT
          </div>
        </Html>
      </mesh>
    </group>
  );
}
function House() {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#f1f5f9" />
      </mesh>

      {/* Base */}
      <RoundedBox args={[9, 3.6, 7]} radius={0.15} smoothness={4} position={[0, 1.8, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#0f172a" roughness={0.65} />
      </RoundedBox>

      {/* Roof (simple gable) */}
      <mesh position={[0, 4.1, 0]} castShadow>
        <coneGeometry args={[6.2, 2.4, 4]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>

      {/* Front door */}
      <mesh position={[-1.4, 1.25, 3.52]} castShadow>
        <boxGeometry args={[1.2, 2.1, 0.12]} />
        <meshStandardMaterial color="#0b1220" roughness={0.75} />
      </mesh>

      {/* Windows */}
      <mesh position={[2.2, 2.0, 3.52]} castShadow>
        <boxGeometry args={[2.0, 1.4, 0.08]} />
        <meshStandardMaterial color="#93c5fd" transparent opacity={0.25} roughness={0.05} />
      </mesh>
      <mesh position={[2.2, 2.0, 3.60]} castShadow>
        <boxGeometry args={[2.1, 1.5, 0.02]} />
        <meshStandardMaterial color="#e2e8f0" transparent opacity={0.15} />
      </mesh>

      {/* Porch */}
      <mesh position={[0, 0.12, 3.9]} receiveShadow>
        <boxGeometry args={[7, 0.25, 2.5]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
    </group>
  );
}

export function ModelPanel({ templateId }: { templateId: TemplateId }) {
  const title = useMemo(() => {
    if (templateId === "retail") return "Retail storefront massing";
    if (templateId === "office") return "Office building massing";
    return "Residential / house massing";
  }, [templateId]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-slate-900">3D Model</div>
          <div className="mt-1 text-sm text-slate-600">{title}</div>
        </div>
        <Badge tone="info">Interactive</Badge>
      </div>

      <Divider className="my-5" />

      <div className="aspect-[16/10] rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <Canvas
          shadows
          camera={{ position: [14, 8, 14], fov: 40, near: 0.1, far: 250 }}
        >
          <OrbitControls
            makeDefault
            enablePan
            enableZoom
            enableRotate
            enableDamping
            dampingFactor={0.08}
            minDistance={7}
            maxDistance={26}
            maxPolarAngle={Math.PI / 2.05}
          />
          <ambientLight intensity={0.55} />
          <directionalLight
            intensity={1.15}
            position={[10, 14, 8]}
            castShadow
            shadow-mapSize={[2048, 2048]}
          />

          <Environment preset="city" />

          {/* Scene */}
          {templateId === "retail" ? <RetailStore /> : <House />}

          {/* Nice shadow under the model */}
          <ContactShadows
            position={[0, 0.02, 0]}
            opacity={0.25}
            scale={20}
            blur={2.8}
            far={20}
          />

          <OrbitControls
            makeDefault
            enablePan
            enableZoom
            enableRotate
            minDistance={6}
            maxDistance={22}
            maxPolarAngle={Math.PI / 2.15}
          />
        </Canvas>
      </div>

      <div className="mt-3 text-xs text-slate-500">
        Drag to rotate • Scroll to zoom • Right-drag to pan
      </div>
    </Card>
  );
}

export function SummaryPanel({ project }: { project: DemoProject }) {
  const duration = Math.max(...project.schedule.map((t) => t.startOffsetDays + t.durationDays));
  const materialsTotal = project.materials.reduce((s, m) => s + m.qty * m.unitCost, 0);

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <div className="text-sm font-extrabold text-slate-900">Outputs</div>
          <div className="mt-1 text-sm text-slate-600">
            {project.location} • Start {formatShortDate(project.startDateIso)}
          </div>
        </div>
        <Badge tone="ok">Generated</Badge>
      </div>

      <Divider className="my-5" />

      <div className="grid sm:grid-cols-2 gap-3">
        <StatTile label="Schedule duration" value={`${duration} days`} />
        <StatTile label="Materials estimate" value={formatUSD(materialsTotal)} />
        <StatTile label="Risk flags" value={project.risks.length} />
        <StatTile label="Blueprint" value={<span className="inline-flex items-center gap-2"><FileText className="h-4 w-4" /> {project.blueprintFilename}</span>} />
      </div>

      <Divider className="my-5" />

      <div className="grid sm:grid-cols-2 gap-2">
        <Button variant="secondary" onClick={() => alert("Demo: Export IFC")}>
          <Download className="h-4 w-4" /> Export IFC
        </Button>
        <Button variant="secondary" onClick={() => alert("Demo: Export RVT")}>
          <Download className="h-4 w-4" /> Export RVT
        </Button>
        <Button variant="secondary" onClick={() => alert("Demo: Send to Procore")}>
          <ExternalLink className="h-4 w-4" /> Send to Procore
        </Button>
        <Button variant="secondary" onClick={() => alert("Demo: Share link")}>
          <ExternalLink className="h-4 w-4" /> Share link
        </Button>
      </div>
    </Card>
  );
}

export function ScheduleTable({ project }: { project: DemoProject }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-slate-900">Schedule</div>
          <div className="mt-1 text-sm text-slate-600">Auto-generated WBS tasks with owners.</div>
        </div>
        <Badge tone="info"><CalendarClock className="h-3.5 w-3.5" /> WBS</Badge>
      </div>

      <Divider className="my-5" />

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-2 pr-4">Task</th>
              <th className="py-2 pr-4">Owner</th>
              <th className="py-2 pr-4">Start (day)</th>
              <th className="py-2 pr-4">Duration</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {project.schedule.map((t) => (
              <tr key={t.id} className="border-t border-slate-200">
                <td className="py-3 pr-4 font-semibold text-slate-900">{t.name}</td>
                <td className="py-3 pr-4">{t.owner}</td>
                <td className="py-3 pr-4">{t.startOffsetDays}</td>
                <td className="py-3 pr-4">{t.durationDays} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function MaterialsTable({ project }: { project: DemoProject }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-slate-900">Materials</div>
          <div className="mt-1 text-sm text-slate-600">Preliminary takeoff-style BOM.</div>
        </div>
        <Badge tone="info"><Boxes className="h-3.5 w-3.5" /> BOM</Badge>
      </div>

      <Divider className="my-5" />

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-2 pr-4">Item</th>
              <th className="py-2 pr-4">Qty</th>
              <th className="py-2 pr-4">Unit</th>
              <th className="py-2 pr-4">Unit cost</th>
              <th className="py-2 pr-4">Line total</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {project.materials.map((m) => (
              <tr key={m.id} className="border-t border-slate-200">
                <td className="py-3 pr-4 font-semibold text-slate-900">{m.name}</td>
                <td className="py-3 pr-4">{m.qty}</td>
                <td className="py-3 pr-4">{m.unit}</td>
                <td className="py-3 pr-4">{formatUSD(m.unitCost)}</td>
                <td className="py-3 pr-4">{formatUSD(m.qty * m.unitCost)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function RiskFlags({ project }: { project: DemoProject }) {
  const tone = (s: DemoProject["risks"][number]["severity"]): "warn" | "info" | "neutral" => {
    if (s === "High") return "warn";
    if (s === "Medium") return "info";
    return "neutral";
  };
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-slate-900">Risk flags</div>
          <div className="mt-1 text-sm text-slate-600">Planning gaps highlighted early.</div>
        </div>
        <Badge tone="warn"><AlertTriangle className="h-3.5 w-3.5" /> Risks</Badge>
      </div>

      <Divider className="my-5" />

      <div className="space-y-3">
        {project.risks.map((r) => (
          <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm font-extrabold text-slate-900">{r.title}</div>
              <Badge tone={tone(r.severity)}>{r.severity}</Badge>
            </div>
            <div className="mt-2 text-sm text-slate-600">{r.detail}</div>
            <div className="mt-3 flex items-start gap-2 text-sm text-slate-700">
              <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
              <div><span className="font-semibold text-slate-900">Suggestion:</span> {r.suggestion}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
