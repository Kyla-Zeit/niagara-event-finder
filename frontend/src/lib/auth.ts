export type User = {
  id: number;
  name: string;
  email: string;
  ts?: number;
};

export const USER_KEY = "niagara:user";

export function getUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<User>;
    if (typeof parsed.id !== "number") return null;
    if (!parsed.name || !parsed.email) return null;
    return { id: parsed.id, name: String(parsed.name), email: String(parsed.email), ts: parsed.ts };
  } catch {
    return null;
  }
}
