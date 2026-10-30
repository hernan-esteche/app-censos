import { useCallback, useEffect, useState } from "react";
import type { UseGeolocationResult } from "@/types/formularioVisita";

export function useGeolocation(): UseGeolocationResult {
	const [gps, setGps] = useState("");
	const [loadingGps, setLoadingGps] = useState(false);
	const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
	const [errorGps, setErrorGps] = useState<string | null>(null);

	const capturarUbicacion = useCallback(() => {
		setLoadingGps(true);
		setErrorGps(null);

		if (!navigator.geolocation) {
			setGps("");
			setGpsAccuracy(null);
			setLoadingGps(false);
			setErrorGps(
				"No se pudo capturar la ubicación GPS. Ingrésela manualmente.",
			);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setGps(`${position.coords.latitude}, ${position.coords.longitude}`);
				setGpsAccuracy(position.coords.accuracy);
				setLoadingGps(false);
			},
			() => {
				setGpsAccuracy(null);
				setLoadingGps(false);
				setErrorGps(
					"No se pudo capturar la ubicación GPS. Ingrésela manualmente.",
				);
			},
			{ enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
		);
	}, []);

	useEffect(() => {
		capturarUbicacion();
	}, [capturarUbicacion]);

	const limpiarGpsAccuracy = useCallback(() => {
		setGpsAccuracy(null);
	}, []);

	return {
		gps,
		gpsAccuracy,
		loadingGps,
		capturarUbicacion,
		errorGps,
		limpiarGpsAccuracy,
	};
}
