import type { EncuestaCuencaLambareInsert, EncuestaFormData } from "@/types";

export function mapearParaSupabase(
	data: EncuestaFormData,
	comprobanteUrl: string | null = null,
): Omit<
	EncuestaCuencaLambareInsert,
	"comprobante_url" | "encuestador_email"
> & {
	comprobante_url: string | null;
} {
	return {
		nombres: data.nombres.trim(),
		apellidos: data.apellidos.trim(),
		ci: data.ci.trim(),
		direccion: data.direccion.trim(),
		barrio: data.barrio.trim(),
		tipo_vivienda: data.tipoVivienda || null,
		telefono: data.telefono.trim() || null,
		gps: data.gps.trim(),
		sexo: data.sexo || null,
		franja_etaria: data.franjaEtaria || null,
		en_que_trabaja: data.enQueTrabaja.trim() || null,
		garantiza_derecho_agua: (data.garantizaDerechoAgua || null) as
			| "Sí"
			| "Parcialmente"
			| "No"
			| null,
		conoce_ley_acceso: (data.conoceLeyAcceso || null) as
			| "si"
			| "no"
			| "algo"
			| null,
		control_recursos_publicos: (data.controlRecursosPublicos || null) as
			| "si"
			| "no"
			| "no sabe"
			| null,
		participa_organizacion: data.participaOrganizacion || null,
		organizacion_cual: data.organizacionCual.trim() || null,
		conexion_red_agua: (data.conexionRedAgua || null) as
			| "Sí, red pública"
			| "No"
			| "Otro"
			| null,
		frecuencia_servicio: (data.frecuenciaServicio || null) as
			| "Las 24 horas del día"
			| "Por horas / intermitente"
			| "Solo algunos días de la semana"
			| null,
		calidad_agua: (data.calidadAgua || null) as
			| "Buena"
			| "Regular"
			| "Mala"
			| null,
		tipo_eliminacion_excretas: (data.tipoEliminacionExcretas || null) as
			| "Red pública de alcantarillado"
			| "Cámara séptica con pozo"
			| "Letrina / Pozo ciego"
			| "Sin sistema / Al aire libre"
			| null,
		desbordes_cloacales_lluvia: data.desbordesCloacalesLluvia || null,
		asequibilidad_tarifa: data.asequibilidadTarifa.trim() || null,
		conoce_administrador_agua: data.conoceAdministradorAgua || null,
		administrador_cual: data.administradorCual.trim() || null,
		participo_asambleas: data.participoAsambleas || null,
		motivo_no_participacion: data.motivoNoParticipacion.trim() || null,
		recibio_info_otro_medio: data.recibioInfoOtroMedio.trim() || null,
		conoce_mecanismos_reclamos: data.conoceMecanismosReclamos || null,
		calificacion_essap: (data.calificacionEssap || null) as
			| "Bueno"
			| "Regular"
			| "Deficiente"
			| null,
		acepta_foto_redes: data.aceptaFotoRedes,
		acepta_contacto_posterior: data.aceptaContactoPosterior,
		acepta_invitacion_actividades: data.aceptaInvitacionActividades,
		comentarios_sugerencias: data.comentariosSugerencias.trim() || null,
		comprobante_url: comprobanteUrl,
	};
}
