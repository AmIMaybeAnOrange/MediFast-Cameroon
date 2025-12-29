import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix missing marker icons in Vite/Vercel
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const HospitalIcon = L.icon({
  iconUrl: "markers/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function HospitalMap() {
  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  // 1. Get user location automatically
  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      setPosition([lat, lon]);
      console.log("User position:", [lat, lon]);
    },
    (err) => {
      console.error("Location error:", err);
      alert("Location access denied. Please enable location services.");
    }
  );
}, []);

  // 2. Fetch hospitals after we have location
  useEffect(() => {
    if (!position) return;

    const [lat, lon] = position;

const query = `
  [out:json];
  (
    node["amenity"="hospital"](around:25000, ${lat}, ${lon});
    way["amenity"="hospital"](around:25000, ${lat}, ${lon});
    relation["amenity"="hospital"](around:25000, ${lat}, ${lon});
  );
  out center;
`;


    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Overpass data:", data);
        setHospitals(data.elements || []);
      })
      .catch((err) => console.error("Overpass error:", err));
  }, [position]);

  if (!position) return <p>Getting your location…</p>;

  return (
    <div style={{ marginTop: "20px" }}>
      <MapContainer
        center={position}
        zoom={14}
        style={{ height: "450px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* User marker */}
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Hospital markers */}
        {hospitals.map((h) => {
          const lat = h.lat || h.center?.lat;
          const lon = h.lon || h.center?.lon;
        
          if (!lat || !lon) return null;
        
          return (
            <Marker key={h.id} position={[lat, lon]} icon={HospitalIcon}>
              <Popup>
                <strong>{h.tags?.name || "Hospital"}</strong>
              </Popup>
            </Marker>
          );
        })}

      </MapContainer>
    </div>
  );
}
