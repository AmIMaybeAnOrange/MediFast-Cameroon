import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function HospitalMap() {
  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);

  // Get user location automatically
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPosition([lat, lon]);
      },
      (err) => console.error("Location error:", err)
    );
  }, []);

  // Fetch hospitals after we have location
  useEffect(() => {
    if (!position) return;

    const [lat, lon] = position;

    const query = `
      [out:json];
      node["amenity"="hospital"](around:5000, ${lat}, ${lon});
      out;
    `;

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query
    })
      .then((res) => res.json())
      .then((data) => {
        setHospitals(data.elements);
      });
  }, [position]);

  if (!position) return <p>Getting your location…</p>;

  return (
    <MapContainer center={position} zoom={14} style={{ height: "100vh" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>

      {hospitals.map((h) => (
        <Marker key={h.id} position={[h.lat, h.lon]}>
          <Popup>{h.tags?.name || "Hospital"}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
