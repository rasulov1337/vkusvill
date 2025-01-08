"use client";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";

import axios from "axios";
import L, { Layer } from "leaflet";
import "leaflet.markercluster";

import { locationIcon, busStopIcon } from "@/app/Icon";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";

import BusStopPopup from "@/components/BusStopPopup/BusStopPopup";

import Filter from "../Filters/Filter";

import * as Types from "@/Types";

L.Icon.Default.imagePath = "/images/";

import { createRoot } from "react-dom/client";
import RestaurantPopup from "../RestaurantPopup/RestaurantPopup";

const MIN_ZOOM_FOR_BUS_STOPS = 17;

const BusStopsClusterMarkers = ({
    busStops,
}: {
    busStops: Types.BusStopsData[];
}) => {
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

const RestaurantClusterMarkers = ({
    restaurants,
}: {
    restaurants: Types.RestaurantData[];
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

export default function Map() {
    const [data, setData] = useState<Types.RestaurantData[]>([]);
    const [busStops, setBusStops] = useState([]);
    const [filterValues, setFilterValues] = useState<Types.Filter>({
        objectType: "",
        companyName: "",
        isNet: undefined,
    });
    const [debounceTimeout, setDebounceTimeout] = useState<
        NodeJS.Timeout | undefined
    >(undefined);

    useEffect(() => {
        // Fetch bus stops only once
        axios
            .get(
                `https://apidata.mos.ru/v1/datasets/752/rows?api_key=${process.env.NEXT_PUBLIC_API_KEY}&$filter=EntryState eq 'активна'`
            )
            .then(({ data }) => {
                setBusStops(data);
            });
    }, []);

    useEffect(() => {
        let fetchUrl = `https://apidata.mos.ru/v1/datasets/1903/rows?api_key=${process.env.NEXT_PUBLIC_API_KEY}&$filter=`;

        if (filterValues.isNet !== undefined) {
            fetchUrl += `IsNetObject eq ${filterValues.isNet}`;
        }

        if (filterValues.companyName.trim()) {
            fetchUrl += ` and OperatingCompany eq '${filterValues.companyName.trim()}'`;
        }

        if (filterValues.objectType.trim()) {
            fetchUrl += ` and TypeObject eq '${filterValues.objectType.trim()}'`;
        }

        // Debounce!
        clearTimeout(debounceTimeout);
        setDebounceTimeout(
            setTimeout(() => {
                axios.get(fetchUrl).then(({ data }) => {
                    setData(data);
                });
            }, 800)
        );
    }, [filterValues]);

    if (!data || !busStops) return;

    return (
        <MapContainer
            className="relative w-full h-full"
            center={[55.879001531303373, 37.714565000436039]}
            zoom={13}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />

            <BusStopsClusterMarkers busStops={busStops} />
            <RestaurantClusterMarkers
                restaurants={data}
            ></RestaurantClusterMarkers>

            <Filter
                setFilterValues={setFilterValues}
                filterValues={filterValues}
            ></Filter>
        </MapContainer>
    );
}
