import { Loader2, MapPin } from "lucide-react";
import RadioGroup from "@/components/ui/RadioGroup";
import Section from "@/components/ui/Section";
import TextField from "@/components/ui/TextField";
import type { EncuestaFormData } from "@/types";
import type { DatosGeneralesProps } from "@/types/formularioVisita";

export default function DatosGenerales({
	formData,
	errores,
	actualizarCampo,
	gpsAccuracy,
	loadingGps,
	capturarUbicacion,
	limpiarGpsAccuracy,
}: DatosGeneralesProps) {
	return (
		<Section number="I" title="Datos personales y vivienda">
			<div className="grid gap-4 sm:grid-cols-2">
				<TextField
					label="Nombres"
					value={formData.nombres}
					placeholder="Juan Carlos"
					error={errores.nombres}
					onChange={(value) => actualizarCampo("nombres", value)}
				/>
				<TextField
					label="Apellidos"
					value={formData.apellidos}
					placeholder="Pérez González"
					error={errores.apellidos}
					onChange={(value) => actualizarCampo("apellidos", value)}
				/>
				<TextField
					label="Número de CI"
					value={formData.ci}
					placeholder="1234567"
					error={errores.ci}
					onChange={(value) => actualizarCampo("ci", value)}
				/>
				<TextField
					label="Teléfono"
					value={formData.telefono}
					placeholder="0981123456"
					error={errores.telefono}
					onChange={(value) => actualizarCampo("telefono", value)}
				/>
				<TextField
					label="Dirección"
					value={formData.direccion}
					placeholder="Casa blanca frente a la plaza"
					error={errores.direccion}
					onChange={(value) => actualizarCampo("direccion", value)}
				/>
				<TextField
					label="Barrio"
					value={formData.barrio}
					placeholder="Centro"
					error={errores.barrio}
					onChange={(value) => actualizarCampo("barrio", value)}
				/>
				<div className="grid gap-4 sm:col-span-2 sm:grid-cols-2 sm:items-end">
					<div
						className={`flex flex-col gap-3 rounded-2xl border p-3.5 transition-all sm:flex-row sm:items-center sm:justify-between ${
							formData.gps
								? "border-emerald-200 bg-emerald-50/80 text-emerald-950"
								: "border-blue-200 bg-blue-50/70 text-blue-950"
						}`}
					>
						<div className="flex min-w-0 items-center gap-3">
							<div
								className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
									formData.gps
										? "bg-emerald-100 text-emerald-700"
										: "bg-blue-100 text-blue-700"
								}`}
							>
								{loadingGps ? (
									<Loader2 className="h-5 w-5 animate-spin" />
								) : (
									<MapPin className="h-5 w-5" />
								)}
							</div>
							<div className="min-w-0">
								<p className="text-sm font-bold">Geolocalización GPS</p>
								{formData.gps ? (
									<p className="truncate text-sm font-semibold text-emerald-700">
										Fijada (
										{gpsAccuracy !== null
											? `±${Math.round(gpsAccuracy)}m precisión`
											: "precisión disponible"}
										)
									</p>
								) : (
									<p className="text-sm text-slate-500">
										Esperando ubicación...
									</p>
								)}
							</div>
						</div>
						<button
							type="button"
							onClick={capturarUbicacion}
							disabled={loadingGps}
							className="min-h-12 shrink-0 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
						>
							{loadingGps ? "Localizando..." : "Actualizar"}
						</button>
					</div>
					<TextField
						label="Coordenadas GPS"
						value={formData.gps}
						placeholder="-25.2867, -57.6470"
						error={errores.gps}
						onChange={(value) => {
							limpiarGpsAccuracy();
							actualizarCampo("gps", value);
						}}
					/>
				</div>
			</div>
			<RadioGroup
				label="Tipo de vivienda"
				value={formData.tipoVivienda}
				options={["Propia", "Alquilada", "Asentamiento"]}
				onChange={(value) =>
					actualizarCampo(
						"tipoVivienda",
						value as EncuestaFormData["tipoVivienda"],
					)
				}
				error={errores.tipoVivienda}
			/>
			<div className="grid gap-4 sm:grid-cols-2">
				<RadioGroup
					label="Sexo"
					value={formData.sexo}
					options={["F", "M"]}
					onChange={(value) =>
						actualizarCampo("sexo", value as EncuestaFormData["sexo"])
					}
					error={errores.sexo}
				/>
				<RadioGroup
					label="Franja etaria"
					value={formData.franjaEtaria}
					options={["15 a 29", "30 a 44", "45 a 59", "60 o más"]}
					className="sm:col-span-2"
					optionsClassName="lg:grid-cols-4"
					onChange={(value) =>
						actualizarCampo(
							"franjaEtaria",
							value as EncuestaFormData["franjaEtaria"],
						)
					}
					error={errores.franjaEtaria}
				/>
			</div>
			<TextField
				label="¿En qué trabaja?"
				value={formData.enQueTrabaja}
				placeholder="Comerciante, docente, trabajador independiente"
				error={errores.enQueTrabaja}
				onChange={(value) => actualizarCampo("enQueTrabaja", value)}
			/>
		</Section>
	);
}
