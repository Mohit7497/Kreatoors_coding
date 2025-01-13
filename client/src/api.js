const API_BASE_URL = "http://localhost:5001";

export const registerUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const loginUser = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

export const fetchProfile = async (token) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "GET",
    headers: { Authorization: token },
  });
  return response.json();
};

export const updateProfile = async (userData, token) => {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return response.json();
};