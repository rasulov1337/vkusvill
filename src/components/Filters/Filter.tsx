import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
    activeLayers,
    setActiveLayers,
}: {
    filterValues: Types.Filter;
    setFilterValues: React.Dispatch<React.SetStateAction<Types.Filter>>;
    activeLayers: Types.ActiveLayers;
    setActiveLayers: React.Dispatch<React.SetStateAction<Types.ActiveLayers>>;
}) {
    const updateFilterValues = (newValues: Partial<Types.Filter>) => {
        setFilterValues((prevValues) => ({ ...prevValues, ...newValues }));
    };

    const updateActiveLayers = (newValues: Partial<Types.ActiveLayers>) => {
        setActiveLayers((prevValues) => ({ ...prevValues, ...newValues }));
    };

    // Disable map grabbing & scrolling on filter element mouse events
    useEffect(() => {
        const filterElement = document.getElementById("filter") as HTMLElement;
        if (filterElement) {
            L.DomEvent.disableClickPropagation(filterElement);
            L.DomEvent.disableScrollPropagation(filterElement);
        }
    }, []);

    const handleReset = () => {
        setFilterValues({
            isNet: undefined,
            companyName: "",
            objectType: "",
        });
        setActiveLayers({
            busStops: true,
            restaurants: true,
        });
    };

    return (
        <div
            id="filter"
            className="leaflet-control text-zinc-50 bg-zinc-950 gap-6 top-1/2 left-5 flex flex-col select-none box-border rounded-lg p-5 -translate-y-1/2 font-inter"
            draggable="false"
        >
            <p className="font-semibold text-xl">Фильтры</p>
            <div className="grid gap-2">
                <Label className="font-light">
                    Название управляющей компании
                </Label>
                <Input
                    placeholder="Название управляющей компании"
                    value={filterValues.companyName}
                    onChange={(e) =>
                        updateFilterValues({ companyName: e.target.value })
                    }
                ></Input>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="object-type" className="font-light">
                    Тип объекта
                </Label>
                <Select
                    onValueChange={(value) =>
                        updateFilterValues({
                            objectType: value === "any" ? "" : value,
                        })
                    }
                    value={
                        filterValues.objectType
                            ? filterValues.objectType
                            : "any"
                    }
                    defaultValue="any"
                >
                    <SelectTrigger className="w-[100%]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                        className="w-[225px] h-[300px] leaflet-control"
                        id="object-type"
                    >
                        <SelectItem value="any">Любой</SelectItem>
                        {OBJECT_TYPES.map((type, index) => (
                            <SelectItem key={index} value={type}>
                                {type}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="is-net" className="font-light">
                    Является сетевым
                </Label>
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
                    <SelectContent className="leaflet-control" id="is-net">
                        <SelectItem value="undefined">Любой</SelectItem>
                        <SelectItem value="true">Да</SelectItem>
                        <SelectItem value="false">Нет</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex flex-col gap-2">
                <Label>Слои</Label>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="checkbox-bus-stops"
                        checked={activeLayers.busStops}
                        onCheckedChange={(value) =>
                            updateActiveLayers({ busStops: value as boolean })
                        }
                    />
                    <label
                        htmlFor="checkbox-bus-stops"
                        className="text-sm cursor-pointer font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Автобусные остановки
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="checkbox-rest"
                        checked={activeLayers.restaurants}
                        onCheckedChange={(value) =>
                            updateActiveLayers({
                                restaurants: value as boolean,
                            })
                        }
                    />
                    <label
                        htmlFor="checkbox-rest"
                        className="text-sm cursor-pointer font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        Рестораны
                    </label>
                </div>
            </div>

            <Button type="reset" variant="outline" onClick={handleReset}>
                Сбросить
            </Button>
        </div>
    );
}
