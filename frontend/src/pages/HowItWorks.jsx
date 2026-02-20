import Navbar from "../components/Navbar";
import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <>
      <Navbar />

      <div className="how-wrapper">
        <div className="how-container">
          <h1>How SafeRoute Works</h1>
          <p className="how-subtitle">
            Your safety-first navigation powered by community intelligence.
          </p>

          <div className="steps">

            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Anonymous Sign Up</h3>
              <p>
                We generate a secure anonymous ID tied to your device. 
                No personal data, no email, no tracking.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Enable Location</h3>
              <p>
                Location access helps us suggest safer routes 
                and show real-time nearby safety alerts.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Plan Safe Routes</h3>
              <p>
                Enter your destination and we analyze community reports 
                to suggest the safest possible path.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Rate & Report</h3>
              <p>
                Help others by rating routes and reporting unsafe areas. 
                Your feedback improves safety for everyone.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}