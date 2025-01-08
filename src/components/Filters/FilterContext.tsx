import * as Types from "@/Types";
import { createContext, ReactNode, useContext, useState } from "react";

interface FilterContextType {
    filterValues: Types.Filter;
    updateFilterValues?: (newValues: Partial<Types.Filter>) => void;
}

const FilterContext = createContext<FilterContextType>({
    filterValues: {
        companyName: "",
        objectType: "",
        isNet: false,
    },
});

export const FilterProvider = ({ children }: { children: ReactNode }) => {
    const [filterValues, setFilterValues] = useState<Types.Filter>({
        companyName: "",
        objectType: "",
        isNet: false,
    });

    const updateFilterValues = (newValues: Partial<Types.Filter>) => {
        setFilterValues((prevValues) => ({ ...prevValues, ...newValues }));
    };

    return (
        <FilterContext.Provider value={{ filterValues, updateFilterValues }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = () => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
};
