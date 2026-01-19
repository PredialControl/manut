"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Credenciais inválidas. Tente novamente.");
        setIsLoading(false);
      } else {
        router.push("/");
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer login.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image - City Day */}
      <div className="absolute inset-0 z-0">
        <img
          src="/app-background-light.jpg"
          alt="Background"
          className="h-full w-full object-cover object-center"
        />
        {/* Overlay leve para garantir contraste se necessário, mas mantendo o brilho */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-[400px] overflow-hidden rounded-[40px] border border-white/40 bg-white/20 p-8 shadow-2xl backdrop-blur-xl sm:px-10 sm:py-12">
        {/* Logo Section */}
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="mb-6 flex items-center justify-center">
            <Image
              src="/logo.png.png"
              alt="Manut Logo"
              width={180}
              height={90}
              className="object-contain"
              priority
            />
          </div>
          {/* Removido o texto MANUT duplicado duplicado se a logo já tiver o nome, mas vou manter o slogan */}
          <p className="mt-2 text-[11px] font-black uppercase tracking-[0.2em] text-black drop-shadow-sm">
            Fazendo gestão com excelência
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email @ empresa.com.br"
              className="h-12 w-full rounded-xl border-0 bg-white/70 px-4 text-sm font-bold text-black placeholder:text-gray-700/90 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-black/20 shadow-inner"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                className="h-12 w-full rounded-xl border-0 bg-white/70 px-4 pr-10 text-sm font-bold text-black placeholder:text-gray-700/90 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-black/20 shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-center text-xs font-bold text-red-600 bg-red-100/50 py-1 rounded-md mb-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-neutral-800 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-neutral-900/20 hover:bg-neutral-900 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Entrar"}
          </Button>

          <div className="pt-2 text-center">
            <button
              type="button"
              className="text-[10px] font-bold uppercase tracking-wider text-orange-600/90 hover:text-orange-700 transition-colors"
            >
              Esqueci minha senha
            </button>
          </div>

          {/* Divider with text or simple spacer */}
          <div className="py-2">
            <Button
              type="button"
              variant="secondary"
              className="h-10 w-full rounded-xl bg-white/70 text-[10px] font-bold uppercase tracking-wider text-gray-700 hover:bg-white hover:text-gray-900 shadow-sm transition-all"
            >
              CRIAR UMA CONTA
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
