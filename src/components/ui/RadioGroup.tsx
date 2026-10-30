import type { RadioGroupProps } from "@/types/formularioVisita";

export default function RadioGroup({
	label,
	value,
	options,
	onChange,
	error,
	className = "",
	optionsClassName = "",
}: RadioGroupProps) {
	const mostrarOpcion = (option: string) => {
		const opciones: Record<string, string> = {
			si: "Sí",
			no: "No",
			algo: "Algo",
			"no sabe": "No sabe",
		};
		return opciones[option] ?? option;
	};

	return (
		<fieldset className={`space-y-2 ${className}`}>
			<legend className="text-sm font-bold text-slate-700">{label}</legend>
			<div
				className={`grid gap-2 sm:grid-cols-2 lg:grid-cols-3 ${optionsClassName}`}
			>
				{options.map((option) => (
					<label
						key={option}
						className={`flex min-h-12 cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
							value === option
								? "border-blue-500 bg-linear-to-r from-blue-50 to-indigo-50 text-blue-800 ring-2 ring-blue-500/20"
								: "border-slate-200 bg-white text-slate-700 hover:border-indigo-300"
						}`}
					>
						<input
							type="radio"
							value={option}
							checked={value === option}
							onChange={(event) => onChange(event.target.value)}
							className="h-5 w-5 accent-indigo-600"
						/>
						<span>{mostrarOpcion(option)}</span>
					</label>
				))}
			</div>
			{error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
		</fieldset>
	);
}
