"use client";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet/dist/leaflet.css";

import axios from "axios";
import L from "leaflet";
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

const ClusterMarkers = ({ busStops }: { busStops: Types.BusStopsData[] }) => {
    const map = useMap();

    useEffect(() => {
        if (!busStops.length) return;

        const markerClusterGroup = L.markerClusterGroup();
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

            const popup = L.popup({ className: "custom-popup" }).setContent(
                popupContainer
            );

            marker.on("mouseover", () => {
                marker.bindPopup(popup).openPopup();
            });

            marker.on("mouseout", () => {
                marker.closePopup();
            });

            markerClusterGroup.addLayer(marker);
        });

        map.addLayer(markerClusterGroup);

        return () => {
            map.removeLayer(markerClusterGroup);
        };
    }, [busStops, map]);

    return null;
};

const RestaurantClusterMarkers = ({
    busStops,
}: {
    busStops: Types.RestaurantData[];
}) => {
    const map = useMap();

    useEffect(() => {
        if (!busStops.length) return;

        const markerClusterGroup = L.markerClusterGroup();
        busStops.forEach((el) => {
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

            const popup = L.popup({ className: "custom-popup" }).setContent(
                popupContainer
            );

            marker.on("mouseover", () => {
                marker.bindPopup(popup).openPopup();
            });

            marker.on("mouseout", () => {
                marker.closePopup();
            });

            markerClusterGroup.addLayer(marker);
        });

        map.addLayer(markerClusterGroup);

        return () => {
            map.removeLayer(markerClusterGroup);
        };
    }, [busStops, map]);

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
                `https://apidata.mos.ru/v1/datasets/752/rows?api_key=${process.env.NEXT_PUBLIC_API_KEY}&$top=10`
            )
            .then(({ data }) => {
                setBusStops(data);
            });
    }, []);

    useEffect(() => {
        let fetchUrl = `https://apidata.mos.ru/v1/datasets/1903/rows?api_key=${process.env.NEXT_PUBLIC_API_KEY}&$top=10&$filter=`;

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

            <ClusterMarkers busStops={busStops} />
            <RestaurantClusterMarkers
                busStops={data}
            ></RestaurantClusterMarkers>

            <Filter
                setFilterValues={setFilterValues}
                filterValues={filterValues}
            ></Filter>
        </MapContainer>
    );
}
