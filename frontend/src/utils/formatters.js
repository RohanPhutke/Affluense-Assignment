export const formatNumber = (value) => {
    return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 2
    }).format(value);
};

export const formatNetWorth = (value) => {
    if (!Number.isFinite(value)) {
        return "₹0";
    }

    if (value >= 10000000) {
        return `₹${formatNumber(value / 10000000)} Cr`;
    }

    if (value >= 100000) {
        return `₹${formatNumber(value / 100000)} Lakh`;
    }

    if (value >= 1000) {
        return `₹${formatNumber(value / 1000)} Thousand`;
    }

    return `₹${formatNumber(value)}`;
};

export const formatDate = (value) => {
    return new Date(value).toLocaleDateString("en-IN");
};