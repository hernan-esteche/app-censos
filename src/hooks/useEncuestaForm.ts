import { useCallback, useState } from "react";
import { encuestaCuencaSchema } from "@/schemas/encuestaCuencaSchema";
import type { EncuestaFormData } from "@/types";
import type { FieldErrors, Mensaje } from "@/types/formularioVisita";

const initialFormData: EncuestaFormData = {
	nombres: "",
	apellidos: "",
	ci: "",
	direccion: "",
	barrio: "",
	tipoVivienda: "",
	telefono: "",
	gps: "",
	sexo: "",
	franjaEtaria: "",
	enQueTrabaja: "",
	garantizaDerechoAgua: "",
	conoceLeyAcceso: "",
	controlRecursosPublicos: "",
	participaOrganizacion: "",
	organizacionCual: "",
	conexionRedAgua: "",
	frecuenciaServicio: "",
	calidadAgua: "",
	tipoEliminacionExcretas: "",
	desbordesCloacalesLluvia: "",
	asequibilidadTarifa: "",
	conoceAdministradorAgua: "",
	administradorCual: "",
	participoAsambleas: "",
	motivoNoParticipacion: "",
	recibioInfoOtroMedio: "",
	conoceMecanismosReclamos: "",
	calificacionEssap: "",
	aceptaFotoRedes: false,
	aceptaContactoPosterior: false,
	aceptaInvitacionActividades: false,
	comentariosSugerencias: "",
};

export function useEncuestaForm() {
	const [formData, setFormData] = useState<EncuestaFormData>(initialFormData);
	const [errores, setErrores] = useState<FieldErrors>({});
	const [mensaje, setMensaje] = useState<Mensaje | null>(null);
	const [loading, setLoading] = useState(false);

	const actualizarCampo = useCallback(function actualizarCampo<
		K extends keyof EncuestaFormData,
	>(campo: K, valor: EncuestaFormData[K]) {
		setFormData((previous) => ({ ...previous, [campo]: valor }));
		setErrores((previous) => {
			if (!previous[campo]) return previous;
			const next = { ...previous };
			delete next[campo];
			return next;
		});
	}, []);

	const validarFormulario = useCallback(() => {
		const resultado = encuestaCuencaSchema.safeParse(formData);
		if (resultado.success) {
			setErrores({});
			return true;
		}

		const nextErrors: FieldErrors = {};
		for (const issue of resultado.error.issues) {
			const field = issue.path[0];
			if (typeof field === "string" && field in formData) {
				nextErrors[field as keyof EncuestaFormData] = issue.message;
			}
		}
		setErrores(nextErrors);
		return false;
	}, [formData]);

	const resetForm = useCallback(() => {
		setFormData(initialFormData);
		setErrores({});
	}, []);

	return {
		formData,
		errores,
		mensaje,
		loading,
		actualizarCampo,
		validarFormulario,
		setMensaje,
		setLoading,
		resetForm,
	};
}
