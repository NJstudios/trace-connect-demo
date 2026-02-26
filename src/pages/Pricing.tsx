import React from "react";
import { Check } from "lucide-react";
import { Badge, Button, Card } from "../components/ui";

function Tier(props: {
  title: string;
  price: string;
  subtitle: string;
  bullets: string[];
  highlight?: boolean;
}) {
  return (
    <Card className={props.highlight ? "p-6 border-blue-200 shadow-soft" : "p-6"}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-extrabold text-slate-900">{props.title}</div>
          <div className="mt-1 text-sm text-slate-600">{props.subtitle}</div>
        </div>
        <div className="text-right">
          {props.highlight && <Badge tone="info" className="mb-2">Most popular</Badge>}
          <div className="text-sm font-extrabold text-slate-900">{props.price}</div>
          <div className="text-xs text-slate-500">per month</div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        {props.bullets.map((b) => (
          <div key={b} className="flex gap-2 text-sm text-slate-700">
            <Check className="h-4 w-4 text-emerald-600 mt-0.5" />
            <span>{b}</span>
          </div>
        ))}
      </div>

      <Button className="mt-6 w-full" variant={props.highlight ? "default" : "secondary"} onClick={() => alert("Demo: pricing CTA")}>
        Request a pilot
      </Button>
    </Card>
  );
}

export default function Pricing() {
  return (
    <div className="space-y-8">
      <div>
        <Badge tone="neutral">Subscription (recurring revenue)</Badge>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900">Pricing tiers</h2>
        <p className="mt-2 text-slate-600 max-w-2xl">
          Simple, scalable pricing based on project volume and integrations. (Values shown are demo placeholders.)
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Tier
          title="Basic"
          price="$499"
          subtitle="Small contractors • up to 3 projects"
          bullets={[
            "Standard export (PDF/CSV)",
            "Scope checklist + risk flags",
            "Blueprint extraction (assisted)",
            "Email support",
          ]}
        />
        <Tier
          title="Professional"
          price="$1,499"
          subtitle="Teams • up to 15 projects"
          highlight
          bullets={[
            "Integrations support",
            "Revision tracking",
            "Planning checklists",
            "Priority support",
          ]}
        />
        <Tier
          title="Commercial"
          price="$4,999"
          subtitle="High-volume firms • up to 50 projects"
          bullets={[
            "Advanced roles + audit logs",
            "Reporting + dashboards",
            "API access + integrations",
            "Dedicated onboarding",
          ]}
        />
      </div>

      <div className="text-xs text-slate-500">
        Pricing shown for demonstration.
      </div>
    </div>
  );
}
