export const PROPERTY_STATUS = {
    AVAILABLE: "Available",
    SOLD: "Sold",
    PENDING: "Pending",
    RESERVED: "Reserved",
    OFF_MARKET: "Off Market",
} as const;

export type PropertyStatus = typeof PROPERTY_STATUS[keyof typeof PROPERTY_STATUS];

export const PROPERTY_STATUS_OPTIONS = [
    { value: PROPERTY_STATUS.AVAILABLE, label: "Disponible" },
    { value: PROPERTY_STATUS.SOLD, label: "Vendida" },
    { value: PROPERTY_STATUS.PENDING, label: "Pendiente" },
    { value: PROPERTY_STATUS.RESERVED, label: "Reservada" },
    { value: PROPERTY_STATUS.OFF_MARKET, label: "Fuera del Mercado" },
] as const;

