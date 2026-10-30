import RadioGroup from "@/components/ui/RadioGroup";
import Section from "@/components/ui/Section";
import TextField from "@/components/ui/TextField";
import type { EncuestaFormData } from "@/types";
import type { CuestionarioServiciosProps } from "@/types/formularioVisita";

export default function CuestionarioServicios({
	formData,
	errores,
	actualizarCampo,
}: CuestionarioServiciosProps) {
	return (
		<>
			<Section number="II" title="Percepción del derecho humano">
				<RadioGroup
					label="¿El Estado garantiza el acceso al agua como derecho humano?"
					value={formData.garantizaDerechoAgua}
					options={["Sí", "Parcialmente", "No"]}
					onChange={(value) =>
						actualizarCampo(
							"garantizaDerechoAgua",
							value as EncuestaFormData["garantizaDerechoAgua"],
						)
					}
					error={errores.garantizaDerechoAgua}
				/>
			</Section>

			<Section number="III" title="Información pública">
				<RadioGroup
					label="¿Conoce la ley de acceso a la información pública?"
					value={formData.conoceLeyAcceso}
					options={["si", "no", "algo"]}
					onChange={(value) =>
						actualizarCampo(
							"conoceLeyAcceso",
							value as EncuestaFormData["conoceLeyAcceso"],
						)
					}
					error={errores.conoceLeyAcceso}
				/>
				<RadioGroup
					label="¿Cree importante el control de recursos públicos?"
					value={formData.controlRecursosPublicos}
					options={["si", "no", "no sabe"]}
					onChange={(value) =>
						actualizarCampo(
							"controlRecursosPublicos",
							value as EncuestaFormData["controlRecursosPublicos"],
						)
					}
					error={errores.controlRecursosPublicos}
				/>
				<RadioGroup
					label="¿Participa en alguna organización?"
					value={formData.participaOrganizacion}
					options={["si", "no"]}
					onChange={(value) => {
						const respuesta =
							value as EncuestaFormData["participaOrganizacion"];
						actualizarCampo("participaOrganizacion", respuesta);
						if (respuesta === "no") {
							actualizarCampo("organizacionCual", "");
						}
					}}
					error={errores.participaOrganizacion}
				/>
				{formData.participaOrganizacion === "si" && (
					<TextField
						label="¿En cuál?"
						value={formData.organizacionCual}
						placeholder="Comisión vecinal o junta de saneamiento"
						onChange={(value) => actualizarCampo("organizacionCual", value)}
					/>
				)}
			</Section>

			<Section number="IV" title="Servicio de agua potable">
				<RadioGroup
					label="Conexión a la red de agua"
					value={formData.conexionRedAgua}
					options={["Sí, red pública", "No", "Otro"]}
					onChange={(value) =>
						actualizarCampo(
							"conexionRedAgua",
							value as EncuestaFormData["conexionRedAgua"],
						)
					}
					error={errores.conexionRedAgua}
				/>
				<RadioGroup
					label="Frecuencia del servicio"
					value={formData.frecuenciaServicio}
					options={[
						"Las 24 horas del día",
						"Por horas / intermitente",
						"Solo algunos días de la semana",
					]}
					onChange={(value) =>
						actualizarCampo(
							"frecuenciaServicio",
							value as EncuestaFormData["frecuenciaServicio"],
						)
					}
					error={errores.frecuenciaServicio}
				/>
				<RadioGroup
					label="Calidad del agua"
					value={formData.calidadAgua}
					options={["Buena", "Regular", "Mala"]}
					onChange={(value) =>
						actualizarCampo(
							"calidadAgua",
							value as EncuestaFormData["calidadAgua"],
						)
					}
					error={errores.calidadAgua}
				/>
			</Section>

			<Section number="V" title="Saneamiento básico">
				<RadioGroup
					label="Tipo de eliminación de excretas"
					value={formData.tipoEliminacionExcretas}
					options={[
						"Red pública de alcantarillado",
						"Cámara séptica con pozo",
						"Letrina / Pozo ciego",
						"Sin sistema / Al aire libre",
					]}
					onChange={(value) =>
						actualizarCampo(
							"tipoEliminacionExcretas",
							value as EncuestaFormData["tipoEliminacionExcretas"],
						)
					}
					error={errores.tipoEliminacionExcretas}
				/>
				<RadioGroup
					label="¿Hay desbordes cloacales durante la lluvia?"
					value={formData.desbordesCloacalesLluvia}
					options={["Sí", "No"]}
					onChange={(value) =>
						actualizarCampo(
							"desbordesCloacalesLluvia",
							value as EncuestaFormData["desbordesCloacalesLluvia"],
						)
					}
					error={errores.desbordesCloacalesLluvia}
				/>
			</Section>

			<Section number="VI" title="Asequibilidad (Costo del Servicio)">
				<RadioGroup
					label="¿El pago o tarifa por los servicios de agua y saneamiento le resulta económico y accesible para el presupuesto familiar?"
					value={formData.asequibilidadTarifa}
					options={[
						"Sí, Es totalmente asequible",
						"Es un gasto difícil de cubrir",
						"No pago tarifa",
						"No cuento con el servicio",
					]}
					optionsClassName="lg:grid-cols-4"
					onChange={(value) => actualizarCampo("asequibilidadTarifa", value)}
					error={errores.asequibilidadTarifa}
				/>
			</Section>

			<Section number="VII" title="Gestión del servicio">
				<RadioGroup
					label="¿Conoce quién administra el servicio de agua?"
					value={formData.conoceAdministradorAgua}
					options={["Sí", "No"]}
					onChange={(value) => {
						const respuesta =
							value as EncuestaFormData["conoceAdministradorAgua"];
						actualizarCampo("conoceAdministradorAgua", respuesta);
						if (respuesta === "No") {
							actualizarCampo("administradorCual", "");
						}
					}}
					error={errores.conoceAdministradorAgua}
				/>
				{formData.conoceAdministradorAgua === "Sí" && (
					<RadioGroup
						label="¿Quién administra el servicio?"
						value={formData.administradorCual}
						options={["Junta de Saneamiento", "ESSAP", "Cooperativa", "Otro"]}
						optionsClassName="lg:grid-cols-4"
						onChange={(value) => actualizarCampo("administradorCual", value)}
					/>
				)}
			</Section>

			<Section number="VIII" title="Asambleas y consultas">
				<RadioGroup
					label="¿Participó en asambleas o consultas?"
					value={formData.participoAsambleas}
					options={["Sí", "No"]}
					error={errores.participoAsambleas}
					onChange={(value) =>
						actualizarCampo(
							"participoAsambleas",
							value as EncuestaFormData["participoAsambleas"],
						)
					}
				/>
				{formData.participoAsambleas === "No" && (
					<RadioGroup
						label="Motivo de no participación"
						value={formData.motivoNoParticipacion}
						options={[
							"No sabía que se hacían",
							"Falta de tiempo",
							"No creo que sirva de mucho",
							"Nunca he sido convocado",
							"No existen espacios de participación",
							"Otro",
						]}
						onChange={(value) =>
							actualizarCampo(
								"motivoNoParticipacion",
								value as EncuestaFormData["motivoNoParticipacion"],
							)
						}
					/>
				)}
				<RadioGroup
					label="Información recibida por otro medio"
					value={formData.recibioInfoOtroMedio}
					options={[
						"Redes Sociales",
						"Radio",
						"Televisión",
						"Vecinos / Comunidad",
						"Otro",
					]}
					onChange={(value) =>
						actualizarCampo(
							"recibioInfoOtroMedio",
							value as EncuestaFormData["recibioInfoOtroMedio"],
						)
					}
				/>
			</Section>

			<Section number="IX" title="Mecanismos de reclamo">
				<RadioGroup
					label="¿Conoce los mecanismos para presentar reclamos?"
					value={formData.conoceMecanismosReclamos}
					options={["Sí", "No"]}
					onChange={(value) =>
						actualizarCampo(
							"conoceMecanismosReclamos",
							value as EncuestaFormData["conoceMecanismosReclamos"],
						)
					}
					error={errores.conoceMecanismosReclamos}
				/>
			</Section>

			<Section number="X" title="Evaluación de ESSAP">
				<RadioGroup
					label="¿Cómo calificaría el nivel de transparencia e información?"
					value={formData.calificacionEssap}
					options={["Bueno", "Regular", "Deficiente"]}
					onChange={(value) =>
						actualizarCampo(
							"calificacionEssap",
							value as EncuestaFormData["calificacionEssap"],
						)
					}
					error={errores.calificacionEssap}
				/>
			</Section>
		</>
	);
}
