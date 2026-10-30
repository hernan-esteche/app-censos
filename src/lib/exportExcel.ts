import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import type { EncuestaCuencaLambareDB } from "@/types";

export async function exportarEncuestasAExcel(
	encuestas: EncuestaCuencaLambareDB[],
) {
	const dataLimpia = await Promise.all(
		encuestas.map(async (encuesta) => {
			let comprobanteUrl = encuesta.comprobante_url || "";
			if (encuesta.comprobante_url) {
				const { data } = await supabase.storage
					.from("comprobantes")
					.createSignedUrl(encuesta.comprobante_url, 3600);
				comprobanteUrl = data?.signedUrl || encuesta.comprobante_url;
			}

			return {
				ID: encuesta.id,
				"Email Encuestador": encuesta.encuestador_email || "Desconocido",
				"Fecha de registro": new Date(encuesta.created_at).toLocaleString(),
				Nombres: encuesta.nombres,
				Apellidos: encuesta.apellidos,
				CI: encuesta.ci,
				Dirección: encuesta.direccion,
				Barrio: encuesta.barrio,
				"Tipo de vivienda": encuesta.tipo_vivienda,
				Teléfono: encuesta.telefono,
				GPS: encuesta.gps,
				Sexo: encuesta.sexo,
				"Franja etaria": encuesta.franja_etaria,
				"En qué trabaja": encuesta.en_que_trabaja,
				"II. Garantiza derecho al agua": encuesta.garantiza_derecho_agua,
				"III. Conoce ley de acceso": encuesta.conoce_ley_acceso,
				"III. Control de recursos públicos": encuesta.control_recursos_publicos,
				"III. Participa en organización": encuesta.participa_organizacion,
				"III. Organización": encuesta.organizacion_cual || "",
				"IV. Conexión a red de agua": encuesta.conexion_red_agua,
				"IV. Frecuencia del servicio": encuesta.frecuencia_servicio,
				"IV. Calidad del agua": encuesta.calidad_agua,
				"V. Eliminación de excretas": encuesta.tipo_eliminacion_excretas,
				"V. Desbordes cloacales": encuesta.desbordes_cloacales_lluvia,
				"VI. Asequibilidad": encuesta.asequibilidad_tarifa,
				"VII. Conoce administrador": encuesta.conoce_administrador_agua,
				"VII. Administrador": encuesta.administrador_cual || "",
				"VIII. Participó en asambleas": encuesta.participo_asambleas,
				"VIII. Motivo de no participación":
					encuesta.motivo_no_participacion || "",
				"VIII. Información por otro medio":
					encuesta.recibio_info_otro_medio || "",
				"IX. Conoce mecanismos de reclamo": encuesta.conoce_mecanismos_reclamos,
				"X. Calificación ESSAP": encuesta.calificacion_essap,
				"XI. Acepta foto en redes": encuesta.acepta_foto_redes ? "Sí" : "No",
				"XI. Acepta contacto posterior": encuesta.acepta_contacto_posterior
					? "Sí"
					: "No",
				"XI. Acepta invitación a actividades":
					encuesta.acepta_invitacion_actividades ? "Sí" : "No",
				"XI. Comentarios y sugerencias": encuesta.comentarios_sugerencias || "",
				"Enlace Comprobante (Imagen)": comprobanteUrl,
			};
		}),
	);

	const worksheet = XLSX.utils.json_to_sheet(dataLimpia);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Visitas");
	XLSX.writeFile(
		workbook,
		`Reporte_Visitas_${new Date().toISOString().slice(0, 10)}.xlsx`,
	);
}
