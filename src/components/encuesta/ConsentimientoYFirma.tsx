import { Check, Eraser } from "lucide-react"; // <-- Importamos Eraser
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
						className="flex items-center gap-3 p-3 text-sm font-semibold border cursor-pointer min-h-12 rounded-xl border-slate-200 text-slate-700"
					>
						<span
							className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${formData[field] ? "border-indigo-600 bg-indigo-600" : "border-slate-300 bg-white"}`}
							aria-hidden="true"
						>
							{formData[field] && <Check className="w-4 h-4 text-white" />}
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
			<div className="p-4 space-y-4 bg-white border shadow-sm rounded-xl border-slate-200">
				<div>
					<h3 className="font-bold text-slate-800">Firma del ciudadano</h3>
					<p className="text-xs text-slate-500">Firme dentro del recuadro.</p>
				</div>

				{/* Agregamos relative al contenedor del canvas */}
				<div className="relative overflow-hidden bg-white border border-dashed rounded-lg border-slate-300">
					<SignatureCanvas
						ref={firmaRef}
						penColor="#0f172a"
						minWidth={1.5}
						maxWidth={3.5}
						velocityFilterWeight={0.7}
						clearOnResize={false}
						canvasProps={{ className: "h-40 w-full touch-none select-none" }}
					/>

					{/* Botón flotante posicionado en la esquina inferior derecha */}
					<button
						type="button"
						onClick={() => firmaRef.current?.clear()}
						aria-label="Limpiar firma"
						title="Limpiar firma"
						className="absolute bottom-0 right-0 z-10 flex items-center justify-center w-8 h-8 transition-colors border rounded-lg shadow-sm border-slate-200 bg-white/90 text-slate-500 backdrop-blur-sm hover:border-red-200 hover:bg-red-50 hover:text-red-600"
					>
						<Eraser className="w-5 h-5" strokeWidth={2} />
					</button>
				</div>

				<div className="grid gap-3 pt-3 text-sm border-t border-slate-100 text-slate-700 sm:grid-cols-2">
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
