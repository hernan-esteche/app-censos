'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import { UsuarioSesion, Visita, Rol } from '@/types';
import { exportarVisitasAExcel } from '@/lib/exportExcel';
import LoginCard from '@/components/LoginCard';
import FormularioVisita from '@/components/FormularioVisita';
import { Download, Map, PlusCircle, LogOut, Loader2 } from 'lucide-react';

const MapaVisitas = dynamic(() => import('@/components/MapaVisitas'), {
  ssr: false,
  loading: () => (
    <div className="h-125 flex items-center justify-center bg-gray-100 rounded-xl text-gray-600 font-medium">
      Cargando mapa...
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-blue-600" />
        Iniciando sistema...
      </div>
    );
  }

  if (!sesion) {
    return <LoginCard onLoginSuccess={cargarVisitas} />;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Censo & Relevamiento</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                {sesion.rol === 'admin' ? 'Administrador' : 'Encuestador'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {sesion.rol === 'admin' && (
              <button
                onClick={() => exportarVisitasAExcel(visitas)}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                <Download className="h-4 w-4" /> Exportar a Excel
              </button>
            )}

            <button
              onClick={() => supabase.auth.signOut()}
              className="flex items-center gap-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" /> Salir
            </button>
          </div>
        </div>

        {/* Pestañas de Admin */}
        {sesion.rol === 'admin' && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setTab('formulario')}
              className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
                tab === 'formulario'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <PlusCircle className="h-4 w-4" /> Nuevo Registro
            </button>
            <button
              onClick={() => setTab('mapa')}
              className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
                tab === 'mapa'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Map className="h-4 w-4" /> Ver Mapa ({visitas.length})
            </button>
          </div>
        )}

        {/* Vista activa */}
        {sesion.rol === 'encuestador' || tab === 'formulario' ? (
          <FormularioVisita onGuardado={sesion.rol === 'admin' ? cargarVisitas : undefined} />
        ) : (
          <div className="space-y-4">
            <MapaVisitas visitas={visitas} />
          </div>
        )}
      </div>
    </main>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { supabase } from '@/lib/supabase';
// import FormularioVisita from '@/components/FormularioVisita';
// import * as XLSX from 'xlsx';
// import { Download, Map, PlusCircle, LogOut, User, Lock, AlertCircle, Loader2 } from 'lucide-react';

// const MapaVisitas = dynamic(() => import('@/components/MapaVisitas'), {
//   ssr: false,
//   loading: () => (
//     <div className="h-125 flex items-center justify-center bg-gray-100 rounded-xl text-gray-600 font-medium">
//       Cargando mapa...
//     </div>
//   ),
// });

// type Rol = 'admin' | 'encuestador';

// interface UsuarioSesion {
//   email: string;
//   rol: Rol;
// }

// export default function Home() {
//   const [sesion, setSesion] = useState<UsuarioSesion | null>(null);
//   const [cargandoSesion, setCargandoSesion] = useState(true);

//   // Estados del Formulario de Login
//   const [emailInput, setEmailInput] = useState('');
//   const [passwordInput, setPasswordInput] = useState('');
//   const [iniciando, setIniciando] = useState(false);
//   const [errorLogin, setErrorLogin] = useState('');

//   // Estados de la app
//   const [visitas, setVisitas] = useState<any[]>([]);
//   const [tab, setTab] = useState<'formulario' | 'mapa'>('formulario');

//   // Verificar y escuchar el estado de la sesión con Supabase Auth
//   useEffect(() => {
//     const verificarSesion = async () => {
//       const { data: { session } } = await supabase.auth.getSession();
      
//       if (session?.user) {
//         const rolUsuario: Rol = session.user.user_metadata?.role === 'admin' ? 'admin' : 'encuestador';
//         setSesion({
//           email: session.user.email || '',
//           rol: rolUsuario,
//         });
//       }
//       setCargandoSesion(false);
//     };

//     verificarSesion();

//     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
//       if (session?.user) {
//         const rolUsuario: Rol = session.user.user_metadata?.role === 'admin' ? 'admin' : 'encuestador';
//         setSesion({
//           email: session.user.email || '',
//           rol: rolUsuario,
//         });
//       } else {
//         setSesion(null);
//         setVisitas([]);
//       }
//     });

//     return () => subscription.unsubscribe();
//   }, []);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorLogin('');
//     setIniciando(true);

//     const email = emailInput.trim();
//     const password = passwordInput.trim();

//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password,
//     });

//     setIniciando(false);

//     if (error) {
//       setErrorLogin('Credenciales inválidas. Verifica tu correo y contraseña.');
//       return;
//     }

//     if (data.user) {
//       const rolUsuario: Rol = data.user.user_metadata?.role === 'admin' ? 'admin' : 'encuestador';
//       setSesion({
//         email: data.user.email || '',
//         rol: rolUsuario,
//       });
//       if (rolUsuario === 'admin') {
//         cargarVisitas();
//       }
//     }
//   };

//   const handleLogout = async () => {
//     await supabase.auth.signOut();
//     setSesion(null);
//     setEmailInput('');
//     setPasswordInput('');
//     setErrorLogin('');
//   };

//   const cargarVisitas = async () => {
//     try {
//       const { data } = await supabase
//         .from('visitas')
//         .select('*')
//         .order('created_at', { ascending: false });
//       if (data) setVisitas(data);
//     } catch (error) {
//       console.error('Error cargando visitas:', error);
//     }
//   };

//   useEffect(() => {
//     if (sesion?.rol === 'admin') {
//       cargarVisitas();
//     }
//   }, [sesion]);

//   const exportarAExcel = () => {
//     const dataLimpia = visitas.map((v) => ({
//       ID: v.id,
//       Nombre: v.nombre,
//       Documento: v.documento,
//       Teléfono: v.telefono,
//       Dirección: v.direccion,
//       Latitud: v.latitud,
//       Longitud: v.longitud,
//       Observaciones: v.observaciones,
//       Encuestador: v.encuestador,
//       Fecha: new Date(v.created_at).toLocaleString(),
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(dataLimpia);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitas');
//     XLSX.writeFile(workbook, `Reporte_Visitas_${new Date().toISOString().slice(0, 10)}.xlsx`);
//   };

//   if (cargandoSesion) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
//         <Loader2 className="h-5 w-5 animate-spin mr-2 text-blue-600" />
//         Iniciando sistema...
//       </div>
//     );
//   }

//   // Vista de Login
//   if (!sesion) {
//     return (
//       <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200">
//           <div className="text-center mb-6">
//             <h1 className="text-2xl font-black text-gray-900">Censo & Relevamiento</h1>
//             <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales para continuar</p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <div className="relative">
//                 <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="email"
//                   required
//                   autoFocus
//                   placeholder="example@censo.local"
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-base text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//                   value={emailInput}
//                   onChange={(e) => setEmailInput(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="relative">
//                 <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="password"
//                   required
//                   placeholder="••••••••"
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-base text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//                   value={passwordInput}
//                   onChange={(e) => setPasswordInput(e.target.value)}
//                 />
//               </div>
//             </div>

//             {errorLogin && (
//               <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
//                 <AlertCircle className="h-4 w-4 shrink-0" />
//                 <span>{errorLogin}</span>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={iniciando}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm mt-2 flex items-center justify-center gap-2 disabled:bg-blue-400"
//             >
//               {iniciando ? (
//                 <>
//                   <Loader2 className="h-5 w-5 animate-spin" />
//                   Verificando...
//                 </>
//               ) : (
//                 'Iniciar Sesión'
//               )}
//             </button>
//           </form>
//         </div>
//       </main>
//     );
//   }

//   // Vista Principal autenticada
//   return (
//     <main className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//           <div>
//             <h1 className="text-2xl font-black text-gray-900">Censo & Relevamiento</h1>
//             <div className="flex items-center gap-2 mt-0.5">
//               <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
//                 {sesion.rol === 'admin' ? 'Administrador' : 'Encuestador'}
//               </span>
//             </div>
//           </div>

//           <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
//             {sesion.rol === 'admin' && (
//               <button
//                 onClick={exportarAExcel}
//                 className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
//               >
//                 <Download className="h-4 w-4" /> Exportar a Excel
//               </button>
//             )}

//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
//               title="Cerrar sesión"
//             >
//               <LogOut className="h-4 w-4" /> Salir
//             </button>
//           </div>
//         </div>

//         {/* Selector de pestañas (Solo para admin) */}
//         {sesion.rol === 'admin' && (
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setTab('formulario')}
//               className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
//                 tab === 'formulario'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <PlusCircle className="h-4 w-4" /> Nuevo Registro
//             </button>
//             <button
//               onClick={() => setTab('mapa')}
//               className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
//                 tab === 'mapa'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Map className="h-4 w-4" /> Ver Mapa ({visitas.length})
//             </button>
//           </div>
//         )}

//         {/* Contenido según rol y tab */}
//         {sesion.rol === 'encuestador' || tab === 'formulario' ? (
//           <FormularioVisita onGuardado={sesion.rol === 'admin' ? cargarVisitas : undefined} />
//         ) : (
//           <div className="space-y-4">
//             <MapaVisitas visitas={visitas} />
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { supabase } from '@/lib/supabase';
// import FormularioVisita from '@/components/FormularioVisita';
// import * as XLSX from 'xlsx';
// import { Download, Map, PlusCircle, LogOut, User, Lock, AlertCircle } from 'lucide-react';

// const MapaVisitas = dynamic(() => import('@/components/MapaVisitas'), {
//   ssr: false,
//   loading: () => (
//     <div className="h-125 flex items-center justify-center bg-gray-100 rounded-xl text-gray-600 font-medium">
//       Cargando mapa...
//     </div>
//   ),
// });

// type Rol = 'admin' | 'encuestador';

// interface UsuarioSesion {
//   usuario: string;
//   rol: Rol;
// }

// export default function Home() {
//   const [sesion, setSesion] = useState<UsuarioSesion | null>(null);
//   const [cargandoSesion, setCargandoSesion] = useState(true);

//   // Estados del Formulario de Login
//   const [usernameInput, setUsernameInput] = useState('');
//   const [passwordInput, setPasswordInput] = useState('');
//   const [errorLogin, setErrorLogin] = useState('');

//   // Estados de la app
//   const [visitas, setVisitas] = useState<any[]>([]);
//   const [tab, setTab] = useState<'formulario' | 'mapa'>('formulario');

//   // Cargar sesión guardada al iniciar
//   useEffect(() => {
//     const sesionGuardada = sessionStorage.getItem('sesion_censo');
//     if (sesionGuardada) {
//       try {
//         setSesion(JSON.parse(sesionGuardada));
//       } catch {
//         sessionStorage.removeItem('sesion_censo');
//       }
//     }
//     setCargandoSesion(false);
//   }, []);

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrorLogin('');

//     const u = usernameInput.trim().toLowerCase();
//     const p = passwordInput.trim();

//     if (u === 'admin' && p === 'Teresa2030') {
//       const dataSesion: UsuarioSesion = { usuario: 'admin', rol: 'admin' };
//       setSesion(dataSesion);
//       sessionStorage.setItem('sesion_censo', JSON.stringify(dataSesion));
//       cargarVisitas();
//     } else if (u === 'encuestador1' && p === 'encuestador2020') {
//       const dataSesion: UsuarioSesion = { usuario: 'encuestador1', rol: 'encuestador' };
//       setSesion(dataSesion);
//       sessionStorage.setItem('sesion_censo', JSON.stringify(dataSesion));
//       setTab('formulario');
//     } else {
//       setErrorLogin('Usuario o contraseña incorrectos.');
//     }
//   };

//   const handleLogout = () => {
//     sessionStorage.removeItem('sesion_censo');
//     setSesion(null);
//     setUsernameInput('');
//     setPasswordInput('');
//     setErrorLogin('');
//   };

//   const cargarVisitas = async () => {
//     try {
//       const { data } = await supabase
//         .from('visitas')
//         .select('*')
//         .order('created_at', { ascending: false });
//       if (data) setVisitas(data);
//     } catch (error) {
//       console.error('Error cargando visitas:', error);
//     }
//   };

//   useEffect(() => {
//     if (sesion?.rol === 'admin') {
//       cargarVisitas();
//     }
//   }, [sesion]);

//   const exportarAExcel = () => {
//     const dataLimpia = visitas.map((v) => ({
//       ID: v.id,
//       Nombre: v.nombre,
//       Documento: v.documento,
//       Teléfono: v.telefono,
//       Dirección: v.direccion,
//       Latitud: v.latitud,
//       Longitud: v.longitud,
//       Observaciones: v.observaciones,
//       Encuestador: v.encuestador,
//       Fecha: new Date(v.created_at).toLocaleString(),
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(dataLimpia);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitas');
//     XLSX.writeFile(workbook, `Reporte_Visitas_${new Date().toISOString().slice(0, 10)}.xlsx`);
//   };

//   if (cargandoSesion) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
//         Iniciando sistema...
//       </div>
//     );
//   }

//   // Vista de Login
//   if (!sesion) {
//     return (
//       <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200">
//           <div className="text-center mb-6">
//             <h1 className="text-2xl font-black text-gray-900">Censo & Relevamiento</h1>
//             <p className="text-sm text-gray-500 mt-1">Ingresa tus credenciales para continuar</p>
//           </div>

//           <form onSubmit={handleLogin} className="space-y-4">
//             <div>
//               <div className="relative">
//                 <User className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="text"
//                   required
//                   autoFocus
//                   placeholder="Usuario"
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-base text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//                   value={usernameInput}
//                   onChange={(e) => setUsernameInput(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div>
//               <div className="relative">
//                 <Lock className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
//                 <input
//                   type="password"
//                   required
//                   placeholder="••••••••"
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-base text-gray-900 bg-white focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//                   value={passwordInput}
//                   onChange={(e) => setPasswordInput(e.target.value)}
//                 />
//               </div>
//             </div>

//             {errorLogin && (
//               <div className="p-3 rounded-lg bg-red-50 border border-red-200 flex items-center gap-2 text-sm text-red-700">
//                 <AlertCircle className="h-4 w-4 shrink-0" />
//                 <span>{errorLogin}</span>
//               </div>
//             )}

//             <button
//               type="submit"
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm mt-2"
//             >
//               Iniciar Sesión
//             </button>
//           </form>
//         </div>
//       </main>
//     );
//   }

//   // Vista Principal autenticada
//   return (
//     <main className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
//           <div>
//             <h1 className="text-2xl font-black text-gray-900">Censo & Relevamiento</h1>
//             <div className="flex items-center gap-2 mt-0.5">
//               <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
//                 {sesion.rol === 'admin' ? 'Administrador' : 'Encuestador'}
//               </span>

//             </div>
//           </div>

//           <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
//             {sesion.rol === 'admin' && (
//               <button
//                 onClick={exportarAExcel}
//                 className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
//               >
//                 <Download className="h-4 w-4" /> Exportar a Excel
//               </button>
//             )}

//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-1.5 border border-gray-300 hover:bg-gray-100 text-gray-700 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
//               title="Cerrar sesión"
//             >
//               <LogOut className="h-4 w-4" /> Salir
//             </button>
//           </div>
//         </div>

//         {/* Selector de pestañas (Solo para admin) */}
//         {sesion.rol === 'admin' && (
//           <div className="flex border-b border-gray-200">
//             <button
//               onClick={() => setTab('formulario')}
//               className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
//                 tab === 'formulario'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <PlusCircle className="h-4 w-4" /> Nuevo Registro
//             </button>
//             <button
//               onClick={() => setTab('mapa')}
//               className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
//                 tab === 'mapa'
//                   ? 'border-blue-600 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               <Map className="h-4 w-4" /> Ver Mapa ({visitas.length})
//             </button>
//           </div>
//         )}

//         {/* Contenido según rol y tab */}
//         {sesion.rol === 'encuestador' || tab === 'formulario' ? (
//           <FormularioVisita onGuardado={sesion.rol === 'admin' ? cargarVisitas : undefined} />
//         ) : (
//           <div className="space-y-4">
//             <MapaVisitas visitas={visitas} />
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

// 'use client';

// import { useState, useEffect } from 'react';
// import dynamic from 'next/dynamic';
// import { supabase } from '@/lib/supabase';
// import FormularioVisita from '@/components/FormularioVisita';
// import * as XLSX from 'xlsx';
// import { Download, Map, PlusCircle } from 'lucide-react';

// const MapaVisitas = dynamic(() => import('@/components/MapaVisitas'), {
//   ssr: false,
//   loading: () => (
//     <div className="h-125 flex items-center justify-center bg-gray-100 rounded-xl text-gray-600 font-medium">
//       Cargando mapa...
//     </div>
//   ),
// });

// export default function Home() {
//   const [visitas, setVisitas] = useState<any[]>([]);
//   const [tab, setTab] = useState<'formulario' | 'mapa'>('formulario');

//   const cargarVisitas = async () => {
//     try {
//       const { data } = await supabase
//         .from('visitas')
//         .select('*')
//         .order('created_at', { ascending: false });
//       if (data) setVisitas(data);
//     } catch (error) {
//       console.error('Error cargando visitas:', error);
//     }
//   };

//   useEffect(() => {
//     cargarVisitas();
//   }, []);

//   const exportarAExcel = () => {
//     const dataLimpia = visitas.map((v) => ({
//       ID: v.id,
//       Nombre: v.nombre,
//       Documento: v.documento,
//       Teléfono: v.telefono,
//       Dirección: v.direccion,
//       Latitud: v.latitud,
//       Longitud: v.longitud,
//       Observaciones: v.observaciones,
//       Encuestador: v.encuestador,
//       Fecha: new Date(v.created_at).toLocaleString(),
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(dataLimpia);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitas');
//     XLSX.writeFile(workbook, `Reporte_Visitas_${new Date().toISOString().slice(0, 10)}.xlsx`);
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 p-4 md:p-8">
//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
//           <div>
//             <h1 className="text-2xl font-black text-gray-900">Censo & Relevamiento</h1>
//             <p className="text-sm text-gray-500">Total de visitas registradas: {visitas.length}</p>
//           </div>

//           <button
//             onClick={exportarAExcel}
//             className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
//           >
//             <Download className="h-4 w-4" /> Exportar a Excel
//           </button>
//         </div>

//         {/* Selector de pestañas */}
//         <div className="flex border-b border-gray-200">
//           <button
//             onClick={() => setTab('formulario')}
//             className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
//               tab === 'formulario'
//                 ? 'border-blue-600 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             <PlusCircle className="h-4 w-4" /> Nuevo Registro
//           </button>
//           <button
//             onClick={() => setTab('mapa')}
//             className={`flex items-center gap-2 py-3 px-6 font-medium text-sm border-b-2 transition-colors ${
//               tab === 'mapa'
//                 ? 'border-blue-600 text-blue-600'
//                 : 'border-transparent text-gray-500 hover:text-gray-700'
//             }`}
//           >
//             <Map className="h-4 w-4" /> Ver Mapa ({visitas.length})
//           </button>
//         </div>

//         {/* Contenido */}
//         {tab === 'formulario' ? (
//           <FormularioVisita onGuardado={cargarVisitas} />
//         ) : (
//           <div className="space-y-4">
//             <MapaVisitas visitas={visitas} />
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }