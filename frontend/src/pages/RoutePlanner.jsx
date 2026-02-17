import "./RoutePlanner.css";
import Navbar from "../components/Navbar";
import { MapPin, Navigation, Clock, Search } from "lucide-react";
import { useState } from "react";
import { fetchOSRMRoutes } from "../utils/osrm";
import { createRankedRoutes } from "../utils/routeranking";
import { api } from "../utils/api";
import RouteMap from "../components/RouteMap";


export default function SafeRoutePlanner() {
  const [mode, setMode] = useState("now");
  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);


  // FROM
  const [fromText, setFromText] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [loadingFrom, setLoadingFrom] = useState(false);
  const [locLoading, setLocLoading] = useState(false);


  // TO
  const [toText, setToText] = useState("");
  const [destination, setDestination] = useState(null);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loadingTo, setLoadingTo] = useState(false);

  // SCHEDULE
  const [scheduleDateTime, setScheduleDateTime] = useState("");

  /* ---------- AUTOCOMPLETE ---------- */
  const fetchSuggestions = async (query, setList, setLoading) => {
    if (!query || query.length < 3) {
      setList([]);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`
      );
      const data = await res.json();

      setList(
        data.map((item) => ({
          address: item.display_name,
          lat: item.lat,
          lng: item.lon,
        }))
      );
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* ---------- DEPARTURE TIME ---------- */
  const getDepartureTime = () => {
    if (mode === "now") {
      return new Date().toISOString();
    }

    if (!scheduleDateTime) {
      alert("Please select date and time");
      return null;
    }

    return new Date(scheduleDateTime).toISOString();
  };


  const handleFindRoutes = async () => {
  setLoadingRoutes(true);

  if (!currentLocation || !destination) {
    alert("Please select start and destination");
    setLoadingRoutes(false);
    return;
  }

  try {
    const osrmRoutes = await fetchOSRMRoutes(
      currentLocation,
      destination
    );

    console.log("OSRM Routes:", osrmRoutes);

    const departureTime = getDepartureTime();
    
    // Use backend API to rank routes with safety data
    const rankedRoutes = await api.routes.rankRoutes(
      osrmRoutes,
      currentLocation,
      destination,
      departureTime
    );
    
    // Fallback to local ranking if backend doesn't return formatted data
    if (!rankedRoutes || rankedRoutes.length === 0) {
      const localRanked = await createRankedRoutes(osrmRoutes);
      setRoutes(localRanked);
    } else {
      setRoutes(rankedRoutes);
    }

  } catch (err) {
    console.error(err);
    // Fallback to local route ranking if backend fails
    try {
      const osrmRoutes = await fetchOSRMRoutes(
        currentLocation,
        destination
      );
      const rankedRoutes = await createRankedRoutes(osrmRoutes);
      setRoutes(rankedRoutes);
    } catch {
      alert("Failed to fetch routes");
    }
  }

  setLoadingRoutes(false);
};

  /* ---------- GPS ---------- */
  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();

          setCurrentLocation({
            lat,
            lng,
            address: data.display_name,
          });
          setFromText(data.display_name);
        } catch {
          setFromText("Current location");
        }

        setLocLoading(false);
      },
      () => {
        alert("Location permission denied");
        setLocLoading(false);
      }
    );
  };

  return (
    <>
      <Navbar />

      <div className="planner-page">
        <div className="planner-left">
          <div className="planner-card">

            {/* ---------- FROM ---------- */}
            <div className="input-group">
              <MapPin className="icon teal" size={18} />

              <div className="destination-wrapper">
                <input
                  type="text"
                  placeholder="From where?"
                  value={fromText}
                  onChange={(e) => {
                    setFromText(e.target.value);
                    fetchSuggestions(
                      e.target.value,
                      setFromSuggestions,
                      setLoadingFrom
                    );
                  }}
                />

                {loadingFrom && <div className="loader">Searching…</div>}

                {fromSuggestions.length > 0 && (
                  <div className="suggestions-box">
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
                  </div>
                )}
              </div>

              <Navigation
                size={18}
                className={`icon action ${locLoading ? "loading" : ""}`}
                onClick={detectCurrentLocation}
              />
            </div>

            {/* ---------- TO ---------- */}
            <div className="input-group">
              <MapPin className="icon red" size={18} />

              <div className="destination-wrapper">
                <input
                  type="text"
                  placeholder="Where do you want to go?"
                  value={toText}
                  onChange={(e) => {
                    setToText(e.target.value);
                    fetchSuggestions(
                      e.target.value,
                      setToSuggestions,
                      setLoadingTo
                    );
                  }}
                />

                {loadingTo && <div className="loader">Searching…</div>}

                {toSuggestions.length > 0 && (
                  <div className="suggestions-box">
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
                  </div>
                )}
              </div>
            </div>

            {/* ---------- TIME MODE ---------- */}
            <div className="time-row">
              <button
                className={`time-btn ${mode === "now" ? "active" : ""}`}
                onClick={() => setMode("now")}
              >
                <Clock size={16} /> Leave now
              </button>

              <button
                className={`time-btn ${mode === "schedule" ? "active" : ""}`}
                onClick={() => setMode("schedule")}
              >
                <Clock size={16} /> Schedule
              </button>
            </div>

            {/* ---------- SCHEDULE (CORRECT) ---------- */}
            {mode === "schedule" && (
              <div className="input-group">
                <Clock className="icon teal" size={18} />
                <input
                  type="datetime-local"
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                />
              </div>
            )}

            

            {/* ---------- CTA ---------- */}
           <button
  className="find-btn"
  onClick={handleFindRoutes}
  disabled={loadingRoutes}
>
  <Search size={18} />
  {loadingRoutes ? "Finding routes..." : "Find Safe Routes"}
</button>

          </div>
        </div>


        {/* RIGHT SIDE */}

        
       <div className="planner-right">
          {routes.length > 0 ? (
            <>
              {selectedRouteId && (
                <div className="route-factors">
                  <h3>Route Safety Factors</h3>
                  <div className="factors-grid">
                    <div className="factor-item">
                      <span className="factor-icon">🛣️</span>
                      <p className="factor-label">Lighting</p>
                      <p className="factor-value">Well Lit</p>
                    </div>
                    <div className="factor-item">
                      <span className="factor-icon">👥</span>
                      <p className="factor-label">Crowd Level</p>
                      <p className="factor-value">Moderate</p>
                    </div>
                    <div className="factor-item">
                      <span className="factor-icon">🚔</span>
                      <p className="factor-label">Police Presence</p>
                      <p className="factor-value">Visible</p>
                    </div>
                    <div className="factor-item">
                      <span className="factor-icon">⚠️</span>
                      <p className="factor-label">Recent Reports</p>
                      <p className="factor-value">2 in last 24h</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="map-container">
                <RouteMap
                  fromLocation={currentLocation}
                  toLocation={destination}
                  routes={routes}
                  selectedRouteId={selectedRouteId}
                  onRouteSelect={setSelectedRouteId}
                />
              </div>

              <div className="routes-list">
                {loadingRoutes ? (
                  <div className="routes-empty">
                    <h3>Finding safest routes…</h3>
                  </div>
                ) : (
                  routes.map((route) => (
                    <div
                      key={route.id}
                      className={`route-card ${route.color} ${
                        selectedRouteId === route.id ? "selected" : ""
                      }`}
                      onClick={() => setSelectedRouteId(route.id)}
                    >
                      <div className="route-header">
                        <h4>{route.label} Route</h4>
                        <span className="badge">{route.label}</span>
                      </div>

                      <div className="route-metrics">
                        <p>🛡 Safety: ⭐ {route.safety.toFixed(1)}</p>
                        <p>⏱ Time: {(route.duration / 60).toFixed(0)} mins</p>
                        <p>📏 Distance: {(route.distance / 1000).toFixed(2)} km</p>
                      </div>

                      <button
                        className="select-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRouteId(route.id);
                        }}
                      >
                        {selectedRouteId === route.id
                          ? "✓ Selected"
                          : "Start Route"}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="routes-empty">
              <div className="empty-icon">📍</div>
              <h3>Routes will appear here</h3>
              <p>
                Enter start and destination to view the safest routes based on
                community insights.
              </p>
            </div>
          )}
        </div>


      </div>
    </>
  );
}
