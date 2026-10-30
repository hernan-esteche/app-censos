import { Check } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import Section from "@/components/ui/Section";
import TextField from "@/components/ui/TextField";
import type { ConsentimientoYFirmaProps } from "@/types/formularioVisita";

export default function ConsentimientoYFirma({
	formData,
	actualizarCampo,
	firmaRef,
}: ConsentimientoYFirmaProps) {
	return (
		<Section number="XI" title="Consentimiento y comentarios">
			<div className="space-y-3">
				{(
					[
						[
							"aceptaFotoRedes",
							"Aceptaría que su foto sea publicada en redes sociales",
						],
						[
							"aceptaContactoPosterior",
							"Aceptaría ser contactado posteriormente",
						],
						[
							"aceptaInvitacionActividades",
							"Aceptaría invitaciones a actividades",
						],
					] as const
				).map(([field, label]) => (
					<button
						type="button"
						key={field}
						aria-pressed={formData[field]}
						onClick={() => actualizarCampo(field, !formData[field])}
						className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold text-slate-700"
					>
						<span
							className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${formData[field] ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"}`}
							aria-hidden="true"
						>
							{formData[field] && <Check className="h-4 w-4 text-white" />}
						</span>
						{label}
					</button>
				))}
			</div>
			<TextField
				label="Comentarios o sugerencias"
				value={formData.comentariosSugerencias}
				placeholder="Escriba cualquier comentario o sugerencia adicional..."
				onChange={(value) => actualizarCampo("comentariosSugerencias", value)}
				multiline
			/>
			<div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
				<div>
					<h3 className="font-bold text-slate-800">Firma del ciudadano</h3>
					<p className="text-xs text-slate-500">Firme dentro del recuadro.</p>
				</div>
				<div className="overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white">
					<SignatureCanvas
						ref={firmaRef}
						penColor="#0f172a"
						canvasProps={{ className: "h-40 w-full touch-none" }}
					/>
				</div>
				<button
					type="button"
					onClick={() => firmaRef.current?.clear()}
					className="min-h-11 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
				>
					Limpiar firma
				</button>
				<div className="grid gap-3 border-t border-slate-100 pt-3 text-sm text-slate-700 sm:grid-cols-2">
					<p>
						<span className="font-bold">Nombre:</span> {formData.nombres}{" "}
						{formData.apellidos}
					</p>
					<p>
						<span className="font-bold">C.I.:</span> {formData.ci}
					</p>
				</div>
			</div>
		</Section>
	);
}
