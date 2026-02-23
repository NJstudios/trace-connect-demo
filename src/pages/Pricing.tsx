import React from "react";
import { Card, Button, Badge } from "../components/ui";
import { Check } from "lucide-react";

function Tier({ title, price, subtitle, bullets, tone }: { title: string; price: string; subtitle: string; bullets: string[]; tone: "info"|"warn"|"danger" }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="text-lg font-extrabold">{title}</div>
        <Badge tone={tone}>{price}</Badge>
      </div>
      <div className="mt-2 text-sm text-slate-300">{subtitle}</div>
      <div className="mt-4 space-y-2">
        {bullets.map(b => (
          <div key={b} className="flex gap-2 text-sm text-slate-200">
            <Check className="h-4 w-4 text-emerald-300 mt-0.5" />
            <span>{b}</span>
          </div>
        ))}
      </div>
      <Button className="mt-5 w-full" variant="subtle" onClick={() => alert("Demo: pricing CTA")}>
        Request a pilot
      </Button>
    </Card>
  );
}

export default function Pricing() {
  return (
    <div className="space-y-8">
      <div>
        <Badge tone="info">Subscription based (recurring revenue)</Badge>
        <h2 className="mt-3 text-3xl font-extrabold">Pricing tiers (as shown in the pitch deck)</h2>
        <p className="mt-2 text-slate-300 max-w-2xl">
          The demo mirrors the three subscription tiers and feature bundles described in your DECA materials.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Tier
          title="Basic"
          price="$499 / mo"
          subtitle="For small contractors • up to 3 projects"
          tone="info"
          bullets={[
            "Standard export (PDF/CSV)",
            "Scope checklist + risk flags",
            "AI blueprint extraction",
            "Email support",
          ]}
        />
        <Tier
          title="Professional"
          price="$1,499 / mo"
          subtitle="For professional teams • up to 15 projects"
          tone="warn"
          bullets={[
            "Integration support",
            "Revision tracking",
            "Planning checklists",
            "Priority support",
          ]}
        />
        <Tier
          title="Commercial"
          price="$4,999 / mo"
          subtitle="For high-volume firms • up to 50 projects"
          tone="danger"
          bullets={[
            "Advanced roles",
            "Audit logs + reporting",
            "API access + integrations",
            "Dedicated onboarding",
          ]}
        />
      </div>
    </div>
  );
}
