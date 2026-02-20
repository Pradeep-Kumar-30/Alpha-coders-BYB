import "./Home.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function HeroSection() {
  return (
    <div className="hero">
      <Navbar />

      <div className="hero-center">
        <div className="hero-icon">
          <ShieldCheck size={26} />
        </div>

        <h1>
          Ready to Navigate <br />
          <span>Safely?</span>
        </h1>

        <p>
          Join thousands of users who trust SafeRoute for their daily commute.
          <br />
          Your safety is our priority.
        </p>

        <div className="hero-buttons">
          <Link to="/signup" className="primary">
            GET STARTED →
          </Link>

          {/* ✅ FIXED BUTTON */}
          <Link to="/how-it-works" className="secondary">
            HOW IT WORKS →
          </Link>
        </div>

        <div className="hero-stats">
          <span> privacy-first-design</span>
          <span> End-to-End Encrypted</span>
          <span>GDPR Compliant</span>
        </div>
      </div>
    </div>
  );
}
