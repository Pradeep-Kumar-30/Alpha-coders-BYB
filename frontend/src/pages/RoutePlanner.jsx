import "./RoutePlanner.css";
import Navbar from "../components/Navbar";
import {
  MapPin,
  Navigation,
  Clock,
  Search,
  Calendar,
  Footprints,
  Bike,
  Car,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchOSRMRoutes } from "../utils/osrm";

export default function SafeRoutePlanner() {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [vehicleMode, setVehicleMode] = useState("car");
  const [timeMode, setTimeMode] = useState("now");
  const [scheduleDateTime, setScheduleDateTime] = useState("");

  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  const [fromText, setFromText] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);

  const [toText, setToText] = useState("");
  const [destination, setDestination] = useState(null);
  const [toSuggestions, setToSuggestions] = useState([]);

  /* ---------- AUTOCOMPLETE --*/
  const fetchSuggestions = async (query, setList) => {
    if (!query || query.length < 3) {
      setList([]);
      return;
    }

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`
    );
    const data = await res.json();

    setList(
      data.map((item) => ({
        address: item.display_name,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
      }))
    );
  };

  /* ---------- FIND ROUTES ---------- */
  const handleFindRoutes = async () => {
    if (!currentLocation || !destination) {
      alert("Please select start and destination");
      return;
    }

    if (timeMode === "schedule" && !scheduleDateTime) {
      alert("Please select date & time");
      return;
    }

    try {
      setLoadingRoutes(true);

      const osrmRoutes = await fetchOSRMRoutes(
        currentLocation,
        destination,
        vehicleMode
      );

      if (!osrmRoutes || osrmRoutes.length === 0) {
        alert("No routes found");
        return;
      }

      // Sort routes
      const sortedByDuration = [...osrmRoutes].sort(
        (a, b) => a.duration - b.duration
      );

      const sortedByDistance = [...osrmRoutes].sort(
        (a, b) => a.distance - b.distance
      );

      const fastest = sortedByDuration[0];
      const shortest = sortedByDistance[0];
      const balanced =
        sortedByDuration[Math.floor(sortedByDuration.length / 2)] ||
        sortedByDuration[0];

      const finalRoutes = [
        {
          id: 1,
          label: "Safest",
          duration: shortest.duration,
          distance: shortest.distance,
          geometry: shortest.geometry,
          color: "green",
        },
        {
          id: 2,
          label: "Balanced",
          duration: balanced.duration,
          distance: balanced.distance,
          geometry: balanced.geometry,
          color: "blue",
        },
        {
          id: 3,
          label: "Fastest",
          duration: fastest.duration,
          distance: fastest.distance,
          geometry: fastest.geometry,
          color: "orange",
        },
      ];

      setRoutes(finalRoutes);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch routes");
    }

    setLoadingRoutes(false);
  };

  /* ---------- GPS ---------- */
  const detectCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      setCurrentLocation({ lat, lng });
      setFromText("Current Location");
    });
  };

  return (
    <>
      <Navbar />

      <div className="planner-page">
        <div className="planner-left">
          <div className="planner-card">

            {/* FROM */}
            <div className="input-group">
              <MapPin className="icon teal" size={18} />
              <input
                type="text"
                placeholder="From where?"
                value={fromText}
                onChange={(e) => {
                  setFromText(e.target.value);
                  fetchSuggestions(e.target.value, setFromSuggestions);
                }}
              />
              <Navigation
                size={18}
                className="icon action"
                onClick={detectCurrentLocation}
              />
            </div>

            {fromSuggestions.map((place, i) => (
              <div
                key={i}
                className="suggestion-item"
                onClick={() => {
                  setCurrentLocation(place);
                  setFromText(place.address);
                  setFromSuggestions([]);
                }}
              >
                📍 {place.address}
              </div>
            ))}

            {/* TO */}
            <div className="input-group">
              <MapPin className="icon red" size={18} />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={toText}
                onChange={(e) => {
                  setToText(e.target.value);
                  fetchSuggestions(e.target.value, setToSuggestions);
                }}
              />
            </div>

            {toSuggestions.map((place, i) => (
              <div
                key={i}
                className="suggestion-item"
                onClick={() => {
                  setDestination(place);
                  setToText(place.address);
                  setToSuggestions([]);
                }}
              >
                📍 {place.address}
              </div>
            ))}

            {/* VEHICLE MODE */}
            <div className="time-row">
              <button
                className={`time-btn ${vehicleMode === "walk" ? "active" : ""}`}
                onClick={() => setVehicleMode("walk")}
              >
                <Footprints size={16} /> Walk
              </button>

              <button
                className={`time-btn ${vehicleMode === "bike" ? "active" : ""}`}
                onClick={() => setVehicleMode("bike")}
              >
                <Bike size={16} /> Bike
              </button>

              <button
                className={`time-btn ${vehicleMode === "car" ? "active" : ""}`}
                onClick={() => setVehicleMode("car")}
              >
                <Car size={16} /> Car
              </button>
            </div>

            {/* TIME MODE */}
            <div className="time-row">
              <button
                className={`time-btn ${timeMode === "now" ? "active" : ""}`}
                onClick={() => setTimeMode("now")}
              >
                <Clock size={16} /> Leave Now
              </button>

              <button
                className={`time-btn ${timeMode === "schedule" ? "active" : ""}`}
                onClick={() => setTimeMode("schedule")}
              >
                <Calendar size={16} /> Schedule
              </button>
            </div>

            {timeMode === "schedule" && (
              <div className="input-group">
                <Clock size={18} className="icon teal" />
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                />
              </div>
            )}

            {/* CTA */}
            <button
              className="find-btn"
              onClick={handleFindRoutes}
              disabled={loadingRoutes}
            >
              <Search size={18} />
              {loadingRoutes ? "Finding routes..." : "Find Routes"}
            </button>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="planner-right">
          {routes.length === 0 ? (
            <div className="routes-empty">
              <h3>Routes will appear here</h3>
            </div>
          ) : (
            routes.map((route) => (
              <div key={route.id} className={`route-card ${route.color}`}>
                <div className="route-header">
                  <h4>{route.label} Route</h4>
                </div>

                <div className="route-metrics">
                  <p>⏱ Time: {(route.duration / 60).toFixed(0)} mins</p>
                  <p>📏 Distance: {(route.distance / 1000).toFixed(2)} km</p>
                  <p> Mode: {vehicleMode.toUpperCase()}</p>
                  <p>🕒 {timeMode === "now" ? "Leave Now" : "Scheduled"}</p>
                </div>

                <button
                  className="select-btn"
                  onClick={() =>
                    navigate("/map", {
                      state: {
                        routeData: route,
                        start: currentLocation,
                        end: destination,
                        vehicleMode,
                        timeMode,
                        scheduleDateTime,
                      },
                    })
                  }
                >
                  Start Route
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}




