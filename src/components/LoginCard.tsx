'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Lock, AlertCircle, Loader2 } from 'lucide-react';

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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black text-gray-900">Censo & Relevamiento</h1>
          <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales para continuar</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <div className="relative">
              <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                autoFocus
                placeholder="example@censo.local"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-base text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-base text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </div>
          </div>

          {errorLogin && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorLogin}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={iniciando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm mt-2 flex items-center justify-center gap-2 disabled:bg-blue-400"
          >
            {iniciando ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Verificando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>
    </main>
  );
}