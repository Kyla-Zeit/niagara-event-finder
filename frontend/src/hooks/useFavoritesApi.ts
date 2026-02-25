import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, listFavorites, removeFavorite } from "@/lib/favoritesApi";

export function useFavoritesApi(userId: number | null) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["favorites", userId],
    enabled: !!userId,
    queryFn: () => listFavorites(userId as number),
    staleTime: 10_000,
  });

  const favoritesSet = useMemo(() => new Set((query.data ?? []).map(String)), [query.data]);

  const toggle = useMutation({
    mutationFn: async (eventId: string) => {
      if (!userId) throw new Error("NOT_SIGNED_IN");
      const id = String(eventId);
      if (favoritesSet.has(id)) {
        await removeFavorite(userId, id);
        return { id, saved: false } as const;
      }
      await addFavorite(userId, id);
      return { id, saved: true } as const;
    },
    onMutate: async (eventId: string) => {
      if (!userId) return;
      const key = ["favorites", userId] as const;
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<string[]>(key) ?? [];
      const id = String(eventId);
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      qc.setQueryData(key, next);
      return { prev };
    },
    onError: (_err, _eventId, ctx) => {
      if (!userId) return;
      const key = ["favorites", userId] as const;
      if (ctx?.prev) qc.setQueryData(key, ctx.prev);
    },
    onSettled: async () => {
      if (!userId) return;
      await qc.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  return {
    favorites: query.data ?? [],
    favoritesSet,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
    toggleFavorite: (eventId: string) => toggle.mutate(eventId),
    toggling: toggle.isPending,
  };
}
