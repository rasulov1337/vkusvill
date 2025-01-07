"use client";

import axios from "axios";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import Filter from "../Filters/Filter";
import "./Map.scss";
import MarkerClusterGroup from "react-leaflet-markercluster";

import "../../../public/dist/react-leaflet-cluster/styles.min.css";

import * as Types from "@/Types";

L.Icon.Default.imagePath = "/images/";

export default function Map() {
    const [data, setData] = useState([]);
    const [busStops, setBusStops] = useState([]);
    const [filterValues, setFilterValues] = useState<Types.Filter>({
        buildingType: undefined,
        companyName: undefined,
        isChain: false,
    });

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
        // axios.get("/data.json").then(({ data }) => {
        // setData(data);
        // });
        // axios.get("/bus_stops.json").then(({ data }) => setBusStops(data));

        let fetchUrl = `https://apidata.mos.ru/v1/datasets/1903/rows?api_key=${process.env.NEXT_PUBLIC_API_KEY}&$top=10&$filter=IsNetObject eq ${filterValues.isChain}`;

        if (filterValues.companyName) {
            fetchUrl += ` and OperatingCompany eq '${filterValues.companyName}'`;
        }

        // if (filterValues.buildingType) {
        //     fetchUrl += ` and TypeObject eq '${filterValues.buildingType}'`
        // }

        axios.get(fetchUrl).then(({ data }) => {
            setData(data);
        });
    }, [filterValues]);

    if (!data || !busStops) return;

    return (
        <MapContainer
            className="map"
            center={[55.879001531303373, 37.714565000436039]}
            zoom={13}
            style={{ height: "90vh", width: "100%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup
                options={{
                    maxClusterRadius: 120, // максимальный радиус кластера
                    iconCreateFunction: (cluster) => {
                        return L.divIcon({
                            html: `<b>${cluster.getChildCount()}</b>`,
                            className: "leaflet-cluster",
                            iconSize: new L.Point(40, 40),
                        });
                    },
                }}
            >
                {busStops.map((el, index) => (
                    <Marker
                        key={index}
                        position={[
                            el.Cells.geoData.coordinates[1],
                            el.Cells.geoData.coordinates[0],
                        ]}
                    >
                        <Popup className="popup">
                            <p className="popup__place-name">
                                {el.Cells.Name + '"'}
                            </p>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>

            <MarkerClusterGroup>
                {data.map((el, index) => (
                    <Marker
                        key={index}
                        position={[
                            el.Cells.geoData.coordinates[1],
                            el.Cells.geoData.coordinates[0],
                        ]}
                    >
                        <Popup className="popup">
                            <p className="popup__place-name">
                                {el.Cells.TypeObject +
                                    ' "' +
                                    el.Cells.Name +
                                    '"'}
                            </p>
                            <p className="popup__operating-company">
                                {el.Cells.OperatingCompany}
                            </p>
                            <p className="popup__operating-company">
                                {el.Cells.Address}
                            </p>
                            <p>Число посадочных мест: {el.Cells.SeatsCount}</p>
                        </Popup>
                    </Marker>
                ))}
            </MarkerClusterGroup>
            <Filter
                setFilterValues={setFilterValues}
                filterValues={filterValues}
            ></Filter>
        </MapContainer>
    );
}
