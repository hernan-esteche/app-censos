"use client";

import {
	ClipboardList,
	Download,
	Loader2,
	LogOut,
	Map as MapIcon,
	PlusCircle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import FormularioActividades from "@/components/actividades/FormularioActividades";
import FormularioVisita from "@/components/FormularioVisita";
import LoginCard from "@/components/LoginCard";
import { exportarEncuestasAExcel } from "@/lib/exportExcel";
import { supabase } from "@/lib/supabase";
import type { EncuestaCuencaLambareDB, Rol, UsuarioSesion } from "@/types";

const MapaVisitas = dynamic(() => import("@/components/MapaVisitas"), {
	ssr: false,
	loading: () => (
		<div className="flex flex-col items-center justify-center gap-3 font-medium border shadow-sm h-125 bg-white/70 backdrop-blur-md rounded-2xl border-slate-200/80 text-slate-500">
			<Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
			<span>Cargando mapa interactivo...</span>
		</div>
	),
});

export default function Home() {
	const [sesion, setSesion] = useState<UsuarioSesion | null>(null);
	const [cargandoSesion, setCargandoSesion] = useState(true);
	const [visitas, setVisitas] = useState<EncuestaCuencaLambareDB[]>([]);
	const [tab, setTab] = useState<"formulario" | "mapa" | "actividades">(
		"formulario",
	);

	const cargarVisitas = useCallback(async () => {
		const { data } = await supabase
			.from("encuesta_cuenca_lambare")
			.select("*")
			.order("created_at", { ascending: false });
		if (data) setVisitas(data as EncuestaCuencaLambareDB[]);
	}, []);

	useEffect(() => {
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((_event, session) => {
			if (session?.user) {
				const rol: Rol =
					session.user.user_metadata?.role === "admin"
						? "admin"
						: "encuestador";
				setSesion({ email: session.user.email || "", rol });
				if (rol === "admin") cargarVisitas();
			} else {
				setSesion(null);
				setVisitas([]);
			}
			setCargandoSesion(false);
		});

		return () => subscription.unsubscribe();
	}, [cargarVisitas]);

	if (cargandoSesion) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen gap-3 font-medium bg-linear-to-tr from-slate-100 via-indigo-50/50 to-blue-100/40 text-slate-600">
				<div className="p-3 border shadow-lg bg-white/80 rounded-2xl border-slate-200/80 backdrop-blur-md">
					<Loader2 className="text-indigo-600 h-7 w-7 animate-spin" />
				</div>
				<p className="text-sm tracking-wide text-slate-500">
					Iniciando plataforma...
				</p>
			</div>
		);
	}

	if (!sesion) {
		return <LoginCard onLoginSuccess={cargarVisitas} />;
	}

	return (
		<main
			className="relative min-h-screen bg-fixed bg-center bg-no-repeat bg-cover selection:bg-indigo-500 selection:text-white"
			style={{ backgroundImage: "url('/ciudad-lambare-burrerita.jpeg')" }}
		>
			{/* <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] z-0 pointer-events-none" /> */}
			<div className="absolute inset-0 z-0 pointer-events-none bg-slate-900/30" />{" "}
			<div className="relative z-10 max-w-5xl p-4 mx-auto space-y-6 sm:p-6 md:p-8">
				{/* Header con Efecto Glassmorphism */}
				<header className="flex flex-col items-start justify-between gap-4 p-5 transition-all border shadow-xl sm:flex-row sm:items-center bg-white/80 backdrop-blur-md rounded-2xl shadow-slate-200/40 border-white/80">
					<div>
						<div className="flex items-center gap-2 justify-items-start">
							<h1 className="text-2xl font-black tracking-tight sm:text-3xl text-slate-900">
								Contraloría Ciudadana de Lambaré
							</h1>
						</div>

						<div className="flex flex-wrap items-center gap-2.5 mt-1.5">
							<span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-linear-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200/70 shadow-2xs">
								<span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
								{sesion.rol === "admin" ? "Administrador" : "Encuestador"}
							</span>
						</div>
					</div>

					<div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
						{sesion.rol === "admin" && (
							<button
								type="button"
								onClick={() => void exportarEncuestasAExcel(visitas)}
								className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-600/20"
							>
								<Download className="w-4 h-4 shrink-0" />
								<span>Exportar Excel</span>
							</button>
						)}

						<button
							type="button"
							onClick={() => supabase.auth.signOut()}
							className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100/80 active:bg-slate-200/70 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 shadow-2xs transition-all"
							title="Cerrar sesión"
						>
							<LogOut className="w-4 h-4 text-slate-500" />
							<span>Salir</span>
						</button>
					</div>
				</header>

				{/* Pestañas de navegación disponibles según el rol */}
				<div className="flex w-full flex-wrap items-center justify-start gap-1.5 rounded-2xl border border-slate-200/70 bg-slate-200/60 p-1.5 backdrop-blur-sm sm:w-fit">
					<button
						type="button"
						onClick={() => setTab("formulario")}
						className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 sm:flex-initial ${
							tab === "formulario"
								? "bg-white text-indigo-700 shadow-sm shadow-slate-300"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						<PlusCircle className="w-4 h-4 shrink-0" />
						<span>Nuevo Registro</span>
					</button>
					<button
						type="button"
						onClick={() => setTab("actividades")}
						className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 sm:flex-initial ${
							tab === "actividades"
								? "bg-white text-indigo-700 shadow-sm shadow-slate-300"
								: "text-slate-600 hover:text-slate-900"
						}`}
					>
						<ClipboardList className="w-4 h-4 shrink-0" />
						<span>Actividades</span>
					</button>
					{sesion.rol === "admin" && (
						<button
							type="button"
							onClick={() => setTab("mapa")}
							className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 sm:flex-initial ${
								tab === "mapa"
									? "bg-white text-indigo-700 shadow-sm shadow-slate-300"
									: "text-slate-600 hover:text-slate-900"
							}`}
						>
							<MapIcon className="w-4 h-4 shrink-0" />
							<span>Ver Mapa ({visitas.length})</span>
						</button>
					)}
				</div>

				{/* Contenedor de Vistas */}
				<section className="transition-all duration-200">
					{tab === "actividades" ? (
						<FormularioActividades />
					) : tab === "mapa" && sesion.rol === "admin" ? (
						<div className="p-4 border shadow-xl bg-white/80 backdrop-blur-md sm:p-5 rounded-2xl shadow-slate-200/40 border-white/80">
							<MapaVisitas visitas={visitas} />
						</div>
					) : (
						<FormularioVisita
							onGuardado={sesion.rol === "admin" ? cargarVisitas : undefined}
						/>
					)}
				</section>
			</div>
		</main>
	);
}

// Page con fondo esmerelizado

// "use client";

// import {
// 	Download,
// 	Loader2,
// 	LogOut,
// 	Map as MapIcon,
// 	PlusCircle,
// } from "lucide-react";
// import dynamic from "next/dynamic";
// import { useCallback, useEffect, useState } from "react";
// import FormularioVisita from "@/components/FormularioVisita";
// import LoginCard from "@/components/LoginCard";
// import { exportarEncuestasAExcel } from "@/lib/exportExcel";
// import { supabase } from "@/lib/supabase";
// import type { EncuestaCuencaLambareDB, Rol, UsuarioSesion } from "@/types";

// const MapaVisitas = dynamic(() => import("@/components/MapaVisitas"), {
// 	ssr: false,
// 	loading: () => (
// 		<div className="flex flex-col items-center justify-center gap-3 font-medium border shadow-sm h-125 bg-white/70 backdrop-blur-md rounded-2xl border-slate-200/80 text-slate-500">
// 			<Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
// 			<span>Cargando mapa interactivo...</span>
// 		</div>
// 	),
// });

// export default function Home() {
// 	const [sesion, setSesion] = useState<UsuarioSesion | null>(null);
// 	const [cargandoSesion, setCargandoSesion] = useState(true);
// 	const [visitas, setVisitas] = useState<EncuestaCuencaLambareDB[]>([]);
// 	const [tab, setTab] = useState<"formulario" | "mapa">("formulario");

// 	const cargarVisitas = useCallback(async () => {
// 		const { data } = await supabase
// 			.from("encuesta_cuenca_lambare")
// 			.select("*")
// 			.order("created_at", { ascending: false });
// 		if (data) setVisitas(data as EncuestaCuencaLambareDB[]);
// 	}, []);

// 	useEffect(() => {
// 		const {
// 			data: { subscription },
// 		} = supabase.auth.onAuthStateChange((_event, session) => {
// 			if (session?.user) {
// 				const rol: Rol =
// 					session.user.user_metadata?.role === "admin"
// 						? "admin"
// 						: "encuestador";
// 				setSesion({ email: session.user.email || "", rol });
// 				if (rol === "admin") cargarVisitas();
// 			} else {
// 				setSesion(null);
// 				setVisitas([]);
// 			}
// 			setCargandoSesion(false);
// 		});

// 		return () => subscription.unsubscribe();
// 	}, [cargarVisitas]);

// 	if (cargandoSesion) {
// 		return (
// 			<div className="flex flex-col items-center justify-center min-h-screen gap-3 font-medium bg-linear-to-tr from-slate-100 via-indigo-50/50 to-blue-100/40 text-slate-600">
// 				<div className="p-3 border shadow-lg bg-white/80 rounded-2xl border-slate-200/80 backdrop-blur-md">
// 					<Loader2 className="text-indigo-600 h-7 w-7 animate-spin" />
// 				</div>
// 				<p className="text-sm tracking-wide text-slate-500">
// 					Iniciando plataforma...
// 				</p>
// 			</div>
// 		);
// 	}

// 	if (!sesion) {
// 		return <LoginCard onLoginSuccess={cargarVisitas} />;
// 	}

// 	return (
// 		<main className="min-h-screen p-4 bg-linear-to-tr from-slate-100 via-indigo-50/40 to-blue-50/50 sm:p-6 md:p-8 selection:bg-indigo-500 selection:text-white">
// 			<div className="max-w-5xl mx-auto space-y-6">
// 				{/* Header con Efecto Glassmorphism */}
// 				<header className="flex flex-col items-start justify-between gap-4 p-5 transition-all border shadow-xl sm:flex-row sm:items-center bg-white/80 backdrop-blur-md rounded-2xl shadow-slate-200/40 border-white/80">
// 					<div>
// 						<div className="flex items-center gap-2">
// 							<h1 className="text-2xl font-black tracking-tight sm:text-3xl text-slate-900">
// 								Contraloría Ciudadana de Lambaré
// 							</h1>
// 						</div>

// 						<div className="flex flex-wrap items-center gap-2.5 mt-1.5">
// 							<span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-linear-to-r from-indigo-50 to-blue-50 text-indigo-700 border border-indigo-200/70 shadow-2xs">
// 								<span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
// 								{sesion.rol === "admin" ? "Administrador" : "Encuestador"}
// 							</span>
// 						</div>
// 					</div>

// 					<div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
// 						{sesion.rol === "admin" && (
// 							<button
// 								type="button"
// 								onClick={() => void exportarEncuestasAExcel(visitas)}
// 								className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md shadow-emerald-600/20"
// 							>
// 								<Download className="w-4 h-4 shrink-0" />
// 								<span>Exportar Excel</span>
// 							</button>
// 						)}

// 						<button
// 							type="button"
// 							onClick={() => supabase.auth.signOut()}
// 							className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100/80 active:bg-slate-200/70 text-slate-700 px-3.5 py-2.5 rounded-xl text-sm font-medium border border-slate-200 shadow-2xs transition-all"
// 							title="Cerrar sesión"
// 						>
// 							<LogOut className="w-4 h-4 text-slate-500" />
// 							<span>Salir</span>
// 						</button>
// 					</div>
// 				</header>

// 				{/* Pestañas de Navegación Estilo Pastilla Flotante (Admin) */}
// 				{sesion.rol === "admin" && (
// 					<div className="flex items-center justify-start p-1.5 bg-slate-200/60 backdrop-blur-sm rounded-2xl w-full sm:w-fit border border-slate-200/70">
// 						<button
// 							type="button"
// 							onClick={() => setTab("formulario")}
// 							className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-5 rounded-xl font-semibold text-sm transition-all duration-200 ${
// 								tab === "formulario"
// 									? "bg-white text-indigo-700 shadow-sm shadow-slate-300"
// 									: "text-slate-600 hover:text-slate-900"
// 							}`}
// 						>
// 							<PlusCircle className="w-4 h-4 shrink-0" />
// 							<span>Nuevo Registro</span>
// 						</button>
// 						<button
// 							type="button"
// 							onClick={() => setTab("mapa")}
// 							className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 py-2 px-5 rounded-xl font-semibold text-sm transition-all duration-200 ${
// 								tab === "mapa"
// 									? "bg-white text-indigo-700 shadow-sm shadow-slate-300"
// 									: "text-slate-600 hover:text-slate-900"
// 							}`}
// 						>
// 							<MapIcon className="w-4 h-4 shrink-0" />
// 							<span>Ver Mapa ({visitas.length})</span>
// 						</button>
// 					</div>
// 				)}

// 				{/* Contenedor de Vistas */}
// 				<section className="transition-all duration-200">
// 					{sesion.rol === "encuestador" || tab === "formulario" ? (
// 						<FormularioVisita
// 							onGuardado={sesion.rol === "admin" ? cargarVisitas : undefined}
// 						/>
// 					) : (
// 						<div className="p-4 border shadow-xl bg-white/80 backdrop-blur-md sm:p-5 rounded-2xl shadow-slate-200/40 border-white/80">
// 							<MapaVisitas visitas={visitas} />
// 						</div>
// 					)}
// 				</section>
// 			</div>
// 		</main>
// 	);
// }
