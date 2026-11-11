import { z } from "zod";

const fechaSchema = z.string().min(1, "La fecha es obligatoria.");
const listaTextoSchema = z
	.array(z.string().trim().min(1, "El campo no puede estar vacío."))
	.min(1, "Agregá al menos un elemento.");

export const reunionSchema = z.object({
	fecha: fechaSchema,
	participantes: listaTextoSchema,
	orden_del_dia: listaTextoSchema,
	resoluciones: listaTextoSchema,
	observaciones: z.string().trim(),
});

export const notaPresentadaSchema = z.object({
	fecha: fechaSchema,
	destinatario: z.string().trim().min(1, "El destinatario es obligatorio."),
	medio_envio: z.enum(["Nota", "Mail", "whatsapp"], {
		error: "Seleccioná un medio de envío.",
	}),
	mesa_entrada_numero: z
		.string()
		.trim()
		.min(1, "El número de mesa de entrada es obligatorio."),
	mesa_entrada_fecha: fechaSchema,
	tema: z.string().trim().min(1, "El tema es obligatorio."),
	observaciones: z.string().trim(),
});

export const otraActividadSchema = z.object({
	fecha: fechaSchema,
	participantes: listaTextoSchema,
	resumen: z.string().trim().min(1, "El resumen es obligatorio."),
	observaciones: z.string().trim(),
});
