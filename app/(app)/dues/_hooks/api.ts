import { useGet, useMutate, apiGet } from "@/lib/api";
import type { AsyncSearchResult } from "@/components/ds";
import type { TDue, TDuesFormValues, TDuesStatus } from "../_types";
import { DUES_KEY } from "../_constant";

type ListArgs = {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: TDuesStatus;
  unitId?: string;
  period?: string;
};

export function useDuesList({ search, page = 1, pageSize = 10, status, unitId, period }: ListArgs = {}) {
  return useGet<TDue[]>({
    isList: true,
    url: "/dues",
    key: [DUES_KEY, search ?? "", status ?? "", unitId ?? "", period ?? "", String(page), String(pageSize)],
    params: {
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
      ...(unitId ? { unitId } : {}),
      ...(period ? { period } : {}),
      pageNumber: page,
      pageSize,
    },
  });
}

export function useDue(id: string) {
  return useGet<TDue>({
    url: `/dues/${id}`,
    key: [DUES_KEY, id],
    enabled: Boolean(id),
  });
}

export function useCreateDue() {
  return useMutate<TDuesFormValues, TDue>({
    url: "/dues",
    method: "post",
    invalidateKeys: [[DUES_KEY]],
  });
}

export function useUpdateDue(id: string) {
  return useMutate<TDuesFormValues, TDue>({
    url: `/dues/${id}`,
    method: "patch",
    invalidateKeys: [[DUES_KEY]],
  });
}

export function useDeleteDue(id: string) {
  return useMutate<void, void>({
    url: `/dues/${id}`,
    method: "delete",
    invalidateKeys: [[DUES_KEY]],
  });
}

type UnitOption = { id: string; address: string; unitNumber: string | null };

export async function searchUnits(query: string, page: number): Promise<AsyncSearchResult> {
  const res = await apiGet<{ data: UnitOption[]; meta?: { hasNext?: boolean } }>(
    "/units",
    { pageNumber: page, pageSize: 20, ...(query ? { search: query } : {}) },
  );
  return {
    items: res.data.map((u) => ({
      label: u.unitNumber ? `${u.address} #${u.unitNumber}` : u.address,
      value: u.id,
    })),
    hasMore: res.meta?.hasNext ?? false,
  };
}
