import { useGet, useMutate } from "@/lib/api";
import type { TAnnouncement, TAnnouncementFormValues } from "../_types";
import { ANNOUNCEMENTS_KEY } from "../_constant";

type ListArgs = {
  search?: string;
  page?: number;
  pageSize?: number;
  priority?: "general" | "critical";
};

export function useAnnouncements({ search, page = 1, pageSize = 10, priority }: ListArgs = {}) {
  return useGet<TAnnouncement[]>({
    isList: true,
    url: "/announcements",
    key: [ANNOUNCEMENTS_KEY, search ?? "", priority ?? "", String(page), String(pageSize)],
    params: {
      ...(search ? { search } : {}),
      ...(priority ? { priority } : {}),
      pageNumber: page,
      pageSize,
    },
  });
}

export function useAnnouncement(id: string) {
  return useGet<TAnnouncement>({
    url: `/announcements/${id}`,
    key: [ANNOUNCEMENTS_KEY, id],
    enabled: Boolean(id),
  });
}

export function useCreateAnnouncement() {
  return useMutate<TAnnouncementFormValues, TAnnouncement>({
    url: "/announcements",
    method: "post",
    invalidateKeys: [[ANNOUNCEMENTS_KEY]],
  });
}

export function useUpdateAnnouncement(id: string) {
  return useMutate<TAnnouncementFormValues, TAnnouncement>({
    url: `/announcements/${id}`,
    method: "patch",
    invalidateKeys: [[ANNOUNCEMENTS_KEY]],
  });
}

export function useDeleteAnnouncement(id: string) {
  return useMutate<void, void>({
    url: `/announcements/${id}`,
    method: "delete",
    invalidateKeys: [[ANNOUNCEMENTS_KEY]],
  });
}
