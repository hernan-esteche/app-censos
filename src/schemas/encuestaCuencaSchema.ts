import { z } from "zod";

const soloLetrasYEspacios = /^[a-zA-Z\sÁÉÍÓÚáéíóúÑñ]+$/;
const soloNumeros = /^\d+$/;

export const encuestaCuencaSchema = z.object({
	nombres: z
		.string()
		.trim()
		.min(3, "Los nombres deben tener al menos 3 caracteres.")
		.regex(soloLetrasYEspacios, "Los nombres solo deben contener letras."),
	apellidos: z
		.string()
		.trim()
		.min(3, "Los apellidos deben tener al menos 3 caracteres.")
		.regex(soloLetrasYEspacios, "Los apellidos solo deben contener letras."),
	ci: z
		.string()
		.trim()
		.min(6, "La cédula debe tener entre 6 y 7 dígitos.")
		.max(7, "La cédula debe tener entre 6 y 7 dígitos.")
		.regex(soloNumeros, "La cédula solo debe contener números."),
	direccion: z.string().trim().default(""),
	barrio: z.string().trim().default(""),
	tipoVivienda: z.enum(["Propia", "Alquilada", "Asentamiento"], {
		error: "Campo obligatorio",
	}),
	telefono: z
		.string()
		.trim()
		.length(10, "El teléfono debe tener exactamente 10 dígitos.")
		.regex(soloNumeros, "El teléfono solo debe contener números."),
	gps: z.string().trim().min(1, "La ubicación GPS es obligatoria."),
	sexo: z.enum(["F", "M"], {
		error: "Campo obligatorio",
	}),
	franjaEtaria: z.enum(["15 a 29", "30 a 44", "45 a 59", "60 o más"], {
		error: "Campo obligatorio",
	}),
	enQueTrabaja: z.string().trim().default(""),
	garantizaDerechoAgua: z.enum(["Sí", "Parcialmente", "No"], {
		error: "Campo obligatorio",
	}),
	conoceLeyAcceso: z.enum(["si", "no", "algo"], {
		error: "Campo obligatorio",
	}),
	controlRecursosPublicos: z.enum(["si", "no", "no sabe"], {
		error: "Campo obligatorio",
	}),
	participaOrganizacion: z.enum(["si", "no"], {
		error: "Campo obligatorio",
	}),
	organizacionCual: z.string().trim().default(""),
	conexionRedAgua: z.enum(["Sí, red pública", "No", "Otro"], {
		error: "Campo obligatorio",
	}),
	frecuenciaServicio: z.enum(
		[
			"Las 24 horas del día",
			"Por horas / intermitente",
			"Solo algunos días de la semana",
		],
		{
			error: "Campo obligatorio",
		},
	),
	calidadAgua: z.enum(["Buena", "Regular", "Mala"], {
		error: "Campo obligatorio",
	}),
	tipoEliminacionExcretas: z.enum(
		[
			"Red pública de alcantarillado",
			"Cámara séptica con pozo",
			"Letrina / Pozo ciego",
			"Sin sistema / Al aire libre",
		],
		{
			error: "Campo obligatorio",
		},
	),
	desbordesCloacalesLluvia: z.enum(["Sí", "No"], {
		error: "Campo obligatorio",
	}),
	asequibilidadTarifa: z.enum(
		[
			"Sí, Es totalmente asequible",
			"Es un gasto difícil de cubrir",
			"No pago tarifa",
			"No cuento con el servicio",
		],
		{
			error: "Campo obligatorio",
		},
	),

	conoceAdministradorAgua: z.enum(["Sí", "No"], {
		error: "Campo obligatorio",
	}),
	administradorCual: z.string().trim().default(""),
	participoAsambleas: z.enum(["Sí", "No"], {
		error: "Campo obligatorio",
	}),
	motivoNoParticipacion: z.enum(
		[
			"No sabía que se hacían",
			"Falta de tiempo",
			"No creo que sirva de mucho",
			"Nunca he sido convocado",
			"No existen espacios de participación",
			"Otros",
		],
		{
			error: "Campo obligatorio",
		},
	),
	recibioInfoOtroMedio: z.enum(
		["Redes Sociales", "Radio", "Televisión", "Vecinos / Comunidad", "Otro"],
		{
			error: "Campo obligatorio",
		},
	),
	conoceMecanismosReclamos: z.enum(["Sí", "No"], {
		error: "Campo obligatorio",
	}),
	calificacionEssap: z.enum(["Bueno", "Regular", "Deficiente"], {
		error: "Campo obligatorio",
	}),
	aceptaFotoRedes: z.boolean(),
	aceptaContactoPosterior: z.boolean(),
	aceptaInvitacionActividades: z.boolean(),
	comentariosSugerencias: z.string().trim().default(""),
});
