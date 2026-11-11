import { supabase } from "@/lib/supabase";
import type {
	NotaPresentadaInsert,
	OtraActividadInsert,
	ReunionInsert,
} from "@/types/actividades";

async function obtenerUsuarioId(): Promise<string> {
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser();

	if (error || !user) {
		throw new Error("No se pudo identificar al usuario autenticado.", {
			cause: error,
		});
	}

	return user.id;
}

export async function guardarReunion(payload: ReunionInsert): Promise<void> {
	const userId = await obtenerUsuarioId();
	const { error } = await supabase
		.from("reuniones")
		.insert({ ...payload, user_id: userId });

	if (error) {
		throw new Error("No se pudo guardar la reunión.", { cause: error });
	}
}

export async function guardarNotaPresentada(
	payload: NotaPresentadaInsert,
): Promise<void> {
	const userId = await obtenerUsuarioId();
	const { error } = await supabase
		.from("notas_presentadas")
		.insert({ ...payload, user_id: userId });

	if (error) {
		throw new Error("No se pudo guardar la nota presentada.", { cause: error });
	}
}

export async function guardarOtraActividad(
	payload: OtraActividadInsert,
): Promise<void> {
	const userId = await obtenerUsuarioId();
	const { error } = await supabase
		.from("otras_actividades")
		.insert({ ...payload, user_id: userId });

	if (error) {
		throw new Error("No se pudo guardar la actividad.", { cause: error });
	}
}
