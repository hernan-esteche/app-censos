"use client";

import { Plus, Trash2 } from "lucide-react";
import Section from "@/components/ui/Section";
import TextField from "@/components/ui/TextField";
import type { OtraActividadFormData } from "@/types/actividades";

interface SeccionOtrasActividadesProps {
	formData: OtraActividadFormData;
	errores: Record<string, string>;
	actualizarCampo: <K extends keyof OtraActividadFormData>(
		campo: K,
		valor: OtraActividadFormData[K],
	) => void;
	actualizarParticipante: (indice: number, valor: string) => void;
	agregarParticipante: () => void;
	eliminarParticipante: (indice: number) => void;
}

export default function SeccionOtrasActividades({
	formData,
	errores,
	actualizarCampo,
	actualizarParticipante,
	agregarParticipante,
	eliminarParticipante,
}: SeccionOtrasActividadesProps) {
	return (
		<Section title="Datos de la actividad">
			<TextField
				label="Fecha"
				type="date"
				value={formData.fecha}
				error={errores.fecha}
				onChange={(value) => actualizarCampo("fecha", value)}
			/>
			<div className="space-y-2">
				<div className="flex items-center justify-between gap-3">
					<h3 className="text-sm font-bold text-slate-700">Participantes</h3>
					<button
						type="button"
						onClick={agregarParticipante}
						className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
					>
						<Plus className="w-4 h-4" />
						Agregar participante
					</button>
				</div>
				{formData.participantes.map((participante, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: La lista se edita por índice y los elementos no tienen identificador persistente.
					<div key={`participante-${index}`} className="flex items-start gap-2">
						<div className="flex-1 min-w-0">
							<TextField
								label={`Participante ${index + 1}`}
								value={participante}
								error={index === 0 ? errores.participantes : undefined}
								onChange={(value) => actualizarParticipante(index, value)}
							/>
						</div>
						<button
							type="button"
							onClick={() => eliminarParticipante(index)}
							className="inline-flex items-center justify-center transition border mt-7 min-h-11 min-w-11 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
							aria-label={`Eliminar participante ${index + 1}`}
						>
							<Trash2 className="w-4 h-4" />
						</button>
					</div>
				))}
			</div>
			<TextField
				label="Resumen"
				value={formData.resumen}
				error={errores.resumen}
				multiline
				onChange={(value) => actualizarCampo("resumen", value)}
			/>
			<TextField
				label="Observaciones"
				value={formData.observaciones}
				error={errores.observaciones}
				multiline
				onChange={(value) => actualizarCampo("observaciones", value)}
			/>
		</Section>
	);
}
