import { busStopIcon } from "@/app/Icon";

import BusStopPopup from "@/components/BusStopPopup/BusStopPopup";
import { useEffect, useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";

import { BusStopsData } from "@/Types";
import L from "leaflet";
import { createRoot } from "react-dom/client";

const MIN_ZOOM_FOR_BUS_STOPS = 16;

const BusStops = ({
    busStops,
    active,
}: {
    busStops: BusStopsData[];
    active: boolean;
}) => {
    const map = useMap();
    const [busStopLayer] = useState(L.layerGroup());

    useMapEvent("zoomend", () => {
        if (!active) return;

        const currentZoom = map.getZoom();

        if (currentZoom >= MIN_ZOOM_FOR_BUS_STOPS) {
            map.addLayer(busStopLayer);
        } else {
            map.removeLayer(busStopLayer);
        }
    });

    useEffect(() => {
        if (!busStops.length) return;

        busStops.forEach((el) => {
            const marker = L.marker(
                [
                    el.Cells.geoData.coordinates[1],
                    el.Cells.geoData.coordinates[0],
                ],
                { icon: busStopIcon }
            );

            const popupContainer = document.createElement("div");
            const root = createRoot(popupContainer);
            root.render(<BusStopPopup busStop={el} />);

            const popup = L.popup({
                className: "custom-popup",
                closeButton: false,
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
            busStopLayer.addLayer(marker);
        });

        return () => {
            map.removeLayer(busStopLayer);
        };
    }, [busStops, map]);

    useEffect(() => {
        if (!active) {
            map.removeLayer(busStopLayer);
            return;
        }

        const currentZoom = map.getZoom();
        if (currentZoom >= MIN_ZOOM_FOR_BUS_STOPS) {
            map.addLayer(busStopLayer);
        } else {
            map.removeLayer(busStopLayer);
        }
    }, [active]);

    return null;
};

export default BusStops;
