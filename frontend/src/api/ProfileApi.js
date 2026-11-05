import { getUserToken } from "../helper/getToken";
import { API_URL } from "../config";

export function getUserDetails() {
  const token = getUserToken();

  if (!token) {
    throw new Error("JWT token not found. Please log in again.");
  }

  return fetch(`${API_URL}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    let data = await res.json();

    if (!res.ok) {
      throw new Error(`${data.detail}`);
    }

    return data;
  });
}

export async function updateUserDetails(userData) {
  const token = getUserToken();

  if (!token) {
    throw new Error("JWT token not found. Please log in again.");
  }

  const res = await fetch(`${API_URL}/user/edit`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      Name: userData.name,
      Phone_Number: userData.phone_number,
      Email: userData.email,
      Code: userData.code,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const message = Array.isArray(data.detail)
      ? data.detail
          .map((error) => `${error.loc?.join(".")}: ${error.msg}`)
          .join("\n")
      : data.detail || "Failed to update profile";

    throw new Error(message);
  }

  return data;
}

export function getLostItems() {
  const token = getUserToken();

  if (!token) {
    throw new Error("JWT token not found. Please log in again.");
  }

  return fetch(`${API_URL}/user/lost-items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Failed to fetch lost items.");
    }

    return data;
  });
}

export function getFoundItems() {
  const token = getUserToken();

  if (!token) {
    throw new Error("JWT token not found. Please log in again.");
  }

  return fetch(`${API_URL}/user/found-items`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.detail || "Failed to fetch found items.");
    }

    return data;
  });
}
