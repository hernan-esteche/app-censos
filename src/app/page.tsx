'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { UsuarioSesion, Visita, Rol } from '@/types';
import { exportarVisitasAExcel } from '@/lib/exportExcel';
import LoginCard from '@/components/LoginCard';
import FormularioVisita from '@/components/FormularioVisita';
import { Download, Map, PlusCircle, LogOut, Loader2, Sparkles } from 'lucide-react';

const MapaVisitas = dynamic(() => import('@/components/MapaVisitas'), {
  ssr: false,
  loading: () => (
    <div className="h-125 flex flex-col items-center justify-center bg-white/70 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-sm text-slate-500 font-medium gap-3">
      <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      <span>Cargando mapa interactivo...</span>
    </div>
  ),
});

export default function Home() {
  const [sesion, setSesion] = useState<UsuarioSesion | null>(null);
  const [cargandoSesion, setCargandoSesion] = useState(true);
  const [visitas, setVisitas] = useState<Visita[]>([]);
  const [tab, setTab] = useState<'formulario' | 'mapa'>('formulario');

  const cargarVisitas = async () => {
    const { data } = await supabase
      .from('visitas')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setVisitas(data as Visita[]);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const rol: Rol = session.user.user_metadata?.role === 'admin' ? 'admin' : 'encuestador';
        setSesion({ email: session.user.email || '', rol });
        if (rol === 'admin') cargarVisitas();
      } else {
        setSesion(null);
        setVisitas([]);
      }
      setCargandoSesion(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (cargandoSesion) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-slate-100 via-indigo-50/50 to-blue-100/40 text-slate-600 font-medium gap-3">
        <div className="p-3 bg-white/80 rounded-2xl shadow-lg border border-slate-200/80 backdrop-blur-md">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
        </div>
        <p className="text-sm tracking-wide text-slate-500">Iniciando plataforma...</p>
      </div>
    );
  }

  if (!sesion) {
    return <LoginCard onLoginSuccess={cargarVisitas} />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-slate-100 via-indigo-50/40 to-blue-50/50 p-4 sm:p-6 md:p-8 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header con Efecto Glassmorphism */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-xl shadow-slate-200/40 border border-white/80 transition-all">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Censo & Relevamiento
              </h1>
              <Sparkles className="h-5 w-5 text-indigo-500 shrink-0 hidden sm:inline-block" />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200/70 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
                {sesion.rol === 'admin' ? 'Administrador' : 'Encuestador'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {sesion.rol === 'admin' && (
              <button
                onClick={() => exportarVisitasAExcel(visitas)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-600/20"
              >
                <Download className="h-4 w-4 shrink-0" />
                <span>Exportar Excel</span>
              </button>
            )}

            <button
              onClick={() => supabase.auth.signOut()}
              className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100/80 active:bg-slate-200/70 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 shadow-2xs transition-all"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4 text-slate-500" />
              <span>Salir</span>
            </button>
          </div>
        </header>

        {/* Pestañas de Navegación Estilo Pastilla Flotante (Admin) */}
        {sesion.rol === 'admin' && (
          <div className="flex items-center justify-start p-1.5 bg-slate-200/60 backdrop-blur-sm rounded-2xl w-full sm:w-fit border border-slate-200/70">
            <button
              onClick={() => setTab('formulario')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                tab === 'formulario'
                  ? 'bg-white text-indigo-700 shadow-sm shadow-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PlusCircle className="h-4 w-4 shrink-0" />
              <span>Nuevo Registro</span>
            </button>
            <button
              onClick={() => setTab('mapa')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                tab === 'mapa'
                  ? 'bg-white text-indigo-700 shadow-sm shadow-slate-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Map className="h-4 w-4 shrink-0" />
              <span>Ver Mapa ({visitas.length})</span>
            </button>
          </div>
        )}

        {/* Contenedor de Vistas */}
        <section className="transition-all duration-200">
          {sesion.rol === 'encuestador' || tab === 'formulario' ? (
            <FormularioVisita onGuardado={sesion.rol === 'admin' ? cargarVisitas : undefined} />
          ) : (
            <div className="bg-white/80 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-xl shadow-slate-200/40 border border-white/80">
              <MapaVisitas visitas={visitas} />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
