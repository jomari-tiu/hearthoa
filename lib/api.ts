"use client";

import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

type ApiMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  hasNext: boolean;
};

const DEFAULT_META: ApiMeta = { page: 1, pageSize: 10, totalCount: 0, hasNext: false };

export type ApiResult<T> = { result: T; meta: ApiMeta };

export async function apiGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await api.get<T>(url, { params });
  return res.data;
}

type UseGetArgs = {
  url: string;
  key: QueryKey;
  params?: Record<string, unknown>;
  isList?: boolean;
  enabled?: boolean;
};

export function useGet<T>({ url, key, params, isList, enabled = true }: UseGetArgs) {
  return useQuery<ApiResult<T>>({
    queryKey: key,
    enabled,
    queryFn: async () => {
      const res = await api.get(url, { params });
      if (isList) {
        const payload = res.data as { data: T; meta?: Partial<ApiMeta> };
        return {
          result: payload.data,
          meta: { ...DEFAULT_META, ...(payload.meta ?? {}) },
        };
      }
      return { result: res.data as T, meta: DEFAULT_META };
    },
  });
}

type UseMutateArgs = {
  url: string;
  method: "post" | "patch" | "put" | "delete";
  invalidateKeys?: QueryKey[];
};

export function useMutate<TInput, TOutput>({ url, method, invalidateKeys = [] }: UseMutateArgs) {
  const qc = useQueryClient();
  return useMutation<TOutput, AxiosError, TInput>({
    mutationFn: async (input) => {
      const config: AxiosRequestConfig = { method, url, data: input };
      const res = await api.request<TOutput>(config);
      return res.data;
    },
    onSuccess: () => {
      for (const key of invalidateKeys) {
        qc.invalidateQueries({ queryKey: key });
      }
    },
  });
}

export function extractErrorMessages(error: unknown): string[] {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[]; errors?: Record<string, string[]> } | undefined;
    if (data?.errors) {
      return Object.values(data.errors).flat();
    }
    if (Array.isArray(data?.message)) return data.message;
    if (typeof data?.message === "string") return [data.message];
    return [error.message];
  }
  if (error instanceof Error) return [error.message];
  return ["Something went wrong."];
}
