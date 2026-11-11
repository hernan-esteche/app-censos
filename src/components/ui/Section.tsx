import type { SectionProps } from "@/types/formularioVisita";

export default function Section({ title, children, number }: SectionProps) {
	return (
		<section className="space-y-4 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-md shadow-slate-200/40 backdrop-blur-sm sm:p-6">
			<div className="border-b border-slate-100 pb-3">
				{number && (
					<p className="text-xs font-bold uppercase tracking-widest text-blue-600">
						Sección {number}
					</p>
				)}
				<h2 className="mt-1 text-lg font-bold text-slate-900">{title}</h2>
			</div>
			{children}
		</section>
	);
}
