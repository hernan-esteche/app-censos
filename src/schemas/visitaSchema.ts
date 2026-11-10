// import { z } from "zod";

// const soloLetrasYEspacios = /^[a-zA-Z\sÁÉÍÓÚáéíóúÑñ]+$/;
// const soloNumeros = /^\d+$/;

// export const visitaSchema = z.object({
// 	nombre: z
// 		.string()
// 		.trim()
// 		.min(3, "El nombre debe tener al menos 3 caracteres.")
// 		.regex(
// 			soloLetrasYEspacios,
// 			"El nombre solo debe contener letras y espacios.",
// 		),
// 	apellido: z
// 		.string()
// 		.trim()
// 		.min(3, "El apellido debe tener al menos 3 caracteres.")
// 		.regex(
// 			soloLetrasYEspacios,
// 			"El apellido solo debe contener letras y espacios.",
// 		),
// 	documento: z
// 		.string()
// 		.trim()
// 		.min(6, "La cédula debe tener entre 6 y 7 dígitos.")
// 		.max(7, "La cédula debe tener entre 6 y 7 dígitos.")
// 		.regex(soloNumeros, "La cédula solo debe contener dígitos numéricos."),
// 	telefono: z
// 		.string()
// 		.trim()
// 		.length(10, "El teléfono debe contener exactamente 10 dígitos numéricos.")
// 		.regex(soloNumeros, "El teléfono debe contener solo dígitos numéricos."),
// 	observaciones: z.string().trim().default(""),
// 	encuestador: z
// 		.string()
// 		.trim()
// 		.min(1, "El nombre del encuestador es obligatorio."),
// 	latitud: z.number().nullable().optional(),
// 	longitud: z.number().nullable().optional(),
// 	precision_gps: z.number().nullable().optional(),
// });

// export type VisitaFormData = z.infer<typeof visitaSchema>;
