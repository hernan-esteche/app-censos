// import { supabase } from "@/lib/supabase";
// import type { EncuestaCuencaLambareInsert } from "@/types";

// const STORAGE_BUCKET = "comprobantes";
// const ENCUESTA_TABLE = "encuesta_cuenca_lambare";

// export async function guardarEncuestaSupabase(
// 	payload: EncuestaCuencaLambareInsert,
// 	comprobanteBlob: Blob,
// ): Promise<void> {
// 	const {
// 		data: { user },
// 		error: userError,
// 	} = await supabase.auth.getUser();

// 	if (userError || !user) {
// 		throw new Error("No se pudo identificar al usuario autenticado.");
// 	}

// 	const { data: encuesta, error: insertError } = await supabase
// 		.from(ENCUESTA_TABLE)
// 		.insert({ ...payload, comprobante_url: null })
// 		.select("id")
// 		.single();

// 	if (insertError || !encuesta) {
// 		throw new Error("No se pudo guardar la encuesta.", {
// 			cause: insertError,
// 		});
// 	}

// 	const archivoPath = `${user.id}/${crypto.randomUUID()}.png`;
// 	const { error: uploadError } = await supabase.storage
// 		.from(STORAGE_BUCKET)
// 		.upload(archivoPath, comprobanteBlob, {
// 			contentType: "image/png",
// 			upsert: false,
// 		});

// 	if (uploadError) {
// 		const { error: deleteError } = await supabase
// 			.from(ENCUESTA_TABLE)
// 			.delete()
// 			.eq("id", encuesta.id);

// 		if (deleteError) {
// 			throw new Error(
// 				"No se pudo subir el comprobante ni eliminar la encuesta creada.",
// 				{ cause: deleteError },
// 			);
// 		}

// 		throw new Error("No se pudo subir el comprobante de firma.", {
// 			cause: uploadError,
// 		});
// 	}

// 	const { error: updateError } = await supabase
// 		.from(ENCUESTA_TABLE)
// 		.update({ comprobante_url: archivoPath })
// 		.eq("id", encuesta.id);

// 	if (!updateError) {
// 		return;
// 	}

// 	const { error: removeError } = await supabase.storage
// 		.from(STORAGE_BUCKET)
// 		.remove([archivoPath]);
// 	const { error: deleteError } = await supabase
// 		.from(ENCUESTA_TABLE)
// 		.delete()
// 		.eq("id", encuesta.id);

// 	if (removeError || deleteError) {
// 		throw new Error(
// 			"No se pudo actualizar la encuesta ni limpiar los recursos creados.",
// 			{ cause: removeError ?? deleteError },
// 		);
// 	}

// 	throw new Error("No se pudo asociar el comprobante a la encuesta.", {
// 		cause: updateError,
// 	});
// }

import { supabase } from "@/lib/supabase";
import type { EncuestaCuencaLambareInsert } from "@/types";

const STORAGE_BUCKET = "comprobantes";
const ENCUESTA_TABLE = "encuesta_cuenca_lambare";

export async function guardarEncuestaSupabase(
	payload: Omit<EncuestaCuencaLambareInsert, "encuestador_email">,
	comprobanteBlob: Blob,
): Promise<void> {
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError || !user) {
		throw new Error("No se pudo identificar al usuario autenticado.");
	}

	// 1. Pre-generamos la ruta de la imagen
	const archivoPath = `${user.id}/${crypto.randomUUID()}.png`;

	// 2. Insertamos la encuesta en la BD YA CON LA RUTA DE LA IMAGEN
	const { data: encuesta, error: insertError } = await supabase
		.from(ENCUESTA_TABLE)
		.insert({
			...payload,
			comprobante_url: archivoPath,
			encuestador_email: user.email,
		})
		.select("id")
		.single();

	// Si falla la BD (ej. falta un campo obligatorio), se corta aquí. No subimos basura al Storage.
	if (insertError || !encuesta) {
		throw new Error(
			"Falló validación de base de datos. No se pudo guardar la encuesta.",
			{
				cause: insertError,
			},
		);
	}

	// 3. Si la BD guardó bien, subimos la imagen al Storage
	const { error: uploadError } = await supabase.storage
		.from(STORAGE_BUCKET)
		.upload(archivoPath, comprobanteBlob, {
			contentType: "image/png",
			upsert: false,
		});

	// 4. Si la subida de la imagen falla, hacemos ROLLBACK borrando el registro de la BD
	if (uploadError) {
		const { error: deleteError } = await supabase
			.from(ENCUESTA_TABLE)
			.delete()
			.eq("id", encuesta.id);

		if (deleteError) {
			throw new Error(
				"Error crítico: Falló la imagen y no se pudo eliminar el registro huérfano en BD.",
				{ cause: deleteError },
			);
		}

		throw new Error(
			"Se guardaron los datos pero falló la subida del comprobante. Cambios revertidos.",
			{
				cause: uploadError,
			},
		);
	}

	// Si llega hasta aquí, el INSERT y el UPLOAD fueron exitosos.
}
