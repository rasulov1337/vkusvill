import { Card, CardHeader, CardContent } from "@/components/ui/card";

import "./BusStopPopup.scss";

import * as Types from "@/Types";

const BusStopPopup = ({ busStop }: { busStop: Types.BusStopsData }) => (
    <Card>
        <CardHeader className="font-bold text-lg mb-0 pb-0">
            {busStop.Cells.StationName}
        </CardHeader>
        <CardContent className="mt-0 ">
            <p>Автобусная остановка {busStop.Cells.Name}</p>
            Маршруты:
            <ul className="list-disc ms-9">
                {busStop.Cells.RouteNumbers.split("; ").map((stop, index) => (
                    <li key={index}>{stop}</li>
                ))}
            </ul>
        </CardContent>
    </Card>
);

export default BusStopPopup;
