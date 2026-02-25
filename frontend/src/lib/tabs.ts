export type AppTab = "home" | "tickets" | "map" | "favorites" | "profile";

export const TAB_TO_PATH: Record<AppTab, string> = {
  home: "/",
  tickets: "/tickets",
  map: "/map",
  favorites: "/favorites",
  profile: "/profile",
};

export function pathToTab(pathname: string): AppTab {
  if (pathname.startsWith("/tickets")) return "tickets";
  if (pathname.startsWith("/map")) return "map";
  if (pathname.startsWith("/favorites")) return "favorites";
  if (pathname.startsWith("/profile")) return "profile";
  return "home";
}
