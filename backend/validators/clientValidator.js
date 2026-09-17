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

    const normalizedEmail = email.trim().toLowerCase();

    const normalizedPhone = phone.trim();

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

module.exports = {
    validateClient
};