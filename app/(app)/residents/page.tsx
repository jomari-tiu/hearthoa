"use client";

import { useQuery } from "@tanstack/react-query";
import { api, type ApiResult } from "@/lib/api";
import { PageWrapper, Card, CardBody, Skeleton } from "@/components/ds";
import { initials } from "@/lib/format";

type Resident = { id: string; name: string; unit: string | null };

function useResidents() {
  return useQuery<ApiResult<Resident[]> | null>({
    queryKey: ["residents"],
    queryFn: async () => {
      try {
        const res = await api.get<{ data: Resident[]; meta: { page: number; pageSize: number; totalCount: number; hasNext: boolean } }>(
          "/residents",
          { params: { pageSize: 200 } },
        );
        return { result: res.data.data, meta: res.data.meta };
      } catch {
        return null;
      }
    },
  });
}

export default function ResidentsPage() {
  const { data, isLoading } = useResidents();

  return (
    <PageWrapper
      title="Resident directory"
      subtitle="Names and units only. No phone or email. Per-resident opt-out respected."
      breadcrumbs={[{ label: "Dashboard", href: "/dashboard" }, { label: "Residents" }]}
    >
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}><CardBody><Skeleton className="h-16 w-full" /></CardBody></Card>
          ))}
        </div>
      ) : !data ? (
        <Card>
          <CardBody className="flex flex-col gap-2">
            <h2 className="text-base font-semibold text-foreground">Directory unavailable</h2>
            <p className="text-sm text-foreground-muted">
              The board hasn&apos;t enabled the resident directory, or it&apos;s limited to admins. Ask your board if you&apos;d like it turned on.
            </p>
          </CardBody>
        </Card>
      ) : data.result.length === 0 ? (
        <Card>
          <CardBody>
            <p className="text-sm text-foreground-muted">No residents to show. Either no one is opted in, or onboarding hasn&apos;t finished yet.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.result.map((r) => (
            <Card key={r.id}>
              <CardBody className="flex items-center gap-3">
                <div className="w-10 h-10 shrink-0 rounded-full bg-primary-soft text-primary-soft-fg inline-flex items-center justify-center font-bold">
                  {initials(r.name)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-foreground truncate">{r.name}</span>
                  {r.unit ? <span className="text-xs text-foreground-muted truncate">{r.unit}</span> : null}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </PageWrapper>
  );
}
