const API_URL = import.meta.env.VITE_API_URL;

const getClients = async ({
    search = "",
    category = "",
    sort = "netWorth_desc",
    page = 1,
    limit = 25
}) => {
    const params = new URLSearchParams();

    if (search) {
        params.set("search", search);
    }

    if (category) {
        params.set("category", category);
    }

    params.set("sort", sort);
    params.set("page", page);
    params.set("limit", limit);

    const response = await fetch(
        `${API_URL}/clients?${params.toString()}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error?.message ||
            `Failed to fetch clients (${response.status})`
        );
    }

    return data;
};

export default {
    getClients
};