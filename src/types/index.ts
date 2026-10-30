export type Rol = "admin" | "encuestador";

export interface UsuarioSesion {
	email: string;
	rol: Rol;
}

export interface LoginCardProps {
	onLoginSuccess: () => void;
}

export type TipoVivienda = "Propia" | "Alquilada" | "Asentamiento";
export type Sexo = "F" | "M";
export type FranjaEtaria = "15 a 29" | "30 a 44" | "45 a 59" | "60 o más";
export type RespuestaSiNo = "Sí" | "No";

export interface EncuestaCuencaLambareDB {
	id: string;
	created_at: string;
	user_id: string;
	nombres: string;
	apellidos: string;
	ci: string;
	direccion: string;
	barrio: string;
	tipo_vivienda: TipoVivienda | null;
	telefono: string | null;
	gps: string;
	sexo: Sexo | null;
	franja_etaria: FranjaEtaria | null;
	en_que_trabaja: string | null;
	garantiza_derecho_agua: "Sí" | "Parcialmente" | "No" | null;
	conoce_ley_acceso: "si" | "no" | "algo" | null;
	control_recursos_publicos: "si" | "no" | "no sabe" | null;
	participa_organizacion: "si" | "no" | null;
	organizacion_cual: string | null;
	conexion_red_agua: "Sí, red pública" | "No" | "Otro" | null;
	frecuencia_servicio:
		| "Las 24 horas del día"
		| "Por horas / intermitente"
		| "Solo algunos días de la semana"
		| null;
	calidad_agua: "Buena" | "Regular" | "Mala" | null;
	tipo_eliminacion_excretas:
		| "Red pública de alcantarillado"
		| "Cámara séptica con pozo"
		| "Letrina / Pozo ciego"
		| "Sin sistema / Al aire libre"
		| null;
	desbordes_cloacales_lluvia: RespuestaSiNo | null;
	asequibilidad_tarifa: string | null;
	conoce_administrador_agua: RespuestaSiNo | null;
	administrador_cual: string | null;
	participo_asambleas: "Sí" | "No" | null;
	motivo_no_participacion: string | null;
	recibio_info_otro_medio: string | null;
	conoce_mecanismos_reclamos: RespuestaSiNo | null;
	calificacion_essap: "Bueno" | "Regular" | "Deficiente" | null;
	acepta_foto_redes: boolean;
	acepta_contacto_posterior: boolean;
	acepta_invitacion_actividades: boolean;
	comentarios_sugerencias: string | null;
	comprobante_url: string | null;
	encuestador_email: string | null;
}

export interface EncuestaFormData {
	nombres: string;
	apellidos: string;
	ci: string;
	direccion: string;
	barrio: string;
	tipoVivienda: TipoVivienda | "";
	telefono: string;
	gps: string;
	sexo: Sexo | "";
	franjaEtaria: FranjaEtaria | "";
	enQueTrabaja: string;
	garantizaDerechoAgua: "Sí" | "Parcialmente" | "No" | "";
	conoceLeyAcceso: "si" | "no" | "algo" | "";
	controlRecursosPublicos: "si" | "no" | "no sabe" | "";
	participaOrganizacion: "si" | "no" | "";
	organizacionCual: string;
	conexionRedAgua: "Sí, red pública" | "No" | "Otro" | "";
	frecuenciaServicio:
		| "Las 24 horas del día"
		| "Por horas / intermitente"
		| "Solo algunos días de la semana"
		| "";
	calidadAgua: "Buena" | "Regular" | "Mala" | "";
	tipoEliminacionExcretas:
		| "Red pública de alcantarillado"
		| "Cámara séptica con pozo"
		| "Letrina / Pozo ciego"
		| "Sin sistema / Al aire libre"
		| "";
	desbordesCloacalesLluvia: "Sí" | "No" | "";
	asequibilidadTarifa: string;
	conoceAdministradorAgua: "Sí" | "No" | "";
	administradorCual: string;
	participoAsambleas: "Sí" | "No" | "";
	motivoNoParticipacion:
		| "No sabía que se hacían"
		| "Falta de tiempo"
		| "No creo que sirva de mucho"
		| "Nunca he sido convocado"
		| "No existen espacios de participación"
		| "Otros"
		| "";
	recibioInfoOtroMedio:
		| "Redes Sociales"
		| "Radio"
		| "Televisión"
		| "Vecinos / Comunidad"
		| "Otro"
		| "";
	conoceMecanismosReclamos: "Sí" | "No" | "";
	calificacionEssap: "Bueno" | "Regular" | "Deficiente" | "";
	aceptaFotoRedes: boolean;
	aceptaContactoPosterior: boolean;
	aceptaInvitacionActividades: boolean;
	comentariosSugerencias: string;
}

export type EncuestaCuencaLambareInsert = Omit<
	EncuestaCuencaLambareDB,
	"id" | "created_at" | "user_id"
>;
