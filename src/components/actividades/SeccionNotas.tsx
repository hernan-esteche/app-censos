"use client";

import RadioGroup from "@/components/ui/RadioGroup";
import Section from "@/components/ui/Section";
import TextField from "@/components/ui/TextField";
import type { NotaPresentadaFormData } from "@/types/actividades";

interface SeccionNotasProps {
	formData: NotaPresentadaFormData;
	errores: Record<string, string>;
	actualizarCampo: <K extends keyof NotaPresentadaFormData>(
		campo: K,
		valor: NotaPresentadaFormData[K],
	) => void;
}

export default function SeccionNotas({
	formData,
	errores,
	actualizarCampo,
}: SeccionNotasProps) {
	return (
		<Section title="Datos de la nota presentada">
			<div className="grid gap-4 sm:grid-cols-2">
				<TextField
					label="Fecha"
					type="date"
					value={formData.fecha}
					error={errores.fecha}
					onChange={(value) => actualizarCampo("fecha", value)}
				/>
				<TextField
					label="Destinatario"
					value={formData.destinatario}
					error={errores.destinatario}
					onChange={(value) => actualizarCampo("destinatario", value)}
				/>
				<TextField
					label="Número de mesa de entrada"
					value={formData.mesa_entrada_numero}
					error={errores.mesa_entrada_numero}
					onChange={(value) => actualizarCampo("mesa_entrada_numero", value)}
				/>
				<TextField
					label="Fecha de mesa de entrada"
					type="date"
					value={formData.mesa_entrada_fecha}
					error={errores.mesa_entrada_fecha}
					onChange={(value) => actualizarCampo("mesa_entrada_fecha", value)}
				/>
			</div>
			<RadioGroup
				label="Medio de envío"
				value={formData.medio_envio}
				options={["Nota", "Mail", "WhatsApp"]}
				error={errores.medio_envio}
				onChange={(value) =>
					actualizarCampo(
						"medio_envio",
						value as NotaPresentadaFormData["medio_envio"],
					)
				}
			/>
			<TextField
				label="Tema"
				value={formData.tema}
				error={errores.tema}
				onChange={(value) => actualizarCampo("tema", value)}
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
