import { useGet, useMutate } from "@/lib/api";
import type { TUser, TUserCreateValues, TUserEditValues, TUserRole, TUserStatus } from "../_types";
import { USERS_KEY } from "../_constant";

type ListArgs = {
  search?: string;
  page?: number;
  pageSize?: number;
  status?: TUserStatus;
  role?: TUserRole;
};

export function useUsers({ search, page = 1, pageSize = 10, status, role }: ListArgs = {}) {
  return useGet<TUser[]>({
    isList: true,
    url: "/users",
    key: [USERS_KEY, search ?? "", status ?? "", role ?? "", String(page), String(pageSize)],
    params: {
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
      ...(role ? { role } : {}),
      pageNumber: page,
      pageSize,
    },
  });
}

export function useUser(id: string) {
  return useGet<TUser>({
    url: `/users/${id}`,
    key: [USERS_KEY, id],
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  return useMutate<TUserCreateValues, TUser>({
    url: "/users",
    method: "post",
    invalidateKeys: [[USERS_KEY]],
  });
}

export function useUpdateUser(id: string) {
  return useMutate<TUserEditValues, TUser>({
    url: `/users/${id}`,
    method: "patch",
    invalidateKeys: [[USERS_KEY]],
  });
}

export function useDeleteUser(id: string) {
  return useMutate<void, void>({
    url: `/users/${id}`,
    method: "delete",
    invalidateKeys: [[USERS_KEY]],
  });
}
