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
      setPosition([3.8480, 11.5021]); // Yaoundé
    }

    navigator.geolocation.getCurrentPosition(success, error);

    timeoutId = setTimeout(() => {
      console.warn("Geolocation timed out — using fallback");
      setPosition([3.8480, 11.5021]); // Yaoundé
    }, 5000);
  }, []);

  // -------------------------------
  // 2. FETCH HOSPITALS + ROUTING
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

        async function getDrivingDistance(h) {
          if (!h.lat || !h.lon) {
            return {
              ...h,
              drivingDistance: null,
              drivingDuration: null,
            };
          }

          try {
            const url = `https://router.project-osrm.org/route/v1/driving/${lon},${lat};${h.lon},${h.lat}?overview=false`;
            const res = await fetch(url);
            const json = await res.json();

            if (json.routes && json.routes.length > 0) {
              return {
                ...h,
                drivingDistance: json.routes[0].distance,
                drivingDuration: json.routes[0].duration,
              };
            }
          } catch (err) {
            console.warn("OSRM routing failed:", err);
          }

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

        //finds deoartments available in the hospital and puts them in an array
        const departments = Array.from(
        new Set(
          enriched.map(h =>
            h.tags?.["healthcare:speciality"] ||
            h.tags?.department ||
            "General"
          )
        )
      );

        const [selectedDept, setSelectedDept] = useState("All");

        //sorts hospitals by driving distance
        enriched.sort((a, b) => a.drivingDistance - b.drivingDistance);

        setHospitals(enriched);
        setNearest(enriched[0] || null);
      })
      .catch((err) => {
        console.error("Overpass failed completely:", err);
        alert("Unable to load hospitals right now. Please try again later.");
      });
  }, [position]);

  const filteredHospitals = selectedDept === "All"
  ? hospitals
  : hospitals.filter(h => {
      const dept =
        h.tags?.["healthcare:speciality"] ||
        h.tags?.department ||
        "General";
      return dept === selectedDept;
    });

  // -------------------------------
  // 3. RENDER
  // -------------------------------
      if (!position) return <p>Getting your location…</p>;
    
      return (
        //list de departements
        <div className="flex gap-2 overflow-x-auto mb-4">
  <button
    onClick={() => setSelectedDept("All")}
    className={selectedDept === "All" ? "bg-blue-600 text-white px-4 py-2 rounded-full" : "bg-white text-gray-700 px-4 py-2 rounded-full"}
  >
    All
  </button>

  {departments.map((dept) => (
    <button
      key={dept}
      onClick={() => setSelectedDept(dept)}
      className={selectedDept === dept ? "bg-blue-600 text-white px-4 py-2 rounded-full" : "bg-white text-gray-700 px-4 py-2 rounded-full"}
    >
      {dept}
    </button>
  ))}
</div>

    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
      {/* LEFT: Map */}
      <MapContainer
        center={position}
        zoom={14}
        style={{
          height: "450px",
          width: "65%",
          borderRadius: "12px"
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={position} icon={UserIcon}>
          <Popup>You are here</Popup>
        </Marker>
    
        {hospitals.map((h) => {
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
                Distance: {h.drivingDistance
                  ? (h.drivingDistance / 1000).toFixed(2) + " km"
                  : "Unknown"}
                <br />
                {h.drivingDuration
                  ? `Drive time: ${(h.drivingDuration / 60).toFixed(0)} min`
                  : ""}
                <br />
                {isNearest && <strong>⭐ Nearest hospital</strong>}
                <br />
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`,
                      "_blank"
                    )
                  }
                  style={{
                    marginTop: "6px",
                    padding: "6px 10px",
                    background: "#1a73e8",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                >
                  Navigate
                </button>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    
      {/* RIGHT: Hospital list */}
 {/* RIGHT: Hospital list */}
<div
  style={{
    width: "35%",
    maxHeight: "450px",
    overflowY: "auto",
    padding: "10px",
    borderRadius: "12px",
    background: "#f8f9fa",
    border: "1px solid #ddd"
  }}
>
  <h3 className="text-lg font-semibold mb-4">Hospitals near you</h3>

  <div className="space-y-3">
    {hospitals.map((h, i) => (
      <div
        key={i}
        className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800">
              {h.tags?.name || "Hospital"}
            </h4>

            <p className="text-xs text-gray-500">
              {h.tags?.addr_full || "No address available"}
            </p>

            <div className="flex items-center gap-3 mt-2 text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <span className="text-red-500">📍</span>
                {h.drivingDistance
                  ? (h.drivingDistance / 1000).toFixed(2) + " km"
                  : "Unknown"}
              </span>

              {h.drivingDuration && (
                <span className="flex items-center gap-1 text-gray-600">
                  <span className="text-green-500">⏱</span>
                  {(h.drivingDuration / 60).toFixed(0)} min
                </span>
              )}
            </div>
          </div>

          {/* CALL BUTTON */}
          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`,
                "_blank"
              )
            }
            className="bg-red-100 text-red-600 p-3 rounded-full hover:bg-red-200 transition-colors"
          >
            📞
          </button>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-3 mt-3">
          <button
            onClick={() => showOnMap(h)}
            className="flex-1 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Show on map
          </button>

          <button
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${h.lat},${h.lon}`,
                "_blank"
              )
            }
            className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg hover:bg-green-200 transition-colors"
          >
            Navigate
          </button>
        </div>
      </div>
    ))}
  </div>  
</div>     
</div>     

  );
}
