import { createContext, useContext } from 'react';

export const PaginationContext = createContext({
    isMeasurementPass: false,
    pageIndex: -1, // -1 means "Show All" or "Measurement"
    itemMap: new Map(), // Item ID -> Page Index
});

export const usePaginationContext = () => useContext(PaginationContext);
