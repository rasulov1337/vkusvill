import { busStopIcon } from "@/app/Icon";
import BusStopPopup from "@/components/BusStopPopup/BusStopPopup";
import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
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

    useEffect(() => {
        if (!busStops.length) return;

        const updateBusStops = () => {
            const bounds = map.getBounds();

            // Фильтруем остановки по текущим границам карты
            const visibleBusStops = busStops.filter((el) => {
                const [lng, lat] = el.Cells.geoData.coordinates;
                return bounds.contains([lat, lng]);
            });

            busStopLayer.clearLayers(); // Очищаем старые маркеры

            visibleBusStops.forEach((el) => {
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
        };

        map.on("moveend", updateBusStops);

        updateBusStops();

        return () => {
            map.off("moveend", updateBusStops);
            busStopLayer.clearLayers();
        };
    }, [busStops, map, busStopLayer]);

    useEffect(() => {
        const updateLayerVisibility = () => {
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
        };

        map.on("zoomend", updateLayerVisibility);
        updateLayerVisibility();

        return () => {
            map.off("zoomend", updateLayerVisibility);
        };
    }, [active, map, busStopLayer]);

    return null;
};

export default BusStops;
