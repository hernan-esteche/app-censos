import * as XLSX from "xlsx";
import { supabase } from "@/lib/supabase";
import type { EncuestaCuencaLambareDB } from "@/types";
import type {
	NotaPresentada,
	OtraActividad,
	Reunion,
} from "@/types/actividades";

export async function exportarEncuestasAExcel(
	encuestas: EncuestaCuencaLambareDB[],
) {
	const [reunionesResult, notasResult, otrasResult] = await Promise.all([
		supabase
			.from("reuniones")
			.select("*")
			.order("created_at", { ascending: false }),
		supabase
			.from("notas_presentadas")
			.select("*")
			.order("created_at", { ascending: false }),
		supabase
			.from("otras_actividades")
			.select("*")
			.order("created_at", { ascending: false }),
	]);

	if (reunionesResult.error) {
		throw new Error("No se pudieron cargar las reuniones.", {
			cause: reunionesResult.error,
		});
	}
	if (notasResult.error) {
		throw new Error("No se pudieron cargar las notas presentadas.", {
			cause: notasResult.error,
		});
	}
	if (otrasResult.error) {
		throw new Error("No se pudieron cargar las otras actividades.", {
			cause: otrasResult.error,
		});
	}

	// 1. Extraer solo las rutas de las imágenes que existen
	const paths = encuestas
		.map((e) => e.comprobante_url)
		.filter((url): url is string => Boolean(url));

	// 2. Pedir TODAS las firmas en un solo llamado a Supabase (muy rápido)
	const signedUrlsMap: Record<string, string> = {};

	if (paths.length > 0) {
		const { data } = await supabase.storage
			.from("comprobantes")
			.createSignedUrls(paths, 3600); // 1 hora de validez

		if (data) {
			// Crear un diccionario para buscar la url firmada rápidamente por su ruta original
			data.forEach((item) => {
				if (!item.error && item.signedUrl && item.path) {
					signedUrlsMap[item.path] = item.signedUrl;
				}
			});
		}
	}

	// 3. Mapear los datos para el Excel de forma 100% síncrona
	const dataLimpia = encuestas.map((encuesta) => {
		// Buscar en el diccionario la URL firmada, o dejar vacío
		const comprobanteUrl = encuesta.comprobante_url
			? signedUrlsMap[encuesta.comprobante_url] || ""
			: "";

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
			"Garantiza derecho al agua": encuesta.garantiza_derecho_agua,
			"Conoce ley de acceso": encuesta.conoce_ley_acceso,
			"Control de recursos públicos": encuesta.control_recursos_publicos,
			"Participa en organización": encuesta.participa_organizacion,
			Organización: encuesta.organizacion_cual || "",
			"Conexión a red de agua": encuesta.conexion_red_agua,
			"Frecuencia del servicio": encuesta.frecuencia_servicio,
			"Calidad del agua": encuesta.calidad_agua,
			"Eliminación de excretas": encuesta.tipo_eliminacion_excretas,
			"Desbordes cloacales": encuesta.desbordes_cloacales_lluvia,
			Asequibilidad: encuesta.asequibilidad_tarifa,
			"Conoce administrador": encuesta.conoce_administrador_agua,
			Administrador: encuesta.administrador_cual || "",
			"Participó en asambleas": encuesta.participo_asambleas,
			"Motivo de no participación": encuesta.motivo_no_participacion || "",
			"Información por otro medio": encuesta.recibio_info_otro_medio || "",
			"Conoce mecanismos de reclamo": encuesta.conoce_mecanismos_reclamos,
			"Calificación ESSAP": encuesta.calificacion_essap,
			"Acepta foto en redes": encuesta.acepta_foto_redes ? "Sí" : "No",
			"Acepta contacto posterior": encuesta.acepta_contacto_posterior
				? "Sí"
				: "No",
			"Acepta invitación a actividades": encuesta.acepta_invitacion_actividades
				? "Sí"
				: "No",
			"Comentarios y sugerencias": encuesta.comentarios_sugerencias || "",
			"Comprobante tempporal (Imagen)": comprobanteUrl,
		};
	});

	const worksheet = XLSX.utils.json_to_sheet(dataLimpia);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Visitas");
	const reuniones = (reunionesResult.data as Reunion[]).map((reunion) => ({
		ID: reunion.id,
		"Fecha de registro": new Date(reunion.created_at).toLocaleString(),
		Fecha: reunion.fecha,
		Participantes: reunion.participantes.join("\n"),
		"Orden del día": reunion.orden_del_dia.join("\n"),
		Resoluciones: reunion.resoluciones.join("\n"),
		Observaciones: reunion.observaciones || "",
	}));
	const notas = (notasResult.data as NotaPresentada[]).map((nota) => ({
		ID: nota.id,
		"Fecha de registro": new Date(nota.created_at).toLocaleString(),
		Fecha: nota.fecha,
		Destinatario: nota.destinatario,
		"Medio de envío": nota.medio_envio,
		"Número de mesa de entrada": nota.mesa_entrada_numero,
		"Fecha de mesa de entrada": nota.mesa_entrada_fecha || "",
		Tema: nota.tema,
		Observaciones: nota.observaciones || "",
	}));
	const otrasActividades = (otrasResult.data as OtraActividad[]).map(
		(actividad) => ({
			ID: actividad.id,
			"Fecha de registro": new Date(actividad.created_at).toLocaleString(),
			Fecha: actividad.fecha,
			Participantes: actividad.participantes.join("\n"),
			Resumen: actividad.resumen,
			Observaciones: actividad.observaciones || "",
		}),
	);
	XLSX.utils.book_append_sheet(
		workbook,
		XLSX.utils.json_to_sheet(reuniones),
		"Reuniones",
	);
	XLSX.utils.book_append_sheet(
		workbook,
		XLSX.utils.json_to_sheet(notas),
		"Notas presentadas",
	);
	XLSX.utils.book_append_sheet(
		workbook,
		XLSX.utils.json_to_sheet(otrasActividades),
		"Otras actividades",
	);
	XLSX.writeFile(
		workbook,
		`Reporte_Visitas_${new Date().toISOString().slice(0, 10)}.xlsx`,
	);
}
