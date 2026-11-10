"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect } from "react";

type ConfirmModalProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
};

export default function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
}: ConfirmModalProps) {
	useEffect(() => {
		if (!isOpen) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm"
			role="presentation"
		>
			<div
				className="relative z-10 w-full max-w-md p-6 text-center bg-white border shadow-2xl rounded-2xl border-slate-200"
				role="dialog"
				aria-modal="true"
				aria-labelledby="confirm-modal-title"
				aria-describedby="confirm-modal-message"
			>
				<div className="flex flex-col items-center">
					<div className="flex items-center justify-center rounded-full w-14 h-14 bg-emerald-50 text-emerald-600">
						<CheckCircle2 className="w-8 h-8" aria-hidden="true" />
					</div>
					<h2
						id="confirm-modal-title"
						className="mt-2 text-lg font-bold text-slate-900"
					>
						{title}
					</h2>
					<p
						id="confirm-modal-message"
						className="max-w-sm mt-2 text-sm leading-6 text-slate-600"
					>
						{message}
					</p>
					<button
						type="button"
						onClick={onClose}
						className="absolute p-2 transition-colors rounded-lg top-4 right-4 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
						aria-label="Cerrar confirmación"
					>
						<X className="w-5 h-5" aria-hidden="true" />
					</button>
				</div>

				<div className="flex flex-col-reverse justify-center gap-3 mt-5 sm:flex-row">
					<button
						type="button"
						onClick={onClose}
						className="min-h-11 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
					>
						Cancelar
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="min-h-11 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
					>
						Confirmar
					</button>
				</div>
			</div>
			<button
				type="button"
				onClick={onClose}
				className="absolute inset-0 cursor-default"
				aria-label="Cerrar confirmación"
			/>
		</div>
	);
}
