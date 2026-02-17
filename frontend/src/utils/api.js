const API_BASE_URL = "http://localhost:8000/api";

export const api = {
  // Auth endpoints
  auth: {
    anonymousLogin: async (deviceId, fingerprint) => {
      const res = await fetch(`${API_BASE_URL}/auth/anonymous-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ deviceId, fingerprint }),
      });
      if (!res.ok) throw new Error("Login failed");
      return res.json();
    },
  },

  // Location endpoints
  location: {
    updatePermission: async (userId, allowed) => {
      const res = await fetch(`${API_BASE_URL}/location/permission`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, allowed }),
      });
      if (!res.ok) throw new Error("Failed to update permission");
      return res.json();
    },
  },

  // Routes endpoints
  routes: {
    rankRoutes: async (routes, startPoint, endPoint, departureTime) => {
      const res = await fetch(`${API_BASE_URL}/routes/rank`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          routes,
          startPoint,
          endPoint,
          departureTime,
        }),
      });
      if (!res.ok) throw new Error("Failed to rank routes");
      return res.json();
    },
  },

  // Reports endpoints
  reports: {
    submit: async (reportData) => {
      const res = await fetch(`${API_BASE_URL}/reports/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(reportData),
      });
      if (!res.ok) throw new Error("Failed to submit report");
      return res.json();
    },
    getNearby: async (lat, lng, radius = 1) => {
      const res = await fetch(
        `${API_BASE_URL}/reports/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
        {
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch nearby reports");
      return res.json();
    },
  },
};
