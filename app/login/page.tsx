"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { Btn, Card, Field, inputCls } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const auth = getFirebaseAuth();
    if (!auth) {
      setError(
        "Firebase abhi configure nahi hai (.env.local me keys daalein). Tab tak Demo dekho se portal test karein."
      );
      return;
    }
    setBusy(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push("/portal");
    } catch {
      setBusy(false);
      setError("Login fail — email/password galat hai ya account nahi bana.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50/60 px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-orange-600">
            Parcelwalah
          </h1>
          <p className="text-sm text-gray-500">Partner Portal — partners only</p>
        </div>

        <Card title="Partner Login">
          <form onSubmit={handleLogin} className="space-y-4">
            <Field label="Email">
              <input
                className={inputCls}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin se mila email"
              />
            </Field>
            <Field label="Password">
              <input
                className={inputCls}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin se mila password"
              />
            </Field>
            {error ? (
              <p className="text-sm font-medium text-red-700">{error}</p>
            ) : null}
            <Btn type="submit" disabled={busy}>
              {busy ? "Login ho raha hai…" : "Login"}
            </Btn>
            <p className="text-xs text-gray-500">
              Login sirf admin-created partner accounts se hota hai — public
              signup nahi hai. Account nahi hai to admin se sampark karein.
            </p>
          </form>
        </Card>

        <div className="rounded-2xl border-2 border-dashed border-amber-400 bg-amber-50 p-4 text-center">
          <p className="text-sm font-semibold text-amber-950">
            Pehle dekhna hai? Live se pehle demo try karein.
          </p>
          <p className="mt-1 text-xs text-amber-900">
            Demo me nakli data dikhega — koi login nahi, asli Firebase me kuch
            save nahi hoga.
          </p>
          <button
            onClick={() => router.push("/demo")}
            className="mt-3 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-amber-600"
          >
            Demo dekho (fake data)
          </button>
        </div>

        {!isFirebaseConfigured() ? (
          <p className="text-center text-xs text-gray-500">
            Live login ke liye Firebase env keys chahiye — README dekhein.
          </p>
        ) : null}
      </div>
    </div>
  );
}
