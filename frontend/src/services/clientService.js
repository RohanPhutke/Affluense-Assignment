const API_URL = import.meta.env.VITE_API_URL;

const handleResponse = async (response, defaultMessage) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error?.message || `${defaultMessage} (${response.status})`
        );
    }

    return data;
};

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

    return handleResponse(
        response,
        "Failed to fetch clients"
    );
};

const createClient = async (clientData) => {
    const response = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify(clientData)
    });

    return handleResponse(
        response,
        "Failed to create client"
    );
};

const getClientById = async (clientId) => {
    const response = await fetch(
        `${API_URL}/clients/${clientId}`,
        {
            method: "GET",
            credentials: "include"
        }
    );

    return handleResponse(
        response,
        "Failed to fetch client"
    );
};

const updateClient = async (clientId, clientData) => {
    const response = await fetch(
        `${API_URL}/clients/${clientId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(clientData)
        }
    );

    return handleResponse(
        response,
        "Failed to update client"
    );
};


const deleteClient = async (clientId) => {
    const response = await fetch(
        `${API_URL}/clients/${clientId}`,
        {
            method: "DELETE",
            credentials: "include"
        }
    );

    if (!response.ok) {
        const data = await response.json();

        throw new Error(
            data.error?.message ||
            `Failed to delete client (${response.status})`
        );
    }
};



export default {
    getClients,
    createClient,
    getClientById,
    updateClient,
    deleteClient
};