'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function FormularioVisita({ onGuardado }: { onGuardado?: () => void }) {
  const [formData, setFormData] = useState({
    nombre: '',
    documento: '',
    telefono: '',
    direccion: '',
    observaciones: '',
    encuestador: 'Encuestador 1',
  });

  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [loadingGps, setLoadingGps] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const capturarUbicacion = () => {
    setLoadingGps(true);
    setMensaje(null);

    if (!navigator.geolocation) {
      setMensaje({ tipo: 'error', texto: 'Tu navegador no soporta geolocalización.' });
      setLoadingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoadingGps(false);
      },
      (err) => {
        setMensaje({ tipo: 'error', texto: `Error GPS: ${err.message}` });
        setLoadingGps(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    capturarUbicacion();
  }, []);

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords) {
      setMensaje({ tipo: 'error', texto: 'Debes capturar la ubicación GPS antes de guardar.' });
      return;
    }
    setMensaje(null);
    setMostrarModal(true);
  };

  const handleConfirmarGuardado = async () => {
    if (!coords) return;

    setGuardando(true);
    setMensaje(null);

    const { error } = await supabase.from('visitas').insert([
      {
        nombre: formData.nombre,
        documento: formData.documento,
        telefono: formData.telefono,
        direccion: formData.direccion,
        observaciones: formData.observaciones,
        encuestador: formData.encuestador,
        latitud: coords.lat,
        longitud: coords.lng,
        precision_gps: coords.accuracy,
      },
    ]);

    setGuardando(false);
    setMostrarModal(false);

    if (error) {
      setMensaje({ tipo: 'error', texto: `Error al guardar: ${error.message}` });
    } else {
      setMensaje({ tipo: 'success', texto: '¡Visita registrada con éxito!' });
      setFormData({
        nombre: '',
        documento: '',
        telefono: '',
        direccion: '',
        observaciones: '',
        encuestador: formData.encuestador,
      });
      capturarUbicacion();
      if (onGuardado) onGuardado();
    }
  };

  return (
    <>
      <form onSubmit={handlePreSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-lg mx-auto">
        <h2 className="text-xl font-bold text-gray-900">Registrar Nueva Visita</h2>

        {/* GPS Status Box */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className={`h-5 w-5 ${coords ? 'text-green-600' : 'text-blue-600'}`} />
            <div>
              <p className="text-xs font-semibold text-gray-800">Estado GPS:</p>
              {coords ? (
                <p className="text-xs font-medium text-green-700">
                  Capturado (±{Math.round(coords.accuracy)}m precisión)
                </p>
              ) : (
                <p className="text-xs text-gray-600">Buscando señal...</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={capturarUbicacion}
            disabled={loadingGps}
            className="text-xs bg-white font-medium text-gray-800 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
          >
            {loadingGps ? <Loader2 className="h-4 w-4 animate-spin text-gray-700" /> : 'Actualizar'}
          </button>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Nombre y Apellido *</label>
          <input
            required
            type="text"
            placeholder="Juan Pérez"
            className="w-full border border-gray-300 rounded-lg p-2.5 text-base text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Cédula / DNI *</label>
            <input
              type="text"
              placeholder="12345678"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-base text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              value={formData.documento}
              onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">Teléfono *</label>
            <input
              type="tel"
              placeholder="0981123456"
              className="w-full border border-gray-300 rounded-lg p-2.5 text-base text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Dirección / Referencia</label>
          <input
            type="text"
            placeholder="Casa blanca con rejas negras"
            className="w-full border border-gray-300 rounded-lg p-2.5 text-base text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            value={formData.direccion}
            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1">Observaciones</label>
          <textarea
            rows={2}
            placeholder="Notas adicionales..."
            className="w-full border border-gray-300 rounded-lg p-2.5 text-base text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
          />
        </div>

        {mensaje && (
          <div
            className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
              mensaje.tipo === 'success' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
            }`}
          >
            {mensaje.tipo === 'success' ? (
              <CheckCircle className="h-4 w-4 shrink-0 text-green-700" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />
            )}
            <span>{mensaje.texto}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!coords}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 shadow-sm"
        >
          Guardar Visita
        </button>
      </form>

      {/* Modal Limpio de Confirmación con Check Verde */}
      {mostrarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => !guardando && setMostrarModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ícono de Check Verde */}
            <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-6">
              ¿Confirmar registro de visita?
            </h3>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                disabled={guardando}
                className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarGuardado}
                disabled={guardando}
                className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 py-2.5 text-sm font-semibold text-white shadow transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {guardando ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Confirmar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
// import { MapPin, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// export default function FormularioVisita({ onGuardado }: { onGuardado?: () => void }) {
//   const [formData, setFormData] = useState({
//     nombre: '',
//     documento: '',
//     telefono: '',
//     direccion: '',
//     observaciones: '',
//     encuestador: 'Encuestador 1',
//   });

//   const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
//   const [loadingGps, setLoadingGps] = useState(false);
//   const [guardando, setGuardando] = useState(false);
//   const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null);

//   const capturarUbicacion = () => {
//     setLoadingGps(true);
//     setMensaje(null);

//     if (!navigator.geolocation) {
//       setMensaje({ tipo: 'error', texto: 'Tu navegador no soporta geolocalización.' });
//       setLoadingGps(false);
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setCoords({
//           lat: pos.coords.latitude,
//           lng: pos.coords.longitude,
//           accuracy: pos.coords.accuracy,
//         });
//         setLoadingGps(false);
//       },
//       (err) => {
//         setMensaje({ tipo: 'error', texto: `Error GPS: ${err.message}` });
//         setLoadingGps(false);
//       },
//       { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
//     );
//   };

//   useEffect(() => {
//     capturarUbicacion();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!coords) {
//       setMensaje({ tipo: 'error', texto: 'Debes capturar la ubicación GPS antes de guardar.' });
//       return;
//     }

//     setGuardando(true);
//     setMensaje(null);

//     const { error } = await supabase.from('visitas').insert([
//       {
//         nombre: formData.nombre,
//         documento: formData.documento,
//         telefono: formData.telefono,
//         direccion: formData.direccion,
//         observaciones: formData.observaciones,
//         encuestador: formData.encuestador,
//         latitud: coords.lat,
//         longitud: coords.lng,
//         precision_gps: coords.accuracy,
//       },
//     ]);

//     setGuardando(false);

//     if (error) {
//       setMensaje({ tipo: 'error', texto: `Error al guardar: ${error.message}` });
//     } else {
//       setMensaje({ tipo: 'success', texto: '¡Visita registrada con éxito!' });
//       setFormData({
//         nombre: '',
//         documento: '',
//         telefono: '',
//         direccion: '',
//         observaciones: '',
//         encuestador: formData.encuestador,
//       });
//       capturarUbicacion();
//       if (onGuardado) onGuardado();
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-lg mx-auto">
//       <h2 className="text-xl font-bold text-gray-900">Registrar Nueva Visita</h2>

//       {/* GPS Status Box */}
//       <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <MapPin className={`h-5 w-5 ${coords ? 'text-green-600' : 'text-blue-600'}`} />
//           <div>
//             <p className="text-xs font-semibold text-gray-800">Estado GPS:</p>
//             {coords ? (
//               <p className="text-xs font-medium text-green-700">
//                 Capturado (±{Math.round(coords.accuracy)}m precisión)
//               </p>
//             ) : (
//               <p className="text-xs text-gray-600">Buscando señal...</p>
//             )}
//           </div>
//         </div>
//         <button
//           type="button"
//           onClick={capturarUbicacion}
//           disabled={loadingGps}
//           className="text-xs bg-white font-medium text-gray-800 border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-100 disabled:opacity-50"
//         >
//           {loadingGps ? <Loader2 className="h-4 w-4 animate-spin text-gray-700" /> : 'Actualizar'}
//         </button>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold text-gray-800 mb-1">Nombre y Apellido *</label>
//         <input
//           required
//           type="text"
//           placeholder="Ej: Juan Pérez"
//           className="w-full border border-gray-300 rounded-lg p-2.5 text-base text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//           value={formData.nombre}
//           onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-3">
//         <div>
//           <label className="block text-sm font-semibold text-gray-800 mb-1">Cédula / DNI</label>
//           <input
//             type="text"
//             placeholder="Ej: 1234567"
//             className="w-full border border-gray-300 rounded-lg p-2.5 text-base text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//             value={formData.documento}
//             onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-semibold text-gray-800 mb-1">Teléfono</label>
//           <input
//             type="tel"
//             placeholder="Ej: 0981123456"
//             className="w-full border border-gray-300 rounded-lg p-2.5 text-base text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//             value={formData.telefono}
//             onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-semibold text-gray-800 mb-1">Dirección / Referencia</label>
//         <input
//           type="text"
//           placeholder="Ej: Casa blanca con rejas negras"
//           className="w-full border border-gray-300 rounded-lg p-2.5 text-base text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//           value={formData.direccion}
//           onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
//         />
//       </div>

//       <div>
//         <label className="block text-sm font-semibold text-gray-800 mb-1">Observaciones</label>
//         <textarea
//           rows={2}
//           placeholder="Notas adicionales..."
//           className="w-full border border-gray-300 rounded-lg p-2.5 text-base text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
//           value={formData.observaciones}
//           onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
//         />
//       </div>

//       {mensaje && (
//         <div
//           className={`p-3 rounded-lg flex items-center gap-2 text-sm font-medium ${
//             mensaje.tipo === 'success' ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'
//           }`}
//         >
//           {mensaje.tipo === 'success' ? <CheckCircle className="h-4 w-4 shrink-0 text-green-700" /> : <AlertCircle className="h-4 w-4 shrink-0 text-red-700" />}
//           <span>{mensaje.texto}</span>
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={guardando || !coords}
//         className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 shadow-sm"
//       >
//         {guardando ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Guardar Visita'}
//       </button>
//     </form>
//   );
// }

