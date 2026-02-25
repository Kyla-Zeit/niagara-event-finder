import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Mail, Lock, User as UserIcon, LogOut } from "lucide-react";

import BottomNav from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { events } from "@/data/events";
import { bulkAddFavorites } from "@/lib/favoritesApi";
import { useQueryClient } from "@tanstack/react-query";

/**
 * FAVORITE "GATE" STORAGE KEYS (must match your heart-click code)
 */
const TEMP_FAV_KEY = "niagara:tempFavorites";
const PENDING_KEY = "niagara:pendingFavorite"; // JSON: { eventId, prevSaved, ts }
const CONFIRMED_KEY = "niagara:favoriteConfirmedEventId"; // string eventId

/**
 * MOCK "AUTH" STORAGE KEY
 */
const USER_KEY = "niagara:user"; // JSON: { name, email, ts }

type User = {
  id: number;
  name: string;
  email: string;
};

function readTempFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(TEMP_FAV_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(arr.map(String));
  } catch {
    return new Set();
  }
}

function writeTempFavorites(set: Set<string>) {
  localStorage.setItem(TEMP_FAV_KEY, JSON.stringify(Array.from(set)));
}

function setTempFavorite(id: string, value: boolean) {
  const favs = readTempFavorites();
  if (value) favs.add(id);
  else favs.delete(id);
  writeTempFavorites(favs);
}

type PendingFavorite = { eventId: string; prevSaved: boolean; ts?: number };

const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type SignInValues = z.infer<typeof signInSchema>;
type SignUpValues = z.infer<typeof signUpSchema>;

export default function Profile() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const qc = useQueryClient();

  const intent = params.get("intent"); // "favorite" when coming from heart
  const eventIdParam = params.get("eventId");
  const fromParam = params.get("from");

  const [user, setUser] = useState<User | null>(null);

  // Used to revert the heart if they leave Profile without completing sign-in/up
  const pendingRef = useRef<PendingFavorite | null>(null);

  const from = useMemo(() => {
    if (!fromParam) return null;
    try {
      const decoded = decodeURIComponent(fromParam);
      return decoded.startsWith("/") ? decoded : null;
    } catch {
      return null;
    }
  }, [fromParam]);

  const pendingEvent = useMemo(() => {
    const id = pendingRef.current?.eventId ?? (eventIdParam ? String(eventIdParam) : null);
    if (!id) return null;
    return events.find((e) => String(e.id) === id) ?? null;
  }, [eventIdParam]);

  // Load mock user from storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<User>;
        if (parsed?.id && parsed?.name && parsed?.email) {
          setUser({ id: parsed.id, name: parsed.name, email: parsed.email });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Capture pending favorite on mount; revert on unmount if not confirmed
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PENDING_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PendingFavorite;
        if (parsed?.eventId) pendingRef.current = { eventId: String(parsed.eventId), prevSaved: !!parsed.prevSaved, ts: parsed.ts };
      }
    } catch {
      // ignore
    }

    // Fallback: if URL has eventId but pending key is missing
    if (!pendingRef.current && eventIdParam) {
      pendingRef.current = { eventId: String(eventIdParam), prevSaved: false };
    }

    return () => {
      const pending = pendingRef.current;
      if (!pending) return;

      const confirmedEventId = localStorage.getItem(CONFIRMED_KEY);
      const legacyConfirmed = localStorage.getItem("niagara:favoriteConfirmed") === "1"; // backward compatible

      const isConfirmed = legacyConfirmed || confirmedEventId === pending.eventId;

      // If they didn't complete auth, revert the heart back to its previous state
      if (!isConfirmed) {
        setTempFavorite(pending.eventId, pending.prevSaved);
      }

      // Cleanup
      localStorage.removeItem(PENDING_KEY);
      localStorage.removeItem(CONFIRMED_KEY);
      localStorage.removeItem("niagara:favoriteConfirmed");
      pendingRef.current = null;
    };
  }, [eventIdParam]);

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
    mode: "onSubmit",
  });

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  const migrateTempFavoritesIfAny = async (userId: number) => {
    const favs = readTempFavorites();
    if (favs.size === 0) return;
    try {
      await bulkAddFavorites(userId, Array.from(favs));
      localStorage.removeItem(TEMP_FAV_KEY);
      // Refresh favorites cache (if already mounted elsewhere)
      await qc.invalidateQueries({ queryKey: ["favorites", userId] });
    } catch {
      // If migration fails, don't delete local favorites
    }
  };

  const confirmAndReturnIfNeeded = (u: User) => {
    // Store user (and a timestamp, just for debugging)
    const userObj = { ...u, ts: Date.now() };
    localStorage.setItem(USER_KEY, JSON.stringify(userObj));
    setUser({ id: u.id, name: u.name, email: u.email });

    // If we came from a heart click, confirm the save and bounce back
    if (intent === "favorite" && pendingRef.current?.eventId) {
      localStorage.setItem(CONFIRMED_KEY, pendingRef.current.eventId);

      toast.success("Saved", {
        description: pendingEvent ? `Saved “${pendingEvent.title}” to your favorites.` : "Saved to your favorites.",
      });

      if (from) navigate(from);
      else navigate("/");
      return;
    }
  };

  const readApiError = async (res: Response) => {
    try {
      const data = await res.json();
      return (data && (data.error || data.message)) as string;
    } catch {
      return "";
    }
  };

  const onSignIn = async (values: SignInValues) => {
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: values.email, password: values.password }),
      });

      if (!res.ok) {
        const msg = (await readApiError(res)) || "Invalid credentials.";
        toast.error("Sign in failed", { description: msg });
        return;
      }

      const u = (await res.json()) as User;
      toast.success("Signed in");
      await migrateTempFavoritesIfAny(u.id);
      confirmAndReturnIfNeeded(u);
      signInForm.reset({ email: "", password: "" });
    } catch {
      toast.error("Sign in failed", { description: "Backend not reachable (expected on 8081)." });
    }
  };

  const onSignUp = async (values: SignUpValues) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, email: values.email, password: values.password }),
      });

      if (!res.ok) {
        const msg = (await readApiError(res)) || "Could not create account.";
        toast.error("Sign up failed", { description: msg });
        return;
      }

      const u = (await res.json()) as User;
      toast.success("Account created");
      await migrateTempFavoritesIfAny(u.id);
      confirmAndReturnIfNeeded(u);
      signUpForm.reset({ name: "", email: "", password: "", confirmPassword: "" });
    } catch {
      toast.error("Sign up failed", { description: "Backend not reachable (expected on 8081)." });
    }
  };

  const signOut = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
    toast.message("Signed out");
  };

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <div className="px-5 pt-12 pb-28 space-y-3">
        {/* Context banner when user came from the heart */}
        {intent === "favorite" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4"
          >
            <div className="text-sm font-semibold">Sign in to save events</div>
            <div className="text-xs text-muted-foreground mt-1">
              {pendingEvent ? (
                <>
                  You’re saving: <span className="text-primary font-medium">{pendingEvent.title}</span>
                </>
              ) : (
                "Create an account to keep your favorites."
              )}
            </div>
          </motion.div>
        )}

        {/* If signed in, show a simple profile card */}
        {user ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="font-display font-bold truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>

            <Button variant="secondary" className="w-full" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>

            <Button className="w-full gradient-primary" onClick={() => navigate("/favorites")}>
              View favorites
            </Button>
          </motion.div>
        ) : (
          // Auth UI
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="font-display font-bold">Guest</div>
                <div className="text-xs text-muted-foreground">
                  Sign in to save events and manage tickets.
                </div>
              </div>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-secondary/60">
                <TabsTrigger value="signin">Sign in</TabsTrigger>
                <TabsTrigger value="signup">Sign up</TabsTrigger>
              </TabsList>

              {/* SIGN IN */}
              <TabsContent value="signin" className="mt-4">
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-3">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="Email"
                                className="pl-9"
                                autoComplete="email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                              <Input
                                {...field}
                                type="password"
                                placeholder="Password"
                                className="pl-9"
                                autoComplete="current-password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full gradient-primary">
                      Sign in
                    </Button>

                    <button
                      type="button"
                      className="w-full text-xs text-muted-foreground hover:text-foreground transition"
                      onClick={() => toast.message("Forgot password", { description: "Hook this up later." })}
                    >
                      Forgot password?
                    </button>
                  </form>
                </Form>
              </TabsContent>

              {/* SIGN UP */}
              <TabsContent value="signup" className="mt-4">
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-3">
                    <FormField
                      control={signUpForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <UserIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                              <Input {...field} placeholder="Name" className="pl-9" autoComplete="name" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="Email"
                                className="pl-9"
                                autoComplete="email"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                              <Input
                                {...field}
                                type="password"
                                placeholder="Password"
                                className="pl-9"
                                autoComplete="new-password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={signUpForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                              <Input
                                {...field}
                                type="password"
                                placeholder="Confirm password"
                                className="pl-9"
                                autoComplete="new-password"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full gradient-primary">
                      Create account
                    </Button>

                    <div className="text-[11px] text-muted-foreground leading-relaxed">
                      By creating an account, you agree to the Terms (that you haven’t written yet).
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
