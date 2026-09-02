'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function MapaVisitas({ visitas }: { visitas: any[] }) {
  const defaultLat = -25.2867;
  const defaultLng = -57.647;

  const primerPunto = visitas && visitas.length > 0 ? visitas[0] : null;
  const centro: [number, number] = primerPunto
    ? [Number(primerPunto.latitud), Number(primerPunto.longitud)]
    : [defaultLat, defaultLng];

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border shadow-md relative z-0">
      <MapContainer center={centro} zoom={13} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {visitas.map((v) => (
          <Marker key={v.id} position={[Number(v.latitud), Number(v.longitud)]} icon={defaultIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-gray-900">{v.nombre}</p>
                {v.documento && <p className="text-gray-600">Doc: {v.documento}</p>}
                {v.telefono && <p className="text-gray-600">Tel: {v.telefono}</p>}
                {v.direccion && <p className="text-gray-600">Dir: {v.direccion}</p>}
                {v.observaciones && <p className="text-gray-500 italic mt-1">{v.observaciones}</p>}
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(v.created_at).toLocaleString()}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}