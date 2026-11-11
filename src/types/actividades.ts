export type MedioEnvio = "Nota" | "Mail" | "whatsapp";

export interface Reunion {
	id: string;
	created_at: string;
	user_id: string;
	fecha: string;
	participantes: string[];
	orden_del_dia: string[];
	resoluciones: string[];
	observaciones: string | null;
}

export interface NotaPresentada {
	id: string;
	created_at: string;
	user_id: string;
	fecha: string;
	destinatario: string;
	medio_envio: MedioEnvio;
	mesa_entrada_numero: string;
	mesa_entrada_fecha: string | null;
	tema: string;
	observaciones: string | null;
}

export interface OtraActividad {
	id: string;
	created_at: string;
	user_id: string;
	fecha: string;
	participantes: string[];
	resumen: string;
	observaciones: string | null;
}

export type ReunionInsert = Omit<Reunion, "id" | "created_at" | "user_id">;
export type NotaPresentadaInsert = Omit<
	NotaPresentada,
	"id" | "created_at" | "user_id"
>;
export type OtraActividadInsert = Omit<
	OtraActividad,
	"id" | "created_at" | "user_id"
>;

export interface ReunionFormData {
	fecha: string;
	participantes: string[];
	orden_del_dia: string[];
	resoluciones: string[];
	observaciones: string;
}

export interface NotaPresentadaFormData {
	fecha: string;
	destinatario: string;
	medio_envio: MedioEnvio | "";
	mesa_entrada_numero: string;
	mesa_entrada_fecha: string;
	tema: string;
	observaciones: string;
}

export interface OtraActividadFormData {
	fecha: string;
	participantes: string[];
	resumen: string;
	observaciones: string;
}

export type TipoActividad = "reunion" | "nota" | "otra";
