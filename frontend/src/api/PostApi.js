import { getUserToken } from "../helper/getToken";
import { API_URL } from "../config";

export async function postLost(formData) {
  let token = getUserToken();
  if (!token) {
    throw new Error("JWT token not found. Please log in again.");
  }

  let response = await fetch(`${API_URL}/post_lost`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  let result = await response.json();

  if (!response.ok) {
    throw new Error(`${result.detail}`);
  }

  return result;
}

export async function postFound(formData) {
  let token = getUserToken();
  if (!token) {
    throw new Error("JWT token not found. Please log in again.");
  }

  let response = await fetch(`${API_URL}/post_found`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  let result = await response.json();

  if (!response.ok) {
    throw new Error(`${result.detail}`);
  }

  return result;
}
