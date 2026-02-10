import { useState, useEffect } from "react";
import "./Ratings.css";
import Navbar from "../components/Navbar";
import { useLocationStore } from "../Counterstore";

export default function RateRoute() {
  const [routeSource, setRouteSource] = useState(null);
  const [routeSelected, setRouteSelected] = useState(false);

  const [safetyScore, setSafetyScore] = useState(0);
  const [lighting, setLighting] = useState("");
  const [crowd, setCrowd] = useState("");
  const [police, setPolice] = useState("");
  const [incidentTags, setIncidentTags] = useState([]);
  const [comment, setComment] = useState("");
 
const { location, status, fetchLocation,placeName } = useLocationStore();
useEffect(() => {
  if (status === "granted" && location) {
    setRouteSource("current");
    setRouteSelected(true);
  }
}, [status, location]);


  const incidentOptions = [
    "Eve-teasing",
    "Theft / Snatching",
    "Harassment",
    "Drunk people",
    "No issues",
  ];

  const handleCurrentRoute = () => {
  fetchLocation();
};


  const selectRoute = (type) => {
    setRouteSource(type);
    setRouteSelected(true);
  };

  const toggleIncident = (tag) => {
    setIncidentTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <>
      <Navbar />

      

      {/* HEADER */}
      <section className="rate-header">
        
        <p>Your feedback strengthens time-aware, community-verified safety.</p>
      </section>

      {/* MAIN LAYOUT */}
      <section className="rate-layout">
        {/* LEFT COLUMN */}
        <div className="route-selector">
          <h3>Select route to rate</h3>

          <button
  type="button" disabled={status === "loading"}
  className={`select-route-btn ${
    routeSource === "current" ? "active" : ""
  }`}
  onClick={handleCurrentRoute}
>
  📍 Rate from current location
  <span><span>
    {status === "idle" && "Use your live location"}
    {status === "loading" && "Detecting location…"}
    {status === "granted" && placeName && `Near ${placeName}`}
    {status === "denied" && "Location permission required"}
  </span></span>
</button>


          <button
            type="button"
            className={`select-route-btn ${
              routeSource === "last" ? "active" : ""
            }`}
            onClick={() => selectRoute("last")}
          >
            🕘 Rate last visited route
            <span>Recently travelled route</span>
          </button>

          <button
            type="button"
            className={`select-route-btn ${
              routeSource === "map" ? "active" : ""
            }`}
            onClick={() => selectRoute("map")}
          >
            🗺️ Select route from map
            <span>Only previously visited routes</span>
          </button>

          <p className="route-note">
            We only allow rating routes you’ve actually travelled.
          </p>
        </div>




        {/* RIGHT COLUMN */}
        <div className="route-card">

          {/* LOCATION STATUS */}
{status === "loading" && (
  <p className="location-info">📡 Getting your location…</p>
)}

{status === "granted" && routeSource === "current" && (
  <p className="location-info">📍 Using current location</p>
)}

{status === "denied" && (
  <p className="location-error">
    ⚠️ Location permission required to rate this route
  </p>
)}

          {!routeSelected ? (
            <p className="placeholder-text">
              Select a route to start rating its safety.
            </p>
          ) : (
            <>
              {/* TIME CONTEXT */}
              <p className="time-context">
                🕒 Time of travel: Night (after 9 PM)
              </p>

              {/* SAFETY SCORE */}
              <h3 className="section-title">Overall Safety</h3>
              <div className="star-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={`star ${safetyScore >= s ? "active" : ""}`}
                    onClick={() => setSafetyScore(s)}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* CONDITIONS */}
              <h3 className="section-title">Route Conditions</h3>
              <div className="option-grid">
                <SelectGroup
                  label="Lighting"
                  options={["Well lit", "Partially lit", "Poor / dark"]}
                  value={lighting}
                  onChange={setLighting}
                />
                <SelectGroup
                  label="Crowd Level"
                  options={["Crowded", "Moderate", "Isolated"]}
                  value={crowd}
                  onChange={setCrowd}
                />
                <SelectGroup
                  label="Police Presence"
                  options={["Visible", "Sometimes", "Not present"]}
                  value={police}
                  onChange={setPolice}
                />
              </div>

              {/* INCIDENTS */}
              <h3 className="section-title">Incidents Observed</h3>
              <div className="tag-grid">
                {incidentOptions.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-btn ${
                      incidentTags.includes(tag) ? "active" : ""
                    }`}
                    onClick={() => toggleIncident(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* COMMENT */}
              <textarea
                className="rate-comment"
                placeholder="Optional note (e.g. Safe till 9 PM)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={200}
              />

              {/* SUBMIT */}
              <button
                className="submit-rating"
                disabled={safetyScore === 0}
              >
                Submit Anonymous Report
              </button>

              <p className="trust-note">
                🔒 Anonymous · One-device-one-weight · Time-aware
              </p>
            </>
          )}
        </div>
      </section>
    </>
  );
}

/* REUSABLE SELECT GROUP */
function SelectGroup({ label, options, value, onChange }) {
  return (
    <div className="select-group">
      <p className="select-label">{label}</p>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`option-btn ${value === opt ? "active" : ""}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
