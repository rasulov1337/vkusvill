import { Input } from "@/components/ui/input";
import "./Filter.scss";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import L from "leaflet";

export default function Filter() {
    // Disable map grabbing & scrolling on filter element mouse events
    useEffect(() => {
        const filterElement = document.querySelector(".filter") as HTMLElement;
        if (filterElement) {
            L.DomEvent.disableClickPropagation(filterElement);
            L.DomEvent.disableScrollPropagation(filterElement);
        }
    }, []);

    return (
        <div className="filter leaflet-control" draggable="false">
            <Label>Название управляющей компании</Label>
            <Input placeholder="Название управляющей компании"></Input>

            <Label htmlFor="object-type">Тип объекта</Label>
            <Select>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent className="on-map" id="object-type">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
                <Switch id="switch" />
                <Label htmlFor="switch">Сетевой?</Label>
            </div>
        </div>
    );
}
