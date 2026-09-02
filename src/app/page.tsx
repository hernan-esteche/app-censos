'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';
import FormularioVisita from '@/components/FormularioVisita';
import * as XLSX from 'xlsx';
import { Download, Map, PlusCircle } from 'lucide-react';

const MapaVisitas = dynamic(() => import('@/components/MapaVisitas'), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] flex items-center justify-center bg-gray-100 rounded-xl text-gray-600 font-medium">
      Cargando mapa...
    </div>
  ),
});

export default function Home() {
  const [visitas, setVisitas] = useState<any[]>([]);
  const [tab, setTab] = useState<'formulario' | 'mapa'>('formulario');

  const cargarVisitas = async () => {
    try {
      const { data } = await supabase
        .from('visitas')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setVisitas(data);
    } catch (error) {
      console.error('Error cargando visitas:', error);
    }
  };

  useEffect(() => {
    cargarVisitas();
  }, []);

  const exportarAExcel = () => {
    const dataLimpia = visitas.map((v) => ({
      ID: v.id,
      Nombre: v.nombre,
      Documento: v.documento,
      Teléfono: v.telefono,
      Dirección: v.direccion,
      Latitud: v.latitud,
      Longitud: v.longitud,
      Observaciones: v.observaciones,
      Encuestador: v.encuestador,
      Fecha: new Date(v.created_at).toLocaleString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataLimpia);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitas');
    XLSX.writeFile(workbook, `Reporte_Visitas_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Censo & Relevamiento</h1>
            <p className="text-sm text-gray-500">Total de visitas registradas: {visitas.length}</p>
          </div>

          <button
            onClick={exportarAExcel}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" /> Exportar a Excel
          </button>
        </div>

        {/* Selector de pestañas */}
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

        {/* Contenido */}
        {tab === 'formulario' ? (
          <FormularioVisita onGuardado={cargarVisitas} />
        ) : (
          <div className="space-y-4">
            <MapaVisitas visitas={visitas} />
          </div>
        )}
      </div>
    </main>
  );
}