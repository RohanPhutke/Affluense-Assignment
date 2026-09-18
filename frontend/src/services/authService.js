const API_URL = import.meta.env.VITE_API_URL;
console.log("API_URL", API_URL);
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

  const data = response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || `Login failed (${response.status})`
    );
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

  const data = response.json();

  if (!response.ok) {
    throw new Error(
      data.error?.message || `Signup failed (${response.status})`
    );
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