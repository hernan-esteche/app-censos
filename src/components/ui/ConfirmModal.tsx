"use client";

import { CheckCircle2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { ConfirmModalProps } from "@/types";

export default function ConfirmModal({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
}: ConfirmModalProps) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			if (!dialog.open) {
				dialog.showModal(); // Entra al Top Layer del navegador
			}
		} else {
			if (dialog.open) {
				dialog.close();
			}
		}
	}, [isOpen]);

	// Cerrar al hacer clic en el backdrop nativo
	const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		if (e.target === dialogRef.current) {
			onClose();
		}
	};

	return (
		<dialog
			ref={dialogRef}
			onClose={onClose} // Se dispara cuando el usuario presiona Escape nativamente
			onClick={handleBackdropClick}
			onKeyDown={(e) => {
				if (e.key === "Escape") {
					onClose();
				}
			}}
			className="w-full max-w-md p-6 m-auto bg-white border shadow-2xl rounded-2xl border-slate-200 backdrop:bg-slate-950/50 backdrop:backdrop-blur-sm"
		>
			<div className="flex flex-col items-center text-center">
				<div className="flex items-center justify-center rounded-full h-14 w-14 bg-emerald-50 text-emerald-600">
					<CheckCircle2 className="w-8 h-8" aria-hidden="true" />
				</div>
				<h2 className="mt-2 text-lg font-bold text-slate-900">{title}</h2>
				<p className="max-w-sm mt-2 text-sm leading-6 text-slate-600">
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

				<div className="flex flex-col-reverse justify-center w-full gap-3 mt-5 sm:flex-row">
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
		</dialog>
	);
}
