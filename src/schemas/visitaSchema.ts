import { z } from 'zod';

export const visitaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, 'El nombre es obligatorio.')
    .min(3, 'El nombre debe tener al menos 3 caracteres.'),
  documento: z
    .string()
    .trim()
    .min(1, 'El número de cédula es obligatorio.')
    .regex(/^\d+$/, 'La cédula solo debe contener dígitos numéricos.')
    .min(6, 'La cédula debe tener entre 6 y 7 dígitos.')
    .max(7, 'La cédula debe tener entre 6 y 7 dígitos.'),
  telefono: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || (/^\d+$/.test(val) && val.length === 10),
      { message: 'El teléfono debe contener exactamente 10 dígitos numéricos.' }
    ),
  direccion: z
    .string()
    .trim()
    .refine(
      (val) => val === '' || val.length >= 5,
      { message: 'La dirección debe tener al menos 5 caracteres si se ingresa.' }
    ),
  observaciones: z.string().optional(),
  encuestador: z.string().min(1, 'El nombre del encuestador es obligatorio.'),
  latitud: z.number().nullable().optional(),
  longitud: z.number().nullable().optional(),
  precision_gps: z.number().nullable().optional(),
});

export type VisitaFormData = z.infer<typeof visitaSchema>;