import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix missing marker icons in Vite/Vercel
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Custom icons from /public
const UserIcon = L.icon({
  iconUrl: "/markers/marker-icon-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const HospitalIcon = L.icon({
  iconUrl: "/markers/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const NearestHospitalIcon = L.icon({
  iconUrl: "/markers/marker-icon-gold.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Distance calculator (Haversine)
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function HospitalMap() {
  const [position, setPosition] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [nearest, setNearest] = useState(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setPosition([lat, lon]);
      },
      (err) => {
        console.error("Location error:", err);
        alert("Location access denied. Please enable location services.");
      }
    );
  }, []);

  // Fetch hospitals
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
        const results = (data.elements || [])
          .map((h) => {
            const hLat = h.lat || h.center?.lat;
            const hLon = h.lon || h.center?.lon;
            if (!hLat || !hLon) return null;

            const distKm = getDistanceKm(lat, lon, hLat, hLon);

            return {
              ...h,
              lat: hLat,
              lon: hLon,
              distance: distKm,
            };
          })
          .filter(Boolean)
          .sort((a, b) => a.distance - b.distance);

        setHospitals(results);
        setNearest(results[0] || null);
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
        <Marker position={position} icon={UserIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Hospitals */}
        {hospitals.map((h) => {
          const distText =
            h.distance < 1
              ? `${Math.round(h.distance * 1000)} m`
              : `${h.distance.toFixed(2)} km`;

          const isNearest = nearest && h.id === nearest.id;

          return (
            <Marker
              key={h.id}
              position={[h.lat, h.lon]}
              icon={isNearest ? NearestHospitalIcon : HospitalIcon}
            >
              <Popup>
                <strong>{h.tags?.name || "Hospital"}</strong>
                <br />
                Distance: {distText}
                {isNearest && (
                  <>
                    <br />
                    <strong>⭐ Nearest hospital</strong>
                  </>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Sorted hospital list */}
      <div style={{ marginTop: "20px" }}>
        <h3>Hospitals near you</h3>
        <ul>
          {hospitals.map((h) => {
            const distText =
              h.distance < 1
                ? `${Math.round(h.distance * 1000)} m`
                : `${h.distance.toFixed(2)} km`;

            return (
              <li key={h.id}>
                {h.tags?.name || "Hospital"} — {distText}
                {nearest && h.id === nearest.id && " ⭐"}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

     
  );
}
