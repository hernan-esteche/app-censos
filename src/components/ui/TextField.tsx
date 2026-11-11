import { AlertCircle } from "lucide-react";
import type { TextFieldProps } from "@/types/formularioVisita";

export default function TextField({
	label,
	value,
	error,
	placeholder,
	onChange,
	multiline = false,
	type = "text",
}: TextFieldProps) {
	const inputId = label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-");
	const className = `w-full rounded-xl border bg-white px-4 py-3 text-base text-slate-900 outline-none placeholder:text-slate-400 transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 ${
		error ? "border-rose-400 bg-rose-50/20" : "border-slate-200 bg-white"
	}`;

	return (
		<div className="block space-y-1.5">
			<label htmlFor={inputId} className="text-sm font-bold text-slate-700">
				{label}
			</label>
			{multiline ? (
				<textarea
					id={inputId}
					value={value}
					placeholder={placeholder}
					rows={3}
					className={`${className} resize-y`}
					onChange={(event) => onChange(event.target.value)}
				/>
			) : (
				<input
					id={inputId}
					type={type}
					value={value}
					placeholder={placeholder}
					className={className}
					onChange={(event) => onChange(event.target.value)}
				/>
			)}
			{error && (
				<span className="flex items-center gap-1 text-xs font-semibold text-rose-600">
					<AlertCircle className="h-3.5 w-3.5" />
					{error}
				</span>
			)}
		</div>
	);
}
