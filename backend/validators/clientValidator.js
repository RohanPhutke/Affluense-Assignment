const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validateClient = (data) => {
    const {
        name,
        email,
        phone,
        netWorth,
        category,
        primaryAssetClass,
        interests,
        onboardingDate
    } = data;

    if (
        name === undefined ||
        netWorth === undefined ||
        category === undefined ||
        primaryAssetClass === undefined ||
        interests === undefined ||
        onboardingDate === undefined
    ) {
        return "Missing required fields";
    }

    if (name.trim().length < 2 || name.trim().length > 100) {
        return "Name must be between 2 and 100 characters";
    }

    const normalizedEmail =
        typeof email === "string"
            ? email.trim().toLowerCase()
            : "";

    const normalizedPhone =
        typeof phone === "string"
            ? phone.trim()
            : "";

    if (!normalizedEmail && !normalizedPhone) {
        return "At least one of email or phone is required";
    }

    if (normalizedEmail) {
        if (normalizedEmail.length > 254 || !isValidEmail(normalizedEmail)) {
            return "Invalid email format";
        }
    }

    if (normalizedPhone && normalizedPhone.length > 15) {
        return "Phone number is too long";
    }

    if (netWorth < 0) {
        return "Net worth must be a non-negative number";
    }

    if (!["HNI", "UHNI"].includes(category)) {
        return "Category must be HNI or UHNI";
    }

    if (
        typeof primaryAssetClass !== "string" ||
        primaryAssetClass.trim().length === 0
    ) {
        return "Primary asset class is required";
    }

    if (!Array.isArray(interests)) {
        return "Interests must be an array";
    }

    for (const interest of interests) {
        if (interest.trim().length === 0) {
            return "Each interest must be a non-empty string";
        }
    }

    const date = new Date(onboardingDate);

    if (Number.isNaN(date.getTime())) {
        return "Invalid onboarding date";
    }

    return null;
};

const validateClientQuery = (query) => {
    const {search, category, sort, page, limit} = query;

    if (category !== undefined && !["HNI", "UHNI"].includes(category)) {
        return "Category must be HNI or UHNI";
    }

    const allowedSorts = [
        "netWorth_asc",
        "netWorth_desc"
    ];

    if (sort !== undefined && !allowedSorts.includes(sort)) {
        return "Invalid sort option";
    }

    if (page !== undefined) {
        const pageNumber = Number(page);

        if (!Number.isInteger(pageNumber) || pageNumber < 1) {
            return "Page must be a positive integer";
        }
    }

    if (limit !== undefined) {
        const limitNumber = Number(limit);

        if (!Number.isInteger(limitNumber) || limitNumber < 1 || limitNumber > 100) {
            return "Limit must be between 1 and 100";
        }
    }

    return null;

}

const validateClientUpdate = (data) => {
    const allowedFields = [
        "name",
        "email",
        "phone",
        "netWorth",
        "category",
        "primaryAssetClass",
        "interests",
        "onboardingDate"
    ];

    const providedFields = Object.keys(data);

    if (providedFields.length === 0) {
        return "At least one field is required";
    }

    for (const field of providedFields) {
        if (!allowedFields.includes(field)) {
            return `Field '${field}' cannot be updated`;
        }
    }

    if (data.name !== undefined) {
        if (
            data.name.trim().length < 2 ||
            data.name.trim().length > 100
        ) {
            return "Name must be between 2 and 100 characters";
        }
    }

    if (data.email !== undefined) {
        const email = data.email.trim().toLowerCase();

        if (email && (email.length > 254 || !isValidEmail(email))) {
            return "Invalid email format";
        }
    }

    if (data.phone !== undefined && data.phone.trim().length > 15) {
        return "Phone number is too long";
    }

    if (data.netWorth !== undefined) {
        if (
            !Number.isFinite(data.netWorth) ||
            data.netWorth < 0
        ) {
            return "Net worth must be a non-negative number";
        }
    }

    if (data.category !== undefined) {
        if (!["HNI", "UHNI"].includes(data.category)) {
            return "Category must be HNI or UHNI";
        }
    }

    if ( typeof primaryAssetClass !== "string" || data.primaryAssetClass !== undefined) {
        if (
            data.primaryAssetClass.trim().length === 0
        ) {
            return "Primary asset class is required";
        }
    }

    if (data.interests !== undefined) {
        if (!Array.isArray(data.interests)) {
            return "Interests must be an array";
        }

        for (const interest of data.interests) {
            if (
                interest.trim().length === 0
            ) {
                return "Each interest must be a non-empty string";
            }
        }
    }

    if (data.onboardingDate !== undefined) {
        const date = new Date(data.onboardingDate);

        if (Number.isNaN(date.getTime())) {
            return "Invalid onboarding date";
        }
    }

    return null;
};

module.exports = {
    validateClient,
    validateClientQuery,
    validateClientUpdate
};