const API_URL = import.meta.env.VITE_API_URL;

const getInsights = async () => {
    const response = await fetch(`${API_URL}/dashboard/insights`, {
        method : "GET",
        credentials : "include"
    });

    const data = await response.json();

    if(!response.ok){
        throw new Error(
            data.error?.message || `Failed to fetch insights (${response.status})`
        );
    }

    return data;
}

export default {
    getInsights
};