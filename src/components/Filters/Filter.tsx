import { Input } from "@/components/ui/input";
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

const OBJECT_TYPES = [
    "ресторан",
    "бар",
    "кафе",
    "столовая",
    "предприятие быстрого обслуживания",
    "буфет",
    "закусочная",
    "кафетерий",
    "магазин (отдел кулинарии)",
    "заготовочный цех",
    "ночной клуб (дискотека)",
];

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
        <div
            className="leaflet-control text-zinc-50 bg-zinc-950 gap-5 top-1/2 left-5 h-72 flex flex-col select-none box-border rounded-lg p-3.5 -translate-y-1/2"
            draggable="false"
        >
            <div>
                <Label>Название управляющей компании</Label>
                <Input
                    placeholder="Название управляющей компании"
                    value={filterValues.companyName}
                    onChange={(e) =>
                        updateFilterValues({ companyName: e.target.value })
                    }
                ></Input>
            </div>
            <div>
                <Label htmlFor="object-type">Тип объекта</Label>
                <Select
                    onValueChange={(value) =>
                        updateFilterValues({
                            objectType:
                                value === "undefined" ? undefined : value,
                        })
                    }
                    value={filterValues.objectType}
                    defaultValue="undefined"
                >
                    <SelectTrigger className="w-[100%]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                        className="w-[225px] h-[300px] on-map"
                        id="object-type"
                    >
                        <SelectItem value="undefined">Любой</SelectItem>
                        {OBJECT_TYPES.map((type, index) => (
                            <SelectItem key={index} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div>
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
                        <SelectItem value="undefined">Любой</SelectItem>
                        <SelectItem value="true">Да</SelectItem>
                        <SelectItem value="false">Нет</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
