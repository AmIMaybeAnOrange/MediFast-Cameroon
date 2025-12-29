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

  // -------------------------------
  // 1. GET USER LOCATION WITH TIMEOUT + FALLBACK
  // -------------------------------
  useEffect(() => {
    let timeoutId;

    function success(pos) {
      clearTimeout(timeoutId);
      setPosition([pos.coords.latitude, pos.coords.longitude]);
    }

    function error(err) {
      clearTimeout(timeoutId);
      console.warn("Geolocation failed:", err);

      // Fallback location (Toronto)
      setPosition([43.6532, -79.3832]);
    }

    navigator.geolocation.getCurrentPosition(success, error);

    // Timeout after 5 seconds
    timeoutId = setTimeout(() => {
      console.warn("Geolocation timed out — using fallback");
      setPosition([43.6532, -79.3832]);
    }, 5000);
  }, []);

  // -------------------------------
  // 2. FETCH HOSPITALS WITH RETRIES + FALLBACK SERVERS + TIMEOUT
  // -------------------------------
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

    const servers = [
      "https://overpass-api.de/api/interpreter",
      "https://overpass.kumi.systems/api/interpreter",
      "https://overpass.nchc.org.tw/api/interpreter",
    ];

    function fetchWithTimeout(url, options, timeout = 8000) {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), timeout)
        ),
      ]);
    }

    async function fetchWithFallback(query, retries = 2) {
      for (let server of servers) {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            console.log(`Fetching from ${server} (attempt ${attempt})`);

            const res = await fetchWithTimeout(server, {
              method: "POST",
              body: query,
            });

            const text = await res.text();

            if (text.trim().startsWith("<")) {
              throw new Error("Received HTML instead of JSON");
            }

            return JSON.parse(text);
          } catch (err) {
            console.warn(`Error from ${server} attempt ${attempt}:`, err);
            await new Promise((resolve) => setTimeout(resolve, 1200));
          }
        }
      }
      throw new Error("All Overpass servers failed");
    }

    fetchWithFallback(query)
        .then(async (data) => {
          const rawHospitals = (data.elements || [])
            .map((h) => {
              const hLat = h.lat || h.center?.lat;
              const hLon = h.lon || h.center?.lon;
              if (!hLat || !hLon) return null;
        
              return {
                ...h,
                lat: hLat,
                lon: hLon,
              };
            })
            .filter(Boolean);
        
          // Fetch driving distance for each hospital
          async function getDrivingDistance(h) {
            try {
              const url = `https://router.project-osrm.org/route/v1/driving/${lon},${lat};${h.lon},${h.lat}?overview=false`;
              const res = await fetch(url);
              const json = await res.json();
        
              if (json.routes && json.routes.length > 0) {
                return {
                  ...h,
                  drivingDistance: json.routes[0].distance, // meters
                  drivingDuration: json.routes[0].duration, // seconds
                };
              }
            } catch (err) {
              console.warn("OSRM routing failed:", err);
            }
        
            // fallback to straight-line distance
            return {
              ...h,
              drivingDistance: getDistanceKm(lat, lon, h.lat, h.lon) * 1000,
              drivingDuration: null,
            };
          }
        
          const enriched = [];
          for (const h of rawHospitals) {
            enriched.push(await getDrivingDistance(h));
          }
        
          // Sort by driving distance
          enriched.sort((a, b) => a.drivingDistance - b.drivingDistance);
        
          setHospitals(enriched);
          setNearest(enriched[0] || null);
        })

      .catch((err) => {
        console.error("Overpass failed completely:", err);
        alert("Unable to load hospitals right now. Please try again later.");
      });
  }, [position]);

  // -------------------------------
  // 3. RENDER
  // -------------------------------
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
