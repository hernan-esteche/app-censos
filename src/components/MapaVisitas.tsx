"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { EncuestaCuencaLambareDB } from "@/types";

const customIcon = L.icon({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

export default function MapaVisitas({
	visitas,
}: {
	visitas: EncuestaCuencaLambareDB[];
}) {
	const defaultLat = -25.2867;
	const defaultLng = -57.647;
	const conGps = visitas.filter((visita) => visita.gps.includes(","));

	const primerPunto = conGps.length > 0 ? conGps[0] : null;
	const centro: [number, number] = primerPunto
		? (primerPunto.gps.split(",").map(Number) as [number, number])
		: [defaultLat, defaultLng];

	return (
		<div className="h-125 w-full rounded-xl overflow-hidden border shadow-md relative z-0">
			<MapContainer
				center={centro}
				zoom={13}
				scrollWheelZoom={true}
				className="h-full w-full"
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{conGps.map((v) => {
					const [latitud, longitud] = v.gps.split(",").map(Number);
					return (
						<Marker key={v.id} position={[latitud, longitud]} icon={customIcon}>
							<Popup>
								<div className="text-sm">
									<p className="font-bold text-gray-900">
										{v.nombres} {v.apellidos}
									</p>
									{v.ci && (
										<p className="text-gray-600">
											<span className="font-semibold">CI:</span> {v.ci}
										</p>
									)}
									{v.telefono && (
										<p className="text-gray-600">
											<span className="font-semibold">Cel:</span> {v.telefono}
										</p>
									)}
									{v.direccion && (
										<p className="text-gray-600">
											<span className="font-semibold">Dir:</span> {v.direccion}
										</p>
									)}
									<p className="text-xs text-gray-400 mt-2">
										{new Date(v.created_at).toLocaleString()}
									</p>
								</div>
							</Popup>
						</Marker>
					);
				})}
			</MapContainer>
		</div>
	);
}
