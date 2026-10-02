import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Đăng nhập quản trị — Bình Mỹ FarmGo" },
      { name: "description", content: "Đăng nhập dành cho quản trị viên và đơn vị cung cấp Bình Mỹ FarmGo." },
      { property: "og:title", content: "Đăng nhập quản trị Bình Mỹ FarmGo" },
      { property: "og:description", content: "Khu vực dành cho quản trị viên và đơn vị cung cấp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const inputCls =
  "mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMsg("Email hoặc mật khẩu không đúng.");
      navigate({ to: "/quan-tri" });
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth` },
      });
      setBusy(false);
      setMsg(
        error
          ? "Không đăng ký được: " + error.message
          : "Đã gửi email xác nhận. Sau khi xác nhận, quản trị viên sẽ cấp quyền cho tài khoản của bạn.",
      );
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold">{mode === "in" ? "Đăng nhập quản trị" : "Tạo tài khoản"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Dành cho quản trị viên và đơn vị cung cấp. Tài khoản mới chưa có quyền cho đến khi được quản trị
          viên cấp.
        </p>
        <form onSubmit={submit} className="mt-5 space-y-4">
          <label className="block text-sm">
            <span className="font-medium">Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Mật khẩu</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputCls}
            />
          </label>
          <button
            disabled={busy}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {mode === "in" ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>
        {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
        <button
          type="button"
          onClick={() => setMode(mode === "in" ? "up" : "in")}
          className="mt-4 text-sm text-primary hover:underline"
        >
          {mode === "in" ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
        </button>
      </div>
    </div>
  );
}
