'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, CheckCircle2, AlertCircle, Loader2, Send, UserCheck } from 'lucide-react';
import { visitaSchema } from '@/schemas/visitaSchema';

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
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [mostrarModal, setMostrarModal] = useState(false);

  const capturarUbicacion = () => {
    setLoadingGps(true);
    setMensaje(null);

    if (!navigator.geolocation) {
      setMensaje({ tipo: 'error', texto: 'Tu dispositivo no soporta geolocalización.' });
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

  const handleInputChange = (campo: string, valor: string) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[campo];
        return nuevosErrores;
      });
    }
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje(null);

    const datosAValidar = {
      ...formData,
      latitud: coords?.lat ?? null,
      longitud: coords?.lng ?? null,
      precision_gps: coords?.accuracy ?? null,
    };

    const resultado = visitaSchema.safeParse(datosAValidar);

    if (!resultado.success) {
      const mapaErrores: Record<string, string> = {};
      resultado.error.issues.forEach((issue) => {
        const campo = issue.path[0];
        if (campo) {
          mapaErrores[campo.toString()] = issue.message;
        }
      });
      setErrores(mapaErrores);
      return;
    }

    setErrores({});
    setMostrarModal(true);
  };

  const handleConfirmarGuardado = async () => {
    setGuardando(true);
    setMensaje(null);

    const { error } = await supabase.from('visitas').insert([
      {
        nombre: formData.nombre.trim(),
        documento: formData.documento.trim(),
        telefono: formData.telefono.trim() || null,
        direccion: formData.direccion.trim() || null,
        observaciones: formData.observaciones.trim() || null,
        encuestador: formData.encuestador.trim(),
        latitud: coords ? coords.lat : null,
        longitud: coords ? coords.lng : null,
        precision_gps: coords ? coords.accuracy : null,
      },
    ]);

    setGuardando(false);
    setMostrarModal(false);

    if (error) {
      setMensaje({ tipo: 'error', texto: `Error al registrar: ${error.message}` });
    } else {
      setMensaje({ tipo: 'success', texto: '¡Visita registrada correctamente en el sistema!' });
      setFormData({
        nombre: '',
        documento: '',
        telefono: '',
        direccion: '',
        observaciones: '',
        encuestador: formData.encuestador,
      });
      setErrores({});
      capturarUbicacion();
      if (onGuardado) onGuardado();
    }
  };

  return (
    <>
      <form
        onSubmit={handlePreSubmit}
        noValidate
        className="bg-white/80 backdrop-blur-md p-5 sm:p-7 rounded-2xl shadow-xl shadow-slate-200/40 border border-white/80 space-y-4 max-w-xl mx-auto"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Nueva Visita de Campo</h2>
            <p className="text-xs text-slate-500 mt-0.5">Ingresa los datos recopilados durante la entrevista</p>
          </div>
          <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>

        {/* GPS Card con Estado Dinámico */}
        <div
          className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
            coords
              ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
              : 'bg-indigo-50/50 border-indigo-200/70 text-indigo-950'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2 rounded-lg shrink-0 ${
                coords ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              <MapPin className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold tracking-tight">Geolocalización GPS</p>
              {coords ? (
                <p className="text-xs font-semibold text-emerald-700 truncate">
                  Fijada (±{Math.round(coords.accuracy)}m precisión)
                </p>
              ) : (
                <p className="text-xs text-slate-500 truncate">Sin coordenadas fijadas...</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={capturarUbicacion}
            disabled={loadingGps}
            className="shrink-0 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 px-3 py-2 rounded-lg shadow-2xs transition-all active:scale-95 disabled:opacity-50"
          >
            {loadingGps ? <Loader2 className="h-3.5 w-3.5 animate-spin text-indigo-600" /> : 'Actualizar'}
          </button>
        </div>

        {/* Nombre y Apellido */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Nombre y Apellido <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Juan Pérez"
            className={`w-full rounded-xl px-3.5 py-2.5 text-base text-slate-900 bg-white border transition-all outline-none placeholder:text-slate-400 ${
              errores.nombre
                ? 'border-rose-400 bg-rose-50/20 focus:ring-4 focus:ring-rose-500/10'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
            }`}
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
          />
          {errores.nombre && (
            <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errores.nombre}
            </p>
          )}
        </div>

        {/* Cédula y Teléfono */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Cédula / DNI <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1234567"
              className={`w-full rounded-xl px-3.5 py-2.5 text-base text-slate-900 bg-white border transition-all outline-none placeholder:text-slate-400 ${
                errores.documento
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-4 focus:ring-rose-500/10'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
              }`}
              value={formData.documento}
              onChange={(e) => handleInputChange('documento', e.target.value)}
            />
            {errores.documento && (
              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errores.documento}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Teléfono
            </label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="09811234"
              className={`w-full rounded-xl px-3.5 py-2.5 text-base text-slate-900 bg-white border transition-all outline-none placeholder:text-slate-400 ${
                errores.telefono
                  ? 'border-rose-400 bg-rose-50/20 focus:ring-4 focus:ring-rose-500/10'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
              }`}
              value={formData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
            />
            {errores.telefono && (
              <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {errores.telefono}
              </p>
            )}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Dirección / Referencia
          </label>
          <input
            type="text"
            placeholder="Casa blanca con rejas negras frente a la plaza"
            className={`w-full rounded-xl px-3.5 py-2.5 text-base text-slate-900 bg-white border transition-all outline-none placeholder:text-slate-400 ${
              errores.direccion
                ? 'border-rose-400 bg-rose-50/20 focus:ring-4 focus:ring-rose-500/10'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
            }`}
            value={formData.direccion}
            onChange={(e) => handleInputChange('direccion', e.target.value)}
          />
          {errores.direccion && (
            <p className="mt-1 text-xs text-rose-600 font-semibold flex items-center gap-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              {errores.direccion}
            </p>
          )}
        </div>

        {/* Observaciones */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Observaciones Adicionales
          </label>
          <textarea
            rows={2}
            placeholder="Detalles sobre la visita o la vivienda..."
            className="w-full rounded-xl px-3.5 py-2.5 text-base text-slate-900 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 resize-none"
            value={formData.observaciones}
            onChange={(e) => handleInputChange('observaciones', e.target.value)}
          />
        </div>

        {mensaje && (
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-sm font-semibold transition-all ${
              mensaje.tipo === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {mensaje.tipo === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            )}
            <span>{mensaje.texto}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm tracking-wide mt-2"
        >
          <Send className="h-4 w-4 shrink-0" />
          <span>Registrar Visita</span>
        </button>
      </form>

      {/* Modal Glassmorphism de Confirmación */}
      {mostrarModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !guardando && setMostrarModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white/95 backdrop-blur-md p-6 shadow-2xl border border-white/80 text-center animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3.5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-tr from-emerald-100 to-teal-50 text-emerald-600 border border-emerald-200/80 shadow-inner">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              ¿Confirmar registro de visita?
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              Una vez confirmado, el registro quedará guardado en el sistema.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setMostrarModal(false)}
                disabled={guardando}
                className="flex-1 rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 py-2.5 text-sm font-semibold text-slate-700 transition-all disabled:opacity-50"
                // className="flex-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 py-2.5 text-sm font-semibold text-slate-700 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmarGuardado}
                disabled={guardando}
                className="flex-1 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-95 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
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
