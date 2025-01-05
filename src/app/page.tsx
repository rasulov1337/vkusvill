"use client";

import Header from "@/components/Header/Header";
import "../../node_modules/leaflet/dist/leaflet.css";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("../components/Map/Map"), { ssr: false });

export default function Home() {
    return (
        <>
            <Header />
            <Map></Map>
        </>
    );
}
