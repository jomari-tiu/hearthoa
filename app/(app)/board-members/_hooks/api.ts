import { useGet, useMutate } from "@/lib/api";
import type { TBoardMember, TBoardMemberFormValues } from "../_types";
import { BOARD_MEMBERS_KEY } from "../_constant";

export function useBoardMembers({ page = 1, pageSize = 50 }: { page?: number; pageSize?: number } = {}) {
  return useGet<TBoardMember[]>({
    isList: true,
    url: "/board-members",
    key: [BOARD_MEMBERS_KEY, String(page), String(pageSize)],
    params: { pageNumber: page, pageSize },
  });
}

export function useBoardMember(id: string) {
  return useGet<TBoardMember>({
    url: `/board-members/${id}`,
    key: [BOARD_MEMBERS_KEY, id],
    enabled: Boolean(id),
  });
}

export function useCreateBoardMember() {
  return useMutate<TBoardMemberFormValues, TBoardMember>({
    url: "/board-members",
    method: "post",
    invalidateKeys: [[BOARD_MEMBERS_KEY]],
  });
}

export function useUpdateBoardMember(id: string) {
  return useMutate<TBoardMemberFormValues, TBoardMember>({
    url: `/board-members/${id}`,
    method: "patch",
    invalidateKeys: [[BOARD_MEMBERS_KEY]],
  });
}

export function useDeleteBoardMember(id: string) {
  return useMutate<void, void>({
    url: `/board-members/${id}`,
    method: "delete",
    invalidateKeys: [[BOARD_MEMBERS_KEY]],
  });
}
