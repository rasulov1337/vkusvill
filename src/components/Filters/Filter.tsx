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
import { useEffect } from "react";
import L from "leaflet";

import * as Types from "@/Types";

export default function Filter({
    filterValues,
    setFilterValues,
}: {
    filterValues: Types.Filter;
    setFilterValues: React.Dispatch<React.SetStateAction<Types.Filter>>;
}) {
    const updateFilterValues = (newValues: Partial<Types.Filter>) => {
        setFilterValues((prevValues) => ({ ...prevValues, ...newValues }));
    };

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
            <Input
                placeholder="Название управляющей компании"
                value={filterValues.companyName}
                onChange={(e) =>
                    updateFilterValues({ companyName: e.target.value })
                }
            ></Input>

            <Label htmlFor="object-type">Тип объекта</Label>
            <Select
                onValueChange={(value) =>
                    updateFilterValues({
                        objectType: value,
                    })
                }
                value={filterValues.objectType}
            >
                <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent className="on-map" id="object-type">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                </SelectContent>
            </Select>

            <Label htmlFor="is-net">Является сетевым</Label>
            <Select
                onValueChange={(value) =>
                    updateFilterValues({
                        isNet:
                            value === "undefined"
                                ? undefined
                                : value === "true",
                    })
                }
                value={
                    filterValues.isNet !== undefined
                        ? `${filterValues.isNet}`
                        : "undefined"
                }
            >
                <SelectTrigger className="w-[100%]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent className="on-map" id="is-net">
                    <SelectItem value="undefined">Не имеет значения</SelectItem>
                    <SelectItem value="true">Да</SelectItem>
                    <SelectItem value="false">Нет</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
