"use client";
import { locationIcon } from "@/app/Icon";
import { createRoot } from "react-dom/client";
import { useMap } from "react-leaflet";
import RestaurantPopup from "../RestaurantPopup/RestaurantPopup";
import { Layer } from "leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { RestaurantData } from "@/Types";

const RestaurantClusterMarkers = ({
    restaurants,
    active,
}: {
    restaurants: RestaurantData[];
    active: boolean;
}) => {
    const map = useMap();
    const [restaurantsLayer] = useState<L.MarkerClusterGroup>(
        L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                const count = cluster.getChildCount();

                const fraction = count / 5;
                const zincColor = Math.round((fraction * 950) / 100) * 100;

                const clampedZincColor = Math.max(
                    100,
                    Math.min(950, zincColor)
                );

                return L.divIcon({
                    html: `<div class="flex items-center justify-center text-zinc-0 text-lg bg-zinc-${clampedZincColor} border-2 border-zinc-700 rounded-full w-10 h-10">${count}</div>`,
                    className: "custom-cluster-icon",
                    iconSize: L.point(40, 40, true),
                });
            },

            chunkedLoading: true,
            showCoverageOnHover: true,
            spiderfyOnMaxZoom: true,
            polygonOptions: {
                color: "#3f3f46",
                weight: 2,
                opacity: 0.9,
                fillColor: "#3f3f46",
                fillOpacity: 0.3,
            },
        })
    );

    useEffect(() => {
        if (!restaurants.length) return;

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

        restaurantsLayer.clearLayers();
        restaurantsLayer.addLayers(markers);

        if (active) map.addLayer(restaurantsLayer);

        return () => {
            map.removeLayer(restaurantsLayer);
        };
    }, [restaurants, map]);

    useEffect(() => {
        if (!active) {
            map.removeLayer(restaurantsLayer);
            return;
        }

        map.addLayer(restaurantsLayer);
    }, [active]);

    return null;
};

export default RestaurantClusterMarkers;
