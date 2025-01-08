export interface Filter {
    companyName: string;
    objectType: string;
    isNet: boolean | undefined;
}

type GeoData = {
    coordinates: [number, number];
    type: "Point";
};

type BooleanAsString = "да" | "нет";

type BusStopsCells = {
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
};

export type BusStopsData = {
    global_id: number;
    Number: number;
    Cells: BusStopsCells;
};

type PublicPhone = {
    is_deleted: number;
    PublicPhone: string;
    global_id: number;
};

type Cells = {
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
};

export type RestaurantData = {
    global_id: string;
    Number: number;
    Cells: Cells;
};
