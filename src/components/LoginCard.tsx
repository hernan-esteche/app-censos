"use client";

import {
	AlertCircle,
	ArrowRight,
	Eye,
	EyeOff,
	Loader2,
	Lock,
	User,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { LoginCardProps } from "@/types";

export default function LoginCard({ onLoginSuccess }: LoginCardProps) {
	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [mostrarPassword, setMostrarPassword] = useState(false);
	const [iniciando, setIniciando] = useState(false);
	const [errorLogin, setErrorLogin] = useState("");

	const emailInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		emailInputRef.current?.focus();
	}, []);

	const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorLogin("");
		setIniciando(true);

		const { error } = await supabase.auth.signInWithPassword({
			email: emailInput.trim(),
			password: passwordInput.trim(),
		});

		setIniciando(false);

		if (error) {
			setErrorLogin("Credenciales inválidas. Verifica tu correo y contraseña.");
		} else {
			onLoginSuccess();
		}
	};

	return (
		<main
			className="relative flex items-center justify-center p-4 bg-fixed bg-center bg-no-repeat bg-cover min-h-svh selection:bg-indigo-500 selection:text-white"
			style={{ backgroundImage: "url('/ciudad-lambare-burrerita.jpeg')" }}
		>
			<div className="absolute inset-0 z-0 pointer-events-none bg-slate-900/30" />
			<div className="relative z-10 w-full max-w-md transition-all border shadow-2xl bg-white/85 backdrop-blur-md p-7 sm:p-9 rounded-3xl shadow-slate-300/50 border-white/90">
				<div className="mb-8 text-center">
					<div className="inline-flex items-center justify-center h-25 w-38 mb-3.5">
						<Image
							src="/logo-contraloria-lambare-3.png"
							alt="Logo de la Contraloría de Lambaré"
							width={128}
							height={80}
							className="object-contain w-full h-full"
							priority
						/>
					</div>
					<h1 className="text-2xl font-black tracking-tight text-slate-900">
						Contraloría Ciudadana de Lambaré
					</h1>
					<p className="mt-1 text-xs font-medium text-slate-500">
						Acceso seguro para administradores y encuestadores
					</p>
				</div>

				<form
					name="formulario-login"
					onSubmit={handleLogin}
					className="space-y-4"
				>
					<div>
						<div className="relative">
							<User className="h-5 w-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								ref={emailInputRef}
								name="email"
								type="email"
								autoComplete="username"
								required
								placeholder="usuario@censo.local"
								className="w-full border border-slate-200 rounded-xl pl-11 pr-3.5 py-3 text-base text-slate-900 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400"
								value={emailInput}
								onChange={(e) => setEmailInput(e.target.value)}
							/>
						</div>
					</div>

					<div>
						<div className="relative">
							<Lock className="h-5 w-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
							<input
								name="password"
								type={mostrarPassword ? "text" : "password"}
								autoComplete="current-password"
								required
								placeholder="••••••••"
								className="w-full py-3 pr-12 text-base transition-all bg-white border outline-none border-slate-200 rounded-xl pl-11 text-slate-900 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 placeholder:text-slate-400"
								value={passwordInput}
								onChange={(e) => setPasswordInput(e.target.value)}
							/>
							<button
								type="button"
								className="absolute inset-y-0 right-0 flex items-center pr-3 transition-colors text-slate-400 hover:text-slate-600"
								aria-label={
									mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"
								}
								onClick={() => setMostrarPassword((visible) => !visible)}
							>
								{mostrarPassword ? (
									<EyeOff className="w-5 h-5" aria-hidden="true" />
								) : (
									<Eye className="w-5 h-5" aria-hidden="true" />
								)}
							</button>
						</div>
					</div>

					{errorLogin && (
						<div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center gap-2 text-xs font-semibold text-rose-700 animate-in fade-in">
							<AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
							<span>{errorLogin}</span>
						</div>
					)}

					<button
						type="submit"
						disabled={iniciando}
						className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm tracking-wide mt-2 disabled:opacity-60"
					>
						{iniciando ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								<span>Verificando credenciales...</span>
							</>
						) : (
							<>
								<span>Iniciar Sesión</span>
								<ArrowRight className="w-4 h-4" />
							</>
						)}
					</button>
				</form>
			</div>
		</main>
	);
}

// LoginCard con fondo esmerelizado
// "use client";

// import { AlertCircle, ArrowRight, Loader2, Lock, User } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";
// import { supabase } from "@/lib/supabase";
// import type { LoginCardProps } from "@/types";

// export default function LoginCard({ onLoginSuccess }: LoginCardProps) {
// 	const [emailInput, setEmailInput] = useState("");
// 	const [passwordInput, setPasswordInput] = useState("");
// 	const [iniciando, setIniciando] = useState(false);
// 	const [errorLogin, setErrorLogin] = useState("");

// 	const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
// 		e.preventDefault();
// 		setErrorLogin("");
// 		setIniciando(true);

// 		const { error } = await supabase.auth.signInWithPassword({
// 			email: emailInput.trim(),
// 			password: passwordInput.trim(),
// 		});

// 		setIniciando(false);

// 		if (error) {
// 			setErrorLogin("Credenciales inválidas. Verifica tu correo y contraseña.");
// 		} else {
// 			onLoginSuccess();
// 		}
// 	};

// 	return (
// 		<main className="flex items-center justify-center p-4 min-h-svh bg-linear-to-tr from-slate-100 via-indigo-50/50 to-blue-100/40 selection:bg-indigo-500 selection:text-white">
// 			<div className="w-full max-w-md transition-all border shadow-2xl bg-white/85 backdrop-blur-md p-7 sm:p-9 rounded-3xl shadow-slate-300/50 border-white/90">
// 				<div className="mb-8 text-center">
// 					<div className="inline-flex items-center justify-center h-25 w-38 mb-3.5">
// 						<Image
// 							src="/logo-contraloria-lambare-3.png"
// 							alt="Logo de la Contraloría de Lambaré"
// 							width={128}
// 							height={80}
// 							className="object-contain w-full h-full"
// 							priority
// 						/>
// 					</div>
// 					<h1 className="text-2xl font-black tracking-tight text-slate-900">
// 						Contraloría Ciudadana de Lambaré
// 					</h1>
// 					<p className="mt-1 text-xs font-medium text-slate-500">
// 						Acceso seguro para administradores y encuestadores
// 					</p>
// 				</div>

// 				<form onSubmit={handleLogin} className="space-y-4">
// 					<div>
// 						<div className="relative">
// 							<User className="h-5 w-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
// 							<input
// 								type="email"
// 								required
// 								// autoFocus
// 								placeholder="usuario@censo.local"
// 								className="w-full border border-slate-200 rounded-xl pl-11 pr-3.5 py-3 text-base text-slate-900 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400"
// 								value={emailInput}
// 								onChange={(e) => setEmailInput(e.target.value)}
// 							/>
// 						</div>
// 					</div>

// 					<div>
// 						<div className="relative">
// 							<Lock className="h-5 w-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
// 							<input
// 								type="password"
// 								required
// 								placeholder="••••••••"
// 								className="w-full border border-slate-200 rounded-xl pl-11 pr-3.5 py-3 text-base text-slate-900 bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-400"
// 								value={passwordInput}
// 								onChange={(e) => setPasswordInput(e.target.value)}
// 							/>
// 						</div>
// 					</div>

// 					{errorLogin && (
// 						<div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center gap-2 text-xs font-semibold text-rose-700 animate-in fade-in">
// 							<AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
// 							<span>{errorLogin}</span>
// 						</div>
// 					)}

// 					<button
// 						type="submit"
// 						disabled={iniciando}
// 						className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-indigo-600/25 transition-all text-sm tracking-wide mt-2 disabled:opacity-60"
// 					>
// 						{iniciando ? (
// 							<>
// 								<Loader2 className="w-4 h-4 animate-spin" />
// 								<span>Verificando credenciales...</span>
// 							</>
// 						) : (
// 							<>
// 								<span>Iniciar Sesión</span>
// 								<ArrowRight className="w-4 h-4" />
// 							</>
// 						)}
// 					</button>
// 				</form>
// 			</div>
// 		</main>
// 	);
// }
