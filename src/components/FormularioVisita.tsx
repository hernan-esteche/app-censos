"use client";

import domtoimage from "dom-to-image-more";
import {
	AlertCircle,
	CheckCircle2,
	Loader2,
	Send,
	UserCheck,
} from "lucide-react";
import { useEffect, useRef } from "react";
import type SignatureCanvas from "react-signature-canvas";
import ConsentimientoYFirma from "@/components/encuesta/ConsentimientoYFirma";
import CuestionarioServicios from "@/components/encuesta/CuestionarioServicios";
import DatosGenerales from "@/components/encuesta/DatosGenerales";
import { useEncuestaForm } from "@/hooks/useEncuestaForm";
import { useGeolocation } from "@/hooks/useGeolocation";
import { mapearParaSupabase } from "@/lib/mapeadores";
import { guardarEncuestaSupabase } from "@/services/encuestaService";

export default function FormularioVisita({
	onGuardado,
}: {
	onGuardado?: () => void;
}) {
	const {
		formData,
		errores,
		mensaje,
		loading,
		actualizarCampo,
		validarFormulario,
		setMensaje,
		setLoading,
		resetForm,
	} = useEncuestaForm();
	const firmaComprobanteRef = useRef<HTMLDivElement>(null);
	const firmaRef = useRef<SignatureCanvas | null>(null);
	const {
		gps,
		gpsAccuracy,
		loadingGps,
		capturarUbicacion,
		errorGps,
		limpiarGpsAccuracy,
	} = useGeolocation();

	useEffect(() => {
		if (gps) {
			actualizarCampo("gps", gps);
		}
	}, [actualizarCampo, gps]);

	useEffect(() => {
		if (errorGps) {
			setMensaje({ tipo: "error", texto: errorGps });
		}
	}, [errorGps, setMensaje]);

	const generarComprobante = async (): Promise<Blob> => {
		const recuadro = firmaComprobanteRef.current;
		if (!recuadro) {
			throw new Error("No se pudo preparar el comprobante de firma.");
		}

		const blob = await domtoimage.toBlob(recuadro, {
			bgcolor: "#ffffff",
			cacheBust: true,
		});
		if (!blob) {
			throw new Error("No se pudo generar la imagen del comprobante.");
		}
		return blob;
	};

	const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault();
		setMensaje(null);

		if (!validarFormulario()) {
			return;
		}

		const signature = firmaRef.current;
		if (!signature || signature.isEmpty()) {
			setMensaje({
				tipo: "error",
				texto: "La firma del ciudadano es obligatoria.",
			});
			return;
		}

		setLoading(true);
		try {
			const comprobante = await generarComprobante();
			const payload = mapearParaSupabase(formData);
			await guardarEncuestaSupabase(payload, comprobante);

			setMensaje({
				tipo: "success",
				texto: "Encuesta guardada correctamente. El comprobante fue generado.",
			});
			resetForm();
			firmaRef.current?.clear();
			limpiarGpsAccuracy();
			capturarUbicacion();
			onGuardado?.();
		} catch (error) {
			setMensaje({
				tipo: "error",
				texto:
					error instanceof Error
						? error.message
						: "No se pudo guardar la encuesta.",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-4xl rounded-3xl bg-linear-to-br from-slate-100 via-blue-50/70 to-indigo-100/60 p-3 sm:p-5">
			<form onSubmit={handleSubmit} className="space-y-5">
				<header className="rounded-2xl border border-white/80 bg-white/90 p-5 shadow-xl shadow-slate-200/40 backdrop-blur-md sm:p-7">
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-tr from-blue-100 to-indigo-50 text-blue-600">
							<UserCheck className="h-6 w-6" />
						</div>
						<div>
							<h1 className="text-xl font-black text-slate-900 sm:text-2xl">
								Encuesta Proyecto Cuenca Lambaré
							</h1>
							<p className="text-sm text-slate-500">
								Formulario de registro de datos de visitas
							</p>
						</div>
					</div>
				</header>

				<DatosGenerales
					formData={formData}
					errores={errores}
					actualizarCampo={actualizarCampo}
					gpsAccuracy={gpsAccuracy}
					loadingGps={loadingGps}
					capturarUbicacion={capturarUbicacion}
					limpiarGpsAccuracy={limpiarGpsAccuracy}
				/>
				<CuestionarioServicios
					formData={formData}
					errores={errores}
					actualizarCampo={actualizarCampo}
				/>

				<div ref={firmaComprobanteRef}>
					<ConsentimientoYFirma
						formData={formData}
						actualizarCampo={actualizarCampo}
						firmaRef={firmaRef}
					/>
				</div>

				{mensaje && (
					<div
						className={`flex items-center gap-2 rounded-xl border p-4 text-sm font-semibold ${mensaje.tipo === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}
					>
						{mensaje.tipo === "success" ? (
							<CheckCircle2 className="h-5 w-5 text-emerald-600" />
						) : (
							<AlertCircle className="h-5 w-5 text-rose-600" />
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
						<Loader2 className="h-5 w-5 animate-spin" />
					) : (
						<Send className="h-5 w-5" />
					)}
					{loading
						? "Guardando comprobante..."
						: "Guardar encuesta y comprobante"}
				</button>
			</form>
		</div>
	);
}
