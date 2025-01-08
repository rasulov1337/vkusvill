export interface Filter {
    companyName: string;
    objectType: string;
    isNet: boolean | undefined;
}

interface GeoData {
    coordinates: [number, number];
    type: "Point";
}

type BooleanAsString = "да" | "нет";

interface BusStopsCells {
    ID: number;
    Name: string;
    Longitude_WGS84: string;
    Latitude_WGS84: string;
    AdmArea: string;
    District: string;
    RouteNumbers: string;
    StationName: string;
    Direction: string;
    Pavilion: BooleanAsString;
    OperatingOrgName: string;
    EntryState: string;
    global_id: number;
    PlaceDescription: string;
    geoData: GeoData;
}

export interface BusStopsData {
    global_id: number;
    Number: number;
    Cells: BusStopsCells;
}

interface PublicPhone {
    is_deleted: number;
    PublicPhone: string;
    global_id: number;
}

interface Cells {
    ID: string;
    Name: string;
    global_id: number;
    IsNetObject: BooleanAsString;
    OperatingCompany: string;
    TypeObject: string;
    AdmArea: string;
    District: string;
    Address: string;
    PublicPhone: PublicPhone[];
    SeatsCount: number;
    SocialPrivileges: string;
    Longitude_WGS84: string;
    Latitude_WGS84: string;
    geoData: GeoData;
}

export interface RestaurantData {
    global_id: string;
    Number: number;
    Cells: Cells;
}

export interface ActiveLayers {
    busStops: boolean;
    restaurants: boolean;
}
