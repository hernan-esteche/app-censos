import type { ReactNode, RefObject } from "react";
import type SignatureCanvas from "react-signature-canvas";
import type { EncuestaFormData } from "./index";

export type FieldErrors = Partial<Record<keyof EncuestaFormData, string>>;

export type Mensaje = {
	tipo: "success" | "error";
	texto: string;
};

export type ActualizarCampo = <K extends keyof EncuestaFormData>(
	campo: K,
	valor: EncuestaFormData[K],
) => void;

export interface SectionProps {
	title: string;
	children: ReactNode;
	number?: string;
}

export interface TextFieldProps {
	label: string;
	value: string;
	error?: string;
	placeholder?: string;
	onChange: (value: string) => void;
	multiline?: boolean;
	type?: "text" | "date";
}

export interface RadioGroupProps {
	label: string;
	value: string;
	options: readonly string[];
	onChange: (value: string) => void;
	error?: string;
	className?: string;
	optionsClassName?: string;
}

export interface ConsentimientoYFirmaProps {
	formData: EncuestaFormData;
	actualizarCampo: ActualizarCampo;
	firmaRef: RefObject<SignatureCanvas | null>;
}

export interface CuestionarioServiciosProps {
	formData: EncuestaFormData;
	errores: FieldErrors;
	actualizarCampo: ActualizarCampo;
}

export interface DatosGeneralesProps {
	formData: EncuestaFormData;
	errores: FieldErrors;
	actualizarCampo: ActualizarCampo;
	gpsAccuracy: number | null;
	loadingGps: boolean;
	capturarUbicacion: () => void;
	limpiarGpsAccuracy: () => void;
}

export interface UseGeolocationResult {
	gps: string;
	gpsAccuracy: number | null;
	loadingGps: boolean;
	capturarUbicacion: () => void;
	errorGps: string | null;
	limpiarGpsAccuracy: () => void;
}
