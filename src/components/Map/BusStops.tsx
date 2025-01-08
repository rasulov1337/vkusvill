import { busStopIcon } from "@/app/Icon";

import BusStopPopup from "@/components/BusStopPopup/BusStopPopup";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

import { BusStopsData } from "@/Types";
import L from "leaflet";
import { createRoot } from "react-dom/client";

const MIN_ZOOM_FOR_BUS_STOPS = 17;

const BusStops = ({ busStops }: { busStops: BusStopsData[] }) => {
    const map = useMap();

    useEffect(() => {
        if (!busStops.length) return;

        const busStopLayer = L.layerGroup();

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

        map.on("zoomend", () => {
            const currentZoom = map.getZoom();

            if (currentZoom >= MIN_ZOOM_FOR_BUS_STOPS) {
                map.addLayer(busStopLayer);
            } else {
                map.removeLayer(busStopLayer);
            }
        });

        return () => {
            map.removeLayer(busStopLayer);
        };
    }, [busStops, map]);

    return null;
};

export default BusStops;
