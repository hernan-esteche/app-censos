"use client";

import { Plus, Trash2 } from "lucide-react";
import Section from "@/components/ui/Section";
import TextField from "@/components/ui/TextField";
import type { ReunionFormData } from "@/types/actividades";

interface SeccionReunionesProps {
	formData: ReunionFormData;
	errores: Record<string, string>;
	actualizarCampo: <K extends keyof ReunionFormData>(
		campo: K,
		valor: ReunionFormData[K],
	) => void;
	actualizarElemento: (
		campo: "participantes" | "orden_del_dia" | "resoluciones",
		indice: number,
		valor: string,
	) => void;
	agregarElemento: (
		campo: "participantes" | "orden_del_dia" | "resoluciones",
	) => void;
	eliminarElemento: (
		campo: "participantes" | "orden_del_dia" | "resoluciones",
		indice: number,
	) => void;
}

function ListaDinamica({
	titulo,
	campo,
	items,
	error,
	actualizarElemento,
	agregarElemento,
	eliminarElemento,
}: {
	titulo: string;
	campo: "participantes" | "orden_del_dia" | "resoluciones";
	items: string[];
	error?: string;
	actualizarElemento: SeccionReunionesProps["actualizarElemento"];
	agregarElemento: SeccionReunionesProps["agregarElemento"];
	eliminarElemento: SeccionReunionesProps["eliminarElemento"];
}) {
	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between gap-3">
				<h3 className="text-sm font-bold text-slate-700">{titulo}</h3>
				<button
					type="button"
					onClick={() => agregarElemento(campo)}
					className="inline-flex min-h-11 items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
				>
					<Plus className="w-4 h-4" />
					Agregar
				</button>
			</div>
			<div className="space-y-2">
				{items.map((item, index) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: La lista se edita por índice y los elementos no tienen identificador persistente.
					<div key={`${campo}-${index}`} className="flex items-start gap-2">
						<div className="flex-1 min-w-0">
							<TextField
								label={`${titulo} ${index + 1}`}
								value={item}
								error={index === 0 ? error : undefined}
								onChange={(value) => actualizarElemento(campo, index, value)}
							/>
						</div>
						<button
							type="button"
							onClick={() => eliminarElemento(campo, index)}
							className="inline-flex items-center justify-center transition border mt-7 min-h-11 min-w-11 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50"
							aria-label={`Eliminar ${titulo.toLowerCase()} ${index + 1}`}
						>
							<Trash2 className="w-4 h-4" />
						</button>
					</div>
				))}
			</div>
		</div>
	);
}

export default function SeccionReuniones({
	formData,
	errores,
	actualizarCampo,
	actualizarElemento,
	agregarElemento,
	eliminarElemento,
}: SeccionReunionesProps) {
	return (
		<Section title="Datos de la reunión">
			<div className="grid gap-4 sm:grid-cols-2">
				<TextField
					label="Fecha"
					type="date"
					value={formData.fecha}
					error={errores.fecha}
					onChange={(value) => actualizarCampo("fecha", value)}
				/>
			</div>
			<ListaDinamica
				titulo="Participante"
				campo="participantes"
				items={formData.participantes}
				error={errores.participantes}
				actualizarElemento={actualizarElemento}
				agregarElemento={agregarElemento}
				eliminarElemento={eliminarElemento}
			/>
			<ListaDinamica
				titulo="Orden del día"
				campo="orden_del_dia"
				items={formData.orden_del_dia}
				error={errores.orden_del_dia}
				actualizarElemento={actualizarElemento}
				agregarElemento={agregarElemento}
				eliminarElemento={eliminarElemento}
			/>
			<ListaDinamica
				titulo="Resolución"
				campo="resoluciones"
				items={formData.resoluciones}
				error={errores.resoluciones}
				actualizarElemento={actualizarElemento}
				agregarElemento={agregarElemento}
				eliminarElemento={eliminarElemento}
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
