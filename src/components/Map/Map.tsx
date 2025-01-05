"use client";

import axios from "axios";
import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import "./Map.scss";
import Filter from "../Filters/Filter";

L.Icon.Default.imagePath = "/images/";

export default function Map() {
    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get("/data.json").then(({ data }) => {
            setData(data);
        });
    }, []);

    if (!data) return;

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
            {data.map((el, index) => (
                <Marker
                    key={index}
                    position={[
                        el.Cells.geoData.coordinates[1],
                        el.Cells.geoData.coordinates[0],
                    ]}
                >
                    <Popup>{el.Cells.Name}</Popup>
                </Marker>
            ))}
            <Filter></Filter>
        </MapContainer>
    );
}
