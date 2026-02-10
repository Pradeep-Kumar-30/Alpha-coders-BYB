import { create } from "zustand";

export const useLocationStore = create((set, get) => ({
  location: null,       // { lat, lng }
  placeName: null,      // human readable
  status: "idle",       // idle | loading | granted | denied
  error: null,

  fetchLocation: () => {
    if (get().location) return;

    if (!navigator.geolocation) {
      set({ status: "denied", error: "Geolocation not supported" });
      return;
    }

    set({ status: "loading", error: null });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            {
              headers: {
                // required by OSM policy
                "User-Agent": "Saferoute-App",
              },
            }
          );

          const data = await res.json();

          const addr = data.address || {};
          const place =
            addr.neighbourhood ||
            addr.suburb ||
            addr.village ||
            addr.town ||
            addr.city ||
            "Nearby area";

          set({
            location: { lat, lng },
            placeName: place,
            status: "granted",
          });
        } catch (err) {
          set({
            location: { lat, lng },
            placeName: "Nearby area",
            status: "granted",
          });
        }
      },
      () => {
        set({ status: "denied", error: "Location permission denied" });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
      }
    );
  },

  clearLocation: () =>
    set({
      location: null,
      placeName: null,
      status: "idle",
      error: null,
    }),
}));
