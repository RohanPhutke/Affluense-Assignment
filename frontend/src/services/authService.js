const API_URL = import.meta.env.VITE_API_URL;

const login = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.error?.message || `Unable to login`
    );

    error.status = response.status;
    error.code = data.error?.code;

    throw error;
  }

  return data;
};

const signup = async (name, email, password, confirmPassword) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      name,
      email,
      password,
      confirmPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data.error?.message || `Unable to create account`
    );

    error.status = response.status;
    error.code = data.error?.code;

    throw error;
  }

  return data;
};

const logout = async () => {
    const response = await fetch(`${API_URL}/auth/logout`,{
        method : "POST",
        credentials : "include"
    });

    if(!response.ok){
        throw new Error(`Logout failed (${response.status})`);
    }
};

export default {
  login,
  signup,
  logout
};