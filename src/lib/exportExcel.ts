import * as XLSX from 'xlsx';
import { Visita } from '@/types';

export function exportarVisitasAExcel(visitas: Visita[]) {
  const dataLimpia = visitas.map((v) => ({
    ID: v.id,
    Nombre: v.nombre,
    Documento: v.documento,
    Teléfono: v.telefono || '—',
    Dirección: v.direccion || '—',
    Latitud: v.latitud,
    Longitud: v.longitud,
    Observaciones: v.observaciones || '',
    Encuestador: v.encuestador,
    Fecha: new Date(v.created_at).toLocaleString(),
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataLimpia);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitas');
  XLSX.writeFile(workbook, `Reporte_Visitas_${new Date().toISOString().slice(0, 10)}.xlsx`);
}