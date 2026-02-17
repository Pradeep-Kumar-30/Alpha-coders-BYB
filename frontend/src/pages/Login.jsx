import "./Login.css";
import { getDeviceId } from "../utils/device";
import { getFingerprint } from "../utils/fingerprint";
import { api } from "../utils/api";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function AnonymousLogin({ user, onLogin }) {
  const [step, setStep] = useState(user ? 3 : 1);
  const [locationStatus, setLocationStatus] = useState(null);

  const generateAnonymousId = async () => {
    setStep(2); // show generating screen

    setTimeout(async () => {
      try {
        const deviceId = getDeviceId();
        const fingerprint = await getFingerprint();

        // Call backend API to register anonymous user
        const response = await api.auth.anonymousLogin(deviceId, fingerprint);

        const newUser = {
          deviceId,
          fingerprint,
          userId: response.userId, // Get user ID from backend
          createdAt: new Date().toISOString(),
        };

        localStorage.setItem("anon_user", JSON.stringify(newUser));
        onLogin(newUser);

        setStep(3); // move to location permission
      } catch (error) {
        console.error("Failed to login:", error);
        alert("Failed to connect. Please try again.");
        setStep(1);
      }
    }, 1500);
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocationStatus("Location access granted ✅");
        // Notify backend about location permission
        const user = JSON.parse(localStorage.getItem("anon_user"));
        if (user?.userId) {
          api.location.updatePermission(user.userId, true).catch(err => console.error(err));
        }
      },
      (error) => {
        const message = "Location denied. Some safety features may be limited.";
        setLocationStatus(message);
        // Notify backend about denied location permission
        const user = JSON.parse(localStorage.getItem("anon_user"));
        if (user?.userId) {
          api.location.updatePermission(user.userId, false).catch(err => console.error(err));
        }
      }
    );
  };

  return (
    <>
      <Navbar />

      <div className="login-wrapper">
        <div className="login-card">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div className="icon-badge">🛡️</div>
              <h1>Your Safety, <span>Our Priority</span></h1>

              <p className="login-desc">
                Navigate with confidence using real-time safety insights from
                our community.
              </p>

              <div className="info-box">
                <div>
                  <strong>Anonymous & Secure</strong>
                  <p>
                    A device-based ID prevents fake reports. No personal data is
                    stored or shared.
                  </p>
                </div>

                <div>
                  <strong>Location-Based Safety</strong>
                  <p>
                    Location access helps us suggest safer routes and allow
                    community reporting.
                  </p>
                </div>
              </div>

              <button className="primary-btn" onClick={generateAnonymousId}>
                Generate Anonymous ID
              </button>

              <p className="privacy-note">
                By continuing, you agree to our privacy-first approach.
              </p>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h1>Generating Your Anonymous ID</h1>
              <p className="login-desc">
                Setting up a secure identity on your device…
              </p>

              <div className="loader" />
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h1>Enable Location Access</h1>
              <p className="login-desc">
                Location access allows SafeRoute to suggest safer routes and
                notify you of nearby safety alerts.
              </p>

              <button
                className="location-btn location-primary"
                onClick={requestLocation}
              >
                Allow Location Access
              </button>

              {locationStatus && (
                <p className="location-status">{locationStatus}</p>
              )}

              <p className="privacy-note">
                🔒 Your location is never sold or shared.
              </p>

              {/* DEV ONLY */}
              <button
                className="reset-btn"
                onClick={() => {
                  localStorage.removeItem("anon_user");
                  window.location.reload();
                }}
              >
                Reset Anonymous Session (Dev)
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}
