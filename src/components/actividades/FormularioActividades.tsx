"use client";

import {
	AlertCircle,
	CheckCircle2,
	ClipboardList,
	Loader2,
	Send,
} from "lucide-react";
import { useState } from "react";
import SeccionNotas from "@/components/actividades/SeccionNotas";
import SeccionOtrasActividades from "@/components/actividades/SeccionOtrasActividades";
import SeccionReuniones from "@/components/actividades/SeccionReuniones";
import { useActividadesForm } from "@/hooks/useActividadesForm";
import type { TipoActividad } from "@/types/actividades";

const tabs: { value: TipoActividad; label: string }[] = [
	{ value: "reunion", label: "Reunión" },
	{ value: "nota", label: "Nota presentada" },
	{ value: "otra", label: "Otras actividades" },
];

export default function FormularioActividades() {
	const [tipo, setTipo] = useState<TipoActividad>("reunion");
	const {
		reunion,
		nota,
		otra,
		errores,
		mensaje,
		loading,
		actualizarReunion,
		actualizarNota,
		actualizarOtra,
		actualizarElemento,
		actualizarParticipanteOtra,
		agregarElemento,
		eliminarElemento,
		agregarParticipanteOtra,
		eliminarParticipanteOtra,
		enviar,
	} = useActividadesForm();

	return (
		<div className="max-w-4xl p-3 mx-auto rounded-3xl bg-linear-to-br from-slate-100 via-blue-50/70 to-indigo-100/60 sm:p-5">
			<form
				onSubmit={(event) => {
					event.preventDefault();
					void enviar(tipo);
				}}
				className="space-y-5"
			>
				<header className="p-5 border shadow-xl rounded-2xl border-white/80 bg-white/90 shadow-slate-200/40 backdrop-blur-md sm:p-7">
					<div className="flex items-center gap-3">
						<div className="flex items-center justify-center text-blue-600 h-11 w-11 rounded-xl bg-linear-to-tr from-blue-100 to-indigo-50">
							<ClipboardList className="w-6 h-6" />
						</div>
						<div>
							<h1 className="text-xl font-black text-slate-900 sm:text-2xl">
								Registro de Actividades
							</h1>
							<p className="text-sm text-slate-500">
								Cargá reuniones, notas y otras actividades.
							</p>
						</div>
					</div>
				</header>

				<div className="grid gap-2 rounded-2xl border border-slate-200/80 bg-white/80 p-2 sm:grid-cols-3">
					{tabs.map((tabOption) => (
						<button
							key={tabOption.value}
							type="button"
							onClick={() => setTipo(tabOption.value)}
							className={`min-h-11 rounded-xl px-3 py-2 text-sm font-bold transition ${
								tipo === tabOption.value
									? "bg-indigo-600 text-white shadow-md"
									: "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
							}`}
						>
							{tabOption.label}
						</button>
					))}
				</div>

				{tipo === "reunion" && (
					<SeccionReuniones
						formData={reunion}
						errores={errores}
						actualizarCampo={actualizarReunion}
						actualizarElemento={actualizarElemento}
						agregarElemento={agregarElemento}
						eliminarElemento={eliminarElemento}
					/>
				)}
				{tipo === "nota" && (
					<SeccionNotas
						formData={nota}
						errores={errores}
						actualizarCampo={actualizarNota}
					/>
				)}
				{tipo === "otra" && (
					<SeccionOtrasActividades
						formData={otra}
						errores={errores}
						actualizarCampo={actualizarOtra}
						actualizarParticipante={actualizarParticipanteOtra}
						agregarParticipante={agregarParticipanteOtra}
						eliminarParticipante={eliminarParticipanteOtra}
					/>
				)}

				{mensaje && (
					<div
						className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-semibold ${
							mensaje.tipo === "success"
								? "border-emerald-200 bg-emerald-50 text-emerald-800"
								: "border-rose-200 bg-rose-50 text-rose-800"
						}`}
					>
						{mensaje.tipo === "success" ? (
							<CheckCircle2 className="w-5 h-5 text-emerald-600" />
						) : (
							<AlertCircle className="w-5 h-5 text-rose-600" />
						)}
						<span>{mensaje.texto}</span>
					</div>
				)}

				<button
					type="submit"
					disabled={loading}
					className="flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{loading ? (
						<Loader2 className="w-5 h-5 animate-spin" />
					) : (
						<Send className="w-5 h-5" />
					)}
					{loading ? "Guardando..." : "Guardar registro"}
				</button>
			</form>
		</div>
	);
}
