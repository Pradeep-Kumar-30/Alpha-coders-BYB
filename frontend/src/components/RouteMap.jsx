import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function RouteMap({
  fromLocation,
  toLocation,
  routes,
  selectedRouteId,
  onRouteSelect,
}) {
  if (!fromLocation || !toLocation) {
    return (
      <div className="map-placeholder">
        <p>Select start and destination to view routes</p>
      </div>
    );
  }

  // Calculate center between from and to
  const centerLat = (fromLocation.lat + toLocation.lat) / 2;
  const centerLng = (fromLocation.lng + toLocation.lng) / 2;

  // Color function based on risk score (lower = safer = greener)
  const getPolylineColor = (risk) => {
    if (risk < 2) return "#22c55e"; // Green (safe)
    if (risk < 4) return "#eab308"; // Yellow (moderate)
    if (risk < 6) return "#f97316"; // Orange (risky)
    return "#ef4444"; // Red (very risky)
  };

  // Custom marker icons
  const startIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const endIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={13}
      style={{
        height: "100%",
        width: "100%",
        borderRadius: "8px",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />

      {/* Start marker */}
      <Marker position={[fromLocation.lat, fromLocation.lng]} icon={startIcon}>
        <Popup>
          <strong>Start</strong>
          <p>{fromLocation.address}</p>
        </Popup>
      </Marker>

      {/* End marker */}
      <Marker position={[toLocation.lat, toLocation.lng]} icon={endIcon}>
        <Popup>
          <strong>Destination</strong>
          <p>{toLocation.address}</p>
        </Popup>
      </Marker>

      {/* Route polylines */}
      {routes.map((route) => {
        if (!route.geometry || !route.geometry.coordinates) return null;

        const coordinates = route.geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);

        const isSelected = selectedRouteId === route.id;
        const color = getPolylineColor(route.risk || 3);

        return (
          <Polyline
            key={route.id}
            positions={coordinates}
            color={color}
            weight={isSelected ? 5 : 3}
            opacity={isSelected ? 1 : 0.6}
            dashArray={isSelected ? "" : "5, 5"}
            eventHandlers={{
              click: () => onRouteSelect(route.id),
            }}
          >
            <Popup>
              <div className="route-popup">
                <strong>Route {route.id}</strong>
                <p>
                  Distance: {(route.distance / 1000).toFixed(2)} km
                </p>
                <p>
                  Duration: {Math.ceil(route.duration / 60)} mins
                </p>
                <button
                  onClick={() => onRouteSelect(route.id)}
                  style={{
                    marginTop: "8px",
                    padding: "6px 12px",
                    backgroundColor: color,
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isSelected ? "Selected" : "Select Route"}
                </button>
              </div>
            </Popup>
          </Polyline>
        );
      })}
    </MapContainer>
  );
}
