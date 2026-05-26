import { loadJson } from "@/lib/data";
import { PageHeader, DataTable } from "@/components/ui/PageHeader";

export default function SystemInventoryPage() {
  const inv = loadJson<{
    systems: {
      id: string;
      name: string;
      role: string;
      status: string;
      classification: string;
      purpose: string;
      storageUsagePct?: number;
      syncState?: string;
      modelAssignments?: string[];
      deploymentStatus?: string;
    }[];
    models: { name: string; runtime: string; host: string; purpose: string }[];
  }>("system_inventory.json");

  return (
    <div>
      <PageHeader title="System Inventory" subtitle="ToMorrowAILabs.ai infrastructure stack — local + cloud" />

      <h2 className="mb-3 text-lg font-semibold">Hardware & Software</h2>
      <DataTable
        headers={["System", "Role", "Status", "Class", "Sync", "Deploy"]}
        rows={inv.systems.map((s) => [
          s.name,
          s.role.replace(/_/g, " "),
          <span className={s.status === "active" ? "badge-ready" : s.status === "parked" ? "badge-frontier" : "badge-scaffold"}>{s.status}</span>,
          s.classification,
          s.syncState ?? "—",
          s.deploymentStatus ?? "—",
        ])}
      />

      <h2 className="mb-3 mt-8 text-lg font-semibold">Model Inventory</h2>
      <DataTable
        headers={["Model", "Runtime", "Host", "Purpose"]}
        rows={inv.models.map((m) => [m.name, m.runtime, m.host, m.purpose])}
      />

      <p className="mt-6 text-xs text-gray-500">
        OpenClaw listed as parked — not integrated into Month 1 course OS. No production agent modifications.
      </p>
    </div>
  );
}
