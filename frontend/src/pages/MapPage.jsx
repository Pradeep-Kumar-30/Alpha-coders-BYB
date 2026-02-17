import { useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar";
import { useEffect, useState, useRef } from "react";

/* 🚗 Better Car Icon */
const carIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/744/744465.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16], // perfect center alignment
});

/* 🔄 Auto follow map smoothly */
function FollowUser({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, {
        duration: 0.5,
      });
    }
  }, [position, map]);

  return null;
}

export default function MapPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { routeData, start, end } = location.state || {};

  const [currentPos, setCurrentPos] = useState(null);
  const watchRef = useRef(null);

  /* ================= REAL GPS TRACKING ================= */
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setCurrentPos([lat, lng]);
      },
      (err) => {
        console.error(err);
        alert("Location permission denied");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    return () => {
      if (watchRef.current) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, []);

  if (!start || !end) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>No route selected</h2>
        <button onClick={() => navigate("/planner")}>
          Back to Planner
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div style={{ height: "90vh" }}>
        <MapContainer
          center={[start.lat, start.lng]}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Start Marker */}
          <Marker position={[start.lat, start.lng]} />

          {/* End Marker */}
          <Marker position={[end.lat, end.lng]} />

          {/* Route Line */}
          {routeData?.geometry && (
            <Polyline
              positions={routeData.geometry.coordinates.map((coord) => [
                coord[1],
                coord[0],
              ])}
              pathOptions={{ color: "blue", weight: 5 }}
            />
          )}

          {/* 🚗 Real GPS Marker */}
          {currentPos && (
            <>
              <Marker position={currentPos} icon={carIcon} />
              <FollowUser position={currentPos} />
            </>
          )}
        </MapContainer>
      </div>
    </>
  );
}




