'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Lock, AlertCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface LoginCardProps {
  onLoginSuccess: () => void;
}

export default function LoginCard({ onLoginSuccess }: LoginCardProps) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [iniciando, setIniciando] = useState(false);
  const [errorLogin, setErrorLogin] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorLogin('');
    setIniciando(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.trim(),
      password: passwordInput.trim(),
    });

    setIniciando(false);

    if (error) {
      setErrorLogin('Credenciales inválidas. Verifica tu correo y contraseña.');
    } else {
      onLoginSuccess();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-100 via-indigo-50/50 to-blue-100/40 flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white">
      <div className="w-full max-w-md bg-white/85 backdrop-blur-md p-7 sm:p-9 rounded-3xl shadow-2xl shadow-slate-300/50 border border-white/90 transition-all">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30 mb-3.5">
            <Sparkles className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Censo & Relevamiento</h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Acceso seguro para administradores y encuestadores
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <User className="h-5 w-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoFocus
                placeholder="usuario@censo.local"
                className="w-full border border-slate-200 rounded-xl pl-11 pr-3.5 py-3 text-base text-slate-900 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="h-5 w-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full border border-slate-200 rounded-xl pl-11 pr-3.5 py-3 text-base text-slate-900 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>
          </div>

          {errorLogin && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center gap-2 text-xs font-semibold text-rose-700 animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              <span>{errorLogin}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={iniciando}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm tracking-wide mt-2 disabled:opacity-60"
          >
            {iniciando ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verificando credenciales...</span>
              </>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
