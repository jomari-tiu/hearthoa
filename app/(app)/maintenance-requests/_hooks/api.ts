import { useGet, useMutate } from "@/lib/api";
import type {
  TMaintenanceRequest,
  TMaintenanceFormValues,
  TMaintenanceStatus,
  TMaintenanceCategory,
} from "../_types";
import { MAINTENANCE_REQUESTS_KEY } from "../_constant";

type ListArgs = {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: TMaintenanceStatus;
  category?: TMaintenanceCategory;
};

export function useMaintenanceRequests({ search, page = 1, pageSize = 10, status, category }: ListArgs = {}) {
  return useGet<TMaintenanceRequest[]>({
    isList: true,
    url: "/maintenance-requests",
    key: [MAINTENANCE_REQUESTS_KEY, search ?? "", status ?? "", category ?? "", String(page), String(pageSize)],
    params: {
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
      ...(category ? { category } : {}),
      pageNumber: page,
      pageSize,
    },
  });
}

export function useMaintenanceRequest(id: string) {
  return useGet<TMaintenanceRequest>({
    url: `/maintenance-requests/${id}`,
    key: [MAINTENANCE_REQUESTS_KEY, id],
    enabled: Boolean(id),
  });
}

export function useCreateMaintenanceRequest() {
  return useMutate<TMaintenanceFormValues, TMaintenanceRequest>({
    url: "/maintenance-requests",
    method: "post",
    invalidateKeys: [[MAINTENANCE_REQUESTS_KEY]],
  });
}

export function useUpdateMaintenanceRequest(id: string) {
  return useMutate<Partial<TMaintenanceFormValues> & { status?: TMaintenanceStatus; adminNotes?: string; assignedTo?: string }, TMaintenanceRequest>({
    url: `/maintenance-requests/${id}`,
    method: "patch",
    invalidateKeys: [[MAINTENANCE_REQUESTS_KEY]],
  });
}

export function useDeleteMaintenanceRequest(id: string) {
  return useMutate<void, void>({
    url: `/maintenance-requests/${id}`,
    method: "delete",
    invalidateKeys: [[MAINTENANCE_REQUESTS_KEY]],
  });
}
