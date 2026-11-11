import { useCallback, useState } from "react";
import {
	notaPresentadaSchema,
	otraActividadSchema,
	reunionSchema,
} from "@/schemas/actividadesSchema";
import {
	guardarNotaPresentada,
	guardarOtraActividad,
	guardarReunion,
} from "@/services/actividadesService";
import type {
	NotaPresentadaFormData,
	NotaPresentadaInsert,
	OtraActividadFormData,
	OtraActividadInsert,
	ReunionFormData,
	ReunionInsert,
	TipoActividad,
} from "@/types/actividades";
import type { Mensaje } from "@/types/formularioVisita";

const initialReunion: ReunionFormData = {
	fecha: "",
	participantes: [""],
	orden_del_dia: [""],
	resoluciones: [""],
	observaciones: "",
};

const initialNota: NotaPresentadaFormData = {
	fecha: "",
	destinatario: "",
	medio_envio: "",
	mesa_entrada_numero: "",
	mesa_entrada_fecha: "",
	tema: "",
	observaciones: "",
};

const initialOtra: OtraActividadFormData = {
	fecha: "",
	participantes: [""],
	resumen: "",
	observaciones: "",
};

type ValidatedActivity =
	| { tipo: "reunion"; payload: ReunionInsert }
	| { tipo: "nota"; payload: NotaPresentadaInsert }
	| { tipo: "otra"; payload: OtraActividadInsert };

export function useActividadesForm() {
	const [reunion, setReunion] = useState(initialReunion);
	const [nota, setNota] = useState(initialNota);
	const [otra, setOtra] = useState(initialOtra);
	const [errores, setErrores] = useState<Record<string, string>>({});
	const [mensaje, setMensaje] = useState<Mensaje | null>(null);
	const [loading, setLoading] = useState(false);

	const limpiarError = useCallback((campo: string) => {
		setErrores((previous) => {
			if (!previous[campo]) return previous;
			const next = { ...previous };
			delete next[campo];
			return next;
		});
	}, []);

	const actualizarReunion = useCallback(
		<K extends keyof ReunionFormData>(campo: K, valor: ReunionFormData[K]) => {
			setReunion((previous) => ({ ...previous, [campo]: valor }));
			limpiarError(campo);
		},
		[limpiarError],
	);

	const actualizarNota = useCallback(
		<K extends keyof NotaPresentadaFormData>(
			campo: K,
			valor: NotaPresentadaFormData[K],
		) => {
			setNota((previous) => ({ ...previous, [campo]: valor }));
			limpiarError(campo);
		},
		[limpiarError],
	);

	const actualizarOtra = useCallback(
		<K extends keyof OtraActividadFormData>(
			campo: K,
			valor: OtraActividadFormData[K],
		) => {
			setOtra((previous) => ({ ...previous, [campo]: valor }));
			limpiarError(campo);
		},
		[limpiarError],
	);

	const actualizarElemento = useCallback(
		(
			campo: "participantes" | "orden_del_dia" | "resoluciones",
			indice: number,
			valor: string,
		) => {
			setReunion((previous) => ({
				...previous,
				[campo]: previous[campo].map((item, index) =>
					index === indice ? valor : item,
				),
			}));
			limpiarError(campo);
		},
		[limpiarError],
	);

	const actualizarParticipanteOtra = useCallback(
		(indice: number, valor: string) => {
			setOtra((previous) => ({
				...previous,
				participantes: previous.participantes.map((item, index) =>
					index === indice ? valor : item,
				),
			}));
			limpiarError("participantes");
		},
		[limpiarError],
	);

	const agregarElemento = useCallback(
		(campo: "participantes" | "orden_del_dia" | "resoluciones") => {
			setReunion((previous) => ({
				...previous,
				[campo]: [...previous[campo], ""],
			}));
		},
		[],
	);

	const eliminarElemento = useCallback(
		(
			campo: "participantes" | "orden_del_dia" | "resoluciones",
			indice: number,
		) => {
			setReunion((previous) => ({
				...previous,
				[campo]:
					previous[campo].length > 1
						? previous[campo].filter((_, index) => index !== indice)
						: [""],
			}));
		},
		[],
	);

	const agregarParticipanteOtra = useCallback(() => {
		setOtra((previous) => ({
			...previous,
			participantes: [...previous.participantes, ""],
		}));
	}, []);

	const eliminarParticipanteOtra = useCallback((indice: number) => {
		setOtra((previous) => ({
			...previous,
			participantes:
				previous.participantes.length > 1
					? previous.participantes.filter((_, index) => index !== indice)
					: [""],
		}));
	}, []);

	const validar = useCallback(
		(tipo: TipoActividad) => {
			const resultado =
				tipo === "reunion"
					? reunionSchema.safeParse(reunion)
					: tipo === "nota"
						? notaPresentadaSchema.safeParse(nota)
						: otraActividadSchema.safeParse(otra);

			if (resultado.success) {
				setErrores({});
				return { tipo, payload: resultado.data } as ValidatedActivity;
			}

			const nextErrors: Record<string, string> = {};
			for (const issue of resultado.error.issues) {
				const campo = issue.path[0];
				if (typeof campo === "string" && !nextErrors[campo]) {
					nextErrors[campo] = issue.message;
				}
			}
			setErrores(nextErrors);
			return null;
		},
		[nota, otra, reunion],
	);

	const enviar = useCallback(
		async (tipo: TipoActividad) => {
			setMensaje(null);
			const validated = validar(tipo);
			if (!validated) return false;

			setLoading(true);
			try {
				if (validated.tipo === "reunion") {
					await guardarReunion(validated.payload);
					setReunion(initialReunion);
				} else if (validated.tipo === "nota") {
					await guardarNotaPresentada(validated.payload);
					setNota(initialNota);
				} else {
					await guardarOtraActividad(validated.payload);
					setOtra(initialOtra);
				}
				setMensaje({
					tipo: "success",
					texto: "Registro guardado correctamente.",
				});
				return true;
			} catch (error) {
				setMensaje({
					tipo: "error",
					texto:
						error instanceof Error
							? error.message
							: "No se pudo guardar el registro.",
				});
				return false;
			} finally {
				setLoading(false);
			}
		},
		[validar],
	);

	return {
		reunion,
		nota,
		otra,
		errores,
		mensaje,
		loading,
		actualizarReunion,
		actualizarNota,
		actualizarOtra,
		actualizarElemento,
		actualizarParticipanteOtra,
		agregarElemento,
		eliminarElemento,
		agregarParticipanteOtra,
		eliminarParticipanteOtra,
		enviar,
	};
}
