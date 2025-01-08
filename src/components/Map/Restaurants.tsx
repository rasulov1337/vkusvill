import { locationIcon } from "@/app/Icon";
import { createRoot } from "react-dom/client";
import { useMap } from "react-leaflet";
import RestaurantPopup from "../RestaurantPopup/RestaurantPopup";
import { Layer } from "leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { RestaurantData } from "@/Types";

const RestaurantClusterMarkers = ({
    restaurants,
}: {
    restaurants: RestaurantData[];
}) => {
    const map = useMap();

    useEffect(() => {
        if (!restaurants.length) return;

        const markerClusterGroup = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                const count = cluster.getChildCount();

                const fraction = Math.round(count / 5);
                let zincColor = 950;

                if (fraction < 0.5) {
                    zincColor = 800;
                }

                return L.divIcon({
                    html: `<div class="flex items-center justify-center text-zinc-${
                        950 - zincColor
                    } text-lg bg-zinc-${zincColor} border-2 border-zinc-700 rounded-full w-10 h-10">${count}</div>`,
                    className: "custom-cluster-icon",
                    iconSize: L.point(40, 40, true),
                });
            },

            chunkedLoading: true,
            showCoverageOnHover: true,
            polygonOptions: {
                color: "#3f3f46",
                weight: 2,
                opacity: 0.9,
                fillColor: "#3f3f46",
                fillOpacity: 0.3,
            },
        });

        const markers = [] as Layer[];
        restaurants.forEach((el) => {
            const marker = L.marker(
                [
                    el.Cells.geoData.coordinates[1],
                    el.Cells.geoData.coordinates[0],
                ],
                { icon: locationIcon }
            );

            const popupContainer = document.createElement("div");
            const root = createRoot(popupContainer);
            root.render(<RestaurantPopup restaurant={el} />);

            const popup = L.popup({
                className: "custom-popup",
                closeButton: false,
                closeOnClick: false,
            }).setContent(popupContainer);

            let isMouseOverPopup = false;

            marker.on("mouseover", () => {
                marker.bindPopup(popup).openPopup();
            });

            popupContainer.addEventListener("mouseover", () => {
                isMouseOverPopup = true;
            });

            popupContainer.addEventListener("mouseout", () => {
                isMouseOverPopup = false;
                setTimeout(() => {
                    if (!isMouseOverPopup) {
                        marker.closePopup();
                    }
                }, 200);
            });

            marker.on("mouseout", () => {
                setTimeout(() => {
                    if (!isMouseOverPopup) {
                        marker.closePopup();
                    }
                }, 200);
            });

            markers.push(marker);
        });

        markerClusterGroup.addLayers(markers);
        map.addLayer(markerClusterGroup);

        return () => {
            map.removeLayer(markerClusterGroup);
        };
    }, [restaurants, map]);

    return null;
};

export default RestaurantClusterMarkers;
