import { useGet, useMutate } from "@/lib/api";
import type { TDocument, TDocumentFormValues, TDocumentCategory } from "../_types";
import { DOCUMENTS_KEY } from "../_constant";

type ListArgs = {
  search?: string;
  page?: number;
  pageSize?: number;
  category?: TDocumentCategory;
};

export function useDocuments({ search, page = 1, pageSize = 10, category }: ListArgs = {}) {
  return useGet<TDocument[]>({
    isList: true,
    url: "/documents",
    key: [DOCUMENTS_KEY, search ?? "", category ?? "", String(page), String(pageSize)],
    params: {
      ...(search ? { search } : {}),
      ...(category ? { category } : {}),
      pageNumber: page,
      pageSize,
    },
  });
}

export function useDocument(id: string) {
  return useGet<TDocument>({
    url: `/documents/${id}`,
    key: [DOCUMENTS_KEY, id],
    enabled: Boolean(id),
  });
}

export function useCreateDocument() {
  return useMutate<TDocumentFormValues, TDocument>({
    url: "/documents",
    method: "post",
    invalidateKeys: [[DOCUMENTS_KEY]],
  });
}

export function useUpdateDocument(id: string) {
  return useMutate<TDocumentFormValues, TDocument>({
    url: `/documents/${id}`,
    method: "patch",
    invalidateKeys: [[DOCUMENTS_KEY]],
  });
}

export function useDeleteDocument(id: string) {
  return useMutate<void, void>({
    url: `/documents/${id}`,
    method: "delete",
    invalidateKeys: [[DOCUMENTS_KEY]],
  });
}

export function useClearPiiReview(id: string) {
  return useMutate<void, TDocument>({
    url: `/documents/${id}/pii-review/clear`,
    method: "post",
    invalidateKeys: [[DOCUMENTS_KEY], [DOCUMENTS_KEY, id]],
  });
}
