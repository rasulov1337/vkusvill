import L from "leaflet";

export const busStopIcon = new L.Icon({
    iconUrl: "/images/bus-stop.svg",
    iconAnchor: [24, 50],
    popupAnchor: [0, -40],
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined,
    iconSize: new L.Point(48, 50),
    className: "leaflet-bus-icon",
});

export const locationIcon = new L.Icon({
    iconUrl: "/images/location.svg",
    iconAnchor: [25, 50],
    popupAnchor: [0, -40],
    shadowUrl: undefined,
    shadowSize: undefined,
    shadowAnchor: undefined,
    iconSize: new L.Point(50, 50),
    className: "leaflet-location-icon",
});
