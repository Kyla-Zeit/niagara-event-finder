export async function listFavorites(userId: number): Promise<string[]> {
  const res = await fetch(`/api/favorites/${userId}`);
  if (!res.ok) throw new Error("FAVORITES_FETCH_FAILED");
  const data = (await res.json()) as string[];
  return (data ?? []).map(String);
}

export async function addFavorite(userId: number, eventId: string): Promise<void> {
  const res = await fetch(`/api/favorites/${userId}/${encodeURIComponent(eventId)}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("FAVORITE_ADD_FAILED");
}

export async function removeFavorite(userId: number, eventId: string): Promise<void> {
  const res = await fetch(`/api/favorites/${userId}/${encodeURIComponent(eventId)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("FAVORITE_REMOVE_FAILED");
}

export async function bulkAddFavorites(userId: number, eventIds: string[]): Promise<string[]> {
  const res = await fetch(`/api/favorites/${userId}/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventIds }),
  });
  if (!res.ok) throw new Error("FAVORITES_BULK_FAILED");
  const data = (await res.json()) as string[];
  return (data ?? []).map(String);
}
